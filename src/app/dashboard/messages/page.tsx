"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Send, User, Mail } from "lucide-react";
import { sendMessage } from "@/app/actions/messaging";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

// Types
type Profile = {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: string;
};

type Conversation = {
    id: string;
    updated_at: string;
    participants: Profile[];
    last_message?: {
        content: string;
        created_at: string;
        sender_id: string;
    };
};

type Message = {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
};

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>}>
            <MessagesContent />
        </Suspense>
    );
}

function MessagesContent() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isLoadingConvs, setIsLoadingConvs] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, startTransition] = useTransition();

    const supabase = createClient();
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlConversationId = searchParams.get("id");
    // ... rest of the component logic ...


    // 1. Initial Load: User & Conversations
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setCurrentUser(user);

            // Fetch conversations
            // Note: This is a complex join. For MVP, we might do it in two steps or a view.
            // Simplified approach: Fetch my participants, then fetch details.

            // Actually, let's use a server action or API route for this complex fetch 
            // to keep client code clean? Or just client-side for now.
            // Let's try client-side relation fetching if possible, or simple RPC.
            // Since RLS is set, we can select from tables.

            const { data: parts, error } = await supabase
                .from("conversation_participants")
                .select(`
                    conversation_id,
                    conversations (
                        updated_at
                    )
                `)
                .eq("profile_id", user.id)
                .order("conversation_id", { ascending: false }); // ideally order by conversations.updated_at

            if (parts) {
                const convs: any[] = [];
                for (const p of parts) {
                    const convId = p.conversation_id;
                    // Fetch other participant
                    const { data: otherPart } = await supabase
                        .from("conversation_participants")
                        .select(`
                            profiles (id, full_name, avatar_url, role)
                        `)
                        .eq("conversation_id", convId)
                        .neq("profile_id", user.id)
                        .single();

                    // Fetch last message
                    const { data: lastMsg } = await supabase
                        .from("messages")
                        .select("content, created_at, sender_id")
                        .eq("conversation_id", convId)
                        .order("created_at", { ascending: false })
                        .limit(1)
                        .single();

                    if (otherPart?.profiles) {
                        // @ts-ignore
                        const conv: Conversation = {
                            id: convId,
                            // @ts-ignore
                            updated_at: p.conversations?.updated_at,
                            participants: [otherPart.profiles as any],
                            last_message: lastMsg || undefined
                        };
                        convs.push(conv);
                    }
                }

                // Sort by last message time or updated_at
                convs.sort((a, b) => {
                    const timeA = a.last_message?.created_at || a.updated_at;
                    const timeB = b.last_message?.created_at || b.updated_at;
                    return new Date(timeB).getTime() - new Date(timeA).getTime();
                });

                setConversations(convs);
            }
            setIsLoadingConvs(false);
        };

        init();
    }, []);

    // 2. Load Messages when active conversation changes
    useEffect(() => {
        if (urlConversationId) {
            setActiveConversationId(urlConversationId);
        } else if (conversations.length > 0 && !activeConversationId) {
            // Default to first
            setActiveConversationId(conversations[0].id);
        }
    }, [urlConversationId, conversations]);

    useEffect(() => {
        if (!activeConversationId) return;

        const fetchMessages = async () => {
            setIsLoadingMessages(true);
            const { data } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", activeConversationId)
                .order("created_at", { ascending: true });

            if (data) setMessages(data);
            setIsLoadingMessages(false);
        };

        fetchMessages();

        // Realtime Subscription
        const channel = supabase
            .channel(`conv_messages:${activeConversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversationId}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new as Message]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [activeConversationId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        // Optimistic update
        const tempId = Math.random().toString();
        const msg: Message = {
            id: tempId,
            content: newMessage,
            sender_id: currentUser.id,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, msg]);
        setNewMessage("");

        // Find pro ID (the other participant)
        const currentConv = conversations.find(c => c.id === activeConversationId);
        const proId = currentConv?.participants[0].id;

        if (!proId) return; // Should not happen

        startTransition(async () => {
            await sendMessage(proId, msg.content);
            // Realtime will handle the actual update, or we can replace the optimistic one
        });
    };

    const activeConvDetails = conversations.find(c => c.id === activeConversationId);
    const otherParticipant = activeConvDetails?.participants[0];

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm m-4 md:m-8">
            {/* Sidebar List */}
            <div className={`w-full md:w-80 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 ${activeConversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {isLoadingConvs ? (
                        <div className="p-4 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-zinc-400" /></div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-sm text-zinc-500">No conversations yet.</div>
                    ) : (
                        conversations.map((conv) => {
                            const other = conv.participants[0];
                            const isActive = conv.id === activeConversationId;
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => {
                                        setActiveConversationId(conv.id);
                                        // Update URL without refresh
                                        router.replace(`/dashboard/messages?id=${conv.id}`);
                                    }}
                                    className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${isActive ? 'bg-red-50 dark:bg-red-900/10 border-r-2 border-red-600' : ''}`}
                                >
                                    <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                        {other.avatar_url ? (
                                            <Image src={other.avatar_url} alt={other.full_name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-zinc-500">
                                                <User className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{other.full_name}</span>
                                            {conv.last_message && (
                                                <span className="text-xs text-zinc-400 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: false })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {conv.last_message?.content || "Start a conversation"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col min-w-0 ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                {activeConversationId && otherParticipant ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <button
                                className="md:hidden mr-2 text-zinc-500"
                                onClick={() => setActiveConversationId(null)}
                            >
                                ← Back
                            </button>
                            <div className="relative h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                {otherParticipant.avatar_url ? (
                                    <Image src={otherParticipant.avatar_url} alt={otherParticipant.full_name} fill className="object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-500">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{otherParticipant.full_name}</h3>
                                <p className="text-xs text-zinc-500 capitalize">{otherParticipant.role.replace('_', ' ')}</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50">
                            {isLoadingMessages ? (
                                <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-zinc-400" /></div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-zinc-400 py-10 text-sm">
                                    No messages yet. Say hi!
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === currentUser?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-lg px-4 py-2 text-sm shadow-sm ${isMe
                                                ? 'bg-red-600 text-white rounded-br-none'
                                                : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200 dark:border-zinc-700'
                                                }`}>
                                                <p>{msg.content}</p>
                                                <span className={`text-[10px] mt-1 block opacity-70 ${isMe ? 'text-red-100' : 'text-zinc-400'}`}>
                                                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-md border-0 py-2 pl-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-400 flex-col gap-2">
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Mail className="h-6 w-6" />
                        </div>
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}

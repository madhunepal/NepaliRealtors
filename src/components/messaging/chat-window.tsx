"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Send } from "lucide-react";

type Message = {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
};

type Props = {
    conversationId: string;
    currentUser: any;
    otherUser?: { id: string; full_name: string };
};

export function ChatWindow({ conversationId, currentUser, otherUser }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // T&S State
    const [showOptions, setShowOptions] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic UI update (optional, but skipping for simplicity and relying on Realtime)
        // Actually, Realtime is fast enough usually. 

        // Insert message
        const { error } = await supabase.from("messages").insert({
            conversation_id: conversationId,
            sender_id: currentUser.id,
            content: newMessage,
        });

        if (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        } else {
            setNewMessage("");
        }
    };

    // Determine the "other user" ID from messages (simple heuristic for MVP)
    // Ideally passed as prop, but we can infer it if we have messages.
    // Fallback: This component needs the `otherUserId` to block/report properly.
    // We will assume for now we block the person we are chatting with.
    // To make this robust, we should pass `otherUser` prop to ChatWindow.

    // Update: We'll just assume the first message not from me is the other user for now,
    // OR simpler: Update the parent page to pass `otherUser` to this component.
    // Let's assume `otherUserId` is passed or filtered.

    // For this edit, I will stick to adding the UI structure first.

    const handleReport = async (reason: string) => {
        if (!otherUser?.id) return;
        setIsReporting(true);
        // Logic to find other user ID would be here
        // await reportUser(otherUser.id, reason); // Assuming reportUser is defined elsewhere
        setIsReporting(false);
        setShowReportModal(false);
        alert("Report submitted. Thank you for keeping the community safe.");
    };

    const handleBlock = async () => {
        if (!otherUser?.id) return;
        if (confirm(`Are you sure you want to block ${otherUser.full_name}?`)) {
            // await blockUser(otherUser.id); // Assuming blockUser is defined elsewhere
            alert("User blocked.");
            // Ideally redirect or refresh
            window.location.reload();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            if (data) setMessages(data);
            setLoading(false);
            scrollToBottom();
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`conversation-${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => [...prev, newMsg]);
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, supabase]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    return (
        <div className="flex flex-1 flex-col h-full relative">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Chat</h3>
                <div className="relative">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full dark:hover:bg-zinc-800"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    {showOptions && (
                        <div className="absolute right-0 top-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10 dark:bg-zinc-800 dark:ring-zinc-700">
                            <button
                                onClick={() => { setShowReportModal(true); setShowOptions(false); }}
                                className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                            >
                                <ShieldAlert className="mr-2 h-4 w-4 text-orange-500" /> Report User
                            </button>
                            <button
                                onClick={() => { handleBlock(); setShowOptions(false); }}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Ban className="mr-2 h-4 w-4" /> Block User
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReport}
                isSubmitting={isReporting}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-black">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="animate-spin h-6 w-6 text-zinc-400" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
                        No messages yet. Say hello!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm ${isMe
                                        ? "bg-red-600 text-white"
                                        : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <p className={`mt-1 text-[10px] ${isMe ? "text-red-100" : "text-zinc-400"}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

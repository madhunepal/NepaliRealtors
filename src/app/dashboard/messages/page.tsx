import { createClient } from "@/lib/supabase/server";
import { ConversationList } from "@/components/messaging/conversation-list";
import { ChatWindow } from "@/components/messaging/chat-window";
import { redirect } from "next/navigation";

type Props = {
    searchParams: Promise<{ id?: string }>;
};

export default async function MessagesPage({ searchParams }: Props) {
    const params = await searchParams;
    const selectedId = params.id;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all conversations for the user
    const { data: conversations } = await supabase
        .from("conversation_participants")
        .select(`
      conversation_id,
      conversation:conversations (
        updated_at,
        participants:conversation_participants (
          profile:profiles (
            id,
            full_name,
            avatar_url,
            role
          )
        )
      )
    `)
        .eq("profile_id", user.id)
        .order("conversation(updated_at)", { ascending: false });

    // Format conversations for the UI
    // We need to filter out the current user from the participants list to show the "other person"
    const formattedConversations = conversations?.map((c: any) => {
        const otherParticipant = c.conversation.participants.find(
            (p: any) => p.profile.id !== user.id
        )?.profile;

        return {
            id: c.conversation_id,
            updatedAt: c.conversation.updated_at,
            otherUser: otherParticipant || { full_name: "Unknown User", avatar_url: null },
        };
    }) || [];

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
            {/* Sidebar - Conversation List */}
            <div className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-zinc-200 dark:border-zinc-800`}>
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Messages</h2>
                </div>
                <ConversationList
                    conversations={formattedConversations}
                    currentUserId={user.id}
                    selectedId={selectedId}
                />
            </div>

            {/* Main Chat Area */}
            <div className={`${!selectedId ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
                {selectedId ? (
                    <ChatWindow
                        conversationId={selectedId}
                        currentUser={user}
                        otherUser={formattedConversations.find((c: any) => c.id === selectedId)?.otherUser}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}

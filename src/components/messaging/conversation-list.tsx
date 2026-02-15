"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type Conversation = {
    id: string;
    updatedAt: string;
    otherUser: {
        full_name: string;
        avatar_url: string | null;
    };
};

type Props = {
    conversations: Conversation[];
    currentUserId: string;
    selectedId?: string;
};

export function ConversationList({ conversations, selectedId }: Props) {
    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-zinc-500">
                    No conversations yet.
                </div>
            ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {conversations.map((conversation) => (
                        <li key={conversation.id}>
                            <Link
                                href={`/dashboard/messages?id=${conversation.id}`}
                                className={cn(
                                    "block px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                                    selectedId === conversation.id && "bg-blue-50 dark:bg-zinc-900 border-l-4 border-blue-600"
                                )}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center">
                                            {conversation.otherUser.avatar_url ? (
                                                <img src={conversation.otherUser.avatar_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-zinc-500 font-bold">{conversation.otherUser.full_name?.charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {conversation.otherUser.full_name}
                                        </p>
                                        <p className="truncate text-xs text-zinc-500">
                                            {/* Last message preview could go here if fetched */}
                                            Click to view messages
                                        </p>
                                    </div>
                                    <div>
                                        <time dateTime={conversation.updatedAt} className="text-xs text-zinc-400">
                                            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                                        </time>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

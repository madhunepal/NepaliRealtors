"use client";

import { Loader2, Mail } from "lucide-react";
import { useTransition } from "react";
import { startConversation } from "@/app/actions/messaging";

export function MessageButton({ proId }: { proId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleMessage = () => {
        startTransition(async () => {
            await startConversation(proId);
        });
    };

    return (
        <button
            onClick={handleMessage}
            disabled={isPending}
            className="inline-flex justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-zinc-900 hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 disabled:opacity-50"
        >
            {isPending ? (
                <Loader2 className="-ml-0.5 mr-1.5 h-5 w-5 animate-spin" />
            ) : (
                <Mail className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            )}
            Message
        </button>
    );
}

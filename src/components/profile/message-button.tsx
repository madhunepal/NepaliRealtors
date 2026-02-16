"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { sendMessage } from "@/app/actions/messaging";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function MessageButton({ proId, proName }: { proId: string; proName: string }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSend = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        setError(null);

        try {
            const result = await sendMessage(proId, message);
            if (result.error) {
                if (result.error.includes("Login")) {
                    router.push("/login");
                    return;
                }
                setError(result.error);
            } else {
                setOpen(false);
                setMessage("");
                // Optional: Show success toast
                // router.push(`/dashboard/messages?id=${result.conversationId}`);
                console.log("Message sent!");
            }
        } catch (e) {
            setError("An unexpected error occurred.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="inline-flex justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-zinc-900 hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
                >
                    <Mail className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Message
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Contact {proName}</DialogTitle>
                    <DialogDescription>
                        Send a message to start the conversation.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi, I'm interested in..."
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                    />
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>
                <DialogFooter>
                    <button
                        onClick={handleSend}
                        disabled={isSending || !message.trim()}
                        className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                    >
                        {isSending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        Send Message
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

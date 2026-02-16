"use client";

import { useState, useTransition } from "react";
import { Flag, Ban, CheckCircle2 } from "lucide-react";
import { toggleBlock } from "@/app/actions/blocking";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface BlockButtonProps {
    targetUserId: string;
    targetUserName: string;
    initialIsBlocked: boolean;
}

export function BlockButton({ targetUserId, targetUserName, initialIsBlocked }: BlockButtonProps) {
    const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const handleToggleBlock = async () => {
        const newBlockedState = !isBlocked;

        startTransition(async () => {
            const result = await toggleBlock(targetUserId, newBlockedState);

            if (result.error) {
                toast.error(result.error);
            } else {
                setIsBlocked(newBlockedState);
                toast.success(newBlockedState ? `Blocked ${targetUserName}` : `Unblocked ${targetUserName}`);
                setOpen(false);
            }
        });
    };

    if (isBlocked) {
        return (
            <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                disabled={isPending}
                onClick={handleToggleBlock}
            >
                {isPending ? "Unblocking..." : "Unblock User"}
            </Button>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button className="flex items-center text-sm text-zinc-500 hover:text-red-600 transition-colors">
                    <Ban className="h-4 w-4 mr-1.5" />
                    Block User
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Block {targetUserName}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        They will not be able to message you. This action will not be notified to them.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleToggleBlock();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isPending}
                    >
                        {isPending ? "Blocking..." : "Block"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

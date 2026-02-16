"use client";

import { useState, useActionState, useEffect } from "react";
import { Flag } from "lucide-react";
import { submitReport, ReportState } from "@/app/actions/reporting";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const REASONS = [
    "Spam or unsolicited messaging",
    "Inappropriate content or behavior",
    "Fake profile or impersonation",
    "Scam or fraud attempt",
    "Other"
];

interface ReportButtonProps {
    targetUserId: string;
    targetUserName: string;
}

const initialState: ReportState = {};

export function ReportButton({ targetUserId, targetUserName }: ReportButtonProps) {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(submitReport, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setOpen(false);
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center text-sm text-zinc-500 hover:text-red-600 transition-colors">
                    <Flag className="h-4 w-4 mr-1.5" />
                    Report User
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report {targetUserName}</DialogTitle>
                    <DialogDescription>
                        Help us maintain a safe community. Your report will be reviewed by our team.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <input type="hidden" name="reportedId" value={targetUserId} />

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Select name="reason" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {REASONS.map((reason) => (
                                    <SelectItem key={reason} value={reason}>
                                        {reason}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="details">Additional Details</Label>
                        <Textarea
                            id="details"
                            name="details"
                            placeholder="Please provide specific examples..."
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
                            {isPending ? "Submitting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

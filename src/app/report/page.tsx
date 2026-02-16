"use client";

import { useActionState, useEffect } from "react";
import { submitGeneralReport, ReportState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const REASONS = [
    "Feedback / Feature Request",
    "Bug Report",
    "Inappropriate Content",
    "Legal / Privacy Concern",
    "Other"
];

const initialState: ReportState = {};

export default function ReportPage() {
    const [state, formAction, isPending] = useActionState(submitGeneralReport, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            // Optional: Reset form via key or just rely on toast
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    if (state.success) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4 dark:bg-green-900/20">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Thank You</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-md">
                    Your report has been submitted successfully. We appreciate your feedback and help in making MeroGharInUSA better.
                </p>
                <Button className="mt-8" variant="outline" onClick={() => window.location.reload()}>
                    Submit Another Report
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen px-6 py-24 lg:px-8 dark:bg-black">
            <div className="mx-auto max-w-xl">
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Report an Issue</h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Let us know about bugs, offensive content, or general feedback.
                    </p>
                </div>

                <form action={formAction} className="space-y-6 bg-zinc-50 p-8 rounded-xl border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Why are you reporting this?</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email (Optional)</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@example.com (so we can follow up)"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="details">Details</Label>
                        <Textarea
                            name="details"
                            id="details"
                            required
                            placeholder="Please provide specific details..."
                            className="min-h-[150px]"
                        />
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full bg-red-600 hover:bg-red-700 text-white">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Report"
                        )}
                    </Button>

                    <p className="text-xs text-center text-zinc-500 mt-4">
                        For emergencies, please contact local authorities. MeroGharInUSA is not a law enforcement agency.
                    </p>
                </form>
            </div>
        </div>
    );
}

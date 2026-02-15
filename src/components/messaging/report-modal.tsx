"use client";

import { useState } from "react";
import { Loader2, AlertTriangle, X } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => Promise<void>;
    isSubmitting: boolean;
};

export function ReportModal({ isOpen, onClose, onSubmit, isSubmitting }: Props) {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" /> Report User
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                    Please tell us why you are reporting this user. We review all reports within 24 hours.
                </p>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-red-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                    rows={4}
                    placeholder="Reason for reporting..."
                />

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(reason)}
                        disabled={!reason.trim() || isSubmitting}
                        className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
}

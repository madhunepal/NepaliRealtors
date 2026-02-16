"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error:", error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-black">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Something went wrong!</h2>
            <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
                An unexpected error occurred. Our team has been notified.
            </p>
            <div className="mt-6 flex gap-4">
                <Button onClick={() => reset()} variant="outline">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = "/"} className="bg-red-600 hover:bg-red-700 text-white">
                    Go Home
                </Button>
            </div>
        </div>
    );
}

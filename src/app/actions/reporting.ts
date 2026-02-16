"use server";

import { createClient } from "@/lib/supabase/server";

export type ReportState = {
    success?: boolean;
    error?: string;
    message?: string;
};

export async function submitReport(prevState: ReportState, formData: FormData): Promise<ReportState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to report a user." };
    }

    const reportedId = formData.get("reportedId") as string;
    const reason = formData.get("reason") as string;
    const details = formData.get("details") as string;

    if (!reportedId || !reason) {
        return { error: "Missing required fields." };
    }

    if (user.id === reportedId) {
        return { error: "You cannot report yourself." };
    }

    try {
        const { error } = await supabase
            .from("reports")
            .insert({
                reporter_id: user.id,
                reported_id: reportedId,
                reason: reason,
                details: details,
                status: 'pending'
            });

        if (error) {
            console.error("Error submitting report:", error);
            return { error: "Failed to submit report. Please try again." };
        }

        return { success: true, message: "Report submitted successfully. We will review it shortly." };

    } catch (err) {
        console.error("Unexpected error in submitReport:", err);
        return { error: "An unexpected error occurred." };
    }
}

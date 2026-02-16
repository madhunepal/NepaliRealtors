"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reportSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
    details: z.string().min(10, "Please provide more details"),
    email: z.string().email().optional().or(z.literal("")),
    turnstileToken: z.string().optional(), // For future captcha
});

export type ReportState = {
    success?: boolean;
    message?: string;
    error?: string;
};

export async function submitGeneralReport(prevState: ReportState, formData: FormData): Promise<ReportState> {
    try {
        const rawData = {
            reason: formData.get("reason"),
            details: formData.get("details"),
            email: formData.get("email"),
        };

        const validated = reportSchema.safeParse(rawData);

        if (!validated.success) {
            return { error: "Invalid input data. Please check your entries." };
        }

        const data = validated.data;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let error;

        // Construct details with email if provided
        let finalDetails = data.details;
        if (data.email) {
            finalDetails += `\n\n[Contact Email: ${data.email}]`;
        }

        if (user) {
            // Authenticated User: Use standard client (RLS allows insert)
            const { error: dbError } = await supabase.from("reports").insert({
                reporter_id: user.id,
                reason: data.reason,
                details: finalDetails,
                status: "pending",
            });
            error = dbError;
        } else {
            // Unauthenticated User: Use Admin Client to bypass RLS
            const adminSupabase = createAdminClient();
            const { error: dbError } = await adminSupabase.from("reports").insert({
                reporter_id: null, // Anonymous
                reason: data.reason,
                details: finalDetails,
                status: "pending",
            });
            error = dbError;
        }

        if (error) {
            console.error("Report submission error:", error);
            return { error: "Failed to submit report. Please try again later." };
        }

        return { success: true, message: "Report submitted successfully. We will review it shortly." };
    } catch (e) {
        console.error("Unexpected error:", e);
        return { error: "An unexpected error occurred." };
    }
}

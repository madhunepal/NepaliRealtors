"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateReportStatus(reportId: string, status: 'resolved' | 'dismissed') {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", reportId);

    if (error) {
        console.error("Error updating report status:", error);
        return { error: "Failed to update report status." };
    }

    revalidatePath("/admin/reports");
    revalidatePath("/admin");
    return { success: true };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function blockUser(userIdToBlock: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("blocks").insert({
        blocker_id: user.id,
        blocked_id: userIdToBlock,
    });

    if (error) {
        console.error("Block error", error);
        return { error: "Failed to block user" };
    }

    revalidatePath("/dashboard/messages");
    return { success: true };
}

export async function unblockUser(userIdToUnblock: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from("blocks")
        .delete()
        .match({ blocker_id: user.id, blocked_id: userIdToUnblock });

    if (error) {
        console.error("Unblock error", error);
        return { error: "Failed to unblock user" };
    }

    revalidatePath("/dashboard/messages");
    return { success: true };
}

export async function reportUser(
    reportedUserId: string,
    reason: string,
    messageId?: string
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_id: reportedUserId,
        message_id: messageId || null,
        reason: reason,
    });

    if (error) {
        console.error("Report error", error);
        return { error: "Failed to submit report" };
    }

    return { success: true };
}

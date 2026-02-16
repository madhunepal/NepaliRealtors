"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBlock(targetUserId: string, shouldBlock: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to block users." };
    }

    if (user.id === targetUserId) {
        return { error: "You cannot block yourself." };
    }

    try {
        if (shouldBlock) {
            // Create block
            const { error } = await supabase
                .from("blocks")
                .insert({
                    blocker_id: user.id,
                    blocked_id: targetUserId
                });

            if (error) {
                // Ignore unique constraint violation (already blocked)
                if (error.code === '23505') return { success: true };
                console.error("Error blocking user:", error);
                return { error: "Failed to block user" };
            }
        } else {
            // Remove block (Unblock)
            const { error } = await supabase
                .from("blocks")
                .delete()
                .match({
                    blocker_id: user.id,
                    blocked_id: targetUserId
                });

            if (error) {
                console.error("Error unblocking user:", error);
                return { error: "Failed to unblock user" };
            }
        }

        revalidatePath(`/pro/${targetUserId}`); // Revalidate profile page is tricky with slug, but we'll try standard path or just return success
        return { success: true };

    } catch (err) {
        console.error("Unexpected error in toggleBlock:", err);
        return { error: "An unexpected error occurred" };
    }
}

export async function checkIsBlocked(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from("blocks")
        .select("id")
        .eq("blocker_id", user.id)
        .eq("blocked_id", targetUserId)
        .single();

    return !!data;
}

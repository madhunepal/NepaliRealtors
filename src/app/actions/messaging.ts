"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendMessage(proId: string, content: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to send a message." };
    }

    if (user.id === proId) {
        return { error: "You cannot message yourself." };
    }

    // Check if recipient has blocked sender
    // We need admin client because normal users cannot see who blocked them
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();

    const { data: blockCheck } = await adminClient
        .from("blocks")
        .select("id")
        .eq("blocker_id", proId)
        .eq("blocked_id", user.id)
        .single();

    if (blockCheck) {
        return { error: "You cannot message this user." };
    }

    let conversationId: string | null = null;

    // 1. Check if conversation already exists
    // Optimization: For MVP, we'll search for a conversation where both match.
    // In a real app, this query might need to be more robust or use a function.

    // Get all conversations for current user
    const { data: myConvs } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("profile_id", user.id);

    if (myConvs && myConvs.length > 0) {
        const myConvIds = myConvs.map(c => c.conversation_id);

        // Check if pro is in any of these
        const { data: match } = await supabase
            .from("conversation_participants")
            .select("conversation_id")
            .eq("profile_id", proId)
            .in("conversation_id", myConvIds)
            .limit(1)
            .maybeSingle();

        if (match) {
            conversationId = match.conversation_id;
        }
    }

    // 2. Create new conversation if none exists
    if (!conversationId) {
        // Generate ID manually to avoid SELECT RLS issue (Chicken & Egg problem)
        const newId = crypto.randomUUID();

        const { error: createError } = await supabase
            .from("conversations")
            .insert({ id: newId });

        if (createError) {
            console.error("Failed to create conversation", createError);
            return { error: `Failed to create conversation: ${createError.message}` };
        }

        conversationId = newId;

        // 3. Add Participants
        const { error: partError } = await supabase
            .from("conversation_participants")
            .insert([
                { conversation_id: conversationId, profile_id: user.id },
                { conversation_id: conversationId, profile_id: proId },
            ]);

        if (partError) {
            console.error("Failed to add participants", partError);
            return { error: `Failed to join conversation: ${partError.message}` };
        }
    }

    // 4. Insert Message
    const { error: msgError } = await supabase
        .from("messages")
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content,
        });

    if (msgError) {
        console.error("Failed to send message", msgError);
        return { error: "Failed to send message" };
    }

    // revalidatePath(`/dashboard/messages`);
    return { success: true, conversationId };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function startConversation(proId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    if (user.id === proId) {
        return { error: "You cannot message yourself." };
    }

    // 1. Check if conversation already exists
    // We need to find a conversation where BOTH participants exist.
    // This simplistic query finds *any* conversation they share. 
    // For a strict 1-on-1, we'd group by conversation_id and count participants = 2.

    // Optimization: For MVP, we'll search for a conversation where both match.
    const { data: existingConversations, error: findError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("profile_id", user.id);

    if (existingConversations && existingConversations.length > 0) {
        const conversationIds = existingConversations.map(c => c.conversation_id);

        const { data: match } = await supabase
            .from("conversation_participants")
            .select("conversation_id")
            .eq("profile_id", proId)
            .in("conversation_id", conversationIds)
            .limit(1)
            .single();

        if (match) {
            redirect(`/dashboard/messages?id=${match.conversation_id}`);
        }
    }

    // 2. Create new conversation
    const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single();

    if (createError || !newConv) {
        console.error("Failed to create conversation", createError);
        return { error: "Failed to start conversation" };
    }

    // 3. Add Participants
    const { error: partError } = await supabase
        .from("conversation_participants")
        .insert([
            { conversation_id: newConv.id, profile_id: user.id },
            { conversation_id: newConv.id, profile_id: proId },
        ]);

    if (partError) {
        console.error("Failed to add participants", partError);
        return { error: "Failed to join conversation" };
    }

    redirect(`/dashboard/messages?id=${newConv.id}`);
}

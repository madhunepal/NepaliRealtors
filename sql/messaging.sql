-- Enable RLS (already enabled in schema.sql, but good to ensure)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. CONVERSATIONS POLICIES
-- Users can view conversations they are a participant in
CREATE POLICY "Users can view their own conversations"
ON public.conversations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = id
        AND profile_id = auth.uid()
    )
);

-- Users can create a new conversation (backend usually handles this, but allow auth users)
CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.role() = 'authenticated');


-- 2. PARTICIPANTS POLICIES
-- Users can view participants of conversations they belong to
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants as cp
        WHERE cp.conversation_id = conversation_participants.conversation_id
        AND cp.profile_id = auth.uid()
    )
);

-- Users can join/be added (simplified for MVP: allow insert if authenticated)
-- In a stricter app, we'd check if they are starting a chat with a valid Pro.
CREATE POLICY "Users can insert participants"
ON public.conversation_participants FOR INSERT
WITH CHECK (auth.role() = 'authenticated');


-- 3. MESSAGES POLICIES
-- Users can view messages in conversations they belong to
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
        AND profile_id = auth.uid()
    )
);

-- Users can insert messages if they are a participant
CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
        AND profile_id = auth.uid()
    )
    AND sender_id = auth.uid()
);

-- INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_participants_profile ON public.conversation_participants(profile_id);
CREATE INDEX IF NOT EXISTS idx_participants_conversation ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

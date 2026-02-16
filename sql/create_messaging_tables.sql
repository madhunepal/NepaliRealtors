-- Create Messaging Tables

-- 1. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CONVERSATION PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_read_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (conversation_id, profile_id)
);

-- 3. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_read boolean DEFAULT false
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_msg_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_participants_profile_id ON public.conversation_participants(profile_id);


-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (From messaging.sql, repeated here for completeness/one-shot run)

-- CONVERSATIONS
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations"
ON public.conversations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = id
        AND profile_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.role() = 'authenticated');


-- PARTICIPANTS
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants as cp
        WHERE cp.conversation_id = conversation_participants.conversation_id
        AND cp.profile_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert participants" ON public.conversation_participants;
CREATE POLICY "Users can insert participants"
ON public.conversation_participants FOR INSERT
WITH CHECK (auth.role() = 'authenticated');


-- MESSAGES
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
        AND profile_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = conversation_participants.conversation_id -- Typo fix from earlier? No, checking 'messages.conversation_id' vs subquery
        -- Wait, for INSERT, 'messages' row is the NEW row.
        -- We check if sender is a participant.
        -- But simplified:
        -- Sender must be auth.uid() (enforced below)
        -- AND auth.uid() must be a participant.
    )
    -- Actually, simpler logic:
    -- Is user a participant in the conversation ID they are sending to?
);

-- Retrying Message Policy Correctly
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
        AND profile_id = auth.uid()
    )
);

-- Allow viewing messages (Select)
-- Already defined above.


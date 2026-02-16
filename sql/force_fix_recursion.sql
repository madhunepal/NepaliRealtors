-- Force Fix Infinite Recursion in RLS Policies

BEGIN;

-- 1. DROP ALL EXISTING POLICIES on these tables to be clean
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can insert participants" ON public.conversation_participants;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;

-- 2. CREATE FUNCTION (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_participant(c_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Critical: Runs as owner, bypassing RLS
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.conversation_participants 
    WHERE conversation_id = c_id 
    AND profile_id = auth.uid()
  );
$$;

-- Ensure postgres owns it (standard in Supabase)
-- ALTER FUNCTION public.is_participant(uuid) OWNER TO postgres;
-- GRANT EXECUTE ON FUNCTION public.is_participant(uuid) TO authenticated;
-- GRANT EXECUTE ON FUNCTION public.is_participant(uuid) TO service_role;


-- 3. RE-APPLY POLICIES

-- Conversations
CREATE POLICY "Users can view their own conversations"
ON public.conversations FOR SELECT
USING (
    is_participant(id)
);

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Participants
-- Note: When inserting, we need to allow inserting for SELF + OTHERS
-- But simplified validation: Is user authenticated?
CREATE POLICY "Users can insert participants"
ON public.conversation_participants FOR INSERT
WITH CHECK (
   auth.role() = 'authenticated'
);

-- When viewing: I can see myself OR rows where I am a participant in that conversation
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants FOR SELECT
USING (
    profile_id = auth.uid() -- I can always see myself
    OR
    is_participant(conversation_id) -- I can see others if I am in the conversation
);


-- Messages
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (
    is_participant(conversation_id)
);

CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    sender_id = auth.uid()
    -- We can skip the participant check for INSERT if we trust the UI/Backend flow, 
    -- but for security, we keep it. The function 'is_participant' handles it safely.
    AND
    is_participant(conversation_id)
);

COMMIT;

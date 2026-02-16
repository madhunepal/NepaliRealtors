-- Fix Infinite Recursion in RLS Policies

-- The issue is that checking "am I a participant?" requires querying the 'conversation_participants' table,
-- which itself triggers the RLS policy, leading to an infinite loop.

-- SOLUTION:
-- Create a "Security Definer" function. This runs with the permissions of the database owner,
-- bypassing RLS on the table it queries. This allows us to check participation safely.

BEGIN;

-- 1. Create Helper Function (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_participant(c_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.conversation_participants 
    WHERE conversation_id = c_id 
    AND profile_id = auth.uid()
  );
$$;

-- 2. Update 'conversation_participants' Policy
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
USING (
    profile_id = auth.uid() -- I can always see myself
    OR
    is_participant(conversation_id) -- I can see others if I am in the conversation (uses function to avoid recursion)
);

-- 3. Update 'messages' Policy (just to be safe and cleaner)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;

CREATE POLICY "Users can view messages in their conversations"
ON public.messages
FOR SELECT
USING (
    is_participant(conversation_id)
);

DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;

CREATE POLICY "Users can send messages to their conversations"
ON public.messages
FOR INSERT
WITH CHECK (
    sender_id = auth.uid()
    AND
    is_participant(conversation_id)
);

COMMIT;

-- Create BLOCKS table if not exists
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- Enable RLS
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- 1. VIEW: Users can see who they have blocked
DROP POLICY IF EXISTS "Users can view their own blocks" ON public.blocks;
CREATE POLICY "Users can view their own blocks"
ON public.blocks FOR SELECT
USING (auth.uid() = blocker_id);

-- 2. INSERT: Users can block others
DROP POLICY IF EXISTS "Users can insert their own blocks" ON public.blocks;
CREATE POLICY "Users can insert their own blocks"
ON public.blocks FOR INSERT
WITH CHECK (auth.uid() = blocker_id);

-- 3. DELETE: Users can unblock (delete their own block records)
DROP POLICY IF EXISTS "Users can delete their own blocks" ON public.blocks;
CREATE POLICY "Users can delete their own blocks"
ON public.blocks FOR DELETE
USING (auth.uid() = blocker_id);

-- OPTIONAL: Enforce blocking in MESSAGES (users view logic)
-- This policy ensures users DO NOT receive/see messages from people they have blocked.
-- Note: This modifies the existing messages SELECT policy or acts as an additional filter.
-- Since policies are "OR" (permissive), we can't easily "subtract" with a new policy unless we modify the base one.
-- Instead, we will handle the "hiding" of messages in the application layer or a specific view/query for now to avoid breaking the existing complex policies.
-- BUT, we can prevent blocked users from STARTING conversations (INSERT policy on conversations).


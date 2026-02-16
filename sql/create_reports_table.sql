-- Create REPORTS table if not exists
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT, -- Optional extra context
    status TEXT CHECK (status IN ('pending', 'resolved', 'dismissed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- 1. INSERT: Authenticated users can create reports
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reporter_id);

-- 2. VIEW: Only admins can view reports (and maybe the reporter can view their own?)
-- For now, let's allow reporters to view their own for history, and admins to view all.
-- We'll just stick to "Reporter sees their own" for safety.
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
USING (auth.uid() = reporter_id);

-- Note: Admins functionality usually bypasses RLS via service role or has a specific policy.
-- If we want a frontend admin panel using standard client, we'd need an admin policy:
-- CREATE POLICY "Admins can view all reports" ON public.reports FOR SELECT USING ( ... admin check ... );
-- For MVP, we'll assume admin access via Supabase dashboard or service role/admin client.

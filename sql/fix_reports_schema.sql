-- Fix Reports Table Schema

-- 1. Add 'details' column if it doesn't exist
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS details TEXT;

-- 2. Grant permissions just in case
GRANT ALL ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;

-- 3. Re-apply RLS Policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
USING (auth.uid() = reporter_id);

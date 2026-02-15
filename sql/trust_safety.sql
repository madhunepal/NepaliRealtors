-- BLOCKS POLICIES
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Users can view who they have blocked
CREATE POLICY "Users can view their own blocks"
ON public.blocks FOR SELECT
USING (blocker_id = auth.uid());

-- Users can block others
CREATE POLICY "Users can block others"
ON public.blocks FOR INSERT
WITH CHECK (blocker_id = auth.uid());

-- Users can unblock (delete)
CREATE POLICY "Users can unblock"
ON public.blocks FOR DELETE
USING (blocker_id = auth.uid());


-- REPORTS POLICIES
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
WITH CHECK (reporter_id = auth.uid());

-- Only admins should view/update reports (future Admin Dashboard)
-- For now, maybe allow users to see their own reports status?
CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
USING (reporter_id = auth.uid());

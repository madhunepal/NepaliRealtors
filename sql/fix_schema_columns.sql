-- Comprehensive Schema Fix
-- Run this in your Supabase SQL Editor to fix the "column not found" error.

BEGIN;

-- 1. Ensure columns exist
ALTER TABLE public.professional_details 
ADD COLUMN IF NOT EXISTS is_email_public BOOLEAN DEFAULT FALSE;

ALTER TABLE public.professional_details 
ADD COLUMN IF NOT EXISTS is_phone_public BOOLEAN DEFAULT FALSE;

ALTER TABLE public.professional_details 
ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}';

-- 2. Grant permissions (just in case)
GRANT ALL ON TABLE public.professional_details TO authenticated;
GRANT ALL ON TABLE public.professional_details TO service_role;

-- 3. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

COMMIT;

-- Fix Role Constraint Violation
-- The 'profiles' table has a restriction (CONSTRAINT) that forces the 'role' column 
-- to be one of a few specific values (probably 'realtor', 'user', etc.).
-- We need to remove this restriction so we can save composite roles like "Realtor & Loan Officer".

BEGIN;

-- 1. Drop the restrictive check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Optional: Add a text check instead if you still want to ensure it's not empty, 
-- but for now, removing it is safest for flexibility.

COMMIT;

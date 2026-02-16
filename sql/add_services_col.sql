-- Add services column to professional_details for multi-role support
-- This allows a pro to be multiple things (e.g. ['Realtor', 'Loan Officer'])

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_details' AND column_name = 'services') THEN
        ALTER TABLE professional_details ADD COLUMN services TEXT[] DEFAULT '{}';
    END IF;
END $$;

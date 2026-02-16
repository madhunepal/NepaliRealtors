-- Migration to add privacy controls for email and phone

-- Add is_email_public and is_phone_public columns to professional_details if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_details' AND column_name = 'is_email_public') THEN
        ALTER TABLE professional_details ADD COLUMN is_email_public BOOLEAN DEFAULT FALSE;
    END IF;

    -- Ensure is_phone_public exists (it should, but good to be safe)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_details' AND column_name = 'is_phone_public') THEN
        ALTER TABLE professional_details ADD COLUMN is_phone_public BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

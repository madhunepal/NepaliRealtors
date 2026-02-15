-- 0. Insert Dummy Users into auth.users (to satisfy Foreign Key constraint)
INSERT INTO auth.users (id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'ramesh@example.com', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'sita@example.com', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'hari@example.com', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'build-nepal@example.com', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'test-customer@example.com', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 1. Enable RLS (if not already)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_details ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies for Public Read Access
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public professional details are viewable by everyone" ON public.professional_details FOR SELECT USING (true);
-- Fix: Prevent duplicate policies if running multiple times (Postgres doesn't support IF NOT EXISTS for policies easily without a function, so just ignore errors if they exist)

-- 3. Insert Dummy Profiles (Using fixed UUIDs for reproducibility)
INSERT INTO public.profiles (id, email, slug, full_name, role, is_verified, avatar_url)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'ramesh@example.com', 'ramesh-shrestha-realtor', 'Ramesh Shrestha', 'realtor', true, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256'),
    ('00000000-0000-0000-0000-000000000002', 'sita@example.com', 'sita-gurung-loans', 'Sita Gurung', 'loan_officer', true, 'https://images.unsplash.com/photo-1573496359-136d475583dc?auto=format&fit=crop&w=256&h=256'),
    ('00000000-0000-0000-0000-000000000003', 'hari@example.com', 'hari-thapa-inspector', 'Hari Thapa', 'inspector', false, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256'),
    ('00000000-0000-0000-0000-000000000004', 'build-nepal@example.com', 'build-nepal-construct', 'Build Nepal Construction', 'builder', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256'),
    ('00000000-0000-0000-0000-000000000005', 'test-customer@example.com', 'test-customer', 'Test Customer', 'customer', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Professional Details
INSERT INTO public.professional_details (id, bio, city, state, zip_code, service_radius_miles, license_number, phone, is_phone_public, website, languages)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Experienced Realtor serving the Nepali community in DFW for over 10 years. I specialize in first-time home buyers.', 'Irving', 'TX', '75038', 50, 'TXT-123456', '214-555-0101', true, 'https://rameshrealty.com', ARRAY['English', 'Nepali']),
    ('00000000-0000-0000-0000-000000000002', 'Helping you get the best rates for your dream home. NMLS #987654.', 'Euless', 'TX', '76039', 100, 'NMLS-987654', '817-555-0102', true, NULL, ARRAY['English', 'Nepali', 'Hindi']),
    ('00000000-0000-0000-0000-000000000003', 'Certified Home Inspector. I check every corner so you don’t have to.', 'Fort Worth', 'TX', '76101', 30, 'TREC-555', '817-555-0103', false, 'https://harichecks.com', ARRAY['English', 'Nepali']),
    ('00000000-0000-0000-0000-000000000004', 'Custom home builder specializing in modern designs with traditional touches.', 'Dallas', 'TX', '75201', 50, NULL, '214-555-0104', true, NULL, ARRAY['English', 'Nepali'])
ON CONFLICT (id) DO NOTHING;

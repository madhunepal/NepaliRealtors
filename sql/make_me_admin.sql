-- Replace 'your_email@example.com' with your actual email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your_email@example.com';

-- Verify the change
SELECT * FROM public.profiles WHERE role = 'admin';

-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, slug)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    -- Generate a temporary slug (can be updated later)
    LOWER(REPLACE(new.raw_user_meta_data->>'full_name', ' ', '-')) || '-' || FLOOR(RANDOM() * 1000)::text
  );
  
  -- Also initialize professional_details if not a customer
  IF (new.raw_user_meta_data->>'role' <> 'customer') THEN
      INSERT INTO public.professional_details (id) VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

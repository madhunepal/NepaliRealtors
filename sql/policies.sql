-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to insert their own professional details
CREATE POLICY "Users can insert their own professional details" 
ON public.professional_details FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own professional details
CREATE POLICY "Users can update their own professional details" 
ON public.professional_details FOR UPDATE 
USING (auth.uid() = id);

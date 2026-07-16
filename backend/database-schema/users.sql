-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    mobile TEXT,
    dob DATE,
    gender TEXT,
    preferred_language TEXT,
    state TEXT,
    qualification TEXT,
    attempt TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create profile function and trigger for automatic creation on sign up
-- Note: When signing up from the frontend, we pass raw_user_meta_data to Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        mobile,
        dob,
        gender,
        preferred_language,
        state,
        qualification,
        attempt,
        is_admin
    )
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        new.raw_user_meta_data->>'mobile',
        (new.raw_user_meta_data->>'dob')::DATE,
        new.raw_user_meta_data->>'gender',
        new.raw_user_meta_data->>'preferred_language',
        new.raw_user_meta_data->>'state',
        new.raw_user_meta_data->>'qualification',
        new.raw_user_meta_data->>'attempt',
        COALESCE((new.raw_user_meta_data->>'is_admin')::BOOLEAN, false)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

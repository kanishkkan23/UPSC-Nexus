-- Create download_history table
CREATE TABLE public.download_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    resource_id UUID NOT NULL,
    resource_type TEXT NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own download history" ON public.download_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log their own downloads" ON public.download_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all download histories" ON public.download_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

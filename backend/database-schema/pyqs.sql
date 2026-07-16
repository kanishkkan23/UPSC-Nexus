-- Create pyqs table
CREATE TABLE public.pyqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    subject TEXT NOT NULL,
    paper_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id)
);

-- Enable Row Level Security
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "PYQs are viewable by everyone" ON public.pyqs
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert PYQs" ON public.pyqs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can update PYQs" ON public.pyqs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can delete PYQs" ON public.pyqs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

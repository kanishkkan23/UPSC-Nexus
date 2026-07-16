-- Create current_affairs table
CREATE TABLE public.current_affairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_summary TEXT,
    category TEXT NOT NULL,
    article_url TEXT,
    published_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id)
);

-- Enable Row Level Security
ALTER TABLE public.current_affairs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Current affairs are viewable by everyone" ON public.current_affairs
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert current affairs" ON public.current_affairs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can update current affairs" ON public.current_affairs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can delete current affairs" ON public.current_affairs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

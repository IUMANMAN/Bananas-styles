-- Create guides table
CREATE TABLE IF NOT EXISTS public.guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    introduction TEXT,
    url TEXT NOT NULL,
    author TEXT,
    publish_date DATE DEFAULT CURRENT_DATE,
    ch_title TEXT,
    ch_introduction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read guides
CREATE POLICY "Public can view guides" ON public.guides
    FOR SELECT
    USING (true);

-- Only service role (and potentially authenticated admins if configured) can insert/update/delete
-- For now, we'll allow service role or specific admin handling via app logic, 
-- but strictly speaking Supabase Auth integration for 'admin' role isn't fully set up on DB level 
-- beyond basic auth.uid checks. We often handle admin checks in App Router actions.
-- But for direct DB access security:
CREATE POLICY "Service role can manage guides" ON public.guides
    FOR ALL
    USING ( auth.role() = 'service_role' );

-- Optional: Allow authenticated users to view (redundant with public selection but good for clarity)
-- We'll stick to Public read.

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';

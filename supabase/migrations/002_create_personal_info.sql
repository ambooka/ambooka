-- Create personal_info table if it doesn't exist
-- This table is referenced by other migrations and components

CREATE TABLE IF NOT EXISTS public.personal_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to personal_info"
    ON public.personal_info FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access to personal_info"
    ON public.personal_info FOR ALL
    USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personal_info_updated_at
    BEFORE UPDATE ON public.personal_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

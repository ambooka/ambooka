-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create page_views table for analytics
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path TEXT NOT NULL,
    referer TEXT,
    user_agent TEXT,
    ip_address TEXT, -- Optional, consider privacy
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated full access to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public insert to page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated read access to page_views" ON public.page_views;

-- Policies for contact_messages
CREATE POLICY "Allow public insert to contact_messages"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to contact_messages"
    ON public.contact_messages FOR ALL
    USING (auth.role() = 'authenticated');

-- Policies for page_views
CREATE POLICY "Allow public insert to page_views"
    ON public.page_views FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read access to page_views"
    ON public.page_views FOR SELECT
    USING (auth.role() = 'authenticated');

-- Trigger for updated_at in contact_messages
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

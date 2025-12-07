-- Migration: 003_cms_tables.sql
-- Description: Create tables for full CMS functionality
-- Created: 2025-12-07

-- ============================================
-- ABOUT CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS about_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE, -- 'about_text', 'expertise_1', 'expertise_2', etc.
    title TEXT,
    content TEXT NOT NULL,
    icon TEXT, -- Icon name from lucide-react
    badge TEXT, -- 'expert', 'advanced', 'intermediate'
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read access on about_content"
    ON about_content FOR SELECT
    USING (true);

-- Authenticated users can modify
CREATE POLICY "Allow authenticated users to modify about_content"
    ON about_content FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    avatar_url TEXT,
    text TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read access on testimonials"
    ON testimonials FOR SELECT
    USING (is_active = true);

-- Authenticated users can modify
CREATE POLICY "Allow authenticated users to modify testimonials"
    ON testimonials FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================
-- TECHNOLOGIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    category TEXT DEFAULT 'general', -- 'language', 'framework', 'tool', 'cloud', etc.
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read access on technologies"
    ON technologies FOR SELECT
    USING (is_active = true);

-- Authenticated users can modify
CREATE POLICY "Allow authenticated users to modify technologies"
    ON technologies FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES personal_info(id),
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read policy (only published posts)
CREATE POLICY "Allow public read access on published blog_posts"
    ON blog_posts FOR SELECT
    USING (is_published = true);

-- Authenticated users can modify
CREATE POLICY "Allow authenticated users to modify blog_posts"
    ON blog_posts FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================
-- SOCIAL LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- 'github', 'linkedin', 'twitter', etc.
    url TEXT NOT NULL,
    icon_url TEXT, -- CDN URL for the icon
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    show_in_sidebar BOOLEAN DEFAULT true,
    show_in_contact BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read access on social_links"
    ON social_links FOR SELECT
    USING (is_active = true);

-- Authenticated users can modify
CREATE POLICY "Allow authenticated users to modify social_links"
    ON social_links FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================
-- EXTEND PERSONAL_INFO TABLE
-- ============================================
-- Add birthday and summary fields if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'personal_info' AND column_name = 'birthday') THEN
        ALTER TABLE personal_info ADD COLUMN birthday DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'personal_info' AND column_name = 'about_text') THEN
        ALTER TABLE personal_info ADD COLUMN about_text TEXT;
    END IF;
END $$;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all new tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['about_content', 'testimonials', 'technologies', 'blog_posts', 'social_links']
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_' || t || '_updated_at'
        ) THEN
            EXECUTE format('
                CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column()
            ', t, t);
        END IF;
    END LOOP;
END $$;

-- ============================================
-- SEED DATA (Optional - can be removed)
-- ============================================

-- Insert default about text
INSERT INTO about_content (section_key, title, content, display_order)
VALUES (
    'about_text',
    'About Me',
    'I''m an experienced software engineer specializing in Artificial Intelligence, full-stack development, and network infrastructure. With a strong foundation in Computer Science from Maseno University, I build intelligent, scalable systems that transform complex challenges into elegant, efficient solutions. My expertise spans machine learning, cloud architecture, and enterprise software development.',
    0
) ON CONFLICT (section_key) DO NOTHING;

-- Insert expertise areas
INSERT INTO about_content (section_key, title, content, icon, badge, display_order)
VALUES
    ('expertise_1', 'AI & Machine Learning', 'Developing intelligent systems using neural networks, computer vision, and natural language processing.', 'Brain', 'expert', 1),
    ('expertise_2', 'Software Engineering', 'Building scalable applications with modern frameworks, clean architecture, and best practices.', 'Code', 'expert', 2),
    ('expertise_3', 'Robotics & Automation', 'Programming autonomous systems, sensor integration, and motion planning algorithms.', 'Bot', 'advanced', 3),
    ('expertise_4', 'Cloud Computing & DevOps', 'Building and automating scalable cloud environments to streamline deployment, improve reliability, and optimize performance.', 'Cloud', 'advanced', 4)
ON CONFLICT (section_key) DO NOTHING;

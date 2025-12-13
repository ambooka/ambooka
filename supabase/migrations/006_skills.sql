-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Languages', 'Frameworks', 'Tools', 'Cloud', 'Databases', 'Other')),
    icon_url TEXT,
    proficiency INTEGER DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to skills"
    ON public.skills FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access to skills"
    ON public.skills FOR ALL
    USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed Data
INSERT INTO public.skills (name, category, display_order) VALUES
('Python', 'Languages', 1),
('Go', 'Languages', 2),
('TypeScript', 'Languages', 3),
('PyTorch', 'Frameworks', 1),
('TensorFlow', 'Frameworks', 2),
('Kubernetes', 'Cloud', 1),
('AWS', 'Cloud', 2),
('Docker', 'Tools', 1),
('Terraform', 'Tools', 2);

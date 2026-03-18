-- Create Roadmap Phases Table
CREATE TABLE IF NOT EXISTS public.roadmap_phases (
    phase_number INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    duration_months INTEGER,
    experience_label TEXT,
    start_date_label TEXT,
    target_role TEXT,
    status TEXT CHECK (status IN ('completed', 'in_progress', 'upcoming')) DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;

-- Create Public Read Access Policy
DROP POLICY IF EXISTS "Allow public read access" ON public.roadmap_phases;
CREATE POLICY "Allow public read access" ON public.roadmap_phases
    FOR SELECT TO public USING (true);

-- Create Admin Management Policy
DROP POLICY IF EXISTS "Allow authenticated users to manage phases" ON public.roadmap_phases;
CREATE POLICY "Allow authenticated users to manage phases" ON public.roadmap_phases
    FOR ALL TO authenticated USING (true);

-- Create Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    phase_number INTEGER REFERENCES public.roadmap_phases(phase_number) ON DELETE CASCADE,
    is_obtained BOOLEAN DEFAULT false,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create Public Read Access Policy
DROP POLICY IF EXISTS "Allow public read access" ON public.certifications;
CREATE POLICY "Allow public read access" ON public.certifications
    FOR SELECT TO public USING (true);

-- Create Admin Management Policy
DROP POLICY IF EXISTS "Allow authenticated users to manage certs" ON public.certifications;
CREATE POLICY "Allow authenticated users to manage certs" ON public.certifications
    FOR ALL TO authenticated USING (true);

-- Seed Roadmap Phases
INSERT INTO public.roadmap_phases (phase_number, title, duration_months, experience_label, start_date_label, target_role, status)
VALUES 
(1, 'Software Engineering', 5, '3 Yrs Exp', 'Started 2023', 'Full-Stack', 'completed'),
(2, 'Mobile + Full-Stack', 5, '3 Yrs Exp', 'Started 2023', 'Senior Dev', 'completed'),
(3, 'Cloud & DevOps', 6, '1 Yr Exp', 'Started 2025', 'DevOps', 'in_progress'),
(4, 'Data Engineering', 4, '0 Yrs Exp', 'Starting 2026', 'Data Eng', 'upcoming'),
(5, 'K8s & Platform', 6, '0 Yrs Exp', 'Starting 2027', 'Platform', 'upcoming'),
(6, 'Machine Learning', 6, '0 Yrs Exp', 'Starting 2027', 'ML Eng', 'upcoming'),
(7, 'LLMOps', 3, '0 Yrs Exp', 'Starting 2027', NULL, 'upcoming'),
(8, 'MLOps Systems', 5, '0 Yrs Exp', 'Starting 2028', 'MLOps', 'upcoming')
ON CONFLICT (phase_number) DO UPDATE SET
    title = EXCLUDED.title,
    duration_months = EXCLUDED.duration_months,
    experience_label = EXCLUDED.experience_label,
    start_date_label = EXCLUDED.start_date_label,
    target_role = EXCLUDED.target_role,
    status = EXCLUDED.status;

-- Seed Certifications with official hexagonal badges from stable mirrors
INSERT INTO public.certifications (name, phase_number, is_obtained, icon_url)
VALUES 
('B.Sc. Computer Science', 1, true, NULL),
('AWS SAA', 3, false, 'https://raw.githubusercontent.com/dandat/AWS-Certified-Solutions-Architect-Associate/master/badge.png'),
('Terraform', 3, false, 'https://raw.githubusercontent.com/hashicorp/terraform/master/website/public/img/docs/certification-badge-associate.png'),
('Databricks', 4, false, 'https://www.databricks.com/wp-content/uploads/2021/05/data-engineer-associate-badge.png'),
('CKA', 5, false, 'https://raw.githubusercontent.com/cncf/artwork/master/other/certified-kubernetes-administrator/certified-kubernetes-administrator-color.png'),
('CKAD', 5, false, 'https://raw.githubusercontent.com/cncf/artwork/master/other/certified-kubernetes-application-developer/certified-kubernetes-application-developer-color.png'),
('AWS MLS', 6, false, 'https://raw.githubusercontent.com/qi-qi/aws-certified-machine-learning-specialty/master/aws-certified-machine-learning-specialty-digital-badge.png'),
('GCP ML', 8, false, 'https://www.gstatic.com/images/branding/product/2x/google_cloud_64dp.png') 
ON CONFLICT (name) DO UPDATE SET
    phase_number = EXCLUDED.phase_number,
    is_obtained = EXCLUDED.is_obtained,
    icon_url = EXCLUDED.icon_url;

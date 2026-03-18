-- Re-runnable migration: Drops and recreates tables to ensure schema matches

-- Drop tables if they exist to fix schema mismatches (e.g. missing 'title' column)
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.kpi_stats CASCADE;

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    stack TEXT[] DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('Deployed', 'WIP', 'Research', 'Stable', 'Monitored', 'Completed', 'Archived')),
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create kpi_stats table
CREATE TABLE public.kpi_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT, -- Lucide icon name
    color TEXT, -- e.g., 'bg-[#2a2a2a] text-white'
    type TEXT DEFAULT 'solid' CHECK (type IN ('solid', 'striped', 'outline')),
    section TEXT DEFAULT 'hero' CHECK (section IN ('hero', 'header')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Allow public read access to projects"
    ON public.projects FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access to projects"
    ON public.projects FOR ALL
    USING (auth.role() = 'authenticated');

-- Create policies for kpi_stats
CREATE POLICY "Allow public read access to kpi_stats"
    ON public.kpi_stats FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access to kpi_stats"
    ON public.kpi_stats FOR ALL
    USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpi_stats_updated_at
    BEFORE UPDATE ON public.kpi_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed data for KPI Stats
INSERT INTO public.kpi_stats (label, value, color, type, section, display_order) VALUES
('AWS Certifications', '3', 'bg-[#2a2a2a] text-white', 'solid', 'hero', 1),
('EKS Clusters Managed', '7', 'bg-[#facc15] text-[#2a2a2a]', 'solid', 'hero', 2),
('Core Stack', 'K8s/Python/Terraform', '', 'striped', 'hero', 3),
('99.9% Uptime', 'Model Stability', '', 'outline', 'hero', 4),
('Microservices', '70+', '', 'solid', 'header', 1),
('Terraform Lines', '10K+', '', 'solid', 'header', 2),
('Deployments / Mo', '52', '', 'solid', 'header', 3);

-- Seed data for Projects
INSERT INTO public.projects (title, description, stack, status, is_featured, display_order) VALUES
('LLM API & RAG Microservice', 'Scalable RAG system', ARRAY['LangChain', 'KServe', 'PyTorch', 'Pinecone'], 'Monitored', true, 1),
('Terraform Multi-Cloud MLOps CI/CD', 'Automated infrastructure provisioning', ARRAY['Terraform', 'ArgoCD', 'Git', 'AWS EKS/GKE'], 'Stable', true, 2),
('Real-Time Streaming Feature Store', 'Low latency feature retrieval', ARRAY['Feast', 'Kafka', 'GoLang', 'Redis'], 'Deployed', true, 3),
('DevSecOps Policy as Code Platform', 'Security compliance automation', ARRAY['OPA', 'Vault', 'Kubeflow', 'Python'], 'WIP', true, 4);

-- Migration: 007_seed_career_roadmap.sql
-- Description: Seed the database with best-in-class MLOps Architect Career Roadmap data
-- This script fixes schema drift AND sanitizes existing data before applying constraints.

BEGIN;

-- 1. Fix Schema Drift: Convert 'category' from ENUM to TEXT
ALTER TABLE public.skills ALTER COLUMN category DROP DEFAULT;

-- Convert column to TEXT
ALTER TABLE public.skills 
    ALTER COLUMN category TYPE TEXT USING category::TEXT;

-- Drop the rogue enum type if it exists
DROP TYPE IF EXISTS skill_category CASCADE;

-- 2. Data Sanitization (CRITICAL STEP)
-- Update any existing rows that don't match our valid categories to 'Other'
-- This prevents the "check constraint violation" error.
UPDATE public.skills 
SET category = 'Other'
WHERE category NOT IN ('Languages', 'Frameworks', 'Tools', 'Cloud', 'Databases', 'Other');

-- 3. Apply Constraints
ALTER TABLE public.skills DROP CONSTRAINT IF EXISTS skills_category_check;
ALTER TABLE public.skills 
    ADD CONSTRAINT skills_category_check 
    CHECK (category IN ('Languages', 'Frameworks', 'Tools', 'Cloud', 'Databases', 'Other'));

-- Ensure other columns exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'proficiency') THEN
        ALTER TABLE public.skills ADD COLUMN proficiency INTEGER DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'is_featured') THEN
        ALTER TABLE public.skills ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 4. Seed Skills (Upsert)
INSERT INTO public.skills (name, category, proficiency, display_order, is_featured) VALUES
-- Languages
('Python', 'Languages', 90, 1, true),
('SQL', 'Languages', 85, 2, true),
('Bash', 'Languages', 75, 3, false),
('Go', 'Languages', 40, 4, false),
('TypeScript', 'Languages', 60, 5, false),

-- Frameworks
('PyTorch', 'Frameworks', 80, 1, true),
('TensorFlow', 'Frameworks', 70, 2, false),
('Scikit-learn', 'Frameworks', 85, 3, false),
('LangChain', 'Frameworks', 75, 4, true),
('FastAPI', 'Frameworks', 80, 5, true),

-- Cloud
('AWS (EKS, SageMaker)', 'Cloud', 80, 1, true),
('GCP (GKE, Vertex AI)', 'Cloud', 75, 2, true),
('Kubernetes', 'Cloud', 85, 3, true),
('Docker', 'Cloud', 90, 4, true),
('Terraform', 'Cloud', 70, 5, true),

-- Tools
('Git & GitHub Actions', 'Tools', 85, 1, true),
('Airflow', 'Tools', 80, 2, true),
('MLflow', 'Tools', 75, 3, true),
('Prometheus & Grafana', 'Tools', 70, 4, true),
('ArgoCD', 'Tools', 65, 5, false)

ON CONFLICT DO NOTHING; 

-- 5. Seed Projects
INSERT INTO public.projects (title, description, stack, status, is_featured, display_order, github_url, live_url) VALUES
(
    'End-to-End ML Pipeline',
    'Automated training pipeline with data validation, training, and deployment using Airflow and Kafka.',
    ARRAY['Airflow', 'Kafka', 'PyTorch', 'KServe'],
    'Completed',
    true,
    1,
    'https://github.com/nixtio/ml-pipeline',
    '#'
),
(
    'LLM RAG Platform',
    'Document Q&A system with vector search, semantic retrieval, and LLM serving.',
    ARRAY['LangChain', 'vLLM', 'Pinecone', 'React'],
    'WIP',
    true,
    2,
    'https://github.com/nixtio/rag-platform',
    '#'
),
(
    'Real-Time ML System',
    'Streaming inference system with sub-100ms latency using Kafka, Flink, and Redis.',
    ARRAY['Kafka', 'Flink', 'Redis', 'Triton'],
    'Research',
    true,
    3,
    'https://github.com/nixtio/realtime-ml',
    '#'
),
(
    'Distributed Training Platform',
    'Multi-GPU training environment utilizing Ray and DeepSpeed for large models.',
    ARRAY['Ray', 'DeepSpeed', 'AWS P4d', 'PyTorch'],
    'Research',
    true,
    4,
    'https://github.com/nixtio/distributed-training',
    '#'
),
(
    'Feature Store Platform',
    'Centralized feature management system for consistent training and serving data.',
    ARRAY['Feast', 'BigQuery', 'Redis', 'Spark'],
    'Research',
    true,
    5,
    'https://github.com/nixtio/feature-store',
    '#'
),
(
    'Multi-Cloud ML Platform',
    'Unified control plane managing resources across AWS EKS and GCP GKE with Crossplane.',
    ARRAY['Terraform', 'EKS', 'GKE', 'Crossplane'],
    'Research',
    true,
    6,
    'https://github.com/nixtio/multicloud-ml',
    '#'
),
(
    'ML Observability Suite',
    'Full-stack monitoring solution tracking model drift, data quality, and system health.',
    ARRAY['Grafana', 'Loki', 'Evidently', 'Prometheus'],
    'Research',
    true,
    7,
    'https://github.com/nixtio/ml-observability',
    '#'
),
(
    'MLOps Governance System',
    'Automated policy enforcement, audit logging, and security scanning pipeline.',
    ARRAY['MLflow', 'OPA', 'Trivy', 'Elastic'],
    'Research',
    true,
    8,
    'https://github.com/nixtio/mlops-governance',
    '#'
);

-- 6. Seed KPI Stats
DELETE FROM public.kpi_stats WHERE section IN ('hero', 'header');

INSERT INTO public.kpi_stats (label, value, color, type, section, display_order) VALUES
('Phases', '4', '', 'solid', 'header', 1),
('Certifications', '6-8', '', 'solid', 'header', 2),
('Top Salary', '$350K+', '', 'solid', 'header', 3),
('Timeline', '30-36 Mo', 'bg-[#2a2a2a] text-white', 'solid', 'hero', 1),
('Job Growth', '40% YoY', 'bg-[#facc15] text-[#2a2a2a]', 'solid', 'hero', 2),
('Market Demand', '9.8x', 'bg-blue-600 text-white', 'solid', 'hero', 3),
('Total Projects', '8 Major', 'border-gray-300', 'outline', 'hero', 4);


-- 7. Seed About Content
DELETE FROM public.about_content WHERE section_key IN ('about_text', 'expertise_mlops', 'expertise_cloud', 'expertise_platform', 'expertise_governance');


INSERT INTO public.about_content (section_key, title, content, icon, badge, display_order, is_active) VALUES
(
    'about_text', 
    NULL,
    'I am an ambitious MLOps Engineer & Full Stack Developer building the next generation of AI platforms. leveraging my background in DevOps and scalable web systems, I bridge the gap between software engineering and machine learning. I am currently focused on mastering Kubernetes, LLMOps, and cloud-native architectures to deliver enterprise value.',
    NULL,
    NULL,
    0,
    true
),
(
    'expertise_fullstack',
    'Full Stack & DevOps',
    'My foundation. I build sophisticated web applications with React, TypeScript, and Node.js, automated with robust CI/CD pipelines (GitHub Actions) and containerized with Docker.',
    'Code',
    'Core',
    1,
    true
),
(
    'expertise_cloud',
    'Cloud Infrastructure',
    'Architecting reliable environments on AWS and GCP. I use Terraform for Infrastructure as Code to provision adaptable, scalable resources for both apps and AI models.',
    'Cloud',
    'Expert',
    2,
    true
),
(
    'expertise_mlops',
    'MLOps Engineering',
    'My passion. I orchestrate reproducible machine learning workflows, manage model registries, and deploy scalable inference endpoints using Kubernetes.',
    'Brain',
    'Focus',
    3,
    true
),
(
    'expertise_platform',
    'AI Platform Tools',
    'Building the tools that power AI. I create developer-friendly dashboards and internal platforms that abstract infrastructure complexity for data science teams.',
    'Bot',
    'Growth',
    4,
    true
);

COMMIT;

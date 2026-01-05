-- Migration: 010_consolidate_schema.sql
-- Description: Consolidate 18 tables down to 8 essential tables
-- This migration:
-- 1. Expands personal_info, skills, projects with JSONB columns
-- 2. Migrates data from old tables to new columns
-- 3. Drops redundant tables
-- 
-- RUN THIS AFTER BACKING UP YOUR DATA!

BEGIN;

-- ============================================
-- PHASE 1: EXPAND PERSONAL_INFO TABLE
-- Absorbs: about_content, kpi_stats, social_links
-- ============================================

-- Add new JSONB columns to personal_info
ALTER TABLE public.personal_info 
ADD COLUMN IF NOT EXISTS about_text TEXT,
ADD COLUMN IF NOT EXISTS expertise JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS kpi_stats JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- Migrate about_content data to personal_info.expertise
UPDATE public.personal_info pi
SET 
    about_text = (
        SELECT content FROM public.about_content 
        WHERE section_key = 'about_text' 
        LIMIT 1
    ),
    expertise = (
        SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
                'id', id,
                'section_key', section_key,
                'title', title,
                'content', content,
                'icon', icon,
                'badge', badge,
                'display_order', display_order
            ) ORDER BY display_order
        ), '[]'::jsonb)
        FROM public.about_content 
        WHERE section_key LIKE 'expertise_%' AND is_active = true
    )
WHERE pi.id = (SELECT id FROM public.personal_info LIMIT 1);

-- Migrate social_links data to personal_info.social_links
UPDATE public.personal_info pi
SET social_links = (
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', id,
            'platform', platform,
            'url', url,
            'icon_url', icon_url,
            'display_order', display_order
        ) ORDER BY display_order
    ), '[]'::jsonb)
    FROM public.social_links 
    WHERE is_active = true
)
WHERE pi.id = (SELECT id FROM public.personal_info LIMIT 1);

-- Migrate kpi_stats data to personal_info.kpi_stats
UPDATE public.personal_info pi
SET kpi_stats = (
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', id,
            'label', label,
            'value', value,
            'color', color,
            'type', type,
            'section', section,
            'display_order', display_order
        ) ORDER BY section, display_order
    ), '[]'::jsonb)
    FROM public.kpi_stats
)
WHERE pi.id = (SELECT id FROM public.personal_info LIMIT 1);

-- ============================================
-- PHASE 2: EXPAND SKILLS TABLE
-- Absorbs: technologies, certifications
-- ============================================

-- Add new columns to skills
ALTER TABLE public.skills 
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS roadmap_phase INTEGER;

-- Migrate technologies data to skills
INSERT INTO public.skills (name, category, icon_url, display_order, is_featured)
SELECT 
    name, 
    'Tools' as category,  -- Default category for technologies
    logo_url as icon_url,
    display_order,
    true as is_featured
FROM public.technologies
WHERE is_active = true
ON CONFLICT DO NOTHING;

-- Migrate certifications data to skills (if table exists and has data)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'certifications') THEN
        INSERT INTO public.skills (name, category, display_order, is_featured)
        SELECT 
            name, 
            'Certifications' as category,
            display_order,
            true as is_featured
        FROM public.certifications
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- PHASE 3: EXPAND PROJECTS TABLE
-- Absorbs: portfolio_content, portfolio_documents, portfolio_embeds
-- Note: These tables have variable schemas, so we just add columns
-- and drop the old tables without attempting data migration
-- ============================================

-- Add new columns to projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS embeds JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS roadmap_project INTEGER;

-- Note: Not migrating data from portfolio_* tables as they have inconsistent schemas
-- The data will be lost when these tables are dropped. If you need to preserve this data,
-- manually export it before running this migration.

-- ============================================
-- PHASE 4: DROP REDUNDANT TABLES
-- Only drop after data is migrated
-- ============================================

-- Drop tables that have been absorbed
DROP TABLE IF EXISTS public.about_content CASCADE;
DROP TABLE IF EXISTS public.kpi_stats CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.technologies CASCADE;
DROP TABLE IF EXISTS public.certifications CASCADE;
DROP TABLE IF EXISTS public.portfolio_content CASCADE;
DROP TABLE IF EXISTS public.portfolio_documents CASCADE;
DROP TABLE IF EXISTS public.portfolio_embeds CASCADE;
DROP TABLE IF EXISTS public.chat_history CASCADE;

-- Optional: Drop page_views if not using analytics
-- Keeping it for now as it's useful for understanding traffic
-- DROP TABLE IF EXISTS public.page_views CASCADE;

-- ============================================
-- PHASE 5: UPDATE SKILL CATEGORY CONSTRAINT
-- Allow new categories
-- ============================================

ALTER TABLE public.skills DROP CONSTRAINT IF EXISTS skills_category_check;
ALTER TABLE public.skills 
ADD CONSTRAINT skills_category_check 
CHECK (category IN ('Languages', 'Frameworks', 'Tools', 'Cloud', 'Databases', 'Certifications', 'Other'));

-- ============================================
-- PHASE 6: SEED NEW ROADMAP DATA
-- Aligned with 9-Phase MLOps Career Roadmap
-- ============================================

-- Clear and reseed skills with roadmap data
DELETE FROM public.skills;

INSERT INTO public.skills (name, category, proficiency, display_order, is_featured, roadmap_phase, icon_url) VALUES
-- Phase 1: SWE Foundation (Mastered)
('Python', 'Languages', 92, 1, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
('TypeScript', 'Languages', 90, 2, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'),
('JavaScript', 'Languages', 88, 3, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'),
('SQL', 'Languages', 88, 4, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
('HTML/CSS', 'Languages', 90, 5, false, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'),
('Bash', 'Languages', 60, 6, false, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg'),
('React', 'Frameworks', 90, 1, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
('Next.js', 'Frameworks', 88, 2, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'),
('FastAPI', 'Frameworks', 85, 3, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg'),
('Tailwind CSS', 'Frameworks', 88, 4, false, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'),
('Git', 'Tools', 90, 1, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'),
('GitHub', 'Tools', 90, 2, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'),
('pytest', 'Tools', 78, 3, false, 1, NULL),
('PostgreSQL', 'Databases', 85, 1, true, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
('Redis', 'Databases', 65, 2, false, 1, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg'),

-- Phase 2: Mobile + Full-Stack (Current)
('Dart', 'Languages', 85, 7, true, 2, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg'),
('Flutter', 'Frameworks', 82, 5, true, 2, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg'),
('GitHub Actions', 'Tools', 75, 4, true, 2, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg'),
('Supabase', 'Databases', 88, 3, true, 2, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg'),
('Vercel', 'Cloud', 80, 1, false, 2, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg'),

-- Phase 3: Cloud & DevOps (Upcoming)
('AWS', 'Cloud', 45, 2, true, 3, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'),
('Docker', 'Tools', 55, 5, true, 3, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'),
('Linux', 'Tools', 55, 6, true, 3, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg'),
('Prometheus', 'Tools', 25, 7, false, 3, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg'),
('Grafana', 'Tools', 25, 8, false, 3, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg'),

-- Phase 4: Data Engineering (Future)
('Apache Airflow', 'Tools', 15, 9, false, 4, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg'),
('pandas', 'Frameworks', 45, 6, false, 4, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg'),

-- Phase 5: Kubernetes & Platform (Future)
('Kubernetes', 'Tools', 30, 10, true, 5, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg'),
('Terraform', 'Tools', 20, 11, true, 5, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg'),
('ArgoCD', 'Tools', 10, 12, false, 5, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/argocd/argocd-original.svg'),

-- Phase 6: ML Foundations (Future)
('PyTorch', 'Frameworks', 20, 7, true, 6, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg'),
('scikit-learn', 'Frameworks', 25, 8, false, 6, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg'),
('Jupyter', 'Tools', 45, 13, false, 6, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg'),
('MLflow', 'Tools', 15, 14, true, 6, NULL),

-- Phase 7: LLMOps (Future)
('Ollama', 'Tools', 10, 15, false, 7, NULL),
('LangChain', 'Frameworks', 10, 9, false, 7, NULL),

-- Phase 8: MLOps Systems (Future)
('Kubeflow', 'Tools', 5, 16, false, 8, NULL);

-- Update personal_info with roadmap-aligned data
UPDATE public.personal_info
SET 
    title = 'Software Engineer → MLOps Architect',
    about_text = 'I am a Software Engineer on a structured 44-month journey to MLOps Architect. Currently mastering full-stack development with React/Next.js, FastAPI, and Flutter. My methodology: master software engineering first, then scale it with cloud infrastructure, Kubernetes, data pipelines, and ML systems. The best MLOps engineers are software engineers who understand the entire stack from UI to GPU.',
    expertise = '[
        {"section_key": "expertise_swe", "title": "Software Engineering", "content": "Production-grade applications with clean code, proper testing, and CI/CD. Python, TypeScript, FastAPI, pytest. The foundation everything builds upon.", "icon": "Code", "badge": "Mastered", "display_order": 1},
        {"section_key": "expertise_fullstack", "title": "Full-Stack Development", "content": "End-to-end web development: React, Next.js 14+, TypeScript, FastAPI. Complete products from pixel to database.", "icon": "Layers", "badge": "Mastered", "display_order": 2},
        {"section_key": "expertise_mobile", "title": "Mobile Development", "content": "Cross-platform apps with Flutter and Dart. Riverpod state management, offline-first SQLite, push notifications.", "icon": "Cpu", "badge": "Current", "display_order": 3},
        {"section_key": "expertise_cloud", "title": "Cloud & DevOps", "content": "AWS, Docker, Prometheus, Grafana. HashiCorp Vault for secrets. Linux administration.", "icon": "Cloud", "badge": "Phase 3", "display_order": 4},
        {"section_key": "expertise_data", "title": "Data Engineering", "content": "Apache Airflow orchestration. Great Expectations for data quality. The backbone that feeds ML systems.", "icon": "Database", "badge": "Phase 4", "display_order": 5},
        {"section_key": "expertise_k8s", "title": "Platform Engineering", "content": "Kubernetes, Helm, Terraform, ArgoCD, GitOps. Operating distributed systems at scale.", "icon": "Box", "badge": "Phase 5", "display_order": 6},
        {"section_key": "expertise_ml", "title": "Machine Learning", "content": "scikit-learn, PyTorch, Hugging Face Transformers. MLflow experiment tracking.", "icon": "BrainCircuit", "badge": "Phase 6", "display_order": 7},
        {"section_key": "expertise_llmops", "title": "LLMOps & GenAI", "content": "vLLM, Ollama serving. LangChain, LlamaIndex. Vector DBs. RAG pipelines.", "icon": "Brain", "badge": "Phase 7", "display_order": 8},
        {"section_key": "expertise_mlops", "title": "MLOps Architecture", "content": "Kubeflow Pipelines, KServe model serving. Feast feature store. Evidently drift detection.", "icon": "Workflow", "badge": "Phase 8", "display_order": 9}
    ]'::jsonb,
    kpi_stats = '[
        {"label": "Roadmap Phase", "value": "2 of 9", "color": "bg-gradient-to-r from-blue-600 to-purple-600 text-white", "type": "solid", "section": "hero", "display_order": 1},
        {"label": "Timeline", "value": "44 Months", "color": "bg-[#2a2a2a] text-white", "type": "solid", "section": "hero", "display_order": 2},
        {"label": "Stack Mastery", "value": "Full-Stack + Mobile", "color": "bg-[#facc15] text-[#2a2a2a]", "type": "solid", "section": "hero", "display_order": 3},
        {"label": "Target Role", "value": "MLOps Architect", "color": "border-gray-300", "type": "outline", "section": "hero", "display_order": 4},
        {"label": "Skills Tracked", "value": "37+", "type": "solid", "section": "header", "display_order": 1},
        {"label": "Projects", "value": "18 Planned", "type": "solid", "section": "header", "display_order": 2},
        {"label": "Next Phase", "value": "Cloud & DevOps", "type": "solid", "section": "header", "display_order": 3}
    ]'::jsonb
WHERE id = (SELECT id FROM public.personal_info LIMIT 1);

COMMIT;

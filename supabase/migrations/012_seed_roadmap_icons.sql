-- Migration: 012_seed_roadmap_icons.sql
-- Description: Fill in missing icons and skills for the Career Roadmap

BEGIN;

-- 1. Update existing skills with missing icon URLs
UPDATE public.skills SET icon_url = 'https://cdn.simpleicons.org/mlflow/0194E2' WHERE name = 'MLflow';
UPDATE public.skills SET icon_url = 'https://cdn.simpleicons.org/ollama/white' WHERE name = 'Ollama';
UPDATE public.skills SET icon_url = 'https://cdn.simpleicons.org/langchain/1C3C3C' WHERE name = 'LangChain';
UPDATE public.skills SET icon_url = 'https://cdn.simpleicons.org/kubeflow/4279f4' WHERE name = 'Kubeflow';

-- 2. Insert missing tools that were only in fallbacks
-- Phase 7: LLMOps
INSERT INTO public.skills (name, category, proficiency, display_order, is_featured, roadmap_phase, icon_url)
VALUES ('OpenAI', 'Tools', 10, 16, false, 7, 'https://cdn.simpleicons.org/openai/412991')
ON CONFLICT (name) DO UPDATE SET 
    roadmap_phase = 7,
    icon_url = 'https://cdn.simpleicons.org/openai/412991';

-- Phase 8: MLOps Systems
INSERT INTO public.skills (name, category, proficiency, display_order, is_featured, roadmap_phase, icon_url)
VALUES ('Ray', 'Tools', 10, 17, false, 8, 'https://cdn.simpleicons.org/ray/028CF0')
ON CONFLICT (name) DO UPDATE SET 
    roadmap_phase = 8,
    icon_url = 'https://cdn.simpleicons.org/ray/028CF0';

-- Ensure Kubernetes is also mapped to Phase 8 (as it was in fallbacks)
UPDATE public.skills SET roadmap_phase = 8 WHERE name = 'Kubernetes';

COMMIT;

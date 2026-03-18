-- Migration: 009_align_roadmap_seed.sql
-- Description: Align portfolio data with 9-Phase MLOps Career Roadmap
-- User is in Phase 2 (Mobile + Full-Stack), mastered Phase 1 & 2
-- NOTE: Projects table is NOT touched per user request
-- 
-- SKILL CATEGORIES (DB constraint): Languages, Frameworks, Tools, Cloud, Databases, Other
-- COMPREHENSIVE: Zero to Architect coverage across all 9 phases

BEGIN;

-- ============================================
-- 1. UPDATE PERSONAL INFO
-- ============================================
UPDATE public.personal_info
SET 
    title = 'Software Engineer → MLOps Architect',
    updated_at = NOW()
WHERE id = (SELECT id FROM public.personal_info LIMIT 1);

-- If no row exists, insert one
INSERT INTO public.personal_info (full_name, title, email, location)
SELECT 'Ambooka', 'Software Engineer → MLOps Architect', 'contact@ambooka.dev', 'Kenya'
WHERE NOT EXISTS (SELECT 1 FROM public.personal_info);

-- ============================================
-- 2. PURGE AND RESEED SKILLS
-- Organized by Phase with industry-standard tools
-- ============================================
DELETE FROM public.skills;

INSERT INTO public.skills (name, category, proficiency, display_order, is_featured) VALUES

-- ═══════════════════════════════════════════
-- PHASE 1: SOFTWARE ENGINEERING FOUNDATION
-- ═══════════════════════════════════════════

-- Languages (Phase 1 - Mastered)
('Python', 'Languages', 92, 1, true),
('TypeScript', 'Languages', 90, 2, true),
('JavaScript', 'Languages', 88, 3, true),
('SQL', 'Languages', 88, 4, true),
('HTML/CSS', 'Languages', 90, 5, false),
('Bash', 'Languages', 60, 6, false),  -- Linux scripting starts here

-- Frameworks (Phase 1 - Mastered)
('React', 'Frameworks', 90, 1, true),
('Next.js', 'Frameworks', 88, 2, true),
('FastAPI', 'Frameworks', 85, 3, true),
('Tailwind CSS', 'Frameworks', 88, 4, false),
('Pydantic', 'Frameworks', 82, 5, false),
('SQLAlchemy', 'Frameworks', 78, 6, false),

-- Tools (Phase 1)
('Git', 'Tools', 90, 1, true),
('GitHub', 'Tools', 90, 2, true),
('VS Code', 'Tools', 92, 3, false),
('pytest', 'Tools', 78, 4, false),
('Postman', 'Tools', 85, 5, false),

-- Databases (Phase 1)
('PostgreSQL', 'Databases', 85, 1, true),
('Redis', 'Databases', 65, 2, false),

-- ═══════════════════════════════════════════
-- PHASE 2: MOBILE + ADVANCED FULL-STACK
-- ═══════════════════════════════════════════

-- Languages (Phase 2 - Current)
('Dart', 'Languages', 85, 7, true),

-- Frameworks (Phase 2 - Current)
('Flutter', 'Frameworks', 82, 7, true),
('Node.js', 'Frameworks', 75, 8, false),
('Riverpod', 'Frameworks', 70, 9, false),

-- Tools (Phase 2)
('GitHub Actions', 'Tools', 75, 6, true),
('Playwright', 'Tools', 60, 7, false),

-- Databases (Phase 2)
('Supabase', 'Databases', 88, 3, true),
('SQLite', 'Databases', 80, 4, false),
('Firebase', 'Databases', 70, 5, false),

-- Cloud (Phase 2 - Deployment)
('Vercel', 'Cloud', 80, 1, false),
('Railway', 'Cloud', 75, 2, false),
('Netlify', 'Cloud', 70, 3, false),

-- ═══════════════════════════════════════════
-- PHASE 3: CLOUD & DEVOPS (Upcoming)
-- Industry Standard DevOps Stack
-- ═══════════════════════════════════════════

-- Cloud Platforms
('AWS', 'Cloud', 45, 4, true),
('AWS EC2', 'Cloud', 40, 5, false),
('AWS S3', 'Cloud', 40, 6, false),
('AWS RDS', 'Cloud', 35, 7, false),
('AWS IAM', 'Cloud', 35, 8, false),
('AWS VPC', 'Cloud', 30, 9, false),
('AWS Lambda', 'Cloud', 30, 10, false),

-- Containers & CI/CD
('Docker', 'Tools', 55, 8, true),
('Docker Compose', 'Tools', 50, 9, false),

-- Secrets & Security
('HashiCorp Vault', 'Tools', 20, 10, false),
('AWS Secrets Manager', 'Cloud', 20, 11, false),

-- Monitoring & Observability
('Prometheus', 'Tools', 25, 11, false),
('Grafana', 'Tools', 25, 12, false),
('CloudWatch', 'Cloud', 20, 12, false),

-- Logging
('ELK Stack', 'Tools', 20, 13, false),
('Grafana Loki', 'Tools', 15, 14, false),

-- Linux
('Linux', 'Other', 55, 1, true),

-- ═══════════════════════════════════════════
-- PHASE 4: DATA ENGINEERING (Future)
-- The backbone of MLOps
-- ═══════════════════════════════════════════

-- Orchestration
('Apache Airflow', 'Tools', 15, 15, false),
('Prefect', 'Tools', 10, 16, false),
('Dagster', 'Tools', 5, 17, false),

-- Data Processing
('pandas', 'Frameworks', 45, 10, false),
('Polars', 'Frameworks', 20, 11, false),
('PySpark', 'Frameworks', 10, 12, false),
('dbt', 'Tools', 10, 18, false),

-- Data Quality & Versioning
('Great Expectations', 'Tools', 5, 19, false),
('DVC', 'Tools', 5, 20, false),

-- Storage
('Parquet', 'Other', 15, 2, false),

-- ═══════════════════════════════════════════
-- PHASE 5: KUBERNETES & PLATFORM ENGINEERING
-- Distributed Systems at Scale
-- ═══════════════════════════════════════════

-- Orchestration
('Kubernetes', 'Tools', 30, 21, true),
('Helm', 'Tools', 15, 22, false),
('k3s', 'Tools', 10, 23, false),

-- Infrastructure as Code
('Terraform', 'Tools', 20, 24, true),
('Pulumi', 'Tools', 5, 25, false),

-- GitOps
('ArgoCD', 'Tools', 10, 26, false),
('Flux', 'Tools', 5, 27, false),

-- Observability
('OpenTelemetry', 'Tools', 5, 28, false),
('Jaeger', 'Tools', 5, 29, false),

-- Service Mesh
('Istio', 'Tools', 5, 30, false),

-- ═══════════════════════════════════════════
-- PHASE 6: MACHINE LEARNING FOUNDATIONS
-- Understanding what we deploy
-- ═══════════════════════════════════════════

-- ML Frameworks
('scikit-learn', 'Frameworks', 25, 13, false),
('PyTorch', 'Frameworks', 20, 14, true),
('TensorFlow', 'Frameworks', 10, 15, false),
('Hugging Face', 'Frameworks', 15, 16, false),

-- Data Science
('NumPy', 'Frameworks', 40, 17, false),
('Jupyter', 'Tools', 45, 31, false),

-- Experiment Tracking
('MLflow', 'Tools', 15, 32, true),
('Weights & Biases', 'Tools', 10, 33, false),

-- Model Optimization
('ONNX', 'Tools', 5, 34, false),

-- ═══════════════════════════════════════════
-- PHASE 7: LLMOps FOUNDATIONS
-- The GenAI Future
-- ═══════════════════════════════════════════

-- LLM Serving
('vLLM', 'Tools', 5, 35, false),
('Ollama', 'Tools', 10, 36, false),
('TGI', 'Tools', 5, 37, false),

-- Vector Databases
('Qdrant', 'Databases', 5, 6, false),
('Weaviate', 'Databases', 5, 7, false),
('Chroma', 'Databases', 5, 8, false),
('Pinecone', 'Databases', 5, 9, false),

-- RAG Frameworks
('LangChain', 'Frameworks', 10, 18, false),
('LlamaIndex', 'Frameworks', 5, 19, false),

-- ═══════════════════════════════════════════
-- PHASE 8: MLOPS SYSTEMS & TOOLING
-- Production-Grade ML Infrastructure
-- ═══════════════════════════════════════════

-- ML Pipelines
('Kubeflow', 'Tools', 5, 38, false),
('Kubeflow Pipelines', 'Tools', 5, 39, false),
('Argo Workflows', 'Tools', 5, 40, false),

-- Model Serving
('KServe', 'Tools', 5, 41, false),
('BentoML', 'Tools', 5, 42, false),
('Seldon Core', 'Tools', 5, 43, false),
('Triton', 'Tools', 5, 44, false),

-- Feature Store
('Feast', 'Tools', 5, 45, false),

-- ML Monitoring
('Evidently', 'Tools', 5, 46, false),
('WhyLabs', 'Tools', 5, 47, false),

-- ═══════════════════════════════════════════
-- PHASE 9: ARCHITECT LEVEL (Soft Skills tracked as Other)
-- ═══════════════════════════════════════════
('System Design', 'Other', 30, 3, false),
('Technical Writing', 'Other', 40, 4, false),
('Architecture Diagrams', 'Other', 35, 5, false);

-- ============================================
-- 3. PURGE AND RESEED KPI STATS
-- ============================================
DELETE FROM public.kpi_stats;

INSERT INTO public.kpi_stats (label, value, color, type, section, display_order) VALUES
-- Hero section stats
('Roadmap Phase', '2 of 9', 'bg-gradient-to-r from-blue-600 to-purple-600 text-white', 'solid', 'hero', 1),
('Timeline', '44 Months', 'bg-[#2a2a2a] text-white', 'solid', 'hero', 2),
('Stack Mastery', 'Full-Stack + Mobile', 'bg-[#facc15] text-[#2a2a2a]', 'solid', 'hero', 3),
('Target Role', 'MLOps Architect', 'border-gray-300', 'outline', 'hero', 4),

-- Header section stats
('Skills Tracked', '85+', '', 'solid', 'header', 1),
('Projects', '18 Planned', '', 'solid', 'header', 2),
('Next Phase', 'Cloud & DevOps', '', 'solid', 'header', 3);

-- ============================================
-- 4. PURGE AND RESEED ABOUT CONTENT
-- ============================================
DELETE FROM public.about_content;

-- Main about text
INSERT INTO public.about_content (section_key, title, content, icon, badge, display_order, is_active) VALUES
(
    'about_text',
    NULL,
    'I am a Software Engineer on a structured 44-month journey to MLOps Architect. Currently mastering full-stack development with React/Next.js, FastAPI, and Flutter. My methodology: master software engineering first, then scale it with cloud infrastructure, Kubernetes, data pipelines, and ML systems. The best MLOps engineers are software engineers who understand the entire stack from UI to GPU.',
    NULL,
    NULL,
    0,
    true
);

-- 9 Expertise areas aligned to roadmap phases
-- Each with competencies that match the roadmap technologies
INSERT INTO public.about_content (section_key, title, content, icon, badge, display_order, is_active) VALUES
(
    'expertise_swe',
    'Software Engineering',
    'Production-grade applications with clean code, proper testing, and CI/CD. Python, TypeScript, FastAPI, pytest. The foundation everything builds upon.',
    'Code',
    'Mastered',
    1,
    true
),
(
    'expertise_fullstack',
    'Full-Stack Development',
    'End-to-end web development: React, Next.js 14+, TypeScript, FastAPI. Complete products from pixel to database. RESTful APIs with JWT auth, Redis caching, PostgreSQL.',
    'Layers',
    'Mastered',
    2,
    true
),
(
    'expertise_mobile',
    'Mobile Development',
    'Cross-platform apps with Flutter and Dart. Riverpod state management, offline-first SQLite, push notifications. GitHub Actions CI/CD for mobile.',
    'Cpu',
    'Current',
    3,
    true
),
(
    'expertise_cloud',
    'Cloud & DevOps',
    'AWS (EC2, S3, RDS, IAM, VPC, Lambda). Docker, Docker Compose. Prometheus, Grafana, ELK stack. HashiCorp Vault for secrets. Linux administration.',
    'Cloud',
    'Phase 3',
    4,
    true
),
(
    'expertise_data',
    'Data Engineering',
    'Apache Airflow orchestration. Great Expectations for data quality. DVC for versioning. PySpark for scale. The backbone that feeds ML systems.',
    'Database',
    'Phase 4',
    5,
    true
),
(
    'expertise_k8s',
    'Platform Engineering',
    'Kubernetes (EKS, k3s), Helm, Terraform, ArgoCD, GitOps. OpenTelemetry, Jaeger. Operating distributed systems at scale with infrastructure as code.',
    'Box',
    'Phase 5',
    6,
    true
),
(
    'expertise_ml',
    'Machine Learning',
    'scikit-learn, PyTorch, Hugging Face Transformers. MLflow experiment tracking. ONNX optimization. Understanding the models we deploy.',
    'BrainCircuit',
    'Phase 6',
    7,
    true
),
(
    'expertise_llmops',
    'LLMOps & GenAI',
    'vLLM, Ollama serving. LangChain, LlamaIndex frameworks. Qdrant, Weaviate vector DBs. RAG pipelines. The future of AI infrastructure.',
    'Brain',
    'Phase 7',
    8,
    true
),
(
    'expertise_mlops',
    'MLOps Architecture',
    'Kubeflow Pipelines, Argo Workflows. KServe, BentoML model serving. Feast feature store. Evidently drift detection. End-to-end ML platforms.',
    'Workflow',
    'Phase 8',
    9,
    true
);

COMMIT;

-- =====================================================================
-- MASTER SEED: Abdulrahman (Msah) Ambooka — AI/ML Engineer Roadmap
-- Portfolio: ambooka.dev  |  GitHub: ambooka
-- Roadmap: 5-Phase Nexus Platform, 26 months, CS Graduate accelerated
-- Run this in Supabase SQL Editor to reset all career content
-- =====================================================================

BEGIN;

-- =====================================================================
-- 1. PERSONAL INFO
-- =====================================================================
UPDATE personal_info SET
  full_name      = 'Msah Ambooka',
  title          = 'Software Engineer → AI/ML Engineer',
  email          = 'abdulrahmanambooka@gmail.com',
  phone          = '+254111384390',
  location       = 'Nairobi, Kenya',
  summary        = 'CS graduate building toward an AI/ML Engineer role through the Nexus platform — a single long-running project that ships across 5 phases from a Dockerised Python CLI to a production multi-agent AI system. Currently in Phase 1 (Foundations & Tooling). Background in full-stack web development and IT infrastructure. Learning in public on ambooka.dev.',
  linkedin_url   = 'https://www.linkedin.com/in/abdulrahman-ambooka/',
  github_url     = 'https://github.com/ambooka',
  website_url    = 'https://ambooka.dev',
  about_text     = 'CS graduate from Maseno University, building toward an AI/ML Engineer role through a structured 26-month plan. Every week I ship a project to GitHub. Every phase ships a live deployment to ambooka.dev. The CS degree cuts Phase 1–2 study time by ~40%, letting me focus deeper on the AI/ML stack earlier. Currently deep in Phase 1: Python, Linux, Docker, SQL, and CI/CD — the engineering foundation everything else rests on.',
  kpi_stats      = '{"role":"Software Engineer (Building)","focus":"Python · Docker · Linux → AI/ML Engineer","current_phase":"1/5","years_experience":"3","headline":"Building in Public.","project_count":3,"expertise_breakdown":{"software":40,"cloud_infra":35,"data":10,"ml_ai":15}}'::jsonb,
  expertise      = '[
    {"section_key":"expertise_foundation","title":"Software Engineering","content":"Python (OOP, type hints, pytest, decorators, generators), TypeScript, Node.js REST APIs, PostgreSQL, Docker Compose — shipped to a live Hetzner VPS with GitHub Actions CI/CD.","icon":"Code","badge":"Phase 1–2","display_order":1},
    {"section_key":"expertise_cloud","title":"Cloud & Infrastructure","content":"k3s Kubernetes, Helm charts, Terraform-managed AWS (IAM, EC2, S3, ECS), Prometheus + Grafana + Loki observability stack. Everything infrastructure-as-code, nothing clicked in the console.","icon":"Cloud","badge":"Phase 2","display_order":2},
    {"section_key":"expertise_ml","title":"Machine Learning","content":"PyTorch deep learning (CNNs, RNNs, Transformers from scratch), HuggingFace fine-tuning, scikit-learn pipelines, FastAPI model serving with SHAP explanations and DVC data versioning.","icon":"Brain","badge":"Phase 3","display_order":3},
    {"section_key":"expertise_ai","title":"AI / LLM Engineering","content":"RAG architectures (naive → advanced hybrid search + re-ranking), LangChain LCEL, QLoRA fine-tuning, MLflow model registry, Evidently drift detection, automated retraining pipelines.","icon":"Bot","badge":"Phase 4","display_order":4},
    {"section_key":"expertise_agents","title":"Agentic Systems","content":"LangGraph state machines, multi-agent supervisor patterns (CrewAI, AutoGen), tool use and function calling, human-in-the-loop approval gates, adversarial red teaming and safety layers.","icon":"Zap","badge":"Phase 5","display_order":5}
  ]'::jsonb,
  updated_at     = NOW()
WHERE id = (SELECT id FROM personal_info LIMIT 1);

INSERT INTO personal_info (full_name, title, email, phone, location, summary, linkedin_url, github_url, website_url, about_text, kpi_stats, expertise)
SELECT
  'Msah Ambooka',
  'Software Engineer → AI/ML Engineer',
  'abdulrahmanambooka@gmail.com',
  '+254111384390',
  'Nairobi, Kenya',
  'CS graduate building toward an AI/ML Engineer role through the Nexus platform — a single long-running project that ships across 5 phases from a Dockerised Python CLI to a production multi-agent AI system.',
  'https://www.linkedin.com/in/abdulrahman-ambooka/',
  'https://github.com/ambooka',
  'https://ambooka.dev',
  'CS graduate from Maseno University building toward an AI/ML Engineer role through a structured 26-month plan. Currently in Phase 1: Foundations & Tooling.',
  '{"role":"Software Engineer (Building)","focus":"Python · Docker · Linux → AI/ML Engineer","current_phase":"1/5","years_experience":"3"}'::jsonb,
  '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM personal_info LIMIT 1);


-- =====================================================================
-- 2. EDUCATION
-- =====================================================================
DELETE FROM education;

INSERT INTO education (institution, degree, field_of_study, start_date, end_date, is_current, grade, description, display_order)
VALUES
(
  'Maseno University',
  'Bachelor of Science',
  'Computer Science',
  '2019-09-01',
  '2024-06-30',
  false,
  'Second Class Honours (Upper Division)',
  'Comprehensive CS education covering algorithms, data structures, software engineering, database systems, computer networks, and artificial intelligence. The degree provides a 40–50% acceleration on the Nexus Phase 1–2 curriculum — foundational CS concepts, complexity analysis, design patterns, and networking basics are already covered.',
  1
),
(
  'Starehe Boys'' Centre & School',
  'Kenya Certificate of Secondary Education (KCSE)',
  'Sciences Track',
  '2015-01-01',
  '2018-11-30',
  false,
  NULL,
  'Completed secondary education at one of Kenya''s top national schools.',
  2
);


-- =====================================================================
-- 3. EXPERIENCE  (keep real experience; update descriptions to match roadmap framing)
-- =====================================================================
DELETE FROM experience;

INSERT INTO experience (company, position, location, start_date, end_date, is_current, description, responsibilities, achievements, technologies, display_order)
VALUES
(
  'Hebatullah Brothers Limited',
  'IT Assistant',
  'Nairobi, Kenya',
  '2025-01-01',
  NULL,
  true,
  'Providing IT operations support and digital transformation services for a Nairobi-based enterprise. This role runs in parallel with the Nexus roadmap — production infrastructure challenges here directly inform Phase 1 Linux and networking study.',
  ARRAY[
    'Manage and maintain company IT infrastructure: Windows servers, networking, and workstations',
    'Provide Tier-1 and Tier-2 technical support to staff across hardware, software, and connectivity',
    'Implement and monitor security measures: UFW, fail2ban, automated backup protocols',
    'Deploy and configure software systems; maintain IT documentation and asset inventory',
    'Identify manual business processes and prototype automation solutions using Python scripts'
  ],
  ARRAY[
    'Reduced helpdesk resolution time from 48h to under 8h through structured ticketing workflow',
    'Implemented automated daily backup routines; zero data loss incidents since deployment',
    'Wrote a Python automation script that cut a weekly reporting task from 3 hours to 4 minutes'
  ],
  ARRAY['Linux', 'Windows Server', 'Networking', 'Python', 'Bash', 'IT Support', 'Cybersecurity'],
  1
),
(
  'Self-Employed',
  'Freelance Full-Stack Developer',
  'Nairobi, Kenya (Remote)',
  '2022-01-01',
  NULL,
  true,
  'Delivering full-stack web applications, APIs, and dashboards to clients across Kenya and globally. This freelance practice is the foundation of the Nexus Phase 1–2 web engineering skills — real client projects using the same stack (React, Node.js, PostgreSQL, Docker).',
  ARRAY[
    'Design and build full-stack web applications using React, Next.js, Node.js, and PostgreSQL',
    'Integrate payment gateways including Safaricom Daraja API (M-Pesa) for Kenyan clients',
    'Containerise applications with Docker; deploy to VPS environments behind Nginx with SSL',
    'Write REST API documentation using OpenAPI/Swagger; deliver typed client SDKs',
    'Provide technical consulting on digital transformation for SME clients'
  ],
  ARRAY[
    'Delivered 12+ full-stack projects with 100% client satisfaction and on-time delivery',
    'Built an M-Pesa STK Push integration serving a Nairobi e-commerce client processing KES 1M+/month',
    'Reduced a client''s manual invoicing process by 80% through a custom React + FastAPI dashboard'
  ],
  ARRAY['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Nginx', 'M-Pesa Daraja API', 'Python', 'FastAPI'],
  2
),
(
  'Masinde Muliro University of Science and Technology',
  'IT Infrastructure Intern',
  'Kakamega, Kenya',
  '2023-05-01',
  '2023-08-31',
  false,
  'Industrial attachment supporting campus-wide IT infrastructure administration.',
  ARRAY[
    'Assisted in administration of campus-wide network infrastructure and server room',
    'Deployed and configured computer lab workstations; provided technical support to faculty and students',
    'Documented network topology and created IT asset inventory for the department'
  ],
  ARRAY[
    'Configured 40+ workstations in a new computer lab ahead of the semester start date',
    'Identified and resolved a recurring DHCP conflict affecting 200+ campus devices'
  ],
  ARRAY['Network Administration', 'Linux', 'Windows Server', 'IT Support', 'TCP/IP'],
  3
);


-- =====================================================================
-- 4. PORTFOLIO PROJECTS  (Nexus platform phases + real freelance work)
-- =====================================================================
DELETE FROM portfolio_content;

INSERT INTO portfolio_content (title, category, description, technologies, github_url, live_url, image_url, tags, is_featured, display_order)
VALUES
(
  'Nexus v0.1 — The Toolbox',
  'devops',
  'Phase 1 milestone: Dockerised Python CLI utility suite with pytest coverage ≥80%, served over HTTPS from a Hetzner VPS behind Nginx, with a GitHub Actions pipeline (lint → test → build → push GHCR → deploy).',
  ARRAY['Python 3.12', 'Docker Compose', 'Nginx', 'PostgreSQL', 'GitHub Actions', 'pytest'],
  'https://github.com/ambooka/nexus',
  'https://ambooka.dev',
  '/assets/images/projects/nexus-v01.png',
  ARRAY['Python', 'Docker', 'CI/CD', 'VPS', 'Nexus Phase 1'],
  true,
  1
),
(
  'Nexus v0.2 — The Platform',
  'web_app',
  'Phase 2 milestone (upcoming): Full-stack TypeScript monorepo — React SPA + Node.js REST API + PostgreSQL + Redis on k3s Kubernetes, with Terraform-managed AWS infrastructure and Prometheus/Grafana/Loki observability.',
  ARRAY['TypeScript', 'React', 'Node.js', 'k3s', 'Helm', 'Terraform', 'AWS', 'Prometheus', 'Grafana'],
  'https://github.com/ambooka/nexus',
  '#',
  '/assets/images/projects/nexus-v02.png',
  ARRAY['TypeScript', 'Kubernetes', 'Terraform', 'Observability', 'Nexus Phase 2'],
  true,
  2
),
(
  'Nexus v0.3 — Intelligence Layer',
  'ai_ml',
  'Phase 3 milestone (planned): FastAPI ML model service exposing a scikit-learn classifier and a fine-tuned HuggingFace transformer with SHAP explanations, DVC data versioning, and a CI quality gate.',
  ARRAY['Python', 'PyTorch', 'HuggingFace', 'scikit-learn', 'FastAPI', 'DVC', 'SHAP', 'Airflow'],
  'https://github.com/ambooka/nexus',
  '#',
  '/assets/images/projects/nexus-v03.png',
  ARRAY['ML', 'HuggingFace', 'FastAPI', 'MLOps', 'Nexus Phase 3'],
  true,
  3
),
(
  'Nexus v0.4 — AI Platform',
  'ai_ml',
  'Phase 4 milestone (planned): RAG chatbot over a personal knowledge base with hybrid search + re-ranking, QLoRA fine-tuned domain model in MLflow registry, Evidently drift detection, and automated retraining pipeline.',
  ARRAY['LangChain', 'LlamaIndex', 'pgvector', 'MLflow', 'TorchServe', 'Evidently', 'OpenAI API', 'Anthropic API'],
  'https://github.com/ambooka/nexus',
  '#',
  '/assets/images/projects/nexus-v04.png',
  ARRAY['RAG', 'LangChain', 'MLOps', 'Fine-tuning', 'Nexus Phase 4'],
  true,
  4
),
(
  'Nexus v1.0 — Complete AI Platform',
  'ai_ml',
  'Phase 5 milestone (planned): Autonomous research agent (LangGraph supervisor), multi-agent code review pipeline, long-term vector memory, guardrails safety layer, and a red team report — live at ambooka.dev.',
  ARRAY['LangGraph', 'CrewAI', 'AutoGen', 'Guardrails AI', 'Triton', 'LlamaIndex'],
  'https://github.com/ambooka/nexus',
  'https://ambooka.dev',
  '/assets/images/projects/nexus-v10.png',
  ARRAY['Agents', 'LangGraph', 'Safety', 'Multi-agent', 'Nexus Phase 5'],
  true,
  5
),
(
  'M-Pesa STK Push Integration',
  'web_app',
  'Production-grade Safaricom Daraja API integration: STK Push, B2C disbursements, and C2B paybill callbacks. Used by a Nairobi e-commerce client processing KES 1M+/month. Built with Node.js, retry logic, BullMQ async queue, and PostgreSQL transaction logging.',
  ARRAY['Node.js', 'TypeScript', 'PostgreSQL', 'BullMQ', 'Redis', 'Nginx', 'M-Pesa Daraja API'],
  '#',
  '#',
  '/assets/images/projects/mpesa.png',
  ARRAY['FinTech', 'M-Pesa', 'Payments', 'Node.js', 'Kenya'],
  false,
  6
),
(
  'Invoicing & Reporting Dashboard',
  'web_app',
  'Custom React + FastAPI dashboard that replaced a Nairobi SME client''s manual Excel-based invoicing workflow. Automated PDF generation, WhatsApp notification via Africa''s Talking, and a live analytics panel. Reduced manual effort by 80%.',
  ARRAY['React', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL', 'Docker', 'Africa''s Talking API'],
  '#',
  '#',
  '/assets/images/projects/dashboard.png',
  ARRAY['Dashboard', 'Automation', 'FastAPI', 'React', 'Kenya'],
  false,
  7
),
(
  'ambooka.dev — Portfolio Platform',
  'web_app',
  'This portfolio site itself — a Next.js 16 + Supabase application with an admin CMS, AI-generated resume variants, GitHub sync, Playwright e2e tests, and a 3D robot FAB. Serves as both a portfolio and a Phase 1–2 V4 reference architecture.',
  ARRAY['Next.js', 'TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Playwright', 'Framer Motion'],
  'https://github.com/ambooka/ambooka',
  'https://ambooka.dev',
  '/assets/images/projects/portfolio.png',
  ARRAY['Portfolio', 'Next.js', 'Supabase', 'Admin CMS', 'Full-Stack'],
  false,
  8
);


-- =====================================================================
-- 5. SKILLS  (Phase 1 CORE skills at high proficiency; future phases lower)
-- =====================================================================

-- Clear all existing skills
DELETE FROM skills;

-- Reset constraints
ALTER TABLE public.skills DROP CONSTRAINT IF EXISTS skills_category_check;
ALTER TABLE public.skills
  ADD CONSTRAINT skills_category_check
  CHECK (category IN ('Languages', 'Frameworks', 'Tools', 'Cloud', 'Databases', 'Other'));

INSERT INTO public.skills (name, category, proficiency, display_order, is_featured) VALUES

-- ── Languages (Phase 1 CORE) ──────────────────────────────────────────────
('Python',        'Languages',  85, 1, true),
('SQL',           'Languages',  82, 2, true),
('Bash',          'Languages',  70, 3, false),
('TypeScript',    'Languages',  72, 4, true),
('JavaScript',    'Languages',  70, 5, false),

-- ── Frameworks (Phase 1 building; Phase 2–4 upcoming) ────────────────────
('React',         'Frameworks', 68, 1, true),
('Node.js',       'Frameworks', 65, 2, true),
('FastAPI',       'Frameworks', 55, 3, true),
('Express.js',    'Frameworks', 60, 4, false),
('Next.js',       'Frameworks', 65, 5, false),
('PyTorch',       'Frameworks', 35, 6, true),
('scikit-learn',  'Frameworks', 38, 7, false),
('HuggingFace',   'Frameworks', 30, 8, true),
('LangChain',     'Frameworks', 20, 9, true),
('LangGraph',     'Frameworks', 10, 10, false),

-- ── Cloud (Phase 2 target) ────────────────────────────────────────────────
('Docker',        'Cloud', 75, 1, true),
('Kubernetes',    'Cloud', 40, 2, true),
('AWS',           'Cloud', 38, 3, true),
('Terraform',     'Cloud', 32, 4, true),
('Nginx',         'Cloud', 65, 5, false),
('Hetzner VPS',   'Cloud', 80, 6, false),

-- ── Tools (Phase 1–2 CORE) ───────────────────────────────────────────────
('Git & GitHub Actions', 'Tools', 80, 1, true),
('Docker Compose',       'Tools', 75, 2, true),
('Prometheus + Grafana', 'Tools', 32, 3, true),
('MLflow',               'Tools', 18, 4, true),
('DVC',                  'Tools', 20, 5, false),
('Airflow',              'Tools', 18, 6, false),
('pytest',               'Tools', 78, 7, false),

-- ── Databases ─────────────────────────────────────────────────────────────
('PostgreSQL',  'Databases', 78, 1, true),
('Redis',       'Databases', 45, 2, false),
('pgvector',    'Databases', 15, 3, true),
('Supabase',    'Databases', 72, 4, false)

ON CONFLICT DO NOTHING;


-- =====================================================================
-- 6. KPI STATS
-- =====================================================================
DELETE FROM public.kpi_stats WHERE section IN ('hero', 'header');

INSERT INTO public.kpi_stats (label, value, color, type, section, display_order) VALUES
('Phases',       '5',           '',                                 'solid',   'header', 1),
('Weekly Projs', '104',         '',                                 'solid',   'header', 2),
('Timeline',     '26 Months',   '',                                 'solid',   'header', 3),
('Current Phase','Phase 1 / 5', 'bg-[#2a2a2a] text-white',         'solid',   'hero',   1),
('Target Role',  'AI/ML Eng.',  'bg-[#facc15] text-[#2a2a2a]',     'solid',   'hero',   2),
('Timeline Goal','26 Months',   'bg-blue-600 text-white',           'solid',   'hero',   3),
('Projects Done','3 / 104',     'border-gray-300',                  'outline', 'hero',   4);


-- =====================================================================
-- 7. ABOUT CONTENT  (expertise cards shown in dashboard)
-- =====================================================================
DELETE FROM public.about_content;

INSERT INTO public.about_content (section_key, title, content, icon, badge, display_order, is_active) VALUES
(
  'about_text', NULL,
  'CS graduate from Maseno University building toward an AI/ML Engineer role through a structured 26-month plan — the Nexus platform. Every week I ship a project to GitHub. Every phase ships a live deployment to ambooka.dev. The CS degree cuts Phase 1–2 by ~40%, letting me reach the AI/ML work faster. Currently: Phase 1 — Foundations & Tooling.',
  NULL, NULL, 0, true
),
(
  'expertise_foundation',
  'Software Engineering',
  'Python OOP, type hints, pytest, decorators, generators. TypeScript with strict mode. Node.js REST APIs with OpenAPI specs, JWT auth, and BullMQ async queues. PostgreSQL with proper indexing, transactions, and migrations.',
  'Code', 'Phase 1–2', 1, true
),
(
  'expertise_infra',
  'Cloud & Infrastructure',
  'Docker Compose and multi-stage builds for clean container images. k3s Kubernetes with Helm charts, HPA, RBAC, and Persistent Volumes. Terraform modules managing AWS VPC, EC2, S3, and ECS. Everything infrastructure-as-code.',
  'Server', 'Phase 2', 2, true
),
(
  'expertise_observability',
  'Observability',
  'Prometheus + Grafana dashboards with alerting rules. Loki + Promtail for centralised log aggregation. GitHub Actions CI/CD pipelines: lint → test → build → push GHCR → deploy to VPS. Automated rollback on smoke test failure.',
  'Activity', 'Phase 2', 3, true
),
(
  'expertise_ml',
  'Machine Learning',
  'PyTorch from scratch (MLP → CNN → LSTM → Transformer). HuggingFace fine-tuning with Trainer API. scikit-learn pipelines with Optuna hyperparameter tuning. FastAPI model serving with SHAP explanations. DVC data versioning.',
  'Brain', 'Phase 3', 4, true
),
(
  'expertise_ai',
  'AI / LLM Engineering',
  'RAG architectures — naive through advanced (hybrid BM25 + vector, cross-encoder re-ranking, HyDE). LangChain LCEL chains. QLoRA fine-tuning on domain datasets. MLflow model registry with automated quality gates. Evidently drift detection.',
  'Bot', 'Phase 4', 5, true
),
(
  'expertise_agents',
  'Agentic Systems',
  'LangGraph state machines with TypedDict state, conditional edges, and human-in-the-loop interrupts. Multi-agent supervisor networks (LangGraph + CrewAI + AutoGen). Tool use, long-term vector memory, and adversarial safety testing.',
  'Zap', 'Phase 5', 6, true
);


-- =====================================================================
-- 8. ROADMAP PHASES  (5-phase Nexus plan)
-- =====================================================================

-- Ensure table exists (idempotent)
CREATE TABLE IF NOT EXISTS public.roadmap_phases (
  phase_number    INTEGER PRIMARY KEY,
  title           TEXT NOT NULL,
  duration_months INTEGER,
  experience_label TEXT,
  start_date_label TEXT,
  target_role     TEXT,
  status          TEXT CHECK (status IN ('completed','in_progress','upcoming')) DEFAULT 'upcoming',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access"             ON public.roadmap_phases;
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.roadmap_phases;
CREATE POLICY "Allow public read access"
  ON public.roadmap_phases FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated users to manage phases"
  ON public.roadmap_phases FOR ALL TO authenticated USING (true);

INSERT INTO public.roadmap_phases
  (phase_number, title, duration_months, experience_label, start_date_label, target_role, status)
VALUES
  (1, 'Foundations & Tooling',            4,  '3 Yrs Exp', 'Started 2025', 'Software Engineer',      'in_progress'),
  (2, 'Web Engineering & Cloud',          7,  '3 Yrs Exp', 'Starting M5',  'Full-Stack Engineer',    'upcoming'),
  (3, 'Data Science & Classical ML',      6,  '0 Yrs ML',  'Starting M12', 'ML Engineer I',          'upcoming'),
  (4, 'AI Engineering & MLOps',           6,  '0 Yrs AI',  'Starting M18', 'AI/ML Engineer',         'upcoming'),
  (5, 'Agentic AI & Production Hardening',3,  '0 Yrs Ag',  'Starting M24', 'Senior AI/ML Engineer',  'upcoming')
ON CONFLICT (phase_number) DO UPDATE SET
  title            = EXCLUDED.title,
  duration_months  = EXCLUDED.duration_months,
  experience_label = EXCLUDED.experience_label,
  start_date_label = EXCLUDED.start_date_label,
  target_role      = EXCLUDED.target_role,
  status           = EXCLUDED.status;


-- =====================================================================
-- 9. CERTIFICATIONS  (mapped to phases per the roadmap guide)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.certifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  phase_number INTEGER REFERENCES public.roadmap_phases(phase_number) ON DELETE CASCADE,
  is_obtained  BOOLEAN DEFAULT false,
  icon_url     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access"   ON public.certifications;
DROP POLICY IF EXISTS "Allow authenticated users to manage certs" ON public.certifications;
CREATE POLICY "Allow public read access"
  ON public.certifications FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated users to manage certs"
  ON public.certifications FOR ALL TO authenticated USING (true);

DELETE FROM public.certifications;

INSERT INTO public.certifications (name, phase_number, is_obtained, icon_url) VALUES

-- ── Already obtained ────────────────────────────────────────────────────
('B.Sc. Computer Science — Maseno University',  1, true,
 '/assets/badges/maseno.png'),

-- ── Phase 2  (Months 6–11) ──────────────────────────────────────────────
('AWS Cloud Practitioner (CLF-C02)',             2, false,
 'https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png'),
('HashiCorp Terraform Associate (003)',          2, false,
 'https://images.credly.com/size/340x340/images/99289602-861e-4929-8277-773e63a2fa6f/image.png'),
('Certified Kubernetes Administrator (CKA)',     2, false,
 'https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png'),

-- ── Phase 3  (Months 12–17) ─────────────────────────────────────────────
('AWS Solutions Architect — Associate (SAA-C03)',3, false,
 'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png'),
('DeepLearning.AI Machine Learning Specialization', 3, false,
 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-university-assets.s3.amazonaws.com/da/66e340f5654baf1651e6339bda77ae/DeepLearningAI-Logo-Square.png'),
('TensorFlow Developer Certificate',             3, false,
 'https://images.credly.com/size/340x340/images/b0607951-1a8a-49f3-9e37-98b8f01a0b8e/image.png'),

-- ── Phase 4  (Months 18–23) ─────────────────────────────────────────────
('AWS Machine Learning Specialty (MLS-C01)',     4, false,
 'https://images.credly.com/size/340x340/images/778bde6c-ad1c-4312-ac33-2fa40d50a147/image.png'),
('Hugging Face NLP Course Certificate',          4, false,
 'https://huggingface.co/front/thumbnails/course.png'),
('Google Professional ML Engineer',              4, false,
 'https://images.credly.com/size/340x340/images/3d07d90b-84b5-41fe-aef2-9a1af71a8498/image.png'),

-- ── Phase 5  (Months 24–26) ─────────────────────────────────────────────
('AI Safety Fundamentals — BlueDot Impact',      5, false,
 '/assets/badges/ai-safety.png'),
('DeepLearning.AI LLMOps',                       5, false,
 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-university-assets.s3.amazonaws.com/da/66e340f5654baf1651e6339bda77ae/DeepLearningAI-Logo-Square.png')

ON CONFLICT (name) DO UPDATE SET
  phase_number = EXCLUDED.phase_number,
  is_obtained  = EXCLUDED.is_obtained,
  icon_url     = EXCLUDED.icon_url;


-- =====================================================================
-- 10. PROJECTS TABLE  (separate from portfolio_content — roadmap view)
-- =====================================================================
DELETE FROM public.projects WHERE github_url LIKE '%ambooka%' OR github_url LIKE '%nixtio%';

INSERT INTO public.projects (title, description, stack, status, is_featured, display_order, github_url, live_url)
VALUES
(
  'Nexus v0.1 — The Toolbox',
  'Dockerised Python CLI + static HTTPS site on Hetzner VPS. GitHub Actions pipeline: lint → test → build → push GHCR → deploy.',
  ARRAY['Python 3.12', 'Docker Compose', 'Nginx', 'PostgreSQL', 'pytest', 'GitHub Actions'],
  'In Progress', true, 1,
  'https://github.com/ambooka/nexus', 'https://ambooka.dev'
),
(
  'Nexus v0.2 — The Platform',
  'Full-stack TypeScript monorepo on k3s Kubernetes. React SPA + Node.js API + AWS Terraform + Prometheus/Grafana.',
  ARRAY['TypeScript', 'React', 'Node.js', 'k3s', 'Helm', 'Terraform', 'AWS', 'Prometheus'],
  'Planned', true, 2,
  'https://github.com/ambooka/nexus', '#'
),
(
  'Nexus v0.3 — Intelligence Layer',
  'FastAPI ML service: HuggingFace transformer + scikit-learn classifier + SHAP explanations + DVC + CI quality gate.',
  ARRAY['PyTorch', 'HuggingFace', 'scikit-learn', 'FastAPI', 'DVC', 'SHAP', 'Airflow'],
  'Planned', true, 3,
  'https://github.com/ambooka/nexus', '#'
),
(
  'Nexus v0.4 — AI Platform',
  'RAG chatbot (hybrid search + re-ranking), QLoRA fine-tuned model in MLflow registry, Evidently drift detection, retraining pipeline.',
  ARRAY['LangChain', 'LlamaIndex', 'pgvector', 'MLflow', 'TorchServe', 'Evidently', 'OpenAI API'],
  'Planned', true, 4,
  'https://github.com/ambooka/nexus', '#'
),
(
  'Nexus v1.0 — Complete AI Platform',
  'Autonomous research agent (LangGraph supervisor), multi-agent pipelines, safety layer, red team report. Live at ambooka.dev.',
  ARRAY['LangGraph', 'CrewAI', 'AutoGen', 'Guardrails AI', 'Triton Inference Server'],
  'Planned', true, 5,
  'https://github.com/ambooka/nexus', 'https://ambooka.dev'
);


-- =====================================================================
-- VERIFY
-- =====================================================================
SELECT '=== PERSONAL INFO ==='      AS section;
SELECT full_name, title, location   FROM personal_info;

SELECT '=== EDUCATION ==='          AS section;
SELECT institution, degree, field_of_study FROM education ORDER BY display_order;

SELECT '=== EXPERIENCE ==='         AS section;
SELECT company, position, is_current FROM experience ORDER BY display_order;

SELECT '=== ROADMAP PHASES ==='     AS section;
SELECT phase_number, title, status  FROM roadmap_phases ORDER BY phase_number;

SELECT '=== CERTIFICATIONS ==='     AS section;
SELECT name, phase_number, is_obtained FROM certifications ORDER BY phase_number;

SELECT '=== SKILLS BY CATEGORY ===' AS section;
SELECT category, COUNT(*) AS cnt    FROM skills GROUP BY category ORDER BY category;

COMMIT;

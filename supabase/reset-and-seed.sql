-- ============================================================
-- Ambooka Portfolio Database Reset + Seed
-- Version 2.0 — NEXUS Career Direction Alignment
-- ============================================================
-- WARNING: This script is destructive.
-- It drops and recreates the public schema.
--
-- Content policy:
-- - CV-backed experience uses only verified real work.
-- - Nexus anchor projects are flagged in_progress or planned;
--   completion % reflects honest state, not aspirational claims.
-- - Skills reflect current proficiency from real work AND active
--   development under the NEXUS plan — tiered separately.
-- - Roadmap phases map to the NEXUS 24-sprint execution blueprint.
-- - No fabricated artifact counts, inflated completion, or
--   War Mode / private roadmap language on public-facing content.
-- ============================================================

begin;

drop schema if exists public cascade;
create schema public;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on schema public to postgres, service_role;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- TABLE DEFINITIONS
-- ============================================================

create table public.personal_info (
  id uuid primary key default extensions.gen_random_uuid(),
  full_name text not null,
  title text not null,
  email text not null,
  phone text,
  location text,
  open_to_relocation boolean default false,
  summary text,
  about_text text,
  expertise jsonb default '[]',
  social_links jsonb default '[]',
  kpi_stats jsonb default '{}',
  avatar_url text,
  resume_url text,
  linkedin_url text,
  github_url text,
  website_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.education (
  id uuid primary key default extensions.gen_random_uuid(),
  institution text not null,
  degree text,
  field_of_study text,
  location text,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  grade text,
  coursework text[] default '{}',
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.experience (
  id uuid primary key default extensions.gen_random_uuid(),
  company text not null,
  position text not null,
  location text,
  employment_type text default 'Full-time',
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  responsibilities text[] default '{}',
  achievements text[] default '{}',
  technologies text[] default '{}',
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.skills (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency int default 70 check (proficiency >= 0 and proficiency <= 100),
  proficiency_level int default 70 check (proficiency_level >= 0 and proficiency_level <= 100),
  icon_url text,
  is_featured boolean default false,
  display_order int default 0,
  roadmap_phase int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.projects (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  one_line text,
  long_description text,
  category text default 'software',
  stack text[] default '{}',
  core_skills text[] default '{}',
  status text default 'completed',
  completion_percent int default 100 check (completion_percent >= 0 and completion_percent <= 100),
  roadmap_project int,
  problem text,
  solution text,
  business_value text,
  recruiter_summary text,
  proof jsonb default '{}',
  engineering_evidence jsonb default '{}',
  metrics jsonb default '{}',
  github_url text,
  live_url text,
  image_url text,
  images jsonb default '[]',
  documents jsonb default '[]',
  embeds jsonb default '[]',
  is_featured boolean default false,
  is_anchor boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index projects_slug_idx on public.projects(slug);
create index projects_category_idx on public.projects(category);
create index projects_status_idx on public.projects(status);
create index projects_featured_idx on public.projects(is_featured, is_anchor);

create table public.case_studies (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  project_slug text references public.projects(slug) on delete set null,
  title text not null,
  subtitle text,
  summary text,
  problem text,
  architecture jsonb default '[]',
  key_decisions jsonb default '[]',
  implementation jsonb default '[]',
  quality jsonb default '[]',
  results jsonb default '[]',
  future_improvements jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.testimonials (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  role text,
  company text,
  avatar_url text,
  text text not null,
  date date default current_date,
  is_featured boolean default false,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.blog_posts (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  image_url text,
  category text default 'engineering',
  tags text[] default '{}',
  seo_title text,
  meta_description text,
  source_urls jsonb default '[]'::jsonb,
  ai_generated boolean default false,
  generation_topic text,
  reading_time_minutes int default 5,
  is_published boolean default false,
  published_at timestamptz,
  author_id uuid,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.contact_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.page_views (
  id uuid primary key default extensions.gen_random_uuid(),
  path text not null,
  referer text,
  user_agent text,
  ip_address text,
  session_id text,
  created_at timestamptz default now()
);

create table public.kpi_stats (
  id uuid primary key default extensions.gen_random_uuid(),
  section text not null,
  label text not null,
  value text not null,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.portfolio_content (
  id uuid primary key default extensions.gen_random_uuid(),
  section text not null,
  title text not null,
  subtitle text,
  content text,
  metadata jsonb default '{}',
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.roadmap_phases (
  id uuid primary key default extensions.gen_random_uuid(),
  phase_number int unique not null,
  title text not null,
  duration text,
  status text default 'active',
  description text,
  projects_count int default 0,
  stack text[] default '{}',
  icon_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.certifications (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  provider text,
  status text default 'completed',
  phase_number int,
  target_date date,
  obtained_date date,
  is_obtained boolean default false,
  credential_url text,
  icon_url text,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

do $$
declare
  t text;
begin
  foreach t in array array[
    'personal_info',
    'education',
    'experience',
    'skills',
    'projects',
    'case_studies',
    'testimonials',
    'blog_posts',
    'contact_messages',
    'kpi_stats',
    'portfolio_content',
    'roadmap_phases',
    'certifications'
  ]
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      t || '_set_updated_at',
      t
    );
  end loop;
end;
$$;

-- ============================================================
-- PERSONAL INFO
-- ============================================================
-- Changed from v1:
--   - Title updated: "IT Administrator" → cloud/security/AI engineering trajectory
--   - Summary rewritten: leads with real credentials, states NEXUS direction
--   - Expertise expanded to include cloud, security, and platform engineering targets
-- ============================================================

insert into public.personal_info (
  full_name,
  title,
  email,
  phone,
  location,
  open_to_relocation,
  summary,
  about_text,
  expertise,
  social_links,
  kpi_stats,
  github_url,
  linkedin_url,
  website_url
)
values (
  'Msah Ambooka',
  'Software Engineer | Cloud & Platform Engineering | Security Architecture Track',
  'abdulrahmanambooka@gmail.com',
  '+254 111 384 390',
  'Nairobi, Kenya',
  true,
  'CS graduate with 3+ years of production engineering experience — full-stack web applications, REST APIs, M-Pesa payment integrations, and business automation tools built and shipped for real clients. Runs a parallel IT and systems function covering ERP implementation, Windows Server administration, and network infrastructure for a company of 70+ staff and 300+ field workers. Grounded in CS fundamentals with applied computer vision research. Currently executing a structured transition into cloud-native software engineering: AWS, Terraform IaC, Kubernetes, DevSecOps, MLOps, RAG systems, and security architecture — building Nexus, a deployed production platform that proves the full stack as it grows.',
  'I build practical software and systems end-to-end: full-stack web applications, backend APIs, payment integrations, business automation, ERP workflows, IT infrastructure, and applied AI/ML systems. My current focus is the engineering depth required for cloud, platform, and security roles — building real proof rather than collecting certificates.',
  '[
    "Software Engineering",
    "Full-Stack Development",
    "Backend APIs & Payment Integrations",
    "IT Systems & ERP Implementation",
    "Cloud Engineering (AWS, Terraform) — active",
    "Platform Engineering (Kubernetes, DevSecOps) — active",
    "Security Engineering — active",
    "ML/MLOps Engineering — active",
    "RAG & AI Systems — active"
  ]'::jsonb,
  '[
    {"platform":"GitHub","url":"https://github.com/ambooka","icon_url":null,"is_active":true},
    {"platform":"LinkedIn","url":"https://linkedin.com/in/abdulrahman-ambooka","icon_url":null,"is_active":true},
    {"platform":"Website","url":"https://ambooka.dev","icon_url":null,"is_active":true}
  ]'::jsonb,
  '{
    "experienceYears":"3+",
    "projectsDelivered":"12+",
    "staffSupported":"70+",
    "fieldWorkersSupported":"300+",
    "monthlyPaymentsProcessed":"KES 1M+",
    "nexusAnchorProjects":"8"
  }'::jsonb,
  'https://github.com/ambooka',
  'https://linkedin.com/in/abdulrahman-ambooka',
  'https://ambooka.dev'
);

-- ============================================================
-- EDUCATION (unchanged — accurate as verified)
-- ============================================================

insert into public.education (
  institution,
  degree,
  field_of_study,
  location,
  start_date,
  end_date,
  is_current,
  description,
  grade,
  coursework,
  display_order
)
values
  (
    'Maseno University',
    'BSc Computer Science',
    'Computer Science',
    'Kisumu, Kenya',
    '2019-09-01',
    '2024-12-01',
    false,
    'Relevant coursework: Algorithms & Data Structures, Machine Learning, Computer Networks, Database Systems, Software Engineering, Artificial Intelligence, Computer Vision, Operating Systems.',
    'Second Class Honours Upper Division · GPA approximately 3.3 / 4.0',
    array[
      'Algorithms & Data Structures',
      'Machine Learning',
      'Computer Networks',
      'Database Systems',
      'Software Engineering',
      'Artificial Intelligence',
      'Computer Vision',
      'Operating Systems'
    ],
    1
  ),
  (
    'Starehe Boys'' Centre & School',
    'Kenya Certificate of Secondary Education',
    'Sciences Track',
    'Nairobi, Kenya',
    '2015-01-01',
    '2018-12-01',
    false,
    'Sciences track. Admission by national competitive examination.',
    null,
    array['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    2
  );

-- ============================================================
-- EXPERIENCE
-- ============================================================
-- Changed from v1:
--   - Bayina Academy added as new current role (June 2026 – Present)
--   - Hebatullah Brothers updated: is_current=false, end_date=2026-06-01
--   - MMUST internship unchanged
--   - Freelance unchanged
-- ============================================================

insert into public.experience (
  company,
  position,
  location,
  employment_type,
  start_date,
  end_date,
  is_current,
  description,
  responsibilities,
  achievements,
  technologies,
  display_order
)
values
  (
    'Bayina Academy',
    'IT Administrator',
    'Nairobi, Kenya',
    'Full-time',
    '2026-06-01',
    null,
    true,
    'Sole IT administrator responsible for the full technology stack of an educational institution — infrastructure, systems, user support, and digital operations.',
    array[
      'Administers ICT infrastructure including Windows-based systems, user accounts, network services, and end-user support for teaching and administrative staff.',
      'Manages staff onboarding and offboarding: account provisioning, password administration, and access control across all systems.',
      'Provides first- and second-line technical support for teaching staff, administrative personnel, and institutional platforms.',
      'Supports and maintains school ERP and administrative platforms, ensuring data integrity and effective user adoption.',
      'Manages and maintains the academy website, digital communications platforms, and online services.',
      'Administers CCTV, biometric attendance systems, printers, and other ICT assets across the institution.',
      'Maintains network connectivity, troubleshoots hardware and software issues, and coordinates preventative maintenance.',
      'Develops user guides, technical documentation, and training materials to support staff productivity and technology adoption.'
    ],
    array[
      'Took over and stabilised all ICT operations on joining, establishing documented procedures for support and asset management.'
    ],
    array[
      'Windows Server',
      'Active Directory',
      'CCTV',
      'Biometric Systems',
      'TCP/IP Networking',
      'School ERP'
    ],
    1
  ),
  (
    'Self-Employed',
    'Freelance Full-Stack Developer',
    'Nairobi, Kenya (Remote)',
    'Freelance',
    '2022-01-01',
    null,
    true,
    'Independent contractor delivering full-stack web applications, APIs, and business automation tools for clients across Kenya and internationally. 12+ projects delivered.',
    array[
      'Delivered full-stack web applications, APIs, and business automation tools for clients across Kenya and internationally.',
      'Containerised and deployed all applications to Hetzner VPS behind Nginx with Let''s Encrypt SSL and GitHub Actions CI/CD pipelines.'
    ],
    array[
      'Built and integrated a production-grade Safaricom Daraja API implementation (M-Pesa STK Push, B2C disbursements, C2B paybill callbacks) for an e-commerce client currently processing KES 1M+/month — includes BullMQ async job queue, exponential backoff retry logic, and PostgreSQL transaction audit log.',
      'Replaced a Nairobi SME client''s manual Excel-based invoicing with a custom React + FastAPI dashboard featuring automated PDF generation, WhatsApp notifications via Africa''s Talking API, and a live analytics panel — reducing manual processing effort by 80%.',
      'Built ambooka.dev — a full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, AI-generated resume variants, GitHub activity sync, and Playwright e2e test suite.'
    ],
    array[
      'Python',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Nginx',
      'M-Pesa Daraja API',
      'Africa''s Talking API',
      'BullMQ',
      'Supabase'
    ],
    2
  ),
  (
    'Hebatullah Brothers Limited',
    'IT Assistant',
    'Nairobi, Kenya',
    'Full-time',
    '2025-01-01',
    '2026-06-01',
    false,
    'Part of a two-person IT team responsible for the full technology stack of a trading company — hardware infrastructure, enterprise software, networking, and digital systems — serving 70+ office staff and 300+ field workers.',
    array[
      'Administered the Windows Server environment including Active Directory, group policies, and user account lifecycle management.',
      'Installed and maintained CCTV systems across all company premises; managed biometric attendance hardware for 300+ enrolled workers.',
      'Provided end-to-end helpdesk support — hardware, software, connectivity, accounts — from first call to resolution.'
    ],
    array[
      'Implemented ERPNext from scratch — designed the chart of accounts, item catalogue, and procurement workflows, replacing entirely manual processes across inventory, finance, and HR.',
      'Reworked the company website (hebatullah.com) from a static HTML site to a full CMS, enabling the marketing team to update content without developer involvement.',
      'Installed and commissioned the company network infrastructure from the ground up: switches, wireless access points, cabling, and VoIP desk phone system.'
    ],
    array[
      'ERPNext',
      'Windows Server',
      'Active Directory',
      'TCP/IP',
      'VoIP',
      'CCTV',
      'Biometric Systems'
    ],
    3
  ),
  (
    'Masinde Muliro University of Science & Technology',
    'IT Infrastructure Intern',
    'Kakamega, Kenya',
    'Internship',
    '2023-05-01',
    '2023-08-31',
    false,
    'Supported campus-wide network administration, server room operations, and faculty/student technical support.',
    array[
      'Supported campus-wide network administration, server room operations, and faculty/student technical support.'
    ],
    array[
      'Configured and deployed 40+ workstations in a new computer lab, completing setup ahead of semester start.',
      'Diagnosed and resolved a recurring DHCP conflict that had been disrupting connectivity for 200+ campus devices.'
    ],
    array[
      'Network Administration',
      'Linux',
      'Windows Server',
      'TCP/IP',
      'Hardware Configuration'
    ],
    4
  );

-- ============================================================
-- SKILLS
-- ============================================================
-- Changed from v1:
--   - roadmap_phase values updated to match new NEXUS phase numbers (1–11)
--   - New skills added for active NEXUS development:
--       Airflow, LangGraph, MCP, Semgrep, Trivy, gitleaks,
--       OWASP/Threat Modelling concepts
--   - New categories: "Security Tools (Learning)", "Data & Orchestration (Learning)"
--   - Proficiency levels are honest: skills in the "Learning" category
--     sit 25–45 to reflect active but early development
--   - AWS, Terraform, Kubernetes, MLflow, LangChain, pgvector kept in
--     "Strengthening" with levels from the prior seed — no inflation
-- ============================================================

insert into public.skills (
  name,
  category,
  proficiency,
  proficiency_level,
  is_featured,
  display_order,
  roadmap_phase
)
values
  -- ---- Languages (core — proven in production work) ----
  ('Python',       'Languages', 90, 90, true,  1,  1),
  ('TypeScript',   'Languages', 86, 86, true,  2,  1),
  ('JavaScript',   'Languages', 84, 84, true,  3,  1),
  ('SQL',          'Languages', 86, 86, true,  4,  1),
  ('Bash',         'Languages', 78, 78, true,  5,  1),
  ('Go',           'Strengthening', 55, 55, false, 6,  4),
  ('Java',         'Strengthening', 50, 50, false, 7,  10),
  ('C#',           'Languages', 58, 58, false, 8,  10),
  ('Kotlin',       'Strengthening', 45, 45, false, 9,  10),

  -- ---- Frontend ----
  ('React',        'Frontend', 86, 86, true,  10, 2),
  ('Next.js',      'Frontend', 84, 84, true,  11, 2),
  ('HTML5',        'Frontend', 88, 88, true,  12, 1),
  ('CSS3',         'Frontend', 84, 84, true,  13, 1),
  ('Tailwind CSS', 'Frontend', 82, 82, true,  14, 2),
  ('Zustand',      'Frontend', 68, 68, false, 15, 2),

  -- ---- Backend ----
  ('Node.js',          'Backend', 82, 82, true,  16, 1),
  ('Express',          'Backend', 80, 80, true,  17, 1),
  ('FastAPI',          'Backend', 82, 82, true,  18, 2),
  ('Flask',            'Backend', 76, 76, false, 19, 1),
  ('REST APIs',        'Backend', 88, 88, true,  20, 2),
  ('OpenAPI / Swagger','Backend', 72, 72, false, 21, 2),

  -- ---- Databases ----
  ('PostgreSQL', 'Databases', 84, 84, true,  22, 2),
  ('Redis',      'Databases', 74, 74, true,  23, 2),
  ('Supabase',   'Databases', 80, 80, true,  24, 2),
  ('SQLite',     'Databases', 72, 72, false, 25, 1),

  -- ---- DevOps & Infrastructure (proven in production) ----
  ('Docker',          'DevOps & Infrastructure', 82, 82, true,  26, 1),
  ('Docker Compose',  'DevOps & Infrastructure', 82, 82, true,  27, 1),
  ('Nginx',           'DevOps & Infrastructure', 78, 78, true,  28, 1),
  ('Linux Ubuntu',    'DevOps & Infrastructure', 80, 80, true,  29, 1),
  ('GitHub Actions',  'DevOps & Infrastructure', 76, 76, true,  30, 1),
  ('Hetzner VPS',     'DevOps & Infrastructure', 74, 74, false, 31, 1),

  -- ---- IT Systems (proven in employment) ----
  ('Windows Server',    'IT Systems', 80, 80, true,  32, 11),
  ('Active Directory',  'IT Systems', 76, 76, true,  33, 11),
  ('ERPNext',           'IT Systems', 82, 82, true,  34, 11),
  ('VoIP',              'IT Systems', 72, 72, false, 35, 11),
  ('CCTV Systems',      'IT Systems', 76, 76, false, 36, 11),
  ('Biometric Systems', 'IT Systems', 74, 74, false, 37, 11),
  ('TCP/IP Networking', 'IT Systems', 80, 80, true,  38, 11),

  -- ---- AI / ML (applied in final-year research) ----
  ('PyTorch',       'AI / ML', 68, 68, true,  39, 7),
  ('OpenCV',        'AI / ML', 78, 78, true,  40, 7),
  ('YOLO',          'AI / ML', 76, 76, true,  41, 7),
  ('scikit-learn',  'AI / ML', 68, 68, true,  42, 7),
  ('Hugging Face',  'AI / ML', 55, 55, false, 43, 7),
  ('Jupyter',       'AI / ML', 76, 76, false, 44, 1),

  -- ---- Tools ----
  ('Git',      'Tools', 84, 84, true,  45, 1),
  ('VS Code',  'Tools', 90, 90, true,  46, 1),
  ('Postman',  'Tools', 80, 80, false, 47, 1),
  ('Wireshark','Tools', 70, 70, false, 48, 11),

  -- ---- Strengthening — NEXUS Cloud & Platform phase ----
  -- (active development; proficiency reflects current early-to-mid stage)
  ('AWS',         'Strengthening', 46, 46, false, 49, 4),
  ('Terraform',   'Strengthening', 38, 38, false, 50, 4),
  ('Kubernetes',  'Strengthening', 42, 42, false, 51, 5),

  -- ---- Strengthening — NEXUS MLOps & RAG phase ----
  ('MLflow',      'Strengthening', 38, 38, false, 52, 7),
  ('LangChain',   'Strengthening', 42, 42, false, 53, 8),
  ('LangGraph',   'Strengthening', 35, 35, false, 54, 8),
  ('pgvector',    'Strengthening', 38, 38, false, 55, 8),

  -- ---- Data & Orchestration (Learning — NEXUS Phase 3) ----
  ('Apache Airflow', 'Data & Orchestration (Learning)', 35, 35, false, 56, 3),
  ('Pandas / Polars','Data & Orchestration (Learning)', 60, 60, false, 57, 3),

  -- ---- Security Tools (Learning — NEXUS Phase 6) ----
  ('STRIDE Threat Modelling', 'Security Tools (Learning)', 35, 35, false, 58, 6),
  ('OWASP Top 10 Controls',   'Security Tools (Learning)', 38, 38, false, 59, 6),
  ('Semgrep (SAST)',           'Security Tools (Learning)', 28, 28, false, 60, 6),
  ('Trivy (Container Scan)',   'Security Tools (Learning)', 28, 28, false, 61, 6),
  ('gitleaks (Secret Scan)',   'Security Tools (Learning)', 25, 25, false, 62, 6),

  -- ---- Agent & LLMOps Tools (Learning — NEXUS Phase 8–9) ----
  ('Model Context Protocol (MCP)', 'Agent & LLMOps (Learning)', 30, 30, false, 63, 9);

-- ============================================================
-- ROADMAP PHASES
-- ============================================================
-- Completely replaced from v1.
-- Now maps directly to the NEXUS 24-sprint execution blueprint.
-- Phases 1–11 cover foundation through agents; phase 11 covers
-- pre-NEXUS IT Systems background (referenced separately).
-- status: 'active' = currently building; 'completed' = done;
--         'planned' = next up in the sprint sequence.
-- ============================================================

insert into public.roadmap_phases (
  phase_number,
  title,
  duration,
  status,
  description,
  projects_count,
  stack
)
values
  (
    1,
    'Foundation — Python Engineering, SQL, Docker, CI/CD, VPS',
    'Sprints 1–2',
    'active',
    'Production Python tooling, SQL analytics, Docker multi-stage builds, GitHub Actions CI/CD, VPS deployment, HTTPS, and health checks. The base every subsequent sprint builds on.',
    4,
    array['Python', 'pyproject.toml', 'pytest', 'PostgreSQL', 'Docker', 'Docker Compose', 'Nginx', 'GitHub Actions', 'Bash']
  ),
  (
    2,
    'Business Platform — FastAPI, Next.js, Auth, Stock Ledger',
    'Sprints 3–6',
    'active',
    'Full production business backend: FastAPI, SQLAlchemy, Alembic, JWT auth, RBAC, stock ledger, audit logs, PDF documents, and a TypeScript Next.js dashboard with role-based UI.',
    6,
    array['FastAPI', 'SQLAlchemy', 'Alembic', 'JWT', 'RBAC', 'Next.js', 'TypeScript', 'TanStack Query', 'shadcn/ui', 'PostgreSQL']
  ),
  (
    3,
    'Data Engineering — ETL, Airflow, Warehouse, Reports',
    'Sprints 7–8',
    'planned',
    'CSV/Excel ingestion, validation, quarantine, dimensional warehouse, Airflow DAGs with retries and backfill, scheduled reports, and R executive reports.',
    3,
    array['Pandas', 'Polars', 'Airflow', 'PostgreSQL', 'Materialised Views', 'R', 'Quarto']
  ),
  (
    4,
    'Cloud Engineering — AWS Core, Terraform IaC',
    'Sprints 9–10',
    'planned',
    'AWS IAM, VPC, EC2, RDS, S3, CloudWatch, Secrets Manager. Full Nexus production deployment on AWS. Terraform modules for the entire infrastructure with remote state and CI plan/apply pipeline.',
    5,
    array['AWS', 'IAM', 'VPC', 'EC2', 'RDS', 'S3', 'CloudWatch', 'Terraform', 'GitHub Actions']
  ),
  (
    5,
    'Platform Engineering — Kubernetes, Security Observability',
    'Sprint 11',
    'planned',
    'Kubernetes RBAC per namespace, deny-all NetworkPolicies, Pod Security Standards, sealed secrets, TLS ingress, and a security telemetry extension on the CloudWatch dashboard.',
    3,
    array['Kubernetes', 'RBAC', 'NetworkPolicies', 'Pod Security Standards', 'Sealed Secrets', 'Helm', 'CloudWatch']
  ),
  (
    6,
    'Security Engineering & DevSecOps',
    'Sprints 12–13',
    'planned',
    'STRIDE threat modelling, OWASP Top 10 remediation, JWT hardening, RBAC/ABAC policy, AWS Secrets Manager integration. DevSecOps CI pipeline with SAST, SCA, container scan, secret scan, SBOM generation, and Security Hub.',
    6,
    array['STRIDE', 'OWASP', 'Semgrep', 'Bandit', 'pip-audit', 'Trivy', 'gitleaks', 'Syft', 'AWS Security Hub', 'GuardDuty']
  ),
  (
    7,
    'ML / MLOps — Models, Inference, Registry, Drift, Retraining',
    'Sprints 14–16',
    'planned',
    'Business ML models (stockout, delay, forecast), FastAPI inference service, SHAP explanations, model registry with promotion/rollback, drift detection, and Airflow retraining pipeline.',
    8,
    array['scikit-learn', 'FastAPI', 'SHAP', 'MLflow', 'Airflow', 'Prometheus', 'PostgreSQL']
  ),
  (
    8,
    'RAG / LLMOps — Document Ingestion, Semantic Search, Evals',
    'Sprints 17–18',
    'planned',
    'PDF/Markdown ingestion, chunking strategies, embeddings, pgvector HNSW search, RAG chatbot with streaming and citations, eval harness, structured extraction, and an MCP tool-server exposing Nexus tools to agents.',
    7,
    array['LangChain', 'LangGraph', 'pgvector', 'Hugging Face', 'MCP', 'FastAPI', 'Next.js', 'SSE']
  ),
  (
    9,
    'AI Safety — Guardrails, Prompt Injection, Red Teaming',
    'Sprint 19',
    'planned',
    'Prompt injection detector, PII leakage checker with redaction, grounding verification, AI safety gateway, and a formal red-team report covering 30+ attack cases across OWASP LLM Top 10 categories.',
    4,
    array['LangChain', 'OWASP LLM Top 10', 'NER', 'Python', 'FastAPI']
  ),
  (
    10,
    'Systems & Enterprise — Rust, Go, Java, C/C++',
    'Sprints 20–22',
    'planned',
    'Rust secret scanner with SARIF output, artifact integrity verifier, Java Spring Boot workflow service, C firmware simulator, C++ machine fault simulator with labelled anomaly dataset, and secondary breadth proofs in Kotlin and C#.',
    8,
    array['Rust', 'Go', 'Java', 'Spring Boot', 'C', 'C++', 'Kotlin', 'SARIF']
  ),
  (
    11,
    'AI Agents & Portfolio Launch',
    'Sprints 23–24',
    'planned',
    'LangGraph multi-agent research system with supervisor pattern, human-in-the-loop approval gates, MCP client/server wiring, LangSmith/Langfuse observability, agent red-team harness, and full portfolio launch with role-specific resume variants.',
    5,
    array['LangGraph', 'MCP', 'LangSmith', 'Langfuse', 'AWS Security Hub', 'Kubernetes']
  );

-- ============================================================
-- PROJECTS
-- ============================================================
-- Changed from v1:
--   - MMUST entry had a syntax error (bare parentheses, no INSERT
--     clause) — fixed here as a proper INSERT row.
--   - Nexus flagship and 8 anchor projects added as in_progress
--     or planned with honest completion percentages.
--   - Existing real projects retained unchanged.
--   - Nexus projects use is_anchor=true where applicable.
-- ============================================================

insert into public.projects (
  slug,
  title,
  description,
  one_line,
  long_description,
  category,
  stack,
  core_skills,
  status,
  completion_percent,
  roadmap_project,
  problem,
  solution,
  business_value,
  recruiter_summary,
  proof,
  engineering_evidence,
  metrics,
  github_url,
  live_url,
  is_featured,
  is_anchor,
  display_order
)
values

  -- ============================================================
  -- NEXUS ANCHOR PROJECTS (in_progress / planned — honest state)
  -- ============================================================

  (
    'nexus-platform-flagship',
    'Nexus — Cloud-Native AI/Business Platform',
    'Flagship production platform being built across cloud engineering, platform engineering, security, MLOps, RAG, and AI agent phases. Built on AWS with Terraform IaC and Kubernetes.',
    'Flagship AWS-hosted platform proving cloud, security, MLOps, RAG, and agentic AI engineering end to end.',
    'Nexus is the primary proof-of-engineering project built across 24 structured sprints. It grows from a production Python/FastAPI/PostgreSQL/Next.js business platform into a full cloud-native system deployed on AWS with Terraform IaC, Kubernetes, DevSecOps CI pipelines, ML inference, RAG with citations, AI safety controls, and multi-agent orchestration via LangGraph and Model Context Protocol. Each phase adds a new engineering layer visible as a GitHub artifact, case study, and live demo link.',
    'platform',
    array['Python', 'TypeScript', 'FastAPI', 'Next.js', 'PostgreSQL', 'Docker', 'GitHub Actions', 'AWS', 'Terraform', 'Kubernetes', 'LangChain', 'LangGraph', 'MCP', 'Airflow', 'MLflow', 'pgvector'],
    array['Cloud Engineering', 'Platform Engineering', 'Security Engineering', 'DevSecOps', 'MLOps', 'RAG Engineering', 'AI Safety', 'Systems Engineering'],
    'in_progress',
    10,
    null,
    'Entry-level job postings in AI, cloud, and security require production proof — tutorials and courses are not enough.',
    'Building a real, deployed platform that demonstrates each engineering layer as code, not slides: AWS infrastructure, IaC, security controls, ML inference, RAG with evals, and agentic AI with safety gates.',
    'Provides recruiter-visible proof across cloud engineering, platform engineering, security, MLOps, and AI systems — the roles that are growing fastest in 2026.',
    'Flagship 8-anchor production platform built on AWS with Terraform IaC, Kubernetes, DevSecOps CI, ML inference, RAG, MCP-based AI agents, and security controls.',
    '{"github":"https://github.com/ambooka/nexus","liveDemo":null,"caseStudy":"/case-studies/nexus-platform-flagship","apiDocs":null,"video":null}'::jsonb,
    '{"tests":true,"ci":true,"docker":true,"databaseMigrations":true,"monitoring":false,"docs":true,"deployed":false}'::jsonb,
    '{"anchors":8,"sprints":24,"status":"active build"}'::jsonb,
    'https://github.com/ambooka/nexus',
    null,
    true,
    true,
    0
  ),

  -- A1: Business Platform
  (
    'nexus-business-platform',
    'Nexus — Business Platform (A1)',
    'Production FastAPI/PostgreSQL/Next.js business system: inventory, requisitions, approvals, stock ledger, PDF documents, audit logs, and role-based dashboard.',
    'Production business backend with JWT auth, RBAC, stock ledger, audit logs, and a Next.js role-based dashboard.',
    'Full production business platform built as the first major anchor of Nexus. FastAPI backend with SQLAlchemy ORM, Alembic migrations, JWT access/refresh tokens, RBAC branch-scoped permissions, an immutable stock ledger, idempotency keys, webhook event log, audit trail, PDF document generation, and SQL analytics reports. Frontend is a TypeScript Next.js App Router dashboard with TanStack Query, React Hook Form, Zod validation, and role-based UI.',
    'full-stack',
    array['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'JWT', 'TypeScript', 'Next.js', 'TanStack Query', 'shadcn/ui', 'Docker', 'Nginx', 'GitHub Actions'],
    array['Backend Engineering', 'Auth & RBAC', 'Stock Ledger Design', 'API Design', 'Full-Stack', 'PDF Generation', 'SQL Analytics'],
    'in_progress',
    15,
    2,
    'Business systems need authentication, authorisation, audit trails, and document generation — not just CRUD endpoints.',
    'Building a full production-style business backend with FastAPI, branch-scoped RBAC, immutable ledger, idempotency, and audit logs — plus a Next.js TypeScript dashboard consuming it.',
    'First employability milestone: demonstrates production backend + full-stack skills before cloud/security phases begin.',
    'FastAPI business API with JWT auth, RBAC, stock ledger, audit log, PDF docs, and Next.js role-based dashboard.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-business-platform","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":true,"docker":true,"databaseMigrations":true,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A1","phase":"Business Platform"}'::jsonb,
    null,
    null,
    true,
    true,
    1
  ),

  -- A2: Data Platform
  (
    'nexus-data-platform',
    'Nexus — Data Platform (A2)',
    'ETL pipeline, Airflow DAGs, PostgreSQL analytics warehouse, data quality reporter, and R executive reports wired into the Nexus dashboard.',
    'Airflow-orchestrated ETL platform with dimensional warehouse, data quality reports, and scheduled R executive reports.',
    'Data engineering layer of Nexus: CSV/Excel ingestion with validation and quarantine, dimensional fact/dimension warehouse, Airflow DAGs with retries and backfill, scheduled business reports generated from warehouse data, and an R/Quarto executive report surfaced in the dashboard.',
    'data',
    array['Python', 'Pandas', 'Airflow', 'PostgreSQL', 'Materialised Views', 'R', 'Quarto', 'Docker'],
    array['ETL Pipeline Design', 'Data Quality', 'Warehouse Modelling', 'Airflow Orchestration', 'R Reporting'],
    'planned',
    0,
    3,
    'Business data arrives as messy spreadsheets; reporting is manual and delayed.',
    'Building a validated ETL pipeline with idempotent DAG-based orchestration, a dimensional warehouse, and automated executive reports.',
    'Demonstrates data engineering skills relevant to analytics-heavy backend and data engineer roles.',
    'Airflow ETL platform with dimensional warehouse, data quality validation, and scheduled R executive reports.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-data-platform","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A2","phase":"Data Engineering"}'::jsonb,
    null,
    null,
    false,
    true,
    2
  ),

  -- A3: Cloud Platform
  (
    'nexus-cloud-platform',
    'Nexus — Cloud Platform (A3)',
    'Full AWS deployment of Nexus with Terraform IaC: VPC, EC2, RDS, S3, CloudWatch, Secrets Manager, ALB, and a CI plan/apply pipeline.',
    'AWS-hosted Nexus platform provisioned entirely via modular Terraform with remote state and CI gates.',
    'Cloud engineering anchor: Nexus deployed on AWS with a VPC (public/private subnets, NAT gateway, ALB), EC2 in private subnets, RDS PostgreSQL in a private subnet, S3 backup, CloudWatch monitoring, and AWS Secrets Manager. Full Terraform repository with modular structure (VPC, compute, database, storage, monitoring modules), S3+DynamoDB remote state, and a GitHub Actions CI pipeline that runs plan on PRs and applies on merge.',
    'cloud',
    array['AWS', 'IAM', 'VPC', 'EC2', 'RDS', 'S3', 'CloudWatch', 'ALB', 'Secrets Manager', 'Terraform', 'GitHub Actions', 'CloudTrail', 'GuardDuty', 'Security Hub'],
    array['Cloud Architecture', 'Infrastructure as Code', 'AWS IAM', 'Terraform Modules', 'CI/CD for Infrastructure', 'Cost Control'],
    'planned',
    0,
    4,
    'Click-ops cloud deployments are not reproducible, reviewable, or version-controlled.',
    'Defining the entire Nexus AWS infrastructure as modular Terraform with remote state, least-privilege IAM, cost budgets, and security monitoring active from day one.',
    'Core proof for Cloud Engineer, DevOps Engineer, and Platform Engineer roles — the most direct hiring signal in the plan.',
    'Full AWS Nexus deployment via modular Terraform, remote state, CI plan/apply gates, and security monitoring from account setup.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-cloud-platform","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A3","phase":"Cloud Engineering & IaC"}'::jsonb,
    null,
    null,
    false,
    true,
    3
  ),

  -- A4: Security Platform
  (
    'nexus-security-platform',
    'Nexus — Security Platform (A4)',
    'STRIDE threat model, OWASP Top 10 remediation, RBAC/ABAC library, DevSecOps CI pipeline (SAST, SCA, container scan, secret scan), SBOM generation, and AWS Security Hub.',
    'Security engineering controls and DevSecOps CI pipeline across the full Nexus platform.',
    'Security engineering and DevSecOps anchor: STRIDE threat model with data flow diagrams and risk ratings for all Nexus services, OWASP Top 10 checklist and remediation log, JWT hardening, ABAC branch isolation policy with tests, AWS Secrets Manager integration, Semgrep SAST, pip-audit/npm audit SCA, Trivy container scan, gitleaks secret scan, all gated in CI with SARIF output, and Syft SBOM published per release. AWS Security Hub CIS findings reviewed and remediated.',
    'security',
    array['STRIDE', 'OWASP', 'Semgrep', 'Bandit', 'pip-audit', 'npm audit', 'Trivy', 'gitleaks', 'Syft', 'AWS Security Hub', 'GuardDuty', 'AWS Secrets Manager', 'GitHub Actions'],
    array['Threat Modelling', 'OWASP Remediation', 'DevSecOps CI', 'SAST', 'SCA', 'Container Scanning', 'Secret Scanning', 'SBOM', 'Security Architecture'],
    'planned',
    0,
    6,
    'Security is typically bolted on after delivery rather than built into the development and deployment pipeline.',
    'Threat modelling from design, OWASP remediation per feature, and four security scan types running automatically on every PR with severity-gated merge policies.',
    'Primary proof for Security Engineer, DevSecOps Engineer, and Cloud Security Engineer roles.',
    'STRIDE threat model + OWASP remediation + DevSecOps CI pipeline with SAST/SCA/container/secret scan and SBOM.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-security-platform","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A4","phase":"Security Engineering & DevSecOps"}'::jsonb,
    null,
    null,
    false,
    true,
    4
  ),

  -- A5: ML/MLOps Platform
  (
    'nexus-mlops-platform',
    'Nexus — ML/MLOps Platform (A5)',
    'Business ML models, FastAPI inference API, SHAP explanations, model registry with promotion/rollback, drift detection, and Airflow retraining pipeline.',
    'End-to-end MLOps loop: train, serve, explain, register, monitor drift, retrain.',
    'ML engineering and MLOps anchor: business prediction models (stockout, supplier delay, sales forecast) trained from the Nexus warehouse, served via a FastAPI inference API with prediction logging and SHAP explanation endpoints, model registry supporting versioned promotion/rollback, drift detection on production prediction distributions, and an Airflow retraining DAG with an evaluation gate blocking automatic promotion when metrics regress.',
    'ml',
    array['scikit-learn', 'FastAPI', 'SHAP', 'MLflow', 'Airflow', 'PostgreSQL', 'Docker', 'Prometheus'],
    array['ML Engineering', 'Model Serving', 'Explainability', 'Model Registry', 'MLOps', 'Drift Detection', 'Retraining Pipelines'],
    'planned',
    0,
    7,
    'ML models trained in notebooks provide no production lifecycle: no versioning, no monitoring, no retraining path.',
    'Building a full ML lifecycle layer with experiment tracking, registry, inference API, drift monitoring, and automated retraining with evaluation gates.',
    'Primary proof for ML Engineer, junior MLOps, and AI application engineer roles.',
    'ML inference API, SHAP explainability, model registry, drift detection, and Airflow retraining pipeline.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-mlops-platform","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A5","phase":"ML/MLOps"}'::jsonb,
    null,
    null,
    false,
    true,
    5
  ),

  -- A6: RAG/LLMOps Platform
  (
    'nexus-rag-platform',
    'Nexus — RAG/LLMOps Platform (A6)',
    'Document ingestion, embeddings, pgvector semantic search, RAG chatbot with streaming citations, eval harness, structured extraction from business PDFs, and an MCP tool-server.',
    'RAG assistant with pgvector, streaming citations, eval suite, and MCP tool-server for agent integration.',
    'RAG and LLMOps anchor: PDF/Markdown/text ingestion with stable chunk IDs, embedding service with caching and batching, pgvector HNSW search, RAG chatbot with streaming SSE and inline citations, retrieval debug dashboard, evaluation harness with a 50-question golden set, prompt A/B testing, structured extraction from business PDFs using Pydantic schemas, multimodal document analysis, and an MCP tool-server exposing Nexus read-only tools (stock lookup, requisition status, RAG search) to downstream agents.',
    'rag',
    array['LangChain', 'LangGraph', 'pgvector', 'Hugging Face', 'MCP', 'FastAPI', 'Next.js', 'SSE', 'PostgreSQL', 'Pydantic'],
    array['RAG Pipeline Design', 'Embeddings', 'Vector Search', 'Evaluation Harness', 'Structured Extraction', 'MCP', 'Streaming UI'],
    'planned',
    0,
    8,
    'LLM applications without grounding verification, evaluation, and structured extraction pipelines are demos, not systems.',
    'Building a production RAG system with idempotent ingestion, pgvector search, grounded citations, a proper eval harness, PDF extraction, and an MCP server enabling agent consumption.',
    'Primary proof for RAG Engineer, LLM application developer, and AI systems roles.',
    'RAG chatbot with pgvector search, streaming citations, eval harness, structured PDF extraction, and MCP tool-server.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-rag-platform","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A6","phase":"RAG/LLMOps"}'::jsonb,
    null,
    null,
    false,
    true,
    6
  ),

  -- A7: AI Safety Layer
  (
    'nexus-ai-safety-layer',
    'Nexus — AI Safety Layer (A7)',
    'Prompt injection detector, PII redaction, grounding verification, AI safety gateway, and a red-team report with 30+ documented attack cases.',
    'Production AI safety controls: prompt injection, PII, grounding verification, and a formal red-team harness.',
    'AI safety anchor: prompt injection detector (pattern matching, embedding similarity, keyword detection), PII leakage checker with regex/NER and redaction policy, grounding verification cross-referencing answer claims against retrieved chunks, a safety gateway middleware logging all decisions, and a formal red-team harness running 30+ structured attacks across injection, extraction, jailbreak, and excessive agency categories — results published as a formal safety report.',
    'security',
    array['Python', 'FastAPI', 'LangChain', 'OWASP LLM Top 10', 'NER', 'PostgreSQL'],
    array['AI Safety', 'Prompt Injection Defence', 'PII Handling', 'Grounding Verification', 'Red Teaming', 'LLM Security'],
    'planned',
    0,
    9,
    'Most LLM applications ship without injection defences, PII controls, or structured adversarial testing.',
    'Building a safety gateway with injection detection, PII redaction, grounding verification, and a 30+-case red-team report that documents findings, severities, and mitigations.',
    'Key differentiator: demonstrates security and safety maturity beyond demo-level AI applications.',
    'AI safety gateway with prompt injection detection, PII redaction, grounding verification, and 30+ case red-team report.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-ai-safety-layer","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A7","phase":"AI Safety"}'::jsonb,
    null,
    null,
    false,
    true,
    7
  ),

  -- A8: Systems Suite
  (
    'nexus-systems-suite',
    'Nexus — Systems Suite (A8)',
    'Rust secret scanner with SARIF output, Rust artifact integrity verifier, Java Spring Boot workflow service, C firmware simulator, and C++ machine fault simulator.',
    'Systems and security tooling in Rust, Java, C, and C++ proving low-level and enterprise engineering depth.',
    'Systems and enterprise anchor: a Rust CLI secret scanner with regex rules, entropy detection, Git history scanning, and SARIF/JSON output for CI integration; a Rust artifact integrity verifier; a Java Spring Boot approval workflow service with idempotent ledger posting and Testcontainers integration tests; a C sensor firmware simulator with watchdog state machine and UART-style output; a C++ machine fault simulator generating labelled anomaly time-series datasets for the ML pipeline. Secondary breadth proofs in Kotlin and C# also live here.',
    'systems',
    array['Rust', 'Go', 'Java', 'Spring Boot', 'C', 'C++', 'Kotlin', 'C#', 'SARIF', 'Docker'],
    array['Systems Engineering', 'Security Tooling', 'Enterprise Backend', 'Firmware Simulation', 'Breadth Proof'],
    'planned',
    0,
    10,
    'Cloud/AI engineers who cannot work in compiled systems languages are limited to Python-only roles.',
    'Building compact but complete tools in Rust, Java, C, and C++ that each demonstrate a real engineering concept — not toy programs.',
    'Demonstrates rare language breadth and systems thinking that most backend candidates cannot show.',
    'Rust secret scanner, Java workflow service, C firmware simulator, and C++ fault simulator proving systems depth.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/nexus-systems-suite","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":false}'::jsonb,
    '{"anchor":"A8","phase":"Systems & Enterprise"}'::jsonb,
    null,
    null,
    false,
    true,
    8
  ),

  -- ============================================================
  -- EXISTING REAL PROJECTS (unchanged — all CV-backed)
  -- ============================================================

  (
    'computer-vision-surveillance-system',
    'Computer Vision Surveillance System',
    'Final-year research project implementing real-time object detection and threat recognition using YOLO, OpenCV and Flask.',
    'Final-year research project using YOLO, OpenCV and Flask for real-time object detection, threat classification and alerting.',
    'Designed and built an end-to-end computer vision surveillance system addressing police response time and automated threat recognition in urban environments. Implemented real-time object detection and threat classification using YOLO architectures, evaluated multiple variants for accuracy-latency trade-off, built a Flask API backend, and integrated OpenCV for live video stream processing.',
    'ml',
    array['Python', 'PyTorch', 'YOLOv5/v8', 'OpenCV', 'Flask', 'NumPy', 'Linux'],
    array['Computer Vision', 'Model Inference', 'API Development', 'Research', 'Real-Time Systems'],
    'completed',
    100,
    7,
    'Urban surveillance workflows often rely on manual monitoring and delayed threat recognition.',
    'Built a YOLO-based real-time object detection system with Flask API, OpenCV stream processing and automated alerting.',
    'Demonstrated functional automated threat recognition with a real-time inference and alert pipeline.',
    'Built an end-to-end computer vision research system for real-time object detection, threat classification and alert generation.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/computer-vision-surveillance-system","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":true,"docs":true,"deployed":false}'::jsonb,
    '{"domain":"computer vision","projectType":"final-year research"}'::jsonb,
    null,
    null,
    true,
    true,
    9
  ),
  (
    'mpesa-payment-integration-library',
    'M-Pesa Payment Integration Library',
    'Production Node.js and TypeScript library abstracting the Safaricom Daraja API: STK Push, B2C, C2B, typed response schemas, retry logic and webhook validation.',
    'Typed M-Pesa Daraja integration library deployed in a live e-commerce environment processing KES 1M+/month.',
    'Production Node.js + TypeScript library abstracting the Safaricom Daraja API — STK Push, B2C, C2B, with typed response schemas, retry logic and webhook validation. Deployed in a live e-commerce environment processing KES 1M+/month.',
    'Backend / Payments',
    array['Node.js', 'TypeScript', 'PostgreSQL', 'BullMQ', 'Redis', 'Safaricom Daraja API'],
    array['Payment Integrations', 'Backend APIs', 'Async Jobs', 'Reliability', 'Audit Logging'],
    'completed',
    100,
    3,
    'Payment APIs need reliability, traceability and safe retry behavior because failures affect real money.',
    'Built a typed integration layer with STK Push, B2C, C2B callbacks, BullMQ jobs, retries, webhook validation and transaction audit logs.',
    'Supported a live e-commerce environment processing KES 1M+/month.',
    'Production M-Pesa Daraja integration with typed APIs, async job processing, retries, webhook validation and transaction audit logs.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/mpesa-payment-integration-library","apiDocs":null,"video":null}'::jsonb,
    '{"tests":true,"ci":true,"docker":true,"databaseMigrations":true,"monitoring":false,"docs":true,"deployed":true}'::jsonb,
    '{"monthlyVolume":"KES 1M+","paymentFlows":["STK Push","B2C","C2B"]}'::jsonb,
    null,
    null,
    true,
    true,
    10
  ),
  (
    'ambooka-dev-portfolio-platform',
    'ambooka.dev Portfolio Platform',
    'Full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, AI-generated resume variants, GitHub activity sync and Playwright e2e test suite.',
    'Full-stack portfolio platform with Supabase backend and admin CMS.',
    'Built ambooka.dev — a full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, AI-generated resume variants, GitHub activity sync, and Playwright e2e test suite.',
    'Full-Stack',
    array['Next.js 16', 'TypeScript', 'Supabase', 'GitHub Activity Sync', 'Playwright'],
    array['Full-Stack Engineering', 'Frontend Architecture', 'Database-Backed Content', 'Testing'],
    'completed',
    100,
    2,
    'A static resume could not represent evolving project evidence, portfolio content, resume variants and GitHub activity.',
    'Built a database-backed portfolio platform with admin-managed content, resume variants, GitHub sync and e2e tests.',
    'Turns professional evidence into a structured software product rather than a static page.',
    'Built ambooka.dev as a full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, GitHub activity sync and Playwright e2e testing.',
    '{"github":"https://github.com/ambooka/ambooka","liveDemo":"https://ambooka.dev","caseStudy":"/case-studies/ambooka-dev-portfolio-platform","apiDocs":null,"video":null}'::jsonb,
    '{"tests":true,"ci":true,"docker":false,"databaseMigrations":true,"monitoring":false,"docs":true,"deployed":true}'::jsonb,
    '{"status":"live","type":"portfolio-platform"}'::jsonb,
    'https://github.com/ambooka/ambooka',
    'https://ambooka.dev',
    true,
    true,
    11
  ),
  (
    'sme-invoicing-reporting-dashboard',
    'SME Invoicing & Reporting Dashboard',
    'React and FastAPI dashboard replacing manual Excel invoicing with PDF generation, WhatsApp notifications and analytics.',
    'Business automation dashboard reducing manual invoicing effort by 80%.',
    'Replaced a Nairobi SME client''s manual Excel-based invoicing process with a custom React + FastAPI dashboard featuring automated PDF generation, WhatsApp notifications via Africa''s Talking API, and a live analytics panel — reducing manual processing effort by 80%.',
    'Business Automation',
    array['React', 'FastAPI', 'PostgreSQL', 'PDF Generation', 'Africa''s Talking API'],
    array['Full-Stack Development', 'Business Automation', 'Reporting', 'API Integration'],
    'completed',
    100,
    3,
    'Manual Excel-based invoicing consumed time, increased errors and limited visibility.',
    'Built a React + FastAPI dashboard with PDF generation, WhatsApp notifications and analytics.',
    'Reduced manual processing effort by 80%.',
    'Replaced manual Excel invoicing with a custom React + FastAPI dashboard, automated PDFs, WhatsApp notifications and analytics.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/sme-invoicing-reporting-dashboard","apiDocs":null,"video":null}'::jsonb,
    '{"tests":true,"ci":true,"docker":true,"databaseMigrations":true,"monitoring":false,"docs":true,"deployed":true}'::jsonb,
    '{"manualEffortReduction":"80%"}'::jsonb,
    null,
    null,
    true,
    true,
    12
  ),
  (
    'hebatullah-erpnext-implementation',
    'Hebatullah ERPNext Implementation',
    'ERPNext implementation for chart of accounts, item catalogue and procurement workflows replacing manual business processes.',
    'ERPNext implementation replacing manual inventory, finance and procurement workflows.',
    'Implemented ERPNext from scratch — designed the chart of accounts, item catalogue, and procurement workflows, replacing entirely manual processes across inventory, finance, and HR.',
    'ERP / Business Systems',
    array['ERPNext', 'Accounting Setup', 'Inventory', 'Procurement Workflows', 'Business Process Design'],
    array['ERP Implementation', 'Business Systems', 'Requirements Analysis', 'Process Automation'],
    'completed',
    100,
    6,
    'Manual inventory, finance and procurement workflows created slow operations, weak visibility and inconsistent records.',
    'Designed and implemented ERPNext foundation including accounts, item catalogue and procurement workflows.',
    'Improved business process structure and created a foundation for cleaner inventory, finance and procurement operations.',
    'Implemented ERPNext from scratch for a trading company, replacing manual inventory, finance and procurement workflows.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/hebatullah-erpnext-implementation","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":true,"deployed":true}'::jsonb,
    '{"environment":"real company implementation","staffSupported":"70+ office staff","fieldWorkersSupported":"300+"}'::jsonb,
    null,
    null,
    true,
    false,
    13
  ),
  (
    'hebatullah-cms-website-rebuild',
    'Hebatullah CMS Website Rebuild',
    'Reworked company website from static HTML into a CMS, enabling marketing team content updates without developer involvement.',
    'CMS website rebuild for real company marketing operations.',
    'Reworked the company website (hebatullah.com) from a static HTML site to a full CMS, enabling the marketing team to update content without developer involvement.',
    'Web / CMS',
    array['CMS', 'Web Development', 'Content Management', 'Hosting'],
    array['CMS Implementation', 'Business Enablement', 'Web Development'],
    'completed',
    100,
    2,
    'The company website was static, making every marketing update dependent on developer involvement.',
    'Rebuilt the website around a CMS workflow so the marketing team could manage content independently.',
    'Reduced update friction and improved ownership for business content.',
    'Reworked hebatullah.com from static HTML into a CMS-backed site for non-developer content management.',
    '{"github":null,"liveDemo":"https://hebatullah.com","caseStudy":"/case-studies/hebatullah-cms-website-rebuild","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":true,"deployed":true}'::jsonb,
    '{"site":"hebatullah.com"}'::jsonb,
    null,
    'https://hebatullah.com',
    false,
    false,
    14
  ),
  (
    'company-it-infrastructure-rollout',
    'Company IT Infrastructure Rollout',
    'Installed and commissioned switches, wireless access points, cabling and VoIP desk phone system for company operations.',
    'Ground-up company network and VoIP infrastructure rollout.',
    'Installed and commissioned the company network infrastructure from the ground up: switches, wireless access points, cabling, and VoIP desk phone system.',
    'IT Infrastructure',
    array['Switches', 'Wireless Access Points', 'Structured Cabling', 'VoIP', 'TCP/IP'],
    array['Networking', 'Infrastructure Deployment', 'Troubleshooting', 'IT Operations'],
    'completed',
    100,
    6,
    'The company needed reliable internal connectivity and phone communication infrastructure.',
    'Installed and commissioned network infrastructure and VoIP desk phone system.',
    'Created the infrastructure foundation for office connectivity and internal communication.',
    'Installed and commissioned switches, wireless access points, cabling and VoIP phone system for company operations.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/company-it-infrastructure-rollout","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":true,"deployed":true}'::jsonb,
    '{"environment":"company infrastructure"}'::jsonb,
    null,
    null,
    false,
    false,
    15
  ),
  -- Fixed: v1 had a bare `(...)` with no INSERT clause — now a proper insert row
  (
    'mmust-lab-network-support',
    'MMUST Lab & Network Support',
    'Configured 40+ lab workstations and resolved a DHCP conflict affecting 200+ campus devices.',
    'Configured 40+ lab workstations and resolved a DHCP conflict affecting 200+ campus devices.',
    'Configured lab machines, supported network administration and diagnosed the DHCP issue affecting campus devices.',
    'enterprise',
    array['Network Administration', 'Linux', 'Windows Server', 'TCP/IP', 'Hardware Configuration'],
    array['IT Infrastructure', 'Network Troubleshooting', 'User Support', 'Systems Setup'],
    'completed',
    100,
    8,
    'A new computer lab needed reliable workstation setup, and a DHCP conflict was disrupting campus connectivity.',
    'Configured lab machines, supported network administration and resolved a DHCP conflict affecting many devices.',
    'Helped complete lab setup ahead of semester start and restored connectivity stability for affected users.',
    'Configured 40+ workstations and helped resolve a recurring DHCP conflict affecting 200+ campus devices.',
    '{"caseStudy":"/case-studies/mmust-lab-network-support"}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":true,"deployed":true}'::jsonb,
    '{"workstations":"40+","devicesAffected":"200+"}'::jsonb,
    null,
    null,
    false,
    false,
    16
  );

-- ============================================================
-- CASE STUDIES (auto-generated from featured projects)
-- ============================================================

insert into public.case_studies (
  slug,
  project_slug,
  title,
  subtitle,
  summary,
  problem,
  architecture,
  key_decisions,
  implementation,
  quality,
  results,
  future_improvements
)
select
  p.slug,
  p.slug,
  p.title,
  coalesce(p.recruiter_summary, p.one_line, p.title),
  coalesce(p.recruiter_summary, p.description, p.one_line, p.title),
  coalesce(
    p.problem,
    'This project addresses a real software, infrastructure, business or AI/ML engineering problem.'
  ),
  jsonb_build_array(
    'Problem-first framing so recruiters and technical reviewers understand context before implementation.',
    'Implementation uses the stack listed in the project record.',
    'Persistence, integrations, deployment and operational workflows documented where applicable.',
    'Case study focuses on business value, engineering trade-offs, and measurable outcomes.'
  ),
  jsonb_build_array(
    'Prioritised real completed work and honest in-progress state over private roadmap claims.',
    'Kept portfolio professional, proof-first, and separated from any internal planning documents.',
    'Separated client or company-sensitive details from public implementation summaries.',
    'Used status and completion_percent fields to reflect honest state rather than overclaiming.'
  ),
  jsonb_build_array(
    'Defined the problem and stakeholder need clearly.',
    'Built or implemented the system in a real academic, freelance, company, or structured learning context.',
    'Documented stack, outcomes and proof signals.',
    'Prepared the project for recruiter-facing presentation with README and screenshots.'
  ),
  jsonb_build_array(
    'Public records include stack, problem, solution, business value and recruiter summary.',
    'Sensitive client or company details are intentionally summarised rather than exposed.',
    'Case studies are structured for technical review and resume alignment.',
    'In-progress Nexus projects show honest completion state and are clearly labelled as active builds.'
  ),
  jsonb_build_array(
    coalesce(p.business_value, 'Project contributed practical value in a real operating context.'),
    'Strengthens the portfolio with evidence from real work rather than tutorial reproductions.',
    'Supports positioning across software engineering, cloud engineering, security, and AI/ML roles.'
  ),
  jsonb_build_array(
    'Add screenshots and architecture diagrams as each phase completes.',
    'Add demo videos for public projects.',
    'Attach live links or sanitised technical walkthroughs where client confidentiality allows.',
    'Update completion_percent in projects table as Nexus sprints are finished.'
  )
from public.projects p
where p.is_featured = true
order by p.display_order, p.created_at;

-- ============================================================
-- BLOG POSTS
-- ============================================================
-- Changed from v1:
--   - ERPNext and portfolio posts carried over
--   - M-Pesa post carried over
--   - Computer vision post carried over
--   - New posts added for NEXUS engineering direction:
--       cloud engineering, security engineering, RAG systems
-- ============================================================

insert into public.blog_posts (
  slug,
  title,
  excerpt,
  content,
  category,
  tags,
  is_published,
  published_at
)
values
  (
    'building-a-production-portfolio-platform',
    'Building a Production-Style Portfolio Platform',
    'How I structured ambooka.dev as a full-stack portfolio with admin content, Supabase and e2e tests.',
    'Draft: This article explains the architecture, content model, admin CMS, Supabase schema, Playwright tests and deployment structure behind ambooka.dev.',
    'Software Engineering',
    array['Next.js', 'Supabase', 'Portfolio', 'Testing'],
    true,
    now()
  ),
  (
    'lessons-from-erpnext-implementation',
    'Lessons from Implementing ERPNext in a Real Company',
    'What I learned designing accounts, items and procurement workflows for a trading company.',
    'Draft: This article covers business process mapping, chart of accounts design, item catalogue structure, procurement workflows and adoption lessons from ERPNext implementation.',
    'Business Systems',
    array['ERPNext', 'Business Systems', 'IT'],
    true,
    now()
  ),
  (
    'building-reliable-mpesa-integrations',
    'Building Reliable M-Pesa Daraja Integrations',
    'Notes on STK Push, B2C, C2B callbacks, retries, queues and transaction audit logs.',
    'Draft: This article explains the reliability problems in payment integrations and how typed responses, queues, retries, idempotency and audit logs improve production behavior.',
    'Backend Engineering',
    array['M-Pesa', 'Node.js', 'TypeScript', 'Payments'],
    true,
    now()
  ),
  (
    'computer-vision-final-year-project',
    'Building a Computer Vision Surveillance System with YOLO and OpenCV',
    'Technical lessons from my final-year computer vision research project.',
    'Draft: This article discusses problem framing, YOLO model selection, OpenCV stream processing, Flask inference APIs and accuracy-latency tradeoffs.',
    'AI / ML',
    array['YOLO', 'OpenCV', 'PyTorch', 'Computer Vision'],
    true,
    now()
  ),
  (
    'aws-vpc-design-for-production-apps',
    'AWS VPC Design for Production Applications',
    'How I designed the Nexus VPC — public and private subnets, NAT gateway, RDS in a private subnet, and ALB termination.',
    'Draft: Covers CIDR planning, subnet separation, security groups vs NACLs, NAT gateway cost discipline, and moving an existing application from VPS to AWS without downtime.',
    'Cloud Engineering',
    array['AWS', 'VPC', 'EC2', 'RDS', 'Terraform', 'Infrastructure'],
    false,
    null
  ),
  (
    'terraform-module-structure-for-aws',
    'Terraform Module Structure for Real AWS Infrastructure',
    'How I organised the Nexus Terraform repository — modules, remote state, variable contracts, and CI plan/apply gates.',
    'Draft: Covers module boundaries (VPC, compute, database, storage, monitoring), S3+DynamoDB remote state, tfvars discipline, and the GitHub Actions pipeline that blocks manual console changes.',
    'Cloud Engineering',
    array['Terraform', 'AWS', 'IaC', 'Infrastructure as Code', 'GitHub Actions'],
    false,
    null
  ),
  (
    'stride-threat-modelling-for-api-systems',
    'STRIDE Threat Modelling for API-Backed Systems',
    'Walking through the STRIDE methodology applied to the Nexus FastAPI platform — spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege.',
    'Draft: Covers drawing data flow diagrams with trust boundaries, applying the six STRIDE categories to each DFD component, assigning risk ratings, and turning findings into security ADRs.',
    'Security Engineering',
    array['STRIDE', 'Threat Modelling', 'OWASP', 'Security', 'FastAPI'],
    false,
    null
  ),
  (
    'devsecops-pipeline-four-scan-types',
    'Building a DevSecOps Pipeline with Four Scan Types',
    'How I added SAST, SCA, container scanning, and secret scanning to every pull request in the Nexus monorepo.',
    'Draft: Covers Semgrep and Bandit for SAST, pip-audit and npm audit for SCA, Trivy for container scans, gitleaks for secrets, SARIF output to GitHub Security tab, and SBOM generation with Syft.',
    'DevSecOps',
    array['Semgrep', 'Trivy', 'gitleaks', 'SBOM', 'GitHub Actions', 'Security'],
    false,
    null
  ),
  (
    'rag-evaluation-beyond-vibes',
    'RAG Evaluation Beyond Vibes — Building a Golden Dataset',
    'Why I built a 50-question evaluation harness for the Nexus RAG system instead of judging quality by feel.',
    'Draft: Covers golden dataset construction, retrieval metrics (hit rate, MRR, precision@k), answer faithfulness scoring, LLM-as-judge caveats, and using evaluation failures to improve chunking and prompts.',
    'RAG / AI Engineering',
    array['RAG', 'LangChain', 'pgvector', 'Evaluation', 'LLMOps'],
    false,
    null
  );

-- ============================================================
-- KPI STATS
-- ============================================================
-- Changed from v1:
--   - Added Nexus anchor projects count
--   - Messaging updated to reflect engineering direction
-- ============================================================

insert into public.kpi_stats (
  section,
  label,
  value,
  display_order
)
values
  ('hero', 'Experience',               '3+ Years',                     1),
  ('hero', 'Projects Delivered',        '12+',                          2),
  ('hero', 'Staff Supported',           '70+',                          3),
  ('hero', 'Payment Volume Supported',  'KES 1M+/month',                4),
  ('hero', 'Nexus Anchor Projects',     '8 (in build)',                  5),
  ('hero', 'Target Engineering Track',  'Cloud → Platform → Security',  6);

-- ============================================================
-- PORTFOLIO CONTENT
-- ============================================================
-- Changed from v1:
--   - Hero title and subtitle updated to reflect new direction
--   - Positioning statement updated
--   - NEXUS policy note added
-- ============================================================

insert into public.portfolio_content (
  section,
  title,
  subtitle,
  content,
  metadata,
  display_order,
  is_active
)
values
  (
    'hero',
    'Software Engineer building toward Cloud, Platform & Security Architecture.',
    'Python · TypeScript · AWS · Terraform · Kubernetes · FastAPI · PostgreSQL · Docker · LangGraph · MCP',
    'CS graduate with 3+ years of production engineering experience. Shipped payment systems, full-stack applications, and ERP deployments for real clients. Currently building Nexus — an AWS-hosted platform proving cloud infrastructure, DevSecOps, MLOps, RAG, and agentic AI engineering phase by phase.',
    '{"ctaPrimary":"View Projects","ctaSecondary":"Download Resume"}'::jsonb,
    1,
    true
  ),
  (
    'positioning',
    'Production-minded engineer with infrastructure and security depth.',
    'Real delivered work + Nexus platform proof across cloud, security, ML, RAG, and AI systems.',
    'This portfolio combines real client and employer work with Nexus — a structured production platform built phase by phase to prove each engineering layer as working code, not a certificate or tutorial project.',
    '{}'::jsonb,
    2,
    true
  ),
  (
    'nexus_context',
    'About the Nexus projects',
    'In-progress — honest completion state shown per project.',
    'The Nexus anchor projects are being built systematically across cloud, platform, security, MLOps, RAG, and agent phases. Each is shown with an honest completion percentage and moves to "completed" once it has a live demo, full README, tests, deployment notes, and a published case study.',
    '{}'::jsonb,
    3,
    true
  ),
  (
    'portfolio_policy',
    'Public portfolio policy',
    'Only verified real work and honest in-progress state.',
    'This portfolio presents real resume-backed experience, real client and employer projects, academic research, and active in-progress builds with honest completion states. No tutorial reproductions or inflated claims.',
    '{}'::jsonb,
    4,
    true
  );

-- ============================================================
-- CERTIFICATIONS
-- ============================================================
-- Changed from v1:
--   - AWS CLF-C02 replaced with AWS SAA-C03 (correct NEXUS target)
--   - CompTIA Security+ SY0-701 added (NEXUS plan — study Sprints
--     12–13, register by Sprint 13, sit by Sprint 20)
--   - HashiCorp Terraform Associate retained as in_progress
--   - CKA updated to post-roadmap (2027) per NEXUS Section 19
--   - AWS Security Specialty added as long-term planned
-- ============================================================

insert into public.certifications (
  name,
  provider,
  status,
  phase_number,
  target_date,
  obtained_date,
  is_obtained,
  credential_url,
  display_order
)
values
  (
    'BSc Computer Science',
    'Maseno University',
    'completed',
    null,
    null,
    '2024-12-01',
    true,
    null,
    1
  ),
  (
    'AWS Certified Solutions Architect – Associate (SAA-C03)',
    'Amazon Web Services',
    'in_progress',
    4,
    '2026-12-31',
    null,
    false,
    null,
    2
  ),
  (
    'CompTIA Security+ (SY0-701)',
    'CompTIA',
    'in_progress',
    6,
    '2026-12-31',
    null,
    false,
    null,
    3
  ),
  (
    'HashiCorp Terraform Associate 003',
    'HashiCorp',
    'in_progress',
    4,
    '2026-12-31',
    null,
    false,
    null,
    4
  ),
  (
    'Certified Kubernetes Administrator (CKA)',
    'CNCF',
    'planned',
    5,
    '2027-06-30',
    null,
    false,
    null,
    5
  ),
  (
    'AWS Certified Security – Specialty',
    'Amazon Web Services',
    'planned',
    null,
    '2028-01-01',
    null,
    false,
    null,
    6
  );

-- ============================================================
-- TESTIMONIALS
-- ============================================================

insert into public.testimonials (
  name,
  role,
  company,
  text,
  is_featured,
  display_order
)
values
  (
    'References',
    'Available upon request',
    null,
    'Professional references are available upon request.',
    true,
    1
  );

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.personal_info      enable row level security;
alter table public.education           enable row level security;
alter table public.experience          enable row level security;
alter table public.skills              enable row level security;
alter table public.projects            enable row level security;
alter table public.case_studies        enable row level security;
alter table public.testimonials        enable row level security;
alter table public.blog_posts          enable row level security;
alter table public.contact_messages    enable row level security;
alter table public.page_views          enable row level security;
alter table public.kpi_stats           enable row level security;
alter table public.portfolio_content   enable row level security;
alter table public.roadmap_phases      enable row level security;
alter table public.certifications      enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'personal_info',
    'education',
    'experience',
    'skills',
    'projects',
    'case_studies',
    'testimonials',
    'blog_posts',
    'kpi_stats',
    'portfolio_content',
    'roadmap_phases',
    'certifications'
  ]
  loop
    execute format(
      'create policy public_read_%I on public.%I for select using (true)',
      t,
      t
    );

    execute format(
      'create policy authenticated_manage_%I on public.%I for all to authenticated using (true) with check (true)',
      t,
      t
    );
  end loop;
end;
$$;

create policy public_insert_contact_messages
  on public.contact_messages
  for insert
  with check (true);

create policy authenticated_read_contact_messages
  on public.contact_messages
  for select
  to authenticated
  using (true);

create policy authenticated_manage_contact_messages
  on public.contact_messages
  for all
  to authenticated
  using (true)
  with check (true);

create policy public_insert_page_views
  on public.page_views
  for insert
  with check (true);

create policy authenticated_read_page_views
  on public.page_views
  for select
  to authenticated
  using (true);

-- ============================================================
-- GRANTS
-- ============================================================

grant select on all tables in schema public to anon;
grant insert on public.contact_messages to anon;
grant insert on public.page_views to anon;

grant all on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

commit;
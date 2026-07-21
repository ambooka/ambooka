-- ============================================================
-- Ambooka Portfolio Database Reset + Seed
-- Version 3.0 — Recruiter-Focused Résumé Alignment
-- ============================================================
-- WARNING: This script is destructive.
-- It drops and recreates the public schema.
--
-- Content policy:
-- - Experience, skills, projects, and metrics come from the supplied résumé
--   or completed public repository evidence.
-- - Internal study plans, planned projects, and planned certifications are
--   intentionally excluded from recruiter-facing data.
-- - No fabricated artifact counts or inflated completion claims.
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
-- Employment titles remain identical to the supplied résumé.

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
  'Abdulrahman Ambooka Msah',
  'Software Engineer | Backend, Payments & IT Infrastructure',
  'abdulrahmanambooka@gmail.com',
  '+254 111 384 390',
  'Nairobi, Kenya',
  true,
  'Computer Science graduate with 3+ years of hands-on experience building and shipping full-stack web applications, REST APIs, and payment integrations for real clients, including a production M-Pesa implementation processing KES 1M+/month. Also experienced in ERP implementation, Windows Server, Active Directory, networking, end-user support, and applied computer vision.',
  'I build full-stack and backend software, production payment integrations, and business systems, backed by hands-on experience in ERP implementation and IT infrastructure administration.',
  '[
    "Software Engineering",
    "Backend APIs & Payment Integrations",
    "Full-Stack Web Development",
    "ERP & Business Systems",
    "IT Infrastructure & Networking",
    "Applied Computer Vision"
  ]'::jsonb,
  '[
    {"platform":"GitHub","url":"https://github.com/ambooka","icon_url":null,"is_active":true},
    {"platform":"LinkedIn","url":"https://linkedin.com/in/abdulrahman-ambooka","icon_url":null,"is_active":true},
    {"platform":"Website","url":"https://ambooka.dev","icon_url":null,"is_active":true}
  ]'::jsonb,
  '{
    "experienceYears":"3+",
    "staffSupported":"70+",
    "fieldWorkersSupported":"300+",
    "monthlyPaymentsProcessed":"KES 1M+",
    "workstationsConfigured":"40+"
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
    '2020-01-01',
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
    '2016-01-01',
    '2019-12-01',
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
--   - Client work is represented in Projects because the supplied resume
--     does not list a separate freelance employment entry.
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
    'IT Administrator supporting the academy''s infrastructure, systems, users, and digital operations.',
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
    array[]::text[],
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
    2
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
    3
  );

-- ============================================================
-- SKILLS
-- ============================================================
-- Skills match the supplied résumé; learning targets are excluded.

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
  ('Java',         'Languages', 60, 60, false, 7,  10),
  ('C#',           'Languages', 58, 58, false, 8,  10),
  ('Kotlin',       'Languages', 58, 58, false, 9,  10),

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
  ('OpenAPI',          'Backend', 72, 72, false, 21, 2),

  -- ---- Databases ----
  ('PostgreSQL', 'Databases', 84, 84, true,  22, 2),
  ('Redis',      'Databases', 74, 74, true,  23, 2),
  ('Supabase',   'Databases', 80, 80, true,  24, 2),
  ('SQLite',     'Databases', 72, 72, false, 25, 1),

  -- ---- DevOps & Infrastructure (proven in production) ----
  ('Docker',          'DevOps & Infrastructure', 82, 82, true,  26, 1),
  ('Docker Compose',  'DevOps & Infrastructure', 82, 82, true,  27, 1),
  ('Nginx',           'DevOps & Infrastructure', 78, 78, true,  28, 1),
  ('Linux (Ubuntu)',  'DevOps & Infrastructure', 80, 80, true,  29, 1),
  ('GitHub Actions',  'DevOps & Infrastructure', 76, 76, true,  30, 1),
  ('Hetzner VPS',     'DevOps & Infrastructure', 74, 74, false, 31, 1),

  -- ---- IT Systems (proven in employment) ----
  ('Windows Server',    'IT Systems', 80, 80, true,  32, 11),
  ('Active Directory',  'IT Systems', 76, 76, true,  33, 11),
  ('ERPNext',           'IT Systems', 82, 82, true,  34, 11),
  ('VoIP',              'IT Systems', 72, 72, false, 35, 11),
  ('CCTV',              'IT Systems', 76, 76, false, 36, 11),
  ('Biometric Systems', 'IT Systems', 74, 74, false, 37, 11),
  ('TCP/IP',            'IT Systems', 80, 80, true,  38, 11),

  -- ---- AI / ML (applied in final-year research) ----
  ('PyTorch',       'AI / ML', 68, 68, true,  39, 7),
  ('OpenCV',        'AI / ML', 78, 78, true,  40, 7),
  ('YOLOv5/v8',     'AI / ML', 76, 76, true,  41, 7),
  ('scikit-learn',  'AI / ML', 68, 68, true,  42, 7),
  ('Hugging Face',  'AI / ML', 55, 55, false, 43, 7),
  ('Jupyter',       'AI / ML', 76, 76, false, 44, 1);

-- ============================================================
-- ROADMAP PHASES
-- ============================================================
-- Internal development planning is intentionally not seeded into the public portfolio.

-- ============================================================
-- PROJECTS
-- ============================================================
-- Completed projects from the supplied résumé and this public repository.

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

  -- COMPLETED PROJECTS — RÉSUMÉ OR REPOSITORY BACKED

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
    false,
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
    array['Payment Integrations', 'Backend APIs', 'Async Jobs', 'Reliability', 'Webhook Validation'],
    'completed',
    100,
    3,
    'Payment APIs need reliability, traceability and safe retry behavior because failures affect real money.',
    'Built a typed integration layer with STK Push, B2C and C2B flows, retry logic and webhook validation.',
    'Supported a live e-commerce environment processing KES 1M+/month.',
    'Built a production M-Pesa Daraja integration with typed response schemas, retry logic and webhook validation, processing KES 1M+/month.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/mpesa-payment-integration-library","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":true}'::jsonb,
    '{"monthlyVolume":"KES 1M+","paymentFlows":["STK Push","B2C","C2B"]}'::jsonb,
    null,
    null,
    true,
    false,
    10
  ),
  (
    'ambooka-dev-portfolio-platform',
    'ambooka.dev Portfolio Platform',
    'Full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, role-specific resume variants, GitHub activity sync and Playwright e2e test suite.',
    'Full-stack portfolio platform with Supabase backend and admin CMS.',
    'Built ambooka.dev — a full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, role-specific resume variants, GitHub activity sync, and Playwright e2e test suite.',
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
    false,
    11
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
    12
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
    13
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
    14
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
    15
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
    'Prioritised real completed work supported by the résumé or public repository evidence.',
    'Kept portfolio professional, proof-first, and free of internal planning language.',
    'Separated client or company-sensitive details from public implementation summaries.',
    'Used status and completion_percent fields to reflect honest state rather than overclaiming.'
  ),
  jsonb_build_array(
    'Defined the problem and stakeholder need clearly.',
    'Built or implemented the system in a resume-backed academic, client, company, or portfolio context.',
    'Documented stack, outcomes and proof signals.',
    'Prepared the project for recruiter-facing presentation with README and screenshots.'
  ),
  jsonb_build_array(
    'Public records include stack, problem, solution, business value and recruiter summary.',
    'Sensitive client or company details are intentionally summarised rather than exposed.',
    'Case studies are structured for technical review and resume alignment.',
    'Only completed projects receive public case studies.'
  ),
  jsonb_build_array(
    coalesce(p.business_value, 'Project contributed practical value in a real operating context.'),
    'Strengthens the portfolio with evidence from real work rather than tutorial reproductions.',
    'Supports positioning across software, backend, payments, business systems, infrastructure, and computer vision.'
  ),
  jsonb_build_array(
    'Add screenshots and architecture diagrams where safe to publish.',
    'Add demo videos for public projects.',
    'Attach live links or sanitised technical walkthroughs where client confidentiality allows.',
    'Add verified performance or business metrics when evidence is available.'
  )
from public.projects p
where p.is_featured = true and p.status = 'completed'
order by p.display_order, p.created_at;

-- ============================================================
-- BLOG POSTS
-- ============================================================
-- Draft topics are retained but remain unpublished until complete.

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
    false,
    null
  ),
  (
    'lessons-from-erpnext-implementation',
    'Lessons from Implementing ERPNext in a Real Company',
    'What I learned designing accounts, items and procurement workflows for a trading company.',
    'Draft: This article covers business process mapping, chart of accounts design, item catalogue structure, procurement workflows and adoption lessons from ERPNext implementation.',
    'Business Systems',
    array['ERPNext', 'Business Systems', 'IT'],
    false,
    null
  ),
  (
    'building-reliable-mpesa-integrations',
    'Building Reliable M-Pesa Daraja Integrations',
    'Notes on STK Push, B2C, C2B callbacks, retry logic and webhook validation.',
    'Draft: This article explains reliability considerations in payment integrations, including typed responses, retries and webhook validation.',
    'Backend Engineering',
    array['M-Pesa', 'Node.js', 'TypeScript', 'Payments'],
    false,
    null
  ),
  (
    'computer-vision-final-year-project',
    'Building a Computer Vision Surveillance System with YOLO and OpenCV',
    'Technical lessons from my final-year computer vision research project.',
    'Draft: This article discusses problem framing, YOLO model selection, OpenCV stream processing, Flask inference APIs and accuracy-latency tradeoffs.',
    'AI / ML',
    array['YOLO', 'OpenCV', 'PyTorch', 'Computer Vision'],
    false,
    null
  );

-- ============================================================
-- KPI STATS
-- ============================================================
-- Metrics are taken directly from the supplied résumé.

insert into public.kpi_stats (
  section,
  label,
  value,
  display_order
)
values
  ('hero', 'Experience',               '3+ Years',       1),
  ('hero', 'Payment Volume',           'KES 1M+/month',  2),
  ('hero', 'Staff Supported',          '70+',            3),
  ('hero', 'Field Workers Supported',  '300+',           4),
  ('hero', 'Workstations Configured',  '40+',            5);

-- ============================================================
-- PORTFOLIO CONTENT
-- ============================================================
-- Recruiter-facing positioning based only on delivered evidence.

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
    'Software Engineer | Backend, Payments & IT Infrastructure',
    'Python · TypeScript · Node.js · FastAPI · PostgreSQL · Docker · ERPNext · Windows Server',
    'Computer Science graduate with 3+ years of hands-on experience delivering software, payment integrations, business systems, and IT infrastructure.',
    '{"ctaPrimary":"View Projects","ctaSecondary":"View Resume"}'::jsonb,
    1,
    true
  ),
  (
    'positioning',
    'Software delivery backed by real operational experience',
    'Backend APIs, payments, ERP systems, infrastructure, and computer vision.',
    'Every public claim is supported by the supplied résumé or public project evidence.',
    '{}'::jsonb,
    2,
    true
  );

-- ============================================================
-- CERTIFICATIONS
-- ============================================================
-- Certifications are not seeded without verified credentials.

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

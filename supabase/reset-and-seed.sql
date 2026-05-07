-- ============================================================
-- Ambooka Portfolio Database Reset + Seed
-- ============================================================
-- WARNING:
-- This script is destructive.
-- It drops and recreates the public schema.
--
-- Content policy:
-- - Public profile must use CV-backed evidence only.
-- - No private roadmap, Nexus, War Mode, 26-month, or fake artifact claims.
-- - Skills may reflect target direction, but must be honestly tiered.
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
  'Software Engineer | Full-Stack Developer | IT Systems | AI/ML Engineering',
  'abdulrahmanambooka@gmail.com',
  '+254 111 384 390',
  'Nairobi, Kenya',
  true,
  'Computer Science graduate with 3+ years of hands-on experience across software engineering, IT infrastructure, and production systems. On the software side: full-stack web applications, REST APIs, payment integrations, and business automation tools delivered for real clients processing real money. On the infrastructure side: enterprise ERP implementation, Windows Server administration, networking, and end-to-end IT support for a company of 70+ staff. Currently executing a structured transition into AI/ML engineering through strong CS foundations, applied machine learning, computer vision, and production-grade software engineering practice.',
  'I build practical software and systems: full-stack web applications, backend APIs, payment integrations, business automation tools, ERP workflows, IT infrastructure and applied AI/ML systems.',
  '[
    "Software Engineering",
    "Full-Stack Development",
    "Backend APIs",
    "Payment Integrations",
    "IT Systems",
    "ERP Implementation",
    "AI/ML Engineering",
    "Business Automation",
    "Infrastructure Support"
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
    "monthlyPaymentsProcessed":"KES 1M+"
  }'::jsonb,
  'https://github.com/ambooka',
  'https://linkedin.com/in/abdulrahman-ambooka',
  'https://ambooka.dev'
);

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
    'Hebatullah Brothers Limited',
    'IT Assistant',
    'Nairobi, Kenya',
    'Full-time',
    '2025-01-01',
    null,
    true,
    'Part of a two-person IT team responsible for the full technology stack of a trading company — hardware infrastructure, enterprise software, networking, and digital systems — serving 70+ office staff and 300+ field workers.',
    array[
      'Administered the Windows Server environment including Active Directory, group policies, and user account lifecycle management.',
      'Installed and maintains CCTV systems across all company premises; manages biometric attendance hardware for 300+ enrolled workers.',
      'Provides end-to-end helpdesk support — hardware, software, connectivity, accounts — from first call to resolution.'
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
    'Independent contractor delivering full-stack web applications, APIs, and business automation tools for clients across Kenya and internationally. 12+ projects delivered with 100% on-time completion.',
    array[
      'Delivered full-stack web applications, APIs, and business automation tools for clients across Kenya and internationally.',
      'Consistently containerised and deployed all applications to Hetzner VPS behind Nginx with Let''s Encrypt SSL and GitHub Actions CI/CD pipelines.'
    ],
    array[
      'Built and integrated a production-grade Safaricom Daraja API implementation (M-Pesa STK Push, B2C disbursements, C2B paybill callbacks) for an e-commerce client currently processing KES 1M+/month — includes BullMQ async job queue, exponential backoff retry logic, and PostgreSQL transaction audit log.',
      'Replaced a Nairobi SME client''s manual Excel-based invoicing process with a custom React + FastAPI dashboard featuring automated PDF generation, WhatsApp notifications via Africa''s Talking API, and a live analytics panel — reducing manual processing effort by 80%.',
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
  ('Python', 'Languages', 90, 90, true, 1, 1),
  ('TypeScript', 'Languages', 86, 86, true, 2, 1),
  ('JavaScript', 'Languages', 84, 84, true, 3, 1),
  ('SQL', 'Languages', 86, 86, true, 4, 1),
  ('Bash', 'Languages', 78, 78, true, 5, 1),
  ('Go', 'Strengthening', 55, 55, false, 6, 5),
  ('Java', 'Strengthening', 50, 50, false, 7, 5),
  ('C#', 'Languages', 58, 58, false, 8, 3),
  ('Kotlin', 'Strengthening', 45, 45, false, 9, 5),

  ('React', 'Frontend', 86, 86, true, 10, 2),
  ('Next.js', 'Frontend', 84, 84, true, 11, 2),
  ('HTML5', 'Frontend', 88, 88, true, 12, 2),
  ('CSS3', 'Frontend', 84, 84, true, 13, 2),
  ('Tailwind CSS', 'Frontend', 82, 82, true, 14, 2),
  ('Zustand', 'Frontend', 68, 68, false, 15, 2),

  ('Node.js', 'Backend', 82, 82, true, 16, 3),
  ('Express', 'Backend', 80, 80, true, 17, 3),
  ('FastAPI', 'Backend', 82, 82, true, 18, 3),
  ('Flask', 'Backend', 76, 76, false, 19, 3),
  ('REST APIs', 'Backend', 88, 88, true, 20, 3),
  ('OpenAPI / Swagger', 'Backend', 72, 72, false, 21, 3),

  ('PostgreSQL', 'Databases', 84, 84, true, 22, 4),
  ('Redis', 'Databases', 74, 74, true, 23, 4),
  ('Supabase', 'Databases', 80, 80, true, 24, 4),
  ('SQLite', 'Databases', 72, 72, false, 25, 4),

  ('Docker', 'DevOps & Infrastructure', 82, 82, true, 26, 4),
  ('Docker Compose', 'DevOps & Infrastructure', 82, 82, true, 27, 4),
  ('Nginx', 'DevOps & Infrastructure', 78, 78, true, 28, 4),
  ('Linux Ubuntu', 'DevOps & Infrastructure', 80, 80, true, 29, 4),
  ('GitHub Actions', 'DevOps & Infrastructure', 76, 76, true, 30, 4),
  ('Hetzner VPS', 'DevOps & Infrastructure', 74, 74, false, 31, 4),

  ('Windows Server', 'IT Systems', 80, 80, true, 32, 6),
  ('Active Directory', 'IT Systems', 76, 76, true, 33, 6),
  ('ERPNext', 'IT Systems', 82, 82, true, 34, 6),
  ('VoIP', 'IT Systems', 72, 72, false, 35, 6),
  ('CCTV Systems', 'IT Systems', 76, 76, false, 36, 6),
  ('Biometric Systems', 'IT Systems', 74, 74, false, 37, 6),
  ('TCP/IP Networking', 'IT Systems', 80, 80, true, 38, 6),

  ('PyTorch', 'AI / ML', 68, 68, true, 39, 7),
  ('OpenCV', 'AI / ML', 78, 78, true, 40, 7),
  ('YOLO', 'AI / ML', 76, 76, true, 41, 7),
  ('scikit-learn', 'AI / ML', 68, 68, true, 42, 7),
  ('Hugging Face', 'AI / ML', 55, 55, false, 43, 7),
  ('Jupyter', 'AI / ML', 76, 76, false, 44, 7),

  ('Git', 'Tools', 84, 84, true, 45, 8),
  ('VS Code', 'Tools', 90, 90, true, 46, 8),
  ('Postman', 'Tools', 80, 80, false, 47, 8),
  ('Wireshark', 'Tools', 70, 70, false, 48, 8),

  ('Kubernetes', 'Strengthening', 42, 42, false, 49, 8),
  ('Terraform', 'Strengthening', 38, 38, false, 50, 8),
  ('MLflow', 'Strengthening', 38, 38, false, 51, 8),
  ('LangChain', 'Strengthening', 42, 42, false, 52, 8),
  ('pgvector', 'Strengthening', 38, 38, false, 53, 8),
  ('AWS', 'Strengthening', 46, 46, false, 54, 8);

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
  (1, 'Core Languages', 'Current focus', 'active', 'Python, TypeScript, JavaScript, SQL and Bash used across software engineering, automation and backend work.', 0, array['Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash']),
  (2, 'Frontend Engineering', 'Current focus', 'active', 'React, Next.js, HTML, CSS, Tailwind and state management for full-stack applications.', 0, array['React', 'Next.js', 'Tailwind CSS']),
  (3, 'Backend Engineering', 'Current focus', 'active', 'REST APIs, FastAPI, Flask, Node.js, Express, OpenAPI, payment integrations and business systems.', 0, array['FastAPI', 'Node.js', 'Express', 'Flask']),
  (4, 'Databases and Deployment', 'Current focus', 'active', 'PostgreSQL, Redis, Supabase, Docker, Nginx, Linux, GitHub Actions and VPS deployments.', 0, array['PostgreSQL', 'Redis', 'Docker', 'Nginx']),
  (5, 'Expanding Engineering Range', 'Strengthening', 'active', 'Go, Java, Kotlin and other engineering languages being strengthened through practical systems work.', 0, array['Go', 'Java', 'Kotlin']),
  (6, 'IT Systems and Business Operations', 'Professional experience', 'active', 'ERPNext, Windows Server, Active Directory, networking, CCTV, biometrics and operational IT support.', 0, array['ERPNext', 'Windows Server', 'Active Directory']),
  (7, 'AI and Machine Learning', 'Academic + strengthening', 'active', 'PyTorch, OpenCV, YOLO, scikit-learn, Hugging Face and applied computer vision.', 0, array['PyTorch', 'OpenCV', 'YOLO']),
  (8, 'Cloud, MLOps and Advanced AI', 'Strengthening', 'active', 'Kubernetes, Terraform, MLflow, LangChain, pgvector and AWS are strengthening areas, not public achievement claims.', 0, array['Kubernetes', 'Terraform', 'MLflow', 'LangChain', 'AWS']);

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
  (
    'ai-powered-surveillance-system',
    'AI-Powered Surveillance System',
    'Final-year research project implementing real-time object detection and automated threat recognition using YOLO, OpenCV and Flask.',
    'Real-time AI surveillance research project using YOLO, OpenCV and Flask.',
    'Designed and built an end-to-end AI surveillance system addressing police response time and automated threat recognition in urban environments. Implemented real-time object detection and threat classification using YOLO architectures, evaluated multiple variants for accuracy-latency trade-off, built a Flask API backend, and integrated OpenCV for live video stream processing.',
    'AI / Computer Vision',
    array['Python', 'PyTorch', 'YOLOv5/v8', 'OpenCV', 'Flask', 'NumPy', 'Linux'],
    array['Computer Vision', 'Model Inference', 'API Development', 'Research', 'Real-Time Systems'],
    'completed',
    100,
    7,
    'Urban surveillance workflows often rely on manual monitoring and delayed threat recognition.',
    'Built a YOLO-based real-time object detection system with Flask API, OpenCV stream processing and automated alerting.',
    'Demonstrated real-time threat recognition with a functional automated alerting pipeline.',
    'Built an end-to-end AI surveillance system with YOLO, OpenCV, Flask inference API and automated alert generation.',
    '{"github":null,"liveDemo":null,"caseStudy":"/case-studies/ai-powered-surveillance-system","apiDocs":null,"video":null}'::jsonb,
    '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":true,"docs":true,"deployed":false}'::jsonb,
    '{"domain":"computer vision","projectType":"final-year research"}'::jsonb,
    null,
    null,
    true,
    true,
    1
  ),
  (
    'mpesa-payment-integration-library',
    'M-Pesa Payment Integration Library',
    'Production Node.js and TypeScript library abstracting the Safaricom Daraja API: STK Push, B2C, C2B, typed response schemas, retry logic and webhook validation.',
    'Typed M-Pesa Daraja integration library deployed in a live e-commerce environment.',
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
    2
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
    3
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
    4
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
    true,
    5
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
    true,
    false,
    6
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
    true,
    false,
    7
  );

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
    'This project solves a real software, infrastructure, business or AI/ML engineering problem.'
  ),
  jsonb_build_array(
    'Problem-first project framing so recruiters and technical reviewers understand the context quickly.',
    'Implementation layer uses the stack listed in the project record.',
    'Where applicable, persistence, integrations, deployment and operational workflows are documented.',
    'Case study focuses on business value, engineering choices and measurable outcomes.'
  ),
  jsonb_build_array(
    'Prioritized real experience and completed work over private learning plans.',
    'Kept the portfolio professional, proof-first and free from playful visual gimmicks.',
    'Separated client/company-sensitive details from public implementation summaries.',
    'Used status, proof and engineering-evidence fields to avoid overclaiming.'
  ),
  jsonb_build_array(
    'Defined the problem and stakeholder need.',
    'Built or implemented the system in a real academic, freelance or company context.',
    'Documented stack, outcomes and proof signals.',
    'Prepared the project for recruiter-facing presentation.'
  ),
  jsonb_build_array(
    'Public project records include stack, problem, solution, business value and recruiter summary.',
    'Sensitive client/company details are intentionally summarized instead of exposed.',
    'Case studies are structured for technical review and resume alignment.',
    'Visual design should remain calm, readable and professional.'
  ),
  jsonb_build_array(
    coalesce(p.business_value, 'Project contributed practical value in a real operating context.'),
    'Strengthens the portfolio with evidence from real work rather than tutorial projects.',
    'Supports positioning across software engineering, IT systems and AI/ML engineering.'
  ),
  jsonb_build_array(
    'Add screenshots where safe to publish.',
    'Add architecture diagrams for the most important projects.',
    'Add demo videos for public projects.',
    'Attach live links or sanitized technical walkthroughs where client confidentiality allows.'
  )
from public.projects p
where p.is_featured = true
order by p.display_order, p.created_at;

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
    'Building an AI-Powered Surveillance System with YOLO and OpenCV',
    'Technical lessons from my final-year computer vision research project.',
    'Draft: This article discusses problem framing, YOLO model selection, OpenCV stream processing, Flask inference APIs and accuracy-latency tradeoffs.',
    'AI / ML',
    array['YOLO', 'OpenCV', 'PyTorch', 'Computer Vision'],
    true,
    now()
  );

insert into public.kpi_stats (
  section,
  label,
  value,
  display_order
)
values
  ('hero', 'Experience', '3+ Years', 1),
  ('hero', 'Projects Delivered', '12+', 2),
  ('hero', 'Staff Supported', '70+', 3),
  ('hero', 'Field Workers Supported', '300+', 4),
  ('hero', 'Payment Volume Supported', 'KES 1M+/month', 5),
  ('hero', 'Core Stack', 'Python · TypeScript · PostgreSQL', 6);

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
    'Software Engineer building full-stack, infrastructure, and applied AI/ML systems.',
    'Python · TypeScript · React · Next.js · FastAPI · PostgreSQL · Docker · ERPNext · OpenCV · YOLO',
    'Computer Science graduate with 3+ years of hands-on experience across software engineering, IT infrastructure, production systems, ERP implementation, payment integrations, and computer vision.',
    '{"ctaPrimary":"View Projects","ctaSecondary":"Download Resume"}'::jsonb,
    1,
    true
  ),
  (
    'positioning',
    'Production-minded software engineer with infrastructure depth.',
    'Full-stack applications, payment systems, ERP implementation, IT operations and AI/ML engineering direction.',
    'This portfolio focuses on real completed work, client/company experience, academic AI research and production engineering habits.',
    '{}'::jsonb,
    2,
    true
  ),
  (
    'portfolio_policy',
    'Public portfolio policy',
    'Private learning plans are not presented as achievements.',
    'The site only presents real resume evidence, completed public projects, real client/company work, academic research, and honest in-progress skill development.',
    '{}'::jsonb,
    3,
    true
  );

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
    'AWS Cloud Practitioner CLF-C02',
    'AWS',
    'in_progress',
    null,
    '2025-12-31',
    null,
    false,
    null,
    2
  ),
  (
    'HashiCorp Terraform Associate 003',
    'HashiCorp',
    'in_progress',
    null,
    '2025-12-31',
    null,
    false,
    null,
    3
  ),
  (
    'Certified Kubernetes Administrator',
    'CNCF',
    'planned',
    null,
    '2026-12-31',
    null,
    false,
    null,
    4
  );

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

alter table public.personal_info enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.case_studies enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.page_views enable row level security;
alter table public.kpi_stats enable row level security;
alter table public.portfolio_content enable row level security;
alter table public.roadmap_phases enable row level security;
alter table public.certifications enable row level security;

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

grant select on all tables in schema public to anon;
grant insert on public.contact_messages to anon;
grant insert on public.page_views to anon;

grant all on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

commit;
-- Evidence-first portfolio database reset + seed
-- WARNING: This drops and recreates the public schema.
-- Use only when you intentionally want a clean portfolio database.

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
  twitter_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.education (
  id uuid primary key default extensions.gen_random_uuid(),
  institution text not null,
  degree text,
  field_of_study text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  description text,
  grade text,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.experience (
  id uuid primary key default extensions.gen_random_uuid(),
  company text not null,
  position text not null,
  location text,
  start_date date not null,
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
  proficiency int default 70,
  proficiency_level int default 70,
  icon_url text,
  is_featured boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.projects (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  one_line text,
  long_description text,
  category text default 'backend',
  stack text[] default '{}',
  core_skills text[] default '{}',
  status text default 'planned',
  completion_percent int default 0,
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

create index projects_category_idx on public.projects(category);
create index projects_status_idx on public.projects(status);
create index projects_featured_idx on public.projects(is_featured, is_anchor);

create table public.case_studies (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  project_slug text,
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

create table public.certifications (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  provider text,
  target_date date,
  is_obtained boolean default false,
  credential_url text,
  icon_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.writing_plan (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  status text default 'planned',
  summary text,
  target_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
declare
  t text;
begin
  foreach t in array array[
    'personal_info','education','experience','skills','projects','case_studies','testimonials','blog_posts','contact_messages','kpi_stats','portfolio_content','certifications','writing_plan'
  ]
  loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t);
  end loop;
end;
$$;

insert into public.personal_info (
  full_name, title, email, phone, location, summary, about_text, expertise, social_links, kpi_stats, github_url, linkedin_url, website_url
)
values (
  'Msah Ambooka',
  'Software Engineer | Full-Stack Developer | IT Systems | AI/ML Engineering',
  'abdulrahmanambooka@gmail.com',
  '+254 111 384 390',
  'Nairobi, Kenya | Open to relocation',
  'Computer Science graduate with 3+ years of hands-on experience across software engineering, IT infrastructure, production systems and applied AI/ML. Builds full-stack web applications, REST APIs, payment integrations, ERP/business automation tools, and production-ready portfolio systems.',
  'I combine software engineering and IT systems experience: full-stack apps, APIs, M-Pesa integrations, ERPNext implementation, Windows Server/Active Directory, networking, CCTV, biometrics and applied computer vision research. My current technical direction is AI/ML engineering with production discipline: Python, TypeScript, SQL, Docker, FastAPI, model APIs, RAG, MLOps, monitoring and deployment.',
  '["Software Engineering", "Full-Stack Development", "IT Systems", "Business Automation", "AI/ML Engineering"]'::jsonb,
  '[{"platform":"GitHub","url":"https://github.com/ambooka","icon_url":null,"is_active":true},{"platform":"LinkedIn","url":"https://linkedin.com/in/abdulrahman-ambooka","icon_url":null,"is_active":true}]'::jsonb,
  '{"years_experience":"3+","project_count":12,"tagline":"Software Engineer · Full-Stack · IT Systems · AI/ML Engineering","headline":"Production software, IT systems, and applied AI/ML engineering","role":"Software Engineer","focus":"Backend, full-stack, data, deployment, ERP and AI/ML systems","expertise_breakdown":{"software":45,"cloud_infra":25,"data":15,"ml_ai":15}}'::jsonb,
  'https://github.com/ambooka',
  'https://linkedin.com/in/abdulrahman-ambooka',
  'https://ambooka.dev'
);

insert into public.education (institution, degree, field_of_study, start_date, end_date, description, grade, display_order)
values
  ('Maseno University', 'Bachelor of Science', 'Computer Science', '2019-09-01', '2024-12-01', 'Relevant coursework: Algorithms & Data Structures, Machine Learning, Computer Networks, Database Systems, Software Engineering, Artificial Intelligence, Computer Vision, Operating Systems.', 'Second Class Honours (Upper Division) · GPA: ~3.3 / 4.0', 1),
  ('Starehe Boys'' Centre & School', 'Kenya Certificate of Secondary Education', 'Sciences Track', '2015-01-01', '2018-12-01', 'Sciences track. Admission by national competitive examination.', null, 2);

insert into public.experience (company, position, location, start_date, end_date, is_current, description, responsibilities, achievements, technologies, display_order)
values
  (
    'Hebatullah Brothers Limited',
    'IT Assistant',
    'Nairobi, Kenya',
    '2025-01-01',
    null,
    true,
    'Part of a two-person IT team responsible for the full technology stack of a trading company — hardware infrastructure, enterprise software, networking and digital systems — serving 70+ office staff and 300+ field workers.',
    array[
      'Provides end-to-end helpdesk support across hardware, software, connectivity, user accounts and operational systems.',
      'Administers Windows Server environment including Active Directory, group policies and user account lifecycle management.',
      'Maintains CCTV systems across company premises and manages biometric attendance hardware for 300+ enrolled workers.'
    ],
    array[
      'Implemented ERPNext from scratch, designing chart of accounts, item catalogue and procurement workflows to replace manual inventory, finance and HR processes.',
      'Reworked hebatullah.com from a static HTML site to a CMS so marketing staff can update content without developer involvement.',
      'Installed and commissioned network infrastructure including switches, wireless access points, cabling and VoIP desk phone system.'
    ],
    array['ERPNext','Windows Server','Active Directory','TCP/IP','VoIP','CCTV','Biometric Systems'],
    1
  ),
  (
    'Self-Employed',
    'Freelance Full-Stack Developer',
    'Nairobi, Kenya (Remote)',
    '2022-01-01',
    null,
    true,
    'Independent contractor delivering full-stack web applications, APIs and business automation tools for clients across Kenya and internationally. 12+ projects delivered with 100% on-time completion.',
    array[
      'Designs and builds full-stack web applications, APIs and automation tools using Python, TypeScript, React, Next.js, Node.js and PostgreSQL.',
      'Containerises and deploys applications to VPS environments behind Nginx with SSL and CI/CD workflows.',
      'Documents APIs, deployment steps and client handoff processes.'
    ],
    array[
      'Built and integrated a production-grade Safaricom Daraja implementation for an e-commerce client processing KES 1M+/month, including STK Push, B2C, C2B callbacks, BullMQ retries and PostgreSQL transaction audit logs.',
      'Replaced a Nairobi SME client''s manual Excel-based invoicing process with a React + FastAPI dashboard featuring PDF generation, WhatsApp notifications and live analytics, reducing manual processing effort by 80%.',
      'Built ambooka.dev as a full-stack Next.js portfolio platform with Supabase backend, admin CMS, resume variants, GitHub activity sync and Playwright e2e testing.'
    ],
    array['Python','TypeScript','React','Next.js','Node.js','FastAPI','PostgreSQL','Redis','Docker','Nginx','M-Pesa Daraja API','Africa''s Talking API','BullMQ','Supabase'],
    2
  ),
  (
    'Masinde Muliro University of Science & Technology',
    'IT Infrastructure Intern',
    'Kakamega, Kenya',
    '2023-05-01',
    '2023-08-31',
    false,
    'Supported campus-wide network administration, server room operations and faculty/student technical support.',
    array['Configured and deployed 40+ workstations in a new computer lab.', 'Supported network administration, server room operations and user support.', 'Diagnosed hardware, software and connectivity issues.'],
    array['Completed lab setup ahead of semester start.', 'Diagnosed and resolved a recurring DHCP conflict disrupting connectivity for 200+ campus devices.'],
    array['Network Administration','Linux','Windows Server','TCP/IP','Hardware Configuration'],
    3
  );

insert into public.skills (name, category, proficiency, proficiency_level, is_featured, display_order)
values
  ('Python', 'Languages', 90, 90, true, 1),
  ('TypeScript', 'Languages', 88, 88, true, 2),
  ('JavaScript', 'Languages', 86, 86, true, 3),
  ('SQL', 'Languages', 86, 86, true, 4),
  ('Bash', 'Languages', 80, 80, true, 5),
  ('Go', 'Languages', 65, 65, false, 6),
  ('Java', 'Languages', 60, 60, false, 7),
  ('Kotlin', 'Languages', 55, 55, false, 8),
  ('C#', 'Languages', 60, 60, false, 9),
  ('React', 'Frontend', 88, 88, true, 10),
  ('Next.js', 'Frontend', 86, 86, true, 11),
  ('HTML5', 'Frontend', 90, 90, true, 12),
  ('CSS3', 'Frontend', 88, 88, true, 13),
  ('Tailwind CSS', 'Frontend', 82, 82, true, 14),
  ('Zustand', 'Frontend', 70, 70, false, 15),
  ('Node.js', 'Backend', 84, 84, true, 16),
  ('Express', 'Backend', 80, 80, true, 17),
  ('FastAPI', 'Backend', 80, 80, true, 18),
  ('Flask', 'Backend', 74, 74, false, 19),
  ('REST APIs', 'Backend', 88, 88, true, 20),
  ('OpenAPI/Swagger', 'Backend', 78, 78, false, 21),
  ('PostgreSQL', 'Databases', 84, 84, true, 22),
  ('Redis', 'Databases', 72, 72, false, 23),
  ('Supabase', 'Databases', 82, 82, true, 24),
  ('SQLite', 'Databases', 74, 74, false, 25),
  ('Docker', 'DevOps & Infra', 82, 82, true, 26),
  ('Docker Compose', 'DevOps & Infra', 82, 82, true, 27),
  ('Nginx', 'DevOps & Infra', 78, 78, true, 28),
  ('Linux / Ubuntu', 'DevOps & Infra', 82, 82, true, 29),
  ('GitHub Actions', 'DevOps & Infra', 75, 75, false, 30),
  ('Hetzner VPS', 'DevOps & Infra', 78, 78, false, 31),
  ('Windows Server', 'IT Systems', 82, 82, true, 32),
  ('Active Directory', 'IT Systems', 78, 78, true, 33),
  ('ERPNext', 'IT Systems', 80, 80, true, 34),
  ('VoIP', 'IT Systems', 72, 72, false, 35),
  ('CCTV', 'IT Systems', 76, 76, false, 36),
  ('Biometric Systems', 'IT Systems', 76, 76, false, 37),
  ('TCP/IP', 'IT Systems', 82, 82, true, 38),
  ('PyTorch', 'AI / ML', 68, 68, false, 39),
  ('OpenCV', 'AI / ML', 76, 76, true, 40),
  ('YOLO', 'AI / ML', 74, 74, true, 41),
  ('scikit-learn', 'AI / ML', 68, 68, false, 42),
  ('Hugging Face', 'AI / ML', 55, 55, false, 43),
  ('Jupyter', 'AI / ML', 72, 72, false, 44),
  ('Kubernetes', 'Learning', 45, 45, false, 45),
  ('Terraform', 'Learning', 45, 45, false, 46),
  ('MLflow', 'Learning', 45, 45, false, 47),
  ('LangChain', 'Learning', 45, 45, false, 48),
  ('pgvector', 'Learning', 45, 45, false, 49),
  ('AWS', 'Learning', 45, 45, false, 50);

with project_seed (slug,title,category,status,completion_percent,is_featured,is_anchor,display_order,stack,one_line,problem,solution,business_value,recruiter_summary,proof,engineering_evidence,metrics) as (
  values
    ('ambooka-dev-portfolio-platform','ambooka.dev Portfolio Platform','frontend','completed',92,true,true,1,array['Next.js','TypeScript','React','Supabase','PostgreSQL','Playwright','Tailwind CSS','Vercel']::text[],'Full-stack Next.js portfolio platform with Supabase CMS, admin area, resume variants, GitHub activity sync and Playwright e2e tests.','A static portfolio could not represent changing project evidence, role-specific resumes, case studies, admin-managed content or serious engineering standards.','Built a full-stack portfolio platform with public pages, admin CMS, Supabase-backed content, SEO, project case studies, resume data and test automation.','Turns personal career evidence into a searchable, recruiter-readable software product instead of a static CV page.','Built and maintains a full-stack Next.js portfolio/CMS with Supabase data, admin content management, resume variants, GitHub sync, SEO and e2e tests.','{"github":"https://github.com/ambooka/ambooka","liveDemo":"https://ambooka.dev","caseStudy":"/case-studies/ambooka-dev-portfolio-platform"}'::jsonb,'{"tests":true,"ci":true,"docker":false,"databaseMigrations":true,"monitoring":false,"docs":true,"deployed":true}'::jsonb,'{"uptime":"Public Vercel deployment","businessImpact":"Primary recruiter-facing proof platform"}'::jsonb),
    ('hebatullah-erpnext-implementation','Hebatullah ERPNext Implementation','enterprise','completed',90,true,true,2,array['ERPNext','Frappe','MariaDB','Python','Linux','Business Process Design','Windows Server','Active Directory']::text[],'Enterprise ERP rollout replacing manual inventory, finance, procurement and HR workflows for a 70+ staff organization.','Manual inventory, finance, procurement and HR workflows limited traceability, reporting and process consistency.','Implemented ERPNext from scratch: chart of accounts, item catalogue, procurement workflows, business process mapping and operational support.','Improved operational visibility, process consistency and enterprise data structure for a real company environment.','Implemented ERPNext for a real trading company, covering accounting structure, item master data, procurement workflows and operational IT support.','{"liveDemo":"https://hebatullah.com","caseStudy":"/case-studies/hebatullah-erpnext-implementation"}'::jsonb,'{"tests":false,"ci":false,"docker":false,"databaseMigrations":true,"monitoring":true,"docs":true,"deployed":true}'::jsonb,'{"businessImpact":"Serves 70+ office staff and supports 300+ field-worker attendance records"}'::jsonb),
    ('mpesa-payment-integration-library','M-Pesa Payment Integration Library','backend','completed',95,true,true,3,array['Node.js','TypeScript','PostgreSQL','BullMQ','Redis','Safaricom Daraja API','REST APIs']::text[],'Production Safaricom Daraja integration for STK Push, B2C, C2B callbacks, retries, typed responses and transaction audit logs.','Kenyan e-commerce clients need reliable M-Pesa payment flows that handle callbacks, retries, failures and transaction auditability.','Built a Node.js + TypeScript Daraja API abstraction with typed schemas, BullMQ async jobs, exponential backoff, webhook validation and PostgreSQL audit logging.','Deployed in a live e-commerce environment processing KES 1M+/month.','Built a production M-Pesa Daraja integration with STK Push, B2C, C2B callbacks, async retries and transaction audit logging.','{"github":"https://github.com/ambooka/pesapal-minidb","caseStudy":"/case-studies/mpesa-payment-integration-library"}'::jsonb,'{"tests":true,"ci":true,"docker":false,"databaseMigrations":true,"monitoring":false,"docs":true,"deployed":true}'::jsonb,'{"throughput":"KES 1M+/month client processing volume","businessImpact":"Real-money payment integration"}'::jsonb),
    ('sme-invoicing-reporting-dashboard','SME Invoicing & Reporting Dashboard','backend','completed',90,true,true,4,array['React','TypeScript','FastAPI','Python','PostgreSQL','Docker','Africa''s Talking API','PDF generation']::text[],'React + FastAPI dashboard replacing manual Excel invoicing with PDF generation, WhatsApp notifications and analytics.','A Nairobi SME relied on manual Excel invoicing, causing repetitive work, delays and weak reporting visibility.','Built a custom dashboard with automated invoice generation, PDF outputs, WhatsApp notifications and live analytics.','Reduced manual processing effort by roughly 80% and improved operational visibility.','Delivered a business automation dashboard that replaced manual invoicing with API-backed workflows, PDF output, notifications and analytics.','{"caseStudy":"/case-studies/sme-invoicing-reporting-dashboard"}'::jsonb,'{"tests":true,"ci":false,"docker":true,"databaseMigrations":true,"monitoring":false,"docs":true,"deployed":true}'::jsonb,'{"businessImpact":"Reduced manual processing effort by 80%"}'::jsonb),
    ('ai-powered-surveillance-system','AI-Powered Surveillance System','ml','completed',88,true,true,5,array['Python','PyTorch','YOLOv5/v8','OpenCV','Flask','NumPy','Linux']::text[],'Final-year research project using YOLO, OpenCV and Flask for real-time object detection, threat classification and alerting.','Urban surveillance workflows need faster automated threat recognition and alerting to support response teams.','Designed and implemented a real-time video inference pipeline using YOLO architectures, OpenCV stream processing and a Flask backend.','Demonstrated applied computer vision, model evaluation, latency trade-offs and an automated alerting pipeline.','Built an end-to-end computer vision research system for real-time object detection, threat classification and alert generation.','{"caseStudy":"/case-studies/ai-powered-surveillance-system"}'::jsonb,'{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":true,"docs":true,"deployed":false}'::jsonb,'{"modelAccuracy":"Evaluated accuracy-latency trade-offs across YOLO variants"}'::jsonb),
    ('hebatullah-cms-website-rebuild','Hebatullah CMS Website Rebuild','frontend','completed',88,false,false,6,array['CMS','Web Administration','Content Modeling','SEO','Hosting']::text[],'Reworked a static company website into a CMS-managed site so the marketing team can update content without developer involvement.','The company website was static and required developer intervention for content updates.','Migrated the site to a content-managed setup with cleaner update workflows for non-technical staff.','Reduced dependency on developers for routine marketing content updates.','Converted a static business site into a CMS-driven web presence for operational maintainability.','{"liveDemo":"https://hebatullah.com"}'::jsonb,'{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":true,"deployed":true}'::jsonb,'{"businessImpact":"Marketing team can update content directly"}'::jsonb),
    ('it-infrastructure-rollout','Company IT Infrastructure Rollout','devops','completed',90,false,false,7,array['Windows Server','Active Directory','TCP/IP','VoIP','CCTV','Biometric Systems','Networking']::text[],'Installed and commissioned switches, wireless access points, cabling, VoIP desk phones, CCTV and biometric attendance systems.','A growing company needed reliable office infrastructure, network access, security systems and user support.','Supported end-to-end infrastructure setup and administration across networking, Windows Server, AD, CCTV, VoIP and biometrics.','Supports 70+ staff operations and 300+ field-worker attendance records.','Handled practical IT infrastructure delivery and support across network, server, security and user systems.','{"caseStudy":"/case-studies/it-infrastructure-rollout"}'::jsonb,'{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":true,"docs":true,"deployed":true}'::jsonb,'{"businessImpact":"70+ staff and 300+ field-worker system support"}'::jsonb)
)
insert into public.projects (slug,title,category,status,completion_percent,is_featured,is_anchor,display_order,stack,core_skills,one_line,description,long_description,problem,solution,business_value,recruiter_summary,proof,engineering_evidence,metrics,github_url,live_url)
select slug,title,category,status,completion_percent,is_featured,is_anchor,display_order,stack,stack,one_line,one_line,solution,problem,solution,business_value,recruiter_summary,proof,engineering_evidence,metrics,proof->>'github',proof->>'liveDemo'
from project_seed;

insert into public.case_studies (slug, project_slug, title, subtitle, summary, problem, architecture, key_decisions, implementation, quality, results, future_improvements)
select
  slug,
  slug,
  title,
  one_line,
  recruiter_summary,
  problem,
  jsonb_build_array('Application or system layer implements the workflow.', 'Data and audit records are persisted where relevant.', 'Public documentation explains the problem, stack, business value and implementation evidence.'),
  jsonb_build_array('Lead with real achievements and measurable business value.', 'Separate delivered work from future learning goals.', 'Keep visual design professional and evidence-first.'),
  jsonb_build_array(solution, 'Documented stack, proof, metrics and improvement path.'),
  jsonb_build_array('Completion-aware status.', 'Evidence fields for docs, deployment, testing and operational proof.', 'No private learning plan presented as an achievement.'),
  jsonb_build_array(business_value),
  jsonb_build_array('Add screenshots and deeper architecture diagrams.', 'Add live demo links where privacy/client constraints allow.', 'Add performance metrics after safe public sanitization.')
from project_seed
where is_anchor = true;

insert into public.blog_posts (slug,title,excerpt,content,category,tags,is_published,published_at)
values
  ('building-production-payment-integrations','Building reliable payment integrations for Kenyan businesses','Notes on Daraja callbacks, retries, transaction logging and production failure handling.','Draft article to be expanded with sanitized implementation details.','backend',array['payments','M-Pesa','TypeScript','PostgreSQL'],true,now()),
  ('erpnext-implementation-lessons','Lessons from implementing ERPNext in a real company','What ERP rollout teaches about workflows, data models, permissions and user adoption.','Draft article to be expanded with implementation lessons.','enterprise',array['ERPNext','business systems','IT'],true,now()),
  ('computer-vision-final-year-project','Building a real-time AI surveillance research system','YOLO, OpenCV, Flask and practical accuracy-latency trade-offs.','Draft article to be expanded from final-year research.','ai-ml',array['YOLO','OpenCV','Flask','computer vision'],true,now());

insert into public.kpi_stats (section,label,value,display_order)
values
  ('hero','Experience','3+ years',1),
  ('hero','Delivered Projects','12+',2),
  ('hero','Live Payment Volume','KES 1M+/month',3),
  ('hero','Org IT Support','70+ staff',4),
  ('hero','Field Worker Systems','300+ workers',5);

insert into public.portfolio_content (section,title,subtitle,content,metadata,display_order,is_active)
values
  ('hero','Software Engineer | Full-Stack Developer | IT Systems | AI/ML Engineering','Python · TypeScript · SQL · Docker · FastAPI · Next.js · ERPNext · OpenCV · PyTorch','I build practical software and IT systems: full-stack apps, APIs, business automation, payment integrations, ERP workflows, infrastructure support and applied AI/ML projects.','{"ctaPrimary":"View Work","ctaSecondary":"Download Resume"}'::jsonb,1,true),
  ('positioning','Evidence-first portfolio','Real client work, production systems, IT infrastructure and applied AI/ML proof.','Private learning plans are not represented as portfolio achievements. Skills and future direction appear as skills, not fake projects.','{}'::jsonb,2,true);

insert into public.writing_plan (slug,title,category,status,summary,target_date)
values
  ('mpesa-integration-case-study','M-Pesa Integration Case Study','backend','planned','Write a sanitized case study about callback reliability, retries and audit logs.',current_date + interval '14 days'),
  ('erpnext-implementation-case-study','ERPNext Implementation Case Study','enterprise','planned','Document practical lessons from implementing ERPNext in a real company.',current_date + interval '21 days'),
  ('ai-surveillance-research-summary','AI Surveillance Research Summary','ai-ml','planned','Summarize final-year computer vision architecture and lessons learned.',current_date + interval '30 days');

insert into public.certifications (name,provider,target_date,is_obtained)
values
  ('BSc Computer Science','Maseno University','2024-12-01',true),
  ('AWS Cloud Practitioner (CLF-C02)','AWS','2025-12-31',false),
  ('HashiCorp Terraform Associate (003)','HashiCorp','2025-12-31',false),
  ('Certified Kubernetes Administrator (CKA)','CNCF','2026-12-31',false);

insert into public.testimonials (name,text,is_featured,display_order)
values ('Portfolio Review Note','This portfolio is structured around real experience, project evidence, technical clarity and professional presentation.',true,1);

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
alter table public.certifications enable row level security;
alter table public.writing_plan enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['personal_info','education','experience','skills','projects','case_studies','testimonials','blog_posts','kpi_stats','portfolio_content','certifications','writing_plan']
  loop
    execute format('create policy public_read_%I on public.%I for select using (true)', t, t);
    execute format('create policy authenticated_manage_%I on public.%I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end;
$$;

create policy public_insert_contact_messages on public.contact_messages for insert with check (true);
create policy authenticated_manage_contact_messages on public.contact_messages for all to authenticated using (true) with check (true);
create policy public_insert_page_views on public.page_views for insert with check (true);
create policy authenticated_read_page_views on public.page_views for select to authenticated using (true);

grant select on all tables in schema public to anon;
grant insert on public.contact_messages to anon;
grant insert on public.page_views to anon;
grant all on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

commit;

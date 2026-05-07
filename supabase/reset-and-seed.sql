
-- ============================================================
-- Ambooka Portfolio Database Reset + Seed
-- ============================================================
-- Destructive reset for the public portfolio database.
-- Public data is based on resume evidence only.
-- Private learning plans are intentionally excluded.

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

create table public.certifications (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  provider text,
  status text default 'completed',
  target_date date,
  obtained_date date,
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
    'personal_info','education','experience','skills','projects','case_studies',
    'testimonials','blog_posts','contact_messages','kpi_stats','portfolio_content','certifications'
  ]
  loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t);
  end loop;
end;
$$;

insert into public.personal_info (full_name,title,email,phone,location,open_to_relocation,summary,about_text,expertise,social_links,kpi_stats,github_url,linkedin_url,website_url)
values (
  'Msah Ambooka',
  'Software Engineer | Full-Stack Developer | IT Systems | AI/ML Engineering',
  'abdulrahmanambooka@gmail.com',
  '+254 111 384 390',
  'Nairobi, Kenya',
  true,
  'Computer Science graduate with 3+ years of hands-on experience across software engineering, IT infrastructure and production systems. Experienced in full-stack applications, REST APIs, payment integrations, business automation, ERP implementation, Windows Server administration, networking and IT support for real organizations.',
  'I build practical software and systems: full-stack web applications, backend APIs, payment integrations, business automation tools, ERP workflows, IT infrastructure and applied AI/ML systems. My current direction is AI/ML engineering with strong software engineering foundations, production deployment habits and real-world business context.',
  '["Software Engineering", "Full-Stack Development", "Backend APIs", "IT Systems", "ERP Implementation", "AI/ML Engineering", "Business Automation", "Infrastructure Support"]'::jsonb,
  '[{"platform": "GitHub", "url": "https://github.com/ambooka", "icon_url": null, "is_active": true}, {"platform": "LinkedIn", "url": "https://linkedin.com/in/abdulrahman-ambooka", "icon_url": null, "is_active": true}, {"platform": "Website", "url": "https://ambooka.dev", "icon_url": null, "is_active": true}]'::jsonb,
  '{"experienceYears": "3+", "projectsDelivered": "12+", "staffSupported": "70+", "fieldWorkersSupported": "300+", "monthlyPaymentsProcessed": "KES 1M+"}'::jsonb,
  'https://github.com/ambooka',
  'https://linkedin.com/in/abdulrahman-ambooka',
  'https://ambooka.dev'
);

insert into public.education (institution,degree,field_of_study,location,start_date,end_date,is_current,description,grade,coursework,display_order) values
('Maseno University','Bachelor of Science','Computer Science','Kisumu, Kenya','2019-09-01','2024-12-01',false,'Computer Science degree with foundations in algorithms, software engineering, artificial intelligence, machine learning, networks, databases, operating systems and computer vision.','Second Class Honours Upper Division · GPA approximately 3.3 / 4.0',array['Algorithms & Data Structures','Machine Learning','Computer Networks','Database Systems','Software Engineering','Artificial Intelligence','Computer Vision','Operating Systems'],1),
('Starehe Boys'' Centre & School','Kenya Certificate of Secondary Education','Sciences Track','Nairobi, Kenya','2015-01-01','2018-12-01',false,'Sciences track. Admission by national competitive examination.',null,array['Mathematics','Physics','Chemistry','Biology'],2);

insert into public.experience (company,position,location,employment_type,start_date,end_date,is_current,description,responsibilities,achievements,technologies,display_order) values
('Hebatullah Brothers Limited','IT Assistant','Nairobi, Kenya','Full-time','2025-01-01',null,true,'Part of a two-person IT team responsible for the full technology stack of a trading company: hardware infrastructure, enterprise software, networking and digital systems serving 70+ office staff and 300+ field workers.',array['Support the company technology stack across enterprise software, networking, hardware, Windows Server and end-user support.','Administer Windows Server environment including Active Directory, group policies and user account lifecycle management.','Maintain CCTV systems across company premises and biometric attendance hardware for 300+ enrolled workers.','Provide end-to-end helpdesk support for hardware, software, connectivity, accounts and operational systems.'],array['Implemented ERPNext from scratch, including chart of accounts, item catalogue and procurement workflows, replacing manual inventory, finance and HR processes.','Reworked the company website from static HTML into a CMS-driven system so the marketing team can update content without developer involvement.','Installed and commissioned company network infrastructure from the ground up: switches, wireless access points, cabling and VoIP desk phone system.','Supported IT operations for 70+ office staff and 300+ field workers.'],array['ERPNext','Windows Server','Active Directory','TCP/IP','VoIP','CCTV','Biometric Systems','Networking'],1),
('Self-Employed','Freelance Full-Stack Developer','Nairobi, Kenya / Remote','Freelance','2022-01-01',null,true,'Independent contractor delivering full-stack web applications, APIs and business automation tools for clients across Kenya and internationally. 12+ projects delivered with 100% on-time completion.',array['Design and build full-stack applications using Python, TypeScript, React, Next.js, Node.js, FastAPI and PostgreSQL.','Integrate payment APIs, messaging APIs, dashboards, reporting systems and business automation workflows.','Containerize and deploy applications to VPS environments behind Nginx with SSL and CI/CD pipelines.','Work directly with clients to convert operational pain points into working systems.'],array['Built and integrated a production-grade Safaricom Daraja API implementation with M-Pesa STK Push, B2C disbursements and C2B paybill callbacks for an e-commerce client processing KES 1M+/month.','Implemented BullMQ async job queue, exponential backoff retry logic and PostgreSQL transaction audit log for payment reliability.','Replaced a Nairobi SME client''s manual Excel-based invoicing process with a React + FastAPI dashboard featuring automated PDF generation, WhatsApp notifications through Africa''s Talking API and live analytics, reducing manual processing effort by 80%.','Built ambooka.dev as a full-stack Next.js portfolio platform with Supabase backend, admin CMS, AI-assisted resume variants, GitHub activity sync and Playwright e2e tests.','Consistently deployed applications to Hetzner VPS using Docker, Nginx, Let''s Encrypt SSL and GitHub Actions CI/CD.'],array['Python','TypeScript','React','Next.js','Node.js','FastAPI','PostgreSQL','Redis','Docker','Nginx','M-Pesa Daraja API','Africa''s Talking API','BullMQ','Supabase'],2),
('Masinde Muliro University of Science & Technology','IT Infrastructure Intern','Kakamega, Kenya','Internship','2023-05-01','2023-08-31',false,'Supported campus-wide IT infrastructure, network administration, lab deployment, server room operations and faculty/student technical support.',array['Configured and deployed lab workstations.','Supported network administration and troubleshooting.','Provided technical support to faculty and students.','Assisted with server room and infrastructure operations.'],array['Configured and deployed 40+ workstations in a new computer lab ahead of semester start.','Diagnosed and resolved a recurring DHCP conflict disrupting connectivity for 200+ campus devices.','Supported campus-wide network administration, server room operations and user support.'],array['Network Administration','Linux','Windows Server','TCP/IP','Hardware Configuration'],3);

insert into public.skills (name,category,proficiency,proficiency_level,is_featured,display_order) values
('Python','Languages',92,92,true,1),
('TypeScript','Languages',88,88,true,2),
('JavaScript','Languages',86,86,true,3),
('SQL','Languages',88,88,true,4),
('Bash','Languages',82,82,true,5),
('Go','Languages',72,72,false,6),
('Java','Languages',68,68,false,7),
('C#','Languages',66,66,false,8),
('Kotlin','Languages',60,60,false,9),
('React','Frontend',88,88,true,10),
('Next.js','Frontend',86,86,true,11),
('HTML5','Frontend',90,90,true,12),
('CSS3','Frontend',86,86,true,13),
('Tailwind CSS','Frontend',86,86,true,14),
('Zustand','Frontend',72,72,false,15),
('Node.js','Backend',84,84,true,16),
('Express','Backend',82,82,true,17),
('FastAPI','Backend',84,84,true,18),
('Flask','Backend',78,78,false,19),
('REST APIs','Backend',90,90,true,20),
('OpenAPI / Swagger','Backend',76,76,false,21),
('PostgreSQL','Databases',86,86,true,22),
('Redis','Databases',76,76,true,23),
('Supabase','Databases',82,82,true,24),
('SQLite','Databases',75,75,false,25),
('Docker','DevOps & Infrastructure',84,84,true,26),
('Docker Compose','DevOps & Infrastructure',84,84,true,27),
('Nginx','DevOps & Infrastructure',80,80,true,28),
('Linux Ubuntu','DevOps & Infrastructure',82,82,true,29),
('GitHub Actions','DevOps & Infrastructure',78,78,true,30),
('Hetzner VPS','DevOps & Infrastructure',76,76,false,31),
('Windows Server','IT Systems',82,82,true,32),
('Active Directory','IT Systems',78,78,true,33),
('ERPNext','IT Systems',84,84,true,34),
('VoIP','IT Systems',75,75,false,35),
('CCTV Systems','IT Systems',78,78,false,36),
('Biometric Systems','IT Systems',76,76,false,37),
('TCP/IP Networking','IT Systems',82,82,true,38),
('PyTorch','AI / ML',72,72,true,39),
('OpenCV','AI / ML',80,80,true,40),
('YOLO','AI / ML',78,78,true,41),
('scikit-learn','AI / ML',72,72,true,42),
('Hugging Face','AI / ML',62,62,false,43),
('Jupyter','AI / ML',78,78,false,44),
('Kubernetes','Strengthening',48,48,false,45),
('Terraform','Strengthening',42,42,false,46),
('MLflow','Strengthening',42,42,false,47),
('LangChain','Strengthening',45,45,false,48),
('pgvector','Strengthening',42,42,false,49),
('AWS','Strengthening',50,50,false,50);

insert into public.projects (slug,title,description,one_line,long_description,category,stack,core_skills,status,completion_percent,problem,solution,business_value,recruiter_summary,proof,engineering_evidence,metrics,github_url,live_url,is_featured,is_anchor,display_order) values
('ambooka-dev-portfolio-platform','ambooka.dev Portfolio Platform','Full-stack Next.js portfolio platform with Supabase content, admin CMS, resume variants, GitHub sync and Playwright e2e tests.','Full-stack Next.js portfolio platform with Supabase content, admin CMS, resume variants, GitHub sync and Playwright e2e tests.','Built a full-stack Next.js portfolio platform with Supabase backend, admin CMS, GitHub sync, resume variants and Playwright e2e tests.','frontend',array['Next.js 16','TypeScript','React','Supabase','PostgreSQL','Playwright','Tailwind CSS'],array['Full-stack engineering','Content systems','Testing','Portfolio architecture','Supabase'],'completed',100,'A static portfolio could not present real project evidence, resume variants, case studies and evolving technical positioning.','Built a database-backed Next.js portfolio platform with admin-managed content, structured project data, resume views, GitHub sync and tests.','Turns professional evidence into a structured proof system instead of a flat resume page.','Built a full-stack Next.js portfolio platform with Supabase backend, admin CMS, GitHub sync, resume variants and Playwright e2e tests.','{"caseStudy": "/case-studies/ambooka-dev-portfolio-platform", "github": "https://github.com/ambooka/ambooka", "liveDemo": "https://ambooka.dev"}'::jsonb,'{"tests": true, "ci": true, "docker": false, "databaseMigrations": true, "monitoring": false, "docs": true, "deployed": true}'::jsonb,'{"status": "Live portfolio platform"}'::jsonb,'https://github.com/ambooka/ambooka','https://ambooka.dev',true,true,1),
('hebatullah-erpnext-implementation','Hebatullah ERPNext Implementation','ERPNext implementation for accounting, items and procurement workflows replacing manual inventory, finance and HR processes.','ERPNext implementation for accounting, items and procurement workflows replacing manual inventory, finance and HR processes.','Implemented ERPNext from scratch for a trading company, replacing manual processes across inventory, finance, procurement and HR workflows.','enterprise',array['ERPNext','Accounting Setup','Inventory','Procurement Workflows','Business Process Design'],array['ERP implementation','Business systems','Requirements analysis','Process automation'],'completed',100,'Manual inventory, finance and procurement workflows created slow operations, weak visibility and inconsistent records.','Implemented ERPNext from scratch, including chart of accounts, item catalogue and procurement workflows.','Created a structured foundation for business operations across inventory, finance, procurement and HR workflows.','Implemented ERPNext from scratch for a trading company, replacing manual processes across inventory, finance, procurement and HR workflows.','{"caseStudy": "/case-studies/hebatullah-erpnext-implementation"}'::jsonb,'{"tests": false, "ci": false, "docker": false, "databaseMigrations": false, "monitoring": false, "docs": true, "deployed": true}'::jsonb,'{"staffSupported": "70+ office staff", "fieldWorkersSupported": "300+"}'::jsonb,null,null,true,true,2),
('mpesa-payment-integration-library','M-Pesa Payment Integration Library','Production TypeScript integration for Safaricom Daraja API with STK Push, B2C, C2B callbacks, queues, retries and audit logs.','Production TypeScript integration for Safaricom Daraja API with STK Push, B2C, C2B callbacks, queues, retries and audit logs.','Built a production M-Pesa Daraja integration with typed APIs, async jobs, retries, webhook validation and transaction audit logs.','backend',array['Node.js','TypeScript','PostgreSQL','BullMQ','Redis','Safaricom Daraja API'],array['Payment integrations','Backend APIs','Async jobs','Reliability','Audit logging'],'completed',100,'Payment integrations need reliability, traceability and safe retry behavior because failures affect real money.','Built a typed Daraja API integration layer with STK Push, B2C, C2B callbacks, BullMQ jobs, retries, webhook validation and PostgreSQL transaction audit logs.','Supported a live e-commerce environment processing KES 1M+/month.','Built a production M-Pesa Daraja integration with typed APIs, async jobs, retries, webhook validation and transaction audit logs.','{"caseStudy": "/case-studies/mpesa-payment-integration-library"}'::jsonb,'{"tests": true, "ci": true, "docker": true, "databaseMigrations": true, "monitoring": false, "docs": true, "deployed": true}'::jsonb,'{"monthlyVolume": "KES 1M+", "flows": "STK Push, B2C, C2B"}'::jsonb,null,null,true,true,3),
('sme-invoicing-reporting-dashboard','SME Invoicing & Reporting Dashboard','React + FastAPI dashboard replacing Excel invoicing with PDF generation, WhatsApp notifications and live analytics.','React + FastAPI dashboard replacing Excel invoicing with PDF generation, WhatsApp notifications and live analytics.','Replaced manual Excel invoicing with a custom React + FastAPI dashboard, automated PDFs, WhatsApp notifications and analytics.','backend',array['React','FastAPI','PostgreSQL','PDF Generation','Africa’s Talking API'],array['Full-stack development','Business automation','Reporting','API integration'],'completed',100,'Manual Excel-based invoicing consumed time, increased errors and limited visibility.','Built a React + FastAPI dashboard with automated PDF generation, WhatsApp notifications through Africa’s Talking API and live analytics.','Reduced manual processing effort by approximately 80%.','Replaced manual Excel invoicing with a custom React + FastAPI dashboard, automated PDFs, WhatsApp notifications and analytics.','{"caseStudy": "/case-studies/sme-invoicing-reporting-dashboard"}'::jsonb,'{"tests": true, "ci": true, "docker": true, "databaseMigrations": true, "monitoring": false, "docs": true, "deployed": true}'::jsonb,'{"manualEffortReduction": "80%"}'::jsonb,null,null,true,true,4),
('ai-powered-surveillance-system','AI-Powered Surveillance System','Final-year research project implementing real-time object detection and threat recognition using YOLO, OpenCV and Flask.','Final-year research project implementing real-time object detection and threat recognition using YOLO, OpenCV and Flask.','Built an end-to-end AI surveillance system with YOLO, OpenCV, Flask inference API and automated alert generation.','ml',array['Python','PyTorch','YOLOv5/v8','OpenCV','Flask','NumPy','Linux'],array['Computer vision','Model inference','API development','Research','Real-time systems'],'completed',100,'Urban surveillance workflows often rely on manual monitoring and delayed threat recognition.','Built a YOLO-based real-time object detection system with Flask API, OpenCV stream processing and automated alerting.','Demonstrated functional automated threat recognition with real-time inference and alert pipeline.','Built an end-to-end AI surveillance system with YOLO, OpenCV, Flask inference API and automated alert generation.','{"caseStudy": "/case-studies/ai-powered-surveillance-system"}'::jsonb,'{"tests": false, "ci": false, "docker": false, "databaseMigrations": false, "monitoring": true, "docs": true, "deployed": false}'::jsonb,'{"domain": "Computer Vision", "projectType": "Final-year research"}'::jsonb,null,null,true,true,5),
('hebatullah-cms-website-rebuild','Hebatullah CMS Website Rebuild','Company website rebuild from static HTML into a CMS-backed system for non-developer content updates.','Company website rebuild from static HTML into a CMS-backed system for non-developer content updates.','Reworked hebatullah.com from static HTML into a CMS-backed site for non-developer content management.','frontend',array['CMS','Web Development','Content Management','Hosting'],array['CMS implementation','Business enablement','Web development'],'completed',100,'The company website was static, making every marketing update dependent on developer involvement.','Rebuilt the website around a CMS workflow so the marketing team could manage content independently.','Reduced update friction and improved ownership for business content.','Reworked hebatullah.com from static HTML into a CMS-backed site for non-developer content management.','{"caseStudy": "/case-studies/hebatullah-cms-website-rebuild", "liveDemo": "https://hebatullah.com"}'::jsonb,'{"tests": false, "ci": false, "docker": false, "databaseMigrations": false, "monitoring": false, "docs": true, "deployed": true}'::jsonb,'{"site": "hebatullah.com"}'::jsonb,null,'https://hebatullah.com',true,false,6),
('company-it-infrastructure-rollout','Company IT Infrastructure Rollout','Ground-up company network and VoIP infrastructure rollout: switches, wireless access points, cabling and desk phones.','Ground-up company network and VoIP infrastructure rollout: switches, wireless access points, cabling and desk phones.','Installed and commissioned switches, wireless access points, cabling and VoIP phone system for company operations.','devops',array['Switches','Wireless Access Points','Structured Cabling','VoIP','TCP/IP'],array['Networking','Infrastructure deployment','Troubleshooting','IT operations'],'completed',100,'The company needed reliable internal connectivity and phone communication infrastructure.','Installed and commissioned network infrastructure and VoIP desk phone system.','Created the infrastructure foundation for office connectivity and internal communication.','Installed and commissioned switches, wireless access points, cabling and VoIP phone system for company operations.','{"caseStudy": "/case-studies/company-it-infrastructure-rollout"}'::jsonb,'{"tests": false, "ci": false, "docker": false, "databaseMigrations": false, "monitoring": false, "docs": true, "deployed": true}'::jsonb,'{"environment": "Company infrastructure"}'::jsonb,null,null,true,false,7),
('mmust-lab-network-support','MMUST Lab & Network Support','Configured 40+ lab workstations and resolved a DHCP conflict affecting 200+ campus devices.','Configured 40+ lab workstations and resolved a DHCP conflict affecting 200+ campus devices.','Configured 40+ workstations and helped resolve a recurring DHCP conflict affecting 200+ campus devices.','enterprise',array['Network Administration','Linux','Windows Server','TCP/IP','Hardware Configuration'],array['IT infrastructure','Network troubleshooting','User support','Systems setup'],'completed',100,'A new computer lab needed reliable workstation setup, and a DHCP conflict was disrupting campus connectivity.','Configured lab machines, supported network administration and diagnosed the DHCP issue affecting campus devices.','Helped complete lab setup ahead of semester start and restored connectivity stability for affected users.','Configured 40+ workstations and helped resolve a recurring DHCP conflict affecting 200+ campus devices.','{"caseStudy": "/case-studies/mmust-lab-network-support"}'::jsonb,'{"tests": false, "ci": false, "docker": false, "databaseMigrations": false, "monitoring": false, "docs": true, "deployed": true}'::jsonb,'{"workstations": "40+", "devicesAffected": "200+"}'::jsonb,null,null,false,false,8);


insert into public.case_studies (slug,project_slug,title,subtitle,summary,problem,architecture,key_decisions,implementation,quality,results,future_improvements)
select
  p.slug,
  p.slug,
  p.title,
  coalesce(p.recruiter_summary, p.one_line, p.title),
  coalesce(p.recruiter_summary, p.description, p.one_line, p.title),
  coalesce(p.problem, 'This project solves a real software, infrastructure, business or AI/ML engineering problem.'),
  jsonb_build_array('Problem-first project framing so technical reviewers understand the context quickly.','Implementation details are summarized through stack, workflow, integrations, data handling and deployment context.','Sensitive client/company details are sanitized while preserving real business value and technical credibility.','Case study focuses on business value, engineering choices and measurable outcomes.'),
  jsonb_build_array('Use real resume evidence only: client work, company work, academic research and completed portfolio platform work.','Keep private learning plans out of the public portfolio.','Avoid overclaiming: status, proof and metrics must reflect actual evidence.','Prioritize readable business value and implementation decisions over decorative presentation.'),
  jsonb_build_array(coalesce(p.solution, 'Implemented a practical solution for the stated problem.'),'Documented stack, outcomes and proof signals.','Prepared the project for recruiter-facing presentation.'),
  jsonb_build_array('Public project records include stack, problem, solution, business value and recruiter summary.','Sensitive client/company details are intentionally summarized instead of exposed.','Case studies are structured for technical review and resume alignment.'),
  jsonb_build_array(coalesce(p.business_value, 'Project contributed practical value in a real operating context.'),'Strengthens the portfolio with evidence from real work rather than tutorial projects.'),
  jsonb_build_array('Add screenshots where safe to publish.','Add architecture diagrams for the most important projects.','Add demo videos for public projects.','Attach live links or sanitized technical walkthroughs where confidentiality allows.')
from public.projects p
where p.is_featured = true
order by p.display_order, p.created_at;


insert into public.blog_posts (slug,title,excerpt,content,category,tags,is_published,published_at) values
('building-a-production-portfolio-platform','Building a Production-Style Portfolio Platform','How I structured ambooka.dev as a full-stack portfolio with admin content, Supabase and e2e tests.','Draft: This article explains the architecture, content model, admin CMS, Supabase schema, Playwright tests and deployment structure behind ambooka.dev.','Software Engineering',array['Next.js','Supabase','Portfolio','Testing'],true,now()),
('lessons-from-erpnext-implementation','Lessons from Implementing ERPNext in a Real Company','What I learned designing accounts, items and procurement workflows for a trading company.','Draft: This article covers business process mapping, chart of accounts design, item catalogue structure, procurement workflows and adoption lessons from ERPNext implementation.','Business Systems',array['ERPNext','Business Systems','IT'],true,now()),
('building-reliable-mpesa-integrations','Building Reliable M-Pesa Daraja Integrations','Notes on STK Push, B2C, C2B callbacks, retries, queues and transaction audit logs.','Draft: This article explains the reliability problems in payment integrations and how typed responses, queues, retries, idempotency and audit logs improve production behavior.','Backend Engineering',array['M-Pesa','Node.js','TypeScript','Payments'],true,now()),
('computer-vision-final-year-project','Building an AI-Powered Surveillance System with YOLO and OpenCV','Technical lessons from my final-year computer vision research project.','Draft: This article discusses problem framing, YOLO model selection, OpenCV stream processing, Flask inference APIs and accuracy-latency tradeoffs.','AI / ML',array['YOLO','OpenCV','PyTorch','Computer Vision'],true,now());

insert into public.kpi_stats (section,label,value,display_order) values
('hero','Experience','3+ Years',1),
('hero','Projects Delivered','12+',2),
('hero','Staff Supported','70+',3),
('hero','Field Workers Supported','300+',4),
('hero','Payment Volume Supported','KES 1M+/month',5),
('hero','Core Stack','Python · TypeScript · PostgreSQL',6);

insert into public.portfolio_content (section,title,subtitle,content,metadata,display_order,is_active) values
('hero','Software Engineer building full-stack, infrastructure and applied AI/ML systems.','Python · TypeScript · React · Next.js · FastAPI · PostgreSQL · Docker · ERPNext · OpenCV · YOLO','Computer Science graduate with real-world experience across software engineering, IT infrastructure, business automation and applied AI/ML systems.','{"ctaPrimary":"View Projects","ctaSecondary":"Download Resume"}'::jsonb,1,true),
('positioning','Production-minded software engineer with infrastructure depth.','Full-stack applications, payment systems, ERP implementation, IT operations and AI/ML engineering direction.','This portfolio focuses on real completed work, client/company experience, academic AI research and production engineering habits.','{}'::jsonb,2,true),
('portfolio_policy','Public portfolio policy','No private learning plans are presented as achievements.','The site only presents real resume evidence, completed public projects, real client/company work, academic research, and honest in-progress skill development.','{}'::jsonb,3,true);

insert into public.certifications (name,provider,status,target_date,obtained_date,credential_url,display_order) values
('BSc Computer Science','Maseno University','completed',null,'2024-12-01',null,1),
('AWS Cloud Practitioner CLF-C02','AWS','in_progress','2025-12-31',null,null,2),
('HashiCorp Terraform Associate 003','HashiCorp','in_progress','2025-12-31',null,null,3),
('Certified Kubernetes Administrator','CNCF','planned','2026-12-31',null,null,4);

insert into public.testimonials (name,role,company,text,is_featured,display_order) values ('References','Available upon request',null,'Professional references are available upon request.',true,1);

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

do $$
declare
  t text;
begin
  foreach t in array array['personal_info','education','experience','skills','projects','case_studies','testimonials','blog_posts','kpi_stats','portfolio_content','certifications']
  loop
    execute format('create policy public_read_%I on public.%I for select using (true)', t, t);
    execute format('create policy authenticated_manage_%I on public.%I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end;
$$;

create policy public_insert_contact_messages on public.contact_messages for insert with check (true);
create policy authenticated_read_contact_messages on public.contact_messages for select to authenticated using (true);
create policy authenticated_manage_contact_messages on public.contact_messages for all to authenticated using (true) with check (true);
create policy public_insert_page_views on public.page_views for insert with check (true);
create policy authenticated_read_page_views on public.page_views for select to authenticated using (true);

grant select on all tables in schema public to anon;
grant insert on public.contact_messages to anon;
grant insert on public.page_views to anon;
grant all on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

commit;

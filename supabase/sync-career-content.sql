-- Align an existing portfolio database with the supplied résumé.
-- Preserves contact messages, page views, published articles, and admin users.

begin;

create table if not exists public.blog_topics (
  id uuid primary key default gen_random_uuid(),
  title text unique not null,
  context text not null,
  category text not null,
  keywords text[] default '{}',
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blog_topics enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'blog_topics_set_updated_at'
      and tgrelid = 'public.blog_topics'::regclass
  ) then
    create trigger blog_topics_set_updated_at
      before update on public.blog_topics
      for each row execute function public.set_updated_at();
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_topics'
      and policyname = 'public_read_blog_topics'
  ) then
    create policy public_read_blog_topics
      on public.blog_topics for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_topics'
      and policyname = 'authenticated_manage_blog_topics'
  ) then
    create policy authenticated_manage_blog_topics
      on public.blog_topics for all to authenticated using (true) with check (true);
  end if;
end;
$$;

grant select on public.blog_topics to anon;
grant all on public.blog_topics to authenticated, service_role;

update public.personal_info
set
  full_name = 'Abdulrahman Ambooka Msah',
  title = 'Software Engineer | Backend Systems & Infrastructure',
  email = 'abdulrahmanambooka@gmail.com',
  phone = '+254 111 384 390',
  location = 'Nairobi, Kenya',
  summary = 'Computer Science graduate with 3+ years of hands-on experience building and shipping full-stack web applications, REST APIs, and payment integrations for real clients, including a production M-Pesa implementation processing KES 1M+/month. Also experienced in ERP implementation, Windows Server, Active Directory, networking, end-user support, and applied computer vision.',
  about_text = 'I build full-stack and backend software, production payment integrations, and business systems, backed by hands-on experience in ERP implementation and IT infrastructure administration.',
  expertise = '["Software Engineering","Backend APIs & Payment Integrations","Full-Stack Web Development","ERP & Business Systems","IT Infrastructure & Networking","Applied Computer Vision"]'::jsonb,
  kpi_stats = '{"experienceYears":"3+","staffSupported":"70+","fieldWorkersSupported":"300+","monthlyPaymentsProcessed":"KES 1M+","workstationsConfigured":"40+"}'::jsonb;

update public.education
set start_date = '2020-01-01', end_date = '2024-12-01'
where institution = 'Maseno University';

update public.education
set start_date = '2016-01-01', end_date = '2019-12-01'
where institution = 'Starehe Boys'' Centre & School';

delete from public.experience
where company = 'Self-Employed' and position = 'Freelance Full-Stack Developer';

update public.experience
set
  description = 'IT Administrator supporting the academy''s infrastructure, systems, users, and digital operations.',
  achievements = array[]::text[],
  display_order = 1
where company = 'Bayina Academy' and position = 'IT Administrator';

update public.experience set display_order = 2
where company = 'Hebatullah Brothers Limited' and position = 'IT Assistant';

update public.experience set display_order = 3
where company = 'Masinde Muliro University of Science & Technology';

delete from public.skills;

insert into public.skills (name, category, is_featured, display_order)
values
  ('Python', 'Languages', true, 1),
  ('TypeScript', 'Languages', true, 2),
  ('JavaScript', 'Languages', true, 3),
  ('SQL', 'Languages', true, 4),
  ('Bash', 'Languages', true, 5),
  ('Java', 'Languages', false, 6),
  ('Kotlin', 'Languages', false, 7),
  ('C#', 'Languages', false, 8),
  ('React', 'Frontend', true, 9),
  ('Next.js', 'Frontend', true, 10),
  ('Tailwind CSS', 'Frontend', true, 11),
  ('HTML5', 'Frontend', false, 12),
  ('CSS3', 'Frontend', false, 13),
  ('Zustand', 'Frontend', false, 14),
  ('Node.js', 'Backend', true, 15),
  ('FastAPI', 'Backend', true, 16),
  ('Flask', 'Backend', false, 17),
  ('Express', 'Backend', true, 18),
  ('REST APIs', 'Backend', true, 19),
  ('OpenAPI', 'Backend', false, 20),
  ('PostgreSQL', 'Databases', true, 21),
  ('Supabase', 'Databases', true, 22),
  ('Redis', 'Databases', true, 23),
  ('SQLite', 'Databases', false, 24),
  ('Docker', 'DevOps & Infrastructure', true, 25),
  ('Docker Compose', 'DevOps & Infrastructure', true, 26),
  ('Nginx', 'DevOps & Infrastructure', true, 27),
  ('GitHub Actions', 'DevOps & Infrastructure', true, 28),
  ('Hetzner VPS', 'DevOps & Infrastructure', false, 29),
  ('Linux (Ubuntu)', 'DevOps & Infrastructure', true, 30),
  ('ERPNext', 'IT Systems', true, 31),
  ('Windows Server', 'IT Systems', true, 32),
  ('Active Directory', 'IT Systems', true, 33),
  ('TCP/IP', 'IT Systems', true, 34),
  ('VoIP', 'IT Systems', false, 35),
  ('CCTV', 'IT Systems', false, 36),
  ('Biometric Systems', 'IT Systems', false, 37),
  ('PyTorch', 'AI / ML', true, 38),
  ('OpenCV', 'AI / ML', true, 39),
  ('YOLOv5/v8', 'AI / ML', true, 40),
  ('scikit-learn', 'AI / ML', false, 41),
  ('Hugging Face', 'AI / ML', false, 42),
  ('Jupyter', 'AI / ML', false, 43);

delete from public.case_studies
where project_slug in (select slug from public.projects where status <> 'completed');

delete from public.projects where status <> 'completed';

update public.projects
set is_anchor = false,
    is_featured = slug in (
      'ambooka-dev-portfolio-platform',
      'hebatullah-erpnext-implementation',
      'mpesa-payment-integration-library',
      'computer-vision-surveillance-system'
    );

update public.projects
set
  one_line = 'Production TypeScript integration for Safaricom Daraja API with STK Push, B2C, C2B, retries, and webhook validation.',
  solution = 'Built a typed Daraja API integration with STK Push, B2C and C2B flows, retry logic, and webhook validation.',
  recruiter_summary = 'Built a production M-Pesa Daraja integration with typed response schemas, retry logic, and webhook validation, processing KES 1M+/month.',
  engineering_evidence = '{"tests":false,"ci":false,"docker":false,"databaseMigrations":false,"monitoring":false,"docs":false,"deployed":true}'::jsonb
where slug = 'mpesa-payment-integration-library';

update public.projects
set
  description = 'Full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, a canonical database-backed resume, GitHub activity sync and Playwright e2e test suite.',
  problem = 'A static resume could not represent evolving project evidence, portfolio content and GitHub activity.',
  solution = 'Built a database-backed portfolio platform with admin-managed content, a single canonical resume, GitHub sync and e2e tests.',
  recruiter_summary = 'Built ambooka.dev as a full-stack Next.js 16 portfolio platform with Supabase backend, admin CMS, GitHub activity sync and Playwright e2e testing.'
where slug = 'ambooka-dev-portfolio-platform';

delete from public.case_studies;

insert into public.case_studies (
  slug, project_slug, title, subtitle, summary, problem, architecture,
  key_decisions, implementation, quality, results, future_improvements
)
select
  p.slug,
  p.slug,
  p.title,
  coalesce(p.recruiter_summary, p.one_line, p.title),
  coalesce(p.recruiter_summary, p.description, p.one_line, p.title),
  coalesce(p.problem, 'This project addresses a real software, infrastructure, business, or computer-vision problem.'),
  jsonb_build_array(
    'Problem-first framing so reviewers understand the operating context before implementation.',
    'Implementation details are tied to the stack and workflows in the project record.',
    'Sensitive client and company details are sanitized while preserving technical credibility.',
    'Business value and measurable outcomes are highlighted where evidence exists.'
  ),
  jsonb_build_array(
    'Use only completed work supported by the résumé or public repository evidence.',
    'Keep project claims specific, factual, and proportionate to available proof.',
    'Separate confidential client or company information from public technical summaries.',
    'Prioritize implementation decisions and outcomes over decorative presentation.'
  ),
  jsonb_build_array(
    coalesce(p.solution, 'Implemented the solution described in the project record.'),
    'Documented the stack, business context, and relevant operational outcomes.',
    'Prepared a concise recruiter summary and safe public case-study presentation.'
  ),
  jsonb_build_array(
    'Public records include the problem, solution, stack, business value, and evidence status.',
    'Sensitive details remain intentionally summarized.',
    'No unsupported performance, certification, or capability claim is included.'
  ),
  jsonb_build_array(
    coalesce(p.business_value, 'The project delivered practical value in a real operating context.'),
    'Demonstrates completed work rather than tutorial or study-plan output.',
    'Supports software, backend, payments, business-systems, infrastructure, or computer-vision roles.'
  ),
  jsonb_build_array(
    'Add screenshots or architecture diagrams where safe to publish.',
    'Add demo videos for public-facing work.',
    'Attach additional verified performance or business-impact metrics when available.'
  )
from public.projects p
where p.is_featured = true and p.status = 'completed'
order by p.display_order, p.created_at;

delete from public.roadmap_phases;
delete from public.certifications;

insert into public.blog_topics (title, context, category, keywords, is_active, display_order)
values
  ('Reliable backend integrations', 'Lessons from building REST APIs, M-Pesa Daraja payment flows, callback handling, retries, validation and PostgreSQL-backed services.', 'Backend Engineering', array['REST APIs', 'Node.js', 'TypeScript', 'PostgreSQL', 'M-Pesa'], true, 1),
  ('ERP and business-process implementation', 'Day-to-day lessons from mapping manual workflows into ERPNext accounts, items, inventory and procurement processes.', 'Business Systems', array['ERPNext', 'Process Design', 'Procurement', 'Inventory'], true, 2),
  ('Practical IT operations', 'Identity administration, staff onboarding, troubleshooting, documentation and maintaining dependable workplace technology.', 'IT Infrastructure', array['Windows Server', 'Active Directory', 'Support', 'Documentation'], true, 3),
  ('Network and endpoint reliability', 'Practical observations from workstation deployment, DHCP troubleshooting, wireless networks, VoIP and preventative maintenance.', 'IT Infrastructure', array['Networking', 'DHCP', 'Workstations', 'VoIP', 'Troubleshooting'], true, 4),
  ('Building database-backed web products', 'Engineering lessons from Next.js, TypeScript, Supabase, admin-managed content, deployment and end-to-end testing.', 'Software Engineering', array['Next.js', 'TypeScript', 'Supabase', 'Playwright'], true, 5)
on conflict (title) do update
set context = excluded.context,
    category = excluded.category,
    keywords = excluded.keywords,
    is_active = excluded.is_active,
    display_order = excluded.display_order,
    updated_at = now();

update public.blog_posts
set is_published = false,
    published_at = null
where content ilike 'Draft:%';

update public.blog_posts
set slug = 'reliable-it-infrastructure-for-growing-teams',
    title = 'Reliable IT Infrastructure for Growing Teams',
    excerpt = 'Practical lessons from identity administration, networking, device rollout and end-user support.',
    content = 'Draft: This article covers Active Directory administration, network reliability, workstation deployment, support workflows and technical documentation for growing teams.',
    category = 'IT Infrastructure',
    tags = array['Windows Server', 'Active Directory', 'Networking', 'IT Operations'],
    updated_at = now()
where slug = 'computer-vision-final-year-project'
  and is_published = false;

delete from public.blog_posts
where is_published = false
  and category not in (
    'Software Engineering',
    'Backend Engineering',
    'Business Systems',
    'AI / ML',
    'Computer Vision',
    'IT Infrastructure'
  );

delete from public.kpi_stats where section = 'hero';

insert into public.kpi_stats (section, label, value, display_order)
values
  ('hero', 'Experience', '3+ Years', 1),
  ('hero', 'Payment Volume', 'KES 1M+/month', 2),
  ('hero', 'Staff Supported', '70+', 3),
  ('hero', 'Field Workers Supported', '300+', 4),
  ('hero', 'Workstations Configured', '40+', 5);

delete from public.portfolio_content;

insert into public.portfolio_content (
  section, title, subtitle, content, metadata, display_order, is_active
)
values
  (
    'hero',
    'Software Engineer | Backend Systems & Infrastructure',
    'Python · TypeScript · Node.js · FastAPI · PostgreSQL · Docker · ERPNext · Windows Server',
    'Computer Science graduate with 3+ years of hands-on experience delivering software, payment integrations, business systems, and IT infrastructure.',
    '{"ctaPrimary":"View Projects","ctaSecondary":"View Resume"}'::jsonb,
    1,
    true
  ),
  (
    'positioning',
    'Software delivery backed by real operational experience',
    'Backend services, systems integrations, ERP delivery, and IT infrastructure.',
    'Every public claim is supported by the supplied résumé or public project evidence.',
    '{}'::jsonb,
    2,
    true
  ),
  (
    'build_area',
    'Full-Stack Product Engineering',
    'Software delivery',
    'Next.js and React interfaces, TypeScript application logic, Supabase-backed content, admin workflows, and end-to-end testing.',
    '{"tags":["Next.js","TypeScript","Playwright"]}'::jsonb,
    10,
    true
  ),
  (
    'build_area',
    'Business Systems & ERP',
    'Professional experience',
    'ERPNext implementation, business-process design, procurement workflows, accounting setup, inventory operations, and CMS enablement.',
    '{"tags":["ERPNext","Process Design","CMS"]}'::jsonb,
    11,
    true
  ),
  (
    'build_area',
    'Backend APIs & Integrations',
    'Production delivery',
    'REST API development, PostgreSQL-backed services, M-Pesa Daraja payment flows, webhook validation, retries, and asynchronous processing.',
    '{"tags":["Node.js","REST APIs","PostgreSQL"]}'::jsonb,
    12,
    true
  ),
  (
    'build_area',
    'IT Infrastructure & Support',
    'Professional experience',
    'Windows Server, Active Directory, networking, VoIP, CCTV, biometric systems, workstation deployment, and end-user support.',
    '{"tags":["Windows Server","Networking","Active Directory"]}'::jsonb,
    13,
    true
  );

commit;

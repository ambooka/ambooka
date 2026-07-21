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

drop trigger if exists update_blog_topics_updated_at on public.blog_topics;
create trigger update_blog_topics_updated_at
  before update on public.blog_topics
  for each row execute function update_updated_at_column();

drop policy if exists public_read_blog_topics on public.blog_topics;
create policy public_read_blog_topics
  on public.blog_topics for select using (true);

drop policy if exists authenticated_manage_blog_topics on public.blog_topics;
create policy authenticated_manage_blog_topics
  on public.blog_topics for all to authenticated using (true) with check (true);

grant select on public.blog_topics to anon;
grant all on public.blog_topics to authenticated, service_role;

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

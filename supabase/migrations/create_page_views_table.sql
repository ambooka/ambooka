-- Create a table for tracking page views
create table if not exists public.page_views (
  id uuid default gen_random_uuid() primary key,
  path text not null,
  user_agent text,
  session_id text, -- Used to track unique visitors
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.page_views enable row level security;

-- Create policy to allow anyone to insert (public tracking)
create policy "Anyone can insert page views"
  on public.page_views for insert
  with check (true);

-- Create policy to allow admins to view all page views
create policy "Authenticated users can view page views"
  on public.page_views for select
  using (auth.role() = 'authenticated');

-- Optional: Create a view for easier analytics querying (if user wants to run this too)
create or replace view public.daily_analytics as
select
  date_trunc('day', created_at) as date,
  count(*) as page_views,
  count(distinct session_id) as unique_visitors
from public.page_views
group by 1
order by 1 desc;

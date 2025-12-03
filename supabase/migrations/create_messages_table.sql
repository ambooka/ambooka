-- Create a table for contact form messages
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Create policy to allow anyone to insert (for public contact form)
create policy "Anyone can insert messages"
  on public.contact_messages for insert
  with check (true);

-- Create policy to allow admins to view all messages
-- Assuming authenticated users are admins for now, or adjust based on specific admin role logic
create policy "Authenticated users can view messages"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

-- Create policy to allow admins to update messages (e.g. mark as read)
create policy "Authenticated users can update messages"
  on public.contact_messages for update
  using (auth.role() = 'authenticated');

-- Create policy to allow admins to delete messages
create policy "Authenticated users can delete messages"
  on public.contact_messages for delete
  using (auth.role() = 'authenticated');

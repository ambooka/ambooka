-- Optional Supabase pg_cron alternative to vercel.json.
-- The app already includes Vercel cron entries for Mon/Wed/Fri draft generation.
-- Use this only if you prefer Supabase pg_cron to call the Next.js API route.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Replace YOUR_BLOG_AUTOMATION_SECRET with the same value configured in
-- BLOG_AUTOMATION_SECRET or CRON_SECRET in the Next.js deployment.

select cron.schedule(
  'ai-blog-draft-monday',
  '0 7 * * 1',
  $$
  select net.http_get(
    url := 'https://ambooka.dev/api/blog/generate',
    headers := '{"Authorization": "Bearer YOUR_BLOG_AUTOMATION_SECRET"}'::jsonb
  ) as request_id;
  $$
);

select cron.schedule(
  'ai-blog-draft-wednesday',
  '0 7 * * 3',
  $$
  select net.http_get(
    url := 'https://ambooka.dev/api/blog/generate',
    headers := '{"Authorization": "Bearer YOUR_BLOG_AUTOMATION_SECRET"}'::jsonb
  ) as request_id;
  $$
);

select cron.schedule(
  'ai-blog-draft-friday',
  '0 7 * * 5',
  $$
  select net.http_get(
    url := 'https://ambooka.dev/api/blog/generate',
    headers := '{"Authorization": "Bearer YOUR_BLOG_AUTOMATION_SECRET"}'::jsonb
  ) as request_id;
  $$
);

-- To stop:
-- select cron.unschedule('ai-blog-draft-monday');
-- select cron.unschedule('ai-blog-draft-wednesday');
-- select cron.unschedule('ai-blog-draft-friday');

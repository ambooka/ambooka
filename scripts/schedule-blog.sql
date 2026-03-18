
-- SQL to schedule the AI Blog Generation weekly using pg_cron
-- Run this in the Supabase Dashboard SQL Editor

-- 1. Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule the weekly blog generation (Every Monday at 9:00 AM)
-- Note: Replace '<YOUR_PROJECT_REF>' with your actual Supabase Project ID
-- Note: Replace '<YOUR_SERVICE_ROLE_KEY>' if needed, or rely on internal networking
SELECT
  cron.schedule(
    'weekly-ai-blog-generation', -- name of the cron job
    '0 9 * * 1',                -- every Monday at 9:00 AM
    $$
    SELECT
      net.http_post(
        url:='https://nphhcdmrbxqtskwfptfw.supabase.co/functions/v1/generate-blog-post',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
        body:='{}'::jsonb
      ) as request_id;
    $$
  );

-- To stop the schedule later:
-- SELECT cron.unschedule('weekly-ai-blog-generation');

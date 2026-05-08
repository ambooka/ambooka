
# AI Blog Automation Guide

This project includes a mechanism to automatically generate research-oriented technical blog drafts using Google Gemini 1.5 Flash.

## Overview

1.  **Generation**: The Next.js route (`/api/blog/generate`) invokes the Supabase Edge Function (`generate-blog-post`) by default. Set `BLOG_GENERATION_PROVIDER=next` only if you want the Next.js route to call Gemini directly.
2.  **Storage**: Posts are saved directly to your `blog_posts` table in Supabase as drafts by default.
3.  **Scheduling**: `pg_cron` or Vercel cron can trigger the Next.js route on a cadence.

## Setup Instructions

### 1. Add Gemini API Key
You must add your Gemini API key to your Supabase project secrets so the function can access it.
Run this command in your local terminal (ensure you have Supabase CLI installed and logged in):
```bash
supabase secrets set GEMINI_API_KEY=your_actual_key_here
```

For local Next.js generation, set the same key in `.env.local`:
```bash
GEMINI_API_KEY=your_actual_key_here
GEMINI_BLOG_MODEL=gemini-1.5-flash
BLOG_GENERATION_PROVIDER=next
```

### 2. Seed Initial Posts (5 Posts)
To get your blog started immediately, I have generated 5 high-quality articles tailored to your MLOps and AI expertise.
1.  Go to your **Supabase Dashboard**.
2.  Open the **SQL Editor**.
3.  Copy and paste the contents of `scripts/seed-blog-posts.sql`.
4.  Run the query.

### 3. Deploy the Edge Function
If you have the Supabase CLI, deploy the function:
```bash
supabase functions deploy generate-blog-post
```

### 4. Schedule Weekly Automation
To automate the process, you need to schedule it:
1.  Go to your **Supabase Dashboard**.
2.  Open the **SQL Editor**.
3.  Copy and paste the contents of `scripts/schedule-blog.sql`.
4.  **Important**: Ensure both `pg_cron` and `pg_net` extensions are enabled in your project (Settings > Database > Extensions).
5.  **Important**: Replace `YOUR_SERVICE_ROLE_KEY` in the script with your actual Service Role Key (found in Project Settings > API).
6.  Run the query.

## Customization

-   **Prompt Tuning**: You can adjust the shared app prompt in `src/lib/blog-automation.ts` and the Edge Function prompt in `supabase/functions/generate-blog-post/index.ts`.
-   **Schedule**: Change the cron expression in `scripts/schedule-blog.sql` (e.g., `0 9 * * 5` for Friday mornings).

## Files Created
- `supabase/functions/generate-blog-post/index.ts`: The core AI logic.
- `scripts/seed-blog-posts.sql`: Initial 5 posts seed.
- `scripts/schedule-blog.sql`: Automation schedule script.
- `scripts/seed-ai-blog.ts`: Local TS version of the seed script (requires environment setup).

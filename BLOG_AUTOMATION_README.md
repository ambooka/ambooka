
# AI Blog Automation Guide

This project now includes a mechanism to automatically generate and publish one high-quality, research-oriented technical blog post per week using Google Gemini 1.5 Flash.

## Overview

1.  **Generation**: A Supabase Edge Function (`generate-blog-post`) handles the AI logic.
2.  **Storage**: Posts are saved directly to your `blog_posts` table in Supabase.
3.  **Scheduling**: A `pg_cron` job triggers the function every Monday morning.

## Setup Instructions

### 1. Add Gemini API Key
You must add your Gemini API key to your Supabase project secrets so the function can access it.
Run this command in your local terminal (ensure you have Supabase CLI installed and logged in):
```bash
supabase secrets set GEMINI_API_KEY=your_actual_key_here
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

-   **Prompt Tuning**: You can adjust the writing style or default topics in `supabase/functions/generate-blog-post/index.ts`.
-   **Schedule**: Change the cron expression in `scripts/schedule-blog.sql` (e.g., `0 9 * * 5` for Friday mornings).

## Files Created
- `supabase/functions/generate-blog-post/index.ts`: The core AI logic.
- `scripts/seed-blog-posts.sql`: Initial 5 posts seed.
- `scripts/schedule-blog.sql`: Automation schedule script.
- `scripts/seed-ai-blog.ts`: Local TS version of the seed script (requires environment setup).

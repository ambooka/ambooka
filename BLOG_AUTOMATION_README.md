# Career Blog Automation

The portfolio generates review-first technical drafts from active career
activity topics stored in `blog_topics`. The scheduled route rotates through
those topics, asks Gemini for a factual Markdown article, and saves the result
to `blog_posts` as an unpublished draft.

## How it works

1. Manage topic titles, context and active status in **Admin → Blog**.
2. Vercel cron calls `/api/blog/generate` at 07:00 UTC every Monday, Wednesday
   and Friday.
3. The route selects an active topic based on the current UTC day.
4. The Supabase `generate-blog-post` Edge Function generates the article.
5. The draft stays unpublished until it is reviewed in the admin area.

The prompt explicitly prevents invented employer details, incidents, metrics
and outcomes. When a topic does not contain a documented result, the article
must be framed as practical guidance rather than a personal case study.

## Required deployment configuration

Set these values in the relevant deployment environments:

```bash
# Supabase Edge Function secret
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set GEMINI_BLOG_MODEL=gemini-2.5-flash

# Vercel / Next.js environment
CRON_SECRET=your_random_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

`BLOG_AUTOMATION_SECRET` can be used instead of `CRON_SECRET`. Set
`BLOG_GENERATION_PROVIDER=next` and add `GEMINI_API_KEY` to the Next.js
environment only when intentionally bypassing the Edge Function.

Deploy the function after changing its prompt or model:

```bash
supabase functions deploy generate-blog-post
```

## Database setup

- Fresh environments: run `supabase/reset-and-seed.sql`.
- Existing environments: apply `supabase/migrations/004_blog_topics.sql` or
  the scoped `supabase/sync-career-content.sql` sync.

Do not configure both Vercel cron and `scripts/schedule-blog.sql` unless two
independent schedules are intentional; otherwise duplicate drafts can be
created.

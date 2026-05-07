alter table public.blog_posts
  add column if not exists seo_title text,
  add column if not exists meta_description text,
  add column if not exists source_urls jsonb default '[]'::jsonb,
  add column if not exists ai_generated boolean default false,
  add column if not exists generation_topic text,
  add column if not exists reading_time_minutes int default 5;

create index if not exists idx_blog_posts_published_at
  on public.blog_posts (published_at desc)
  where is_published = true;

create index if not exists idx_blog_posts_ai_generated
  on public.blog_posts (ai_generated, created_at desc);

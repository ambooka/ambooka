"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string | null;
}

const PLANNED_ARTICLES = [
  {
    title: "Building Reliable M-Pesa Daraja Integrations",
    topic: "Backend integration",
    excerpt: "STK Push, callbacks, retry logic, and webhook validation.",
  },
  {
    title: "Lessons from Implementing ERPNext",
    topic: "Business systems",
    excerpt: "Accounts, item catalogues, procurement workflows, and adoption.",
  },
  {
    title: "Reliable IT Infrastructure for Growing Teams",
    topic: "Infrastructure operations",
    excerpt: "Identity, networking, device rollout, and support workflows.",
  },
  {
    title: "Building a Database-Backed Portfolio",
    topic: "Software engineering",
    excerpt: "Next.js, Supabase, admin content, and end-to-end testing.",
  },
];

export default function LatestBlogWidget() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, slug, published_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        if (data) setPosts(data);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="h-full rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] p-4 shadow-sm backdrop-blur-xl sm:p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))]">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Latest Writing
            </p>
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
              Loading recent posts
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(190px,0.8fr)]">
          <div className="flex min-h-[210px] animate-pulse flex-col justify-end rounded-[24px] border border-[hsl(var(--border))] bg-slate-100 p-5 dark:bg-slate-900/50">
            <div className="mb-4 h-6 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mb-3 h-8 w-4/5 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-11/12 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="grid gap-3">
            <div className="h-28 animate-pulse rounded-[22px] border border-[hsl(var(--border))] bg-slate-100 dark:bg-slate-900/50" />
            <div className="h-28 animate-pulse rounded-[22px] border border-[hsl(var(--border))] bg-slate-100 dark:bg-slate-900/50" />
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="flex h-full min-w-0 flex-col rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] p-4 shadow-sm backdrop-blur-xl sm:p-5">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))]">
              <BookOpen size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                Latest Writing
              </p>
              <h3 className="truncate text-base font-black tracking-tight text-[hsl(var(--foreground))] sm:text-lg">
                Articles in Preparation
              </h3>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-[hsl(var(--border))] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
            Coming soon
          </span>
        </header>

        <div className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(190px,0.8fr)]">
          <article className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[22px] border border-dashed border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--accent))/0.12] to-[hsl(var(--card))/0.4] p-4 sm:p-5">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[hsl(var(--accent))]/10" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))] shadow-sm backdrop-blur-sm">
                <Clock3 size={12} className="text-[hsl(var(--accent))]" />
                {PLANNED_ARTICLES[0].topic}
              </div>
              <h4 className="mb-3 text-xl font-black leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-2xl">
                {PLANNED_ARTICLES[0].title}
              </h4>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {PLANNED_ARTICLES[0].excerpt}
              </p>
              <span className="mt-auto pt-5 text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                Featured draft · Coming soon
              </span>
            </div>
          </article>

          <div className="grid auto-rows-fr gap-3">
            {PLANNED_ARTICLES.slice(1).map((article) => (
            <article
              key={article.title}
              className="flex min-h-24 flex-col justify-between rounded-[18px] border border-dashed border-[hsl(var(--border))] bg-white/40 p-3 dark:bg-white/5"
            >
              <div>
                <span className="mb-2 inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
                  <Clock3 size={10} className="text-[hsl(var(--accent))]" />
                  {article.topic}
                </span>
                <h4 className="text-[0.8rem] font-extrabold leading-snug text-[hsl(var(--foreground))]">
                  {article.title}
                </h4>
              </div>
              <span className="pt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
                Draft planned
              </span>
            </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const [featuredPost, ...secondaryPosts] = posts;

  return (
    <section className="h-full rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] p-4 shadow-sm backdrop-blur-xl sm:p-5 md:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:shadow-none">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Latest Writing
            </p>
            <h3 className="text-base font-black tracking-tight text-[hsl(var(--foreground))] sm:text-lg">
              Notes From the Build
            </h3>
          </div>
        </div>

        <Link
          href="/blog"
          className="inline-flex min-h-10 items-center gap-2 rounded-full px-1 text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--accent))] transition-all hover:translate-x-1"
        >
          Browse Blog
          <ArrowRight size={14} />
        </Link>
      </header>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(190px,0.8fr)]">
        <Link
          href={`/blog/${featuredPost.slug}`}
          className={cn(
            "group relative overflow-hidden rounded-[22px] border border-[hsl(var(--border))]",
            "bg-gradient-to-br from-[hsl(var(--accent))/0.12] to-[hsl(var(--card))/0.4] hover:border-[hsl(var(--accent))/0.3]",
            "p-4 transition-all duration-300 sm:p-5",
          )}
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[hsl(var(--accent))]/10 transition-transform duration-500 group-hover:scale-110" />

          <div className="relative z-10 flex h-full min-h-[210px] flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))] shadow-sm backdrop-blur-sm">
                <Calendar size={12} className="text-[hsl(var(--accent))]" />
                {formatDate(featuredPost.published_at)}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                <ArrowRight size={15} />
              </div>
            </div>

            <h4 className="mb-3 text-xl font-black leading-tight tracking-tight text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))] sm:text-2xl">
              {featuredPost.title}
            </h4>
            <p className="max-w-2xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-[0.9rem]">
              {featuredPost.excerpt ||
                "Open the article to read the full breakdown and implementation notes."}
            </p>
            <div className="mt-auto flex items-center gap-2 pt-5 text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
              Read article
            </div>
          </div>
        </Link>

        {secondaryPosts.length > 0 && (
          <div className="grid auto-rows-fr gap-3">
            {secondaryPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={cn(
                  "group flex flex-col justify-between rounded-[22px] border border-[hsl(var(--border))] bg-white/40 p-4 dark:bg-white/5",
                  "transition-all duration-300 hover:-translate-y-0.5 hover:border-[hsl(var(--accent))/0.25] hover:bg-white/60 dark:hover:bg-white/10",
                )}
              >
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))]/50 bg-white/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] dark:bg-black/20">
                    <Calendar size={11} className="text-[hsl(var(--accent))]" />
                    {formatDate(post.published_at)}
                  </div>
                  <h5 className="text-[0.95rem] font-black leading-tight tracking-tight text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                    {post.title}
                  </h5>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
                  Read more
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

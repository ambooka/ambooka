'use client'

<<<<<<< HEAD
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
=======
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import Link from 'next/link'
import { BookOpen, Calendar, ArrowRight } from 'lucide-react'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

interface BlogPost {
    id: string
    title: string
    excerpt: string | null
    slug: string
    published_at: string | null
}

export default function LatestBlogWidget() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
<<<<<<< HEAD
        ;(async () => {
=======
        (async () => {
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('id, title, excerpt, slug, published_at')
                    .eq('is_published', true)
                    .order('published_at', { ascending: false })
                    .limit(3)

                if (error) throw error
                if (data) setPosts(data)
<<<<<<< HEAD
            } catch (error) {
                console.error('Failed to fetch blog posts:', error)
=======
            } catch (e) {
                console.error('Failed to fetch blog posts:', e)
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'No date'
<<<<<<< HEAD

=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
<<<<<<< HEAD
            <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] backdrop-blur-xl p-4 sm:p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))]">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-[900] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Latest Writing</p>
                        <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Loading recent posts</p>
                    </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
                    <div className="animate-pulse flex flex-col justify-end min-h-[210px] rounded-[24px] border border-[hsl(var(--border))] bg-slate-100 dark:bg-slate-900/50 p-5">
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
=======
            <div className="blog-widget loading">
                <div className="widget-header">
                    <BookOpen size={18} />
                    <span>Latest Blog Posts</span>
                </div>
                <div className="loading-placeholder">Loading...</div>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            </div>
        )
    }

    if (posts.length === 0) {
        return (
<<<<<<< HEAD
            <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] backdrop-blur-xl p-5 sm:p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))]">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-[900] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Latest Writing</p>
                        <h3 className="text-lg font-black text-[hsl(var(--foreground))]">No posts published yet</h3>
                    </div>
                </div>

                <div className="rounded-[24px] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.5] px-5 py-10 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    Fresh posts will appear here once they go live.
                </div>
=======
            <div className="blog-widget">
                <div className="widget-header">
                    <BookOpen size={18} />
                    <span>Latest Blog Posts</span>
                </div>
                <div className="empty-state">No blog posts yet</div>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            </div>
        )
    }

<<<<<<< HEAD
    const [featuredPost, ...secondaryPosts] = posts

    return (
        <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] backdrop-blur-xl p-4 sm:p-5 md:p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:shadow-none">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-[900] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Latest Writing</p>
                        <h3 className="text-base font-black text-[hsl(var(--foreground))] sm:text-lg tracking-tight">Notes From the Build</h3>
                    </div>
                </div>

                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--accent))] transition-all hover:translate-x-1"
                >
                    Browse Blog
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
                <Link
                    href={`/blog/${featuredPost.slug}`}
                    className={cn(
                        "group relative overflow-hidden rounded-[22px] border border-[hsl(var(--border))]",
                        "bg-gradient-to-br from-[hsl(var(--accent))/0.12] to-[hsl(var(--card))/0.4] hover:border-[hsl(var(--accent))/0.3]",
                        "p-4 sm:p-5 transition-all duration-300"
                    )}
                >
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[hsl(var(--accent))]/10 transition-transform duration-500 group-hover:scale-110" />

                    <div className="relative z-10 flex h-full min-h-[210px] flex-col">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))] shadow-sm">
                                <Calendar size={12} className="text-[hsl(var(--accent))]" />
                                {formatDate(featuredPost.published_at)}
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shadow-md">
                                <ArrowRight size={15} />
                            </div>
                        </div>

                        <h4 className="mb-3 text-xl sm:text-2xl font-black leading-tight tracking-tight text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                            {featuredPost.title}
                        </h4>

                        <p className="max-w-2xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-[0.9rem]">
                            {featuredPost.excerpt || 'Open the article to read the full breakdown and implementation notes.'}
                        </p>

                        <div className="mt-auto pt-5 text-[11px] font-black uppercase tracking-[0.18em] text-[hsl(var(--accent))] flex items-center gap-2">
                            Read article
                        </div>
                    </div>
                </Link>

                {secondaryPosts.length > 0 ? (
                    <div className="grid auto-rows-fr gap-3">
                        {secondaryPosts.map(post => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className={cn(
                                    "group flex flex-col justify-between rounded-[22px] border border-[hsl(var(--border))] bg-white/40 dark:bg-white/5",
                                    "p-4 transition-all duration-300 hover:border-[hsl(var(--accent))/0.25] hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-0.5"
                                )}
                            >
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-black/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]/50">
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
                                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
=======
    return (
        <div className="blog-widget glass-card p-3 md:p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-sm">
                        <BookOpen size={14} />
                    </div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Latest Article</h3>
                </div>
                <Link href="/blog" className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1">
                    All Posts <ArrowRight size={12} />
                </Link>
            </div>

            <div className="flex-1">
                {posts.length > 0 ? (
                    <div className="bg-[var(--bg-primary)]/40 rounded-xl p-4 border border-[var(--border-light)] relative group overflow-hidden h-[280px] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="px-2 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                <Calendar size={9} className="text-[var(--accent-primary)]" />
                                {formatDate(posts[0].published_at)}
                            </div>
                            <div className="h-7 w-7 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg shrink-0">
                                <ArrowRight size={12} />
                            </div>
                        </div>

                        <h4 className="text-sm font-black text-[var(--text-primary)] leading-tight mb-2 uppercase tracking-tight group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                            {posts[0].title}
                        </h4>

                        {posts[0].excerpt && (
                            <p className="text-[9px] text-[var(--text-tertiary)] leading-relaxed font-bold uppercase tracking-wide opacity-80 mb-2 line-clamp-2">
                                {posts[0].excerpt}
                            </p>
                        )}

                        <Link
                            href={`/blog/${posts[0].slug}`}
                            className="inline-flex items-center text-[9px] font-black text-[var(--accent-primary)] uppercase tracking-widest gap-2 mt-auto"
                        >
                            Read More <div className="h-1 w-4 bg-[var(--accent-primary)]/30 rounded-full transition-all group-hover:w-8" />
                        </Link>
                    </div>
                ) : (
                    <div className="h-[280px] flex items-center justify-center bg-[var(--bg-primary)]/40 rounded-xl border border-dashed border-[var(--border-light)]">
                        <span className="text-center text-[var(--text-tertiary)] font-bold uppercase text-[10px] tracking-widest">
                            Awaiting Publication...
                        </span>
                    </div>
                )}
            </div>

            {/* Spacer to match carousel dots area */}
            <div className="h-[30px] mt-4" />
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        </div>
    )
}

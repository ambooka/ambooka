'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { BookOpen, Calendar, ArrowRight } from 'lucide-react'

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
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('id, title, excerpt, slug, published_at')
                    .eq('is_published', true)
                    .order('published_at', { ascending: false })
                    .limit(3)

                if (error) throw error
                if (data) setPosts(data)
            } catch (e) {
                console.error('Failed to fetch blog posts:', e)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'No date'
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="blog-widget loading">
                <div className="widget-header">
                    <BookOpen size={18} />
                    <span>Latest Blog Posts</span>
                </div>
                <div className="loading-placeholder">Loading...</div>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="blog-widget">
                <div className="widget-header">
                    <BookOpen size={18} />
                    <span>Latest Blog Posts</span>
                </div>
                <div className="empty-state">No blog posts yet</div>
            </div>
        )
    }

    return (
        <div className="blog-widget glass-card p-3 md:p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-sm">
                        <BookOpen size={14} />
                    </div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Latest Article</h3>
                </div>
                <a href="/blog" className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1">
                    All Posts <ArrowRight size={12} />
                </a>
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
                            <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg shrink-0">
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

                        <a
                            href={`/blog/${posts[0].slug}`}
                            className="inline-flex items-center text-[9px] font-black text-[var(--accent-primary)] uppercase tracking-widest gap-2 mt-auto"
                        >
                            Read More <div className="h-1 w-4 bg-[var(--accent-primary)]/30 rounded-full transition-all group-hover:w-8" />
                        </a>
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
        </div>
    )
}

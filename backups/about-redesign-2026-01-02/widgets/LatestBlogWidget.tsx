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
        <div className="blog-widget">
            <div className="widget-header">
                <BookOpen size={18} />
                <span>Latest Blog Posts</span>
            </div>

            <div className="posts-list">
                {posts.map((post) => (
                    <a
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="post-item"
                    >
                        <div className="post-content">
                            <h4 className="post-title">{post.title}</h4>
                            {post.excerpt && (
                                <p className="post-excerpt">{post.excerpt}</p>
                            )}
                            <div className="post-meta">
                                <Calendar size={12} />
                                <span>{formatDate(post.published_at)}</span>
                            </div>
                        </div>
                        <ArrowRight size={16} className="post-arrow" />
                    </a>
                ))}
            </div>

            <a href="/blog" className="view-all-link">
                View all posts
                <ArrowRight size={14} />
            </a>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Edit2, Eye, Calendar, FileText, CheckCircle2 } from 'lucide-react'

// CoachPro Design Tokens
const CARD_RADIUS = 20
const CARD_PADDING = 24
const GAP = 16

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    borderRadius: CARD_RADIUS,
    boxShadow: '8px 8px 16px rgba(166, 180, 200, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.9)'
}

interface BlogPost {
    id: string
    title: string
    excerpt: string | null
    is_published: boolean
    created_at: string
}

export default function BlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        setLoading(true)
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
        if (data) setPosts(data)
        setLoading(false)
    }

    const deletePost = async (id: string) => {
        if (!confirm('Delete this post?')) return
        await supabase.from('blog_posts').delete().eq('id', id)
        fetchPosts()
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const togglePublish = async (id: string, current: boolean) => {
        await supabase.from('blog_posts').update({
            is_published: !current,
            published_at: !current ? new Date().toISOString() : null
        }).eq('id', id)
        fetchPosts()
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <div style={{ width: 40, height: 40, border: '4px solid #0d9488', borderTopColor: 'transparent', borderRadius: '50%', animation: 'ad-spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div>
            {/* Success Toast */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 100,
                    padding: '12px 20px', borderRadius: 12,
                    background: '#f0fdf4', border: '1px solid #22c55e',
                    display: 'flex', alignItems: 'center', gap: 8
                }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                    <span style={{ color: '#16a34a', fontWeight: 500, fontSize: 14 }}>Done!</span>
                </div>
            )}

            {/* Title Row */}
            <div style={{ marginBottom: GAP + 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>Blog</h1>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage blog posts ({posts.length})</p>
            </div>

            {/* Actions Row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: GAP }}>
                <Link href="/admin/blog/new" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                    color: 'white', fontSize: 14, fontWeight: 500, textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)'
                }}>
                    <Plus size={16} /> New Post
                </Link>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
                <div style={{ ...cardStyle, padding: 60, textAlign: 'center' }}>
                    <FileText size={48} style={{ color: '#94a3b8', marginBottom: 16, opacity: 0.3 }} />
                    <p style={{ color: '#64748b' }}>No blog posts yet</p>
                </div>
            ) : (
                <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {posts.map((post) => (
                            <div key={post.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: 16, borderRadius: 12, background: 'rgba(241, 245, 249, 0.6)'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <h3 style={{ fontWeight: 600, color: '#1e293b', fontSize: 15 }}>{post.title}</h3>
                                        <span style={{
                                            fontSize: 11, padding: '2px 8px', borderRadius: 20,
                                            background: post.is_published ? '#f0fdf4' : '#fffbeb',
                                            color: post.is_published ? '#16a34a' : '#d97706'
                                        }}>
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, color: '#64748b' }}>
                                        {post.excerpt?.slice(0, 100)}...
                                    </p>
                                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Calendar size={12} />
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={() => togglePublish(post.id, post.is_published)}
                                        style={{
                                            padding: 10, borderRadius: 10,
                                            background: post.is_published ? '#fffbeb' : '#f0fdf4',
                                            color: post.is_published ? '#d97706' : '#16a34a',
                                            border: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/admin/blog/${post.id}`)}
                                        style={{
                                            padding: 10, borderRadius: 10,
                                            background: 'rgba(241, 245, 249, 0.8)', color: '#64748b',
                                            border: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        style={{
                                            padding: 10, borderRadius: 10,
                                            background: 'rgba(254, 242, 242, 0.8)', color: '#ef4444',
                                            border: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

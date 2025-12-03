'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { FileText, Briefcase, Code2, Calendar } from 'lucide-react'

interface BlogPost {
    id: string
    title: string
    updated_at: string
    category: string
}

export default function RecentBlogWidget() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_content')
                .select('id, title, updated_at, category')
                .eq('category', 'blog')
                .order('updated_at', { ascending: false })
                .limit(3)

            if (error) throw error
            setPosts(data || [])
        } catch (err) {
            console.error('Error fetching blog posts:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <FileText size={16} strokeWidth={2.5} />
                    Recent Blog Posts
                </h3>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-6 text-slate-400 text-sm">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">No blog posts yet</div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-100 transition-colors">
                                <FileText size={16} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-slate-900 truncate">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {new Date(post.updated_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

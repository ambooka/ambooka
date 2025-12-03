'use client'

import { Plus, ExternalLink, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface Project {
    id: string
    title: string
    updated_at: string
    tags: string[] | null
}

export default function ProjectListWidget() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_content')
                .select('id, title, updated_at, tags')
                .eq('category', 'project')
                .order('updated_at', { ascending: false })
                .limit(4)

            if (error) throw error
            setProjects(data || [])
        } catch (err) {
            console.error('Error fetching projects:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900">Latest Projects</h3>
                <button
                    onClick={() => router.push('/admin/projects')}
                    className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {loading ? (
                    <div className="text-center py-6 text-slate-400 text-sm">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">No projects found</div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => router.push(`/admin/projects/${project.id}`)}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-all group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                <Video size={16} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm truncate text-slate-900">
                                        {project.title}
                                    </h4>
                                    {project.tags && project.tags.includes('featured') && (
                                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-violet-600 text-white">
                                            ★
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">
                                    Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                                </p>
                            </div>
                            <div className="text-slate-300 group-hover:text-violet-600 transition-colors">
                                <ExternalLink size={14} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

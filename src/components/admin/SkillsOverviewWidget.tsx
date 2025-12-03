'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Skill {
    id: string
    name: string
    category: string
    proficiency_level: number | null
}

export default function SkillsOverviewWidget() {
    const router = useRouter()
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .eq('is_featured', true)
                .limit(5)
                .order('proficiency_level', { ascending: false })

            if (error) throw error
            if (data) setSkills(data)
        } catch (error) {
            console.error('Error fetching skills:', error)
        } finally {
            setLoading(false)
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'frontend': return '#8B5CF6' // Violet
            case 'backend': return '#3B82F6' // Blue
            case 'cloud': return '#F59E0B' // Amber
            case 'ai/ml': return '#10B981' // Emerald
            default: return '#64748B' // Slate
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-slate-900">Skills Overview</h3>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-6 text-slate-400 text-sm">Loading...</div>
                ) : skills.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">No featured skills</div>
                ) : (
                    skills.map((skill) => (
                        <div key={skill.id} className="group">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                                <span className="text-xs font-semibold text-slate-500">{skill.proficiency_level}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-90"
                                    style={{
                                        width: `${skill.proficiency_level}%`,
                                        backgroundColor: getCategoryColor(skill.category)
                                    }}
                                />
                            </div>
                            <div className="mt-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                {skill.category}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Total Skills: {skills.length}</span>
                    <button
                        onClick={() => router.push('/admin/skills')}
                        className="text-violet-600 font-medium hover:text-violet-700 transition-colors"
                    >
                        Manage Skills
                    </button>
                </div>
            </div>
        </div>
    )
}

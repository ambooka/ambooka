'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

interface Experience {
    id: string
    position: string
    company: string
    start_date: string
    end_date: string | null
    location: string | null
}

export default function RecentExperienceWidget() {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchExperiences()
    }, [])

    const fetchExperiences = async () => {
        try {
            const { data, error } = await supabase
                .from('experience')
                .select('id, position, company, start_date, end_date, location')
                .order('start_date', { ascending: false })
                .limit(3)

            if (error) throw error
            setExperiences(data || [])
        } catch (err) {
            console.error('Error fetching experience:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase size={16} strokeWidth={2.5} />
                    Recent Experience
                </h3>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-6 text-slate-400 text-sm">Loading...</div>
                ) : experiences.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">No experience added yet</div>
                ) : (
                    experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="border-l-2 border-violet-600 pl-4 hover:border-violet-700 transition-colors"
                        >
                            <h4 className="font-semibold text-sm text-slate-900">
                                {exp.position}
                            </h4>
                            <p className="text-sm text-slate-600 mt-0.5">
                                {exp.company}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                                </span>
                                {exp.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {exp.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

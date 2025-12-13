'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, FileText, Award, Layers } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

export const HeaderStats = () => {
    const [stats, setStats] = useState([
        { id: 'phase', label: "Phase", value: "1/4", icon: CheckCircle2 }, // Roadmap Phase
        { id: 'projects', label: "Projects", value: "-", icon: FileText },
        { id: 'certs', label: "Certs", value: "6", icon: Award }, // Planned Certs
        { id: 'stack', label: "Stack", value: "-", icon: Layers }
    ])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Projects Count
                const { count: projectCount } = await supabase
                    .from('projects')
                    .select('*', { count: 'exact', head: true })

                // Fetch Skills Count
                const { count: skillsCount } = await supabase
                    .from('skills')
                    .select('*', { count: 'exact', head: true })

                setStats(prev => prev.map(stat => {
                    if (stat.id === 'projects') return { ...stat, value: String(projectCount || 8) } // Fallback to 8
                    if (stat.id === 'stack') return { ...stat, value: (skillsCount ? `${skillsCount}+` : '50+') } // Fallback to 50+
                    return stat
                }))

            } catch (e) {
                console.error("Error fetching stats:", e)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="flex items-center gap-6 md:gap-10 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0">
            {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center group cursor-default">
                    <div className="flex items-center gap-2 mb-1 transition-transform group-hover:scale-110 duration-300">
                        <stat.icon size={16} className="text-gray-400 group-hover:text-[#f4c542] transition-colors" />
                        <span className="text-3xl font-light text-[#2a2a2a]">{stat.value}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

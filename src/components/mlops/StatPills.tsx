'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface KPIStat {
    id?: string
    label: string
    value: string
    icon?: string | null
    color?: string | null
    type?: string | null
    section?: string | null
    display_order?: number | null
}

// Single Pill Component
const StatPill = ({ stat }: { stat: KPIStat }) => {
    const { label, value, type, color } = stat

    if (type === 'solid') {
        return (
            <div className={`flex flex-col justify-center px-4 py-2 rounded-2xl ${color || 'bg-gray-100'} h-full min-w-[100px]`}>
                <span className="text-xs font-medium mb-0.5 opacity-80">{label}</span>
                <span className="text-lg font-bold">{value}</span>
            </div>
        );
    } else if (type === 'striped') {
        return (
            <div className="flex flex-col justify-center px-4 py-2 rounded-2xl bg-gray-100 h-full relative overflow-hidden min-w-[160px]">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
                <span className="text-xs font-medium mb-0.5 text-gray-500 z-10">{label}</span>
                <span className="text-lg font-bold z-10">{value}</span>
            </div>
        );
    } else {
        // Outline
        return (
            <div className="flex flex-col justify-center px-4 py-2 rounded-2xl border border-gray-300 h-full min-w-[90px]">
                <span className="text-xs font-medium mb-0.5 text-gray-500">{label}</span>
                <span className="text-lg font-bold">{value}</span>
            </div>
        );
    }
};

export const StatPills = () => {
    const [stats, setStats] = useState<KPIStat[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            // Fetch from personal_info.kpi_stats JSONB field (consolidated schema)
            const { data, error } = await supabase
                .from('personal_info')
                .select('kpi_stats')
                .single()

            if (error) {
                console.error('Error fetching hero stats:', error)
            }

            if (data?.kpi_stats && Array.isArray(data.kpi_stats)) {
                // Filter for hero section stats
                const heroStats = (data.kpi_stats as unknown as KPIStat[])
                    .filter(stat => stat.section === 'hero')
                    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                setStats(heroStats)
            }
            setLoading(false)
        }
        fetchStats()
    }, [])

    if (loading) return <div className="h-16 w-full animate-pulse bg-gray-100 rounded-2xl"></div>

    return (
        <div className="flex flex-wrap gap-4">
            {stats.map((stat, index) => (
                <StatPill key={stat.id || index} stat={stat} />
            ))}
        </div>
    )
}

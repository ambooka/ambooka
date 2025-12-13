'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'

type KPIStat = Database['public']['Tables']['kpi_stats']['Row']

// Single Pill Component
// This component is now obsolete given the new display style,
// but keeping it for structural integrity if other parts of the app use it.
// The StatPills component below will now render the new hardcoded stats.
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
                {/* Subtle striping background effect */}
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
            const { data, error } = await supabase
                .from('kpi_stats')
                .select('*')
                .eq('section', 'hero')
                .order('display_order', { ascending: true })

            if (error) {
                console.error('Error fetching hero stats:', error)
            }
            if (data) setStats(data)
            setLoading(false)
        }
        fetchStats()
    }, [])

    if (loading) return <div className="h-16 w-full animate-pulse bg-gray-100 rounded-2xl"></div>

    return (
        <div className="flex flex-wrap gap-4">
            {stats.map(stat => (
                <StatPill key={stat.id} stat={stat} />
            ))}
        </div>
    )
}

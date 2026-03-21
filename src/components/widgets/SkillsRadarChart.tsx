'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts'

interface SkillCategory {
    category: string
    count: number
    fullMark: number
}

const CATEGORY_LABELS: Record<string, string> = {
    'Languages': 'Languages',
    'Frameworks': 'Frameworks',
    'Cloud': 'Cloud',
    'Tools': 'Tools',
    'DevOps': 'DevOps',
    'ML': 'Machine Learning',
    'Other': 'Other'
}

export default function SkillsRadarChart() {
    const [data, setData] = useState<SkillCategory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const { data: skills, error } = await supabase
                    .from('skills')
                    .select('category')

                if (error) throw error

                // Count skills by category
                const categoryCounts: Record<string, number> = {}
                skills?.forEach(skill => {
                    const cat = skill.category || 'Other'
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
                })

                // Find max for normalization
                const maxCount = Math.max(...Object.values(categoryCounts), 1)

                // Convert to radar data
                const radarData = Object.entries(categoryCounts)
                    .map(([category, count]) => ({
                        category: CATEGORY_LABELS[category] || category,
                        count,
                        fullMark: maxCount
                    }))
                    .sort((a, b) => b.count - a.count)

                setData(radarData)
            } catch (e) {
                console.error('Failed to fetch skills:', e)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return (
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm p-4 md:p-8 flex flex-col justify-center min-h-[300px]">
                <div className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px] mb-6">Skills Intelligence</div>
                <div className="flex items-center justify-center py-20 flex-1">
                    <div className="w-8 h-8 border-4 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px] mb-2">Skills Distribution</div>
                <div className="text-[hsl(var(--muted-foreground))] text-sm italic">No skills data available</div>
            </div>
        )
    }

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm p-3 md:p-6 w-full flex flex-col h-full">
            <div className="text-[hsl(var(--foreground))] font-bold uppercase tracking-widest text-[10px] mb-4 text-center md:text-left">Skills Distribution</div>
            
            <div className="w-full flex-1 min-h-[250px] md:min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))', fontWeight: 900 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 'dataMax']}
                            tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))', opacity: 0.5 }}
                        />
                        <Radar
                            name="Skills"
                            dataKey="count"
                            stroke="hsl(var(--accent))"
                            fill="hsl(var(--accent))"
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                        <Tooltip
                            formatter={(value) => [`${value ?? 0} skills`, 'Count']}
                            contentStyle={{
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 pt-4 border-t border-[hsl(var(--border))]">
                {data.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[hsl(var(--muted))] px-2.5 py-1 rounded-full text-[10px]">
                        <span className="font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{item.category}</span>
                        <span className="bg-[hsl(var(--accent))] text-white px-1.5 py-[1px] rounded-full font-black text-[9px]">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

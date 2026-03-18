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
        (async () => {
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
            <div className="radar-widget loading !bg-[var(--bg-secondary)] !border-[var(--border-color)] !rounded-[var(--radius-xl)] !shadow-card p-4 md:p-8">
                <div className="widget-header !text-[var(--text-secondary)] !font-bold !uppercase !tracking-widest !text-[10px] !mb-6">Skills Intelligence</div>
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="radar-widget">
                <div className="widget-header">Skills Distribution</div>
                <div className="empty-state">No skills data available</div>
            </div>
        )
    }

    return (
        <div className="radar-widget p-3 md:p-6">
            <div className="widget-header">Skills Distribution</div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="var(--border-color)" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fontSize: 9, fill: 'var(--text-tertiary)', fontWeight: 900 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 'dataMax']}
                            tick={{ fontSize: 8, fill: 'var(--text-tertiary)', opacity: 0.5 }}
                        />
                        <Radar
                            name="Skills"
                            dataKey="count"
                            stroke="var(--accent-primary)"
                            fill="var(--accent-primary)"
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                        <Tooltip
                            formatter={(value) => [`${value ?? 0} skills`, 'Count']}
                            contentStyle={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-card)'
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="legend">
                {data.slice(0, 5).map((item, i) => (
                    <div key={i} className="legend-item">
                        <span className="legend-name">{item.category}</span>
                        <span className="legend-value">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

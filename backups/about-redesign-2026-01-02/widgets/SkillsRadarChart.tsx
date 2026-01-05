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
            <div className="radar-widget loading">
                <div className="widget-header">Skills Distribution</div>
                <div className="loading-placeholder">Loading...</div>
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
        <div className="radar-widget">
            <div className="widget-header">Skills Distribution</div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e5e5e5" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fontSize: 11, fill: '#666' }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 'dataMax']}
                            tick={{ fontSize: 10, fill: '#999' }}
                        />
                        <Radar
                            name="Skills"
                            dataKey="count"
                            stroke="#8B5A2B"
                            fill="#D4A574"
                            fillOpacity={0.5}
                            strokeWidth={2}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value} skills`, 'Count']}
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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

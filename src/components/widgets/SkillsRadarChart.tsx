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
<<<<<<< HEAD
        ;(async () => {
=======
        (async () => {
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
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
<<<<<<< HEAD
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm p-4 md:p-8 flex flex-col justify-center min-h-[300px]">
                <div className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px] mb-6">Skills Intelligence</div>
                <div className="flex items-center justify-center py-20 flex-1">
                    <div className="w-8 h-8 border-4 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
=======
            <div className="radar-widget loading !bg-[var(--bg-secondary)] !border-[var(--border-color)] !rounded-[var(--radius-xl)] !shadow-card p-4 md:p-8">
                <div className="widget-header !text-[var(--text-secondary)] !font-bold !uppercase !tracking-widest !text-[10px] !mb-6">Skills Intelligence</div>
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
<<<<<<< HEAD
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px] mb-2">Skills Distribution</div>
                <div className="text-[hsl(var(--muted-foreground))] text-sm italic">No skills data available</div>
=======
            <div className="radar-widget">
                <div className="widget-header">Skills Distribution</div>
                <div className="empty-state">No skills data available</div>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            </div>
        )
    }

    return (
<<<<<<< HEAD
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm p-3 md:p-6 w-full flex flex-col h-full">
            <div className="text-[hsl(var(--foreground))] font-bold uppercase tracking-widest text-[10px] mb-4 text-center md:text-left">Skills Distribution</div>
            
            <div className="w-full flex-1 min-h-[250px] md:min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))', fontWeight: 900 }}
=======
        <div className="radar-widget p-3 md:p-6">
            <div className="widget-header">Skills Distribution</div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="var(--border-color)" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fontSize: 9, fill: 'var(--text-tertiary)', fontWeight: 900 }}
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 'dataMax']}
<<<<<<< HEAD
                            tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))', opacity: 0.5 }}
=======
                            tick={{ fontSize: 8, fill: 'var(--text-tertiary)', opacity: 0.5 }}
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                        />
                        <Radar
                            name="Skills"
                            dataKey="count"
<<<<<<< HEAD
                            stroke="hsl(var(--accent))"
                            fill="hsl(var(--accent))"
=======
                            stroke="var(--accent-primary)"
                            fill="var(--accent-primary)"
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                        <Tooltip
                            formatter={(value) => [`${value ?? 0} skills`, 'Count']}
                            contentStyle={{
<<<<<<< HEAD
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-md)'
=======
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-card)'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

<<<<<<< HEAD
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 pt-4 border-t border-[hsl(var(--border))]">
                {data.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[hsl(var(--muted))] px-2.5 py-1 rounded-full text-[10px]">
                        <span className="font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{item.category}</span>
                        <span className="bg-[hsl(var(--accent))] text-white px-1.5 py-[1px] rounded-full font-black text-[9px]">{item.count}</span>
=======
            <div className="legend">
                {data.slice(0, 5).map((item, i) => (
                    <div key={i} className="legend-item">
                        <span className="legend-name">{item.category}</span>
                        <span className="legend-value">{item.count}</span>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                    </div>
                ))}
            </div>
        </div>
    )
}

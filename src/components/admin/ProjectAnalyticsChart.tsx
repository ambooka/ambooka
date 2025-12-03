'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { MoreHorizontal } from 'lucide-react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ProjectAnalyticsChart() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { data: projects, error } = await supabase
                .from('portfolio_content')
                .select('created_at')
                .eq('category', 'project')
                .order('created_at', { ascending: true })

            if (error) throw error

            // Process data: Group by month
            const monthCounts: { [key: string]: number } = {}
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            // Initialize last 6 months
            const today = new Date()
            for (let i = 5; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
                const monthName = months[d.getMonth()]
                monthCounts[monthName] = 0
            }

            if (projects) {
                projects.forEach(p => {
                    const d = new Date(p.created_at)
                    const monthName = months[d.getMonth()]
                    if (monthCounts.hasOwnProperty(monthName)) {
                        monthCounts[monthName]++
                    }
                })
            }

            const chartData = Object.keys(monthCounts).map(name => ({
                name,
                projects: monthCounts[name]
            }))

            setData(chartData)
        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-0.5">Project Analytics</h3>
                    <p className="text-sm text-slate-500">Projects created over time</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">Loading...</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip
                                cursor={{ fill: '#F8FAFC' }}
                                contentStyle={{
                                    backgroundColor: '#0F172A',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="projects" radius={[6, 6, 0, 0]} barSize={28}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#8B5CF6' : '#E2E8F0'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}

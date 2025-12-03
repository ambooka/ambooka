'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Eye, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { startOfDay, subDays, format, parseISO } from 'date-fns'

interface DailyStats {
    name: string
    visits: number
    views: number
}

export default function VisitorAnalyticsWidget() {
    const [data, setData] = useState<DailyStats[]>([])
    const [loading, setLoading] = useState(true)
    const [totals, setTotals] = useState({
        uniqueVisitors: 0,
        pageViews: 0,
        avgTime: '0m 0s' // Placeholder as we don't track duration yet
    })

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const endDate = new Date()
            const startDate = subDays(endDate, 6) // Last 7 days

            // @ts-ignore - Table not yet in types
            const { data: views, error } = await supabase
                .from('page_views')
                .select('created_at, session_id')
                .gte('created_at', startOfDay(startDate).toISOString())
                .lte('created_at', endDate.toISOString())

            if (error) {
                console.error('Error fetching analytics:', error)
                // Fallback to empty data if table doesn't exist
                setData(generateEmptyLast7Days())
                return
            }

            if (!views || views.length === 0) {
                setData(generateEmptyLast7Days())
                return
            }

            // Process data
            const dailyMap = new Map<string, { visits: Set<string>, views: number }>()

            // Initialize map with all 7 days to ensure continuous line
            for (let i = 0; i < 7; i++) {
                const date = subDays(endDate, i)
                const dateKey = format(date, 'MMM dd') // e.g. "Oct 24"
                dailyMap.set(dateKey, { visits: new Set(), views: 0 })
            }

            let totalViews = 0
            const allUniqueVisitors = new Set<string>()

            views.forEach((view: any) => {
                const date = parseISO(view.created_at)
                const dateKey = format(date, 'MMM dd')

                if (dailyMap.has(dateKey)) {
                    const stats = dailyMap.get(dateKey)!
                    stats.views++
                    if (view.session_id) {
                        stats.visits.add(view.session_id)
                        allUniqueVisitors.add(view.session_id)
                    }
                }
                totalViews++
            })

            // Convert map to array and reverse to show oldest to newest
            const chartData = Array.from(dailyMap.entries()).map(([name, stats]) => ({
                name,
                visits: stats.visits.size,
                views: stats.views
            })).reverse()

            setData(chartData)
            setTotals({
                uniqueVisitors: allUniqueVisitors.size,
                pageViews: totalViews,
                avgTime: '2m 45s' // Mock for now
            })

        } catch (err) {
            console.error('Error:', err)
            setData(generateEmptyLast7Days())
        } finally {
            setLoading(false)
        }
    }

    const generateEmptyLast7Days = () => {
        const arr = []
        for (let i = 6; i >= 0; i--) {
            arr.push({
                name: format(subDays(new Date(), i), 'MMM dd'),
                visits: 0,
                views: 0
            })
        }
        return arr
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <TrendingUp size={18} className="text-violet-600" />
                        Visitor Analytics
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Last 7 days performance</p>
                </div>
                <select className="text-xs border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-100 transition-colors">
                    <option>Last 7 Days</option>
                </select>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                    <div className="flex items-center gap-2 text-violet-600 mb-1">
                        <Users size={14} />
                        <span className="text-xs font-medium">Unique Visitors</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{loading ? '...' : totals.uniqueVisitors}</p>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                        <TrendingUp size={10} /> --
                    </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Eye size={14} />
                        <span className="text-xs font-medium">Page Views</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{loading ? '...' : totals.pageViews}</p>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                        <TrendingUp size={10} /> --
                    </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-600 mb-1">
                        <Clock size={14} />
                        <span className="text-xs font-medium">Avg. Time</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{totals.avgTime}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        --
                    </span>
                </div>
            </div>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="visits"
                            stroke="#8B5CF6"
                            fillOpacity={1}
                            fill="url(#colorVisits)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

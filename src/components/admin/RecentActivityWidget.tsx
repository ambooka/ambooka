'use client'

import { Clock, Activity, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { formatDistanceToNow } from 'date-fns'

interface ActivityLog {
    id: string
    title: string
    category: string
    updated_at: string
}

export default function RecentActivityWidget() {
    const [activities, setActivities] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState(true)
    const [lastSync, setLastSync] = useState(new Date())

    useEffect(() => {
        fetchActivity()
    }, [])

    const fetchActivity = async () => {
        setLoading(true)
        try {
            // Fetch recent updates from portfolio_content
            const { data, error } = await supabase
                .from('portfolio_content')
                .select('id, title, category, updated_at')
                .order('updated_at', { ascending: false })
                .limit(3)

            if (error) throw error
            setActivities(data || [])
            setLastSync(new Date())
        } catch (err) {
            console.error('Error fetching activity:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Activity size={16} strokeWidth={2.5} />
                    Recent Activity
                </h3>
                <button
                    onClick={fetchActivity}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                    title="Refresh"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="flex-1 space-y-3.5">
                {activities.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm py-6">
                        No recent activity
                    </div>
                ) : (
                    activities.map((item) => (
                        <div key={item.id} className="flex items-start gap-2.5">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-600 flex-shrink-0"></div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate text-slate-900">
                                    Updated {item.category}: {item.title}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Clock size={10} />
                                    {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>Last sync: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
        </div>
    )
}

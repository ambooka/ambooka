'use client'

import Link from 'next/link'
import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

interface StatCardProps {
    title: string
    value: number | string
    subtitle?: string
    icon?: LucideIcon
    trend?: {
        value: number
        label?: string
        isPositive: boolean
    }
    link?: string
    variant?: 'solid' | 'outlined'
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    link,
    variant = 'outlined'
}: StatCardProps) {
    const isSolid = variant === 'solid'

    return (
        <div
            className={`
                relative overflow-hidden group rounded-2xl p-6 transition-all duration-300 border
                ${isSolid
                    ? 'bg-gradient-to-br from-violet-600 to-violet-500 text-white border-transparent shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30'
                    : 'bg-white border-slate-100 text-slate-900 hover:shadow-sm hover:border-slate-200'
                }
            `}
        >
            {/* Background decoration for solid card */}
            {isSolid && (
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
            )}

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <h3 className={`text-sm font-medium mb-1 ${isSolid ? 'text-white/80' : 'text-slate-600'}`}>
                        {title}
                    </h3>
                    <div className={`text-3xl font-bold tracking-tight ${isSolid ? 'text-white' : 'text-slate-900'}`}>
                        {value}
                    </div>
                </div>
                {link && (
                    <Link
                        href={link}
                        className={`
                            w-9 h-9 rounded-lg flex items-center justify-center transition-all
                            ${isSolid
                                ? 'bg-white/20 text-white hover:bg-white/30 hover:scale-110'
                                : 'bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-600 hover:scale-110'
                            }
                        `}
                    >
                        <ArrowUpRight size={18} strokeWidth={2} />
                    </Link>
                )}
            </div>

            <div className="relative z-10 flex items-center gap-3">
                {trend && (
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`
                                flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold
                                ${isSolid
                                    ? 'bg-white/20 text-white'
                                    : (trend.isPositive
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-red-50 text-red-700')
                                }
                            `}
                        >
                            {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(trend.value)}%
                        </span>
                        <span className={`text-xs ${isSolid ? 'text-white/70' : 'text-slate-500'}`}>
                            {trend.label || 'vs last month'}
                        </span>
                    </div>
                )}

                {subtitle && !trend && (
                    <div className={`text-sm ${isSolid ? 'text-white/70' : 'text-slate-500'}`}>
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    )
}

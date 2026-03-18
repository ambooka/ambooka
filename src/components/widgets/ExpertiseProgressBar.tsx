'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ExpertiseBreakdown {
    software?: number
    cloud_infra?: number
    data?: number
    ml_ai?: number
}

interface ExpertiseProgressBarProps {
    breakdown: ExpertiseBreakdown
}

const SEGMENTS = [
    { key: 'software', label: 'Software', bgClass: 'bg-[hsl(var(--foreground))]', borderClass: 'border-transparent', textClass: 'text-[hsl(var(--background))]', isStriped: false },
    { key: 'cloud_infra', label: 'Cloud & Infra', bgClass: 'bg-[hsl(var(--accent))]', borderClass: 'border-transparent', textClass: 'text-[hsl(var(--background))]', isStriped: true },
    { key: 'data', label: 'Data', bgClass: 'bg-[hsl(var(--muted))]', borderClass: 'border-transparent', textClass: 'text-[hsl(var(--muted-foreground))]', isStriped: false },
    { key: 'ml_ai', label: 'ML/AI', bgClass: 'bg-transparent', borderClass: 'border-dashed border-2 border-[hsl(var(--border))]', textClass: 'text-[hsl(var(--muted-foreground))]', isStriped: false }
]

export const ExpertiseProgressBar = ({ breakdown }: ExpertiseProgressBarProps) => {
    const values = {
        software: breakdown.software || 0,
        cloud_infra: breakdown.cloud_infra || 0,
        data: breakdown.data || 0,
        ml_ai: breakdown.ml_ai || 0
    }

    // Calculate total for proportional widths
    const total = Object.values(values).reduce((a, b) => a + b, 0) || 100

    return (
        <div className="flex flex-col gap-1.5 my-5 w-full max-w-[500px]">
            {/* Labels Row */}
            <div className="flex w-full">
                {SEGMENTS.map((seg) => {
                    const value = values[seg.key as keyof typeof values]
                    if (value === 0) return null
                    return (
                        <span
                            key={seg.key}
                            className="text-[9px] text-[hsl(var(--muted-foreground))] font-[900] uppercase tracking-[0.1em] text-left pl-1 whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ width: `${(value / total) * 100}%`, minWidth: value > 0 ? '40px' : '0' }}
                        >
                            {seg.label}
                        </span>
                    )
                })}
            </div>

            {/* Pills Row - Proportionate widths */}
            <div className="flex w-full gap-1">
                {SEGMENTS.map((seg) => {
                    const value = values[seg.key as keyof typeof values]
                    if (value === 0) return null
                    return (
                        <div
                            key={seg.key}
                            className={cn(
                                "flex items-center justify-start pl-3 h-9 rounded-[20px] text-xs font-semibold shrink-0 cursor-default transition-all duration-300",
                                seg.bgClass,
                                seg.textClass,
                                seg.borderClass,
                                seg.isStriped && "bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"
                            )}
                            style={{ width: `${(value / total) * 100}%`, minWidth: value > 0 ? '50px' : '0' }}
                        >
                            {value}%
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ExpertiseProgressBar

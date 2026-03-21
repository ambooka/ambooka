'use client'

import React from 'react'
<<<<<<< HEAD
import { cn } from '@/lib/utils'
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

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
<<<<<<< HEAD
    { key: 'software', label: 'Software', bgClass: 'bg-[hsl(var(--foreground))]', borderClass: 'border-transparent', textClass: 'text-[hsl(var(--background))]', isStriped: false },
    { key: 'cloud_infra', label: 'Cloud & Infra', bgClass: 'bg-[hsl(var(--accent))]', borderClass: 'border-transparent', textClass: 'text-[hsl(var(--background))]', isStriped: true },
    { key: 'data', label: 'Data', bgClass: 'bg-[hsl(var(--muted))]', borderClass: 'border-transparent', textClass: 'text-[hsl(var(--muted-foreground))]', isStriped: false },
    { key: 'ml_ai', label: 'ML/AI', bgClass: 'bg-transparent', borderClass: 'border-dashed border-2 border-[hsl(var(--border))]', textClass: 'text-[hsl(var(--muted-foreground))]', isStriped: false }
=======
    { key: 'software', label: 'Software', bgColor: 'var(--text-primary)', border: '1px solid var(--text-primary)', textColor: 'var(--bg-primary)', isStriped: false },
    { key: 'cloud_infra', label: 'Cloud & Infra', bgColor: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', textColor: 'var(--bg-primary)', isStriped: true },
    { key: 'data', label: 'Data', bgColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', textColor: 'var(--text-secondary)', isStriped: false },
    { key: 'ml_ai', label: 'ML/AI', bgColor: 'transparent', border: '2px dashed var(--border-color)', textColor: 'var(--text-tertiary)', isStriped: false }
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
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

<<<<<<< HEAD
    return (
        <div className="flex flex-col gap-1.5 my-5 w-full max-w-[500px]">
            {/* Labels Row */}
            <div className="flex w-full">
=======
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        margin: '20px 0',
        width: '100%',
        maxWidth: '500px'
    }

    const labelsRowStyle: React.CSSProperties = {
        display: 'flex',
        width: '100%'
    }

    const pillsRowStyle: React.CSSProperties = {
        display: 'flex',
        width: '100%',
        gap: '4px'
    }

    const getLabelStyle = (value: number): React.CSSProperties => ({
        fontSize: '9px',
        color: 'var(--text-tertiary)',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        width: `${(value / total) * 100}%`,
        minWidth: value > 0 ? '40px' : '0',
        textAlign: 'left',
        paddingLeft: '4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    })

    const getPillStyle = (seg: typeof SEGMENTS[0], value: number): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '12px',
            height: '36px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            width: `${(value / total) * 100}%`,
            minWidth: value > 0 ? '50px' : '0',
            border: seg.border,
            color: seg.textColor || 'rgba(0, 0, 0, 0.7)',
            cursor: 'default',
            flexShrink: 0
        }

        if (seg.isStriped) {
            baseStyle.backgroundColor = seg.bgColor
            baseStyle.backgroundImage = 'linear-gradient(45deg, rgba(255,255,255,0.25) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 75%, transparent 75%, transparent)'
            baseStyle.backgroundSize = '20px 20px'
        } else {
            baseStyle.background = seg.bgColor
        }

        return baseStyle
    }

    return (
        <div style={containerStyle}>
            {/* Labels Row */}
            <div style={labelsRowStyle}>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                {SEGMENTS.map((seg) => {
                    const value = values[seg.key as keyof typeof values]
                    if (value === 0) return null
                    return (
<<<<<<< HEAD
                        <span
                            key={seg.key}
                            className="text-[9px] text-[hsl(var(--muted-foreground))] font-[900] uppercase tracking-[0.1em] text-left pl-1 whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ width: `${(value / total) * 100}%`, minWidth: value > 0 ? '40px' : '0' }}
                        >
=======
                        <span key={seg.key} style={getLabelStyle(value)}>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                            {seg.label}
                        </span>
                    )
                })}
            </div>

            {/* Pills Row - Proportionate widths */}
<<<<<<< HEAD
            <div className="flex w-full gap-1">
=======
            <div style={pillsRowStyle}>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                {SEGMENTS.map((seg) => {
                    const value = values[seg.key as keyof typeof values]
                    if (value === 0) return null
                    return (
<<<<<<< HEAD
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
=======
                        <div key={seg.key} style={getPillStyle(seg, value)}>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                            {value}%
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ExpertiseProgressBar

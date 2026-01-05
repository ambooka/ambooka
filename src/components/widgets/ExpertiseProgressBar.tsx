'use client'

import React from 'react'

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
    { key: 'software', label: 'Software', bgColor: 'var(--text-primary)', border: '1px solid var(--text-primary)', textColor: 'var(--bg-primary)', isStriped: false },
    { key: 'cloud_infra', label: 'Cloud & Infra', bgColor: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', textColor: 'var(--bg-primary)', isStriped: true },
    { key: 'data', label: 'Data', bgColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', textColor: 'var(--text-secondary)', isStriped: false },
    { key: 'ml_ai', label: 'ML/AI', bgColor: 'transparent', border: '2px dashed var(--border-color)', textColor: 'var(--text-tertiary)', isStriped: false }
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
                {SEGMENTS.map((seg) => {
                    const value = values[seg.key as keyof typeof values]
                    if (value === 0) return null
                    return (
                        <span key={seg.key} style={getLabelStyle(value)}>
                            {seg.label}
                        </span>
                    )
                })}
            </div>

            {/* Pills Row - Proportionate widths */}
            <div style={pillsRowStyle}>
                {SEGMENTS.map((seg) => {
                    const value = values[seg.key as keyof typeof values]
                    if (value === 0) return null
                    return (
                        <div key={seg.key} style={getPillStyle(seg, value)}>
                            {value}%
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ExpertiseProgressBar

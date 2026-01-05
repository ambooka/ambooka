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

    const cardStyle: React.CSSProperties = isSolid ? {
        background: 'linear-gradient(135deg, var(--ad-primary-500), var(--ad-primary-700))',
        borderRadius: 'var(--ad-radius-2xl)',
        padding: '20px',
        boxShadow: 'var(--ad-shadow-neu-md), 0 8px 24px rgba(13, 148, 136, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s'
    } : {
        background: 'var(--ad-bg-card)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--ad-border-subtle)',
        borderRadius: 'var(--ad-radius-2xl)',
        padding: '20px',
        boxShadow: 'var(--ad-shadow-neu-md)',
        transition: 'all 0.2s'
    }

    return (
        <div style={cardStyle}>
            {/* Background decoration for solid card */}
            {isSolid && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '-40px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        filter: 'blur(20px)'
                    }}
                />
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <div>
                    <h3
                        style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '4px',
                            color: isSolid ? 'rgba(255,255,255,0.8)' : 'var(--ad-text-secondary)'
                        }}
                    >
                        {title}
                    </h3>
                    <div
                        style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: isSolid ? 'white' : 'var(--ad-text-primary)'
                        }}
                    >
                        {value}
                    </div>
                </div>
                {link && (
                    <Link
                        href={link}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--ad-radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSolid ? 'rgba(255,255,255,0.2)' : 'var(--ad-bg-card)',
                            color: isSolid ? 'white' : 'var(--ad-primary)',
                            boxShadow: isSolid ? 'none' : 'var(--ad-shadow-neu-sm)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ArrowUpRight size={18} strokeWidth={2} />
                    </Link>
                )}
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                {trend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: 'var(--ad-radius-md)',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: isSolid
                                    ? 'rgba(255,255,255,0.2)'
                                    : (trend.isPositive ? 'var(--ad-success-50)' : 'var(--ad-danger-50)'),
                                color: isSolid
                                    ? 'white'
                                    : (trend.isPositive ? 'var(--ad-success-600)' : 'var(--ad-danger-600)')
                            }}
                        >
                            {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(trend.value)}%
                        </span>
                        <span style={{ fontSize: '12px', color: isSolid ? 'rgba(255,255,255,0.7)' : 'var(--ad-text-tertiary)' }}>
                            {trend.label || 'vs last month'}
                        </span>
                    </div>
                )}

                {subtitle && !trend && (
                    <div style={{ fontSize: '14px', color: isSolid ? 'rgba(255,255,255,0.7)' : 'var(--ad-text-tertiary)' }}>
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    )
}

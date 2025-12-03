'use client'

import Link from 'next/link'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatCardProps {
    title: string
    value: number
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    link: string
    color?: 'primary' | 'secondary' | 'success' | 'tertiary'
    sparklineData?: number[]
}

export default function EnhancedStatCard({
    title,
    value,
    icon: Icon,
    trend,
    link,
    color = 'primary',
    sparklineData = []
}: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    // Animated counter effect
    useEffect(() => {
        let start = 0
        const end = value
        const duration = 1500
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setDisplayValue(end)
                clearInterval(timer)
            } else {
                setDisplayValue(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [value])

    const getColorStyles = () => {
        switch (color) {
            case 'secondary':
                return {
                    iconBg: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-tertiary) 100%)',
                    iconColor: '#ffffff',
                    glowColor: 'var(--accent-secondary)'
                }
            case 'success':
                return {
                    iconBg: 'linear-gradient(135deg, var(--accent-success) 0%, #3D7A52 100%)',
                    iconColor: '#ffffff',
                    glowColor: 'var(--accent-success)'
                }
            case 'tertiary':
                return {
                    iconBg: 'linear-gradient(135deg, var(--accent-tertiary) 0%, #9A7310 100%)',
                    iconColor: '#ffffff',
                    glowColor: 'var(--accent-tertiary)'
                }
            default:
                return {
                    iconBg: 'linear-gradient(135deg, var(--accent-primary) 0%, #6B0A1F 100%)',
                    iconColor: '#ffffff',
                    glowColor: 'var(--accent-primary)'
                }
        }
    }

    const colorStyles = getColorStyles()

    // Generate sparkline path
    const generateSparkline = () => {
        if (sparklineData.length === 0) return ''

        const width = 120
        const height = 40
        const padding = 4

        const max = Math.max(...sparklineData)
        const min = Math.min(...sparklineData)
        const range = max - min || 1

        const points = sparklineData.map((val, i) => {
            const x = (i / (sparklineData.length - 1)) * width
            const y = height - padding - ((val - min) / range) * (height - 2 * padding)
            return `${x},${y}`
        })

        return `M ${points.join(' L ')}`
    }

    return (
        <Link
            href={link}
            className="block p-6 rounded-2xl border transition-all duration-500 group overflow-hidden relative"
            style={{
                background: 'rgba(245, 241, 235, 0.6)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(142, 14, 40, 0.15)',
                boxShadow: isHovered
                    ? '0 20px 40px rgba(142, 14, 40, 0.15), 0 0 0 1px rgba(142, 14, 40, 0.1)'
                    : '0 8px 24px rgba(142, 14, 40, 0.08)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient overlay */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at top right, ${colorStyles.glowColor}, transparent 70%)`
                }}
            />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div
                        className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 relative"
                        style={{
                            background: colorStyles.iconBg,
                            boxShadow: isHovered ? `0 8px 20px ${colorStyles.glowColor}40` : 'none'
                        }}
                    >
                        <Icon className="w-6 h-6" style={{ color: colorStyles.iconColor }} />
                    </div>
                    {trend && (
                        <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
                            style={{
                                backgroundColor: trend.isPositive ? 'rgba(45, 95, 63, 0.1)' : 'rgba(142, 14, 40, 0.1)',
                                color: trend.isPositive ? 'var(--accent-success)' : 'var(--accent-error)',
                                border: `1px solid ${trend.isPositive ? 'rgba(45, 95, 63, 0.2)' : 'rgba(142, 14, 40, 0.2)'}`
                            }}
                        >
                            {trend.isPositive ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2 mb-4">
                    <p
                        className="text-4xl font-bold tracking-tight"
                        style={{
                            color: 'var(--text-primary)',
                            fontVariantNumeric: 'tabular-nums'
                        }}
                    >
                        {displayValue}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {title}
                    </p>
                </div>

                {/* Sparkline */}
                {sparklineData.length > 0 && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(142, 14, 40, 0.1)' }}>
                        <svg width="120" height="40" className="opacity-60 group-hover:opacity-100 transition-opacity">
                            <path
                                d={generateSparkline()}
                                fill="none"
                                stroke={colorStyles.glowColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    filter: `drop-shadow(0 0 4px ${colorStyles.glowColor}40)`
                                }}
                            />
                        </svg>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                            Last 7 days
                        </p>
                    </div>
                )}
            </div>
        </Link>
    )
}

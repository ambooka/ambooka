'use client'

import { useEffect, useRef } from 'react'

interface ProgressRingProps {
    percentage: number
    size?: number
    strokeWidth?: number
    label: string
    color?: string
}

export default function ProgressRing({
    percentage,
    size = 120,
    strokeWidth = 8,
    label,
    color = 'var(--accent-primary)'
}: ProgressRingProps) {
    const ringRef = useRef<SVGCircleElement>(null)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI

    useEffect(() => {
        if (!ringRef.current) return

        const offset = circumference - (percentage / 100) * circumference

        // Animate from 0 to target percentage
        ringRef.current.style.strokeDashoffset = circumference.toString()

        setTimeout(() => {
            if (ringRef.current) {
                ringRef.current.style.strokeDashoffset = offset.toString()
            }
        }, 100)
    }, [percentage, circumference])

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(142, 14, 40, 0.1)"
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <circle
                    ref={ringRef}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: `drop-shadow(0 0 6px ${color}40)`
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {Math.round(percentage)}%
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {label}
                </div>
            </div>
        </div>
    )
}

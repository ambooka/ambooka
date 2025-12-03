'use client'

import { useEffect, useRef } from 'react'

interface ContentDistributionProps {
    data: {
        label: string
        value: number
        color: string
    }[]
}

export default function ContentDistribution({ data }: ContentDistributionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = 80
        const innerRadius = 50

        const total = data.reduce((sum, item) => sum + item.value, 0)
        let currentAngle = -Math.PI / 2

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw donut chart
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI

            // Outer arc
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
            ctx.closePath()

            ctx.fillStyle = item.color
            ctx.fill()

            // Add subtle shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
            ctx.shadowBlur = 10
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 2

            currentAngle += sliceAngle
        })

        // Reset shadow
        ctx.shadowColor = 'transparent'

        // Draw center circle (for donut hole)
        ctx.beginPath()
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgba(250, 248, 245, 0.9)'
        ctx.fill()

        // Draw total in center
        ctx.fillStyle = '#2A1810'
        ctx.font = 'bold 24px Inter'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(total.toString(), centerX, centerY - 8)

        ctx.font = '12px Inter'
        ctx.fillStyle = '#6B5847'
        ctx.fillText('Total', centerX, centerY + 12)

    }, [data])

    return (
        <div className="p-6 rounded-2xl border" style={{
            background: 'rgba(245, 241, 235, 0.6)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(142, 14, 40, 0.15)',
            boxShadow: '0 8px 24px rgba(142, 14, 40, 0.08)'
        }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Content Distribution
            </h3>

            <div className="flex items-center justify-between gap-8">
                {/* Chart */}
                <div className="flex-shrink-0">
                    <canvas
                        ref={canvasRef}
                        width={200}
                        height={200}
                        className="transition-transform hover:scale-105 duration-300"
                    />
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    {data.map((item, index) => {
                        const total = data.reduce((sum, d) => sum + d.value, 0)
                        const percentage = ((item.value / total) * 100).toFixed(1)

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg transition-all hover:translate-x-1 duration-200"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0"
                                        style={{
                                            backgroundColor: item.color,
                                            boxShadow: `0 0 8px ${item.color}60`
                                        }}
                                    />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {item.label}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {item.value}
                                    </div>
                                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                        {percentage}%
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

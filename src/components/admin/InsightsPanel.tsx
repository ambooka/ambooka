'use client'

import { useEffect, useState } from 'react'
import { Lightbulb, AlertCircle, Sparkles, TrendingUp } from 'lucide-react'

interface Insight {
    type: 'recommendation' | 'alert' | 'achievement' | 'trend'
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
}

interface InsightsPanelProps {
    insights: Insight[]
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
    const [visibleInsights, setVisibleInsights] = useState<Insight[]>([])

    useEffect(() => {
        // Stagger animation of insights
        insights.forEach((insight, index) => {
            setTimeout(() => {
                setVisibleInsights(prev => [...prev, insight])
            }, index * 100)
        })
    }, [insights])

    const getIcon = (type: Insight['type']) => {
        switch (type) {
            case 'recommendation':
                return <Lightbulb className="w-5 h-5" />
            case 'alert':
                return <AlertCircle className="w-5 h-5" />
            case 'achievement':
                return <Sparkles className="w-5 h-5" />
            case 'trend':
                return <TrendingUp className="w-5 h-5" />
        }
    }

    const getStyles = (type: Insight['type']) => {
        switch (type) {
            case 'recommendation':
                return {
                    bg: 'rgba(142, 14, 40, 0.05)',
                    border: 'rgba(142, 14, 40, 0.15)',
                    iconBg: 'var(--accent-primary)',
                    iconColor: '#ffffff'
                }
            case 'alert':
                return {
                    bg: 'rgba(201, 169, 97, 0.05)',
                    border: 'rgba(201, 169, 97, 0.2)',
                    iconBg: 'var(--accent-secondary)',
                    iconColor: '#ffffff'
                }
            case 'achievement':
                return {
                    bg: 'rgba(45, 95, 63, 0.05)',
                    border: 'rgba(45, 95, 63, 0.2)',
                    iconBg: 'var(--accent-success)',
                    iconColor: '#ffffff'
                }
            case 'trend':
                return {
                    bg: 'rgba(184, 134, 11, 0.05)',
                    border: 'rgba(184, 134, 11, 0.2)',
                    iconBg: 'var(--accent-tertiary)',
                    iconColor: '#ffffff'
                }
        }
    }

    if (insights.length === 0) {
        return null
    }

    return (
        <div className="p-6 rounded-2xl border" style={{
            background: 'rgba(245, 241, 235, 0.6)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(142, 14, 40, 0.15)',
            boxShadow: '0 8px 24px rgba(142, 14, 40, 0.08)'
        }}>
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Smart Insights
                </h3>
            </div>

            <div className="space-y-3">
                {visibleInsights.map((insight, index) => {
                    const styles = getStyles(insight.type)

                    return (
                        <div
                            key={index}
                            className="p-4 rounded-xl border transition-all duration-300 hover:translate-x-1"
                            style={{
                                backgroundColor: styles.bg,
                                borderColor: styles.border,
                                animation: 'fadeIn 0.5s ease-out'
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="p-2 rounded-lg flex-shrink-0"
                                    style={{
                                        backgroundColor: styles.iconBg,
                                        color: styles.iconColor
                                    }}
                                >
                                    {getIcon(insight.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                                        {insight.title}
                                    </h4>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        {insight.description}
                                    </p>

                                    {insight.action && (
                                        <button
                                            onClick={insight.action.onClick}
                                            className="mt-3 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:-translate-y-0.5"
                                            style={{
                                                backgroundColor: styles.iconBg,
                                                color: styles.iconColor,
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            {insight.action.label}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

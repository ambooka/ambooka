'use client'

import { Shield, Zap, Target, Layers, Lightbulb, RefreshCw } from 'lucide-react'

export default function CoreValuesWidget() {
    const values = [
        {
            icon: <Zap size={22} strokeWidth={2.5} />,
            title: "Performance First",
            description: "Systems that scale with sub-millisecond precision.",
            color: "var(--accent-primary)", // Matcha
            metric: "99.9%",
            metricLabel: "Uptime"
        },
        {
            icon: <Shield size={22} strokeWidth={2.5} />,
            title: "Security by Design",
            description: "Proactive security at every stack layer.",
            color: "var(--accent-secondary)", // Sky
            metric: "Zero",
            metricLabel: "Trust"
        },
        {
            icon: <Target size={22} strokeWidth={2.5} />,
            title: "Pragmatic ML",
            description: "Production-ready AI that solves real problems.",
            color: "var(--accent-tertiary)", // Blush
            metric: "E2E",
            metricLabel: "MLOps"
        },
        {
            icon: <Layers size={22} strokeWidth={2.5} />,
            title: "Clean Architecture",
            description: "Maintainable code that scales with the team.",
            color: "var(--text-secondary)", // Slate
            metric: "DRY",
            metricLabel: "Principle"
        },
        {
            icon: <Lightbulb size={22} strokeWidth={2.5} />,
            title: "Continuous Learning",
            description: "Always improving, always evolving.",
            color: "var(--accent-warning)", // Pastel Yellow
            metric: "1%",
            metricLabel: "Daily"
        },
        {
            icon: <RefreshCw size={22} strokeWidth={2.5} />,
            title: "Iterate & Ship",
            description: "Move fast without breaking things.",
            color: "var(--accent-success)", // Soft Teal
            metric: "CI/CD",
            metricLabel: "Always"
        }
    ]

    return (
        <div className="core-values-section">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
                <div className="flex items-center gap-3 px-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                        <Zap size={16} className="text-white" />
                    </div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">Engineering Philosophy</h3>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--border-light)] to-transparent" />
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {values.map((value, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-transparent cursor-default"
                        style={{ '--value-color': value.color } as React.CSSProperties}
                    >
                        {/* Background Glow on Hover */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: `radial-gradient(circle at top right, ${value.color}15, transparent 70%)`
                            }}
                        />

                        {/* Top Row: Icon + Metric */}
                        <div className="relative z-10 flex items-start justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                style={{
                                    backgroundColor: `${value.color}15`,
                                    borderColor: `${value.color}40`,
                                    color: value.color
                                }}
                            >
                                {value.icon}
                            </div>

                            {/* Metric Badge */}
                            <div className="text-right opacity-60 group-hover:opacity-100 transition-opacity">
                                <div className="text-lg font-black" style={{ color: value.color }}>{value.metric}</div>
                                <div className="text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">{value.metricLabel}</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            <h4 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent-primary)] group-hover:to-[var(--accent-secondary)] transition-all">
                                {value.title}
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                                {value.description}
                            </p>
                        </div>

                        {/* Bottom Accent Line */}
                        <div
                            className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-2xl"
                            style={{ backgroundColor: value.color }}
                        />

                        {/* Corner Decoration */}
                        <div
                            className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
                            style={{ backgroundColor: value.color }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

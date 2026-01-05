'use client'

import { Shield, Zap, Target } from 'lucide-react'

export default function CoreValuesWidget() {
    const values = [
        {
            icon: <Zap size={20} />,
            title: "Performance First",
            description: "Architecting systems that don't just work, but scale and respond with sub-millisecond precision.",
            color: "var(--accent-primary)"
        },
        {
            icon: <Shield size={20} />,
            title: "Security by Design",
            description: "Proactive security practices integrated into every layer of the multi-stack development lifecycle.",
            color: "var(--accent-secondary)"
        },
        {
            icon: <Target size={20} />,
            title: "Pragmatic ML",
            description: "Focusing on production-ready AI solutions that solve real business problems, not just research.",
            color: "#10b981" // Emerald
        }
    ]

    return (
        <div className="core-values-section">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[var(--border-light)]" />
                <h3 className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] px-4">Engineering Philosophy</h3>
                <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[var(--border-light)]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {values.map((value, idx) => (
                    <div key={idx} className="group relative !bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-3 md:p-4 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
                        {/* Decorative Background Icon */}
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                            {value.icon}
                        </div>

                        <div className="relative z-10">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border transition-colors duration-500"
                                style={{
                                    backgroundColor: `${value.color}10`,
                                    borderColor: `${value.color}30`,
                                    color: value.color
                                }}
                            >
                                {value.icon}
                            </div>
                            <h4 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">
                                {value.title}
                            </h4>
                            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium opacity-80 uppercase tracking-wide">
                                {value.description}
                            </p>
                        </div>

                        {/* Bottom Accent Line */}
                        <div
                            className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out"
                            style={{ backgroundColor: value.color }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

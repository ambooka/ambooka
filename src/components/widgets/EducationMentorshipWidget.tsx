'use client'

import { GraduationCap, Award, Users } from 'lucide-react'

export default function EducationMentorshipWidget() {
    const items = [
        {
            type: "Education",
            title: "Bachelor of Science in Computer Science",
            institution: "Maseno University",
            date: "2020 - 2025",
            icon: <GraduationCap size={18} />,
            color: "var(--accent-primary)"
        },
        {
            type: "Mentorship",
            title: "Technical Mentor",
            institution: "Various Communities",
            date: "2023 - Present",
            icon: <Users size={18} />,
            color: "var(--accent-secondary)"
        },
        {
            type: "Certification",
            title: "MLOps Specialization",
            institution: "DeepLearning.AI",
            date: "2024",
            icon: <Award size={18} />,
            color: "#10b981"
        }
    ]

    return (
        <div className="education-mentorship-section overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[var(--border-light)]" />
                <h3 className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] px-4">Foundation & Mentorship</h3>
                <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[var(--border-light)]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-card p-2 md:p-4 group transition-all duration-300 hover:border-[var(--accent-primary)]/30 h-full flex flex-col min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                            <div
                                className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110"
                                style={{
                                    backgroundColor: `${item.color}10`,
                                    borderColor: `${item.color}30`,
                                    color: item.color
                                }}
                            >
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60 block" style={{ color: item.color }}>{item.type}</span>
                                <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight leading-tight line-clamp-2">
                                    {item.title}
                                </h4>
                            </div>
                        </div>

                        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wide opacity-80 mb-3 flex-1">
                            {item.institution}
                        </p>

                        <div className="mt-auto">
                            <div className="inline-flex px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest shadow-sm">
                                {item.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

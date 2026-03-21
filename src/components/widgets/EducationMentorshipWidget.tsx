'use client'

import { GraduationCap, Award, Users, ExternalLink, MapPin, Calendar } from 'lucide-react'
import Image from 'next/image'

export default function EducationMentorshipWidget() {
    const items = [
        {
            type: "Education",
            title: "BSc Computer Science",
            institution: "Maseno University",
            location: "Kisumu, Kenya",
            date: "2020 - 2025",
            icon: <GraduationCap size={20} strokeWidth={2.5} />,
<<<<<<< HEAD
            color: "hsl(var(--accent))",
=======
            color: "#14b8a6",
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Maseno_University_logo.png/200px-Maseno_University_logo.png",
            description: "Computer Science fundamentals, software engineering, and research methods.",
            link: "https://www.maseno.ac.ke"
        },
        {
            type: "High School",
            title: "KCSE Graduate",
            institution: "Starehe Boys' Centre",
            location: "Nairobi, Kenya",
            date: "2015 - 2018",
            icon: <Award size={20} strokeWidth={2.5} />,
<<<<<<< HEAD
            color: "hsl(var(--destructive))",
=======
            color: "#dc2626",
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            logo: "https://stareheboyscentre.ac.ke/wp-content/uploads/2023/10/cropped-SBC-Logo-Round.png",
            description: "Leadership, academic excellence, and community service.",
            link: "https://stareheboyscentre.ac.ke"
        },
        {
            type: "Community",
            title: "Technical Mentor",
            institution: "Open Source & Developer Communities",
            location: "Remote / Kenya",
            date: "2023 - Present",
            icon: <Users size={20} strokeWidth={2.5} />,
<<<<<<< HEAD
            color: "hsl(var(--secondary))",
=======
            color: "#8b5cf6",
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            description: "Mentoring aspiring developers in Python, JavaScript, and cloud technologies.",
            active: true
        }
    ]

    return (
<<<<<<< HEAD
        <div className="w-full overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />
                <div className="flex items-center gap-3 px-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--secondary))/50] flex items-center justify-center">
                        <GraduationCap size={16} className="text-white" />
                    </div>
                    <h3 className="text-sm font-black text-[hsl(var(--foreground))] uppercase tracking-[0.2em]">Foundation & Community</h3>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[hsl(var(--border))] to-transparent" />
=======
        <div className="education-mentorship-section overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
                <div className="flex items-center gap-3 px-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center">
                        <GraduationCap size={16} className="text-white" />
                    </div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">Foundation & Community</h3>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--border-light)] to-transparent" />
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                    <div
                        key={idx}
<<<<<<< HEAD
                        className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-transparent"
=======
                        className="group relative bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-transparent"
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                    >
                        {/* Background Gradient */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
<<<<<<< HEAD
                                background: `linear-gradient(135deg, color-mix(in srgb, ${item.color} 8%, transparent) 0%, transparent 60%)`
=======
                                background: `linear-gradient(135deg, ${item.color}08 0%, transparent 60%)`
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                            }}
                        />

                        {/* Header: Logo + Type Badge */}
                        <div className="relative z-10 flex items-start justify-between mb-4">
                            {item.logo ? (
<<<<<<< HEAD
                                <div className="w-14 h-14 rounded-xl bg-white border border-[hsl(var(--border))] p-2 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
=======
                                <div className="w-14 h-14 rounded-xl bg-white border border-[var(--border-light)] p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                    <Image
                                        src={item.logo}
                                        alt={item.institution}
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div
<<<<<<< HEAD
                                    className="w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-105 shadow-sm"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                                        borderColor: `color-mix(in srgb, ${item.color} 40%, transparent)`,
=======
                                    className="w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-105"
                                    style={{
                                        backgroundColor: `${item.color}15`,
                                        borderColor: `${item.color}40`,
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                        color: item.color
                                    }}
                                >
                                    {item.icon}
                                </div>
                            )}

                            {/* Type Badge */}
                            <div
                                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                style={{
<<<<<<< HEAD
                                    backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
=======
                                    backgroundColor: `${item.color}15`,
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                    color: item.color
                                }}
                            >
                                {item.active && (
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: item.color }}></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: item.color }}></span>
                                    </span>
                                )}
                                {item.type}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 space-y-2">
<<<<<<< HEAD
                            <h4 className="text-lg font-black text-[hsl(var(--foreground))] uppercase tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[hsl(var(--foreground))] group-hover:to-current" style={{ color: item.color }}>
                                {item.title}
                            </h4>

                            <p className="text-sm font-bold text-[hsl(var(--muted-foreground))]">
=======
                            <h4 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight leading-tight">
                                {item.title}
                            </h4>

                            <p className="text-sm font-bold text-[var(--text-secondary)]">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                {item.institution}
                            </p>

                            {item.description && (
<<<<<<< HEAD
                                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed opacity-80 mt-1">
=======
                                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed opacity-80">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                    {item.description}
                                </p>
                            )}
                        </div>

                        {/* Footer: Location & Date */}
<<<<<<< HEAD
                        <div className="relative z-10 mt-5 pt-4 border-t border-[hsl(var(--border))] flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--muted-foreground))] font-medium">
                                <MapPin size={12} />
                                <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
=======
                        <div className="relative z-10 mt-4 pt-4 border-t border-[var(--border-light)] flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)] font-medium">
                                <MapPin size={12} />
                                <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-tertiary)]">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                <Calendar size={12} />
                                <span>{item.date}</span>
                            </div>
                        </div>

                        {/* External Link */}
                        {item.link && (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
<<<<<<< HEAD
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-current hover:shadow-sm"
                                style={{ color: item.color }}
=======
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-light)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                            >
                                <ExternalLink size={14} />
                            </a>
                        )}

                        {/* Bottom Accent Line */}
                        <div
                            className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-2xl"
                            style={{ backgroundColor: item.color }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

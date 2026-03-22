'use client'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
    Zap, 
    Trophy, 
    Briefcase, 
    TrendingUp, 
    Code, 
    Globe, 
    Database, 
    Brain, 
    Target,
    ArrowRight,
    Calendar,
    Clock,
    DollarSign
} from 'lucide-react'
import { ROADMAP_DATA } from '@/data/roadmap-data'
import { cn } from '@/lib/utils'

// Animation variants aligned with the rest of the app
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
} as any

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 20
        }
    }
} as any

const iconMap: Record<string, any> = {
    'phase1': Zap,
    'phase2': Globe,
    'phase3': Database,
    'phase4': Brain,
    'phase5': Trophy,
    'default': Code
}

export const SimpleCareerTimeline = () => {
    const phases = ROADMAP_DATA.phases

    return (
        <motion.div 
            className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] backdrop-blur-xl p-5 sm:p-6 shadow-sm overflow-hidden relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            {/* 1. Header Section - Blog style */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                        <Target size={22} />
                    </div>
                    <div>
                        <p className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] leading-none mb-1.5">
                            Career Roadmap
                        </p>
                        <h3 className="text-xl font-black text-[hsl(var(--foreground))] tracking-tight">
                            MLOps & AI Engineering
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]">
                    <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--foreground))]">
                        Currently: {phases[0].title.split(': ')[1]}
                    </span>
                </div>
            </div>

            {/* 2. Phases Grid - Compact Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 relative z-10">
                {phases.map((phase, idx) => {
                    const Icon = iconMap[phase.id] || iconMap.default
                    const isCurrent = idx === 0

                    return (
                        <motion.div
                            key={phase.id}
                            variants={itemVariants}
                            className={cn(
                                "group relative flex flex-col rounded-[24px] border border-[hsl(var(--border))] p-4 md:p-5 transition-all duration-300",
                                isCurrent 
                                    ? "bg-gradient-to-br from-[hsl(var(--accent))/0.08] to-transparent border-[hsl(var(--accent))/0.25] shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
                                    : "bg-[hsl(var(--card)/0.4)] hover:bg-[hsl(var(--card)/0.6)] hover:border-[hsl(var(--accent))/0.2]"
                            )}
                        >
                            {/* Decorative phase number */}
                            <span className="absolute top-4 right-5 text-4xl font-black text-[hsl(var(--foreground))] opacity-[0.03] select-none group-hover:opacity-[0.06] transition-opacity">
                                0{idx + 1}
                            </span>

                            {/* Phase Icon & Badge */}
                            <div className="mb-4 flex items-center justify-between">
                                <div className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                                    isCurrent 
                                        ? "bg-[hsl(var(--accent))] text-[hsl(var(--background))] scale-110 shadow-lg" 
                                        : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] group-hover:bg-[hsl(var(--accent))/0.1] group-hover:text-[hsl(var(--accent))]"
                                )}>
                                    <Icon size={16} />
                                </div>
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--card))]/50 border border-[hsl(var(--border))] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-tighter text-[hsl(var(--muted-foreground))]">
                                    <Clock size={10} className="text-[hsl(var(--accent))]" />
                                    {phase.duration.split(' ')[1]}
                                </div>
                            </div>

                            {/* Phase Body */}
                            <div className="flex-1">
                                <h4 className={cn(
                                    "text-sm font-black leading-tight tracking-tight mb-2 group-hover:text-[hsl(var(--accent))] transition-colors",
                                    isCurrent ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))/0.9]"
                                )}>
                                    {phase.role}
                                </h4>
                                <p className="text-[0.8rem] leading-snug text-[hsl(var(--muted-foreground))] line-clamp-2 mb-4">
                                    {phase.focus.split(', ').slice(0, 2).join(', ')}...
                                </p>
                            </div>

                            {/* Skills/Tags container */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {phase.tracks[0].skills.slice(0, 2).map((skill, sIdx) => (
                                    <span 
                                        key={sIdx} 
                                        className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[hsl(var(--muted)/0.4)] border border-[hsl(var(--border)/0.5)] text-[hsl(var(--muted-foreground))] uppercase tracking-tighter"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Deliverable Section (Footer) */}
                            <div className="mt-auto pt-4 border-t border-[hsl(var(--border)/0.5)] flex items-center justify-between gap-2">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[hsl(var(--accent))] opacity-80">Deliverable</span>
                                    <span className="text-[10px] font-bold text-[hsl(var(--foreground))] truncate italic">
                                        &quot;{phase.keyDeliverable.split(' ')[0]}...&quot;
                                    </span>
                                </div>
                                <div className={cn(
                                    "h-7 w-7 shrink-0 flex items-center justify-center rounded-full transition-all duration-300",
                                    isCurrent ? "bg-[hsl(var(--accent))] text-[hsl(var(--background))]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100"
                                )}>
                                    <ArrowRight size={12} />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* 3. Bottom Execution Summary (Similar to blog footers) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 py-4 border-t border-[hsl(var(--border)/0.5)] relative z-10">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[hsl(var(--accent))]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))]">
                        Total Path: <span className="text-[hsl(var(--foreground))]">26 Months</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-[hsl(var(--accent))]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))]">
                        Target Role: <span className="text-[hsl(var(--foreground))]">Senior AI Engineer</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-[hsl(var(--accent))]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))]">
                        Target: <span className="text-[hsl(var(--foreground))]">$180K+</span>
                    </span>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[hsl(var(--accent)/0.03)] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.02)_0%,transparent_70%)] pointer-events-none" />
        </motion.div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Briefcase, Calendar } from 'lucide-react'
import { format, differenceInMonths, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'

interface Experience {
    id: string
    company: string
    position: string
    start_date: string
    end_date: string | null
    is_current: boolean
    description: string | null
}

export default function ExperienceGanttChart() {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)
    const [viewportStart, setViewportStart] = useState(subMonths(new Date(), 60))
    const [totalMonths, setTotalMonths] = useState(60)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const { data, error } = await supabase
                    .from('experience')
                    .select('*')
                    .order('start_date', { ascending: false }) // Sort Newest First for mobile timeline

                if (error) throw error
                setExperiences(data || [])

                if (data && data.length > 0) {
                    // For Gantt view (desktop), we still want earliest first to calculate viewport
                    const chronological = [...data].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                    const earliest = startOfMonth(new Date(chronological[0].start_date))
                    const today = endOfMonth(new Date())
                    const diff = differenceInMonths(today, earliest) + 1

                    setViewportStart(earliest)
                    setTotalMonths(Math.max(diff, 12))
                }
            } catch (e) {
                console.error('Error fetching experience:', e)
            } finally {
                setLoading(false)
            }
        }

        fetchExperience()
    }, [])

    const calculateDuration = (start: string, end: string | null, isCurrent: boolean) => {
        const startDate = new Date(start)
        const endDate = isCurrent ? new Date() : (end ? new Date(end) : new Date())
        const total = differenceInMonths(endDate, startDate) + 1

        const years = Math.floor(total / 12)
        const months = total % 12

        if (years > 0) {
            return `${years} yr${years > 1 ? 's' : ''}${months > 0 ? ` ${months} mo${months > 1 ? 's' : ''}` : ''}`
        }
        return `${months} mo${months > 1 ? 's' : ''}`
    }

    const months = Array.from({ length: totalMonths }, (_, i) => addMonths(viewportStart, i))
    // Show every 6 months for a more compact view that covers more years
    const tickInterval = totalMonths > 60 ? 12 : 6

    const getPosition = (dateStr: string) => {
        const date = new Date(dateStr)
        const diff = differenceInMonths(date, viewportStart)
        return (diff / totalMonths) * 100
    }

    const getWidth = (start: string, end: string | null, isCurrent: boolean) => {
        const startDate = new Date(start)
        const endDate = isCurrent ? new Date() : (end ? new Date(end) : new Date())
        const diff = differenceInMonths(endDate, startDate) + 1
        const calculatedWidth = (diff / totalMonths) * 100
        return Math.max(calculatedWidth, 10)
    }

    if (loading) return <div className="glass-card p-12 animate-pulse text-center text-[var(--text-secondary)] font-bold">Initializing Roadmap...</div>

    return (
        <div className="neo-gantt-widget glass-card">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-sm">
                        <Briefcase size={14} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[var(--text-primary)] tracking-tight uppercase">Experience Roadmap</h2>
                        <p className="text-[7px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest mt-0.5">Career Progression & Milestones</p>
                    </div>
                </div>
                {!isMobile && (
                    <div className="px-2 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-tighter">
                        {format(viewportStart, 'MMM yyyy')} — {format(new Date(), 'MMM yyyy')}
                    </div>
                )}
            </div>

            {isMobile ? (
                /* Mobile Vertical Timeline */
                <div className="relative pl-6 space-y-4 md:space-y-8 py-4">
                    {/* Vertical Thread */}
                    <div className="absolute left-[11px] top-6 bottom-4 w-0.5 bg-gradient-to-b from-[var(--accent-primary)] via-[var(--border-light)]/50 to-transparent" />

                    {experiences.map((exp, idx) => {
                        const isCurrent = exp.is_current
                        const initials = exp.company.split(' ').map(n => n[0]).join('').substring(0, 2)
                        const duration = calculateDuration(exp.start_date, exp.end_date, exp.is_current)

                        return (
                            <div key={exp.id} className="relative group">
                                {/* Dot Marker */}
                                <div className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300
                                    ${isCurrent
                                        ? 'bg-[var(--accent-primary)] border-white text-white shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                                        : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-primary)]'}`}>
                                    <span className="text-[8px] font-black uppercase">{initials}</span>
                                </div>

                                {/* Content Card */}
                                <div className={`p-3 md:p-4 rounded-xl border transition-all duration-300
                                    ${isCurrent
                                        ? 'bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/50 border-[var(--accent-primary)]/30 shadow-sm'
                                        : 'bg-[var(--bg-tertiary)]/30 border-[var(--border-light)]/50'}`}>

                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-xs font-black uppercase tracking-tight truncate 
                                                ${isCurrent ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                                                {exp.position}
                                            </h3>
                                            <p className="text-[10px] font-bold text-[var(--text-secondary)] mt-0.5">
                                                @ {exp.company}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter
                                            ${isCurrent ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)]'}`}>
                                            {duration}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide">
                                        <Calendar size={10} className="text-[var(--accent-secondary)]" />
                                        <span>
                                            {format(new Date(exp.start_date), 'MMM yyyy')} — {exp.is_current ? 'Present' : (exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : '')}
                                        </span>
                                    </div>

                                    {exp.description && (
                                        <p className="mt-3 text-[10px] leading-relaxed text-[var(--text-secondary)] font-light">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                /* Desktop Gantt Chart */
                <div className="relative">
                    {/* Timeline Header - Dual Level: Years + Months */}
                    <div className="border-b border-[var(--border-light)]/50 pb-2 mb-2">
                        {/* Years Row */}
                        <div className="flex mb-1">
                            {(() => {
                                const years: { year: number; startIdx: number; span: number }[] = []
                                let currentYear = -1
                                months.forEach((month, i) => {
                                    const year = month.getFullYear()
                                    if (year !== currentYear) {
                                        if (currentYear !== -1) {
                                            years[years.length - 1].span = i - years[years.length - 1].startIdx
                                        }
                                        years.push({ year, startIdx: i, span: 0 })
                                        currentYear = year
                                    }
                                })
                                if (years.length > 0) {
                                    years[years.length - 1].span = totalMonths - years[years.length - 1].startIdx
                                }
                                return years.map((y, i) => (
                                    <div
                                        key={i}
                                        className="text-[10px] font-black text-[var(--text-primary)] text-center border-l border-[var(--border-light)]/30 first:border-l-0"
                                        style={{ flex: y.span }}
                                    >
                                        {y.year}
                                    </div>
                                ))
                            })()}
                        </div>
                        {/* Months Row */}
                        <div className="flex">
                            {months.map((month, i) => (
                                <div key={i} className="flex-1 text-[7px] text-[var(--text-tertiary)] font-bold text-center">
                                    {format(month, 'MMM')[0]}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="relative pt-6 pb-2">
                        {/* Vertical Grid Lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {months.filter((_, i) => i % tickInterval === 0).map((_, i) => (
                                <div key={i} className="flex-1 border-l border-[var(--border-light)]/30 h-full" />
                            ))}
                            <div className="border-l border-[var(--border-light)]/30 h-full" />
                        </div>

                        {/* Today Marker */}
                        <div
                            className="absolute top-0 bottom-0 border-l-2 border-[var(--accent-primary)] z-20 pointer-events-none opacity-50"
                            style={{ left: `${getPosition(new Date().toISOString())}%` }}
                        >
                            <div className="bg-[var(--accent-primary)] text-white text-[7px] font-bold px-1 py-0.5 rounded absolute -top-1 -translate-x-1/2">TODAY</div>
                        </div>

                        {/* Bars - use chronological sorted bars for Gantt view */}
                        <div className="relative z-10 space-y-4">
                            {[...experiences].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()).map((exp, idx) => {
                                const left = getPosition(exp.start_date)
                                const width = getWidth(exp.start_date, exp.end_date, exp.is_current)
                                const isCurrent = exp.is_current
                                const initials = exp.company.split(' ').map(n => n[0]).join('').substring(0, 2)

                                // Ensure bar doesn't overflow the viewport
                                const adjustedLeft = Math.max(0, Math.min(left, 97))
                                const maxWidth = 100 - adjustedLeft
                                const adjustedWidth = Math.min(width, maxWidth)

                                return (
                                    <div key={exp.id} className="gantt-row group relative h-10">
                                        <div
                                            className={`absolute h-full rounded-full flex items-center px-4 transition-all duration-700 cursor-default overflow-hidden
                                                ${isCurrent
                                                    ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_4px_15px_rgba(20,184,166,0.3)]'
                                                    : (idx % 2 === 0 ? 'bg-[var(--bg-tertiary)] border border-[var(--border-light)]' : 'bg-white/5 border border-[var(--border-light)] opacity-80')}`}
                                            style={{
                                                left: `${adjustedLeft}%`,
                                                width: `${adjustedWidth}%`,
                                            }}
                                        >
                                            <div className="flex items-center gap-3 w-full overflow-hidden">
                                                <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black
                                                    ${isCurrent ? 'bg-[var(--bg-primary)] text-[var(--accent-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <span className={`text-[10px] font-black uppercase tracking-tight truncate 
                                                            ${isCurrent ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                                                            {exp.position}
                                                        </span>
                                                        <span className={`text-[8px] font-bold opacity-60
                                                            ${isCurrent ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                                                            @ {exp.company}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[8px] font-black whitespace-nowrap ml-2
                                                        ${isCurrent ? 'text-white/80' : 'text-[var(--text-tertiary)]'}`}>
                                                        {format(new Date(exp.start_date), 'MMM yy')} — {exp.is_current ? 'Present' : (exp.end_date ? format(new Date(exp.end_date), 'MMM yy') : '')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Stripes for current role */}
                                            {isCurrent && (
                                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[length:20px_20px]"
                                                    style={{ backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 50%, white 50%, white 75%, transparent 75%, transparent)' }}>
                                                </div>
                                            )}
                                        </div>

                                        {/* Fallback Label if bar is too short to display content */}
                                        {adjustedWidth < 20 && (
                                            <div
                                                className="absolute top-0 bottom-0 flex items-center pl-2 pointer-events-none z-20"
                                                style={{ left: `${adjustedLeft + adjustedWidth}%` }}
                                            >
                                                <div className="flex items-center gap-2 bg-[var(--bg-secondary)]/90 backdrop-blur-sm px-2 py-1 rounded-full border border-[var(--border-light)] shadow-sm">
                                                    <span className="text-[9px] font-black text-[var(--text-primary)] uppercase whitespace-nowrap">
                                                        {exp.position}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-[var(--text-tertiary)] whitespace-nowrap">
                                                        {format(new Date(exp.start_date), 'MMM yy')} — {exp.is_current ? 'Now' : (exp.end_date ? format(new Date(exp.end_date), 'MMM yy') : '')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .neo-gantt-widget {
                    padding: 24px;
                }
                .gantt-row {
                    perspective: 1000px;
                }
                .gantt-row:hover .absolute {
                    transform: scale(1.01) translateZ(10px);
                    z-index: 30;
                }
                @media (max-width: 768px) {
                    .neo-gantt-widget {
                        padding: 16px;
                        border-radius: 16px;
                    }
                }
            `}</style>
        </div>
    )
}

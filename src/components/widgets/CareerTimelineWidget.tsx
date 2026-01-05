'use client'

import { useState, useEffect } from 'react'
import { Target, Award, Check } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface RoadmapPhase {
    id: string
    phase_number: number
    title: string
    duration_months: number
    experience_label: string | null
    start_date_label: string | null
    target_role: string | null
    status: 'completed' | 'in_progress' | 'upcoming'
    icons: string[] // icon URLs for technologies
}

interface Certification {
    id: string
    name: string
    phase_number: number
    is_obtained: boolean
}

const CAREER_START_DATE = new Date('2023-01-01')

export default function CareerTimelineWidget() {
    const [phases, setPhases] = useState<RoadmapPhase[]>([])
    const [certs, setCerts] = useState<Certification[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 1000 * 60 * 60 * 24) // Update daily
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Roadmap Phases
                const { data: phasesData, error: phasesError } = await (supabase as any)
                    .from('roadmap_phases')
                    .select('*')
                    .order('phase_number')

                if (phasesError) throw phasesError

                // 2. Fetch Certifications
                const { data: certsData, error: certsError } = await (supabase as any)
                    .from('certifications')
                    .select('*')

                if (certsError) throw certsError

                // 3. Fetch Skills with icons from DB
                const { data: skillsData, error: skillsError } = await supabase
                    .from('skills')
                    .select('icon_url, roadmap_phase')
                    .not('icon_url', 'is', null)
                    .order('display_order')

                if (skillsError) throw skillsError

                // Group icons by phase (Deduplicated)
                const iconMap: Record<number, string[]> = {}
                skillsData?.forEach(skill => {
                    const phaseNum = skill.roadmap_phase
                    if (phaseNum && (skill as any).icon_url) {
                        if (!iconMap[phaseNum]) iconMap[phaseNum] = []
                        if (!iconMap[phaseNum].includes((skill as any).icon_url)) {
                            iconMap[phaseNum].push((skill as any).icon_url)
                        }
                    }
                })

                // Use DB icons exclusively
                const finalPhases = (phasesData as any[]).map(phase => ({
                    ...phase,
                    id: String(phase.phase_number),
                    icons: iconMap[phase.phase_number] || []
                }))

                setPhases(finalPhases as RoadmapPhase[])
                setCerts(certsData as Certification[])

                // Optional: Fetch actual roadmap metadata if API exists
                const res = await fetch('/api/roadmap')
                if (res.ok) {
                    const apiData = await res.json()
                    if (apiData.phases?.length) {
                        const mergedPhases = apiData.phases.map((p: any) => ({
                            ...p,
                            icons: iconMap[p.phase_number] || []
                        }))
                        setPhases(mergedPhases)
                    }
                    if (apiData.certifications?.length) setCerts(apiData.certifications)
                }
            } catch (err) {
                console.error('Error fetching roadmap data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const calculateYOE = (date: Date) => {
        const diff = date.getTime() - CAREER_START_DATE.getTime()
        return (diff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
    }

    const currentYOE = calculateYOE(currentDate)
    const completedCount = phases.filter(p => p.status === 'completed').length
    const progress = phases.length > 0 ? Math.round((completedCount / phases.length) * 100) : 0

    if (loading) {
        return (
            <div className={`roadmap-widget !bg-[var(--bg-secondary)] !border-[var(--border-color)] !rounded-[var(--radius-xl)] !shadow-card p-4 md:p-8`}>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Target size={40} className="animate-spin text-[var(--accent-primary)]" />
                    <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">Mapping Growth Trajectory...</p>
                </div>
            </div>
        )
    }

    if (phases.length === 0) return null

    return (
        <div className={`roadmap-widget !bg-[var(--bg-secondary)] !border-[var(--border-color)] !rounded-[var(--radius-xl)] !shadow-card p-4 md:p-8`}>
            {/* Header */}
            <div className="roadmap-header">
                <div className="roadmap-title">
                    <Target size={16} />
                    <div className="title-stack">
                        <span>Career Roadmap</span>
                        <span className="current-yoe">{currentYOE} Total YOE</span>
                    </div>
                </div>
                <div className="roadmap-progress">
                    <span className="progress-num !text-[var(--accent-primary)] !font-black !text-sm">{progress}%</span>
                </div>
            </div>

            {/* Timeline */}
            <div className="roadmap-timeline-list">
                {phases.map((phase, idx) => {
                    const phaseCerts = certs.filter(c => c.phase_number === phase.phase_number)
                    const isLast = idx === phases.length - 1

                    return (
                        <div key={phase.id} className={`roadmap-item ${phase.status}`}>
                            {/* Track */}
                            <div className="item-track">
                                <div className={`track-dot ${phase.status}`}>
                                    {phase.status === 'completed' && <Check size={10} strokeWidth={3} />}
                                    {phase.status === 'in_progress' && <div className="dot-pulse" />}
                                </div>
                                {!isLast && <div className={`track-line ${phase.status}`} />}
                            </div>

                            {/* Content */}
                            <div className="item-content">
                                <div className="item-header">
                                    <span className="item-title">{phase.title}</span>
                                    <div className="item-duration">
                                        <span className="dur-mo">{phase.experience_label || '0 Yrs Exp'}</span>
                                        <span className="dur-yr">{phase.start_date_label || ''}</span>
                                    </div>
                                </div>


                                {/* Tech Icons */}
                                <div className="item-icons">
                                    {phase.icons.map((icon, i) => (
                                        <img key={i} src={icon} alt="" className="tech-icon" title={icon.split('/').pop()?.split('?')[0]} />
                                    ))}
                                </div>

                                {/* Certs */}
                                {phaseCerts.length > 0 && (
                                    <div className="item-certs">
                                        <Award size={10} />
                                        {phaseCerts.map(c => (
                                            <span key={c.id} className="cert-tag">{c.name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

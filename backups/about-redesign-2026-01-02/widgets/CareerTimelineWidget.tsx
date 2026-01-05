'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ChevronRight, Award, Target, Clock } from 'lucide-react'

interface RoadmapPhase {
    id: string
    phase_number: number
    title: string
    duration_months: number
    target_role: string | null
    status: 'completed' | 'in_progress' | 'upcoming'
}

interface Certification {
    id: string
    name: string
    issuer: string
    phase_number: number
    is_obtained: boolean
}

const FALLBACK_PHASES: RoadmapPhase[] = [
    { id: '1', phase_number: 1, title: 'Software Engineering', duration_months: 5, target_role: 'Full-Stack Dev', status: 'completed' },
    { id: '2', phase_number: 2, title: 'Mobile + Full-Stack', duration_months: 5, target_role: 'Senior Full-Stack', status: 'completed' },
    { id: '3', phase_number: 3, title: 'Cloud & DevOps', duration_months: 6, target_role: 'DevOps Engineer', status: 'in_progress' },
    { id: '4', phase_number: 4, title: 'Data Engineering', duration_months: 4, target_role: 'Data Engineer', status: 'upcoming' },
    { id: '5', phase_number: 5, title: 'Kubernetes & Platform', duration_months: 6, target_role: 'Platform Engineer', status: 'upcoming' },
    { id: '6', phase_number: 6, title: 'Machine Learning', duration_months: 6, target_role: 'ML Engineer', status: 'upcoming' },
    { id: '7', phase_number: 7, title: 'LLMOps', duration_months: 3, target_role: null, status: 'upcoming' },
    { id: '8', phase_number: 8, title: 'MLOps Systems', duration_months: 5, target_role: 'MLOps Engineer', status: 'upcoming' },
]

const FALLBACK_CERTS: Certification[] = [
    { id: 'c1', name: 'AWS SAA', issuer: 'Amazon', phase_number: 3, is_obtained: false },
    { id: 'c2', name: 'CKA', issuer: 'CNCF', phase_number: 5, is_obtained: false },
    { id: 'c3', name: 'Terraform', issuer: 'HashiCorp', phase_number: 3, is_obtained: false },
]

export default function CareerTimelineWidget() {
    const [phases, setPhases] = useState<RoadmapPhase[]>(FALLBACK_PHASES)
    const [certs, setCerts] = useState<Certification[]>(FALLBACK_CERTS)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/roadmap')
                if (res.ok) {
                    const data = await res.json()
                    if (data.phases?.length) setPhases(data.phases)
                    if (data.certifications?.length) setCerts(data.certifications)
                }
            } catch {
                // Use fallback
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const currentPhase = phases.find(p => p.status === 'in_progress')
    const completedCount = phases.filter(p => p.status === 'completed').length
    const totalMonths = phases.reduce((acc, p) => acc + p.duration_months, 0)
    const completedMonths = phases.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.duration_months, 0)
    const progress = Math.round((completedCount / phases.length) * 100)

    if (loading) {
        return (
            <div className="career-timeline-widget">
                <div className="timeline-loading">Loading roadmap...</div>
            </div>
        )
    }

    return (
        <div className="career-timeline-widget">
            {/* Header */}
            <div className="timeline-header">
                <div className="timeline-title">
                    <Target size={18} />
                    <span>Career Roadmap</span>
                </div>
                <div className="progress-badge">
                    <span className="progress-percent">{progress}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="timeline-progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
                <div className="progress-markers">
                    {phases.map((phase, idx) => (
                        <div
                            key={phase.id}
                            className={`progress-marker ${phase.status}`}
                            style={{ left: `${(idx / (phases.length - 1)) * 100}%` }}
                        >
                            {phase.status === 'completed' && <CheckCircle2 size={14} />}
                            {phase.status === 'in_progress' && <div className="pulse-dot" />}
                            {phase.status === 'upcoming' && <Circle size={12} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Phase Labels */}
            <div className="phase-labels">
                <span>Start</span>
                <span>MLOps Engineer</span>
            </div>

            {/* Current Phase Highlight */}
            {currentPhase && (
                <div className="current-phase-box">
                    <div className="current-badge">NOW</div>
                    <div className="current-info">
                        <div className="current-title">
                            Phase {currentPhase.phase_number}: {currentPhase.title}
                        </div>
                        {currentPhase.target_role && (
                            <div className="current-target">
                                <ChevronRight size={12} />
                                Next Role: {currentPhase.target_role}
                            </div>
                        )}
                    </div>
                    <div className="current-duration">
                        <Clock size={12} />
                        {currentPhase.duration_months}mo
                    </div>
                </div>
            )}

            {/* Phases Grid */}
            <div className="phases-grid">
                {phases.map(phase => {
                    const hasCert = certs.some(c => c.phase_number === phase.phase_number)
                    return (
                        <div key={phase.id} className={`phase-card ${phase.status}`}>
                            <div className="phase-number">{phase.phase_number}</div>
                            <div className="phase-content">
                                <div className="phase-name">{phase.title}</div>
                                <div className="phase-meta">
                                    <span>{phase.duration_months}mo</span>
                                    {hasCert && <Award size={10} className="cert-icon" />}
                                </div>
                            </div>
                            {phase.status === 'completed' && (
                                <CheckCircle2 size={14} className="status-icon completed" />
                            )}
                            {phase.status === 'in_progress' && (
                                <div className="status-icon in-progress">
                                    <div className="mini-pulse" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Certifications */}
            {certs.length > 0 && (
                <div className="certs-row">
                    <Award size={12} className="certs-icon" />
                    <span className="certs-label">Certs:</span>
                    {certs.map(cert => (
                        <span key={cert.id} className={`cert-tag ${cert.is_obtained ? 'obtained' : ''}`}>
                            {cert.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { Target, Award, Check, Zap, Lock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import Image from 'next/image'
<<<<<<< HEAD
import { cn } from '@/lib/utils'
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

interface RoadmapPhase {
  id: string
  phase_number: number
  title: string
  duration_months: number
  experience_label: string | null
  start_date_label: string | null
  target_role: string | null
  status: 'completed' | 'in_progress' | 'upcoming'
  icons: string[]
}

interface Certification {
  id: string
  name: string
  phase_number: number
  is_obtained: boolean
}

// Phase colour accents
const PHASE_COLORS: Record<number, { accent: string; dim: string; text: string }> = {
  1: { accent: '#14b8a6', dim: 'rgba(20,184,166,0.12)', text: '#0d9488' },
  2: { accent: '#3b82f6', dim: 'rgba(59,130,246,0.12)', text: '#2563eb' },
  3: { accent: '#8b5cf6', dim: 'rgba(139,92,246,0.12)', text: '#7c3aed' },
  4: { accent: '#f59e0b', dim: 'rgba(245,158,11,0.12)', text: '#d97706' },
  5: { accent: '#ec4899', dim: 'rgba(236,72,153,0.12)', text: '#db2777' },
}

// Nexus milestone label per phase
const PHASE_MILESTONE: Record<number, string> = {
  1: 'Nexus v0.1 — Toolbox',
  2: 'Nexus v0.2 — Platform',
  3: 'Nexus v0.3 — ML Layer',
  4: 'Nexus v0.4 — AI Platform',
  5: 'Nexus v1.0 — Complete',
}

// Weeks per phase
const PHASE_WEEKS: Record<number, string> = {
  1: 'Wks 1–16',
  2: 'Wks 17–44',
  3: 'Wks 45–68',
  4: 'Wks 69–92',
  5: 'Wks 93–104',
}

// Static fallback phases if DB is empty
const FALLBACK_PHASES: RoadmapPhase[] = [
  { id:'1', phase_number:1, title:'Foundations & Tooling', duration_months:4, experience_label:'3 Yrs Exp', start_date_label:'Month 1–4', target_role:'Software Engineer', status:'in_progress', icons:[] },
  { id:'2', phase_number:2, title:'Web Eng. & Cloud', duration_months:7, experience_label:'', start_date_label:'Month 5–11', target_role:'Full-Stack Engineer', status:'upcoming', icons:[] },
  { id:'3', phase_number:3, title:'Data Science & ML', duration_months:6, experience_label:'', start_date_label:'Month 12–17', target_role:'ML Engineer I', status:'upcoming', icons:[] },
  { id:'4', phase_number:4, title:'AI Engineering & MLOps', duration_months:6, experience_label:'', start_date_label:'Month 18–23', target_role:'AI/ML Engineer', status:'upcoming', icons:[] },
  { id:'5', phase_number:5, title:'Agentic AI', duration_months:3, experience_label:'', start_date_label:'Month 24–26', target_role:'Senior AI Engineer', status:'upcoming', icons:[] },
]

export default function CareerTimelineWidget() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        type DBPhase = {
          phase_number: number; title: string; duration_months: number;
          experience_label: string | null; start_date_label: string | null;
          target_role: string | null; status: 'completed' | 'in_progress' | 'upcoming'
        }
        type DBCert = { id: string; name: string; phase_number: number; is_obtained: boolean }
        type DBSkill = { icon_url: string | null; roadmap_phase: number | null }

        const [phasesRes, certsRes, skillsRes] = await Promise.all([
          (supabase as unknown as { from:(t:string)=>{ select:(c:string)=>{ order:(o:string)=>Promise<{data:DBPhase[]|null}> } } })
            .from('roadmap_phases').select('*').order('phase_number'),
          (supabase as unknown as { from:(t:string)=>{ select:(c:string)=>Promise<{data:DBCert[]|null}> } })
            .from('certifications').select('*'),
          supabase.from('skills').select('icon_url, roadmap_phase').not('icon_url','is',null).order('display_order'),
        ])

        const iconMap: Record<number, string[]> = {}
        ;(skillsRes.data as unknown as DBSkill[] | null)?.forEach(s => {
          if (s.roadmap_phase && s.icon_url) {
            if (!iconMap[s.roadmap_phase]) iconMap[s.roadmap_phase] = []
            if (!iconMap[s.roadmap_phase].includes(s.icon_url)) iconMap[s.roadmap_phase].push(s.icon_url)
          }
        })

        const finalPhases = ((phasesRes.data ?? []) as DBPhase[]).map(p => ({
          ...p, id: String(p.phase_number), icons: (iconMap[p.phase_number] || []).slice(0, 4),
        })) as RoadmapPhase[]

        setPhases(finalPhases.length ? finalPhases : FALLBACK_PHASES)
        setCerts((certsRes.data ?? []) as unknown as Certification[])
      } catch {
        setPhases(FALLBACK_PHASES)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const completedCount = phases.filter(p => p.status === 'completed').length
  const inProgressPhase = phases.find(p => p.status === 'in_progress')
  const totalWeeks = 104
  const completedWeeks = completedCount === 0 && inProgressPhase ? 1 : completedCount * 20 // approximate
  const progressPct = Math.min(Math.round((completedWeeks / totalWeeks) * 100), 99)

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm min-h-[300px] items-center justify-center">
        <Target size={32} className="animate-spin text-[hsl(var(--accent))]" />
=======
      <div className="nexus-timeline-widget">
        <div className="nexus-tl-loading">
          <Target size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[0.72rem] font-[800] tracking-widest uppercase text-[hsl(var(--foreground))]">
          <Target size={14} className="text-[hsl(var(--accent))]" />
          <span>Nexus Roadmap</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.62rem] font-[600] whitespace-nowrap text-[hsl(var(--muted-foreground))]">
            104 weeks
          </span>
          <div className="w-[60px] h-[5px] rounded-full overflow-hidden bg-[hsl(var(--muted))]">
            <div
              className="h-full min-w-[4px] rounded-full bg-[hsl(var(--accent))] transition-all duration-700 ease-out"
=======
    <div className="nexus-timeline-widget">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="nexus-tl-header">
        <div className="nexus-tl-title">
          <Target size={14} />
          <span>Nexus Roadmap</span>
        </div>
        <div className="nexus-tl-meta">
          <span className="nexus-tl-weeks">104 weeks</span>
          <div className="nexus-tl-progress-pill">
            <div
              className="nexus-tl-progress-fill"
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Phase list ─────────────────────────────────────────── */}
<<<<<<< HEAD
      <div className="flex overflow-x-auto pb-4 pt-2 gap-4 snap-x max-w-full scrollbar-thin scrollbar-thumb-[hsl(var(--border))] scrollbar-track-transparent">
=======
      <div className="nexus-tl-phases">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        {phases.map((phase, idx) => {
          const col = PHASE_COLORS[phase.phase_number] ?? PHASE_COLORS[1]
          const isLast = idx === phases.length - 1
          const phaseCerts = certs.filter(c => c.phase_number === phase.phase_number)
          const obtainedCerts = phaseCerts.filter(c => c.is_obtained)
<<<<<<< HEAD
          const isUpcoming = phase.status === 'upcoming'

          return (
            <div key={phase.id} className="flex flex-col gap-3 shrink-0 w-[280px] sm:w-[320px] snap-center relative">
              {/* horizontal connector track */}
              <div className="flex items-center relative h-[22px]">
                <div
                  className="flex items-center justify-center shrink-0 w-[22px] h-[22px] rounded-full border-[1.5px] border-[hsl(var(--border))] bg-[hsl(var(--muted))] z-10 transition-all duration-300"
                  style={!isUpcoming ? { background: col.accent, boxShadow: `0 0 0 3px ${col.dim}`, borderColor: 'transparent' } : {}}
                >
                  {phase.status === 'completed' && <Check size={10} strokeWidth={3} className="text-white" />}
                  {phase.status === 'in_progress' && <Zap size={10} className="text-white dark:text-black" />}
                  {phase.status === 'upcoming' && <Lock size={9} className="text-[hsl(var(--muted-foreground))]" />}
                </div>
                {!isLast && (
                  <div
                    className="absolute top-1/2 left-[22px] right-[-1rem] h-[2px] -translate-y-1/2 rounded-sm bg-[hsl(var(--border))] transition-colors duration-300"
=======

          return (
            <div key={phase.id} className={`nexus-tl-item ${phase.status}`}>

              {/* connector track */}
              <div className="nexus-tl-track">
                <div
                  className="nexus-tl-dot"
                  style={phase.status !== 'upcoming' ? { background: col.accent, boxShadow: `0 0 0 3px ${col.dim}` } : {}}
                >
                  {phase.status === 'completed' && <Check size={9} strokeWidth={3} color="#fff" />}
                  {phase.status === 'in_progress' && (
                    <Zap size={9} color={col.text} />
                  )}
                  {phase.status === 'upcoming' && (
                    <Lock size={8} color="var(--text-tertiary)" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className="nexus-tl-line"
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                    style={phase.status === 'completed' ? { background: col.accent } : {}}
                  />
                )}
              </div>

              {/* content card */}
              <div
<<<<<<< HEAD
                className={cn(
                  "flex-1 min-w-0 flex flex-col p-4 rounded-xl border border-[hsl(var(--border))] bg-white/40 dark:bg-black/20 backdrop-blur-sm transition-all duration-300 shadow-sm",
                  isUpcoming && "opacity-60"
                )}
                style={phase.status === 'in_progress' ? { borderColor: col.accent, background: col.dim } : {}}
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className="text-[0.65rem] font-[900] tracking-wider shrink-0 pt-0.5"
                      style={{ color: !isUpcoming ? col.accent : 'currentColor' }}
                    >
                      P{phase.phase_number}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[0.75rem] font-bold leading-tight text-[hsl(var(--foreground))]">
                        {phase.title}
                      </span>
                      {phase.target_role && (
                        <span className="text-[0.62rem] text-[hsl(var(--muted-foreground))] mt-0.5">
                          {phase.target_role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {phase.status === 'in_progress' && (
                      <span 
                        className="px-1.5 py-[1px] rounded-full text-[0.55rem] font-[900] tracking-wider text-white dark:text-black"
                        style={{ background: col.accent }}
                      >
                        NOW
                      </span>
                    )}
                    <span className="text-[0.58rem] font-[600] whitespace-nowrap text-[hsl(var(--muted-foreground))]">
=======
                className="nexus-tl-card"
                style={phase.status === 'in_progress' ? {
                  borderColor: col.accent,
                  background: col.dim,
                } : {}}
              >
                {/* top row */}
                <div className="nexus-tl-card-top">
                  <div className="nexus-tl-card-left">
                    <span
                      className="nexus-tl-phase-num"
                      style={{ color: phase.status !== 'upcoming' ? col.text : 'var(--text-tertiary)' }}
                    >
                      P{phase.phase_number}
                    </span>
                    <div>
                      <span className="nexus-tl-phase-title">{phase.title}</span>
                      <span className="nexus-tl-phase-role">{phase.target_role ?? ''}</span>
                    </div>
                  </div>
                  <div className="nexus-tl-card-right">
                    {phase.status === 'in_progress' && (
                      <span className="nexus-tl-active-badge" style={{ background: col.accent }}>
                        NOW
                      </span>
                    )}
                    <span className="nexus-tl-weeks-badge">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                      {PHASE_WEEKS[phase.phase_number]}
                    </span>
                  </div>
                </div>

                {/* milestone label */}
<<<<<<< HEAD
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[0.65rem] shrink-0">🏗</span>
                  <span className="text-[0.63rem] font-[600] text-[hsl(var(--muted-foreground))]">
                    {PHASE_MILESTONE[phase.phase_number]}
                  </span>
=======
                <div className="nexus-tl-milestone">
                  <span className="nexus-tl-milestone-label">🏗</span>
                  <span className="nexus-tl-milestone-text">{PHASE_MILESTONE[phase.phase_number]}</span>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                </div>

                {/* tech icons row */}
                {phase.icons.length > 0 && (
<<<<<<< HEAD
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {phase.icons.map((icon, i) => (
                      <Image key={i} src={icon} alt="" width={16} height={16} className="w-4 h-4 object-contain opacity-80" unoptimized />
=======
                  <div className="nexus-tl-icons">
                    {phase.icons.map((icon, i) => (
                      <Image key={i} src={icon} alt="" width={16} height={16} className="nexus-tl-icon" unoptimized />
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                    ))}
                  </div>
                )}

                {/* obtained certs for this phase */}
                {obtainedCerts.length > 0 && (
<<<<<<< HEAD
                  <div className="flex flex-wrap items-center gap-1 pt-1.5 mt-1 border-t border-[hsl(var(--border))]">
                    <Award size={10} className="text-green-600 dark:text-green-500 shrink-0" />
                    {obtainedCerts.map(c => (
                      <span key={c.id} className="px-1.5 py-[1px] rounded-full border border-green-600/20 bg-green-600/10 text-green-600 dark:text-green-500 text-[0.6rem] font-bold whitespace-nowrap">
                        {c.name.length > 28 ? c.name.slice(0, 26) + '…' : c.name}
                      </span>
=======
                  <div className="nexus-tl-certs">
                    <Award size={9} style={{ color: '#16a34a', flexShrink: 0 }} />
                    {obtainedCerts.map(c => (
                      <span key={c.id} className="nexus-tl-cert-tag">{c.name.length > 28 ? c.name.slice(0, 26) + '…' : c.name}</span>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
<<<<<<< HEAD
      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-[hsl(var(--border))]">
        <span className="text-[0.62rem] font-[500] text-[hsl(var(--muted-foreground))]">
          26 months · CS graduate → AI/ML Engineer
        </span>
        <a
          href="https://ambooka.dev"
          className="text-[0.65rem] font-bold text-[hsl(var(--accent))] no-underline transition-opacity hover:opacity-70"
=======
      <div className="nexus-tl-footer">
        <span className="nexus-tl-footer-text">26 months · CS graduate → AI/ML Engineer</span>
        <a
          href="https://ambooka.dev"
          className="nexus-tl-footer-link"
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        >
          ambooka.dev →
        </a>
      </div>
<<<<<<< HEAD
=======

      <style jsx>{`
        .nexus-timeline-widget {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .nexus-tl-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        /* Header */
        .nexus-tl-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .nexus-tl-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-primary);
        }

        .nexus-tl-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nexus-tl-weeks {
          font-size: 0.62rem;
          color: var(--text-tertiary);
          font-weight: 600;
          white-space: nowrap;
        }

        .nexus-tl-progress-pill {
          width: 60px;
          height: 5px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .nexus-tl-progress-fill {
          height: 100%;
          background: var(--accent-primary);
          border-radius: 3px;
          transition: width 0.6s ease;
          min-width: 4px;
        }

        /* Phase list */
        .nexus-tl-phases {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .nexus-tl-item {
          display: flex;
          gap: 12px;
        }

        /* Track */
        .nexus-tl-track {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          padding-top: 3px;
        }

        .nexus-tl-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 1.5px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .nexus-tl-line {
          width: 2px;
          flex: 1;
          min-height: 12px;
          background: var(--border-light);
          margin: 3px 0;
          border-radius: 1px;
          transition: background 0.3s ease;
        }

        /* Card */
        .nexus-tl-card {
          flex: 1;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 8px;
          transition: border-color 0.3s ease, background 0.3s ease;
          min-width: 0;
        }

        .nexus-tl-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }

        .nexus-tl-card-left {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          min-width: 0;
        }

        .nexus-tl-phase-num {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.03em;
          flex-shrink: 0;
          padding-top: 1px;
        }

        .nexus-tl-phase-title {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .nexus-tl-phase-role {
          display: block;
          font-size: 0.62rem;
          color: var(--text-tertiary);
          margin-top: 1px;
        }

        .nexus-tl-card-right {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }

        .nexus-tl-active-badge {
          padding: 1px 6px;
          border-radius: 20px;
          font-size: 0.55rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: 0.08em;
        }

        .nexus-tl-weeks-badge {
          font-size: 0.58rem;
          color: var(--text-tertiary);
          font-weight: 600;
          white-space: nowrap;
        }

        .nexus-tl-milestone {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 5px;
        }

        .nexus-tl-milestone-label {
          font-size: 0.65rem;
          flex-shrink: 0;
        }

        .nexus-tl-milestone-text {
          font-size: 0.63rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .nexus-tl-icons {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-bottom: 5px;
        }

        .nexus-tl-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
          opacity: 0.8;
        }

        .nexus-tl-certs {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          padding-top: 5px;
          border-top: 1px solid var(--border-light);
          margin-top: 4px;
        }

        .nexus-tl-cert-tag {
          font-size: 0.6rem;
          padding: 1px 6px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          border-radius: 20px;
          font-weight: 700;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }

        /* Upcoming dim */
        .nexus-tl-item.upcoming .nexus-tl-card {
          opacity: 0.55;
        }

        /* Footer */
        .nexus-tl-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-light);
        }

        .nexus-tl-footer-text {
          font-size: 0.62rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .nexus-tl-footer-link {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--accent-primary);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .nexus-tl-footer-link:hover { opacity: 0.7; }
      `}</style>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
    </div>
  )
}

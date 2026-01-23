'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Loader2 } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'
import { GitHubService } from '@/services/github'
import GitHubStatsWidget from '@/components/widgets/GitHubStatsWidget'
import FeaturedProjectsCarousel from '@/components/widgets/FeaturedProjectsCarousel'
import LatestBlogWidget from '@/components/widgets/LatestBlogWidget'
import CareerTimelineWidget from '@/components/widgets/CareerTimelineWidget'
import CertificationShowcase from '@/components/widgets/CertificationShowcase'
import Sidebar from '@/components/Sidebar'
import EngineeringBentoGrid from '@/components/widgets/EngineeringBentoGrid'
import CtaFooterWidget from '@/components/widgets/CtaFooterWidget'
import { ROADMAP_DATA } from '@/data/roadmap-data'

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''


interface AboutProps {
  isActive?: boolean
  onOpenResume?: () => void
  initialData?: {
    personalInfo?: PersonalInfo
    skills?: Technology[]
    testimonials?: Testimonial[]
    technologies?: Technology[]
    githubStats?: GitHubStatsData
  }
}

interface GitHubStatsData {
  totalRepos: number
  totalStars: number
  followers: number
  publicRepos: number
  topLanguages: Array<{ name: string; count: number; color: string; logo?: string }>
}

interface AboutContent {
  id: string
  section_key: string
  title: string | null
  content: string
  icon: string | null
  badge: string | null
  tags?: string[]
  competencies?: string[]
  proof_of_work?: { label: string, url: string } // Added for "Proof of Work"
  display_order: number
  is_active: boolean
}



interface Testimonial {
  id: string
  name: string
  avatar_url: string | null
  text: string
  date: string
  is_featured: boolean
  display_order: number
}

interface Technology {
  id: string
  name: string
  logo_url: string
  category: string
  display_order: number
}

interface PersonalInfo {
  full_name: string
  title: string
  avatar_url: string | null
  about_text: string | null
  expertise: AboutContent[] | null
  kpi_stats: KpiStats | null
}





const FALLBACK_TECHNOLOGIES: Technology[] = [
  { id: 't1', name: 'TypeScript', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', category: 'Language', display_order: 1 },
  { id: 't2', name: 'React', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'Frontend', display_order: 2 },
  { id: 't3', name: 'Python', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'Language', display_order: 3 },
  { id: 't4', name: 'Kubernetes', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', category: 'Infrastructure', display_order: 4 },
  { id: 't5', name: 'Docker', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'Container', display_order: 5 },
  { id: 't6', name: 'Terraform', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', category: 'IaC', display_order: 6 },
  { id: 't7', name: 'AWS', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', category: 'Cloud', display_order: 7 },
  { id: 't8', name: 'PyTorch', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', category: 'ML', display_order: 8 }
]


// KPI Stats interface for welcome banner
interface KpiStats {
  years_experience?: string
  current_phase?: string
  tagline?: string
  headline?: string
  role?: string
  focus?: string
  project_count?: number
  expertise_breakdown?: {
    software?: number
    cloud_infra?: number
    data?: number
    ml_ai?: number
  }
}

const StatCounter = ({ value, duration = 2000 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return

    const totalMiliseconds = duration
    const incrementTime = (totalMiliseconds / end)

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

export default function About({ isActive = false, onOpenResume, initialData }: AboutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  const [loading, setLoading] = useState(!initialData)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData?.testimonials || [])
  const [technologies, setTechnologies] = useState<Technology[]>(initialData?.technologies || FALLBACK_TECHNOLOGIES)

  // Dynamic stats for welcome banner (aligned with MLOps roadmap)
  // Get current phase from roadmap data - Phase 1 is current
  const currentPhaseIndex = 0 // Phase 1: Foundations is current
  const totalPhases = ROADMAP_DATA.phases.length
  const currentRoadmapPhase = ROADMAP_DATA.phases[currentPhaseIndex]

  const [skillCount, setSkillCount] = useState(40)
  const [projectCount, setProjectCount] = useState(25)
  const [kpiStats, setKpiStats] = useState<KpiStats>({
    years_experience: initialData?.personalInfo?.kpi_stats?.years_experience || '5+',
    current_phase: initialData?.personalInfo?.kpi_stats?.current_phase || `${currentPhaseIndex + 1}/${totalPhases}`,
    expertise_breakdown: initialData?.personalInfo?.kpi_stats?.expertise_breakdown || { software: 40, cloud_infra: 25, data: 15, ml_ai: 20 }
  })
  const [currentFocus, setCurrentFocus] = useState(currentRoadmapPhase?.title || 'Phase 1: Foundations')
  const [_personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(initialData?.personalInfo || null)

  // Expertise breakdown - computed from kpiStats (from DB)
  const expertiseBreakdown = {
    cloud: kpiStats.expertise_breakdown?.cloud_infra ?? 30,
    devops: kpiStats.expertise_breakdown?.software ?? 35,
    mlops: kpiStats.expertise_breakdown?.ml_ai ?? 35,
    development: kpiStats.expertise_breakdown?.data ?? 0
  }

  const segments = [
    { label: 'Cloud', pct: expertiseBreakdown.cloud, type: 'dark' },
    { label: 'DevOps', pct: expertiseBreakdown.devops, type: 'yellow' },
    { label: 'MLOps', pct: expertiseBreakdown.mlops, type: 'striped' }
  ]

  useEffect(() => {
    if (!initialData) {
      fetchAboutData()
    }
  }, [initialData])

  const fetchAboutData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel from consolidated schema
      const [personalInfoResult, skillsResult, testimonialsResult] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('skills').select('*').order('display_order'),
        supabase.from('testimonials').select('*').order('display_order')
      ])

      // Set about text from personal_info
      if (personalInfoResult.data) {
        const info = personalInfoResult.data as unknown as PersonalInfo
        setPersonalInfo(info)

        // Set KPI stats from JSONB field for the welcome banner
        if (info.kpi_stats && !Array.isArray(info.kpi_stats)) {
          setKpiStats(prev => ({ ...prev, ...(info.kpi_stats as unknown as KpiStats) }))
        }
      }

      // Set technologies from skills table
      if (skillsResult.data && skillsResult.data.length > 0) {
        const techData = skillsResult.data.map(skill => ({
          id: skill.id,
          name: skill.name,
          logo_url: skill.icon_url || `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.name.toLowerCase()}/${skill.name.toLowerCase()}-original.svg`,
          category: skill.category,
          display_order: skill.display_order || 0
        }))
        setTechnologies(techData)
      }

      // Set testimonials
      if (testimonialsResult.data && testimonialsResult.data.length > 0) {
        setTestimonials(testimonialsResult.data)
      }

      // Update project count from GitHub (more accurate than DB unless overridden)
      try {
        const githubService = new GitHubService(GITHUB_TOKEN)
        const repos = await githubService.getRepositories(GITHUB_USERNAME, {
          maxRepos: 100,
          sortBy: 'updated',
          includePrivate: Boolean(GITHUB_TOKEN)
        })

        let count = repos.length

        // Use DB project count if higher (manual override for private projects)
        if (personalInfoResult.data) {
          const info = personalInfoResult.data as unknown as PersonalInfo
          const dbStats = info.kpi_stats as unknown as KpiStats
          if (dbStats?.project_count && dbStats.project_count > count) {
            count = dbStats.project_count
          }
        }

        if (count > 0) {
          setProjectCount(count)
        }
      } catch (e) {
        console.error('Error fetching GitHub repos:', e)
        // Fallback to DB count if GitHub fetch fails
        if (personalInfoResult.data) {
          const info = personalInfoResult.data as unknown as PersonalInfo
          const dbStats = info.kpi_stats as unknown as KpiStats
          if (dbStats?.project_count) {
            setProjectCount(dbStats.project_count)
          }
        }
      }

      // Update skills count
      if (skillsResult.data) {
        setSkillCount(skillsResult.data.length)
      }

      // Fetch roadmap info for banner
      interface RoadmapPhase { status: string; target_role?: string; title?: string }
      const { data: phasesData } = await (supabase as unknown as { from: (table: string) => { select: (cols: string) => { order: (col: string) => Promise<{ data: RoadmapPhase[] | null }> } } }).from('roadmap_phases').select('*').order('phase_number')
      if (phasesData && phasesData.length > 0) {
        const completedCount = phasesData.filter((p) => p.status === 'completed').length
        const totalCount = phasesData.length
        const currentPhaseObj = phasesData.find((p) => p.status === 'in_progress') || phasesData.find((p) => p.status === 'upcoming')

        setKpiStats(prev => ({
          ...prev,
          current_phase: `${completedCount}/${totalCount}`
        }))

        if (currentPhaseObj) {
          setCurrentFocus(currentPhaseObj.target_role || currentPhaseObj.title || 'DevOps')
        }
      }

    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Duplicate technologies for seamless infinite scroll
  const _duplicatedTechnologies = [...technologies, ...technologies]

  const openTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
  }

  const closeTestimonialModal = () => {
    setIsModalOpen(false)
    setSelectedTestimonial(null)
  }

  if (loading) {
    return (
      <article className={`about ${isActive ? 'active' : ''}`} data-page="about">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p>Loading...</p>
        </div>
      </article>
    )
  }


  return (
    <article className={`about portfolio-tab ${isActive ? 'active' : ''}`} data-page="about">

      {/* Welcome Banner - Enhanced Visual Design */}
      <section className="welcome-banner compact">
        <div className="welcome-left">
          <h1 className="welcome-title text-3xl md:text-5xl font-bold mb-4">
            {kpiStats.headline || <><span className="text-gradient-static">Building the Future</span> of ML Infrastructure</>}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <p className="welcome-subtitle text-lg text-[var(--text-secondary)]">
              {kpiStats.role || 'MLOps Engineer I'} •
              <span className="text-[var(--accent-primary)] font-semibold ml-1">{kpiStats.focus || 'Build engineering foundation: Cloud + Data + ML basics'}</span>
            </p>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-tertiary)]/10 border border-[var(--accent-primary)]/20 text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
              Phase {kpiStats.current_phase || '1 - Foundations'}
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="segments-container mt-6">
            {segments.map((seg, i) => (
              <div key={i} className="segment-wrapper" style={{ flex: seg.pct }}>
                <span className="segment-label">{seg.label}</span>
                <div className={`segment ${seg.type}`}>
                  <span className="segment-value">{seg.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="stat-row">
              <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="5" />
                <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
              </svg>
              <span className="welcome-stat-value"><StatCounter value={parseInt(kpiStats.years_experience || '5')} />+</span>
            </div>
            <span className="welcome-stat-label">Years Exp</span>
          </div>
          <div className="welcome-stat">
            <div className="stat-row">
              <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="welcome-stat-value"><StatCounter value={skillCount} /></span>
            </div>
            <span className="welcome-stat-label">Skills</span>
          </div>
          <div className="welcome-stat">
            <div className="stat-row">
              <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="welcome-stat-value"><StatCounter value={projectCount} /></span>
            </div>
            <span className="welcome-stat-label">Projects</span>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid - Crextio Style */}
      <div className="dashboard-grid mb-8 md:mb-20">
        {/* Left Column - Profile Card */}
        <div className="dashboard-left hidden md:block">
          {/* Profile Card */}
          <Sidebar onOpenResume={onOpenResume} />
        </div>

        {/* Center Column - Main Content */}
        <div className="dashboard-center">
          {/* GitHub Activity */}
          <section className="github-activity-full">
            <GitHubStatsWidget compact initialStats={initialData?.githubStats} />
          </section>

          {/* Certifications Showcase */}
          <CertificationShowcase />

          {/* Latest Blog - Center Side-by-Side (aligned with Projects) */}


          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="testimonials-section">
              <h3 className="section-title">Recommendations</h3>
              <ul className="testimonials-list has-scrollbar">
                {testimonials.map(testimonial => (
                  <li key={testimonial.id} className="testimonials-item min-w-[280px] md:min-w-[340px] lg:min-w-[380px] snap-center">
                    <div
                      className="group relative h-full bg-[var(--surface-card)] rounded-2xl p-6 pt-12 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 cursor-default"
                      onClick={() => openTestimonialModal(testimonial)}
                    >
                      <figure className="absolute top-0 left-6 -translate-y-1/2 w-16 h-16 rounded-xl overflow-hidden border-2 border-[var(--bg-primary)] shadow-lg group-hover:scale-105 group-hover:border-[var(--accent-secondary)] transition-all duration-300">
                        <Image
                          src={testimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">{testimonial.name}</h4>
                      <div className="relative">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4 font-normal italic">&quot;{testimonial.text}&quot;</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[var(--border-light)] flex justify-between items-center">
                        <time className="text-xs text-[var(--text-tertiary)] font-medium">
                          {new Date(testimonial.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </time>
                        <span className="text-xs text-[var(--accent-secondary)] font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">Read more →</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="dashboard-right">
          <CareerTimelineWidget />
        </div>
      </div>

      {/* About Summary - Personal Info */}
      <section className="mb-12 md:mb-16">
        <EngineeringBentoGrid />
      </section>

      {/* ===== EXPERTISE SECTION - 3D STYLE ===== */}
      <section className="section-3d">
        <h2 className="section-3d-title">What I Build</h2>
        <p className="section-3d-subtitle">
          Bridging the gap between innovative ML research and production-ready infrastructure
        </p>

        <div className="expertise-grid">
          {/* MLOps Engineering Card */}
          <div className="expertise-card">
            <div className="expertise-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="expertise-badge">Core</span>
            <h3 className="expertise-title">MLOps Engineering</h3>
            <p className="expertise-description">
              End-to-end ML pipelines with automated training, validation, and deployment workflows.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">Kubeflow</span>
              <span className="expertise-tag">MLflow</span>
              <span className="expertise-tag">Airflow</span>
            </div>
          </div>

          {/* Cloud Architecture Card */}
          <div className="expertise-card">
            <div className="expertise-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
            <span className="expertise-badge">Infrastructure</span>
            <h3 className="expertise-title">Cloud Architecture</h3>
            <p className="expertise-description">
              Scalable, cost-effective cloud solutions using IaC and container orchestration.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">AWS</span>
              <span className="expertise-tag">Terraform</span>
              <span className="expertise-tag">Kubernetes</span>
            </div>
          </div>

          {/* Full-Stack Development Card */}
          <div className="expertise-card">
            <div className="expertise-icon cyan">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="expertise-badge">Development</span>
            <h3 className="expertise-title">Full-Stack Development</h3>
            <p className="expertise-description">
              Modern web applications with React, Next.js, and Python backend services.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">React</span>
              <span className="expertise-tag">Next.js</span>
              <span className="expertise-tag">Python</span>
            </div>
          </div>

          {/* AI/ML Integration Card */}
          <div className="expertise-card">
            <div className="expertise-icon warm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V9.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4Z" />
                <path d="M8 14v.5" />
                <path d="M16 14v.5" />
                <path d="M12 14v8" />
                <path d="M8 18h8" />
              </svg>
            </div>
            <span className="expertise-badge">AI/ML</span>
            <h3 className="expertise-title">AI/ML Integration</h3>
            <p className="expertise-description">
              Model serving, inference optimization, and RAG systems for production AI.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">PyTorch</span>
              <span className="expertise-tag">LangChain</span>
              <span className="expertise-tag">FastAPI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project & Blog Row - Wide Section */}
      <section className="mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row gap-5 md:h-[420px]">
          <div className="flex-[2] min-w-0">
            <FeaturedProjectsCarousel />
          </div>
          <div className="flex-1 min-w-0">
            <LatestBlogWidget />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section>
        <CtaFooterWidget onOpenResume={onOpenResume} />
      </section>

      {/* Testimonial Modal */}
      {isModalOpen && selectedTestimonial && (
        <div className="modal-container active">
          <div className="overlay active" onClick={closeTestimonialModal}></div>
          <section className="testimonials-modal">
            <button className="modal-close-btn" onClick={closeTestimonialModal}>
              <X className="w-5 h-5" />
            </button>
            <div className="modal-img-wrapper">
              <figure className="modal-avatar-box">
                <Image
                  src={selectedTestimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                  alt={selectedTestimonial.name}
                  width={80}
                  height={80}
                />
              </figure>
              <Image src="/assets/images/icon-quote.svg" alt="quote icon" width={40} height={40} />
            </div>
            <div className="modal-content">
              <h4 className="h3 modal-title">{selectedTestimonial.name}</h4>
              <time dateTime={selectedTestimonial.date}>
                {new Date(selectedTestimonial.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <div>
                <p>{selectedTestimonial.text}</p>
              </div>
            </div>
          </section>
        </div>
      )}


    </article >
  )
}
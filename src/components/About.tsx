'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
<<<<<<< HEAD
import { motion, useReducedMotion } from 'framer-motion'
import { Loader2 } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'
import { GitHubService } from '@/services/github'
import GitHubStatsWidget from '@/components/widgets/GitHubStatsWidget'
import LatestBlogWidget from '@/components/widgets/LatestBlogWidget'
import CareerTimelineWidget from '@/components/widgets/CareerTimelineWidget'
import EngineeringBentoGrid from '@/components/widgets/EngineeringBentoGrid'
import ProfileWidget from '@/components/widgets/ProfileWidget'
import { ROADMAP_DATA } from '@/data/roadmap-data'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import { Button } from '@/components/ui'
import AnimatedPage from '@/components/AnimatedPage'
import {
  fadeUp,
  fadeScale,
  staggerContainer,
  staggerChild,
  staggerChildScale,
  scrollRevealTransition,
  defaultViewport,
  instantTransition,
} from '@/lib/motion'
=======
import { X, Loader2 } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'
import { GitHubService } from '@/services/github'
import GitHubStatsWidget from '@/components/widgets/GitHubStatsWidget'
import FeaturedProjectsCarousel from '@/components/widgets/FeaturedProjectsCarousel'
import LatestBlogWidget from '@/components/widgets/LatestBlogWidget'
import CareerTimelineWidget from '@/components/widgets/CareerTimelineWidget'
// import CertificationShowcase from '@/components/widgets/CertificationShowcase' // archived — certs now in Sidebar
import Sidebar from '@/components/Sidebar'
import EngineeringBentoGrid from '@/components/widgets/EngineeringBentoGrid'
import CtaFooterWidget from '@/components/widgets/CtaFooterWidget'
import { ROADMAP_DATA } from '@/data/roadmap-data'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

<<<<<<< HEAD
// --- Interfaces (from original file) ---
interface Testimonial {
  id: string
  name: string
  avatar_url: string | null
  text: string
  date: string
  is_featured: boolean
  display_order: number
=======

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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
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
<<<<<<< HEAD
  proof_of_work?: { label: string, url: string }
=======
  proof_of_work?: { label: string, url: string } // Added for "Proof of Work"
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
  display_order: number
  is_active: boolean
}

<<<<<<< HEAD
=======


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

>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
interface PersonalInfo {
  full_name: string
  title: string
  avatar_url: string | null
  about_text: string | null
  expertise: AboutContent[] | null
  kpi_stats: KpiStats | null
}

<<<<<<< HEAD
=======




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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
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

<<<<<<< HEAD
interface Technology {
  id: string
  name: string
  logo_url: string
  category: string
  display_order: number
}

interface GitHubStatsData {
  totalRepos: number
  totalStars: number
  followers: number
  publicRepos: number
  topLanguages: Array<{ name: string; count: number; color: string; logo?: string }>
}

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

// --- Helper Component ---
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
const StatCounter = ({ value, duration = 2000 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
<<<<<<< HEAD
    if (start === end) {
      setCount(end)
      return
    }
=======
    if (start === end) return
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

    const totalMiliseconds = duration
    const incrementTime = (totalMiliseconds / end)

    const timer = setInterval(() => {
      start += 1
      setCount(start)
<<<<<<< HEAD
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      }
=======
      if (start === end) clearInterval(timer)
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

<<<<<<< HEAD
// --- Main Component ---
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
export default function About({ isActive = false, onOpenResume, initialData }: AboutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  const [loading, setLoading] = useState(!initialData)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData?.testimonials || [])
<<<<<<< HEAD

  const currentPhaseIndex = 0 // Phase 1 of 5 is current
  const totalPhases = ROADMAP_DATA.phases.length // 5
=======
  const [technologies, setTechnologies] = useState<Technology[]>(initialData?.technologies || FALLBACK_TECHNOLOGIES)

  // Dynamic stats for welcome banner (aligned with MLOps roadmap)
  // Get current phase from roadmap data - Phase 1 is current
  const currentPhaseIndex = 0 // Phase 1 of 5 is current
  const totalPhases = ROADMAP_DATA.phases.length // 5
  const currentRoadmapPhase = ROADMAP_DATA.phases[currentPhaseIndex]
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

  const [skillCount, setSkillCount] = useState(40)
  const [projectCount, setProjectCount] = useState(25)
  const [kpiStats, setKpiStats] = useState<KpiStats>({
    years_experience: initialData?.personalInfo?.kpi_stats?.years_experience || '3+',
    current_phase: initialData?.personalInfo?.kpi_stats?.current_phase || `${currentPhaseIndex + 1}/${totalPhases}`,
    expertise_breakdown: initialData?.personalInfo?.kpi_stats?.expertise_breakdown || { software: 40, cloud_infra: 35, data: 10, ml_ai: 15 }
  })
<<<<<<< HEAD
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(initialData?.personalInfo || null)

=======
  const [currentFocus, setCurrentFocus] = useState(currentRoadmapPhase?.title || 'Phase 1: Foundations')
  const [_personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(initialData?.personalInfo || null)

  // Expertise breakdown - computed from kpiStats (from DB)
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
  const expertiseBreakdown = {
    cloud: kpiStats.expertise_breakdown?.cloud_infra ?? 30,
    devops: kpiStats.expertise_breakdown?.software ?? 35,
    mlops: kpiStats.expertise_breakdown?.ml_ai ?? 35,
    development: kpiStats.expertise_breakdown?.data ?? 0
  }

  const segments = [
<<<<<<< HEAD
    { label: 'Software Eng.', pct: expertiseBreakdown.cloud, colorClass: 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' },
    { label: 'Cloud / Infra', pct: expertiseBreakdown.devops, colorClass: 'bg-[hsl(var(--accent))] text-white' },
    { label: 'AI / ML', pct: expertiseBreakdown.mlops, colorClass: 'bg-[hsl(var(--secondary))] text-white' }
=======
    { label: 'Software Eng.', pct: expertiseBreakdown.cloud, type: 'dark' },
    { label: 'Cloud / Infra', pct: expertiseBreakdown.devops, type: 'yellow' },
    { label: 'AI / ML', pct: expertiseBreakdown.mlops, type: 'striped' }
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
  ]

  useEffect(() => {
    if (!initialData) {
      fetchAboutData()
    }
<<<<<<< HEAD
    // eslint-disable-next-line react-hooks/exhaustive-deps
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
  }, [initialData])

  const fetchAboutData = async () => {
    try {
      setLoading(true)

<<<<<<< HEAD
=======
      // Fetch all data in parallel from consolidated schema
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
      const [personalInfoResult, skillsResult, testimonialsResult] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('skills').select('*').order('display_order'),
        supabase.from('testimonials').select('*').order('display_order')
      ])

<<<<<<< HEAD
      if (personalInfoResult.data) {
        const info = personalInfoResult.data as unknown as PersonalInfo
        setPersonalInfo(info)
=======
      // Set about text from personal_info
      if (personalInfoResult.data) {
        const info = personalInfoResult.data as unknown as PersonalInfo
        setPersonalInfo(info)

        // Set KPI stats from JSONB field for the welcome banner
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        if (info.kpi_stats && !Array.isArray(info.kpi_stats)) {
          setKpiStats(prev => ({ ...prev, ...(info.kpi_stats as unknown as KpiStats) }))
        }
      }

<<<<<<< HEAD
=======
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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
      if (testimonialsResult.data && testimonialsResult.data.length > 0) {
        setTestimonials(testimonialsResult.data)
      }

<<<<<<< HEAD
=======
      // Update project count from GitHub (more accurate than DB unless overridden)
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
      try {
        const githubService = new GitHubService(GITHUB_TOKEN)
        const repos = await githubService.getRepositories(GITHUB_USERNAME, {
          maxRepos: 100,
          sortBy: 'updated',
          includePrivate: Boolean(GITHUB_TOKEN)
        })

        let count = repos.length
<<<<<<< HEAD
=======

        // Use DB project count if higher (manual override for private projects)
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        if (personalInfoResult.data) {
          const info = personalInfoResult.data as unknown as PersonalInfo
          const dbStats = info.kpi_stats as unknown as KpiStats
          if (dbStats?.project_count && dbStats.project_count > count) {
            count = dbStats.project_count
          }
        }
<<<<<<< HEAD
        if (count > 0) setProjectCount(count)
      } catch (e) {
        console.error('Error fetching GitHub repos:', e)
=======

        if (count > 0) {
          setProjectCount(count)
        }
      } catch (e) {
        console.error('Error fetching GitHub repos:', e)
        // Fallback to DB count if GitHub fetch fails
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        if (personalInfoResult.data) {
          const info = personalInfoResult.data as unknown as PersonalInfo
          const dbStats = info.kpi_stats as unknown as KpiStats
          if (dbStats?.project_count) {
            setProjectCount(dbStats.project_count)
          }
        }
      }

<<<<<<< HEAD
=======
      // Update skills count
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
      if (skillsResult.data) {
        setSkillCount(skillsResult.data.length)
      }

<<<<<<< HEAD
      interface RoadmapPhase { status: string }
      const { data: phasesData } = await (supabase as any).from('roadmap_phases').select('*').order('phase_number')
      if (phasesData && phasesData.length > 0) {
        const completedCount = phasesData.filter((p: RoadmapPhase) => p.status === 'completed').length
        setKpiStats(prev => ({ ...prev, current_phase: `${completedCount}/${phasesData.length}` }))
=======
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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
      }

    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
=======
  // Duplicate technologies for seamless infinite scroll
  const _duplicatedTechnologies = [...technologies, ...technologies]

>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
  const openTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
  }

<<<<<<< HEAD
  const openResumeFromCta = () => {
    if (onOpenResume) {
      onOpenResume()
      return
    }
    window.dispatchEvent(new CustomEvent('open-resume-modal'))
=======
  const closeTestimonialModal = () => {
    setIsModalOpen(false)
    setSelectedTestimonial(null)
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
  }

  if (loading) {
    return (
<<<<<<< HEAD
      <article className={cn("flex flex-col items-center justify-center min-h-[300px] gap-3", isActive ? "block" : "hidden")}>
        <Loader2 size={40} className="animate-spin text-[hsl(var(--accent))]" />
        <p className="text-[hsl(var(--muted-foreground))]">Loading...</p>
=======
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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
      </article>
    )
  }

<<<<<<< HEAD
  return (
    <AnimatedPage variant="dramatic">
    <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="about">
      <div className="grid gap-4 min-w-0">

        {/* 1. Welcome Banner */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={cn(
            "relative overflow-hidden p-6 rounded-2xl",
            "border border-[hsl(var(--border))]",
            "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/50",
            "shadow-sm",
            "lg:grid lg:grid-cols-[1fr_auto] lg:gap-5 lg:items-center max-sm:p-4"
          )}>
          {/* Decorative background glow */}
          <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[160%] rounded-full bg-[radial-gradient(circle,hsl(var(--accent)/0.08),transparent_60%)] pointer-events-none" />

          <motion.div variants={staggerChild} className="min-w-0 mb-6 lg:mb-0">
            <motion.h1 variants={staggerChild} className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight tracking-tight text-[hsl(var(--foreground))]">
              {kpiStats.headline || (
                <>
                  <span className="bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">Building in Public.</span>
                  {" "}CS Graduate → AI/ML Engineer
                </>
              )}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                {kpiStats.role || 'Software Engineer (Building)'} •
                <span className="text-[hsl(var(--accent))] font-semibold ml-1">
                  {kpiStats.focus || 'Python · Docker · Linux → AI/ML Engineer in 26 months'}
                </span>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))]/10 to-[hsl(var(--secondary))]/10 border border-[hsl(var(--accent))]/20 text-[9px] font-bold text-[hsl(var(--accent))] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                Phase {kpiStats.current_phase || '1 - Foundations'}
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="flex gap-2 mt-5">
              {segments.map((seg, i) => (
                <div key={i} className="flex flex-col gap-1" style={{ flex: seg.pct }}>
                  <span className="text-[0.64rem] tracking-wider uppercase font-bold text-[hsl(var(--muted-foreground))]">
                    {seg.label}
                  </span>
                  <div className={cn("h-6 rounded-full flex items-center px-2.5", seg.colorClass)}>
                    <span className="text-[0.66rem] font-bold">{seg.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerChild} className="flex flex-wrap gap-2.5 max-sm:grid max-sm:grid-cols-2">
            {[
              { label: 'Years Exp', value: `${kpiStats.years_experience || '3'}+` },
              { label: 'Skills', value: skillCount, counter: true },
              { label: 'Projects', value: projectCount, counter: true }
            ].map((stat, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 min-w-[80px] p-3 rounded-2xl border border-[hsl(var(--border))]",
                  "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/30",
                  "shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  i === 2 && "max-sm:col-span-2"
                )}
              >
                <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
                  {i === 0 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  )}
                  <span className="text-xl md:text-2xl font-extrabold text-[hsl(var(--foreground))]">
                    {stat.counter ? <StatCounter value={stat.value as number} /> : stat.value}
                  </span>
                </div>
                <span className="block mt-1 text-[0.64rem] tracking-widest uppercase font-bold text-[hsl(var(--muted-foreground))]">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* 2. Dashboard Grid (Layout) */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 xl:gap-8"
          data-testid="dashboard-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {/* Center Column (Now Left) */}
          <motion.div variants={staggerChild} className="flex flex-col gap-4 min-w-0">
            {/* Profile & Education Widget */}
            <ProfileWidget personalInfo={personalInfo} onOpenResume={onOpenResume} />

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <section className={cn(
                "p-5 rounded-2xl border border-[hsl(var(--border))] shadow-sm overflow-hidden",
                "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/50"
              )}>
                <h3 className="text-xs tracking-widest uppercase font-extrabold text-[hsl(var(--muted-foreground))] mb-3">
                  Recommendations
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[hsl(var(--border))] scrollbar-track-transparent snap-x">
                  {testimonials.map(testimonial => (
                    <div
                      key={testimonial.id}
                      onClick={() => openTestimonialModal(testimonial)}
                      className={cn(
                        "group relative shrink-0 w-[min(84vw,340px)] snap-center cursor-pointer",
                        "p-5 pt-10 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]",
                        "shadow-sm hover:shadow-md hover:border-[hsl(var(--accent))/0.2] transition-all duration-300"
                      )}
                    >
                      <div className="absolute top-0 left-5 -translate-y-1/2 w-14 h-14 rounded-xl overflow-hidden border-2 border-[hsl(var(--card))] shadow-md group-hover:scale-105 group-hover:border-[hsl(var(--accent))] transition-all duration-300">
                        <Image
                          src={testimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-[0.96rem] font-bold text-[hsl(var(--foreground))] mb-1.5 group-hover:text-[hsl(var(--accent))] transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-[0.82rem] text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-4 italic">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] flex justify-between items-center">
                        <time className="text-xs text-[hsl(var(--muted-foreground))] font-medium">
                          {new Date(testimonial.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </time>
                        <span className="text-xs text-[hsl(var(--accent))] font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                          Read more →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div variants={staggerChild} className="flex flex-col gap-4 min-w-0">
            <div className="min-w-0 w-full">
              <LatestBlogWidget />
            </div>
          </motion.div>
        </motion.div>

        {/* 2.5. Career Timeline (Horizontal) */}
        <motion.section
          className="min-w-0 mb-6 lg:mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          <CareerTimelineWidget />
        </motion.section>

        {/* 3. Engineering Bento Grid */}
        <motion.section
          className="min-w-0"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          <EngineeringBentoGrid />
        </motion.section>

        {/* 4. Expertise Section (What I Build) */}
        <motion.section
          className={cn(
            "relative overflow-hidden p-6 lg:p-7 rounded-2xl",
            "border border-[hsl(var(--border))]",
            "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/50",
            "shadow-sm text-left"
          )}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          {/* Corner glow */}
          <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[140%] rounded-full bg-[radial-gradient(circle,hsl(var(--secondary)/0.06),transparent_55%)] pointer-events-none" />

          <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] mb-1.5">
            What I Build
          </h2>
          <p className="max-w-[72ch] text-[0.88rem] leading-relaxed text-[hsl(var(--muted-foreground))] mb-5">
            Building the Nexus AI platform across 5 phases — from Dockerised CLI to production multi-agent systems
          </p>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-3.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {[
              {
                phase: 'Phase 1–2', title: 'Software Engineering',
                desc: 'Python, TypeScript, Node.js REST APIs, React frontends, PostgreSQL, and Docker Compose — shipped to a live Hetzner VPS.',
                tags: ['Python', 'TypeScript', 'Docker'],
                iconBase: 'text-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.1]',
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                )
              },
              {
                phase: 'Phase 2', title: 'Cloud & Infrastructure',
                desc: 'k3s Kubernetes, Helm, Terraform-managed AWS, Prometheus + Grafana observability — all GitOps-deployed.',
                tags: ['Kubernetes', 'Terraform', 'AWS'],
                iconBase: 'text-[hsl(var(--secondary))] bg-[hsl(var(--secondary))/0.1]',
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                  </svg>
                )
              },
              {
                phase: 'Phase 3', title: 'Machine Learning',
                desc: 'PyTorch models, HuggingFace fine-tuning, scikit-learn pipelines, FastAPI model serving with SHAP explanations.',
                tags: ['PyTorch', 'HuggingFace', 'FastAPI'],
                iconBase: 'text-[hsl(192_82%_37%)] bg-[hsl(192_82%_37%)/0.1]',
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                )
              },
              {
                phase: 'Phase 4–5', title: 'AI / LLM Systems',
                desc: 'RAG pipelines, LangChain LCEL, QLoRA fine-tuning, MLOps with drift detection, and multi-agent systems via LangGraph.',
                tags: ['LangChain', 'RAG', 'LangGraph'],
                iconBase: 'text-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.15]',
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V9.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4Z" />
                    <path d="M8 14v.5" /><path d="M16 14v.5" /><path d="M12 14v8" /><path d="M8 18h8" />
                  </svg>
                )
              }
            ].map((card, i) => (
            <motion.div
                key={i}
                variants={staggerChildScale}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-5 border border-[hsl(var(--border))]",
                  "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/40",
                  "shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[hsl(var(--accent))/0.2]"
                )}
              >
                {/* Edge highlight on hover */}
                <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[hsl(var(--accent))] to-[hsl(var(--secondary))] opacity-0 transition-opacity group-hover:opacity-100" />

                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-3", card.iconBase)}>
                  {card.iconSvg}
                </div>

                <span className="absolute top-4 right-4 text-[0.58rem] font-bold px-2 py-1 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-md">
                  {card.phase}
                </span>

                <h3 className="text-base font-bold text-[hsl(var(--foreground))] mb-1.5">{card.title}</h3>
                <p className="text-[0.82rem] leading-relaxed text-[hsl(var(--muted-foreground))] mb-3">{card.desc}</p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {card.tags.map(tag => (
                    <span key={tag} className="text-[0.64rem] font-semibold px-2 py-1 rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] transition-colors group-hover:bg-[hsl(var(--accent))/0.1] group-hover:text-[hsl(var(--accent))]">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>


        {/* 6. Compact CTA */}
        <motion.section
          className={cn(
            "relative overflow-hidden rounded-2xl p-5 lg:p-6 lg:flex lg:items-center lg:justify-between gap-4",
            "border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          )}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          {/* Top border highlight */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />

          <div className="min-w-0 mb-4 lg:mb-0">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
              "border border-[hsl(var(--accent))/0.22] bg-[hsl(var(--accent))/0.1]",
              "text-[hsl(var(--accent))] text-[0.66rem] font-extrabold uppercase tracking-widest"
            )}>
              Open for opportunities
            </span>
            <h3 className="mt-2.5 mb-1.5 text-[clamp(1rem,2.2vw,1.3rem)] font-extrabold tracking-[-0.025em] text-[hsl(var(--foreground))] leading-tight">
              Let&apos;s build production-grade software and AI systems.
            </h3>
            <p className="text-[0.86rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
              If you need practical engineering with strong ownership, I&apos;m available for selective collaborations and full-time roles.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              className="rounded-xl px-5 h-10 font-extrabold tracking-widest uppercase text-[0.74rem] shadow-sm"
              onClick={openResumeFromCta}
            >
              Open Resume
            </Button>
            <Button
              variant="outline"
              className="rounded-xl px-5 h-10 font-extrabold tracking-widest uppercase text-[0.74rem] bg-[hsl(var(--muted))/0.5]"
              asChild
            >
              <a href="/contact">Contact Me</a>
            </Button>
          </div>
        </motion.section>

        {/* 7. GitHub Activity */}
        <motion.section
          className="min-w-0"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          <GitHubStatsWidget fullWidth initialStats={initialData?.githubStats} />
        </motion.section>

      </div>

      {/* Testimonial Modal via shadcn/ui Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-[hsl(var(--card))] border-[hsl(var(--border))]">
          <DialogHeader>
            <DialogTitle className="sr-only">Testimonial from {selectedTestimonial?.name}</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="flex flex-col items-center text-center mt-2">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[hsl(var(--card))] shadow-lg mb-4">
                <Image
                  src={selectedTestimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                  alt={selectedTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <Image src="/assets/images/icon-quote.svg" alt="quote icon" width={32} height={32} className="mb-3 opacity-20" />
              <h4 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">{selectedTestimonial.name}</h4>
              <DialogDescription className="text-xs font-medium mb-4">
=======

  return (
    <article className={`about portfolio-tab ${isActive ? 'active' : ''}`} data-page="about">

      {/* Welcome Banner - Enhanced Visual Design */}
      <section className="welcome-banner compact">
        <div className="welcome-left">
          <h1 className="welcome-title text-3xl md:text-5xl font-bold mb-4">
            {kpiStats.headline || <><span className="text-gradient-static">Building in Public.</span> CS Graduate → AI/ML Engineer</>}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <p className="welcome-subtitle text-lg text-[var(--text-secondary)]">
              {kpiStats.role || 'Software Engineer (Building)'} •
              <span className="text-[var(--accent-primary)] font-semibold ml-1">{kpiStats.focus || 'Python · Docker · Linux → AI/ML Engineer in 26 months'}</span>
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
          {/* Nexus Build Status — quick orientation strip */}
          <section className="nexus-status-strip">
            <div className="nexus-strip-inner">
              <div className="nexus-strip-label">
                <span className="nexus-pulse" />
                <span>Currently building</span>
              </div>
              <div className="nexus-strip-phase">
                <span className="nexus-phase-badge">Phase 1 / 5</span>
                <span className="nexus-phase-name">Foundations &amp; Tooling</span>
              </div>
              <div className="nexus-strip-stack">
                {["Python", "Docker", "PostgreSQL", "Nginx", "GitHub Actions"].map(s => (
                  <span key={s} className="nexus-stack-chip">{s}</span>
                ))}
              </div>
              <a href="https://github.com/ambooka/nexus" target="_blank" rel="noopener noreferrer"
                className="nexus-strip-cta">View on GitHub →</a>
            </div>
          </section>

          {/* CertificationShowcase archived — certs are now displayed in the Sidebar profile card */}

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

          {/* GitHub Activity — secondary context below the narrative */}
          <section className="github-activity-full">
            <GitHubStatsWidget compact initialStats={initialData?.githubStats} />
          </section>
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
          Building the Nexus AI platform across 5 phases — from Dockerised CLI to production multi-agent systems
        </p>

        <div className="expertise-grid">
          {/* Software Engineering Card */}
          <div className="expertise-card">
            <div className="expertise-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="expertise-badge">Phase 1–2</span>
            <h3 className="expertise-title">Software Engineering</h3>
            <p className="expertise-description">
              Python, TypeScript, Node.js REST APIs, React frontends, PostgreSQL, and Docker Compose — shipped to a live Hetzner VPS.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">Python</span>
              <span className="expertise-tag">TypeScript</span>
              <span className="expertise-tag">Docker</span>
            </div>
          </div>

          {/* Cloud & Infrastructure Card */}
          <div className="expertise-card">
            <div className="expertise-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
            <span className="expertise-badge">Phase 2</span>
            <h3 className="expertise-title">Cloud & Infrastructure</h3>
            <p className="expertise-description">
              k3s Kubernetes, Helm, Terraform-managed AWS, Prometheus + Grafana observability — all GitOps-deployed.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">Kubernetes</span>
              <span className="expertise-tag">Terraform</span>
              <span className="expertise-tag">AWS</span>
            </div>
          </div>

          {/* Machine Learning Card */}
          <div className="expertise-card">
            <div className="expertise-icon cyan">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="expertise-badge">Phase 3</span>
            <h3 className="expertise-title">Machine Learning</h3>
            <p className="expertise-description">
              PyTorch models, HuggingFace fine-tuning, scikit-learn pipelines, FastAPI model serving with SHAP explanations.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">PyTorch</span>
              <span className="expertise-tag">HuggingFace</span>
              <span className="expertise-tag">FastAPI</span>
            </div>
          </div>

          {/* AI/LLM Systems Card */}
          <div className="expertise-card">
            <div className="expertise-icon warm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V9.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4Z" />
                <path d="M8 14v.5" /><path d="M16 14v.5" />
                <path d="M12 14v8" /><path d="M8 18h8" />
              </svg>
            </div>
            <span className="expertise-badge">Phase 4–5</span>
            <h3 className="expertise-title">AI / LLM Systems</h3>
            <p className="expertise-description">
              RAG pipelines, LangChain LCEL, QLoRA fine-tuning, MLOps with drift detection, and multi-agent systems via LangGraph.
            </p>
            <div className="expertise-tags">
              <span className="expertise-tag">LangChain</span>
              <span className="expertise-tag">RAG</span>
              <span className="expertise-tag">LangGraph</span>
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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                {new Date(selectedTestimonial.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
<<<<<<< HEAD
              </DialogDescription>
              <p className="text-[0.9rem] leading-relaxed text-[hsl(var(--muted-foreground))] italic">
                &quot;{selectedTestimonial.text}&quot;
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </article>
    </AnimatedPage>
  )
}
=======
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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

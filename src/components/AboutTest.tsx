'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Brain, Code, Bot, Cloud, Loader2, Database, Shield, Terminal, Server, Activity, Lock, BrainCircuit, Layers, Box, Cpu, Workflow, Calendar, Briefcase, ChevronRight } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'
import { GitHubService } from '@/services/github'
import GitHubStatsWidget from '@/components/widgets/GitHubStatsWidget'
import FeaturedProjectsCarousel from '@/components/widgets/FeaturedProjectsCarousel'
import LatestBlogWidget from '@/components/widgets/LatestBlogWidget'
import CareerTimelineWidget from '@/components/widgets/CareerTimelineWidget'
import ExpertiseProgressBar from '@/components/widgets/ExpertiseProgressBar'
import CertificationShowcase from '@/components/widgets/CertificationShowcase'
import Sidebar from '@/components/Sidebar'
import ExperienceGanttChart from '@/components/widgets/ExperienceGanttChart'

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

// Map certifications to expertise areas
const CERT_TO_EXPERTISE: Record<string, string[]> = {
  'expertise_devops': ['Terraform'],
  'expertise_cloud': ['AWS SAA'],
  'expertise_ml': ['AWS MLS', 'GCP ML'],
  'expertise_data': ['Databricks'],
  'expertise_k8s': ['CKA', 'CKAD']
}

// Certification badge images (local assets)
const CERT_BADGES: Record<string, { icon: string, name: string }> = {
  'Terraform': { icon: '/assets/badges/terraform-associate.png', name: 'Terraform Associate' },
  'AWS SAA': { icon: '/assets/badges/aws-saa.png', name: 'AWS Solutions Architect' },
  'AWS MLS': { icon: '/assets/badges/aws-mls.png', name: 'AWS ML Specialty' },
  'GCP ML': { icon: '/assets/badges/gcp-ml.png', name: 'GCP ML Engineer' },
  'Databricks': { icon: '/assets/badges/databricks.png', name: 'Databricks Data Engineer' },
  'CKA': { icon: '/assets/badges/cka.png', name: 'Certified Kubernetes Admin' },
  'CKAD': { icon: '/assets/badges/ckad.png', name: 'Certified Kubernetes App Dev' }
}

interface AboutProps {
  isActive?: boolean
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

const LOGO_MAP: Record<string, string> = {
  // Identity & Core
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg',
  'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',

  // Cloud & Infra
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'AWS EC2': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  'GCP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  'Terraform': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
  'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'Bash': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',

  // AI & Data
  'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
  'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
  'Pandas': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  'Scikit-learn': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',

  // Web
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'FastAPI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
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
  expertise: any | null
  kpi_stats: any | null
}

const iconMap: Record<string, React.ComponentType<{ className?: string, size?: number | string }>> = {
  BrainCircuit,
  Layers,
  Box,
  Cpu,
  Workflow,
  Brain,
  Code,
  Bot,
  Cloud,
  Database,
  Shield,
  Terminal,
  Server,
  Activity,
  Lock
}

const FALLBACK_EXPERTISE: AboutContent[] = [
  {
    id: 'exp1',
    section_key: 'expertise_devops',
    title: 'DevOps & CI/CD',
    content: 'Automating the software lifecycle. I build robust CI/CD pipelines that ensure code quality and rapid deployment.',
    icon: 'Workflow',
    badge: 'Proficient',
    tags: ['Docker', 'GitHub Actions', 'Linux', 'Bash', 'Terraform'],
    competencies: [
      'GitOps workflow implementation',
      'Container orchestration with Docker Compose',
      'Infrastructure as Code (IaC) with Terraform',
      'Automated testing integration'
    ],
    display_order: 1,
    is_active: true,
    proof_of_work: { label: 'View Project', url: '#projects' }
  },
  {
    id: 'exp2',
    section_key: 'expertise_cloud',
    title: 'Cloud Architecture',
    content: 'Designing scalable cloud-native systems. I leverage AWS and Azure services to build resilient, high-availability applications.',
    icon: 'Cloud',
    badge: 'Competent',
    tags: ['AWS', 'Azure', 'S3', 'EC2', 'IAM'],
    competencies: [
      'Serverless architecture (Lambda/Functions)',
      'VPC networking & security groups',
      'Cloud storage optimization (S3/Blob)',
      'Identity & Access Management (IAM)'
    ],
    display_order: 2,
    is_active: true,
    proof_of_work: { label: 'Related Post', url: '#blog' }
  },
  {
    id: 'exp3',
    section_key: 'expertise_ml',
    title: 'Machine Learning',
    content: 'Turning data into intelligence. I train and fine-tune models for real-world tasks, focusing on production readiness.',
    icon: 'BrainCircuit',
    badge: 'Proficient',
    tags: ['PyTorch', 'Scikit-learn', 'MLflow', 'Pandas'],
    competencies: [
      'Model training & fine-tuning (PyTorch)',
      'Experiment tracking with MLflow',
      'Data preprocessing & feature engineering',
      'Model evaluation & metrics'
    ],
    display_order: 3,
    is_active: true
  },
  {
    id: 'exp4',
    section_key: 'expertise_data',
    title: 'Data Engineering',
    content: 'Building ETL pipelines with Python and SQL. Learning data warehousing, Airflow orchestration, and dbt transformations through projects.',
    icon: 'Database',
    badge: 'Building',
    tags: ['Python', 'SQL', 'dbt', 'Airflow'],
    display_order: 4,
    is_active: true
  },
  {
    id: 'exp5',
    section_key: 'expertise_k8s',
    title: 'Kubernetes',
    content: 'Orchestrating containerized workloads. I manage clusters and deployments to ensure application scalability and reliability.',
    icon: 'Box',
    badge: 'Building',
    tags: ['Kubernetes', 'Helm', 'Azure', 'Docker'],
    competencies: [
      'Cluster administration (EKS/AKS)',
      'Helm chart development',
      'Pod scaling & resource management',
      'Service mesh concepts'
    ],
    display_order: 5,
    is_active: true
  },
  {
    id: 'exp6',
    section_key: 'expertise_llm',
    title: 'LLM Applications',
    content: 'Building the next generation of AI apps. I integrate LLMs into workflows using RAG and agentic patterns.',
    icon: 'Bot',
    badge: 'Building',
    tags: ['RAG', 'LangChain', 'Python', 'OpenAI API'], // Removed 'Vector DB' generic tag for concrete tech if possible, or mapping needed
    competencies: [
      'Retrieval-Augmented Generation (RAG)',
      'Prompt engineering & optimization',
      'Vector database integration',
      'Agentic workflow design'
    ],
    display_order: 6,
    is_active: true
  },
  {
    id: 'exp7',
    section_key: 'expertise_fullstack',
    title: 'Full Stack Engineering',
    content: 'Delivering end-to-end value. I build responsive frontends and performant backends to serve AI models to users.',
    icon: 'Layers',
    badge: 'Competent',
    tags: ['React', 'Next.js', 'FastAPI', 'TypeScript', 'PostgreSQL'],
    competencies: [
      'Modern frontend dev (React/Next.js)',
      'RESTful API design (FastAPI)',
      'Database modeling (SQL/NoSQL)',
      'State management & hooks'
    ],
    display_order: 7,
    is_active: true
  },
  {
    id: 'exp8',
    section_key: 'expertise_platform',
    title: 'Platform Engineering',
    content: 'Enabling developer velocity. I aim to build self-service platforms that abstract infrastructure complexity.',
    icon: 'Cpu',
    badge: 'Foundational',
    tags: ['Kubernetes', 'Docker', 'Go', 'Linux'],
    competencies: [
      'Internal Developer Platform (IDP) concepts',
      'Infrastructure automation',
      'Developer experience (DX) focus',
      'Tooling & CLI development'
    ],
    display_order: 8,
    is_active: true
  },
  {
    id: 'exp9',
    section_key: 'expertise_sre',
    title: 'SRE & Reliability',
    content: 'Keeping systems up. I focus on observability, incident management, and reliability engineering principles.',
    icon: 'Activity',
    badge: 'Foundational',
    tags: ['Linux', 'Python', 'Bash', 'AWS'],
    competencies: [
      'Monitoring & Alerting implementation',
      'Incident response basics',
      'SLO/SLI definition',
      'Post-mortem culture'
    ],
    display_order: 9,
    is_active: true
  },
  {
    id: 'exp10',
    section_key: 'expertise_security',
    title: 'MLSecOps & Governance',
    content: 'Securing the AI lifecycle. Integrating security checks into pipelines and ensuring model governance.',
    icon: 'Shield',
    badge: 'Developing',
    tags: ['Linux', 'Docker', 'AWS'],
    competencies: [
      'Supply chain security',
      'Container scanning',
      'IAM least privilege',
      'Compliance awareness'
    ],
    display_order: 10,
    is_active: true
  },
  {
    id: 'exp11',
    section_key: 'expertise_arch',
    title: 'MLOps Architecture',
    content: 'Designing the big picture. Planning scalable, cost-effective, and maintainable ML systems.',
    icon: 'Cloud',
    badge: 'Developing',
    tags: ['AWS', 'Azure', 'Kubernetes'],
    competencies: [
      'System design patterns',
      'Cost optimization (FinOps)',
      'Multi-cloud strategy',
      'Scalability planning'
    ],
    display_order: 11,
    is_active: true
  }
]

// ... (Technology data)

// ... (Effect and fetch logic)

// RENDER LOGIC UPDATE


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

    let totalMiliseconds = duration
    let incrementTime = (totalMiliseconds / end)

    let timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

export default function About({ isActive = false }: AboutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const scrollTrackRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [aboutText, setAboutText] = useState('Recent Computer Science graduate building toward MLOps Architect. Focused on gaining production experience through hands-on projects in ML deployment, Kubernetes, and cloud infrastructure. Learning in public and documenting my journey from theory to production systems.')
  // Initialize with fallback to ensure MLOps content is present by default
  const [expertiseAreas, setExpertiseAreas] = useState<AboutContent[]>(FALLBACK_EXPERTISE)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>(FALLBACK_TECHNOLOGIES)

  // Dynamic stats for welcome banner (aligned with MLOps roadmap)
  const [skillCount, setSkillCount] = useState(40)
  const [projectCount, setProjectCount] = useState(25)
  const [kpiStats, setKpiStats] = useState<KpiStats>({
    years_experience: '3+',
    current_phase: '0/8',
    expertise_breakdown: { software: 40, cloud_infra: 25, data: 15, ml_ai: 20 }
  })
  const [currentFocus, setCurrentFocus] = useState('DevOps')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)

  useEffect(() => {
    fetchAboutData()
  }, [])

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

        if (info.about_text) {
          setAboutText(info.about_text)
        }

        // Set expertise from JSONB field
        if (info.expertise && Array.isArray(info.expertise)) {
          const expertiseData = info.expertise as unknown as AboutContent[]
          if (expertiseData.length > 0) {
            setExpertiseAreas(expertiseData)
          }
        }

        // Set KPI stats from JSONB field for the welcome banner
        if (info.kpi_stats) {
          setKpiStats(info.kpi_stats as unknown as KpiStats)
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

      // Update project count from GitHub (more accurate than DB)
      try {
        const githubService = new GitHubService(GITHUB_TOKEN)
        const repos = await githubService.getRepositories(GITHUB_USERNAME, {
          maxRepos: 100,
          sortBy: 'updated',
          includePrivate: Boolean(GITHUB_TOKEN)
        })
        if (repos.length > 0) {
          setProjectCount(repos.length)
        }
      } catch (e) {
        console.error('Error fetching GitHub repos:', e)
      }

      // Update skills count
      if (skillsResult.data) {
        setSkillCount(skillsResult.data.length)
      }

      // Fetch roadmap info for banner
      const { data: phasesData } = await (supabase as any).from('roadmap_phases').select('*').order('phase_number')
      if (phasesData && phasesData.length > 0) {
        const completedCount = phasesData.filter((p: any) => p.status === 'completed').length
        const totalCount = phasesData.length
        const currentPhaseObj = phasesData.find((p: any) => p.status === 'in_progress') || phasesData.find((p: any) => p.status === 'upcoming')

        setKpiStats(prev => ({
          ...prev,
          current_phase: `${completedCount}/${totalCount}`
        }))

        if (currentPhaseObj) {
          setCurrentFocus(currentPhaseObj.target_role || currentPhaseObj.title)
        }
      }

    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Duplicate technologies for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies]

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
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--orange-yellow-crayola)' }} />
          <p>Loading...</p>
        </div>
      </article>
    )
  }

  const renderExpertiseCard = (area: AboutContent) => {
    const IconComponent = area.icon && iconMap[area.icon] ? iconMap[area.icon] : Code
    // Get relevant certifications for this expertise area
    const relevantCerts = CERT_TO_EXPERTISE[area.section_key] || []

    return (
      <div key={area.id} className="expertise-item-wrapper w-full relative group">
        {/* Glow Effect Layer */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

        {/* Main Card Content */}
        <div className="relative h-full bg-gradient-to-br from-[var(--bg-secondary)]/90 to-[var(--bg-secondary)]/50 backdrop-blur-md rounded-2xl p-5 flex flex-col border border-[var(--border-primary)] hover:border-[var(--accent-secondary)]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(201,169,97,0.15)]">

          {/* Header: Icon + Cert Badges + Skill Badge */}
          <div className="flex justify-between items-start mb-4">
            {/* Left side: Icon + Cert Badges */}
            <div className="flex items-center gap-2">
              {/* Icon - Compact */}
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-primary)] text-[var(--accent-primary)] border border-[var(--border-primary)] shadow-sm group-hover:text-[var(--accent-secondary)] group-hover:border-[var(--accent-secondary)]/30 transition-all duration-300">
                <IconComponent size={20} className="w-5 h-5" />
              </div>

              {/* Certification Badges */}
              {relevantCerts.length > 0 && (
                <div className="flex items-center gap-1">
                  {relevantCerts.map(certKey => {
                    const cert = CERT_BADGES[certKey]
                    if (!cert) return null
                    return (
                      <div
                        key={certKey}
                        className="relative w-7 h-7 rounded-lg bg-white/80 border border-[var(--border-primary)] shadow-sm overflow-hidden hover:scale-110 hover:shadow-md transition-all duration-200 cursor-help"
                        title={cert.name}
                      >
                        <img
                          src={cert.icon}
                          alt={cert.name}
                          className="w-full h-full object-contain p-0.5"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Badge - Compact Pill */}
            {area.badge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10 backdrop-blur-sm group-hover:bg-[var(--accent-secondary)]/10 group-hover:border-[var(--accent-secondary)]/20 transition-colors duration-300">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--accent-primary)] group-hover:bg-[var(--accent-secondary)]"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent-primary)] group-hover:bg-[var(--accent-secondary)]"></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors duration-300">{area.badge}</span>
              </div>
            )}
          </div>

          {/* Typography - More Compact */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-secondary)] transition-colors duration-300 font-display tracking-tight leading-tight">{area.title}</h3>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed font-light">{area.content}</p>
          </div>

          {/* Competencies - Compact List */}
          {area.competencies && area.competencies.length > 0 && (
            <div className="mb-4 space-y-1.5">
              {area.competencies.slice(0, 3).map((comp, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)]/90 group-hover:text-[var(--text-secondary)] transition-colors">
                  <div className="mt-1 w-0.5 h-0.5 rounded-full bg-[var(--accent-secondary)]/70 shadow-[0_0_5px_rgba(201,169,97,0.5)]"></div>
                  <span className="leading-tight">{comp}</span>
                </div>
              ))}
              {area.competencies.length > 3 && (
                <div className="text-[10px] text-[var(--text-tertiary)] pl-2.5">+{area.competencies.length - 3} more</div>
              )}
            </div>
          )}

          {/* Tech Stack - Compact Pills */}
          {area.tags && (
            <div className="mt-auto pt-4 border-t border-[var(--border-primary)]/30 group-hover:border-[var(--accent-secondary)]/20 transition-colors duration-300">
              <div className="flex flex-wrap gap-1.5">
                {area.tags.slice(0, 4).map(tag => {
                  const logoUrl = LOGO_MAP[tag];
                  return (
                    <div key={tag} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--bg-primary)]/50 border border-[var(--border-primary)]/40 hover:border-[var(--accent-secondary)]/40 hover:bg-[var(--bg-primary)] hover:shadow-sm transition-all duration-200 cursor-default group/tag">
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt={tag}
                          className="w-3 h-3 object-contain opacity-60 grayscale group-hover/tag:grayscale-0 group-hover/tag:opacity-100 transition-all duration-300"
                        />
                      )}
                      <span className="text-[9px] font-medium text-[var(--text-tertiary)] group-hover/tag:text-[var(--text-primary)] whitespace-nowrap transition-colors">{tag}</span>
                    </div>
                  )
                })}
                {area.tags.length > 4 && (
                  <span className="text-[9px] text-[var(--text-tertiary)] self-center px-1">+{area.tags.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {/* Proof of Work - New deep link */}
          {area.proof_of_work && (
            <div className="mt-3">
              <a
                href={area.proof_of_work.url}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors group/pow"
              >
                <Workflow size={12} className="group-hover/pow:rotate-12 transition-transform" />
                <span>{area.proof_of_work.label}</span>
                <ChevronRight size={10} className="group-hover/pow:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <article className={`about portfolio-tab ${isActive ? 'active' : ''}`} data-page="about">
      {/* Welcome Banner - Compact */}
      <section className="welcome-banner compact">
        <div className="welcome-left">
          <h2 className="welcome-title">Build Fast. <span>Deploy Faster. Scale Smart.</span></h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="welcome-subtitle">MLOps Engineer in Training • Focusing on: <span className="text-[var(--accent-secondary)] font-semibold">{currentFocus}</span></p>
            <div className="px-2 py-0.5 rounded-md bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">
              Phase {kpiStats.current_phase}
            </div>
          </div>

          {/* Expertise Breakdown Pills */}
          <ExpertiseProgressBar breakdown={kpiStats.expertise_breakdown || { software: 40, cloud_infra: 25, data: 15, ml_ai: 20 }} />
        </div>

        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="stat-row">
              <svg className="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="5" />
                <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
              </svg>
              <span className="welcome-stat-value"><StatCounter value={parseInt(kpiStats.years_experience || '3')} />+</span>
            </div>
            <span className="welcome-stat-label">Years</span>
          </div>
          <div className="welcome-stat">
            <div className="stat-row">
              <svg className="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="welcome-stat-value"><StatCounter value={skillCount} />+</span>
            </div>
            <span className="welcome-stat-label">Skills</span>
          </div>
          <div className="welcome-stat">
            <div className="stat-row">
              <svg className="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="welcome-stat-value"><StatCounter value={projectCount} />+</span>
            </div>
            <span className="welcome-stat-label">Projects</span>
          </div>
        </div>
      </section>

      {/* Featured Projects & GitHub Activity - Side by Side */}
      <section className="github-activity-full">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 min-w-0">
            <FeaturedProjectsCarousel compact />
          </div>
          <div className="flex-1 min-w-0">
            <GitHubStatsWidget compact />
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid - Crextio Style */}
      <div className="dashboard-grid">
        {/* Left Column - Profile Card + Blog Widget */}
        <div className="dashboard-left">
          {/* Profile Card */}
          <Sidebar />
          {/* Latest Blog Posts */}
          <LatestBlogWidget />
        </div>

        {/* Center Column - Main Content */}
        <div className="dashboard-center">
          {/* Dashboard Identity Card - Inspired by OxeliaMetrix */}

          {/* Certifications Showcase */}
          <CertificationShowcase />

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="testimonials-section">
              <h3 className="section-title">Recommendations</h3>
              <ul className="testimonials-list has-scrollbar">
                {testimonials.map(testimonial => (
                  <li key={testimonial.id} className="testimonials-item min-w-[280px] md:min-w-[340px] lg:min-w-[380px] snap-center">
                    <div
                      className="group relative h-full bg-gradient-to-br from-[var(--bg-secondary)]/80 to-[var(--bg-secondary)]/40 backdrop-blur-md rounded-2xl p-6 pt-12 border border-[var(--border-primary)] hover:border-[var(--accent-secondary)]/40 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(142,14,40,0.1)] cursor-pointer"
                      onClick={() => openTestimonialModal(testimonial)}
                    >
                      <figure className="absolute top-0 left-6 -translate-y-1/2 w-16 h-16 rounded-xl overflow-hidden border-2 border-[var(--bg-primary)] shadow-lg group-hover:scale-105 group-hover:border-[var(--accent-secondary)] transition-all duration-300">
                        <img
                          src={testimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">{testimonial.name}</h4>
                      <div className="relative">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4 font-light italic">"{testimonial.text}"</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[var(--border-primary)]/20 flex justify-between items-center">
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

        {/* Right Column - Stats Widgets */}
        <div className="dashboard-right">
          <CareerTimelineWidget />
        </div>
      </div>

      {/* Experience Roadmap - Full Width */}
      <section className="github-activity-full">
        <ExperienceGanttChart />
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
                <img
                  src={selectedTestimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                  alt={selectedTestimonial.name}
                  width="80"
                />
              </figure>
              <img src="/assets/images/icon-quote.svg" alt="quote icon" />
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

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .infinite-scroll-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin: 20px 0;
          padding: 15px 0;
        }
        
        .identity-card {
          padding: 32px;
          margin-bottom: 24px;
          position: relative;
        }

        .avatar-box {
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.1);
        }

        .card-middle h1 {
          letter-spacing: -0.05em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        @keyframes progress-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .card-bottom .h-2 > div {
          background-size: 200% 100%;
          animation: progress-shimmer 3s infinite linear;
        }
        
        .infinite-scroll-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
        
        .infinite-scroll-track {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        
        .infinite-scroll-container:hover .infinite-scroll-track {
          animation-play-state: paused;
        }
        
        .tech-item {
          flex: 0 0 auto;
          width: 100px;
          margin: 0 15px;
          text-align: center;
          transition: transform 0.3s ease;
        }
        
        .tech-item:hover {
          transform: translateY(-5px);
        }
        
        .tech-item img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin: 0 auto 8px;
          filter: grayscale(100%);
          opacity: 0.7;
          transition: all 0.3s ease;
          will-change: transform, filter, opacity;
          backface-visibility: hidden;
        }
        
        .tech-item:hover img {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.1);
        }
        
        .tech-name {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 5px;
          font-weight: 500;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .testimonials-list.has-scrollbar {
          scrollbar-width: none;
        }
        
        .testimonials-list.has-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 580px) {
          .tech-item {
            width: 80px;
            margin: 0 10px;
          }
          
          .tech-item img {
            width: 50px;
            height: 50px;
          }
          
          .tech-name {
            font-size: 11px;
          }
          
          .infinite-scroll-track {
            animation: scroll 25s linear infinite;
          }
        }
        
        @media (max-width: 449px) {
          .tech-item {
            width: 70px;
            margin: 0 8px;
          }
          
          .tech-item img {
            width: 45px;
            height: 45px;
          }
          
          .tech-name {
            font-size: 10px;
          }
        }
      `}</style>
    </article >
  )
}
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  CheckCircle2,
  Download,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  X,
  Youtube,
} from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import {
  backdropVariants,
  sidebarSlideUp,
  sidebarTransition,
  buttonTap,
} from '@/lib/motion'

interface SocialLink {
  id?: string
  platform: string
  url: string
  icon_url: string | null
  is_active?: boolean
}

interface PersonalInfo {
  full_name: string
  title: string
  avatar_url: string | null
  about_text: string | null
  email?: string
  phone?: string
  location?: string
  social_links?: SocialLink[] | null
}

const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  full_name: 'Abdulrahman Ambooka',
  title: 'MLOps Architect & Software Engineer',
  avatar_url: null,
  about_text: 'Building production-ready ML systems. Focused on bridging the gap between data science and reliable infrastructure.',
  email: 'hello@ambooka.dev',
  phone: undefined,
  location: 'Nairobi, Kenya',
  social_links: []
}

interface ObtainedCert {
  id: string
  name: string
  icon_url: string | null
  phase_number: number | null
}

interface SidebarProps {
  isModal?: boolean
  isOpen?: boolean
  onClose?: () => void
  onOpenResume?: () => void
}

const PROFILE_SNAPSHOT = [
  { label: 'Experience', value: '3+ years' },
  { label: 'Direction', value: 'CS -> AI/ML' },
  { label: 'Build style', value: 'Public + iterative' },
]

const CURRENT_STACK = ['Python', 'Docker', 'PostgreSQL', 'GitHub Actions']

export default function Sidebar({ isModal = false, isOpen = false, onClose, onOpenResume }: SidebarProps) {
  const [loading, setLoading] = useState(true)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [obtainedCerts, setObtainedCerts] = useState<ObtainedCert[]>([])
  const profile = personalInfo ?? DEFAULT_PERSONAL_INFO
  const isStandardSidebar = !isModal

  useEffect(() => {
    fetchSidebarData()
  }, [])

  const fetchSidebarData = async () => {
    try {
      type DBCert = { id: string; name: string; icon_url: string | null; phase_number: number | null }

      const [infoRes, certsRes] = await Promise.all([
        supabase.from('personal_info').select('*').limit(1).maybeSingle(),
        (supabase as unknown as { from: (table: string) => { select: (cols: string) => { eq: (col: string, value: boolean) => { order: (col: string) => Promise<{ data: DBCert[] | null; error: unknown }> } } } })
          .from('certifications')
          .select('id, name, icon_url, phase_number')
          .eq('is_obtained', true)
          .order('phase_number'),
      ])

      if (infoRes.data) {
        const info = infoRes.data as unknown as PersonalInfo
        setPersonalInfo(info)
        if (info.social_links && Array.isArray(info.social_links)) {
          setSocialLinks(info.social_links.filter(link => link.is_active !== false))
        }
      }

      if (certsRes.data) {
        setObtainedCerts(certsRes.data as unknown as ObtainedCert[])
      }
    } catch (error) {
      console.error('Sidebar fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const shortCertName = (name: string): string => {
    const map: Record<string, string> = {
      'B.Sc. Computer Science \u2014 Maseno University': 'BSc Computer Science',
      'Bachelor of Science in Computer Science': 'BSc Computer Science',
    }
    const normalized = map[name] ?? name
    return normalized.length > 30 ? normalized.slice(0, 28) + '\u2026' : normalized
  }

  const certBadgeFallback = (name: string): string => {
    const lower = name.toLowerCase()
    if (lower.includes('aws')) return 'https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png'
    if (lower.includes('terraform')) return 'https://images.credly.com/size/340x340/images/99289602-861e-4929-8277-773e63a2fa6f/image.png'
    if (lower.includes('kubernetes') || lower.includes('cka')) return 'https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png'
    return '/assets/badges/maseno-university.png'
  }

  const renderSocialIcon = (social: SocialLink): ReactNode => {
    const key = social.platform.toLowerCase()
    const commonProps = { size: 18, strokeWidth: 2 }

    switch (key) {
      case 'github': return <Github {...commonProps} />
      case 'linkedin': return <Linkedin {...commonProps} />
      case 'twitter':
      case 'x': return <Twitter {...commonProps} />
      case 'instagram': return <Instagram {...commonProps} />
      case 'youtube': return <Youtube {...commonProps} />
      case 'telegram':
      case 'whatsapp': return <MessageCircle {...commonProps} />
      default:
        if (social.icon_url) {
          return (
            <Image
              src={social.icon_url}
              alt={social.platform}
              width={18}
              height={18}
              className="object-contain"
              unoptimized
            />
          )
        }
        return <Globe {...commonProps} />
    }
  }

  const handleOpenResume = () => {
    if (onOpenResume) {
      onOpenResume()
      onClose?.()
      return
    }

    window.dispatchEvent(new CustomEvent('open-resume-modal'))
    onClose?.()
  }

  if (loading) {
    return (
      <div className={cn(
        isModal ? "fixed inset-0 z-[2000] flex items-end justify-center transition-opacity duration-300" : "w-full",
        isModal && isOpen ? "opacity-100 pointer-events-auto" : isModal ? "opacity-0 pointer-events-none" : ""
      )}>
        {isModal && <div className="absolute inset-0 bg-[#090f12]/50 backdrop-blur-md" onClick={onClose} />}

        <aside className={cn(
          "relative z-10 w-full overflow-hidden rounded-[24px] border border-[hsl(var(--border))]",
          "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]",
          "shadow-xl transition-transform duration-300",
          isModal ? "max-w-[36rem] max-h-[92vh] rounded-b-none" : "",
          isModal && !isOpen ? "translate-y-full" : isModal ? "translate-y-0" : ""
        )}>
          {isModal && <div className="w-12 h-1.5 rounded-full bg-[hsl(var(--muted-foreground))/0.4] mx-auto mt-3" />}
          <div className="flex items-center justify-center min-h-[24rem] text-[hsl(var(--accent))]">
            <Loader2 size={28} className="animate-spin" />
          </div>
        </aside>
      </div>
    )
  }

  const renderContent = () => (
    <div className={cn(
      "relative overflow-y-auto max-h-inherit",
      isModal ? "p-[1.4rem] pb-[calc(1.4rem+env(safe-area-inset-bottom))] max-sm:p-4" : "p-4"
    )}>
      {/* ━━━ Hero: Header + Profile Photo ━━━ */}
      <div className={cn(
        "grid items-start mb-6 max-sm:grid-cols-1 max-sm:text-left",
        isModal ? "grid-cols-[1fr_auto] gap-5" : "grid-cols-[1fr_auto] gap-3 mb-4"
      )}>
        <div className="min-w-0">
          <h2 className={cn(
            "font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]",
            isModal ? "text-[clamp(1.6rem,3.5vw,2.2rem)] mb-3" : "text-xl mb-2"
          )}>About me</h2>
          <p className={cn("text-[hsl(var(--foreground))] leading-snug mb-1", isModal ? "text-sm" : "text-xs")}>Hi!</p>
          <p className={cn("text-[hsl(var(--muted-foreground))] leading-relaxed mb-1.5", isModal ? "text-sm" : "text-[0.76rem]")}>
            My name is <strong className="text-[hsl(var(--foreground))]">{profile.full_name}</strong>.
          </p>
          <p className={cn("text-[hsl(var(--muted-foreground))] leading-relaxed mb-1.5", isModal ? "text-sm" : "text-[0.76rem]")}>
            I am {profile.title ? <span>a <strong className="text-[hsl(var(--foreground))]">{profile.title.split(' ')[0]}</strong> {profile.title.split(' ').slice(1).join(' ')}</span> : 'a Software Engineer'} based in {profile.location || 'Nairobi, Kenya'} with experience through projects and subjects in university.
          </p>
          <p className={cn("italic text-[hsl(var(--muted-foreground))] leading-relaxed mt-2.5", isModal ? "text-[0.78rem]" : "text-xs line-clamp-2")}>
            {profile.about_text || 'Building production-ready ML systems. Focused on bridging the gap between data science and reliable infrastructure.'}
          </p>
        </div>
        <div className="shrink-0 max-sm:-order-1 max-sm:justify-self-center">
          <div className={cn(
            "rounded-[1.5rem] p-[3px] overflow-hidden",
            "bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--secondary))]",
            "shadow-[0_0_20px_hsl(var(--accent)/0.3)]",
            isModal ? "w-[8.5rem] h-[10rem] max-sm:w-28 max-sm:h-32" : "w-[5.5rem] h-[6.5rem] rounded-[1.1rem] shadow-[0_0_12px_hsl(var(--accent)/0.2)]"
          )}>
            <Image
              src={profile.avatar_url || '/assets/images/my-avatar.jpg'}
              alt={profile.full_name}
              width={160}
              height={160}
              className={cn("w-full h-full object-cover object-[center_22%] block", isModal ? "rounded-[calc(1.5rem-3px)]" : "rounded-[calc(1.1rem-3px)]")}
              priority
            />
          </div>
        </div>
      </div>

      {/* ━━━ Contact ━━━ */}
      <div className={cn("mb-5", isModal ? "" : "mb-3.5")}>
        <h3 className={cn("font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]", isModal ? "text-[1.15rem] mb-2.5" : "text-[0.92rem] mb-2")}>Contact</h3>
        <div className={cn("grid gap-2.5 max-sm:grid-cols-1", isModal ? "grid-cols-2" : "grid-cols-1 gap-1.5")}>
          {profile.email && (
            <a href={`mailto:${profile.email}`} className={cn("flex items-center gap-2 text-[hsl(var(--muted-foreground))] no-underline font-medium rounded-lg transition-colors min-w-0 hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.06)]", isModal ? "text-[0.78rem] p-2" : "text-xs p-1.5 gap-1.5")}>
              <Mail size={16} className="shrink-0 text-[hsl(var(--accent))]" />
              <span className="truncate">{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className={cn("flex items-center gap-2 text-[hsl(var(--muted-foreground))] no-underline font-medium rounded-lg transition-colors min-w-0 hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.06)]", isModal ? "text-[0.78rem] p-2" : "text-xs p-1.5 gap-1.5")}>
              <Phone size={16} className="shrink-0 text-[hsl(var(--accent))]" />
              <span className="truncate">{profile.phone}</span>
            </a>
          )}
          {socialLinks.filter(s => s.platform.toLowerCase() === 'linkedin').map((social, i) => (
            <a key={social.id || i} href={social.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2 text-[hsl(var(--muted-foreground))] no-underline font-medium rounded-lg transition-colors min-w-0 hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.06)]", isModal ? "text-[0.78rem] p-2" : "text-xs p-1.5 gap-1.5")}>
              <Linkedin size={16} className="shrink-0 text-[hsl(var(--accent))]" />
              <span className="truncate">{social.url.replace('https://www.', '').replace('https://', '')}</span>
            </a>
          ))}
          {socialLinks.filter(s => !['linkedin'].includes(s.platform.toLowerCase())).slice(0, 1).map((social, i) => (
            <a key={social.id || i} href={social.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2 text-[hsl(var(--muted-foreground))] no-underline font-medium rounded-lg transition-colors min-w-0 hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.06)]", isModal ? "text-[0.78rem] p-2" : "text-xs p-1.5 gap-1.5")}>
              <div className="shrink-0 text-[hsl(var(--accent))]">
                {renderSocialIcon(social)}
              </div>
              <span className="truncate">{social.url.replace('https://www.', '').replace('https://', '')}</span>
            </a>
          ))}
          {profile.location && (
            <div className={cn("flex items-center gap-2 text-[hsl(var(--muted-foreground))] font-medium rounded-lg min-w-0", isModal ? "text-[0.78rem] p-2" : "text-xs p-1.5 gap-1.5")}>
              <MapPin size={16} className="shrink-0 text-[hsl(var(--accent))]" />
              <span className="truncate">{profile.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* ━━━ Two-column sections ━━━ */}
      <div className={cn("grid gap-5 max-[400px]:grid-cols-1", isModal ? "grid-cols-2" : "gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2")}>
        {/* Left column */}
        <div className="min-w-0">
          {/* Education / Credentials */}
          <div className={cn("mb-5", isModal ? "" : "mb-3.5")}>
            <h3 className={cn("font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]", isModal ? "text-[1.15rem] mb-2.5" : "text-[0.92rem] mb-2")}>Education</h3>
            {obtainedCerts.length > 0 ? (
              <div className="flex flex-col gap-2">
                {obtainedCerts.map(cert => (
                  <div key={cert.id} className={cn("flex items-center gap-2 text-[hsl(var(--muted-foreground))] font-medium", isModal ? "text-[0.8rem]" : "text-[0.72rem] gap-1.5")}>
                    <Image
                      src={cert.icon_url || certBadgeFallback(cert.name)}
                      alt={cert.name}
                      width={isModal ? 24 : 20}
                      height={isModal ? 24 : 20}
                      className="rounded-md object-contain shrink-0"
                      unoptimized
                    />
                    <span>{shortCertName(cert.name)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className={cn("flex items-center gap-2 text-[hsl(var(--muted-foreground))] font-medium", isModal ? "text-[0.8rem]" : "text-[0.72rem] gap-1.5")}>
                  <CheckCircle2 size={16} className="shrink-0 text-[hsl(var(--accent))]" />
                  <span>BSc Computer Science</span>
                </div>
              </div>
            )}
          </div>

          {/* Technical Skills / Current Stack */}
          <div className={cn("mb-5", isModal ? "" : "mb-3.5")}>
            <h3 className={cn("font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]", isModal ? "text-[1.15rem] mb-2.5" : "text-[0.92rem] mb-2")}>Technical skill</h3>
            <div className="flex flex-wrap gap-2">
              {CURRENT_STACK.map(item => (
                <span key={item} className={cn(
                  "inline-flex items-center justify-center rounded-lg bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] font-semibold transition-all hover:-translate-y-px hover:bg-[hsl(var(--accent)/0.18)]",
                  isModal ? "px-2.5 py-1.5 text-xs" : "px-2 py-1 text-[0.62rem]"
                )}>{item}</span>
              ))}
            </div>
          </div>

          {/* Interest */}
          <div className={cn("mb-5", isModal ? "" : "mb-3.5")}>
            <h3 className={cn("font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]", isModal ? "text-[1.15rem] mb-2.5" : "text-[0.92rem] mb-2")}>Interest</h3>
            <div className={cn("flex items-center text-[hsl(var(--muted-foreground))] font-medium", isModal ? "gap-2.5 text-sm" : "gap-1.5 text-xs")}>
              <span>AI/ML</span>
              <span className="text-[hsl(var(--muted-foreground))/0.5]">|</span>
              <span>Cloud</span>
              <span className="text-[hsl(var(--muted-foreground))/0.5]">|</span>
              <span>DevOps</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="min-w-0">
          {/* Soft Skills / Profile Summary */}
          <div className={cn("mb-5", isModal ? "" : "mb-3.5")}>
            <h3 className={cn("font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]", isModal ? "text-[1.15rem] mb-2.5" : "text-[0.92rem] mb-2")}>Soft skill</h3>
            <div className="flex flex-col gap-2">
              {PROFILE_SNAPSHOT.map(item => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <span className={cn("uppercase tracking-widest font-bold text-[hsl(var(--muted-foreground))]", isModal ? "text-[0.62rem]" : "text-[0.56rem]")}>{item.label}</span>
                  <span className={cn("font-semibold text-[hsl(var(--foreground))]", isModal ? "text-[0.78rem]" : "text-xs")}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Set */}
          <div className={cn("mb-5", isModal ? "" : "mb-3.5")}>
            <h3 className={cn("font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]", isModal ? "text-[1.15rem] mb-2.5" : "text-[0.92rem] mb-2")}>Skill set</h3>
            <div className={cn("flex flex-col text-[hsl(var(--muted-foreground))] font-medium", isModal ? "gap-2 text-sm" : "gap-1.5 text-xs")}>
              <span>ML Pipelines</span>
              <span>Web Design</span>
              <span>System Architecture</span>
              <span>Cloud Infra</span>
            </div>
          </div>

          {/* Connect / Social */}
          {socialLinks.length > 0 && (
            <div className={cn("mb-5", isModal ? "" : "mb-3.5")}>
              <h3 className={cn("font-serif italic font-bold text-[hsl(var(--foreground))] tracking-[-0.01em]", isModal ? "text-[1.15rem] mb-2.5" : "text-[0.92rem] mb-2")}>Connect</h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.id || index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--foreground)/0.04)] text-[hsl(var(--muted-foreground))] no-underline transition-all hover:-translate-y-0.5 hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent)/0.25)] hover:bg-[hsl(var(--accent)/0.08)]",
                      isModal ? "w-9 h-9 rounded-[12px]" : "w-8 h-8 rounded-[10px]"
                    )}
                    title={social.platform}
                    aria-label={social.platform}
                  >
                    {renderSocialIcon(social)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ━━━ Action Buttons ━━━ */}
      <div className={cn("grid gap-2.5 mt-3 max-[768px]:grid-cols-2", isModal ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 max-md:grid-cols-2")}>
        <a href={`mailto:${profile.email || 'hello@ambooka.dev'}`} className={cn(
          "inline-flex items-center justify-center gap-2 border-0 text-[0.78rem] font-extrabold no-underline cursor-pointer transition-all hover:-translate-y-0.5",
          "bg-gradient-to-br from-[hsl(var(--accent)/0.96)] to-[hsl(168_80%_35%/0.92)] text-white shadow-[0_12px_24px_hsl(var(--accent)/0.2)] hover:shadow-[0_16px_32px_hsl(var(--accent)/0.28)]",
          isModal ? "min-h-[2.6rem] p-2.5 rounded-xl" : "min-h-[2.2rem] p-2 rounded-lg text-xs"
        )}>
          <Mail size={16} />
          <span>Email Me</span>
        </a>
        <button onClick={handleOpenResume} className={cn(
          "inline-flex items-center justify-center gap-2 text-[0.78rem] font-extrabold no-underline cursor-pointer transition-all hover:-translate-y-0.5",
          "bg-[hsl(var(--foreground)/0.06)] dark:bg-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] shadow-sm hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent)/0.2)] hover:bg-[hsl(var(--accent)/0.05)]",
          isModal ? "min-h-[2.6rem] p-2.5 rounded-xl" : "min-h-[2.2rem] p-2 rounded-lg text-xs"
        )} type="button">
          <Download size={16} />
          <span>Open Resume</span>
        </button>
      </div>

      {/* Decorative corner SVG */}
      <div className={cn("absolute bottom-0 right-0 pointer-events-none text-[hsl(var(--accent))] opacity-60", isModal ? "w-40 h-40" : "w-24 h-24")} aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M160 200 C160 140 200 120 200 60" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
          <path d="M140 200 C140 150 190 130 200 80" stroke="currentColor" strokeWidth="0.8" opacity="0.1" fill="none" />
          <circle cx="180" cy="180" r="30" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />
        </svg>
      </div>
    </div>
  )

  // Standard sidebar (non-modal, desktop)
  if (isStandardSidebar) {
    return (
      <aside className={cn(
        "relative w-full overflow-hidden rounded-[24px] border border-[hsl(var(--border))]",
        "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/50",
        "shadow-xl"
      )}>
        {renderContent()}
      </aside>
    )
  }

  // Modal sidebar with framer-motion
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-[#090f12]/50 backdrop-blur-md"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              "relative z-10 w-full max-w-[36rem] max-h-[92vh] overflow-hidden",
              "rounded-[24px] rounded-b-none border border-[hsl(var(--border))]",
              "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/50",
              "shadow-xl"
            )}
            variants={sidebarSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={sidebarTransition}
          >
            <div className="w-12 h-1.5 rounded-full bg-[hsl(var(--muted-foreground))/0.4] mx-auto mt-3" />
            <motion.button
              className="absolute top-4 right-4 z-10 w-9 h-9 border-0 rounded-full inline-flex items-center justify-center bg-[hsl(var(--card))/0.7] text-[hsl(var(--foreground))] backdrop-blur-md cursor-pointer transition-colors duration-200 hover:bg-[hsl(var(--card))]"
              onClick={onClose}
              aria-label="Close profile"
              whileHover={{ rotate: 90 }}
              whileTap={buttonTap}
            >
              <X size={18} />
            </motion.button>
            {renderContent()}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}


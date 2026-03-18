'use client'

import React from 'react'
import Image from 'next/image'
import {
    GraduationCap,
    MapPin,
    Rocket,
    Github,
    Linkedin,
    Twitter,
    Instagram,
    Youtube,
    MessageCircle,
    Mail,
    Download,
    Globe
} from 'lucide-react'

export interface SocialLink {
  id?: string
  platform: string
  url: string
  icon_url: string | null
  is_active?: boolean
}

export interface PersonalInfo {
  full_name: string
  title: string
  avatar_url: string | null
  about_text: string | null
  email?: string
  phone?: string
  location?: string
  social_links?: SocialLink[] | null
}

export interface ProfileWidgetProps {
    personalInfo?: PersonalInfo | null;
    onOpenResume?: () => void;
}

const PROFILE_FACTS = [
    { label: 'Base', value: 'Nairobi, Kenya' },
]

const CURRENT_FOCUS = [
    'Python foundations',
    'Docker + Linux',
    'PostgreSQL + APIs',
    'CI/CD workflows',
]

const EDUCATION = [
    {
        degree: 'BSc Computer Science',
        school: 'Maseno University',
        year: '2019 - 2024',
        logo: '/assets/badges/maseno-university.png',
    },
    {
        degree: 'KCSE',
        school: "Starehe Boys' Centre",
        year: '2015 - 2018',
        logo: '/images/starehe-logo.png',
    },
]

const LANGUAGES = [
    { name: 'English', flag: '🇺🇸' },
    { name: 'Swahili', flag: '🇰🇪' },
    { name: 'German', flag: '🇩🇪' },
    { name: 'Arabic', flag: '🇸🇦' },
]

export default function ProfileWidget({ personalInfo, onOpenResume }: ProfileWidgetProps = {}) {
    const profile = personalInfo || {
        full_name: 'Abdulrahman Ambooka',
        title: 'MLOps Architect & Software Engineer',
        avatar_url: '/assets/images/my-avatar.jpg',
        about_text: 'Building production-ready ML systems. Focused on bridging the gap between data science and reliable infrastructure.',
        location: 'Nairobi, Kenya',
        social_links: []
    } as PersonalInfo;
    
    const socialLinks = (profile.social_links || []).filter(link => link.is_active !== false);

    const renderSocialIcon = (social: SocialLink) => {
        const key = social.platform.toLowerCase()
        const commonProps = { size: 16, strokeWidth: 2 }
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
                    return <Image src={social.icon_url} alt={social.platform} width={16} height={16} className="object-contain" unoptimized />
                }
                return <Globe {...commonProps} />
        }
    }

    return (
        <article className="relative overflow-hidden rounded-2xl p-4 sm:p-5 border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--accent))/0.07] to-transparent bg-[hsl(var(--card))] shadow-sm transition-all hover:border-[hsl(var(--border))] hover:shadow-md">
            <div className="flex items-center gap-3 mb-3.5 text-xs font-extrabold tracking-widest uppercase text-[hsl(var(--foreground))]">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[hsl(var(--accent))/0.12] text-[hsl(var(--accent))] shrink-0">
                    <Rocket size={16} />
                </div>
                <span>Build Profile & Education</span>
            </div>

            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 xl:gap-8">
                {/* Left Column: Bio and CTAs */}
                <div className="flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] overflow-hidden shrink-0 border border-[hsl(var(--border))] shadow-md bg-[hsl(var(--card))]">
                            <Image
                                src={profile.avatar_url || '/assets/images/my-avatar.jpg'}
                                alt={profile.full_name || 'Avatar'}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover object-[center_22%]"
                                priority
                            />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                    CS Graduate
                                </span>
                            </div>
                            <h3 className="m-0 text-[1.1rem] sm:text-xl font-extrabold leading-tight tracking-tight text-[hsl(var(--foreground))] truncate">
                                {profile.full_name || 'Abdulrahman Ambooka'}
                            </h3>
                            <div className="text-[0.78rem] sm:text-[0.85rem] text-[hsl(var(--muted-foreground))] font-medium mt-0.5 truncate">
                                {profile.title || 'MLOps Architect & Software Engineer'}
                            </div>
                        </div>
                    </div>

                    <p className="m-0 text-[0.84rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {profile.about_text || 'I am a computer science graduate building the Nexus platform in public as a practical route from full-stack delivery into AI/ML engineering.'}
                    </p>

                    <p className="m-0 mt-3 text-[0.84rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                        The work I enjoy most sits at the intersection of useful products, dependable infrastructure, and clear communication. I like shipping things people can actually use, then tightening the system until it feels calm and intentional.
                    </p>

                    <div className="flex flex-wrap gap-2.5 mt-4">
                        {onOpenResume && (
                            <button
                                onClick={onOpenResume}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.9)] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                            >
                                <Download size={14} /> Resume
                            </button>
                        )}
                        {profile.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[hsl(var(--accent))/0.1] hover:bg-[hsl(var(--accent))/0.18] text-[hsl(var(--accent))] border border-[hsl(var(--accent))/0.2] text-xs font-bold transition-colors"
                            >
                                <Mail size={14} /> Email Me
                            </a>
                        )}
                        {socialLinks.slice(0, 4).map((social, i) => (
                            <a
                                key={social.id || i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-[8px] border border-[hsl(var(--border))] bg-white/40 dark:bg-black/20 text-[hsl(var(--muted-foreground))] shadow-sm hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--muted-foreground))/0.5] transition-all"
                                title={social.platform}
                            >
                                {renderSocialIcon(social)}
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {PROFILE_FACTS.map((fact) => (
                            <span key={fact.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] text-xs font-semibold shadow-sm">
                                {fact.label === 'Base' && <MapPin size={14} />}
                                <strong className="text-[hsl(var(--foreground))] mr-0.5">{fact.label}:</strong> {fact.value}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-[hsl(var(--border))]">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 ml-1">
                            <Globe size={14} /> Languages
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                                <span key={lang.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] text-xs font-semibold shadow-sm transition-colors hover:bg-[hsl(var(--accent))/0.1] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))/0.2] cursor-default">
                                    <span className="text-sm leading-none drop-shadow-sm">{lang.flag}</span>
                                    <span className="text-[hsl(var(--foreground))]">{lang.name}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Education & Focus Together */}
                <div className="flex flex-col gap-6">
                    <aside className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 ml-1">
                            <GraduationCap size={14} /> Education Context
                        </span>
                        <div className="flex flex-col gap-2.5">
                            {EDUCATION.map((item) => (
                                <div key={item.school} className="flex items-center gap-3 p-2.5 rounded-xl border border-[hsl(var(--border))] bg-white/40 dark:bg-black/20 shadow-sm transition-colors hover:bg-white/60 dark:hover:bg-black/40 cursor-default">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/5 border border-[hsl(var(--border))] flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                        <Image
                                            src={item.logo}
                                            alt=""
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-contain drop-shadow-sm"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <strong className="text-sm font-extrabold text-[hsl(var(--foreground))] leading-tight truncate">{item.school}</strong>
                                        <div className="flex items-center justify-between gap-2 mt-0.5">
                                            <span className="text-xs text-[hsl(var(--muted-foreground))] font-medium truncate">{item.degree}</span>
                                            <span className="text-[10px] text-[hsl(var(--muted-foreground))/70] font-bold tracking-wider whitespace-nowrap">{item.year}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <aside className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-1">Current Foundation</span>
                        <div className="flex flex-wrap gap-2">
                            {CURRENT_FOCUS.map((item) => (
                                <span key={item} className="inline-flex items-center px-3 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 text-[hsl(var(--muted-foreground))] text-xs font-semibold">
                                    {item}
                                </span>
                            ))}
                        </div>
                        <p className="m-0 text-[0.84rem] leading-relaxed text-[hsl(var(--muted-foreground))] ml-1">
                            Phase 1 is all about making the fundamentals boring, reliable, and repeatable before the platform grows more ambitious.
                        </p>
                    </aside>
                </div>
            </div>
        </article>
    )
}

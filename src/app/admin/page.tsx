'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/integrations/supabase/client'
import {
    Activity,
    BookOpen,
    Briefcase,
    CheckCircle2,
    Code,
    Database,
    FileText,
    PenTool,
    ShieldCheck,
    Star,
    Target,
    Users,
    type LucideIcon,
} from 'lucide-react'

const CARD_RADIUS = 8
const CARD_PADDING = 20
const GAP = 16

const cardStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.86)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(203, 213, 225, 0.72)',
    borderRadius: CARD_RADIUS,
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.07)',
}

const subtleCardStyle: CSSProperties = {
    border: '1px solid rgba(226, 232, 240, 0.9)',
    borderRadius: CARD_RADIUS,
    background: 'rgba(248, 250, 252, 0.78)',
}

interface DashboardStats {
    totalProjects: number
    totalSkills: number
    testimonials: number
    blogPosts: number
    roadmapPhases: number
    certifications: number
}

interface Project {
    id: string
    title: string
    status: string
    stack: string[] | null
    is_featured: boolean
}

interface PersonalInfo {
    full_name: string
    title: string
}

interface StatCard {
    label: string
    value: string
    detail: string
    icon: LucideIcon
    bg: string
    color: string
    href: string
}

const typedSupabase = supabase as unknown as {
    from: (table: string) => {
        select: (columns: string, options?: { count?: 'exact'; head?: boolean }) => Promise<{ count: number | null }>
    }
}

const getStatusStyle = (status: string): CSSProperties => {
    const normalized = status.toLowerCase()

    if (normalized.includes('complete')) {
        return { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }
    }

    if (normalized.includes('progress') || normalized.includes('active')) {
        return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }
    }

    return { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProjects: 0,
        totalSkills: 0,
        testimonials: 0,
        blogPosts: 0,
        roadmapPhases: 0,
        certifications: 0,
    })
    const [projects, setProjects] = useState<Project[]>([])
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        setError(null)

        try {
            const [
                projectsResult,
                skillsResult,
                testimonialsResult,
                blogResult,
                recentProjectsResult,
                personalResult,
                phasesResult,
                certsResult,
            ] = await Promise.all([
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('skills').select('*', { count: 'exact', head: true }),
                supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', true),
                supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
                supabase.from('projects').select('id, title, status, stack, is_featured').order('updated_at', { ascending: false }).limit(6),
                supabase.from('personal_info').select('full_name, title').single(),
                typedSupabase.from('roadmap_phases').select('*', { count: 'exact', head: true }),
                typedSupabase.from('certifications').select('*', { count: 'exact', head: true }),
            ])

            setStats({
                totalProjects: projectsResult.count || 0,
                totalSkills: skillsResult.count || 0,
                testimonials: testimonialsResult.count || 0,
                blogPosts: blogResult.count || 0,
                roadmapPhases: phasesResult?.count || 0,
                certifications: certsResult?.count || 0,
            })

            if (recentProjectsResult.data) setProjects(recentProjectsResult.data)
            if (personalResult.data) setPersonalInfo(personalResult.data)
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : 'Dashboard data could not be loaded.')
        } finally {
            setLoading(false)
        }
    }

    const statCards = useMemo<StatCard[]>(
        () => [
            {
                label: 'Projects',
                value: `${stats.totalProjects}`,
                detail: 'Portfolio records',
                icon: Briefcase,
                bg: '#f0fdfa',
                color: '#0f766e',
                href: '/admin/projects',
            },
            {
                label: 'Skills',
                value: `${stats.totalSkills}`,
                detail: 'Structured capabilities',
                icon: Code,
                bg: '#eff6ff',
                color: '#1d4ed8',
                href: '/admin/skills',
            },
            {
                label: 'Published Posts',
                value: `${stats.blogPosts}`,
                detail: 'Live writing pieces',
                icon: PenTool,
                bg: '#f5f3ff',
                color: '#6d28d9',
                href: '/admin/blog',
            },
            {
                label: 'Testimonials',
                value: `${stats.testimonials}`,
                detail: 'Visible social proof',
                icon: Users,
                bg: '#fffbeb',
                color: '#b45309',
                href: '/admin/testimonials',
            },
        ],
        [stats],
    )

    const readiness = Math.min(
        100,
        Math.round(
            ((stats.totalProjects > 0 ? 1 : 0) +
                (stats.totalSkills > 0 ? 1 : 0) +
                (stats.blogPosts > 0 ? 1 : 0) +
                (stats.certifications > 0 ? 1 : 0)) *
            25,
        ),
    )

    const displayName = personalInfo?.full_name || 'Admin'
    const displayTitle = personalInfo?.title || 'Portfolio CMS'

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <div style={{ width: 40, height: 40, border: '4px solid #0d9488', borderTopColor: 'transparent', borderRadius: '50%', animation: 'ad-spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div style={{ display: 'grid', gap: GAP + 4 }}>
            <section style={{ ...cardStyle, padding: CARD_PADDING }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f766e' }}>
                            Portfolio command center
                        </p>
                        <h1 style={{ marginTop: 6, fontSize: 30, fontWeight: 850, color: '#0f172a', letterSpacing: '-0.03em' }}>
                            Welcome back, {displayName}
                        </h1>
                        <p style={{ marginTop: 6, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                            {displayTitle}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <Link
                            href="/admin/blog/new"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                minHeight: 40,
                                padding: '0 14px',
                                borderRadius: 8,
                                background: '#0f766e',
                                color: 'white',
                                fontSize: 13,
                                fontWeight: 800,
                                textDecoration: 'none',
                            }}
                        >
                            <PenTool size={15} />
                            New Post
                        </Link>
                        <Link
                            href="/admin/projects"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                minHeight: 40,
                                padding: '0 14px',
                                borderRadius: 8,
                                background: '#0f172a',
                                color: 'white',
                                fontSize: 13,
                                fontWeight: 800,
                                textDecoration: 'none',
                            }}
                        >
                            <Briefcase size={15} />
                            Projects
                        </Link>
                    </div>
                </div>
            </section>

            {error && (
                <section style={{ ...subtleCardStyle, padding: 14, color: '#b91c1c', background: '#fef2f2', borderColor: '#fecaca' }}>
                    {error}
                </section>
            )}

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 15rem), 1fr))', gap: GAP }}>
                {statCards.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <Link key={stat.label} href={stat.href} style={{ ...cardStyle, padding: CARD_PADDING, textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                <div>
                                    <p style={{ color: '#64748b', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        {stat.label}
                                    </p>
                                    <p style={{ marginTop: 8, color: '#0f172a', fontSize: 30, fontWeight: 850, letterSpacing: '-0.03em' }}>
                                        {stat.value}
                                    </p>
                                    <p style={{ marginTop: 4, color: '#64748b', fontSize: 13 }}>
                                        {stat.detail}
                                    </p>
                                </div>
                                <div style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 8, background: stat.bg, color: stat.color }}>
                                    <Icon size={22} />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 28rem), 1fr))', gap: GAP, alignItems: 'start' }}>
                <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 850, color: '#0f172a' }}>Recent Projects</h2>
                            <p style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>Latest project records in the CMS</p>
                        </div>
                        <Link href="/admin/projects" style={{ color: '#0f766e', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
                            View all
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gap: 10 }}>
                        {projects.length === 0 ? (
                            <div style={{ ...subtleCardStyle, padding: 18, color: '#64748b', fontSize: 14 }}>
                                No projects have been added yet.
                            </div>
                        ) : (
                            projects.map((project) => (
                                <div key={project.id} style={{ ...subtleCardStyle, padding: 14 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, alignItems: 'center' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                                <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 8, background: '#ccfbf1', color: '#0f766e', fontWeight: 850, flex: '0 0 auto' }}>
                                                    {project.title.charAt(0)}
                                                </span>
                                                <div style={{ minWidth: 0 }}>
                                                    <h3 style={{ color: '#0f172a', fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {project.title}
                                                    </h3>
                                                    <p style={{ marginTop: 3, color: '#64748b', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {(project.stack || []).slice(0, 4).join(' / ') || 'Stack not set'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                                            {project.is_featured && (
                                                <span title="Featured" style={{ color: '#d97706', display: 'inline-flex' }}>
                                                    <Star size={16} fill="currentColor" />
                                                </span>
                                            )}
                                            <span style={{ ...getStatusStyle(project.status), borderRadius: 999, padding: '4px 9px', fontSize: 11, fontWeight: 800, textTransform: 'capitalize' }}>
                                                {project.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <aside style={{ display: 'grid', gap: GAP }}>
                    <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <div style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 8, background: '#ecfeff', color: '#0e7490' }}>
                                <Activity size={19} />
                            </div>
                            <div>
                                <h2 style={{ color: '#0f172a', fontSize: 17, fontWeight: 850 }}>Content Health</h2>
                                <p style={{ marginTop: 2, color: '#64748b', fontSize: 12 }}>Portfolio readiness</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12 }}>
                            <span style={{ color: '#0f172a', fontSize: 34, fontWeight: 850, letterSpacing: '-0.04em' }}>{readiness}%</span>
                            <span style={{ color: '#64748b', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Ready
                            </span>
                        </div>
                        <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${readiness}%`, borderRadius: 999, background: '#0f766e' }} />
                        </div>

                        <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                            {[
                                { label: 'Roadmap phases', value: stats.roadmapPhases, icon: Target },
                                { label: 'Certifications', value: stats.certifications, icon: FileText },
                                { label: 'Published posts', value: stats.blogPosts, icon: BookOpen },
                            ].map((item) => {
                                const Icon = item.icon

                                return (
                                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, color: '#475569', fontSize: 13 }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                            <Icon size={15} />
                                            {item.label}
                                        </span>
                                        <strong style={{ color: '#0f172a' }}>{item.value}</strong>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                        <h2 style={{ color: '#0f172a', fontSize: 17, fontWeight: 850 }}>Quick Actions</h2>
                        <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                            {[
                                { label: 'Generate or edit blog posts', href: '/admin/blog', icon: PenTool },
                                { label: 'Review profile details', href: '/admin/profile', icon: CheckCircle2 },
                                { label: 'Open focus plan', href: '/admin/roadmap', icon: ShieldCheck },
                                { label: 'Database reset notes', href: '/admin/schema', icon: Database },
                            ].map((action) => {
                                const Icon = action.icon

                                return (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        style={{
                                            ...subtleCardStyle,
                                            minHeight: 42,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 10,
                                            padding: '10px 12px',
                                            color: '#0f172a',
                                            fontSize: 13,
                                            fontWeight: 750,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <span>{action.label}</span>
                                        <Icon size={16} color="#0f766e" />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    )
}

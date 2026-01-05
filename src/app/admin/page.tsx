'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import Link from 'next/link'
import { Briefcase, Code, Users, FileText, Plus, ExternalLink, Edit2, Star, Target } from 'lucide-react'

// CoachPro Design Tokens
const CARD_RADIUS = 20
const CARD_PADDING = 24
const GAP = 16

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    borderRadius: CARD_RADIUS,
    boxShadow: '8px 8px 16px rgba(166, 180, 200, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.9)'
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

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProjects: 0,
        totalSkills: 0,
        testimonials: 0,
        blogPosts: 0,
        roadmapPhases: 0,
        certifications: 0
    })
    const [projects, setProjects] = useState<Project[]>([])
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [
                projectsResult,
                skillsResult,
                testimonialsResult,
                blogResult,
                recentProjectsResult,
                personalResult,
                phasesResult,
                certsResult
            ] = await Promise.all([
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('skills').select('*', { count: 'exact', head: true }),
                supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', true),
                supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
                supabase.from('projects').select('id, title, status, stack, is_featured').order('updated_at', { ascending: false }).limit(6),
                supabase.from('personal_info').select('full_name, title').single(),
                (supabase as any).from('roadmap_phases').select('*', { count: 'exact', head: true }),
                (supabase as any).from('certifications').select('*', { count: 'exact', head: true })
            ])

            setStats({
                totalProjects: projectsResult.count || 0,
                totalSkills: skillsResult.count || 0,
                testimonials: testimonialsResult.count || 0,
                blogPosts: blogResult.count || 0,
                roadmapPhases: phasesResult?.count || 0,
                certifications: certsResult?.count || 0
            })
            if (recentProjectsResult.data) setProjects(recentProjectsResult.data)
            if (personalResult.data) setPersonalInfo(personalResult.data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <div style={{ width: 40, height: 40, border: '4px solid #0d9488', borderTopColor: 'transparent', borderRadius: '50%', animation: 'ad-spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div>
            {/* Title Row */}
            <div style={{ marginBottom: GAP + 8 }}>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Welcome back, Andrea✌️</p>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.02em' }}>Dashboard</h1>
            </div>

            {/* Main Grid - 60/40 split like CoachPro */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: GAP }}>

                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>

                    {/* Next Game Card (Quick Stats for us) */}
                    <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>Next game</h2>
                            <Link href="/admin/projects" style={{ fontSize: 14, color: '#0d9488', textDecoration: 'none', fontWeight: 500 }}>View calendar</Link>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '16px 0' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{stats.totalProjects}</div>
                                <div style={{ fontSize: 13, color: '#64748b' }}>Projects</div>
                            </div>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>VS</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{stats.totalSkills}</div>
                                <div style={{ fontSize: 13, color: '#64748b' }}>Skills</div>
                            </div>
                        </div>
                    </div>

                    {/* Standings Card (Projects Table for us) */}
                    <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>Standings</h2>
                            <Link href="/admin/projects" style={{ fontSize: 14, color: '#0d9488', textDecoration: 'none', fontWeight: 500 }}>View all</Link>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>#</th>
                                    <th style={{ textAlign: 'left', padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Team</th>
                                    <th style={{ textAlign: 'center', padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>MP</th>
                                    <th style={{ textAlign: 'center', padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>W</th>
                                    <th style={{ textAlign: 'center', padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>D</th>
                                    <th style={{ textAlign: 'center', padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>L</th>
                                    <th style={{ textAlign: 'right', padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>PTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project, i) => (
                                    <tr key={project.id}>
                                        <td style={{ padding: '14px 0', fontSize: 14, color: '#64748b' }}>{i + 1}</td>
                                        <td style={{ padding: '14px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 28, height: 28, borderRadius: 6, background: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                                                    {project.title.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: 500, color: '#1e293b', fontSize: 14 }}>{project.title}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 0', textAlign: 'center', fontSize: 14, color: '#64748b' }}>{project.stack?.length || 0}</td>
                                        <td style={{ padding: '14px 0', textAlign: 'center', fontSize: 14, color: '#64748b' }}>{project.is_featured ? 1 : 0}</td>
                                        <td style={{ padding: '14px 0', textAlign: 'center', fontSize: 14, color: '#64748b' }}>0</td>
                                        <td style={{ padding: '14px 0', textAlign: 'center', fontSize: 14, color: '#64748b' }}>0</td>
                                        <td style={{ padding: '14px 0', textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{(project.stack?.length || 0) * 3}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>

                    {/* Games Statistic Card */}
                    <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>Games statistic</h2>
                            <span style={{ fontSize: 14, color: '#0d9488', fontWeight: 500 }}>View all statistic</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{stats.totalProjects}</div>
                                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Projects</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{stats.totalSkills}</div>
                                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Skills</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{stats.testimonials}</div>
                                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Reviews</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{stats.blogPosts}</div>
                                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Posts</div>
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div style={{ height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '65%', background: 'linear-gradient(90deg, #0d9488, #14b8a6)', borderRadius: 3 }} />
                        </div>
                    </div>

                    {/* 2x2 Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                            { label: 'Possession', value: `${stats.totalProjects}`, icon: Briefcase, bg: '#f0fdfa', color: '#0d9488' },
                            { label: 'Overall Price', value: `$${stats.totalSkills * 10}k`, icon: Code, bg: '#eff6ff', color: '#3b82f6' },
                            { label: 'Transfer Budget', value: `$${stats.roadmapPhases}`, icon: Target, bg: '#fffbeb', color: '#f59e0b' },
                            { label: 'Average Score', value: `${stats.certifications}`, icon: FileText, bg: '#f0f4ff', color: '#6366f1' },
                        ].map((stat) => {
                            const Icon = stat.icon
                            return (
                                <div key={stat.label} style={{ ...cardStyle, padding: 18 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={18} />
                                        </div>
                                        <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>{stat.label}</span>
                                    </div>
                                    <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>{stat.value}</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* CTA Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                        borderRadius: CARD_RADIUS,
                        padding: CARD_PADDING,
                        boxShadow: '0 12px 32px rgba(13, 148, 136, 0.35)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative elements */}
                        <div style={{ position: 'absolute', top: 20, right: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ position: 'absolute', bottom: -20, right: 60, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>Don't Forget</p>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 16, lineHeight: 1.3 }}>
                            Setup training<br />for next week
                        </h3>
                        <Link href="/admin/profile" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '10px 18px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.2)', color: 'white',
                            fontSize: 13, fontWeight: 500, textDecoration: 'none',
                            backdropFilter: 'blur(4px)'
                        }}>
                            Go to training center
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { syncGitHubProjects } from '@/services/syncGitHub'
import { Plus, Trash2, Edit2, X, CheckCircle2, Github, ExternalLink, RefreshCw, Briefcase, Star } from 'lucide-react'
import Link from 'next/link'

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

interface Project {
    id: string
    title: string
    description: string | null
    stack: string[] | null
    status: string
    github_url: string | null
    live_url: string | null
    is_featured: boolean
}

const STATUS_OPTIONS = ['Deployed', 'WIP', 'Research', 'Stable', 'Completed', 'Archived']

export default function AdminProjectsPage() {
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        const { data } = await supabase.from('projects').select('*').order('display_order')
        if (data) setProjects(data)
        setLoading(false)
    }

    const handleSync = async () => {
        setSyncing(true)
        await syncGitHubProjects('ambooka')
        await fetchProjects()
        setSyncing(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
    }

    const deleteProject = async (id: string) => {
        if (!confirm('Delete this project?')) return
        await supabase.from('projects').delete().eq('id', id)
        fetchProjects()
    }

    const toggleFeatured = async (id: string, current: boolean) => {
        await supabase.from('projects').update({ is_featured: !current }).eq('id', id)
        fetchProjects()
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
            {/* Success Toast */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 100,
                    padding: '12px 20px', borderRadius: 12,
                    background: '#f0fdf4', border: '1px solid #22c55e',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                    <span style={{ color: '#16a34a', fontWeight: 500, fontSize: 14 }}>Synced!</span>
                </div>
            )}

            {/* Title Row */}
            <div style={{ marginBottom: GAP + 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>Projects</h1>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your portfolio projects ({projects.length})</p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: GAP }}>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 18px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(226, 232, 240, 0.6)',
                        fontSize: 14, fontWeight: 500, color: '#1e293b', cursor: 'pointer',
                        boxShadow: '4px 4px 10px rgba(166, 180, 200, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.9)'
                    }}
                >
                    <RefreshCw size={16} style={{ animation: syncing ? 'ad-spin 1s linear infinite' : 'none' }} />
                    Sync GitHub
                </button>
                <Link href="/admin/projects/new" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 18px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                    color: 'white', fontSize: 14, fontWeight: 500, textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)'
                }}>
                    <Plus size={16} /> Add Project
                </Link>
            </div>

            {/* Projects Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: GAP }}>
                {projects.map((project) => (
                    <div key={project.id} style={{ ...cardStyle, padding: CARD_PADDING }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: '#ccfbf1', color: '#0f766e',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 16, fontWeight: 600
                                }}>
                                    {project.title.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{project.title}</h3>
                                    <span style={{
                                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                                        background: project.status === 'Deployed' ? '#f0fdf4' : '#fffbeb',
                                        color: project.status === 'Deployed' ? '#16a34a' : '#d97706'
                                    }}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleFeatured(project.id, project.is_featured)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: project.is_featured ? '#f59e0b' : '#cbd5e1' }}
                            >
                                <Star size={18} fill={project.is_featured ? '#f59e0b' : 'none'} />
                            </button>
                        </div>

                        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
                            {project.description?.slice(0, 100)}...
                        </p>

                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                            {project.stack?.slice(0, 4).map((tech, i) => (
                                <span key={i} style={{ padding: '3px 10px', borderRadius: 8, fontSize: 11, background: 'rgba(241, 245, 249, 0.8)', color: '#475569' }}>
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            {project.github_url && (
                                <a href={project.github_url} target="_blank" style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'rgba(241, 245, 249, 0.8)', color: '#475569',
                                    textDecoration: 'none'
                                }}>
                                    <Github size={16} />
                                </a>
                            )}
                            {project.live_url && (
                                <a href={project.live_url} target="_blank" style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'rgba(241, 245, 249, 0.8)', color: '#475569',
                                    textDecoration: 'none'
                                }}>
                                    <ExternalLink size={16} />
                                </a>
                            )}
                            <div style={{ flex: 1 }} />
                            <button
                                onClick={() => deleteProject(project.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'rgba(254, 242, 242, 0.8)', color: '#ef4444',
                                    border: 'none', cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

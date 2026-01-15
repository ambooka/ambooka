'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import {
    Save,
    Target,
    Award,
    CheckCircle2,
    Plus,
    Trash2,
    Loader2
} from 'lucide-react'

// Design Tokens (Matching CoachPro Admin Style)
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

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid rgba(203, 213, 225, 0.6)',
    background: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s ease'
}

interface RoadmapPhase {
    phase_number: number
    title: string
    duration_months: number | null
    experience_label: string | null
    start_date_label: string | null
    target_role: string | null
    status: 'completed' | 'in_progress' | 'upcoming'
}

interface Certification {
    id: string
    name: string
    phase_number: number
    is_obtained: boolean
}

export default function RoadmapManager() {
    const [phases, setPhases] = useState<RoadmapPhase[]>([])
    const [certs, setCerts] = useState<Certification[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [activeTab, setActiveTab] = useState<'phases' | 'certs'>('phases')

    // Cert Form
    const [newCert, setNewCert] = useState({ name: '', phase_number: 1, is_obtained: false })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Type assertion for tables not in Supabase type definitions
            const { data: pData } = await (supabase as unknown as { from: (t: string) => ReturnType<typeof supabase.from> }).from('roadmap_phases').select('*').order('phase_number')
            const { data: cData } = await (supabase as unknown as { from: (t: string) => ReturnType<typeof supabase.from> }).from('certifications').select('*').order('phase_number')

            if (pData) setPhases(pData as RoadmapPhase[])
            if (cData) setCerts(cData as Certification[])
        } catch (err: unknown) {
            console.error('Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    const savePhases = async () => {
        setSaving(true)
        try {
            for (const phase of phases) {
                const { error } = await (supabase as unknown as { from: (t: string) => ReturnType<typeof supabase.from> }).from('roadmap_phases').update({
                    title: phase.title,
                    experience_label: phase.experience_label,
                    start_date_label: phase.start_date_label,
                    target_role: phase.target_role,
                    status: phase.status
                }).eq('phase_number', phase.phase_number)

                if (error) throw error
            }
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 2000)
        } catch (err: unknown) {
            console.error('Save error:', err)
            alert('Failed to save phases: ' + ((err as Error).message || 'Unknown error'))
        } finally {
            setSaving(false)
        }
    }

    const addCertification = async () => {
        if (!newCert.name.trim()) return
        setSaving(true)
        try {
            const { error } = await (supabase as unknown as { from: (t: string) => ReturnType<typeof supabase.from> }).from('certifications').insert(newCert)
            if (error) throw error

            setNewCert({ name: '', phase_number: 1, is_obtained: false })
            fetchData()
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 2000)
        } catch (err: unknown) {
            console.error('Insert error:', err)
            alert('Failed to add certification: ' + ((err as Error).message || 'Unknown error'))
        } finally {
            setSaving(false)
        }
    }

    const deleteCertification = async (id: string) => {
        if (!confirm('Delete this certification?')) return
        const { error } = await (supabase as unknown as { from: (t: string) => ReturnType<typeof supabase.from> }).from('certifications').delete().eq('id', id)
        if (error) {
            alert('Failed to delete: ' + error.message)
        } else {
            fetchData()
        }
    }

    const updatePhase = (phaseNum: number, field: keyof RoadmapPhase, value: string | number | null | 'completed' | 'in_progress' | 'upcoming') => {
        setPhases(current => current.map(p =>
            p.phase_number === phaseNum ? { ...p, [field]: value } : p
        ))
    }

    const bulkUpdateUpcomingLabels = () => {
        setPhases(current => current.map(p => {
            if (p.status === 'upcoming' && p.start_date_label && p.start_date_label.startsWith('Started')) {
                return { ...p, start_date_label: p.start_date_label.replace('Started', 'Starting') }
            }
            return p
        }))
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin" size={32} color="#0d9488" />
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                padding: '0 8px'
            }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: 0 }}>Roadmap Management</h2>
                    <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Control the technical journey and development phases.</p>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {showSuccess && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            color: '#059669', fontSize: 13, fontWeight: 600,
                            padding: '8px 16px', borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)',
                            animation: 'ad-fade-in 0.3s ease'
                        }}>
                            <CheckCircle2 size={16} />
                            Changes Saved Successfully
                        </div>
                    )}
                    {activeTab === 'phases' && (
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={bulkUpdateUpcomingLabels}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 16px', borderRadius: 12,
                                    background: 'white', color: '#475569',
                                    border: '1px solid #e2e8f0', cursor: 'pointer',
                                    fontSize: 13, fontWeight: 600,
                                    transition: 'all 0.2s ease'
                                }}
                                title="Changes 'Started' to 'Starting' for all Upcoming phases"
                            >
                                <Target size={14} />
                                Fix Upcoming Labels
                            </button>
                            <button
                                onClick={savePhases}
                                disabled={saving}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 20px', borderRadius: 12,
                                    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                    color: 'white', border: 'none', cursor: 'pointer',
                                    fontSize: 14, fontWeight: 600, boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                                    transition: 'all 0.2s ease',
                                    opacity: saving ? 0.7 : 1
                                }}
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Save All Phases
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: GAP, marginBottom: 24, padding: '0 8px' }}>
                <button
                    onClick={() => setActiveTab('phases')}
                    style={{
                        padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                        fontSize: 14, fontWeight: 600, transition: 'all 0.2s ease',
                        background: activeTab === 'phases' ? '#0d9488' : 'white',
                        color: activeTab === 'phases' ? 'white' : '#64748b',
                        boxShadow: activeTab === 'phases' ? '0 4px 12px rgba(13, 148, 136, 0.2)' : 'none'
                    }}
                >
                    Roadmap Phases
                </button>
                <button
                    onClick={() => setActiveTab('certs')}
                    style={{
                        padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                        fontSize: 14, fontWeight: 600, transition: 'all 0.2s ease',
                        background: activeTab === 'certs' ? '#0d9488' : 'white',
                        color: activeTab === 'certs' ? 'white' : '#64748b',
                        boxShadow: activeTab === 'certs' ? '0 4px 12px rgba(13, 148, 136, 0.2)' : 'none'
                    }}
                >
                    Certifications
                </button>
            </div>

            {/* Content Section */}
            {activeTab === 'phases' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: GAP }}>
                    {phases.map((phase) => (
                        <div key={phase.phase_number} style={{ ...cardStyle, padding: CARD_PADDING }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 14, fontWeight: 700
                                    }}>
                                        {phase.phase_number}
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                                        {phase.title || `Phase ${phase.phase_number}`}
                                    </h3>
                                </div>
                                <select
                                    value={phase.status}
                                    onChange={(e) => updatePhase(phase.phase_number, 'status', e.target.value)}
                                    style={{
                                        padding: '4px 10px', borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0',
                                        background: phase.status === 'completed' ? '#dcfce7' : phase.status === 'in_progress' ? '#fef9c3' : '#f1f5f9',
                                        color: phase.status === 'completed' ? '#166534' : phase.status === 'in_progress' ? '#854d0e' : '#64748b',
                                        fontWeight: 600, outline: 'none'
                                    }}
                                >
                                    <option value="completed">Completed</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GAP }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
                                        Title
                                    </label>
                                    <input
                                        style={inputStyle}
                                        value={phase.title}
                                        onChange={(e) => updatePhase(phase.phase_number, 'title', e.target.value)}
                                        placeholder="Software Engineering"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
                                        Role Goal
                                    </label>
                                    <input
                                        style={inputStyle}
                                        value={phase.target_role || ''}
                                        onChange={(e) => updatePhase(phase.phase_number, 'target_role', e.target.value)}
                                        placeholder="e.g. Senior MLOps"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
                                        Experience Label
                                    </label>
                                    <input
                                        style={inputStyle}
                                        value={phase.experience_label || ''}
                                        onChange={(e) => updatePhase(phase.phase_number, 'experience_label', e.target.value)}
                                        placeholder="e.g. 3 Yrs Exp"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
                                        Start Date Label
                                    </label>
                                    <input
                                        style={inputStyle}
                                        value={phase.start_date_label || ''}
                                        onChange={(e) => updatePhase(phase.phase_number, 'start_date_label', e.target.value)}
                                        placeholder="e.g. Started 2023"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 24 }}>
                    {/* Add Cert Form */}
                    <div style={{ ...cardStyle, padding: CARD_PADDING, height: 'fit-content' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Award size={18} color="#0d9488" />
                            Add Certification
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Name</label>
                                <input
                                    style={inputStyle}
                                    value={newCert.name}
                                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                                    placeholder="e.g. AWS SAA"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Roadmap Phase</label>
                                <select
                                    style={inputStyle}
                                    value={newCert.phase_number}
                                    onChange={(e) => setNewCert({ ...newCert, phase_number: Number(e.target.value) })}
                                >
                                    {phases.map(p => (
                                        <option key={p.phase_number} value={p.phase_number}>Phase {p.phase_number}: {p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input
                                    type="checkbox"
                                    id="obtained"
                                    checked={newCert.is_obtained}
                                    onChange={(e) => setNewCert({ ...newCert, is_obtained: e.target.checked })}
                                />
                                <label htmlFor="obtained" style={{ fontSize: 14, color: '#475569', cursor: 'pointer' }}>Already Obtained</label>
                            </div>
                            <button
                                onClick={addCertification}
                                disabled={saving}
                                style={{
                                    marginTop: 8, padding: '12px', borderRadius: 12, border: 'none',
                                    background: '#0d9488', color: 'white', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
                                }}
                            >
                                <Plus size={18} />
                                Add Certification
                            </button>
                        </div>
                    </div>

                    {/* Certs List */}
                    <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: GAP }}>
                            {certs.map((cert) => (
                                <div key={cert.id} style={{
                                    padding: '16px', borderRadius: 16, background: 'white', border: '1px solid #f1f5f9',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    transition: 'all 0.2s ease', boxShadow: '2px 2px 8px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: cert.is_obtained ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: cert.is_obtained ? '#10b981' : '#f59e0b',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Award size={16} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{cert.name}</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>Phase {cert.phase_number}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteCertification(cert.id)}
                                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#cbd5e1', padding: 8 }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {certs.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                                <Award size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
                                <div style={{ fontSize: 14 }}>No certifications added yet.</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Global Admin Styles (Spinners, Fades) */}
            <style jsx global>{`
                @keyframes ad-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes ad-fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-spin {
                    animation: ad-spin 1s linear infinite;
                }
            `}</style>
        </div>
    )
}

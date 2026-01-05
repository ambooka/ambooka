'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Plus, Search, Trash2, Code, Star, Edit2, X, CheckCircle2, Save } from 'lucide-react'

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

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(203, 213, 225, 0.6)',
    background: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    outline: 'none'
}

interface Skill {
    id: string
    name: string
    category: string
    proficiency: number
    icon_url: string | null
    roadmap_phase: number | null
    is_featured: boolean
    display_order: number
}

const CATEGORIES = ['Languages', 'Frameworks', 'Tools', 'Cloud', 'Databases', 'Certifications', 'Other']
const PHASES = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const emptyForm = {
    name: '',
    category: 'Languages',
    proficiency: 50,
    icon_url: '',
    roadmap_phase: 1,
    is_featured: false
}

export default function SkillsManager() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState(emptyForm)

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        setLoading(true)
        const { data } = await supabase.from('skills').select('*').order('roadmap_phase').order('display_order')
        if (data) setSkills(data)
        setLoading(false)
    }

    const openAddForm = () => {
        setFormData(emptyForm)
        setEditingId(null)
        setShowForm(true)
    }

    const openEditForm = (skill: Skill) => {
        setFormData({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            icon_url: skill.icon_url || '',
            roadmap_phase: skill.roadmap_phase || 1,
            is_featured: skill.is_featured
        })
        setEditingId(skill.id)
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingId(null)
        setFormData(emptyForm)
    }

    const saveSkill = async () => {
        if (!formData.name.trim()) return
        setSaving(true)

        if (editingId) {
            // Update existing
            await supabase.from('skills').update({
                name: formData.name,
                category: formData.category,
                proficiency: formData.proficiency,
                icon_url: formData.icon_url || null,
                roadmap_phase: formData.roadmap_phase,
                is_featured: formData.is_featured
            }).eq('id', editingId)
        } else {
            // Create new
            const maxOrder = skills.length > 0 ? Math.max(...skills.map(s => s.display_order)) + 1 : 0
            await supabase.from('skills').insert({
                name: formData.name,
                category: formData.category,
                proficiency: formData.proficiency,
                icon_url: formData.icon_url || null,
                roadmap_phase: formData.roadmap_phase,
                is_featured: formData.is_featured,
                display_order: maxOrder
            })
        }

        setSaving(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
        closeForm()
        fetchSkills()
    }

    const deleteSkill = async (id: string) => {
        if (!confirm('Delete this skill?')) return
        await supabase.from('skills').delete().eq('id', id)
        fetchSkills()
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const toggleFeatured = async (id: string, current: boolean) => {
        await supabase.from('skills').update({ is_featured: !current }).eq('id', id)
        fetchSkills()
    }

    const filteredSkills = skills.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const groupedByPhase = filteredSkills.reduce((acc, skill) => {
        const phase = skill.roadmap_phase || 0
        if (!acc[phase]) acc[phase] = []
        acc[phase].push(skill)
        return acc
    }, {} as Record<number, Skill[]>)

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
                    display: 'flex', alignItems: 'center', gap: 8
                }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                    <span style={{ color: '#16a34a', fontWeight: 500, fontSize: 14 }}>Saved!</span>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ ...cardStyle, padding: CARD_PADDING, width: 480, maxWidth: '90vw' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e293b' }}>
                                {editingId ? 'Edit Skill' : 'Add New Skill'}
                            </h2>
                            <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Python, React, Docker"
                                    style={inputStyle}
                                />
                            </div>

                            {/* Category & Phase */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={inputStyle}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Phase</label>
                                    <select
                                        value={formData.roadmap_phase}
                                        onChange={(e) => setFormData({ ...formData, roadmap_phase: Number(e.target.value) })}
                                        style={inputStyle}
                                    >
                                        {PHASES.map(p => <option key={p} value={p}>Phase {p}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Proficiency */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
                                    Proficiency: {formData.proficiency}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.proficiency}
                                    onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                                    style={{ width: '100%', accentColor: '#0d9488' }}
                                />
                            </div>

                            {/* Icon URL */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Icon URL</label>
                                <input
                                    type="url"
                                    value={formData.icon_url}
                                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                                    placeholder="https://example.com/icon.png"
                                    style={inputStyle}
                                />
                            </div>

                            {/* Featured */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    style={{ width: 18, height: 18, accentColor: '#0d9488' }}
                                />
                                <span style={{ fontSize: 14, color: '#1e293b' }}>Featured skill</span>
                            </label>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button
                                    onClick={closeForm}
                                    style={{
                                        flex: 1, padding: '12px 20px', borderRadius: 12,
                                        background: 'rgba(241, 245, 249, 0.8)', border: 'none',
                                        fontSize: 14, fontWeight: 500, color: '#64748b', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveSkill}
                                    disabled={saving || !formData.name.trim()}
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        padding: '12px 20px', borderRadius: 12,
                                        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                                        color: 'white', fontSize: 14, fontWeight: 500,
                                        border: 'none', cursor: 'pointer',
                                        opacity: !formData.name.trim() ? 0.5 : 1
                                    }}
                                >
                                    <Save size={16} />
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Title Row */}
            <div style={{ marginBottom: GAP + 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>Skills</h1>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your skillset ({skills.length} skills)</p>
            </div>

            {/* Filters + Add Button Row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: GAP, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 42 }}
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ ...inputStyle, width: 'auto' }}
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                    onClick={openAddForm}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 20px', borderRadius: 12,
                        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                        color: 'white', fontSize: 14, fontWeight: 500,
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)'
                    }}
                >
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            {/* Skills by Phase */}
            {Object.entries(groupedByPhase).sort(([a], [b]) => Number(a) - Number(b)).map(([phase, phaseSkills]) => (
                <div key={phase} style={{ marginBottom: GAP + 8 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>
                        Phase {phase} ({phaseSkills.length})
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                        {phaseSkills.map((skill) => (
                            <div key={skill.id} style={{ ...cardStyle, padding: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {skill.icon_url ? (
                                            <img src={skill.icon_url} alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
                                        ) : (
                                            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Code size={14} />
                                            </div>
                                        )}
                                        <span style={{ fontWeight: 500, color: '#1e293b', fontSize: 14 }}>{skill.name}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleFeatured(skill.id, skill.is_featured)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: skill.is_featured ? '#f59e0b' : '#cbd5e1' }}
                                    >
                                        <Star size={14} fill={skill.is_featured ? '#f59e0b' : 'none'} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{skill.category}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0d9488' }}>{skill.proficiency}%</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: '#e2e8f0', marginTop: 8, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${skill.proficiency}%`, background: 'linear-gradient(90deg, #0d9488, #14b8a6)', borderRadius: 2 }} />
                                </div>
                                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                                    <button
                                        onClick={() => openEditForm(skill)}
                                        style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', background: 'rgba(241, 245, 249, 0.8)', color: '#64748b', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => deleteSkill(skill.id)}
                                        style={{ padding: 8, borderRadius: 8, border: 'none', background: 'rgba(254, 242, 242, 0.8)', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {filteredSkills.length === 0 && (
                <div style={{ ...cardStyle, padding: 60, textAlign: 'center' }}>
                    <Code size={48} style={{ color: '#94a3b8', marginBottom: 16, opacity: 0.3 }} />
                    <p style={{ color: '#64748b' }}>No skills found</p>
                    <button
                        onClick={openAddForm}
                        style={{
                            marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '10px 18px', borderRadius: 12,
                            background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                            color: 'white', fontSize: 14, fontWeight: 500,
                            border: 'none', cursor: 'pointer'
                        }}
                    >
                        <Plus size={16} /> Add First Skill
                    </button>
                </div>
            )}
        </div>
    )
}

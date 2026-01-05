'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Save, User, FileText, Link as LinkIcon, BarChart3, Plus, Trash2, CheckCircle2, GripVertical, Sparkles, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react'

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
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(203, 213, 225, 0.6)',
    background: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    outline: 'none',
    boxShadow: 'inset 2px 2px 5px rgba(166, 180, 200, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)'
}

const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
}

interface SocialLink {
    id: string
    platform: string
    url: string
    icon_url: string
    display_order: number
}

interface KpiStat {
    label: string
    value: string
    color: string
    type: string
    section: string
    display_order: number
}

interface ExpertiseItem {
    id: string
    section_key: string
    title: string
    content: string
    icon: string
    badge: string
    tags: string[]
    competencies: string[]
    display_order: number
}

const PLATFORMS = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Portfolio', 'Blog', 'Email', 'Other']
const KPI_SECTIONS = ['hero', 'header', 'about', 'skills', 'projects', 'contact']
const ICON_OPTIONS = ['Code', 'Layers', 'Cpu', 'Cloud', 'Database', 'Shield', 'Terminal', 'Server', 'Activity', 'Lock', 'BrainCircuit', 'Workflow', 'Bot', 'Box', 'Brain']
const BADGE_OPTIONS = ['Mastered', 'Current', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7', 'Phase 8', 'Phase 9', 'Building', 'Proficient', 'Competent', 'Foundational', 'Developing']

const emptyExpertise: Omit<ExpertiseItem, 'id'> = {
    section_key: '',
    title: '',
    content: '',
    icon: 'Code',
    badge: 'Current',
    tags: [],
    competencies: [],
    display_order: 0
}

export default function ProfileManager() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'basic' | 'about' | 'expertise' | 'social' | 'kpis'>('basic')
    const [showSuccess, setShowSuccess] = useState(false)
    const [profileId, setProfileId] = useState<string | null>(null)

    // Basic info
    const [basicInfo, setBasicInfo] = useState({
        full_name: '', title: '', email: '', phone: '', location: '', avatar_url: '', resume_url: ''
    })

    // About
    const [aboutText, setAboutText] = useState('')

    // Expertise
    const [expertise, setExpertise] = useState<ExpertiseItem[]>([])
    const [editingExpertise, setEditingExpertise] = useState<ExpertiseItem | null>(null)
    const [newTagInput, setNewTagInput] = useState('')
    const [newCompetencyInput, setNewCompetencyInput] = useState('')
    const [expandedCard, setExpandedCard] = useState<string | null>(null)

    // Social links
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [newSocial, setNewSocial] = useState({ platform: 'GitHub', url: '', icon_url: '' })

    // KPI stats
    const [kpiStats, setKpiStats] = useState<KpiStat[]>([])
    const [newKpi, setNewKpi] = useState({ label: '', value: '', color: '#0d9488', type: 'number', section: 'header' })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        const { data } = await supabase.from('personal_info').select('*').single()
        if (data) {
            setProfileId(data.id)
            setBasicInfo({
                full_name: data.full_name || '',
                title: data.title || '',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || '',
                avatar_url: data.avatar_url || '',
                resume_url: data.resume_url || ''
            })
            setAboutText(data.about_text || '')
            // Parse expertise with proper typing
            if (data.expertise && Array.isArray(data.expertise)) {
                setExpertise(data.expertise.map((item: any, i: number) => ({
                    id: item.id || `exp-${i}`,
                    section_key: item.section_key || '',
                    title: item.title || '',
                    content: item.content || '',
                    icon: item.icon || 'Code',
                    badge: item.badge || '',
                    tags: item.tags || [],
                    competencies: item.competencies || [],
                    display_order: item.display_order ?? i
                })))
            }
            setSocialLinks(data.social_links || [])
            setKpiStats(data.kpi_stats || [])
        }
        setLoading(false)
    }

    const saveProfile = async () => {
        if (!profileId) return
        setSaving(true)
        await supabase.from('personal_info').update({
            ...basicInfo,
            about_text: aboutText,
            expertise: expertise,
            social_links: socialLinks,
            kpi_stats: kpiStats
        }).eq('id', profileId)
        setSaving(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    // Expertise handlers
    const addExpertise = () => {
        const newItem: ExpertiseItem = {
            ...emptyExpertise,
            id: `exp-${Date.now()}`,
            section_key: `expertise_${Date.now()}`,
            display_order: expertise.length
        }
        setExpertise([...expertise, newItem])
        setEditingExpertise(newItem)
    }

    const updateExpertise = (id: string, updates: Partial<ExpertiseItem>) => {
        setExpertise(expertise.map(e => e.id === id ? { ...e, ...updates } : e))
        if (editingExpertise?.id === id) {
            setEditingExpertise({ ...editingExpertise, ...updates })
        }
    }

    const removeExpertise = (id: string) => {
        setExpertise(expertise.filter(e => e.id !== id))
        if (editingExpertise?.id === id) setEditingExpertise(null)
    }

    const moveExpertise = (id: string, direction: 'up' | 'down') => {
        const idx = expertise.findIndex(e => e.id === id)
        if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === expertise.length - 1)) return
        const newIdx = direction === 'up' ? idx - 1 : idx + 1
        const newExpertise = [...expertise]
        const temp = newExpertise[idx]
        newExpertise[idx] = newExpertise[newIdx]
        newExpertise[newIdx] = temp
        // Update display_order
        setExpertise(newExpertise.map((e, i) => ({ ...e, display_order: i })))
    }

    const addTagToExpertise = (id: string) => {
        if (!newTagInput.trim()) return
        const item = expertise.find(e => e.id === id)
        if (item && !item.tags.includes(newTagInput.trim())) {
            updateExpertise(id, { tags: [...item.tags, newTagInput.trim()] })
        }
        setNewTagInput('')
    }

    const removeTagFromExpertise = (id: string, tag: string) => {
        const item = expertise.find(e => e.id === id)
        if (item) {
            updateExpertise(id, { tags: item.tags.filter(t => t !== tag) })
        }
    }

    const addCompetencyToExpertise = (id: string) => {
        if (!newCompetencyInput.trim()) return
        const item = expertise.find(e => e.id === id)
        if (item) {
            updateExpertise(id, { competencies: [...item.competencies, newCompetencyInput.trim()] })
        }
        setNewCompetencyInput('')
    }

    const removeCompetencyFromExpertise = (id: string, competency: string) => {
        const item = expertise.find(e => e.id === id)
        if (item) {
            updateExpertise(id, { competencies: item.competencies.filter(c => c !== competency) })
        }
    }

    // Social Links handlers
    const addSocialLink = () => {
        if (!newSocial.url.trim()) return
        const newLink: SocialLink = {
            id: Date.now().toString(),
            platform: newSocial.platform,
            url: newSocial.url,
            icon_url: newSocial.icon_url,
            display_order: socialLinks.length
        }
        setSocialLinks([...socialLinks, newLink])
        setNewSocial({ platform: 'GitHub', url: '', icon_url: '' })
    }

    const removeSocialLink = (id: string) => {
        setSocialLinks(socialLinks.filter(s => s.id !== id))
    }

    const updateSocialLink = (id: string, field: string, value: string) => {
        setSocialLinks(socialLinks.map(s => s.id === id ? { ...s, [field]: value } : s))
    }

    // KPI Stats handlers
    const addKpiStat = () => {
        if (!newKpi.label.trim() || !newKpi.value.trim()) return
        const stat: KpiStat = {
            ...newKpi,
            display_order: kpiStats.length
        }
        setKpiStats([...kpiStats, stat])
        setNewKpi({ label: '', value: '', color: '#0d9488', type: 'number', section: 'header' })
    }

    const removeKpiStat = (index: number) => {
        setKpiStats(kpiStats.filter((_, i) => i !== index))
    }

    const updateKpiStat = (index: number, field: string, value: string) => {
        setKpiStats(kpiStats.map((s, i) => i === index ? { ...s, [field]: value } : s))
    }

    const tabs = [
        { key: 'basic', label: 'Basic Info', icon: User },
        { key: 'about', label: 'About', icon: FileText },
        { key: 'expertise', label: 'Expertise', icon: Sparkles },
        { key: 'social', label: 'Social Links', icon: LinkIcon },
        { key: 'kpis', label: 'KPI Stats', icon: BarChart3 }
    ]

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
                    position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
                    padding: '12px 20px', borderRadius: 12,
                    background: '#f0fdf4', border: '1px solid #22c55e',
                    display: 'flex', alignItems: 'center', gap: 8
                }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                    <span style={{ color: '#16a34a', fontWeight: 500, fontSize: 14 }}>Saved!</span>
                </div>
            )}

            {/* Title Row */}
            <div style={{ marginBottom: GAP + 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>Profile</h1>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your personal information</p>
            </div>

            {/* Tabs + Save Button Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: GAP, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const active = activeTab === tab.key
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 16px', borderRadius: 12,
                                    background: active ? 'linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(20, 184, 166, 0.05))' : 'rgba(255,255,255,0.9)',
                                    border: '1px solid rgba(226, 232, 240, 0.6)',
                                    color: active ? '#0f766e' : '#64748b',
                                    fontSize: 14, fontWeight: 500, cursor: 'pointer',
                                    boxShadow: active ? '4px 4px 10px rgba(166, 180, 200, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.9)' : 'none'
                                }}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
                <button
                    onClick={saveProfile}
                    disabled={saving}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 20px', borderRadius: 12,
                        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                        color: 'white', fontSize: 14, fontWeight: 500,
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)'
                    }}
                >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            {/* Content */}
            <div style={{ ...cardStyle, padding: CARD_PADDING }}>
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" value={basicInfo.full_name} onChange={(e) => setBasicInfo({ ...basicInfo, full_name: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Title</label>
                            <input type="text" value={basicInfo.title} onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input type="email" value={basicInfo.email} onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input type="tel" value={basicInfo.phone} onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Location</label>
                            <input type="text" value={basicInfo.location} onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Avatar URL</label>
                            <input type="url" value={basicInfo.avatar_url} onChange={(e) => setBasicInfo({ ...basicInfo, avatar_url: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Resume URL</label>
                            <input type="url" value={basicInfo.resume_url} onChange={(e) => setBasicInfo({ ...basicInfo, resume_url: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div>
                        <label style={labelStyle}>About Text</label>
                        <textarea
                            value={aboutText}
                            onChange={(e) => setAboutText(e.target.value)}
                            rows={10}
                            style={{ ...inputStyle, resize: 'vertical' }}
                            placeholder="Write about yourself..."
                        />
                    </div>
                )}

                {/* Expertise Tab - NEW */}
                {activeTab === 'expertise' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <p style={{ fontSize: 13, color: '#64748b' }}>
                                Add and manage expertise areas. These appear as cards on your About page. ({expertise.length} items)
                            </p>
                            <button
                                onClick={addExpertise}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '10px 16px', borderRadius: 10,
                                    background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                                    color: 'white', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer'
                                }}
                            >
                                <Plus size={14} /> Add Expertise
                            </button>
                        </div>

                        {expertise.length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                                <Sparkles size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                                <p>No expertise items yet. Click "Add Expertise" to create one.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {expertise.sort((a, b) => a.display_order - b.display_order).map((item, idx) => (
                                    <div key={item.id} style={{ padding: 16, borderRadius: 12, background: 'rgba(241, 245, 249, 0.6)', border: expandedCard === item.id ? '2px solid #0d9488' : '1px solid transparent' }}>
                                        {/* Header Row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: expandedCard === item.id ? 16 : 0 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <button onClick={() => moveExpertise(item.id, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1, padding: 2 }}><ChevronUp size={14} /></button>
                                                <button onClick={() => moveExpertise(item.id, 'down')} disabled={idx === expertise.length - 1} style={{ background: 'none', border: 'none', cursor: idx === expertise.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === expertise.length - 1 ? 0.3 : 1, padding: 2 }}><ChevronDown size={14} /></button>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.title || 'Untitled'}</div>
                                                <div style={{ fontSize: 12, color: '#64748b' }}>{item.badge} • {item.tags.length} tags</div>
                                            </div>
                                            <button
                                                onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                                                style={{ padding: 8, borderRadius: 8, background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeExpertise(item.id)}
                                                style={{ padding: 8, borderRadius: 8, background: 'rgba(254, 242, 242, 0.8)', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Expanded Editor */}
                                        {expandedCard === item.id && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                    <div>
                                                        <label style={{ ...labelStyle, fontSize: 11 }}>Title *</label>
                                                        <input type="text" value={item.title} onChange={(e) => updateExpertise(item.id, { title: e.target.value })} placeholder="e.g. Software Engineering" style={inputStyle} />
                                                    </div>
                                                    <div>
                                                        <label style={{ ...labelStyle, fontSize: 11 }}>Section Key</label>
                                                        <input type="text" value={item.section_key} onChange={(e) => updateExpertise(item.id, { section_key: e.target.value })} placeholder="e.g. expertise_swe" style={inputStyle} />
                                                    </div>
                                                    <div>
                                                        <label style={{ ...labelStyle, fontSize: 11 }}>Icon</label>
                                                        <select value={item.icon} onChange={(e) => updateExpertise(item.id, { icon: e.target.value })} style={inputStyle}>
                                                            {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ ...labelStyle, fontSize: 11 }}>Badge (Phase)</label>
                                                        <select value={item.badge} onChange={(e) => updateExpertise(item.id, { badge: e.target.value })} style={inputStyle}>
                                                            {BADGE_OPTIONS.map(badge => <option key={badge} value={badge}>{badge}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ ...labelStyle, fontSize: 11 }}>Description</label>
                                                    <textarea value={item.content} onChange={(e) => updateExpertise(item.id, { content: e.target.value })} rows={3} placeholder="Brief description of this expertise area..." style={{ ...inputStyle, resize: 'vertical' }} />
                                                </div>
                                                {/* Tags */}
                                                <div>
                                                    <label style={{ ...labelStyle, fontSize: 11 }}>Tags (Technologies)</label>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                                        {item.tags.map(tag => (
                                                            <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: '#f0fdfa', border: '1px solid #99f6e4', fontSize: 12 }}>
                                                                {tag}
                                                                <button onClick={() => removeTagFromExpertise(item.id, tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={12} /></button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <input type="text" value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTagToExpertise(item.id))} placeholder="Add tag (e.g. Python)" style={{ ...inputStyle, flex: 1 }} />
                                                        <button onClick={() => addTagToExpertise(item.id)} style={{ padding: '8px 12px', borderRadius: 8, background: '#0d9488', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12 }}>Add</button>
                                                    </div>
                                                </div>
                                                {/* Competencies */}
                                                <div>
                                                    <label style={{ ...labelStyle, fontSize: 11 }}>Competencies (Bullet Points)</label>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                                                        {item.competencies.map((comp, i) => (
                                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: '#f8fafc', fontSize: 12 }}>
                                                                <span style={{ flex: 1 }}>• {comp}</span>
                                                                <button onClick={() => removeCompetencyFromExpertise(item.id, comp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={12} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <input type="text" value={newCompetencyInput} onChange={(e) => setNewCompetencyInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetencyToExpertise(item.id))} placeholder="Add competency" style={{ ...inputStyle, flex: 1 }} />
                                                        <button onClick={() => addCompetencyToExpertise(item.id)} style={{ padding: '8px 12px', borderRadius: 8, background: '#0d9488', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12 }}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                    <div>
                        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                            Add your social media profiles. Changes are saved when you click "Save All Changes".
                        </p>
                        {socialLinks.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                                {socialLinks.map((link) => (
                                    <div key={link.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 12, background: 'rgba(241, 245, 249, 0.6)' }}>
                                        <GripVertical size={16} style={{ color: '#94a3b8', cursor: 'grab' }} />
                                        <select value={link.platform} onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)} style={{ ...inputStyle, width: 140 }}>
                                            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <input type="url" value={link.url} onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)} placeholder="https://..." style={{ ...inputStyle, flex: 1 }} />
                                        <button onClick={() => removeSocialLink(link.id)} style={{ padding: 10, borderRadius: 8, background: 'rgba(254, 242, 242, 0.8)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'end', padding: 16, borderRadius: 12, background: 'rgba(240, 253, 250, 0.6)', border: '1px dashed rgba(13, 148, 136, 0.3)' }}>
                            <div style={{ width: 140 }}>
                                <label style={{ ...labelStyle, fontSize: 11 }}>Platform</label>
                                <select value={newSocial.platform} onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })} style={inputStyle}>
                                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ ...labelStyle, fontSize: 11 }}>URL *</label>
                                <input type="url" value={newSocial.url} onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })} placeholder="https://github.com/username" style={inputStyle} />
                            </div>
                            <button onClick={addSocialLink} disabled={!newSocial.url.trim()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', borderRadius: 10, background: newSocial.url.trim() ? 'linear-gradient(135deg, #14b8a6, #0f766e)' : '#e2e8f0', color: newSocial.url.trim() ? 'white' : '#94a3b8', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                                <Plus size={16} /> Add
                            </button>
                        </div>
                    </div>
                )}

                {/* KPI Stats Tab */}
                {activeTab === 'kpis' && (
                    <div>
                        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                            Add KPI stats to display on your portfolio. Changes are saved when you click "Save All Changes".
                        </p>
                        {kpiStats.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                                {kpiStats.map((stat, index) => (
                                    <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 12, background: 'rgba(241, 245, 249, 0.6)' }}>
                                        <input type="text" value={stat.label} onChange={(e) => updateKpiStat(index, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, width: 150 }} />
                                        <input type="text" value={stat.value} onChange={(e) => updateKpiStat(index, 'value', e.target.value)} placeholder="Value" style={{ ...inputStyle, width: 120 }} />
                                        <select value={stat.section} onChange={(e) => updateKpiStat(index, 'section', e.target.value)} style={{ ...inputStyle, width: 120 }}>
                                            {KPI_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <button onClick={() => removeKpiStat(index)} style={{ padding: 10, borderRadius: 8, background: 'rgba(254, 242, 242, 0.8)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'end', padding: 16, borderRadius: 12, background: 'rgba(240, 253, 250, 0.6)', border: '1px dashed rgba(13, 148, 136, 0.3)' }}>
                            <div style={{ width: 150 }}>
                                <label style={{ ...labelStyle, fontSize: 11 }}>Label *</label>
                                <input type="text" value={newKpi.label} onChange={(e) => setNewKpi({ ...newKpi, label: e.target.value })} placeholder="e.g. Projects" style={inputStyle} />
                            </div>
                            <div style={{ width: 120 }}>
                                <label style={{ ...labelStyle, fontSize: 11 }}>Value *</label>
                                <input type="text" value={newKpi.value} onChange={(e) => setNewKpi({ ...newKpi, value: e.target.value })} placeholder="e.g. 35+" style={inputStyle} />
                            </div>
                            <div style={{ width: 120 }}>
                                <label style={{ ...labelStyle, fontSize: 11 }}>Section</label>
                                <select value={newKpi.section} onChange={(e) => setNewKpi({ ...newKpi, section: e.target.value })} style={inputStyle}>
                                    {KPI_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button onClick={addKpiStat} disabled={!newKpi.label.trim() || !newKpi.value.trim()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', borderRadius: 10, background: (newKpi.label.trim() && newKpi.value.trim()) ? 'linear-gradient(135deg, #14b8a6, #0f766e)' : '#e2e8f0', color: (newKpi.label.trim() && newKpi.value.trim()) ? 'white' : '#94a3b8', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                                <Plus size={16} /> Add
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

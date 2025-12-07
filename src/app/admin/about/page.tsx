'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import {
    Plus,
    Save,
    Trash2,
    Edit2,
    X,
    CheckCircle2,
    AlertCircle,
    FileText,
    Sparkles
} from 'lucide-react'

interface AboutContent {
    id: string
    section_key: string
    title: string | null
    content: string
    icon: string | null
    badge: string | null
    display_order: number
    is_active: boolean
}

const ICON_OPTIONS = ['Brain', 'Code', 'Bot', 'Cloud', 'Database', 'Globe', 'Cpu', 'Shield']
const BADGE_OPTIONS = ['expert', 'advanced', 'intermediate', 'beginner']

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [aboutText, setAboutText] = useState('')
    const [aboutTextId, setAboutTextId] = useState<string | null>(null)
    const [expertiseAreas, setExpertiseAreas] = useState<AboutContent[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [newExpertise, setNewExpertise] = useState({
        title: '',
        content: '',
        icon: 'Code',
        badge: 'advanced'
    })
    const [showAddForm, setShowAddForm] = useState(false)

    useEffect(() => {
        fetchAboutContent()
    }, [])

    const fetchAboutContent = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('about_content')
                .select('*')
                .order('display_order')

            if (error) throw error

            if (data) {
                const aboutTextItem = data.find(item => item.section_key === 'about_text')
                if (aboutTextItem) {
                    setAboutText(aboutTextItem.content)
                    setAboutTextId(aboutTextItem.id)
                }
                const expertise = data.filter(item => item.section_key.startsWith('expertise_'))
                setExpertiseAreas(expertise)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const saveAboutText = async () => {
        try {
            setSaving(true)
            setError(null)

            if (aboutTextId) {
                const { error } = await supabase
                    .from('about_content')
                    .update({ content: aboutText })
                    .eq('id', aboutTextId)
                if (error) throw error
            } else {
                const { data, error } = await supabase
                    .from('about_content')
                    .insert({
                        section_key: 'about_text',
                        title: 'About Me',
                        content: aboutText,
                        display_order: 0
                    })
                    .select()
                    .single()
                if (error) throw error
                if (data) setAboutTextId(data.id)
            }

            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const addExpertise = async () => {
        try {
            setSaving(true)
            setError(null)

            const nextOrder = expertiseAreas.length + 1
            const sectionKey = `expertise_${Date.now()}`

            const { data, error } = await supabase
                .from('about_content')
                .insert({
                    section_key: sectionKey,
                    title: newExpertise.title,
                    content: newExpertise.content,
                    icon: newExpertise.icon,
                    badge: newExpertise.badge,
                    display_order: nextOrder,
                    is_active: true
                })
                .select()
                .single()

            if (error) throw error

            if (data) {
                setExpertiseAreas([...expertiseAreas, data])
                setNewExpertise({ title: '', content: '', icon: 'Code', badge: 'advanced' })
                setShowAddForm(false)
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 3000)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const updateExpertise = async (id: string, updates: Partial<AboutContent>) => {
        try {
            setSaving(true)
            setError(null)

            const { error } = await supabase
                .from('about_content')
                .update(updates)
                .eq('id', id)

            if (error) throw error

            setExpertiseAreas(expertiseAreas.map(e => e.id === id ? { ...e, ...updates } : e))
            setEditingId(null)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const deleteExpertise = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expertise area?')) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from('about_content')
                .delete()
                .eq('id', id)

            if (error) throw error

            setExpertiseAreas(expertiseAreas.filter(e => e.id !== id))
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Success Banner */}
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50 animate-in slide-in-from-top">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Changes saved successfully!</span>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto">
                        <X size={16} className="text-red-400" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">About Page Editor</h1>
                    <p className="text-sm mt-1.5 text-slate-600">
                        Manage your about section content and expertise areas
                    </p>
                </div>
            </div>

            {/* About Text Section */}
            <div className="ad-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">About Me Text</h2>
                </div>

                <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    rows={6}
                    className="ad-input w-full resize-y"
                    placeholder="Write your about me text here..."
                />

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={saveAboutText}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700 transition-all disabled:opacity-50"
                    >
                        <Save size={18} />
                        Save About Text
                    </button>
                </div>
            </div>

            {/* Expertise Areas Section */}
            <div className="ad-card">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
                            <Sparkles size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Expertise Areas</h2>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700 transition-all"
                    >
                        <Plus size={18} />
                        Add Expertise
                    </button>
                </div>

                {/* Add New Expertise Form */}
                {showAddForm && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-medium text-slate-900 mb-4">Add New Expertise Area</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Title *</label>
                                <input
                                    type="text"
                                    value={newExpertise.title}
                                    onChange={(e) => setNewExpertise({ ...newExpertise, title: e.target.value })}
                                    className="ad-input w-full"
                                    placeholder="e.g., AI & Machine Learning"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Icon</label>
                                    <select
                                        value={newExpertise.icon}
                                        onChange={(e) => setNewExpertise({ ...newExpertise, icon: e.target.value })}
                                        className="ad-input w-full"
                                    >
                                        {ICON_OPTIONS.map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Badge</label>
                                    <select
                                        value={newExpertise.badge}
                                        onChange={(e) => setNewExpertise({ ...newExpertise, badge: e.target.value })}
                                        className="ad-input w-full"
                                    >
                                        {BADGE_OPTIONS.map(badge => (
                                            <option key={badge} value={badge}>{badge.charAt(0).toUpperCase() + badge.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description *</label>
                                <textarea
                                    value={newExpertise.content}
                                    onChange={(e) => setNewExpertise({ ...newExpertise, content: e.target.value })}
                                    rows={2}
                                    className="ad-input w-full resize-y"
                                    placeholder="Brief description of this expertise area..."
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 justify-end">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 rounded-lg font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addExpertise}
                                disabled={saving || !newExpertise.title || !newExpertise.content}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                            >
                                <Plus size={16} />
                                Add
                            </button>
                        </div>
                    </div>
                )}

                {/* Expertise List */}
                <div className="space-y-4">
                    {expertiseAreas.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">No expertise areas added yet. Click "Add Expertise" to get started.</p>
                    ) : (
                        expertiseAreas.map((expertise) => (
                            <div key={expertise.id} className="p-4 bg-white border border-slate-200 rounded-lg">
                                {editingId === expertise.id ? (
                                    <EditExpertiseForm
                                        expertise={expertise}
                                        onSave={(updates) => updateExpertise(expertise.id, updates)}
                                        onCancel={() => setEditingId(null)}
                                        saving={saving}
                                    />
                                ) : (
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-slate-900">{expertise.title}</h3>
                                                {expertise.badge && (
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${expertise.badge === 'expert' ? 'bg-amber-100 text-amber-700' :
                                                            expertise.badge === 'advanced' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {expertise.badge.charAt(0).toUpperCase() + expertise.badge.slice(1)}
                                                    </span>
                                                )}
                                                {expertise.icon && (
                                                    <span className="text-xs text-slate-400">({expertise.icon})</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600">{expertise.content}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => setEditingId(expertise.id)}
                                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteExpertise(expertise.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

// Edit Expertise Form Component
function EditExpertiseForm({
    expertise,
    onSave,
    onCancel,
    saving
}: {
    expertise: AboutContent
    onSave: (updates: Partial<AboutContent>) => void
    onCancel: () => void
    saving: boolean
}) {
    const [formData, setFormData] = useState({
        title: expertise.title || '',
        content: expertise.content,
        icon: expertise.icon || 'Code',
        badge: expertise.badge || 'advanced'
    })

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="ad-input w-full"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Icon</label>
                        <select
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="ad-input w-full"
                        >
                            {ICON_OPTIONS.map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Badge</label>
                        <select
                            value={formData.badge}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                            className="ad-input w-full"
                        >
                            {BADGE_OPTIONS.map(badge => (
                                <option key={badge} value={badge}>{badge.charAt(0).toUpperCase() + badge.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={2}
                        className="ad-input w-full resize-y"
                    />
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(formData)}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                >
                    <Save size={16} />
                    Save
                </button>
            </div>
        </div>
    )
}

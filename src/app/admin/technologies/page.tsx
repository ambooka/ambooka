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
    Cpu,
    GripVertical
} from 'lucide-react'

interface Technology {
    id: string
    name: string
    logo_url: string
    category: string
    display_order: number
    is_active: boolean
}

const CATEGORY_OPTIONS = ['language', 'framework', 'tool', 'cloud', 'database', 'other']

export default function AdminTechnologiesPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [technologies, setTechnologies] = useState<Technology[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)

    const [newTech, setNewTech] = useState({
        name: '',
        logo_url: '',
        category: 'language'
    })

    useEffect(() => {
        fetchTechnologies()
    }, [])

    const fetchTechnologies = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('technologies')
                .select('*')
                .order('display_order')

            if (error) throw error
            if (data) setTechnologies(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addTechnology = async () => {
        try {
            setSaving(true)
            setError(null)

            const { data, error } = await supabase
                .from('technologies')
                .insert({
                    ...newTech,
                    display_order: technologies.length,
                    is_active: true
                })
                .select()
                .single()

            if (error) throw error

            if (data) {
                setTechnologies([...technologies, data])
                setNewTech({ name: '', logo_url: '', category: 'language' })
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

    const updateTechnology = async (id: string, updates: Partial<Technology>) => {
        try {
            setSaving(true)
            const { error } = await supabase
                .from('technologies')
                .update(updates)
                .eq('id', id)

            if (error) throw error

            setTechnologies(technologies.map(t => t.id === id ? { ...t, ...updates } : t))
            setEditingId(null)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const deleteTechnology = async (id: string) => {
        if (!confirm('Are you sure you want to delete this technology?')) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from('technologies')
                .delete()
                .eq('id', id)

            if (error) throw error

            setTechnologies(technologies.filter(t => t.id !== id))
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const toggleActive = async (id: string, isActive: boolean) => {
        await updateTechnology(id, { is_active: !isActive })
    }

    // Group technologies by category
    const groupedTechnologies = technologies.reduce((acc, tech) => {
        if (!acc[tech.category]) acc[tech.category] = []
        acc[tech.category].push(tech)
        return acc
    }, {} as Record<string, Technology[]>)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Saved!</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Technologies</h1>
                    <p className="text-sm mt-1.5 text-slate-600">Manage the technologies displayed on your About page</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700"
                >
                    <Plus size={18} />
                    Add Technology
                </button>
            </div>

            {showAddForm && (
                <div className="ad-card">
                    <h3 className="font-semibold text-slate-900 mb-4">New Technology</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Name *</label>
                            <input
                                type="text"
                                value={newTech.name}
                                onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                                className="ad-input w-full"
                                placeholder="Python"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
                            <select
                                value={newTech.category}
                                onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                                className="ad-input w-full"
                            >
                                {CATEGORY_OPTIONS.map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Logo URL *</label>
                            <input
                                type="url"
                                value={newTech.logo_url}
                                onChange={(e) => setNewTech({ ...newTech, logo_url: e.target.value })}
                                className="ad-input w-full"
                                placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Tip: Use icons from <a href="https://devicon.dev/" target="_blank" className="text-violet-600 hover:underline">devicon.dev</a>
                    </p>
                    <div className="mt-4 flex gap-2 justify-end">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 rounded-lg font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={addTechnology}
                            disabled={saving || !newTech.name || !newTech.logo_url}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                        >
                            <Plus size={16} />
                            Add
                        </button>
                    </div>
                </div>
            )}

            <div className="ad-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white">
                        <Cpu size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">All Technologies ({technologies.length})</h2>
                </div>

                {technologies.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No technologies yet. Add one to get started.</p>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedTechnologies).map(([category, techs]) => (
                            <div key={category}>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                                    {category} ({techs.length})
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {techs.map((tech) => (
                                        <div
                                            key={tech.id}
                                            className={`relative group p-3 border rounded-lg text-center ${tech.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-50'}`}
                                        >
                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button
                                                    onClick={() => toggleActive(tech.id, tech.is_active)}
                                                    className={`p-1 rounded ${tech.is_active ? 'hover:bg-slate-100' : 'hover:bg-emerald-50'}`}
                                                    title={tech.is_active ? 'Hide' : 'Show'}
                                                >
                                                    {tech.is_active ? <X size={12} /> : <CheckCircle2 size={12} className="text-emerald-600" />}
                                                </button>
                                                <button
                                                    onClick={() => deleteTechnology(tech.id)}
                                                    className="p-1 rounded hover:bg-red-50 text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <img
                                                src={tech.logo_url}
                                                alt={tech.name}
                                                className="w-10 h-10 mx-auto mb-2 object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/40?text=?'
                                                }}
                                            />
                                            <p className="text-xs font-medium text-slate-700 truncate">{tech.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

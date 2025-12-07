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
    MessageSquare,
    Star
} from 'lucide-react'

interface Testimonial {
    id: string
    name: string
    avatar_url: string | null
    text: string
    date: string
    is_featured: boolean
    display_order: number
    is_active: boolean
}

export default function AdminTestimonialsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)

    const [newTestimonial, setNewTestimonial] = useState({
        name: '',
        avatar_url: '',
        text: '',
        date: new Date().toISOString().split('T')[0],
        is_featured: false
    })

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('display_order')

            if (error) throw error
            if (data) setTestimonials(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addTestimonial = async () => {
        try {
            setSaving(true)
            setError(null)

            const { data, error } = await supabase
                .from('testimonials')
                .insert({
                    ...newTestimonial,
                    avatar_url: newTestimonial.avatar_url || null,
                    display_order: testimonials.length,
                    is_active: true
                })
                .select()
                .single()

            if (error) throw error

            if (data) {
                setTestimonials([...testimonials, data])
                setNewTestimonial({
                    name: '',
                    avatar_url: '',
                    text: '',
                    date: new Date().toISOString().split('T')[0],
                    is_featured: false
                })
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

    const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
        try {
            setSaving(true)
            const { error } = await supabase
                .from('testimonials')
                .update(updates)
                .eq('id', id)

            if (error) throw error

            setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...updates } : t))
            setEditingId(null)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id)

            if (error) throw error

            setTestimonials(testimonials.filter(t => t.id !== id))
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const toggleActive = async (id: string, isActive: boolean) => {
        await updateTestimonial(id, { is_active: !isActive })
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
                    <h1 className="text-3xl font-bold text-slate-900">Testimonials</h1>
                    <p className="text-sm mt-1.5 text-slate-600">Manage recommendations and testimonials</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700"
                >
                    <Plus size={18} />
                    Add Testimonial
                </button>
            </div>

            {showAddForm && (
                <div className="ad-card">
                    <h3 className="font-semibold text-slate-900 mb-4">New Testimonial</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Name *</label>
                            <input
                                type="text"
                                value={newTestimonial.name}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                className="ad-input w-full"
                                placeholder="Dr. John Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Date</label>
                            <input
                                type="date"
                                value={newTestimonial.date}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, date: e.target.value })}
                                className="ad-input w-full"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Avatar URL</label>
                            <input
                                type="url"
                                value={newTestimonial.avatar_url}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar_url: e.target.value })}
                                className="ad-input w-full"
                                placeholder="https://example.com/avatar.jpg (optional)"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Testimonial Text *</label>
                            <textarea
                                value={newTestimonial.text}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                rows={4}
                                className="ad-input w-full resize-y"
                                placeholder="Write the testimonial here..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newTestimonial.is_featured}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, is_featured: e.target.checked })}
                                    className="rounded border-slate-300"
                                />
                                <span className="text-sm text-slate-700">Featured testimonial</span>
                            </label>
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
                            onClick={addTestimonial}
                            disabled={saving || !newTestimonial.name || !newTestimonial.text}
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
                        <MessageSquare size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">All Testimonials ({testimonials.length})</h2>
                </div>

                {testimonials.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No testimonials yet. Add one to get started.</p>
                ) : (
                    <div className="space-y-4">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className={`p-4 border rounded-lg ${testimonial.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {testimonial.avatar_url ? (
                                                <img src={testimonial.avatar_url} alt={testimonial.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-semibold text-slate-600">{testimonial.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                                                {testimonial.is_featured && (
                                                    <Star size={14} className="text-amber-500 fill-amber-500" />
                                                )}
                                                {!testimonial.is_active && (
                                                    <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded">Hidden</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2">{new Date(testimonial.date).toLocaleDateString()}</p>
                                            <p className="text-sm text-slate-600 line-clamp-2">{testimonial.text}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 ml-4">
                                        <button
                                            onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                                            className={`p-2 rounded-lg ${testimonial.is_active ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-emerald-50 text-emerald-600'}`}
                                            title={testimonial.is_active ? 'Hide' : 'Show'}
                                        >
                                            {testimonial.is_active ? <X size={16} /> : <CheckCircle2 size={16} />}
                                        </button>
                                        <button
                                            onClick={() => setEditingId(testimonial.id)}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteTestimonial(testimonial.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

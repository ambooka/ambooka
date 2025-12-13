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
    LayoutTemplate
} from 'lucide-react'

interface KPIStat {
    id: string
    label: string
    value: string
    icon: string | null
    color: string | null
    type: string | null // 'solid', 'striped', 'outline'
    section: string | null // 'hero', 'header'
    display_order: number | null
}

const TYPE_OPTIONS = ['solid', 'striped', 'outline']
const SECTION_OPTIONS = ['hero', 'header']

export default function AdminKPIsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [stats, setStats] = useState<KPIStat[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)

    const [newStat, setNewStat] = useState<Partial<KPIStat>>({
        label: '',
        value: '',
        type: 'solid',
        section: 'hero',
        color: 'bg-[#2a2a2a] text-white'
    })

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('kpi_stats')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            if (data) setStats(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addStat = async () => {
        try {
            setSaving(true)
            setError(null)

            const { data, error } = await supabase
                .from('kpi_stats')
                .insert({
                    ...newStat,
                    display_order: stats.length
                } as any)
                .select()
                .single()

            if (error) throw error

            if (data) {
                setStats([...stats, data])
                setNewStat({
                    label: '',
                    value: '',
                    type: 'solid',
                    section: 'hero',
                    color: 'bg-[#2a2a2a] text-white'
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

    const updateStat = async (id: string, updates: Partial<KPIStat>) => {
        try {
            setSaving(true)
            const { error } = await supabase
                .from('kpi_stats')
                .update(updates)
                .eq('id', id)

            if (error) throw error

            setStats(stats.map(s => s.id === id ? { ...s, ...updates } : s))
            setEditingId(null)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const deleteStat = async (id: string) => {
        if (!confirm('Are you sure you want to delete this stat?')) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from('kpi_stats')
                .delete()
                .eq('id', id)

            if (error) throw error

            setStats(stats.filter(s => s.id !== id))
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>

    // Group stats by section
    const heroStats = stats.filter(s => s.section === 'hero')
    const headerStats = stats.filter(s => s.section === 'header')

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Saved successfully!</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">KPI Stats</h1>
                    <p className="text-sm mt-1.5 text-slate-600">Manage the key performance indicators displayed on your portfolio</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700"
                >
                    <Plus size={18} />
                    Add Stat
                </button>
            </div>

            {showAddForm && (
                <div className="ad-card">
                    <h3 className="font-semibold text-slate-900 mb-4">New KPI Stat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Label</label>
                            <input
                                type="text"
                                value={newStat.label}
                                onChange={e => setNewStat({ ...newStat, label: e.target.value })}
                                className="ad-input w-full"
                                placeholder="e.g. Years Experience"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Value</label>
                            <input
                                type="text"
                                value={newStat.value}
                                onChange={e => setNewStat({ ...newStat, value: e.target.value })}
                                className="ad-input w-full"
                                placeholder="e.g. 5+"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Section</label>
                            <select
                                value={newStat.section || 'hero'}
                                onChange={e => setNewStat({ ...newStat, section: e.target.value })}
                                className="ad-input w-full"
                            >
                                {SECTION_OPTIONS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Type (Hero only)</label>
                            <select
                                value={newStat.type || 'solid'}
                                onChange={e => setNewStat({ ...newStat, type: e.target.value })}
                                className="ad-input w-full"
                            >
                                {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Color Class (Tailwind)</label>
                            <input
                                type="text"
                                value={newStat.color || ''}
                                onChange={e => setNewStat({ ...newStat, color: e.target.value })}
                                className="ad-input w-full"
                                placeholder="e.g. bg-[#2a2a2a] text-white"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                        <button onClick={addStat} disabled={saving || !newStat.value} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50">Save Stat</button>
                    </div>
                </div>
            )}

            {/* HERO SECTION STATS */}
            <div className="ad-card">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <LayoutTemplate size={18} /> Hero Stats Pills
                </h2>
                <div className="grid gap-3">
                    {heroStats.map(stat => (
                        <div key={stat.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50">
                            {editingId === stat.id ? (
                                <EditStatForm stat={stat} onSave={updates => updateStat(stat.id, updates)} onCancel={() => setEditingId(null)} />
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded text-sm ${stat.color || 'bg-white border'}`}>
                                            <span className="text-xs opacity-70 block">{stat.label}</span>
                                            <span className="font-bold">{stat.value}</span>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Type: <span className="font-medium text-slate-700">{stat.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingId(stat.id)} className="p-2 text-slate-400 hover:text-violet-600"><Edit2 size={16} /></button>
                                        <button onClick={() => deleteStat(stat.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* HEADER SECTION STATS */}
            <div className="ad-card">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <LayoutTemplate size={18} /> Header Metrics
                </h2>
                <div className="grid gap-3">
                    {headerStats.map(stat => (
                        <div key={stat.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50">
                            {editingId === stat.id ? (
                                <EditStatForm stat={stat} onSave={updates => updateStat(stat.id, updates)} onCancel={() => setEditingId(null)} />
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <span className="text-xl font-light">{stat.value}</span>
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide ml-2">{stat.label}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingId(stat.id)} className="p-2 text-slate-400 hover:text-violet-600"><Edit2 size={16} /></button>
                                        <button onClick={() => deleteStat(stat.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function EditStatForm({ stat, onSave, onCancel }: { stat: KPIStat, onSave: (u: Partial<KPIStat>) => void, onCancel: () => void }) {
    const [data, setData] = useState(stat)

    return (
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
            <input value={data.label} onChange={e => setData({ ...data, label: e.target.value })} className="ad-input text-xs" placeholder="Label" />
            <input value={data.value} onChange={e => setData({ ...data, value: e.target.value })} className="ad-input text-xs" placeholder="Value" />
            <input value={data.color || ''} onChange={e => setData({ ...data, color: e.target.value })} className="ad-input text-xs" placeholder="Color Class" />
            <div className="flex justify-end gap-1">
                <button onClick={() => onSave(data)} className="p-1.5 bg-violet-600 text-white rounded"><CheckCircle2 size={14} /></button>
                <button onClick={onCancel} className="p-1.5 bg-slate-200 text-slate-600 rounded"><X size={14} /></button>
            </div>
        </div>
    )
}

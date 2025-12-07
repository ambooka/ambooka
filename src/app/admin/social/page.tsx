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
    Link2,
    Eye,
    EyeOff
} from 'lucide-react'

interface SocialLink {
    id: string
    platform: string
    url: string
    icon_url: string | null
    display_order: number
    is_active: boolean
    show_in_sidebar: boolean
    show_in_contact: boolean
}

const PLATFORM_PRESETS = [
    { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/white' },
    { name: 'LinkedIn', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2' },
    { name: 'Twitter/X', icon: 'https://cdn.simpleicons.org/x/white' },
    { name: 'WhatsApp', icon: 'https://cdn.simpleicons.org/whatsapp/25D366' },
    { name: 'Email', icon: 'https://cdn.simpleicons.org/gmail/EA4335' },
    { name: 'Medium', icon: 'https://cdn.simpleicons.org/medium/white' },
    { name: 'Stack Overflow', icon: 'https://cdn.simpleicons.org/stackoverflow/F58025' },
    { name: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
    { name: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
    { name: 'Custom', icon: '' }
]

export default function AdminSocialLinksPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)

    const [newLink, setNewLink] = useState({
        platform: 'GitHub',
        url: '',
        icon_url: PLATFORM_PRESETS[0].icon,
        show_in_sidebar: true,
        show_in_contact: true
    })

    useEffect(() => {
        fetchSocialLinks()
    }, [])

    const fetchSocialLinks = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('social_links')
                .select('*')
                .order('display_order')

            if (error) throw error
            if (data) setSocialLinks(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handlePlatformChange = (platform: string) => {
        const preset = PLATFORM_PRESETS.find(p => p.name === platform)
        setNewLink({
            ...newLink,
            platform,
            icon_url: preset?.icon || ''
        })
    }

    const addSocialLink = async () => {
        try {
            setSaving(true)
            setError(null)

            const { data, error } = await supabase
                .from('social_links')
                .insert({
                    platform: newLink.platform,
                    url: newLink.url,
                    icon_url: newLink.icon_url || null,
                    show_in_sidebar: newLink.show_in_sidebar,
                    show_in_contact: newLink.show_in_contact,
                    display_order: socialLinks.length,
                    is_active: true
                })
                .select()
                .single()

            if (error) throw error

            if (data) {
                setSocialLinks([...socialLinks, data])
                setNewLink({
                    platform: 'GitHub',
                    url: '',
                    icon_url: PLATFORM_PRESETS[0].icon,
                    show_in_sidebar: true,
                    show_in_contact: true
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

    const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
        try {
            setSaving(true)
            const { error } = await supabase
                .from('social_links')
                .update(updates)
                .eq('id', id)

            if (error) throw error

            setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, ...updates } : l))
            setEditingId(null)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const deleteSocialLink = async (id: string) => {
        if (!confirm('Are you sure you want to delete this social link?')) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from('social_links')
                .delete()
                .eq('id', id)

            if (error) throw error

            setSocialLinks(socialLinks.filter(l => l.id !== id))
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
                    <h1 className="text-3xl font-bold text-slate-900">Social Links</h1>
                    <p className="text-sm mt-1.5 text-slate-600">Manage your social media links</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700"
                >
                    <Plus size={18} />
                    Add Link
                </button>
            </div>

            {showAddForm && (
                <div className="ad-card">
                    <h3 className="font-semibold text-slate-900 mb-4">New Social Link</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Platform</label>
                            <select
                                value={newLink.platform}
                                onChange={(e) => handlePlatformChange(e.target.value)}
                                className="ad-input w-full"
                            >
                                {PLATFORM_PRESETS.map(p => (
                                    <option key={p.name} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">URL *</label>
                            <input
                                type="url"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                className="ad-input w-full"
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Icon URL</label>
                            <input
                                type="url"
                                value={newLink.icon_url}
                                onChange={(e) => setNewLink({ ...newLink, icon_url: e.target.value })}
                                className="ad-input w-full"
                                placeholder="Icon URL (auto-filled from platform)"
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newLink.show_in_sidebar}
                                    onChange={(e) => setNewLink({ ...newLink, show_in_sidebar: e.target.checked })}
                                    className="rounded border-slate-300"
                                />
                                <span className="text-sm text-slate-700">Show in Sidebar</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newLink.show_in_contact}
                                    onChange={(e) => setNewLink({ ...newLink, show_in_contact: e.target.checked })}
                                    className="rounded border-slate-300"
                                />
                                <span className="text-sm text-slate-700">Show in Contact</span>
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
                            onClick={addSocialLink}
                            disabled={saving || !newLink.url}
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
                        <Link2 size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">All Social Links ({socialLinks.length})</h2>
                </div>

                {socialLinks.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No social links yet. Add one to get started.</p>
                ) : (
                    <div className="space-y-3">
                        {socialLinks.map((link) => (
                            <div
                                key={link.id}
                                className={`flex items-center gap-4 p-4 border rounded-lg ${link.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    {link.icon_url ? (
                                        <img src={link.icon_url} alt={link.platform} width="24" height="24" />
                                    ) : (
                                        <Link2 size={20} className="text-slate-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900">{link.platform}</h3>
                                        {!link.is_active && (
                                            <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded">Hidden</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">{link.url}</p>
                                    <div className="flex gap-4 mt-1 text-xs text-slate-400">
                                        <span className={link.show_in_sidebar ? 'text-emerald-600' : ''}>
                                            {link.show_in_sidebar ? '✓' : '✗'} Sidebar
                                        </span>
                                        <span className={link.show_in_contact ? 'text-emerald-600' : ''}>
                                            {link.show_in_contact ? '✓' : '✗'} Contact
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => updateSocialLink(link.id, { is_active: !link.is_active })}
                                        className={`p-2 rounded-lg ${link.is_active ? 'hover:bg-slate-100' : 'hover:bg-emerald-50 text-emerald-600'}`}
                                        title={link.is_active ? 'Hide' : 'Show'}
                                    >
                                        {link.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => deleteSocialLink(link.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

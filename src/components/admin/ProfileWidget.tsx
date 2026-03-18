'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User, Mail, Phone, MapPin, Edit2, Save, X, CheckCircle2 } from 'lucide-react'

export default function ProfileWidget() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [profileId, setProfileId] = useState<string | null>(null)

    const [profileData, setProfileData] = useState({
        full_name: '',
        title: '',
        email: '',
        phone: '',
        location: ''
    })

    const [editData, setEditData] = useState({ ...profileData })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('personal_info')
            .select('*')
            .limit(1)
            .single()

        if (data) {
            setProfileId(data.id)
            const profile = {
                full_name: data.full_name || '',
                title: data.title || '',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || ''
            }
            setProfileData(profile)
            setEditData(profile)
        }
        setLoading(false)
    }

    const handleEdit = () => {
        setEditData({ ...profileData })
        setIsEditing(true)
    }

    const handleCancel = () => {
        setEditData({ ...profileData })
        setIsEditing(false)
    }

    const handleSave = async () => {
        setSaving(true)

        const payload = {
            ...editData,
            phone: editData.phone || null,
            location: editData.location || null
        }

        let error
        if (profileId) {
            const { error: updateError } = await supabase
                .from('personal_info')
                .update(payload)
                .eq('id', profileId)
            error = updateError
        } else {
            const { data, error: insertError } = await supabase
                .from('personal_info')
                .insert(payload)
                .select()
                .single()
            error = insertError
            if (data) setProfileId(data.id)
        }

        if (error) {
            alert('Error saving profile: ' + error.message)
        } else {
            setProfileData(editData)
            setIsEditing(false)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="ad-card">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="ad-card relative overflow-hidden">
            {/* Success Banner */}
            {showSuccess && (
                <div className="absolute top-0 left-0 right-0 bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center gap-2 animate-slide-down">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Profile updated successfully!</span>
                </div>
            )}

            <div className={`transition-all duration-300 ${showSuccess ? 'pt-12' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
                            <User size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="ad-btn-icon"
                            title="Edit profile"
                        >
                            <Edit2 size={18} />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="ad-btn-icon hover:bg-red-50 hover:text-red-600"
                                title="Cancel"
                            >
                                <X size={18} />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="ad-btn-icon hover:bg-violet-50 hover:text-violet-600"
                                title="Save changes"
                            >
                                <Save size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {!isEditing ? (
                    // View Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-slate-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-slate-900 truncate">{profileData.full_name || '—'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-slate-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Title</p>
                                <p className="text-sm font-semibold text-slate-900 truncate">{profileData.title || '—'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Mail size={16} className="text-slate-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Email</p>
                                <p className="text-sm font-semibold text-slate-900 truncate">{profileData.email || '—'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Phone size={16} className="text-slate-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                                <p className="text-sm font-semibold text-slate-900 truncate">{profileData.phone || '—'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 md:col-span-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <MapPin size={16} className="text-slate-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Location</p>
                                <p className="text-sm font-semibold text-slate-900 truncate">{profileData.location || '—'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={editData.full_name}
                                onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                                className="ad-input"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Professional Title *</label>
                            <input
                                type="text"
                                required
                                value={editData.title}
                                onChange={e => setEditData({ ...editData, title: e.target.value })}
                                className="ad-input"
                                placeholder="e.g., Full Stack Developer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email *</label>
                            <input
                                type="email"
                                required
                                value={editData.email}
                                onChange={e => setEditData({ ...editData, email: e.target.value })}
                                className="ad-input"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone</label>
                            <input
                                type="tel"
                                value={editData.phone}
                                onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                className="ad-input"
                                placeholder="+254 XXX XXX XXX"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Location</label>
                            <input
                                type="text"
                                value={editData.location}
                                onChange={e => setEditData({ ...editData, location: e.target.value })}
                                className="ad-input"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-down {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

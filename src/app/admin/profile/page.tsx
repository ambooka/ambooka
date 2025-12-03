'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Save } from 'lucide-react'

export default function ProfileManager() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profileId, setProfileId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        full_name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin_url: '',
        github_url: '',
        website_url: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('personal_info')
            .select('*')
            .limit(1)
            .single()

        if (data) {
            setProfileId(data.id)
            setFormData({
                full_name: data.full_name,
                title: data.title,
                email: data.email,
                phone: data.phone || '',
                location: data.location || '',
                summary: data.summary || '',
                linkedin_url: data.linkedin_url || '',
                github_url: data.github_url || '',
                website_url: data.website_url || ''
            })
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const payload = {
            ...formData,
            phone: formData.phone || null,
            location: formData.location || null,
            summary: formData.summary || null,
            linkedin_url: formData.linkedin_url || null,
            github_url: formData.github_url || null,
            website_url: formData.website_url || null
        }

        let error
        if (profileId) {
            const { error: updateError } = await supabase
                .from('personal_info')
                .update(payload)
                .eq('id', profileId)
            error = updateError
        } else {
            // Create new if doesn't exist (shouldn't happen usually)
            const { error: insertError } = await supabase.from('personal_info').insert(payload)
            error = insertError
        }

        if (error) {
            alert('Error saving data: ' + error.message)
        } else {
            alert('Profile updated successfully!')
        }
        setSaving(false)
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile data...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="ad-flex-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Profile Manager</h1>
            </div>

            <form onSubmit={handleSubmit} className="ad-card space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Professional Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">LinkedIn URL</label>
                        <input
                            type="url"
                            value={formData.linkedin_url}
                            onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">GitHub URL</label>
                        <input
                            type="url"
                            value={formData.github_url}
                            onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Website URL</label>
                        <input
                            type="url"
                            value={formData.website_url}
                            onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                            className="ad-input"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Professional Summary</label>
                    <textarea
                        rows={6}
                        value={formData.summary}
                        onChange={e => setFormData({ ...formData, summary: e.target.value })}
                        className="ad-input"
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="ad-btn ad-btn-primary"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form >
        </div >
    )
}

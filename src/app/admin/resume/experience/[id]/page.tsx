'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function ExperienceEditor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const isNew = params.id === 'new'
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        responsibilities: [] as string[],
        achievements: [] as string[],
        technologies: [] as string[],
        display_order: 0
    })

    useEffect(() => {
        if (!isNew) {
            fetchData()
        }
    }, [isNew])

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) {
            alert('Error fetching data: ' + error.message)
            router.push('/admin/resume')
            return
        }

        if (data) {
            setFormData({
                company: data.company,
                position: data.position,
                location: data.location || '',
                start_date: data.start_date.split('T')[0],
                end_date: data.end_date ? data.end_date.split('T')[0] : '',
                is_current: data.is_current,
                description: data.description || '',
                responsibilities: data.responsibilities || [],
                achievements: data.achievements || [],
                technologies: data.technologies || [],
                display_order: data.display_order || 0
            })
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const payload = {
            ...formData,
            end_date: formData.is_current ? null : (formData.end_date || null),
            location: formData.location || null,
            description: formData.description || null,
            responsibilities: formData.responsibilities.length > 0 ? formData.responsibilities : null,
            achievements: formData.achievements.length > 0 ? formData.achievements : null,
            technologies: formData.technologies.length > 0 ? formData.technologies : null,
        }

        let error
        if (isNew) {
            const { error: insertError } = await supabase.from('experience').insert(payload)
            error = insertError
        } else {
            const { error: updateError } = await supabase
                .from('experience')
                .update(payload)
                .eq('id', params.id)
            error = updateError
        }

        if (error) {
            alert('Error saving data: ' + error.message)
        } else {
            router.push('/admin/resume')
        }
        setSaving(false)
    }

    const handleArrayChange = (
        field: 'responsibilities' | 'achievements' | 'technologies',
        index: number,
        value: string
    ) => {
        const newArray = [...formData[field]]
        newArray[index] = value
        setFormData({ ...formData, [field]: newArray })
    }

    const addArrayItem = (field: 'responsibilities' | 'achievements' | 'technologies') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] })
    }

    const removeArrayItem = (
        field: 'responsibilities' | 'achievements' | 'technologies',
        index: number
    ) => {
        const newArray = [...formData[field]]
        newArray.splice(index, 1)
        setFormData({ ...formData, [field]: newArray })
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/resume"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isNew ? 'Add Experience' : 'Edit Experience'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                            type="text"
                            required
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <input
                            type="text"
                            required
                            value={formData.position}
                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                        <input
                            type="number"
                            value={formData.display_order}
                            onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            required
                            value={formData.start_date}
                            onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            disabled={formData.is_current}
                            value={formData.end_date}
                            onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                        />
                    </div>
                    <div className="flex items-center h-10">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_current}
                                onChange={e => setFormData({ ...formData, is_current: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Currently working here</span>
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Dynamic Arrays */}
                {[
                    { field: 'responsibilities', label: 'Responsibilities' },
                    { field: 'achievements', label: 'Achievements' },
                    { field: 'technologies', label: 'Technologies' }
                ].map(({ field, label }) => (
                    <div key={field}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <button
                                type="button"
                                onClick={() => addArrayItem(field as any)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(formData[field as keyof typeof formData] as string[]).map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={e => handleArrayChange(field as any, idx, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(field as any, idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                            {(formData[field as keyof typeof formData] as string[]).length === 0 && (
                                <p className="text-sm text-gray-500 italic">No items added yet.</p>
                            )}
                        </div>
                    </div>
                ))}

                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function SkillEditor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const isNew = params.id === 'new'
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        category: 'frontend',
        proficiency_level: 80,
        is_featured: false,
        display_order: 0
    })

    const categories = [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'database', label: 'Database' },
        { value: 'devops', label: 'DevOps' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'ai_ml', label: 'AI / ML' },
        { value: 'tools', label: 'Tools' },
        { value: 'other', label: 'Other' }
    ]

    useEffect(() => {
        if (!isNew) {
            fetchData()
        }
    }, [isNew])

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) {
            alert('Error fetching data: ' + error.message)
            router.push('/admin/skills')
            return
        }

        if (data) {
            setFormData({
                name: data.name,
                category: data.category,
                proficiency_level: data.proficiency_level || 0,
                is_featured: data.is_featured,
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
            proficiency_level: formData.proficiency_level || null,
        }

        let error
        if (isNew) {
            const { error: insertError } = await supabase.from('skills').insert(payload)
            error = insertError
        } else {
            const { error: updateError } = await supabase
                .from('skills')
                .update(payload)
                .eq('id', params.id)
            error = updateError
        }

        if (error) {
            alert('Error saving data: ' + error.message)
        } else {
            router.push('/admin/skills')
        }
        setSaving(false)
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/skills"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isNew ? 'Add Skill' : 'Edit Skill'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. React, Python"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proficiency Level ({formData.proficiency_level}%)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={formData.proficiency_level}
                        onChange={e => setFormData({ ...formData, proficiency_level: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Skill</span>
                    </label>
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

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function ProjectEditor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const isNew = params.id === 'new'
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        category: 'web_app',
        description: '',
        technologies: [] as string[],
        github_url: '',
        live_url: '',
        image_url: '',
        tags: [] as string[],
        is_featured: false,
        display_order: 0,
        content: '' // For blog posts or detailed content if needed
    })

    const categories = [
        { value: 'web_app', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile App' },
        { value: 'ai_ml', label: 'AI / Machine Learning' },
        { value: 'devops', label: 'DevOps' },
        { value: 'iot', label: 'IoT' },
        { value: 'other', label: 'Other' }
    ]

    useEffect(() => {
        if (!isNew) {
            fetchData()
        }
    }, [isNew])

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) {
            alert('Error fetching data: ' + error.message)
            router.push('/admin/projects')
            return
        }

        if (data) {
            setFormData({
                title: data.title,
                category: data.category,
                description: data.description || '',
                technologies: data.technologies || [],
                github_url: data.github_url || '',
                live_url: data.live_url || '',
                image_url: data.image_url || '',
                tags: data.tags || [],
                is_featured: data.is_featured || false,
                display_order: data.display_order || 0,
                content: data.content || ''
            })
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const payload = {
            ...formData,
            technologies: formData.technologies.length > 0 ? formData.technologies : null,
            tags: formData.tags.length > 0 ? formData.tags : null,
            github_url: formData.github_url || null,
            live_url: formData.live_url || null,
            image_url: formData.image_url || null,
            content: formData.content || formData.description // Fallback content
        }

        let error
        if (isNew) {
            const { error: insertError } = await supabase.from('portfolio_content').insert(payload)
            error = insertError
        } else {
            const { error: updateError } = await supabase
                .from('portfolio_content')
                .update(payload)
                .eq('id', params.id)
            error = updateError
        }

        if (error) {
            alert('Error saving data: ' + error.message)
        } else {
            router.push('/admin/projects')
        }
        setSaving(false)
    }

    const handleArrayChange = (
        field: 'technologies' | 'tags',
        index: number,
        value: string
    ) => {
        const newArray = [...formData[field]]
        newArray[index] = value
        setFormData({ ...formData, [field]: newArray })
    }

    const addArrayItem = (field: 'technologies' | 'tags') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] })
    }

    const removeArrayItem = (
        field: 'technologies' | 'tags',
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
                    href="/admin/projects"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isNew ? 'Add Project' : 'Edit Project'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                        <input
                            type="number"
                            value={formData.display_order}
                            onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                        <input
                            type="url"
                            value={formData.github_url}
                            onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                        <input
                            type="url"
                            value={formData.live_url}
                            onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="/assets/images/..."
                        />
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

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Project</span>
                    </label>
                </div>

                {/* Dynamic Arrays */}
                {[
                    { field: 'technologies', label: 'Technologies' },
                    { field: 'tags', label: 'Tags' }
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {(formData[field as keyof typeof formData] as string[]).map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={e => handleArrayChange(field as any, idx, e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(field as any, idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
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

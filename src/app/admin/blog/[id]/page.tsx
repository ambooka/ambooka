'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function BlogPostEditor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const isNew = params.id === 'new'
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '', // Used as excerpt
        content: '', // Main content
        image_url: '',
        tags: [] as string[],
        is_featured: false,
        category: 'blog'
    })

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
            router.push('/admin/blog')
            return
        }

        if (data) {
            setFormData({
                title: data.title,
                description: data.description || '',
                content: data.content || '',
                image_url: data.image_url || '',
                tags: data.tags || [],
                is_featured: data.is_featured || false,
                category: 'blog'
            })
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const payload = {
            ...formData,
            tags: formData.tags.length > 0 ? formData.tags : null,
            image_url: formData.image_url || null,
            content: formData.content || null,
            description: formData.description || null
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
            router.push('/admin/blog')
        }
        setSaving(false)
    }

    const handleTagChange = (index: number, value: string) => {
        const newTags = [...formData.tags]
        newTags[index] = value
        setFormData({ ...formData, tags: newTags })
    }

    const addTag = () => {
        setFormData({ ...formData, tags: [...formData.tags, ''] })
    }

    const removeTag = (index: number) => {
        const newTags = [...formData.tags]
        newTags.splice(index, 1)
        setFormData({ ...formData, tags: newTags })
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/blog"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isNew ? 'Add Blog Post' : 'Edit Blog Post'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium"
                            placeholder="Enter post title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="/assets/images/blog/..."
                        />
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt / Short Description</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Brief summary of the post..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
                    <textarea
                        rows={15}
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        placeholder="# Heading&#10;&#10;Write your post content here..."
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
                        <span className="text-sm font-medium text-gray-700">Featured Post</span>
                    </label>
                </div>

                {/* Tags */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Tags</label>
                        <button
                            type="button"
                            onClick={addTag}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <Plus size={16} /> Add Tag
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200 pl-3 pr-1 py-1">
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={e => handleTagChange(idx, e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 p-0 w-24 text-sm"
                                    placeholder="Tag..."
                                />
                                <button
                                    type="button"
                                    onClick={() => removeTag(idx)}
                                    className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {formData.tags.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No tags added yet.</p>
                        )}
                    </div>
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

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
    Briefcase,
    Github,
    ExternalLink
} from 'lucide-react'

interface Project {
    id: string
    title: string
    description: string | null
    stack: string[] | null
    status: string
    github_url: string | null
    live_url: string | null
    image_url: string | null
    is_featured: boolean
    display_order: number | null
}

const STATUS_OPTIONS = ['Deployed', 'WIP', 'Research', 'Stable', 'Monitored', 'Completed', 'Archived']

export default function AdminProjectsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)

    // Form states
    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: '',
        description: '',
        stack: [],
        status: 'WIP',
        github_url: '',
        live_url: '',
        is_featured: true
    })

    const [stackInput, setStackInput] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            if (data) setProjects(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleStackInput = (e: React.KeyboardEvent, isEditing: boolean, currentStack: string[] = []) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const val = stackInput.trim()
            if (val) {
                if (isEditing && editingId) {
                    // Update editing project logic is handled in EditForm component usually, 
                    // but here we simplify by handling stack locally in the Edit component
                } else {
                    setNewProject(prev => ({
                        ...prev,
                        stack: [...(prev.stack || []), val]
                    }))
                }
                setStackInput('')
            }
        }
    }

    const addProject = async () => {
        try {
            setSaving(true)
            setError(null)

            const { data, error } = await supabase
                .from('projects')
                .insert({
                    ...newProject,
                    display_order: projects.length,
                    stack: newProject.stack || []
                } as any)
                .select()
                .single()

            if (error) throw error

            if (data) {
                setProjects([...projects, data])
                setNewProject({
                    title: '',
                    description: '',
                    stack: [],
                    status: 'WIP',
                    github_url: '',
                    live_url: '',
                    is_featured: true
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

    const updateProject = async (id: string, updates: Partial<Project>) => {
        try {
            setSaving(true)
            const { error } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', id)

            if (error) throw error

            setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p))
            setEditingId(null)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const deleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id)

            if (error) throw error

            setProjects(projects.filter(p => p.id !== id))
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Project saved successfully!</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
                    <p className="text-sm mt-1.5 text-slate-600">Manage, edit, and reorganize your portfolio projects</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            {showAddForm && (
                <div className="ad-card">
                    <h3 className="font-semibold text-slate-900 mb-4">New Project</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Project Title *</label>
                            <input
                                type="text"
                                value={newProject.title}
                                onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                className="ad-input w-full"
                                placeholder="e.g. LLM RAG Pipeline"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                            <textarea
                                value={newProject.description || ''}
                                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                className="ad-input w-full"
                                rows={3}
                                placeholder="Brief summary of the project..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                            <select
                                value={newProject.status}
                                onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                                className="ad-input w-full"
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Tech Stack (comma separated)</label>
                            <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg bg-white">
                                {newProject.stack?.map((tech, i) => (
                                    <span key={i} className="px-2 py-1 bg-violet-50 text-violet-700 rounded text-xs flex items-center gap-1">
                                        {tech}
                                        <button onClick={() => setNewProject(p => ({ ...p, stack: p.stack?.filter((_, idx) => idx !== i) }))}><X size={12} /></button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={stackInput}
                                    onChange={e => setStackInput(e.target.value)}
                                    onKeyDown={e => handleStackInput(e, false)}
                                    className="outline-none text-sm flex-1 min-w-[100px]"
                                    placeholder="Type & Enter..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">GitHub URL</label>
                            <input
                                type="url"
                                value={newProject.github_url || ''}
                                onChange={e => setNewProject({ ...newProject, github_url: e.target.value })}
                                className="ad-input w-full"
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Live/Demo URL</label>
                            <input
                                type="url"
                                value={newProject.live_url || ''}
                                onChange={e => setNewProject({ ...newProject, live_url: e.target.value })}
                                className="ad-input w-full"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                        <button onClick={addProject} disabled={saving || !newProject.title} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50">Save Project</button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {projects.map(project => (
                    <div key={project.id} className="ad-card group">
                        {editingId === project.id ? (
                            <EditProjectForm project={project} onSave={updates => updateProject(project.id, updates)} onCancel={() => setEditingId(null)} />
                        ) : (
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        {project.title}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === 'Deployed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {project.status}
                                        </span>
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {project.stack?.map(tech => (
                                            <span key={tech} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded border border-slate-100">{tech}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-3">
                                        {project.github_url && <a href={project.github_url} target="_blank" className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600"><Github size={14} /> Code</a>}
                                        {project.live_url && <a href={project.live_url} target="_blank" className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600"><ExternalLink size={14} /> Live Demo</a>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingId(project.id)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"><Edit2 size={18} /></button>
                                    <button onClick={() => deleteProject(project.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function EditProjectForm({ project, onSave, onCancel }: { project: Project, onSave: (u: Partial<Project>) => void, onCancel: () => void }) {
    const [data, setData] = useState(project)
    const [stackInput, setStackInput] = useState('')

    const handleStackInput = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const val = stackInput.trim()
            if (val) {
                setData(p => ({ ...p, stack: [...(p.stack || []), val] }))
                setStackInput('')
            }
        }
    }

    return (
        <div className="space-y-4">
            <input
                type="text"
                value={data.title}
                onChange={e => setData({ ...data, title: e.target.value })}
                className="ad-input w-full font-semibold"
            />
            <textarea
                value={data.description || ''}
                onChange={e => setData({ ...data, description: e.target.value })}
                className="ad-input w-full"
                rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
                <select
                    value={data.status}
                    onChange={e => setData({ ...data, status: e.target.value })}
                    className="ad-input w-full"
                >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg bg-white">
                    {data.stack?.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-violet-50 text-violet-700 rounded text-xs flex items-center gap-1">
                            {tech}
                            <button onClick={() => setData(p => ({ ...p, stack: (p.stack || []).filter((_, idx) => idx !== i) }))}><X size={12} /></button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={stackInput}
                        onChange={e => setStackInput(e.target.value)}
                        onKeyDown={handleStackInput}
                        className="outline-none text-sm flex-1 min-w-[50px]"
                        placeholder="Add tech..."
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                <button onClick={() => onSave(data)} className="px-3 py-1.5 bg-violet-600 text-white rounded hover:bg-violet-700">Save</button>
            </div>
        </div>
    )
}

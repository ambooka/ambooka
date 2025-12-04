'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import DataTable from '@/components/admin/DataTable'
import { useRouter } from 'next/navigation'

export default function ProjectsManager() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('*')
            .order('updated_at', { ascending: false })

        if (data) setProjects(data)
        setLoading(false)
    }

    const handleDelete = async (item: any) => {
        if (!confirm('Are you sure you want to delete this project?')) return

        const { error } = await supabase.from('portfolio_content').delete().eq('id', item.id)
        if (error) {
            alert('Error deleting item: ' + error.message)
        } else {
            fetchData()
        }
    }

    const columns = [
        { header: 'Title', accessor: 'title' },
        {
            header: 'Category',
            accessor: (item: any) => (
                <span className="capitalize px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                        backgroundColor: 'var(--utility-btn-hover-bg)',
                        color: 'var(--accent-primary)'
                    }}>
                    {item.category.replace('_', ' ')}
                </span>
            )
        },
        {
            header: 'Featured',
            accessor: (item: any) => (
                item.is_featured
                    ? <span style={{ color: 'var(--accent-secondary)' }}>★</span>
                    : <span style={{ color: 'var(--text-tertiary)' }}>★</span>
            )
        },
        {
            header: 'Links',
            accessor: (item: any) => (
                <div className="flex gap-2 text-xs">
                    {item.github_url && <a href={item.github_url} target="_blank" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>GitHub</a>}
                    {item.live_url && <a href={item.live_url} target="_blank" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>Live</a>}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Projects Manager</h1>
            </div>

            <DataTable
                title="Portfolio Projects"
                columns={columns}
                data={projects}
                loading={loading}
                onAdd={() => router.push('/admin/projects/new')}
                onEdit={(item) => router.push(`/admin/projects/${item.id}`)}
                onDelete={handleDelete}
            />
        </div>
    )
}

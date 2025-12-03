'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import DataTable from '@/components/admin/DataTable'
import { useRouter } from 'next/navigation'

export default function BlogManager() {
    const [posts, setPosts] = useState<any[]>([])
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
            .eq('category', 'blog')
            .order('created_at', { ascending: false })

        if (data) setPosts(data)
        setLoading(false)
    }

    const handleDelete = async (item: any) => {
        if (!confirm('Are you sure you want to delete this post?')) return

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
            header: 'Date',
            accessor: (item: any) => new Date(item.created_at).toLocaleDateString()
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
            header: 'Tags',
            accessor: (item: any) => (
                <div className="flex gap-1 flex-wrap">
                    {item.tags?.slice(0, 3).map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                            {tag}
                        </span>
                    ))}
                    {item.tags?.length > 3 && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>+{item.tags.length - 3}</span>}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Blog Manager</h1>
            </div>

            <DataTable
                title="Blog Posts"
                columns={columns}
                data={posts}
                loading={loading}
                onAdd={() => router.push('/admin/blog/new')}
                onEdit={(item) => router.push(`/admin/blog/${item.id}`)}
                onDelete={handleDelete}
            />
        </div>
    )
}

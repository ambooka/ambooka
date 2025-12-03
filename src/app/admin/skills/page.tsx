'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import DataTable from '@/components/admin/DataTable'
import { useRouter } from 'next/navigation'

export default function SkillsManager() {
    const [skills, setSkills] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('category', { ascending: true })
            .order('proficiency_level', { ascending: false })

        if (data) setSkills(data)
        setLoading(false)
    }

    const handleDelete = async (item: any) => {
        if (!confirm('Are you sure you want to delete this skill?')) return

        const { error } = await supabase.from('skills').delete().eq('id', item.id)
        if (error) {
            alert('Error deleting item: ' + error.message)
        } else {
            fetchData()
        }
    }

    const columns = [
        { header: 'Name', accessor: 'name' },
        {
            header: 'Category',
            accessor: (item: any) => (
                <span className="capitalize">{item.category.replace('_', ' ')}</span>
            )
        },
        {
            header: 'Proficiency',
            accessor: (item: any) => (
                <div className="w-24 rounded-full h-2.5" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div
                        className="h-2.5 rounded-full"
                        style={{ width: `${item.proficiency_level}%`, backgroundColor: 'var(--accent-primary)' }}
                    ></div>
                </div>
            )
        },
        {
            header: 'Featured',
            accessor: (item: any) => (
                item.is_featured
                    ? <span style={{ color: 'var(--accent-secondary)' }}>★</span>
                    : <span style={{ color: 'var(--text-tertiary)' }}>★</span>
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Skills Manager</h1>
            </div>

            <DataTable
                title="Technical Skills"
                columns={columns}
                data={skills}
                loading={loading}
                onAdd={() => router.push('/admin/skills/new')}
                onEdit={(item) => router.push(`/admin/skills/${item.id}`)}
                onDelete={handleDelete}
            />
        </div>
    )
}

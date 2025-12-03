'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import DataTable from '@/components/admin/DataTable'
import { useRouter } from 'next/navigation'

export default function ResumeManager() {
    const [experience, setExperience] = useState<any[]>([])
    const [education, setEducation] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const [expResult, eduResult] = await Promise.all([
            supabase.from('experience').select('*').order('display_order', { ascending: true }),
            supabase.from('education').select('*').order('display_order', { ascending: true })
        ])

        if (expResult.data) setExperience(expResult.data)
        if (eduResult.data) setEducation(eduResult.data)
        setLoading(false)
    }

    const handleDeleteExperience = async (item: any) => {
        if (!confirm('Are you sure you want to delete this experience entry?')) return

        const { error } = await supabase.from('experience').delete().eq('id', item.id)
        if (error) {
            alert('Error deleting item: ' + error.message)
        } else {
            fetchData()
        }
    }

    const handleDeleteEducation = async (item: any) => {
        if (!confirm('Are you sure you want to delete this education entry?')) return

        const { error } = await supabase.from('education').delete().eq('id', item.id)
        if (error) {
            alert('Error deleting item: ' + error.message)
        } else {
            fetchData()
        }
    }

    const expColumns = [
        { header: 'Company', accessor: 'company' },
        { header: 'Position', accessor: 'position' },
        {
            header: 'Period',
            accessor: (item: any) => (
                <span>
                    {new Date(item.start_date).getFullYear()} -
                    {item.is_current ? 'Present' : (item.end_date ? new Date(item.end_date).getFullYear() : '')}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: (item: any) => (
                item.is_current
                    ? <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--utility-btn-hover-bg)', color: 'var(--accent-success)' }}>Current</span>
                    : <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Past</span>
            )
        }
    ]

    const eduColumns = [
        { header: 'Institution', accessor: 'institution' },
        { header: 'Degree', accessor: 'degree' },
        { header: 'Field', accessor: 'field_of_study' },
        {
            header: 'Year',
            accessor: (item: any) => new Date(item.start_date).getFullYear()
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Resume Manager</h1>
            </div>

            <DataTable
                title="Experience"
                columns={expColumns}
                data={experience}
                loading={loading}
                onAdd={() => router.push('/admin/resume/experience/new')}
                onEdit={(item) => router.push(`/admin/resume/experience/${item.id}`)}
                onDelete={handleDeleteExperience}
            />

            <DataTable
                title="Education"
                columns={eduColumns}
                data={education}
                loading={loading}
                onAdd={() => router.push('/admin/resume/education/new')}
                onEdit={(item) => router.push(`/admin/resume/education/${item.id}`)}
                onDelete={handleDeleteEducation}
            />
        </div>
    )
}

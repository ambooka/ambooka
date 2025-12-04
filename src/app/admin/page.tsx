'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import {
    Plus,
    Upload
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import RecentBlogWidget from '@/components/admin/RecentBlogWidget'
import QuickActionsWidget from '@/components/admin/QuickActionsWidget'
import ProjectListWidget from '@/components/admin/ProjectListWidget'
import ProjectProgressChart from '@/components/admin/ProjectProgressChart'
import RecentActivityWidget from '@/components/admin/RecentActivityWidget'
import RecentMessagesWidget from '@/components/admin/RecentMessagesWidget'
import VisitorAnalyticsWidget from '@/components/admin/VisitorAnalyticsWidget'
import ProfileWidget from '@/components/admin/ProfileWidget'

interface DashboardStats {
    totalProjects: number
    featuredSkills: number
    experienceYears: number
    blogPosts: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProjects: 0,
        featuredSkills: 0,
        experienceYears: 0,
        blogPosts: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Fetch total projects count
            const { count: projectsCount, error: projectsError } = await supabase
                .from('portfolio_content')
                .select('*', { count: 'exact', head: true })
                .eq('category', 'project')

            if (projectsError) throw projectsError

            // Fetch featured skills count
            const { count: skillsCount, error: skillsError } = await supabase
                .from('skills')
                .select('*', { count: 'exact', head: true })
                .eq('is_featured', true)

            if (skillsError) throw skillsError

            // Fetch blog posts count
            const { count: blogCount, error: blogError } = await supabase
                .from('portfolio_content')
                .select('*', { count: 'exact', head: true })
                .eq('category', 'blog')

            if (blogError) throw blogError

            // Calculate experience years from earliest experience
            const { data: experiences, error: expError } = await supabase
                .from('experience')
                .select('start_date')
                .order('start_date', { ascending: true })
                .limit(1)

            if (expError) throw expError

            let yearsOfExperience = 0
            if (experiences && experiences.length > 0) {
                const earliestDate = new Date(experiences[0].start_date)
                const currentDate = new Date()
                yearsOfExperience = Math.floor((currentDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 365))
            }

            setStats({
                totalProjects: projectsCount || 0,
                featuredSkills: skillsCount || 0,
                experienceYears: yearsOfExperience,
                blogPosts: blogCount || 0
            })
        } catch (err: any) {
            console.error('Error fetching dashboard stats:', err)
            setError(err.message || 'Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96 gap-4">
                <div className="text-red-600 text-center">
                    <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
                    <p className="text-sm">{error}</p>
                </div>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-sm mt-1.5 text-slate-600">
                        Plan, prioritize, and accomplish your tasks with ease.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700 transition-all hover:shadow-md shadow-sm active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        Add Project
                    </button>
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors bg-white active:scale-[0.98]"
                    >
                        <Upload size={18} />
                        Import Data
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Projects"
                    value={stats.totalProjects}
                    subtitle="Portfolio projects"
                    variant="solid"
                    link="/admin/projects"
                />
                <StatCard
                    title="Featured Skills"
                    value={stats.featuredSkills}
                    subtitle="Active skills"
                    variant="outlined"
                    link="/admin/skills"
                />
                <StatCard
                    title="Experience"
                    value={stats.experienceYears}
                    subtitle={stats.experienceYears === 1 ? "Year of experience" : "Years of experience"}
                    variant="outlined"
                    link="/admin/resume"
                />
                <StatCard
                    title="Blog Posts"
                    value={stats.blogPosts}
                    subtitle="Published articles"
                    variant="outlined"
                    link="/admin/blog"
                />
            </div>

            {/* Profile Quick Edit */}
            <div className="grid grid-cols-1">
                <ProfileWidget />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Content Overview (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RecentMessagesWidget />
                        <RecentBlogWidget />
                    </div>
                    <VisitorAnalyticsWidget />
                </div>

                {/* Right Column - Actions & Progress (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                    <QuickActionsWidget />
                    <ProjectProgressChart />
                    <RecentActivityWidget />
                </div>
            </div>

            {/* Bottom Row - Lists */}
            <div className="grid grid-cols-1">
                <ProjectListWidget />
            </div>
        </div>
    )
}

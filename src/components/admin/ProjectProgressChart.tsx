'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export default function ProjectProgressChart() {
    const [completion, setCompletion] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        calculateCompletion()
    }, [])

    const calculateCompletion = async () => {
        setLoading(true)
        let score = 0

        try {
            // 1. Personal Info (10%)
            const { data: personalInfo } = await supabase.from('personal_info').select('id').limit(1)
            if (personalInfo && personalInfo.length > 0) score += 10

            // 2. Education (15%)
            const { count: eduCount } = await supabase.from('education').select('*', { count: 'exact', head: true })
            if (eduCount && eduCount > 0) score += 15

            // 3. Experience (20%)
            const { count: expCount } = await supabase.from('experience').select('*', { count: 'exact', head: true })
            if (expCount && expCount > 0) score += 20

            // 4. Featured Skills (15%)
            const { count: skillsCount } = await supabase.from('skills').select('*', { count: 'exact', head: true }).eq('is_featured', true)
            if (skillsCount && skillsCount >= 3) score += 15
            else if (skillsCount && skillsCount > 0) score += 5

            // 5. Featured Projects (25%)
            const { count: projCount } = await supabase.from('portfolio_content').select('*', { count: 'exact', head: true }).eq('category', 'project')
            if (projCount && projCount >= 2) score += 25
            else if (projCount && projCount > 0) score += 10

            // 6. Blog Posts (15%)
            const { count: blogCount } = await supabase.from('portfolio_content').select('*', { count: 'exact', head: true }).eq('category', 'blog')
            if (blogCount && blogCount > 0) score += 15

            setCompletion(score)
        } catch (err) {
            console.error('Error calculating profile completion:', err)
        } finally {
            setLoading(false)
        }
    }

    // Calculate rotation for semi-circle gauge (0% = -135deg, 100% = 45deg)
    // Range is 180 degrees total
    const rotation = -135 + (completion / 100) * 180

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center h-full shadow-sm hover:shadow-md transition-all">
            <h3 className="text-base font-semibold text-slate-900 w-full mb-4">Profile Completion</h3>

            <div className="relative w-48 h-24 overflow-hidden mb-4">
                {/* Semi-circle gauge background */}
                <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-slate-100"></div>

                {/* Semi-circle gauge fill - using SVG for better control */}
                <svg width="192" height="96" viewBox="0 0 192 96" className="absolute top-0 left-0">
                    <path
                        d="M 12 96 A 84 84 0 0 1 180 96"
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="12"
                    />
                    <path
                        d="M 12 96 A 84 84 0 0 1 180 96"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="12"
                        strokeDasharray="264" // Approx length of arc
                        strokeDashoffset={264 - (264 * completion / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute bottom-0 left-0 w-full text-center">
                    <div className="text-4xl font-bold text-slate-900 transition-all duration-1000">
                        {loading ? '...' : `${completion}%`}
                    </div>
                    <div className="text-xs text-slate-500">Profile Strength</div>
                </div>
            </div>

            <div className="flex gap-4 text-xs mt-2">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-600"></span>
                    <span className="text-slate-600">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-100"></span>
                    <span className="text-slate-600">Pending</span>
                </div>
            </div>
        </div>
    )
}

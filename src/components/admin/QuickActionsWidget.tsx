'use client'

import { FileText, Plus, Briefcase, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QuickActionsWidget() {
    const router = useRouter()

    const actions = [
        {
            title: 'New Project',
            subtitle: 'Add to portfolio',
            icon: Plus,
            color: '#8B5CF6',
            action: () => router.push('/admin/projects/new')
        },
        {
            title: 'Write Blog',
            subtitle: 'Share insights',
            icon: FileText,
            color: '#3B82F6',
            action: () => router.push('/admin/blog/new')
        },
        {
            title: 'Update CV',
            subtitle: 'Edit experience',
            icon: Briefcase,
            color: '#10B981',
            action: () => router.push('/admin/resume')
        }
    ]

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>

            <div className="space-y-2 mb-5">
                {actions.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={index}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all hover:bg-slate-50 text-left group active:scale-[0.98]"
                        >
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
                                style={{ backgroundColor: item.color }}
                            >
                                <Icon size={16} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-slate-500">
                                    {item.subtitle}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>

            <button
                onClick={() => router.push('/admin/skills')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
                <Award size={16} strokeWidth={2.5} />
                Manage Skills
            </button>
        </div>
    )
}

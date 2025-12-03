'use client'

import { useRouter } from 'next/navigation'
import { FileText, Code, Briefcase, PenTool, Plus } from 'lucide-react'

interface QuickAction {
    label: string
    icon: typeof Plus
    path: string
    color: 'primary' | 'secondary' | 'success' | 'tertiary'
}

const actions: QuickAction[] = [
    {
        label: 'New Project',
        icon: Briefcase,
        path: '/admin/projects/new',
        color: 'primary'
    },
    {
        label: 'New Blog Post',
        icon: PenTool,
        path: '/admin/blog/new',
        color: 'secondary'
    },
    {
        label: 'Add Experience',
        icon: FileText,
        path: '/admin/resume/experience/new',
        color: 'success'
    },
    {
        label: 'Add Skill',
        icon: Code,
        path: '/admin/skills/new',
        color: 'tertiary'
    }
]

export default function QuickActions() {
    const router = useRouter()

    const getColorStyles = (color: QuickAction['color']) => {
        switch (color) {
            case 'secondary':
                return 'var(--accent-secondary)'
            case 'success':
                return 'var(--accent-success)'
            case 'tertiary':
                return 'var(--accent-tertiary)'
            default:
                return 'var(--accent-primary)'
        }
    }

    return (
        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => {
                    const Icon = action.icon
                    const bgColor = getColorStyles(action.color)

                    return (
                        <button
                            key={action.path}
                            onClick={() => router.push(action.path)}
                            className="flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:-translate-y-1 group"
                            style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-primary)'
                            }}
                        >
                            <div
                                className="p-3 rounded-lg transition-transform group-hover:scale-110"
                                style={{ backgroundColor: bgColor }}
                            >
                                <Icon className="w-5 h-5" style={{ color: '#ffffff' }} />
                            </div>
                            <span className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>
                                {action.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

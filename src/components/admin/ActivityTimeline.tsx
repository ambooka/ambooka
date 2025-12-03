'use client'

import { formatDistanceToNow } from 'date-fns'
import { FileText, Code, Briefcase, PenTool, User, Trash2 } from 'lucide-react'

interface Activity {
    id: string
    type: 'project' | 'blog' | 'experience' | 'education' | 'skill' | 'profile'
    action: 'created' | 'updated' | 'deleted'
    title: string
    timestamp: Date
}

interface ActivityTimelineProps {
    activities: Activity[]
}

const getIcon = (type: Activity['type']) => {
    switch (type) {
        case 'project':
            return Briefcase
        case 'blog':
            return PenTool
        case 'experience':
        case 'education':
            return FileText
        case 'skill':
            return Code
        case 'profile':
            return User
        default:
            return FileText
    }
}

const getActionColor = (action: Activity['action']) => {
    switch (action) {
        case 'created':
            return 'var(--accent-success)'
        case 'updated':
            return 'var(--accent-secondary)'
        case 'deleted':
            return 'var(--accent-error)'
        default:
            return 'var(--text-secondary)'
    }
}

const getActionText = (action: Activity['action']) => {
    switch (action) {
        case 'created':
            return 'Created'
        case 'updated':
            return 'Updated'
        case 'deleted':
            return 'Deleted'
        default:
            return action
    }
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    return (
        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
            </h3>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                        No recent activity
                    </p>
                ) : (
                    activities.slice(0, 8).map((activity, index) => {
                        const Icon = getIcon(activity.type)
                        const actionColor = getActionColor(activity.action)

                        return (
                            <div
                                key={activity.id + index}
                                className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-opacity-50"
                                style={{ backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--utility-btn-hover-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div
                                    className="p-2 rounded-lg flex-shrink-0"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: actionColor }} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                        {activity.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium" style={{ color: actionColor }}>
                                            {getActionText(activity.action)}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                            •
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

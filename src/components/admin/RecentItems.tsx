'use client'

import Link from 'next/link'
import { Edit, Eye, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RecentItem {
    id: string
    title: string
    category?: string
    created_at: string
    is_featured?: boolean
}

interface RecentItemsProps {
    type: 'projects' | 'blog'
    items: RecentItem[]
}

export default function RecentItems({ type, items }: RecentItemsProps) {
    const title = type === 'projects' ? 'Recent Projects' : 'Recent Blog Posts'
    const basePath = type === 'projects' ? '/admin/projects' : '/admin/blog'

    return (
        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {title}
                </h3>
                <Link
                    href={basePath}
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--accent-primary)' }}
                >
                    View All
                </Link>
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                        No {type} yet
                    </p>
                ) : (
                    items.slice(0, 4).map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                        {item.title}
                                    </h4>
                                    {item.is_featured && (
                                        <span className="text-xs" style={{ color: 'var(--accent-secondary)' }}>★</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {item.category && (
                                        <>
                                            <span className="text-xs capitalize px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--utility-btn-hover-bg)', color: 'var(--text-secondary)' }}>
                                                {item.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>•</span>
                                        </>
                                    )}
                                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                                        <Calendar className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <Link
                                    href={`${basePath}/${item.id}`}
                                    className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
                                    style={{ backgroundColor: 'var(--utility-btn-hover-bg)' }}
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

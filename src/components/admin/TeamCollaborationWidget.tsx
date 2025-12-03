'use client'

import { Plus } from 'lucide-react'

export default function TeamCollaborationWidget() {
    const members = [
        {
            name: 'Alexandra Deff',
            role: 'Working on GitHub Project Repository',
            status: 'Completed',
            statusColor: 'bg-green-100 text-green-700',
            avatar: 'AD'
        },
        {
            name: 'Edwin Adenike',
            role: 'Working on Integrate User Authentication',
            status: 'In Progress',
            statusColor: 'bg-yellow-100 text-yellow-700',
            avatar: 'EA'
        },
        {
            name: 'Isaac Oluwatemilorun',
            role: 'Working on Develop Search Functionality',
            status: 'Pending',
            statusColor: 'bg-red-100 text-red-700',
            avatar: 'IO'
        }
    ]

    return (
        <div className="p-6 rounded-3xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
        }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Team Collaboration</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:bg-[var(--bg-tertiary)]"
                    style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                >
                    <Plus size={14} />
                    Add Member
                </button>
            </div>

            <div className="space-y-5">
                {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[var(--accent-primary)]">
                            {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                {member.name}
                            </h4>
                            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                                {member.role}
                            </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-medium ${member.statusColor}`}>
                            {member.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

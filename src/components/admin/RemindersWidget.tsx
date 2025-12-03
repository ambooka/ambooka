'use client'

import { Video } from 'lucide-react'

export default function RemindersWidget() {
    return (
        <div className="p-6 rounded-3xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
        }}>
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Reminders</h3>

            <div className="space-y-1 mb-6">
                <h4 className="font-semibold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
                    Meeting with Client
                </h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Discuss project requirements
                </p>
                <p className="text-xs mt-2 font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Time: 02:00 pm - 04:00 pm
                </p>
            </div>

            <button
                className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--accent-primary)' }}
            >
                <Video size={18} />
                Start Meeting
            </button>
        </div>
    )
}

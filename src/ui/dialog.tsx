import React from 'react'

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => onOpenChange?.(false)}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-3xl mx-4">{children}</div>
        </div>
    )
}

export function DialogContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>{children}</div>
}

export function DialogHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`px-5 py-3 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>
}

export function DialogTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}
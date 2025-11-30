import React from 'react'

export const Badge = ({ children, className = '', variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'secondary' }) => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium'
    const variants: Record<string, string> = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
        secondary: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
    }
    return <span className={`${base} ${variants[variant] || variants.default} ${className}`.trim()}>{children}</span>
}

export default Badge
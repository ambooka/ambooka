'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error = false, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={clsx(
                    'w-full px-4 py-3 bg-[var(--bg-secondary)] border rounded-[var(--radius-md)]',
                    'text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                        : 'border-[var(--border-color)]',
                    className
                )}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

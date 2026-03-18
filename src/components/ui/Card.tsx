'use client'

import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export type CardVariant = 'default' | 'glass' | 'elevated' | 'outlined'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant
    children: ReactNode
}

const variantStyles: Record<CardVariant, string> = {
    default: 'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
    glass: 'bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-color)]',
    elevated: 'bg-[var(--bg-secondary)] shadow-card border border-[var(--border-color)]',
    outlined: 'bg-transparent border border-[var(--border-color)]'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    'rounded-[var(--radius-xl)] transition-all duration-300',
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Card.displayName = 'Card'

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx('p-6 pb-0', className)}
                {...props}
            >
                {children}
            </div>
        )
    }
)
CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={clsx(
                    'text-lg font-semibold text-[var(--text-primary)] leading-tight',
                    className
                )}
                {...props}
            >
                {children}
            </h3>
        )
    }
)
CardTitle.displayName = 'CardTitle'

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx('p-6', className)}
                {...props}
            >
                {children}
            </div>
        )
    }
)
CardContent.displayName = 'CardContent'

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    'p-6 pt-0 flex items-center gap-4',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
CardFooter.displayName = 'CardFooter'

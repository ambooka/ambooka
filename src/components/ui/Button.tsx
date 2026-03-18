'use client'

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 shadow-sm',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]',
    outline: 'bg-transparent border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10',
    ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
    danger: 'bg-red-500 text-white hover:bg-red-600'
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
}

interface ButtonBaseProps {
    variant?: ButtonVariant
    size?: ButtonSize
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

interface ButtonProps extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            children,
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={clsx(
                    'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        )
    }
)
Button.displayName = 'Button'

interface ButtonLinkProps extends ButtonBaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
    href: string
    external?: boolean
    children: ReactNode
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            children,
            href,
            external = false,
            leftIcon,
            rightIcon,
            ...props
        },
        ref
    ) => {
        const classes = clsx(
            'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
            variantStyles[variant],
            sizeStyles[size],
            className
        )

        if (external) {
            return (
                <a
                    ref={ref}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes}
                    {...props}
                >
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </a>
            )
        }

        return (
            <Link ref={ref} href={href} className={classes} {...props}>
                {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </Link>
        )
    }
)
ButtonLink.displayName = 'ButtonLink'

'use client'

import React from 'react'

/**
 * Unified Button Component
 * Replaces scattered button styles: .btn, .btn-primary, .btn-secondary, .contact-cta
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style variant */
    variant?: ButtonVariant
    /** Button size */
    size?: ButtonSize
    /** Show loading spinner */
    isLoading?: boolean
    /** Icon to show before text */
    leftIcon?: React.ReactNode
    /** Icon to show after text */
    rightIcon?: React.ReactNode
    /** Full width button */
    fullWidth?: boolean
    /** Children content */
    children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: 'var(--gradient-primary)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
    },
    secondary: {
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--text-primary)',
        border: 'none',
        boxShadow: 'none',
    },
    danger: {
        background: 'var(--accent-error)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
    },
    outline: {
        background: 'transparent',
        color: 'var(--accent-primary)',
        border: '2px solid var(--accent-primary)',
        boxShadow: 'none',
    },
}

const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(20, 184, 166, 0.35)',
    },
    secondary: {
        borderColor: 'var(--accent-primary)',
        boxShadow: 'var(--shadow-md)',
    },
    ghost: {
        background: 'var(--border-light)',
    },
    danger: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.35)',
    },
    outline: {
        background: 'var(--accent-primary)',
        color: 'white',
    },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: {
        padding: '8px 16px',
        fontSize: 'var(--fs-7)',
        gap: '6px',
    },
    md: {
        padding: '12px 24px',
        fontSize: 'var(--fs-6)',
        gap: '8px',
    },
    lg: {
        padding: '16px 32px',
        fontSize: 'var(--fs-5)',
        gap: '10px',
    },
}

// Loading spinner component
function Spinner({ size }: { size: ButtonSize }) {
    const spinnerSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20
    return (
        <svg
            width={spinnerSize}
            height={spinnerSize}
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'spin 1s linear infinite' }}
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                opacity={0.25}
            />
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                strokeDashoffset="75"
            />
        </svg>
    )
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className = '',
    style,
    disabled,
    ...props
}: ButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false)

    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        fontWeight: 500,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : 'auto',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(isHovered && !disabled && !isLoading ? hoverStyles[variant] : {}),
        ...style,
    }

    return (
        <button
            className={`btn btn--${variant} btn--${size} ${className}`.trim()}
            style={baseStyle}
            disabled={disabled || isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {isLoading ? (
                <Spinner size={size} />
            ) : leftIcon ? (
                <span className="btn-icon btn-icon--left">{leftIcon}</span>
            ) : null}

            <span>{children}</span>

            {!isLoading && rightIcon && (
                <span className="btn-icon btn-icon--right">{rightIcon}</span>
            )}
        </button>
    )
}

// Link variant that looks like a button
interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    fullWidth?: boolean
    children: React.ReactNode
}

export function ButtonLink({
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className = '',
    style,
    ...props
}: ButtonLinkProps) {
    const [isHovered, setIsHovered] = React.useState(false)

    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : 'auto',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(isHovered ? hoverStyles[variant] : {}),
        ...style,
    }

    return (
        <a
            className={`btn btn--${variant} btn--${size} ${className}`.trim()}
            style={baseStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {leftIcon && <span className="btn-icon btn-icon--left">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="btn-icon btn-icon--right">{rightIcon}</span>}
        </a>
    )
}

export default Button

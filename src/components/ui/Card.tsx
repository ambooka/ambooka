'use client'

import React from 'react'

/**
 * Unified Card Component
 * Replaces fragmented card styles: .glass-card, .soft-card, .neu-card, .content-card
 */

export type CardVariant = 'elevated' | 'outlined' | 'glass' | 'flat'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant
  /** Enable hover effects (lift + shadow) */
  hoverable?: boolean
  /** Additional padding override */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Children content */
  children: React.ReactNode
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  elevated: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-card)',
  },
  outlined: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    boxShadow: 'none',
  },
  glass: {
    background: 'var(--surface-overlay)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  flat: {
    background: 'var(--bg-secondary)',
    border: 'none',
    boxShadow: 'none',
  },
}

const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: '0',
  sm: 'var(--space-3)',   // 12px
  md: 'var(--space-4)',   // 16px
  lg: 'var(--space-6)',   // 24px
}

const hoverStyles: React.CSSProperties = {
  transform: 'translateY(-2px)',
  boxShadow: 'var(--shadow-card-hover)',
}

export function Card({
  variant = 'elevated',
  hoverable = false,
  padding = 'md',
  children,
  className = '',
  style,
  ...props
}: CardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const baseStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-xl)',
    padding: paddingStyles[padding],
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    ...variantStyles[variant],
    ...(hoverable && isHovered ? hoverStyles : {}),
    ...style,
  }

  return (
    <div
      className={`card card--${variant} ${className}`.trim()}
      style={baseStyle}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => hoverable && setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  )
}

// Sub-components for composition
export function CardHeader({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`card-header ${className}`.trim()}
      style={{
        marginBottom: 'var(--space-4)',
        paddingBottom: 'var(--space-3)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  as: Component = 'h3',
  className = ''
}: {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
}) {
  return (
    <Component
      className={`card-title ${className}`.trim()}
      style={{
        fontSize: 'var(--fs-4)',
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: 0,
      }}
    >
      {children}
    </Component>
  )
}

export function CardContent({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`card-content ${className}`.trim()}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`card-footer ${className}`.trim()}
      style={{
        marginTop: 'var(--space-4)',
        paddingTop: 'var(--space-3)',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}
    >
      {children}
    </div>
  )
}

export default Card
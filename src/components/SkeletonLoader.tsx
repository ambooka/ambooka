import React from 'react'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
    width?: string | number
    height?: string | number
    animation?: 'pulse' | 'wave' | 'none'
    style?: React.CSSProperties
}

/**
 * Skeleton Loader Component
 * Provides a placeholder preview while content is loading
 */
export function Skeleton({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    style = {}
}: SkeletonProps) {
    const baseStyles: React.CSSProperties = {
        backgroundColor: 'var(--border-color)',
        borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? '4px' : '8px',
        display: 'inline-block',
        lineHeight: 1,
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
        position: 'relative',
        overflow: 'hidden',
    }

    const animationStyles: React.CSSProperties = animation === 'pulse'
        ? {
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        }
        : animation === 'wave'
            ? {
                animation: 'skeleton-wave 1.5s linear infinite',
            }
            : {}

    return (
        <>
            <span
                className={className}
                style={{ ...baseStyles, ...animationStyles, ...style }}
                aria-live="polite"
                aria-busy="true"
            >
                {animation === 'wave' && (
                    <span
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                            animation: 'skeleton-wave-shimmer 1.5s linear infinite',
                        }}
                    />
                )}
            </span>

            <style jsx>{`
@keyframes skeleton-pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
    100% {
        opacity: 1;
    }
}

@keyframes skeleton-wave-shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}
`}</style>
        </>
    )
}

/**
 * Project Card Skeleton
 * Specific skeleton for portfolio project cards
 */
export function ProjectCardSkeleton() {
    return (
        <div className="project-item" style={{ padding: '20px' }}>
            <Skeleton variant="rectangular" height="200px" style={{ marginBottom: '16px' }} />
            <Skeleton variant="text" width="60%" height="24px" style={{ marginBottom: '12px' }} />
            <Skeleton variant="text" width="100%" height="16px" style={{ marginBottom: '8px' }} />
            <Skeleton variant="text" width="90%" height="16px" style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton variant="rectangular" width="60px" height="24px" />
                <Skeleton variant="rectangular" width="80px" height="24px" />
                <Skeleton variant="rectangular" width="70px" height="24px" />
            </div>
        </div>
    )
}

/**
 * Timeline Item Skeleton
 * Specific skeleton for resume timeline items
 */
export function TimelineItemSkeleton() {
    return (
        <li className="timeline-item" style={{ padding: '15px 0' }}>
            <Skeleton variant="text" width="70%" height="20px" style={{ marginBottom: '8px' }} />
            <Skeleton variant="text" width="30%" height="14px" style={{ marginBottom: '12px' }} />
            <Skeleton variant="text" width="100%" height="14px" style={{ marginBottom: '6px' }} />
            <Skeleton variant="text" width="95%" height="14px" />
        </li>
    )
}

export default Skeleton

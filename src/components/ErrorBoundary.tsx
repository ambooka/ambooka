'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error Boundary caught an error:', error, errorInfo)
        }

        // In production, you could log to an error reporting service
        // Example: logErrorToService(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '80px auto',
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '20px',
                    }}>
                        ⚠️
                    </div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: 'var(--text-primary)',
                    }}>
                        Something went wrong
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '24px',
                        lineHeight: '1.6',
                    }}>
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{
                            marginTop: '20px',
                            padding: '16px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            textAlign: 'left',
                        }}>
                            <summary style={{
                                cursor: 'pointer',
                                fontWeight: '500',
                                marginBottom: '12px',
                                color: 'var(--text-primary)',
                            }}>
                                Error Details (Development Only)
                            </summary>
                            <pre style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            }}>
                                {this.state.error.toString()}
                                {'\n\n'}
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '24px',
                            padding: '12px 24px',
                            background: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.3)'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

/**
 * Real-time Performance Monitor
 * Shows FPS, memory, and page metrics
 */

'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
    fps: number
    memory: number
    loadTime: number
    renderTime: number
}

declare global {
    interface Performance {
        memory?: {
            usedJSHeapSize: number
            totalJSHeapSize: number
            jsHeapSizeLimit: number
        }
    }
}

export default function PerformanceMonitor() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        memory: 0,
        loadTime: 0,
        renderTime: 0
    })
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        let frameCount = 0
        let lastTime = performance.now()
        let fpsUpdateTime = lastTime

        const measurePerformance = () => {
            const currentTime = performance.now()
            frameCount++

            // Update FPS every 500ms
            if (currentTime >= fpsUpdateTime + 500) {
                const fps = Math.round((frameCount * 1000) / (currentTime - fpsUpdateTime))
                const renderTime = currentTime - lastTime

                // Get memory if available (Chrome only)
                const memory = performance.memory
                    ? Math.round(performance.memory.usedJSHeapSize / 1048576)
                    : 0

                // Get page load time
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
                const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0

                setMetrics({
                    fps,
                    memory,
                    loadTime,
                    renderTime: Math.round(renderTime * 100) / 100
                })

                frameCount = 0
                fpsUpdateTime = currentTime
            }

            lastTime = currentTime
            requestAnimationFrame(measurePerformance)
        }

        const animationId = requestAnimationFrame(measurePerformance)

        return () => cancelAnimationFrame(animationId)
    }, [])

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    padding: '8px 12px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--color-gold)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    zIndex: 9999,
                    backdropFilter: 'blur(10px)'
                }}
            >
                📊 Show Stats
            </button>
        )
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            color: 'var(--color-gold)',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            backdropFilter: 'blur(20px)',
            minWidth: '200px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
            }}>
                <span style={{ fontWeight: 'bold', color: '#FFD700' }}>⚡ Performance</span>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-gold)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0',
                        opacity: 0.6
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>FPS:</span>
                    <span style={{
                        color: metrics.fps >= 55 ? '#43e97b' : metrics.fps >= 30 ? '#feca57' : '#ff6b6b',
                        fontWeight: 'bold'
                    }}>
                        {metrics.fps}
                    </span>
                </div>

                {metrics.memory > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Memory:</span>
                        <span style={{ color: '#4facfe' }}>{metrics.memory} MB</span>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Load:</span>
                    <span style={{ color: '#D4AF37' }}>{metrics.loadTime}ms</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Frame:</span>
                    <span style={{ color: '#B76E79' }}>{metrics.renderTime}ms</span>
                </div>
            </div>

            <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                fontSize: '10px',
                opacity: 0.6,
                textAlign: 'center'
            }}>
                Real-time metrics
            </div>
        </div>
    )
}

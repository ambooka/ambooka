'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

/**
 * Scroll to Top Button
 * Appears when user scrolls down and allows quick navigation back to top
 */
export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    if (!isVisible) {
        return null
    }

    return (
        <button
            onClick={scrollToTop}
            className="scroll-to-top"
            aria-label="Scroll to top"
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1000,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(66, 153, 225, 0.3)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
        >
            <ChevronUp size={24} />
        </button>
    )
}

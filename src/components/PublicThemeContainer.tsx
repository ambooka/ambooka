'use client'

import { useState, useEffect } from 'react'
import UtilityBar from '@/components/UtilityBar'
import TopHeader from '@/components/TopHeader'
import MobileBottomNav from '@/components/MobileBottomNav'
import CodeRevealOverlay from '@/components/CodeRevealOverlay'
import Sidebar from '@/components/Sidebar'

type Theme = 'premium-dark' | 'premium-light'

export default function PublicThemeContainer({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('premium-light')
    const [isLoaded, setIsLoaded] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [resumeTrigger, setResumeTrigger] = useState(0)

    const handleOpenResume = () => {
        setResumeTrigger(prev => prev + 1)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme === 'premium-dark' || savedTheme === 'premium-light') {
            setTheme(savedTheme)
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        document.body.setAttribute('data-theme', theme)
        if (isLoaded) {
            localStorage.setItem('theme', theme)
        }
    }, [theme, isLoaded])

    return (
        <div className="app-container" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.2s' }}>
            <UtilityBar
                currentTheme={theme}
                onThemeChange={setTheme}
                resumeTrigger={resumeTrigger}
            />

            <TopHeader
                onProfileClick={() => setIsProfileOpen(true)}
            />

            <main id="main-content" className="main-content-full pb-24 md:pb-10">
                {children}
            </main>

            <MobileBottomNav />

            {/* Mobile Profile Modal Overlay */}
            <div className="md:hidden">
                <Sidebar
                    isModal={true}
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    onOpenResume={handleOpenResume}
                />
            </div>

            <CodeRevealOverlay />

            {/* Inline styles moved to globals.css - .app-container */}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
<<<<<<< HEAD
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
import UtilityBar from '@/components/UtilityBar'
import TopHeader from '@/components/TopHeader'
import MobileBottomNav from '@/components/MobileBottomNav'
import CodeRevealOverlay from '@/components/CodeRevealOverlay'
import Sidebar from '@/components/Sidebar'
<<<<<<< HEAD
import Footer from '@/components/Footer'
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

type Theme = 'premium-dark' | 'premium-light'

export default function PublicThemeContainer({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
    const pathname = usePathname()
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
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

<<<<<<< HEAD
    useEffect(() => {
        if (!isProfileOpen) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = previousOverflow }
    }, [isProfileOpen])

    return (
        <div className={cn(
            "w-full min-h-screen relative overflow-x-hidden",
            isLoaded ? "opacity-100" : "opacity-0",
            "transition-opacity duration-200"
        )}>
            <UtilityBar
                resumeTrigger={resumeTrigger}
            />

            <TopHeader onProfileClick={() => setIsProfileOpen(true)} />

            <main id="main-content" className="w-full pb-28 md:pb-12 pt-4 mb-8 px-3 sm:px-4 md:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-[1440px]">
                    <AnimatePresence mode="wait" initial={false}>
                        <div key={pathname}>
                            {children}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            <Footer />

            <MobileBottomNav className="public-mobile-nav" />
=======
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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

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
<<<<<<< HEAD
=======

            {/* Inline styles moved to globals.css - .app-container */}
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        </div>
    )
}

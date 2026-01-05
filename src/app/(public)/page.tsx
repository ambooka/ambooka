// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Resume from '@/components/Resume'
import Blog from '@/components/Blog'
import UtilityBar from '@/components/UtilityBar'
import ScrollToTop from '@/components/ScrollToTop'
import CodeRevealOverlay from '@/components/CodeRevealOverlay'
import About from '@/components/About'
import Portfolio from '@/components/Portfolio'
import Contact from '@/components/Contact'
import TopHeader from '@/components/TopHeader'
import MobileBottomNav from '@/components/MobileBottomNav'
import Sidebar from '@/components/Sidebar'

const PAGES = {
    about: About,
    resume: Resume,
    portfolio: Portfolio,
    blog: Blog,
    contact: Contact
} as const

type Theme = 'premium-dark' | 'premium-light'

const githubConfig = {
    username: 'ambooka',
    // Use string literal for token to make it more visible in console
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
    featuredThreshold: 5,
    maxRepos: 100,
    sortBy: 'updated' as const
}

// GitHub configuration validated
if (process.env.NODE_ENV === 'development' && !githubConfig.token) {
    console.warn('⚠️ GitHub token not found. Some features may be limited.')
}

export default function Home() {
    const [activePage, setActivePage] = useState<keyof typeof PAGES>('about')
    const [theme, setTheme] = useState<Theme>('premium-light')
    const [isLoaded, setIsLoaded] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [resumeTrigger, setResumeTrigger] = useState(0)

    const handleOpenResume = () => {
        setResumeTrigger(prev => prev + 1)
    }

    // Get the current component based on active page
    const CurrentComponent = PAGES[activePage]

    // Load saved state on mount
    useEffect(() => {
        const savedPage = localStorage.getItem('activePage')
        if (savedPage && savedPage in PAGES) {
            setActivePage(savedPage as keyof typeof PAGES)
        }

        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme === 'premium-dark' || savedTheme === 'premium-light') {
            setTheme(savedTheme)
        }

        setIsLoaded(true)
    }, [])

    // Save active page to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('activePage', activePage)
        }
    }, [activePage, isLoaded])

    useEffect(() => {
        document.body.setAttribute('data-theme', theme)
        if (isLoaded) {
            localStorage.setItem('theme', theme)
        }
    }, [theme, isLoaded])

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: 'Abdulrahman Ambooka',
                        jobTitle: 'AI & Software Engineer',
                        url: 'https://ambooka.dev',
                        sameAs: [
                            'https://github.com/ambooka',
                            'https://www.linkedin.com/in/abdulrahman-ambooka/',
                            'https://twitter.com/ambooka'
                        ],
                        description: 'Full-stack software engineer specializing in AI/MLOps, cloud-native development, and scalable applications',
                        knowsAbout: [
                            'Artificial Intelligence',
                            'Machine Learning Operations',
                            'Cloud Computing',
                            'Software Engineering',
                            'Python',
                            '.NET Core',
                            'TypeScript',
                            'Flutter',
                            'Azure'
                        ]
                    })
                }}
            />
            <UtilityBar
                currentTheme={theme}
                onThemeChange={setTheme}
                resumeTrigger={resumeTrigger}
            />

            {/* Unified App Container - Crextio Style */}
            <div className="app-container">
                <TopHeader
                    activePage={activePage}
                    setActivePage={setActivePage}
                    onProfileClick={() => setIsProfileOpen(true)}
                />
                <main className="main-content-full pb-24 md:pb-10" style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out',
                    visibility: isLoaded ? 'visible' : 'hidden'
                }}>
                    {activePage === 'portfolio' ? (
                        <Portfolio isActive={true} github={githubConfig} />
                    ) : activePage === 'about' ? (
                        <About isActive={true} onOpenResume={handleOpenResume} />
                    ) : (
                        <CurrentComponent isActive={true} />
                    )}
                </main>

                <MobileBottomNav activePage={activePage} setActivePage={setActivePage} />

                {/* Mobile Profile Modal Overlay */}
                <div className={`md:hidden`}>
                    <Sidebar
                        isModal={true}
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                        onOpenResume={handleOpenResume}
                    />
                </div>
            </div>

            <CodeRevealOverlay />

            <style jsx>{`
                .app-container {
                    width: 100%;
                    min-height: 100vh;
                    background: #FFFFFF;
                    overflow-x: hidden;
                    position: relative;
                }
                
                :global([data-theme="premium-dark"]) .app-container {
                    background: #1A2F36;
                }
            `}</style>
        </>
    )
}

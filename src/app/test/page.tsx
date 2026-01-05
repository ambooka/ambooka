'use client'

import { useState, useEffect } from 'react'
import Resume from '@/components/Resume'
import Blog from '@/components/Blog'
import UtilityBar from '@/components/UtilityBar'
import ScrollToTop from '@/components/ScrollToTop'
import CodeRevealOverlay from '@/components/CodeRevealOverlay'
import AboutTest from '@/components/AboutTest'
import Portfolio from '@/components/Portfolio'
import Contact from '@/components/Contact'
import TopHeader from '@/components/TopHeader'

const PAGES = {
    test: AboutTest,
    about: AboutTest,
    resume: Resume,
    portfolio: Portfolio,
    blog: Blog,
    contact: Contact
} as const

type Theme = 'premium-dark' | 'premium-light'

const githubConfig = {
    username: 'ambooka',
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
    featuredThreshold: 5,
    maxRepos: 100,
    sortBy: 'updated' as const
}

export default function TestPage() {
    const [activePage, setActivePage] = useState<keyof typeof PAGES>('test')
    const [theme, setTheme] = useState<Theme>('premium-light')
    const [isLoaded, setIsLoaded] = useState(false)

    const CurrentComponent = PAGES[activePage]

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme === 'premium-dark' || savedTheme === 'premium-light') {
            setTheme(savedTheme)
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        document.body.setAttribute('data-theme', theme)
    }, [theme])

    return (
        <>
            <UtilityBar currentTheme={theme} onThemeChange={setTheme} />

            <div className="app-container">
                <TopHeader activePage={activePage === 'test' ? 'about' : activePage} setActivePage={(page) => setActivePage(page as any)} />
                <main className="main-content-full" style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out',
                    visibility: isLoaded ? 'visible' : 'hidden'
                }}>
                    {activePage === 'portfolio' ? (
                        <Portfolio isActive={true} github={githubConfig} />
                    ) : (
                        <CurrentComponent isActive={true} />
                    )}
                </main>
            </div>

            <CodeRevealOverlay />

            <style jsx>{`
                .app-container {
                    max-width: 1600px;
                    margin: 24px auto;
                    background: #FFFFFF;
                    border-radius: 24px;
                    border: 1px solid rgba(30, 58, 66, 0.06);
                    box-shadow: 0 4px 24px rgba(30, 58, 66, 0.08), 0 12px 48px rgba(30, 58, 66, 0.06);
                    overflow: hidden;
                    min-height: calc(100vh - 80px);
                }
                
                :global([data-theme="premium-dark"]) .app-container {
                    background: #1A2F36;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2), 0 12px 48px rgba(0, 0, 0, 0.15);
                }
            `}</style>
        </>
    )
}

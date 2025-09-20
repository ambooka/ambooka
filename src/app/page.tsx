// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import About from '../components/About'
import Portfolio from '../components/Portfolio'
import Contact from '../components/Contact'
import Resume from '@/components/Resume'
import Blog from '@/components/Blog'
import Navbar from '@/components/Navbar'
import UtilityBar from '@/components/UtilityBar'

const PAGES = {
  about: About,
  resume: Resume,
  portfolio: Portfolio,
  blog: Blog,
  contact: Contact
} as const

type Theme = 'dark' | 'light' | 'palestine'

export default function Home() {
  const [activePage, setActivePage] = useState<keyof typeof PAGES>('about')
  const [theme, setTheme] = useState<Theme>('dark')
  const PageComponent = PAGES[activePage]

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    // Also save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <UtilityBar currentTheme={theme} onThemeChange={setTheme} />
      <main>
        <Sidebar />
        <div className="main-content">
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          <PageComponent isActive={true} />
        </div>
      </main>
    </>
  )
}
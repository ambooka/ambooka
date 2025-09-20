// hooks/useNavigation.ts
'use client'

import { useState, useCallback } from 'react'

export type Page = 'about' | 'resume' | 'portfolio' | 'blog' | 'contact'

export function useNavigation(initialPage: Page = 'about') {
  const [activePage, setActivePage] = useState<Page>(initialPage)

  const navigate = useCallback((page: Page) => {
    setActivePage(page)
    // Scroll to top when navigating
    window.scrollTo(0, 0)
  }, [])

  return { activePage, navigate }
}
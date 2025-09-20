'use client'

import { useCallback } from 'react'

interface NavbarProps {
  activePage: string
  setActivePage: (page: string) => void
}

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' }
] as const

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const handleClick = useCallback((pageId: string) => {
    setActivePage(pageId)
  }, [setActivePage])

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {NAV_ITEMS.map(item => (
          <li className="navbar-item" key={item.id}>
            <button 
              className={`navbar-link ${activePage === item.id ? 'active' : ''}`} 
              onClick={() => handleClick(item.id)}
              type="button"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
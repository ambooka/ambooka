'use client'

import { useCallback } from 'react'
import { User, FileText, Briefcase, BookOpen, Mail } from 'lucide-react'

type PageId = 'about' | 'resume' | 'portfolio' | 'blog' | 'contact'

interface NavbarProps {
  activePage: PageId
  setActivePage: (page: PageId) => void
}

const NAV_ITEMS = [
  { id: 'about', label: 'About', icon: User },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Mail }
] as const

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const handleClick = useCallback((pageId: PageId) => {
    setActivePage(pageId)
  }, [setActivePage])

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          return (
            <li className="navbar-item" key={item.id}>
              <button
                className={`navbar-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleClick(item.id)}
                type="button"
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="navbar-icon" size={20} />
                <span className="navbar-label">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
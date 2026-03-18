// context/AppContext.tsx
'use client'

import React, { createContext, useContext, useState } from 'react'
import { Page, useNavigation } from '@/hooks/useNavigation'

interface Testimonial {
  id: string
  name: string
  avatar_url: string | null
  text: string
  date: string
  is_featured: boolean
  display_order: number | null
}

interface AppContextType {
  activePage: Page
  navigate: (page: Page) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isModalOpen: boolean
  openModal: (testimonial: Testimonial) => void
  closeModal: () => void
  selectedTestimonial: Testimonial | null
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { activePage, navigate } = useNavigation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  const openModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTestimonial(null)
  }

  return (
    <AppContext.Provider value={{
      activePage,
      navigate,
      isSidebarOpen,
      toggleSidebar,
      isModalOpen,
      openModal,
      closeModal,
      selectedTestimonial
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
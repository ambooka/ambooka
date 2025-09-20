// context/AppContext.tsx
'use client'

import React, { createContext, useContext, useState } from 'react'
import { Page, useNavigation } from '@/hooks/useNavigation'

interface AppContextType {
  activePage: Page
  navigate: (page: Page) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isModalOpen: boolean
  openModal: (testimonial: any) => void
  closeModal: () => void
  selectedTestimonial: any
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { activePage, navigate } = useNavigation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)
  
  const openModal = (testimonial: any) => {
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
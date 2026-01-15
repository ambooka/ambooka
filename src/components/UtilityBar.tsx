'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Sun,
  Moon,
  Sparkles,
  X,
  Send,
  Trash2,
  Bot,
  User,
  Loader2,
  Printer,
  ChevronDown
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { generateATSResumeHTML, generateVariantResumeHTML, filterGitHubProjects, type ResumeData as ATSResumeData, type GitHubProject } from '@/lib/resume-generator'
import { ROLE_PROFILES, getRoleOptions, filterSkillsByRole, getProjectDescription, type RoleVariant } from '@/lib/resume-profiles'
import { GitHubService } from '@/services/github'

// Interfaces for Resume Data
interface ExperienceItem {
  id: string
  company: string
  position: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  responsibilities: string[] | null
  [key: string]: unknown
}

interface EducationItem {
  id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_date: string
  end_date: string | null
  description: string | null
  [key: string]: unknown
}

interface SkillItem {
  id: string
  name: string
  category: string
  proficiency_level?: string
  [key: string]: unknown
}

type Theme = 'premium-dark' | 'premium-light'

interface UtilityBarProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  resumeTrigger?: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isPlaceholder?: boolean
}

interface PersonalInfo {
  full_name: string
  title: string
  email: string
  phone: string | null
  summary: string | null
  location?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  website_url?: string | null
  portfolio_url?: string | null
  [key: string]: unknown
}

interface ProjectItem {
  id: string
  title: string
  description?: string | null
  stack?: string[] | null
  github_url?: string | null
  live_url?: string | null
  is_featured?: boolean
  [key: string]: unknown
}

interface ResumeData {
  personal_info: PersonalInfo
  education: EducationItem[]
  experience: ExperienceItem[]
  skills: SkillItem[]
  projects?: ProjectItem[]
}

export default function UtilityBar({ currentTheme, onThemeChange, resumeTrigger = 0 }: UtilityBarProps) {
  // UI states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [_personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)

  // Role variant selector state
  const [selectedRole, setSelectedRole] = useState<RoleVariant>('software-engineer')
  const roleOptions = getRoleOptions()

  // Chat states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-welcome',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Resume HTML & iframe
  const [resumeHTML, setResumeHTML] = useState<string | null>(null)
  const [resumeBlobUrl, setResumeBlobUrl] = useState<string | null>(null)

  // Refs
  const chatModalRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const resumeIframeRef = useRef<HTMLIFrameElement | null>(null)

  // Keep track of the assistant placeholder message id while streaming
  const assistantPlaceholderIdRef = useRef<string | null>(null)

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    if (resumeTrigger > 0) {
      openResumeModal()
    }
  }, [resumeTrigger])


  useEffect(() => {
    fetchPersonalInfo()
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && (savedTheme === 'premium-dark' || savedTheme === 'premium-light')) {
      onThemeChange(savedTheme as Theme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatModalRef.current && !chatModalRef.current.contains(e.target as Node)) {
        setIsChatOpen(false)
      }
    }
    if (isChatOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isChatOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsChatOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        if (isResumeModalOpen) setIsResumeModalOpen(false)
        else if (isChatOpen) setIsChatOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isChatOpen, isResumeModalOpen])

  // Handle mobile keyboard visibility with Visual Viewport API
  useEffect(() => {
    if (!isChatOpen || typeof window === 'undefined' || !window.visualViewport) return

    const handleViewportResize = () => {
      if (!chatModalRef.current) return

      // Mobile keyboard detection: when keyboard appears, visualViewport height decreases
      const viewport = window.visualViewport
      if (!viewport) return

      // Calculate the visible portion of the viewport
      const viewportHeight = viewport.height
      const windowHeight = window.innerHeight

      // If viewport is significantly smaller, keyboard is likely visible
      const keyboardVisible = windowHeight - viewportHeight > 150

      if (keyboardVisible) {
        // Adjust modal to fit above keyboard
        chatModalRef.current.style.maxHeight = `${viewportHeight * 0.95}px`
        // Scroll to bottom to keep input visible
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }, 100)
      } else {
        // Reset when keyboard is hidden
        chatModalRef.current.style.maxHeight = ''
      }
    }

    window.visualViewport.addEventListener('resize', handleViewportResize)
    window.visualViewport.addEventListener('scroll', handleViewportResize)

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize)
      window.visualViewport?.removeEventListener('scroll', handleViewportResize)
    }
  }, [isChatOpen])

  // -----------------------------
  // Utility helpers
  // -----------------------------
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  const handleMouseEnter = (tooltip: string) => setActiveTooltip(tooltip)
  const handleMouseLeave = () => setActiveTooltip(null)

  // -----------------------------
  // Personal info extraction (from HTML)
  // -----------------------------
  // -----------------------------
  // Personal info extraction (from DB)
  // -----------------------------
  const fetchPersonalInfo = async () => {
    try {
      const { data, error } = await supabase.from('personal_info').select('*').single()
      if (error) throw error
      if (data) {
        setPersonalInfo(data)
      }
    } catch (err) {
      console.warn('Could not fetch personal info:', err)
    }
  }

  // -----------------------------
  // Chat functions (stream-safe)
  // -----------------------------
  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'system-welcome',
        role: 'assistant',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date()
      }
    ])
  }

  const addAssistantPlaceholder = () => {
    const id = `assistant-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    assistantPlaceholderIdRef.current = id
    const placeholder: Message = {
      id,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isPlaceholder: true
    }
    setMessages(prev => [...prev, placeholder])
    return id
  }

  const updateAssistantContent = (id: string, newContent: string) => {
    setMessages(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, content: newContent, isPlaceholder: false } : m))
      return updated
    })
  }

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const assistantId = addAssistantPlaceholder()

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/portfolio-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }]
        })
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        throw new Error(`HTTP ${response.status}: ${errText}`)
      }

      if (response.body && typeof response.body.getReader === 'function') {
        const reader = response.body.getReader()
        const dec = new TextDecoder()
        let done = false
        let accumulated = ''
        while (!done) {
          const { value, done: rDone } = await reader.read()
          if (rDone) {
            done = true
            break
          }
          const chunk = dec.decode(value, { stream: true })
          accumulated += chunk

          const lines = accumulated.split('\n')
          accumulated = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            try {
              const parsed = JSON.parse(trimmed)
              const content =
                parsed?.candidates?.[0]?.content?.parts?.[0]?.text ??
                parsed?.text ??
                parsed?.content ??
                ''
              if (content) {
                setMessages(prev => {
                  const cur = prev.map(m =>
                    m.id === assistantId ? { ...m, content: (m.content || '') + content, isPlaceholder: false } : m
                  )
                  return cur
                })
              }
            } catch (err) {
              setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, content: (m.content || '') + trimmed, isPlaceholder: false } : m)))
            }
          }
        }

        if (accumulated.trim()) {
          try {
            const parsed = JSON.parse(accumulated.trim())
            const content = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? parsed?.text ?? parsed?.content ?? ''
            if (content) {
              setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, content: (m.content || '') + content, isPlaceholder: false } : m)))
            }
          } catch {
            setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, content: (m.content || '') + accumulated, isPlaceholder: false } : m)))
          }
        }
      } else {
        const bodyText = await response.text()
        let parsedText = bodyText
        try {
          const parsedJson = JSON.parse(bodyText)
          parsedText = parsedJson?.output ?? parsedJson?.text ?? parsedJson?.message ?? JSON.stringify(parsedJson)
        } catch {
          // bodyText stays as-is
        }
        updateAssistantContent(assistantId, parsedText)
      }

      setMessages(prev => {
        const updated = prev.map(m => (m.id === assistantId && (!m.content || m.content.trim() === '') ? { ...m, content: 'I apologize — I could not generate a response. Please try again.' } : m))
        return updated
      })
    } catch (err) {
      console.error('Chat error', err)
      setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, content: 'Sorry, I encountered an error. Please check your connection and try again.' } : m)))
    } finally {
      assistantPlaceholderIdRef.current = null
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    streamChat(input.trim())
  }

  // -----------------------------
  // Resume: open modal, fetch HTML & blob fallback, print, download
  // -----------------------------
  // -----------------------------
  // Resume: fetch from DB, generate HTML, print
  // Legacy HTML generator (kept as fallback, using new ATS-optimized version instead)
  const _generateResumeHTML = (data: ResumeData) => {
    const { personal_info, education, experience, skills } = data

    // Group skills
    const skillsByCategory = skills.reduce((acc: Record<string, string[]>, skill: SkillItem) => {
      const cat = skill.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(skill.name)
      return acc
    }, {})

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${personal_info.full_name} - Resume</title>
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.5; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
          h1 { font-size: 28px; margin-bottom: 5px; color: #111; }
          h2 { font-size: 18px; color: #666; margin-top: 0; margin-bottom: 20px; font-weight: 500; }
          h3 { font-size: 16px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; letter-spacing: 1px; }
          h4 { font-size: 16px; margin: 0; font-weight: 700; }
          .contact-info { margin-bottom: 30px; font-size: 14px; color: #555; display: flex; gap: 15px; flex-wrap: wrap; }
          .section { margin-bottom: 20px; }
          .item { margin-bottom: 15px; }
          .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
          .date { font-size: 14px; color: #666; font-style: italic; }
          .subtitle { font-size: 14px; font-weight: 600; color: #444; margin-bottom: 5px; }
          .description { font-size: 14px; color: #444; margin-bottom: 5px; }
          ul { margin: 5px 0; padding-left: 20px; }
          li { font-size: 14px; margin-bottom: 3px; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
          .skill-category { margin-bottom: 10px; }
          .skill-category strong { display: block; font-size: 14px; margin-bottom: 3px; color: #333; text-transform: capitalize; }
          .skill-tags { font-size: 13px; color: #555; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <header>
          <h1>${personal_info.full_name}</h1>
          <h2>${personal_info.title}</h2>
          <div class="contact-info">
            <span>${personal_info.email}</span>
            <span>${personal_info.phone || ''}</span>
            <span>${personal_info.location || 'Nairobi, Kenya'}</span>
          </div>
          <p>${personal_info.summary || ''}</p>
        </header>

        <section>
          <h3>Experience</h3>
          ${experience.map((job) => `
            <div class="item">
              <div class="item-header">
                <h4>${job.position}</h4>
                <span class="date">${new Date(job.start_date).getFullYear()} - ${job.is_current ? 'Present' : (job.end_date ? new Date(job.end_date).getFullYear() : '')}</span>
              </div>
              <div class="subtitle">${job.company}</div>
              <p class="description">${job.description || ''}</p>
              <ul>
                ${(job.responsibilities || []).map((r) => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section>
          <h3>Education</h3>
          ${education.map((edu) => `
            <div class="item">
              <div class="item-header">
                <h4>${edu.institution}</h4>
                <span class="date">${new Date(edu.start_date).getFullYear()} - ${edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}</span>
              </div>
              <div class="subtitle">${edu.degree || 'Degree'} in ${edu.field_of_study || 'Field'}</div>
              <p class="description">${edu.description || ''}</p>
            </div>
          `).join('')}
        </section>

        <section>
          <h3>Skills</h3>
          <div class="skills-grid">
            ${Object.entries(skillsByCategory).map(([cat, items]: [string, string[]]) => `
              <div class="skill-category">
                <strong>${cat.replace('_', ' ')}</strong>
                <div class="skill-tags">${items.join(', ')}</div>
              </div>
            `).join('')}
          </div>
        </section>
      </body>
      </html>
    `
  }

  const fetchAndGenerateResume = async (role: RoleVariant = selectedRole) => {
    try {
      const profile = ROLE_PROFILES[role]
      console.log('=== Generating Resume for Role:', profile.displayName, '===')

      // Fetch Supabase data and GitHub repos in parallel
      const [personal, edu, exp, skills, projects] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('education').select('*').order('start_date', { ascending: false }),
        supabase.from('experience').select('*').order('start_date', { ascending: false }),
        supabase.from('skills').select('*').order('proficiency_level', { ascending: false }),
        supabase.from('projects').select('*').eq('is_featured', true).order('display_order', { ascending: true })
      ])

      // Fetch GitHub repos for project filtering
      let filteredGitHubProjects: ProjectItem[] = []
      try {
        const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN
        const githubService = new GitHubService(GITHUB_TOKEN)
        const repos = await githubService.getRepositories('ambooka', { maxRepos: 30 })
        // Filter by role's preferred languages and convert to ProjectItem
        const filtered = filterGitHubProjects(repos as GitHubProject[], profile.languages, 4)
        filteredGitHubProjects = filtered as unknown as ProjectItem[]
        console.log('GitHub projects filtered:', filteredGitHubProjects.length)
      } catch (githubErr) {
        console.warn('GitHub fetch failed, using Supabase projects:', githubErr)
      }

      // Debug logging
      console.log('Personal Info:', { data: personal.data, error: personal.error })
      console.log('Experience:', { count: exp.data?.length })
      console.log('Skills:', { count: skills.data?.length })

      if (personal.error) {
        console.error('Personal info error:', personal.error)
        throw personal.error
      }

      if (!personal.data) {
        console.error('No personal info data found in database')
        throw new Error('No personal information found. Please add your information in the admin panel.')
      }

      // Combine Supabase projects with GitHub projects (prefer GitHub)
      let combinedProjects: ProjectItem[] = filteredGitHubProjects.length > 0
        ? filteredGitHubProjects
        : (projects.data || []).map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          stack: p.stack,
          github_url: p.github_url,
          live_url: p.live_url,
          is_featured: true as const,
        }))

      // [RESUME FIX]: Force IT-specific projects for IT Assistant role
      if (role === 'it-assistant') {
        combinedProjects = [
          {
            id: 'erp-system',
            title: 'ERP System Implementation & Support',
            description: 'Assisted in the successful rollout and ongoing support of a company-wide Enterprise Resource Planning (ERP) system. Responsibilities included user role management, troubleshooting access issues, generating operational SQL reports, and conducting end-user training sessions.',
            stack: ['SQL', 'Windows Server', 'Excel Reporting', 'System Administration', 'Access Control'],
            is_featured: true,
            github_url: undefined,
            live_url: undefined
          } as ProjectItem
        ] as ProjectItem[]
      }

      // Filter skills by role - only include relevant categories for this role
      const allSkills = (skills.data || []) as Array<{ id: string; name: string; category: string; proficiency_level?: string;[key: string]: unknown }>
      const roleFilteredSkills = filterSkillsByRole(allSkills, role)
      console.log(`Skills filtered for ${profile.displayName}:`, roleFilteredSkills.length, 'of', allSkills.length)

      const resumeData: ResumeData = {
        personal_info: personal.data as unknown as ResumeData['personal_info'],
        education: edu.data || [],
        experience: exp.data || [],
        skills: roleFilteredSkills as SkillItem[],
        projects: combinedProjects
      }

      console.log('Resume data compiled with', combinedProjects.length, 'projects')

      // Use role-variant resume generator with role-specific summary
      return generateVariantResumeHTML(resumeData as unknown as ATSResumeData, {
        roleTitle: profile.title,
        roleSummary: profile.professionalSummary,
        portfolioUrl: 'ambooka.dev',
      })
    } catch (err) {
      console.error('Error generating resume:', err)
      throw err
    }
  }

  const openResumeModal = async () => {
    setIsResumeModalOpen(true)
    setResumeHTML(null)
    if (resumeBlobUrl) {
      URL.revokeObjectURL(resumeBlobUrl)
      setResumeBlobUrl(null)
    }

    try {
      const html = await fetchAndGenerateResume()
      setResumeHTML(html)
      const blob = new Blob([html], { type: 'text/html' })
      const blobUrl = URL.createObjectURL(blob)
      setResumeBlobUrl(blobUrl)
    } catch (err) {
      setResumeHTML('<div style="padding:20px;color:#b91c1c;">Failed to load resume data. Please try again.</div>')
    }
  }

  const closeResumeModal = () => {
    setIsResumeModalOpen(false)
    if (resumeBlobUrl) {
      URL.revokeObjectURL(resumeBlobUrl)
      setResumeBlobUrl(null)
    }
    setResumeHTML(null)
  }

  const printResumeAsPDF = async () => {
    setIsDownloading(true)
    try {
      const printableUrl = resumeBlobUrl
      if (!printableUrl) {
        alert('Resume not loaded yet')
        setIsDownloading(false)
        return
      }

      const printWindow = window.open(printableUrl, '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes')

      if (!printWindow) {
        alert('Please allow pop-ups to print your resume as PDF')
        setIsDownloading(false)
        return
      }

      const onLoaded = () => {
        try {
          printWindow.focus()
          printWindow.print()
        } catch (e) {
          console.warn('Auto-print failed - user can print manually', e)
        }
      }

      const interval = setInterval(() => {
        try {
          if (printWindow && printWindow.document && printWindow.document.readyState === 'complete') {
            clearInterval(interval)
            onLoaded()
            const closeChecker = setInterval(() => {
              if (printWindow.closed) {
                clearInterval(closeChecker)
                setIsDownloading(false)
              }
            }, 500)
          }
        } catch {
          // ignore cross-origin errors
        }
      }, 200)
    } catch (err) {
      console.error('Print error', err)
      alert('Failed to open print dialog. Please try downloading the PDF directly.')
      setIsDownloading(false)
    }
  }

  const downloadResumePDF = async () => {
    setIsDownloading(true)
    try {
      // For now, we'll use the print dialog as "Save as PDF" is the most reliable client-side method
      // without heavy libraries. The user can choose "Save as PDF" in the print dialog.
      await printResumeAsPDF()
    } catch (err) {
      console.error('Download error', err)
      alert('Failed to initiate download. Please try printing.')
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadResumeHTMLFallback = async () => {
    // Deprecated in favor of direct generation
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <>
      <div className="utility-bar">
        <div className="utility-container">
          {/* Consolidated Resume/Print button - Replaced Eye with Printer */}
          <div className="utility-btn-container">
            <button
              className="utility-btn"
              onClick={openResumeModal}
              aria-label="View and Print Resume"
              onMouseEnter={() => handleMouseEnter('View and Print Resume')}
              onMouseLeave={handleMouseLeave}
            >
              <Printer size={20} />
              {activeTooltip === 'View and Print Resume' && <span className="tooltip">View and Print Resume</span>}
            </button>
          </div>

          <div className="divider" />

          {/* Theme Toggle */}
          <div className="utility-btn-container">
            <button
              className="utility-btn"
              onClick={() => {
                // Toggle between premium-dark and premium-light
                const newTheme = currentTheme === 'premium-dark' ? 'premium-light' : 'premium-dark'
                onThemeChange(newTheme)
                localStorage.setItem('theme', newTheme)
              }}
              aria-label="Toggle theme"
              onMouseEnter={() => {
                const tooltip = currentTheme === 'premium-dark'
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'
                handleMouseEnter(tooltip)
              }}
              onMouseLeave={handleMouseLeave}
            >
              {/* Gold sun for dark theme, Moon for light theme */}
              {currentTheme === 'premium-dark' ? (
                <Sun size={20} style={{ color: 'var(--accent-secondary)' }} />
              ) : (
                <Moon size={20} />
              )}
              {activeTooltip && <span className="tooltip">{activeTooltip}</span>}
            </button>
          </div>

          <div className="divider" />

          {/* AI Assistant */}
          <div className="utility-btn-container">
            <button
              className="utility-btn ai-assistant"
              onClick={() => {
                setIsChatOpen(prev => !prev)
                setTimeout(() => inputRef.current?.focus(), 200)
              }}
              aria-label="AI Assistant"
              onMouseEnter={() => handleMouseEnter('AI Assistant')}
              onMouseLeave={handleMouseLeave}
            >
              <Sparkles size={20} />
              {activeTooltip === 'AI Assistant' && <span className="tooltip">AI Assistant</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced AI Chat Modal */}
      {isChatOpen && (
        <div className="chat-modal-overlay">
          <div className="chat-modal" ref={chatModalRef} role="dialog" aria-label="AI chat">
            <div className="chat-header">
              <div className="chat-title">
                <div className="chat-avatar">
                  <Bot size={18} />
                </div>
                <div className="chat-info">
                  <h3>AI Assistant</h3>
                  <span className="chat-status">{isLoading ? 'Typing...' : 'Online'}</span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="chat-action-btn" onClick={clearChat} title="Clear chat">
                  <Trash2 size={16} />
                </button>
                <button className="close-chat" onClick={() => setIsChatOpen(false)} aria-label="Close chat">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="chat-messages" aria-live="polite">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`message-container ${msg.role === 'assistant' ? 'ai-message-container' : 'user-message-container'}`}
                  style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.03}s both` }}
                >
                  <div className={`message ${msg.role === 'assistant' ? 'ai-message' : 'user-message'}`}>
                    {msg.role === 'assistant' && (
                      <div className="message-avatar ai-avatar">
                        <Bot size={16} />
                      </div>
                    )}
                    <div className="message-content">
                      {/* Show typing animation for assistant placeholder with no content yet */}
                      {msg.role === 'assistant' && msg.isPlaceholder && (!msg.content || msg.content.trim() === '') ? (
                        <div className="typing-animation">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      ) : (
                        <p dangerouslySetInnerHTML={{ __html: escapeHtmlAndPreserveNewlines(msg.content) }} />
                      )}
                      <div className="message-meta">
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                        {msg.role === 'user' && (
                          <button className="delete-message-btn" onClick={() => deleteMessage(msg.id)} title="Delete message">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="message-avatar user-avatar">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something... (Press ⌘K to open/close)"
                  disabled={isLoading}
                  className="form-input"
                  aria-label="Chat input"
                />
                <button type="submit" className="send-button" disabled={!input.trim() || isLoading} aria-label="Send message">
                  {isLoading ? <div className="spinner small" /> : <Send size={18} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {isResumeModalOpen && (
        <div className="resume-modal-overlay" onClick={() => closeResumeModal()}>
          <div className="resume-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Resume preview">
            <div className="resume-modal-header">
              <h3>My Resume</h3>
              <button className="close-modal-btn" onClick={() => closeResumeModal()} aria-label="Close">
                <X size={24} />
              </button>
            </div>

            {/* Role Variant Selector */}
            <div className="resume-role-selector" style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-color, #333)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--card-bg, #1a1a1a)'
            }}>
              <label htmlFor="role-select" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary, #888)' }}>
                Resume Type:
              </label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={async (e) => {
                  const newRole = e.target.value as RoleVariant
                  setSelectedRole(newRole)
                  // Regenerate resume with new role
                  setResumeHTML(null)
                  try {
                    const html = await fetchAndGenerateResume(newRole)
                    setResumeHTML(html)
                    if (resumeBlobUrl) URL.revokeObjectURL(resumeBlobUrl)
                    const blob = new Blob([html], { type: 'text/html' })
                    setResumeBlobUrl(URL.createObjectURL(blob))
                  } catch (err) {
                    setResumeHTML('<div style="padding:20px;color:#b91c1c;">Failed to generate resume.</div>')
                  }
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #333)',
                  background: 'var(--input-bg, #222)',
                  color: 'var(--text-primary, #fff)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '200px',
                }}
              >
                {roleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ marginLeft: '-28px', pointerEvents: 'none', color: 'var(--text-secondary, #888)' }} />
            </div>

            <div className="resume-modal-body">
              {resumeHTML ? (
                <iframe
                  ref={resumeIframeRef}
                  srcDoc={resumeHTML}
                  title="Resume Preview"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  className="resume-iframe"
                />
              ) : (
                <div className="loading-resume" style={{ padding: '40px', textAlign: 'center' }}>
                  <Loader2 size={24} className="spinner-icon" />
                  <p>Loading your resume...</p>
                </div>
              )}
            </div>

            <div className="resume-modal-footer">
              <button className="resume-download-btn primary" onClick={printResumeAsPDF} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    Opening Print Dialog...
                  </>
                ) : (
                  <>
                    <Printer size={18} />
                    Print as PDF
                  </>
                )}
              </button>

              <button className="resume-download-btn secondary" onClick={downloadResumePDF} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    Downloading PDF...
                  </>
                ) : (
                  <>
                    <Printer size={18} />
                    Download as PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Resume Modal Styles */
        .resume-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        .resume-modal-content {
          background: white;
          border-radius: 16px;
          width: 90vw;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease-out;
        }

        .dark .resume-modal-content {
          background: #1f2937;
        }

        .resume-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .dark .resume-modal-header {
          border-bottom-color: #374151;
        }

        .resume-modal-header h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .close-modal-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #6b7280;
        }

        .close-modal-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .dark .close-modal-btn:hover {
          background: #374151;
          color: #f9fafb;
        }

        .resume-modal-body {
          flex: 1;
          overflow: hidden;
          background: #f9fafb;
        }

        .dark .resume-modal-body {
          background: #111827;
        }

        .resume-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: white;
        }

        .resume-modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .dark .resume-modal-footer {
          border-top-color: #374151;
          background: #1f2937;
        }

        .resume-download-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .resume-download-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .resume-download-btn.primary {
          background: var(--orange-yellow-crayola, #ffc107);
          color: var(--smoky-black, #111827);
        }

        .resume-download-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 193, 7, 0.3);
        }

        .resume-download-btn.secondary {
          background: transparent;
          border: 2px solid var(--orange-yellow-crayola, #ffc107);
          color: var(--orange-yellow-crayola, #ffc107);
        }

        .resume-download-btn.secondary:hover:not(:disabled) {
          background: rgba(255, 193, 7, 0.1);
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Chat Modal Styles */
        .chat-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .chat-modal {
          width: 400px;
          height: 600px;
          max-height: 80vh;
          background: var(--glass-bg-strong);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--glass-shadow-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dark .chat-modal {
          background: var(--glass-bg-strong);
          border-color: var(--glass-border);
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .dark .chat-header {
          background: rgba(0, 0, 0, 0.2);
          border-color: var(--border-primary);
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-2);
        }

        .chat-info h3 {
          font-weight: 600;
          font-size: 16px;
          margin: 0;
          color: var(--text-primary);
        }

        .chat-status {
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .chat-status::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-success);
          box-shadow: 0 0 8px var(--accent-success);
        }

        .chat-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-action-btn, .close-chat {
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-action-btn:hover, .close-chat:hover {
          background: var(--utility-btn-hover-bg);
          color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scroll-behavior: smooth;
        }
        
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 3px;
        }

        .message-container {
          display: flex;
          animation-fill-mode: both;
          width: 100%;
        }

        .user-message-container {
          justify-content: flex-end;
        }

        .message {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          max-width: 85%;
        }

        .user-message {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-1);
          margin-bottom: 4px;
        }

        .ai-avatar {
          background: var(--gradient-primary);
          color: white;
        }

        .user-avatar {
          background: var(--gradient-secondary);
          color: white;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
          box-shadow: var(--shadow-1);
          font-size: 14px;
          line-height: 1.5;
        }

        .ai-message .message-content {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--border-primary);
        }

        .user-message .message-content {
          background: var(--gradient-primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-content p {
          margin: 0;
          white-space: pre-wrap;
        }

        .message-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 4px;
          font-size: 10px;
          opacity: 0.7;
          gap: 8px;
        }
        
        .user-message .message-meta {
          color: rgba(255, 255, 255, 0.8);
        }

        .delete-message-btn {
          opacity: 0;
          background: none;
          border: none;
          color: currentColor;
          cursor: pointer;
          padding: 2px;
          border-radius: 3px;
          transition: all 0.2s;
        }

        .user-message:hover .delete-message-btn {
          opacity: 1;
        }

        .delete-message-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .typing-animation {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-primary);
          animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        .chat-input {
          padding: 16px 20px;
          border-top: 1px solid var(--border-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          position: relative;
          background: var(--bg-primary);
          border: 1px solid var(--border-primary);
          border-radius: 24px;
          padding: 4px 4px 4px 16px;
          transition: all 0.3s ease;
        }
        
        .input-container:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(142, 14, 40, 0.1);
        }

        .form-input {
          flex: 1;
          padding: 8px 0;
          border: none;
          outline: none;
          font-size: 14px;
          background: transparent;
          color: var(--text-primary);
        }
        
        .form-input::placeholder {
          color: var(--text-tertiary);
        }

        .send-button {
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-1);
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: var(--shadow-2);
        }

        .send-button:disabled {
          background: var(--bg-tertiary);
          color: var(--text-tertiary);
          cursor: not-allowed;
          box-shadow: none;
        }

        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .spinner { width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
        .spinner.small { width: 14px; height: 14px; }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .chat-modal-overlay {
            padding: 0;
            align-items: stretch;
            background: rgba(0, 0, 0, 0.6);
          }
          
          .chat-modal {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            /* Use dvh (dynamic viewport height) if supported, otherwise fallback to 85vh */
            /* This ensures the modal adjusts when keyboard appears */
            height: 85dvh;
            max-height: 85dvh;
            /* Fallback for older browsers */
            @supports not (height: 1dvh) {
              height: 85vh;
              max-height: 85vh;
            }
            border-radius: 24px 24px 0 0;
            border-bottom: none;
            animation: slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            /* Add safe area padding for devices with notches */
            padding-bottom: env(safe-area-inset-bottom, 0);
          }
          
          .chat-messages {
            /* Ensure messages container is scrollable and flexible */
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .chat-input {
            /* Make input sticky at bottom */
            position: sticky;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            /* Add bottom padding for safe area on devices with notches/gestures */
            padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
            z-index: 10;
          }
          
          .dark .chat-input {
            background: rgba(0, 0, 0, 0.95);
          }
          
          .input-container {
            /* Ensure input is fully visible above keyboard */
            position: relative;
          }
          
          @keyframes slideUpMobile {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          
          .resume-modal-content {
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
          }
          
          .resume-modal-footer {
            flex-direction: column;
          }
          
          .resume-download-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}

function escapeHtmlAndPreserveNewlines(input: string | undefined) {
  if (!input) return ''
  const escaped = String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '<br/>')
  return escaped
}
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
  Download
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

type Theme = 'premium-dark' | 'premium-light'

interface UtilityBarProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
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
  phone: string
  summary: string
  location?: string
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
}

interface ResumeData {
  personal_info: {
    full_name: string
    title: string
    email: string
    phone: string
    summary: string
    location?: string
    linkedin_url?: string
    github_url?: string
    portfolio_url?: string
  }
  education: any[]
  experience: any[]
  skills: any[]
}

export default function UtilityBar({ currentTheme, onThemeChange }: UtilityBarProps) {
  // UI states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)

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
      const { data, error } = await supabase.from('personal_info' as any).select('*').single<PersonalInfo>()
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
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
  // -----------------------------
  const generateResumeHTML = (data: ResumeData) => {
    const { personal_info, education, experience, skills } = data

    // Group skills
    const skillsByCategory = skills.reduce((acc: any, skill: any) => {
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
            <span>${personal_info.phone}</span>
            <span>${personal_info.location || 'Nairobi, Kenya'}</span>
          </div>
          <p>${personal_info.summary}</p>
        </header>

        <section>
          <h3>Experience</h3>
          ${experience.map((job: any) => `
            <div class="item">
              <div class="item-header">
                <h4>${job.position}</h4>
                <span class="date">${new Date(job.start_date).getFullYear()} - ${job.is_current ? 'Present' : new Date(job.end_date).getFullYear()}</span>
              </div>
              <div class="subtitle">${job.company}</div>
              <p class="description">${job.description}</p>
              <ul>
                ${(job.responsibilities || []).map((r: string) => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section>
          <h3>Education</h3>
          ${education.map((edu: any) => `
            <div class="item">
              <div class="item-header">
                <h4>${edu.institution}</h4>
                <span class="date">${new Date(edu.start_date).getFullYear()} - ${new Date(edu.end_date).getFullYear()}</span>
              </div>
              <div class="subtitle">${edu.degree} in ${edu.field_of_study}</div>
              <p class="description">${edu.description}</p>
            </div>
          `).join('')}
        </section>

        <section>
          <h3>Skills</h3>
          <div class="skills-grid">
            ${Object.entries(skillsByCategory).map(([cat, items]: [string, any]) => `
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

  const fetchAndGenerateResume = async () => {
    try {
      // Fetch all data in parallel
      const [personal, edu, exp, skills] = await Promise.all([
        supabase.from('personal_info' as any).select('*').single(),
        supabase.from('education' as any).select('*').order('start_date', { ascending: false }),
        supabase.from('experience' as any).select('*').order('start_date', { ascending: false }),
        supabase.from('skills' as any).select('*').order('proficiency_level', { ascending: false })
      ])

      if (personal.error) throw personal.error

      const resumeData: ResumeData = {
        personal_info: personal.data ? (personal.data as unknown as ResumeData['personal_info']) : { full_name: '', title: '', email: '', phone: '', summary: '' },
        education: edu.data || [],
        experience: exp.data || [],
        skills: skills.data || []
      }

      return generateResumeHTML(resumeData)
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
                <Sun size={20} style={{ color: '#fbbf24' }} />
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
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          z-index: 1000;
          padding: 20px;
        }

        .chat-modal {
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .dark .chat-modal {
          background: #1f2937;
          border-color: #374151;
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .dark .chat-header {
          background: #111827;
          border-color: #374151;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .chat-info h3 {
          font-weight: 600;
          font-size: 16px;
          margin: 0;
        }

        .chat-status {
          font-size: 12px;
          color: #6b7280;
        }

        .dark .chat-status {
          color: #9ca3af;
        }

        .chat-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-action-btn {
          padding: 6px;
          border: none;
          background: none;
          border-radius: 6px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-action-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .dark .chat-action-btn:hover {
          background: #374151;
          color: #f9fafb;
        }

        .close-chat {
          padding: 6px;
          border: none;
          background: none;
          border-radius: 6px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-chat:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .dark .close-chat:hover {
          background: #374151;
          color: #f9fafb;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-container {
          display: flex;
          animation-fill-mode: both;
        }

        .user-message-container {
          justify-content: flex-end;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          max-width: 80%;
        }

        .user-message {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .ai-avatar {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .user-avatar {
          background: #10b981;
          color: white;
        }

        .message-content {
          background: #f3f4f6;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
        }

        .dark .message-content {
          background: #374151;
        }

        .ai-message .message-content {
          background: #e5e7eb;
          border-bottom-left-radius: 4px;
        }

        .dark .ai-message .message-content {
          background: #4b5563;
        }

        .user-message .message-content {
          background: #3b82f6;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-content p {
          margin: 0;
          line-height: 1.5;
          font-size: 14px;
          white-space: pre-wrap;
        }

        .message-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          font-size: 11px;
          opacity: 0.7;
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
        }

        .typing-animation {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        .chat-input {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .dark .chat-input {
          background: #111827;
          border-color: #374151;
        }

        .input-container {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          position: relative;
        }

        .form-input {
          flex: 1;
          padding: 12px 16px;
          padding-right: 50px;
          border: 1px solid #d1d5db;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .dark .form-input {
          background: #374151;
          border-color: #4b5563;
          color: white;
        }

        .send-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #3b82f6;
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
        }

        .send-button:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-50%) scale(1.05);
        }

        .send-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: translateY(-50%);
        }

        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .spinner { width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
        .spinner.small { width: 14px; height: 14px; }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .chat-modal { width: 100%; height: 100%; border-radius: 0; }
          .chat-modal-overlay { padding: 0; }
          .resume-modal-content { width: 100vw; height: 100vh; max-width: 100vw; max-height: 100vh; border-radius: 0; }
          .resume-modal-footer { flex-direction: column; }
          .resume-download-btn { width: 100%; }
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
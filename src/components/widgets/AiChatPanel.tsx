'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X, Send, Trash2, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isPlaceholder?: boolean
}

interface AiChatPanelProps {
  isOpen: boolean
  onToggle: () => void
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

export default function AiChatPanel({ isOpen, onToggle }: AiChatPanelProps) {
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

  const chatModalRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const assistantPlaceholderIdRef = useRef<string | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatModalRef.current && !chatModalRef.current.contains(e.target as Node)) {
        onToggle()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onToggle])

  // Focus input when opening
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200)
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onToggle()
      }
      if (e.key === 'Escape' && isOpen) onToggle()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onToggle])

  // Mobile keyboard
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !window.visualViewport) return
    const handleViewportResize = () => {
      if (!chatModalRef.current) return
      const viewport = window.visualViewport
      if (!viewport) return
      const viewportHeight = viewport.height
      const windowHeight = window.innerHeight
      const keyboardVisible = windowHeight - viewportHeight > 150
      if (keyboardVisible) {
        chatModalRef.current.style.maxHeight = `${viewportHeight * 0.95}px`
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100)
      } else {
        chatModalRef.current.style.maxHeight = ''
      }
    }
    window.visualViewport.addEventListener('resize', handleViewportResize)
    window.visualViewport.addEventListener('scroll', handleViewportResize)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize)
      window.visualViewport?.removeEventListener('scroll', handleViewportResize)
    }
  }, [isOpen])

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }

  const clearChat = () => {
    setMessages([{
      id: 'system-welcome',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }])
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

    const assistantId = `assistant-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    assistantPlaceholderIdRef.current = assistantId
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isPlaceholder: true
    }])

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/portfolio-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }] })
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
          if (rDone) { done = true; break }
          const chunk = dec.decode(value, { stream: true })
          accumulated += chunk
          const lines = accumulated.split('\n')
          accumulated = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            try {
              const parsed = JSON.parse(trimmed)
              const content = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? parsed?.text ?? parsed?.content ?? ''
              if (content) {
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: (m.content || '') + content, isPlaceholder: false } : m))
              }
            } catch {
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: (m.content || '') + trimmed, isPlaceholder: false } : m))
            }
          }
        }
        if (accumulated.trim()) {
          try {
            const parsed = JSON.parse(accumulated.trim())
            const content = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? parsed?.text ?? parsed?.content ?? ''
            if (content) {
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: (m.content || '') + content, isPlaceholder: false } : m))
            }
          } catch {
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: (m.content || '') + accumulated, isPlaceholder: false } : m))
          }
        }
      } else {
        const bodyText = await response.text()
        let parsedText = bodyText
        try {
          const parsedJson = JSON.parse(bodyText)
          parsedText = parsedJson?.output ?? parsedJson?.text ?? parsedJson?.message ?? JSON.stringify(parsedJson)
        } catch { /* bodyText stays as-is */ }
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: parsedText, isPlaceholder: false } : m))
      }

      setMessages(prev => prev.map(m => m.id === assistantId && (!m.content || m.content.trim() === '')
        ? { ...m, content: 'I apologize — I could not generate a response. Please try again.' } : m))
    } catch (err) {
      console.error('Chat error', err)
      setMessages(prev => prev.map(m => m.id === assistantId
        ? { ...m, content: 'Sorry, I encountered an error. Please check your connection and try again.' } : m))
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

  return (
    <>
      {/* AI Assistant Button */}
      <div className="relative group">
        <button
          onClick={onToggle}
          aria-label="AI Assistant"
          className="flex items-center justify-center w-12 h-12 rounded-full border-none text-white shadow-[0_4px_12px_hsl(var(--accent)/0.3)] transition-all hover:scale-105 hover:shadow-[0_6px_16px_hsl(var(--accent)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))' }}
        >
          <Sparkles size={20} />
        </button>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-md text-[11px] font-bold text-[hsl(var(--popover-foreground))] whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden md:block z-50">
          AI Assistant
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[hsl(var(--popover))] border-r border-b border-[hsl(var(--border))] rotate-[-45deg]" />
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center md:justify-end z-[1000] p-0 md:p-5 pb-[env(safe-area-inset-bottom)] md:pb-5 animate-in fade-in duration-200">
          <div
            ref={chatModalRef}
            role="dialog"
            aria-label="AI chat"
            className="w-full md:w-[400px] h-[85dvh] md:h-[600px] bg-[hsl(var(--card))] md:border border-[hsl(var(--border))] rounded-t-[24px] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))' }}>
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm m-0 text-[hsl(var(--foreground))]">AI Assistant</h3>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    {isLoading ? 'Typing...' : 'Online'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--accent))] transition-colors cursor-pointer"
                  onClick={clearChat}
                  aria-label="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                  onClick={onToggle}
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-[hsl(var(--border))] scrollbar-track-transparent bg-[hsl(var(--background))]" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("w-full flex animate-in slide-in-from-bottom-2 fade-in duration-300", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn("flex items-end gap-2.5 max-w-[85%]", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    {msg.role === 'assistant' ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))' }}>
                        <Bot size={14} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-sm">
                        <User size={14} />
                      </div>
                    )}
                    <div className={cn(
                      "px-4 py-3 rounded-[18px] relative text-sm shadow-sm",
                      msg.role === 'assistant'
                        ? "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-bl-sm border border-[hsl(var(--border))]"
                        : "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-br-sm"
                    )}>
                      {msg.role === 'assistant' && msg.isPlaceholder && (!msg.content || msg.content.trim() === '') ? (
                        <div className="flex items-center gap-1 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <div
                          className={cn("break-words whitespace-pre-wrap leading-relaxed space-y-2 [&_p]:m-0", msg.role === 'assistant' ? "prose-sm dark:prose-invert" : "")}
                          dangerouslySetInnerHTML={{ __html: escapeHtmlAndPreserveNewlines(msg.content) }}
                        />
                      )}
                      <div className={cn("flex items-center justify-end gap-2 mt-1 -mb-1", msg.role === 'user' ? "text-[hsl(var(--background))/80]" : "text-[hsl(var(--muted-foreground))]")}>
                        <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                        {msg.role === 'user' && (
                          <button className="bg-transparent border-none text-current p-0.5 opacity-0 hover:opacity-100 hover:scale-110 cursor-pointer transition-all ml-1" onClick={() => deleteMessage(msg.id)} aria-label="Delete message">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))/90] backdrop-blur-md sticky bottom-0 z-10 pb-[calc(16px+env(safe-area-inset-bottom))]" onSubmit={handleSubmit}>
              <div className="relative flex items-center w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-full p-1.5 shadow-sm focus-within:border-[hsl(var(--accent))] focus-within:ring-2 focus-within:ring-[hsl(var(--accent))/0.2] transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something... (Press ⌘K)"
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                  aria-label="Chat input"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-none text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:bg-[hsl(var(--muted))] disabled:text-[hsl(var(--muted-foreground))] disabled:cursor-not-allowed disabled:transform-none"
                  style={(!input.trim() || isLoading) ? {} : { background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))' }}
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-ml-0.5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

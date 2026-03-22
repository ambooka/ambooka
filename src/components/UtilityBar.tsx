'use client'

import React, { useState, useEffect } from 'react'
import { Printer, Sparkles } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import AiChatPanel from '@/components/widgets/AiChatPanel'
import ResumeBuilderPanel from '@/components/widgets/ResumeBuilderPanel'
import { cn } from '@/lib/utils'

interface UtilityBarProps {
  resumeTrigger?: number
}

export default function UtilityBar({ resumeTrigger = 0 }: UtilityBarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        await supabase.from('personal_info').select('*').single()
      } catch (err) {
        console.warn('Could not fetch personal info:', err)
      }
    }
    fetchPersonalInfo()
  }, [])

  return (
    <>
      {/* Floating pill — trigger buttons inside backdrop-blur container */}
      <div className={cn(
        "fixed z-50",
        "md:right-5 md:top-1/2 md:-translate-y-1/2 md:bottom-auto",
        "right-4 bottom-24 md:bottom-auto",
        "flex flex-col items-center gap-3",
        "scale-90 md:scale-100 origin-bottom-right md:origin-center",
        "p-2.5 rounded-2xl",
        "bg-[hsl(var(--card)/0.85)] backdrop-blur-xl",
        "border border-[hsl(var(--border))]",
        "shadow-xl"
      )}>
        {/* Resume trigger */}
        <div className="relative group">
          <button
            onClick={() => window.dispatchEvent(new Event('open-resume-modal'))}
            aria-label="View and Print Resume"
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-full",
              "bg-transparent border-none text-[hsl(var(--muted-foreground))]",
              "hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--accent))]",
              "transition-all focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2"
            )}
          >
            <Printer size={20} />
          </button>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-md text-[11px] font-bold text-[hsl(var(--popover-foreground))] whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden md:block z-50">
            View Resume
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[hsl(var(--popover))] border-r border-b border-[hsl(var(--border))] rotate-[-45deg]" />
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-6 bg-[hsl(var(--border))]" />

        {/* AI Chat trigger */}
        <div className="relative group">
          <button
            onClick={() => setIsChatOpen(prev => !prev)}
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
      </div>

      {/*
        Panel modals — rendered OUTSIDE the backdrop-blur container.
        backdrop-filter creates a new containing block for fixed children,
        so these must be siblings of the blur element for their modals
        to be positioned relative to the viewport.
        hideButton=true suppresses their built-in trigger buttons.
      */}
      <ResumeBuilderPanel resumeTrigger={resumeTrigger} hideButton />
      <AiChatPanel isOpen={isChatOpen} onToggle={() => setIsChatOpen(prev => !prev)} hideButton />
    </>
  )
}
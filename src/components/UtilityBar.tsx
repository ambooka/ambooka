'use client'

import React, { useState, useEffect } from 'react'
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
      {/* Floating Utility Bar — right edge on desktop, bottom-right on mobile */}
      <div className={cn(
        "fixed z-50",
        /* Desktop: vertically centered on right edge */
        "md:right-5 md:top-1/2 md:-translate-y-1/2 md:bottom-auto",
        /* Mobile: bottom-right, above the MobileBottomNav */
        "right-4 bottom-24 md:bottom-auto",
        /* Layout */
        "flex md:flex-col items-center gap-2",
        "p-2.5 rounded-2xl",
        /* Glassmorphism card */
        "bg-[hsl(var(--card)/0.85)] backdrop-blur-xl",
        "border border-[hsl(var(--border))]",
        "shadow-xl"
      )}>
        <ResumeBuilderPanel resumeTrigger={resumeTrigger} />

        {/* Separator */}
        <div className="h-px w-6 md:h-6 md:w-px bg-[hsl(var(--border))]" />

        <AiChatPanel isOpen={isChatOpen} onToggle={() => setIsChatOpen(prev => !prev)} />
      </div>
    </>
  )
}
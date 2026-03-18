'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import AiChatPanel from '@/components/widgets/AiChatPanel'
import ResumeBuilderPanel from '@/components/widgets/ResumeBuilderPanel'

interface UtilityBarProps {
  resumeTrigger?: number
}

export default function UtilityBar({ resumeTrigger = 0 }: UtilityBarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Fetch personal info on mount (shared context)
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
      {/* Floating Utility Bar */}
      <div className="fixed right-6 bottom-6 md:top-1/2 md:-translate-y-1/2 md:bottom-auto z-50 flex md:flex-col items-center gap-3 p-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-full shadow-lg backdrop-blur-md">
        <ResumeBuilderPanel resumeTrigger={resumeTrigger} />

        <div className="h-4 md:h-[1px] w-[1px] md:w-4 bg-[hsl(var(--border))]" />

        <AiChatPanel isOpen={isChatOpen} onToggle={() => setIsChatOpen(prev => !prev)} />
      </div>
    </>
  )
}
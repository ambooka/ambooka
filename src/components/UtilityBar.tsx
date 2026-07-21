"use client";

import React, { useState } from "react";
import { Printer, Sparkles } from "lucide-react";
import AiChatPanel from "@/components/widgets/AiChatPanel";
import ResumeBuilderPanel from "@/components/widgets/ResumeBuilderPanel";
import { cn } from "@/lib/utils";

interface UtilityBarProps {
  resumeTrigger?: number;
}

export default function UtilityBar({ resumeTrigger = 0 }: UtilityBarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating pill — trigger buttons inside backdrop-blur container */}
      <div
        className={cn(
          "fixed z-[1050] flex",
          "md:right-5 md:top-1/2 md:-translate-y-1/2 md:bottom-auto",
          "right-4 bottom-[calc(5.6rem+env(safe-area-inset-bottom))] md:bottom-auto",
          "flex-row items-center gap-1.5 md:flex-col md:gap-3",
          "origin-bottom-right md:origin-center",
          "p-1.5 rounded-2xl md:p-2.5",
          "bg-[hsl(var(--card)/0.85)] backdrop-blur-xl",
          "border border-[hsl(var(--border))]",
          "shadow-xl",
        )}
      >
        {/* Resume trigger */}
        <div className="relative group">
          <button
            onClick={() => window.dispatchEvent(new Event("open-resume-modal"))}
            aria-label="View and Print Resume"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl md:h-11 md:w-11 md:rounded-full",
              "bg-transparent border-none text-[hsl(var(--muted-foreground))]",
              "hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--accent))]",
              "transition-all focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2",
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
        <div className="h-6 w-px bg-[hsl(var(--border))] md:h-px md:w-6" />

        {/* Assistant Chat trigger */}
        <div className="relative group">
          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            aria-label="Assistant"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-none text-white shadow-[0_4px_12px_hsl(var(--accent)/0.3)] transition-all hover:scale-105 hover:shadow-[0_6px_16px_hsl(var(--accent)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 md:h-12 md:w-12 md:rounded-full"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
            }}
          >
            <Sparkles size={20} />
          </button>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-md text-[11px] font-bold text-[hsl(var(--popover-foreground))] whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden md:block z-50">
            Assistant
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
      <AiChatPanel
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
        hideButton
      />
    </>
  );
}

'use client'

import { ArrowUpRight, Download, Mail, Sparkles } from 'lucide-react'

interface CtaFooterWidgetProps {
    onOpenResume?: () => void
}

const AVAILABILITY_MODES = [
    {
        label: 'Remote',
        icon: (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        )
    },
    {
        label: 'Hybrid',
        icon: (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        )
    },
    {
        label: 'On-site',
        icon: (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        )
    }
]

export default function CtaFooterWidget({ onOpenResume }: CtaFooterWidgetProps) {
    const handleDownloadCV = () => {
        if (onOpenResume) {
            onOpenResume()
        } else {
            window.dispatchEvent(new CustomEvent('open-resume-modal'))
        }
    }

    const handleEmail = () => {
        window.location.href = 'mailto:hisham@ambooka.dev'
    }

    return (
        <div className="w-full">
            <div className="relative overflow-hidden rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-5 shadow-sm sm:px-6 sm:py-7 md:px-8 md:py-8">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(20,184,166,0.18),rgba(8,145,178,0.08)_40%,transparent_85%)] dark:bg-[linear-gradient(145deg,rgba(20,184,166,0.08),rgba(8,145,178,0.04)_40%,transparent_85%)]" />
                <div className="absolute -left-12 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56 md:-left-20 md:h-72 md:w-72" />
                <div className="absolute -bottom-16 right-0 h-32 w-32 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl sm:h-48 sm:w-48 md:h-64 md:w-64" />
                <div
                    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                        backgroundSize: '22px 22px'
                    }}
                />

                <div className="relative z-10 mx-auto max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] backdrop-blur-sm">
                        <Sparkles size={13} className="text-[hsl(var(--secondary))]" />
                        Ready for the next challenge
                    </div>

                    <div className="mt-5 text-center">
                        <h2 className="text-[1.6rem] font-black uppercase leading-[0.92] tracking-tight text-[hsl(var(--foreground))] sm:text-4xl md:text-5xl">
                            Let&apos;s Build Something{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">Significant.</span>
                                <span className="absolute bottom-1 left-0 -z-0 h-2.5 w-full -rotate-1 bg-[hsl(var(--accent))]/25" />
                            </span>
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))] sm:text-[0.95rem] md:mt-5 md:text-base">
                            Currently seeking opportunities to apply MLOps and full-stack engineering to production systems that need thoughtful execution, clear ownership, and real shipping momentum.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:justify-center">
                        <button
                            onClick={handleDownloadCV}
                            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[hsl(var(--foreground))] px-5 py-3.5 text-[hsl(var(--background))] shadow-[0_10px_28px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(20,184,166,0.25)] sm:w-auto hover:bg-[hsl(var(--accent))]"
                        >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                            <span className="relative z-10 flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.16em]">
                                <Download size={18} strokeWidth={2.4} />
                                Download Resume
                            </span>
                        </button>

                        <button
                            onClick={handleEmail}
                            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/35 px-5 py-3.5 text-[hsl(var(--muted-foreground))] backdrop-blur-sm transition-all duration-300 hover:border-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] sm:w-auto"
                        >
                            <span className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.16em]">
                                <Mail size={18} strokeWidth={2.4} />
                                Get in Touch
                                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </span>
                        </button>
                    </div>

                    <div className="mt-6 space-y-3 md:mt-8">
                        <div className="flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))]">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--success))] opacity-70" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))]" />
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-[0.18em]">Open to Work</span>
                        </div>

                        <div className="mx-auto grid max-w-2xl gap-2 sm:grid-cols-3">
                            {AVAILABILITY_MODES.map(mode => (
                                <div
                                    key={mode.label}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/75 backdrop-blur-sm px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]"
                                >
                                    {mode.icon}
                                    <span>{mode.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

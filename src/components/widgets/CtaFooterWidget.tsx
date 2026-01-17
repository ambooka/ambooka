'use client'

import { Download, Mail, Send, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react'

interface CtaFooterWidgetProps {
    onOpenResume?: () => void
}

export default function CtaFooterWidget({ onOpenResume }: CtaFooterWidgetProps) {
    const handleDownloadCV = () => {
        if (onOpenResume) {
            onOpenResume()
        } else {
            // Dispatch custom event to open resume modal
            window.dispatchEvent(new CustomEvent('open-resume-modal'))
        }
    }

    const handleEmail = () => {
        window.location.href = 'mailto:hisham@ambooka.dev'
    }

    return (
        <div className="cta-footer-section">
            <div className="relative overflow-hidden rounded-3xl bg-[var(--surface-card)] p-8 md:p-12 shadow-[var(--shadow-lg)]">
                {/* Soft Clay Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 via-[var(--accent-secondary)]/10 to-[var(--bg-primary)] opacity-100" />
                {/* Animated Background Patterns */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />

                <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-medium)] text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-8 animate-[float_3s_ease-in-out_infinite]">
                        <Sparkles size={12} className="animate-pulse text-[var(--accent-secondary)]" /> Ready for the next challenge
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 leading-[0.85]">
                        Let&apos;s Build Something{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Significant.</span>
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-[var(--accent-primary)]/30 -rotate-1 -z-0" />
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium mb-10 leading-relaxed max-w-xl">
                        Currently seeking opportunities to apply MLOps and Full-Stack expertise to high-impact production systems.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        {/* Primary Button - Download Resume */}
                        <button
                            onClick={handleDownloadCV}
                            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-800 w-full sm:w-auto transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden hover:shadow-[0_15px_50px_rgba(0,0,0,0.3)]"
                        >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative z-10 text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3">
                                <Download size={18} strokeWidth={2.5} /> Download Resume
                            </span>
                        </button>

                        {/* Secondary Button - Get in Touch */}
                        <button
                            onClick={handleEmail}
                            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-transparent border-2 border-[var(--border-medium)] text-[var(--text-secondary)] w-full sm:w-auto transition-all duration-300 hover:bg-[var(--bg-tertiary)] hover:border-[var(--accent-secondary)] hover:text-[var(--text-primary)]"
                        >
                            <span className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3">
                                <Mail size={18} strokeWidth={2.5} /> Get in Touch
                                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </button>
                    </div>

                    {/* Availability Tags */}
                    <div className="mt-12 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-success)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-success)]"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Open to Work</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-wide hover:bg-[var(--bg-sandy)] transition-colors cursor-default">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                Remote
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-wide hover:bg-[var(--bg-sandy)] transition-colors cursor-default">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Hybrid
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-wide hover:bg-[var(--bg-sandy)] transition-colors cursor-default">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                On-site
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    )
}

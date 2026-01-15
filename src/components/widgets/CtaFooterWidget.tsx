'use client'

import { Download, Mail, Send, ChevronRight } from 'lucide-react'

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
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-light)] p-6 md:p-10 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-secondary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-widest mb-6">
                        <Send size={10} /> Ready for the next challenge
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 leading-[0.9]">
                        Let&apos;s Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">Significant.</span>
                    </h2>

                    <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium opacity-80 mb-10 leading-relaxed uppercase tracking-wide">
                        Currently looking for opportunities to apply MLOps and Full-Stack expertise to high-impact production systems.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        <button
                            onClick={handleDownloadCV}
                            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white w-full sm:w-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl overflow-hidden hover:shadow-[0_8px_30px_rgba(20,184,166,0.3)]"
                        >
                            <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <Download size={16} /> Download Resume
                            </span>
                        </button>

                        <button
                            onClick={handleEmail}
                            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-[var(--border-light)] text-[var(--text-primary)] w-full sm:w-auto transition-all duration-300 hover:bg-white/10 hover:border-[var(--accent-primary)]/30"
                        >
                            <span className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <Mail size={16} /> Get in Touch <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="text-[10px] font-black uppercase tracking-widest">Available for Remote / Hybrid / On-site</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

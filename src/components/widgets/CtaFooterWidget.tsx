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
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#14b8a6] p-8 md:p-12 shadow-2xl">
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[11px] font-bold text-white uppercase tracking-widest mb-8 animate-[float_3s_ease-in-out_infinite]">
                        <Sparkles size={12} className="animate-pulse" /> Ready for the next challenge
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6 leading-[0.85]">
                        Let&apos;s Build Something{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Significant.</span>
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-white/20 -rotate-1 -z-0" />
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-white/80 font-medium mb-10 leading-relaxed max-w-xl">
                        Currently seeking opportunities to apply MLOps and Full-Stack expertise to high-impact production systems.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        {/* Primary Button - Download Resume */}
                        <button
                            onClick={handleDownloadCV}
                            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#0f766e] w-full sm:w-auto transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden hover:shadow-[0_15px_50px_rgba(0,0,0,0.3)]"
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
                            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-transparent backdrop-blur-sm border-2 border-white/30 text-white w-full sm:w-auto transition-all duration-300 hover:bg-white/10 hover:border-white/60"
                        >
                            <span className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3">
                                <Mail size={18} strokeWidth={2.5} /> Get in Touch
                                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </button>
                    </div>

                    {/* Availability Tag */}
                    <div className="mt-12 flex items-center gap-3 text-white/50">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-widest">Available for Remote / Hybrid / On-site</span>
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

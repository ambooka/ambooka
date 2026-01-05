'use client'

import { LayoutDashboard, FileText, Briefcase, MessageSquare, Send } from 'lucide-react'

type PageId = 'about' | 'resume' | 'portfolio' | 'blog' | 'contact'

interface MobileBottomNavProps {
    activePage: PageId
    setActivePage: (page: PageId) => void
}

const NAV_ITEMS = [
    { id: 'about', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'resume', label: 'Resume', icon: <FileText size={20} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={20} /> },
    { id: 'blog', label: 'Blog', icon: <MessageSquare size={20} /> },
    { id: 'contact', label: 'Contact', icon: <Send size={20} /> }
] as const

export default function MobileBottomNav({ activePage, setActivePage }: MobileBottomNavProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-32px)] max-w-md md:hidden">
            <nav className="glass-nav flex justify-around items-center h-16 px-1 rounded-[32px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`relative flex flex-col items-center justify-center gap-0.5 transition-all duration-500 rounded-2xl group flex-1 ${activePage === item.id
                            ? 'text-white active'
                            : 'text-white/40 hover:text-white/60'
                            }`}
                        aria-label={item.label}
                    >
                        {/* active pill highlight - around the icon area */}
                        <div className={`relative flex items-center justify-center w-12 h-9 transition-all duration-300 ${activePage === item.id
                            ? 'bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]'
                            : 'bg-transparent'
                            }`}>
                            <div className={`transition-transform duration-300 ${activePage === item.id ? 'scale-110' : 'group-active:scale-95'}`}>
                                {item.icon}
                            </div>
                        </div>

                        <span className={`text-[10px] font-medium tracking-tight transition-all duration-300 ${activePage === item.id
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-60'
                            }`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            <style jsx>{`
                .glass-nav {
                    background: rgba(15, 31, 36, 0.75);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                }

                :global([data-theme="premium-light"]) .glass-nav {
                    background: rgba(232, 240, 238, 0.8);
                    border: 1px solid rgba(30, 58, 66, 0.1);
                }

                :global([data-theme="premium-light"]) .glass-nav button {
                    color: var(--text-tertiary);
                }

                :global([data-theme="premium-light"]) .glass-nav button.active {
                    color: var(--accent-primary);
                }
                
                :global([data-theme="premium-light"]) .active > div:first-of-type {
                    background: rgba(20, 184, 166, 0.15) !important;
                    border-color: rgba(20, 184, 166, 0.1);
                    box-shadow: 0 0 15px rgba(20, 184, 166, 0.1);
                }
            `}</style>
        </div>
    )
}

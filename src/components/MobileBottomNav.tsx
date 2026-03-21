<<<<<<< HEAD
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Briefcase, FileText, LayoutDashboard, MessageSquare, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navIndicatorTransition } from '@/lib/motion'
=======
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Send } from 'lucide-react'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

const NAV_ITEMS = [
    { id: 'about', label: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} /> },
    { id: 'resume', label: 'Resume', href: '/resume', icon: <FileText size={20} /> },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: <Briefcase size={20} /> },
    { id: 'blog', label: 'Blog', href: '/blog', icon: <MessageSquare size={20} /> },
    { id: 'contact', label: 'Contact', href: '/contact', icon: <Send size={20} /> }
] as const

<<<<<<< HEAD
interface MobileBottomNavProps {
    className?: string
}

export default function MobileBottomNav({ className = '' }: MobileBottomNavProps) {
=======
export default function MobileBottomNav() {
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
    const pathname = usePathname()

    const isNavItemActive = (item: typeof NAV_ITEMS[number]) => {
        if (item.href === '/') return pathname === '/'
        return pathname.startsWith(item.href)
    }
<<<<<<< HEAD

    return (
        <div className={cn(
            "fixed bottom-3 left-1/2 z-[1000] w-[calc(100%-24px)] max-w-lg -translate-x-1/2 md:hidden",
            className
        )}>
            <nav className={cn(
                "glass-nav flex h-16 items-center justify-around rounded-[32px] px-1",
                "bg-[hsl(195_37%_10%/0.78)] backdrop-blur-[24px] backdrop-saturate-[180%]",
                "border border-white/10 shadow-[0_14px_28px_rgba(9,14,18,0.32)]",
                /* Light mode overrides */
                "[data-theme='premium-light']_&:bg-[hsl(var(--card)/0.92)]",
            )}>
                {NAV_ITEMS.map((item) => {
                    const active = isNavItemActive(item)
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-500",
                                active
                                    ? "active text-white"
                                    : "text-white/40 hover:text-white/60"
                            )}
                            aria-label={item.label}
                        >
                            <div className={cn(
                                "relative flex h-9 w-12 items-center justify-center transition-all duration-300",
                                active
                                    ? "bg-transparent"
                                    : "bg-transparent"
                            )}>
                                {active && (
                                    <motion.span
                                        layoutId="mobile-nav-indicator"
                                        className="absolute inset-0 rounded-full border border-white/10 bg-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] backdrop-blur-md -z-10"
                                        transition={navIndicatorTransition}
                                    />
                                )}
                                <div className={cn(
                                    "transition-transform duration-300",
                                    active ? "scale-110" : "group-active:scale-95"
                                )}>
                                    {item.icon}
                                </div>
                            </div>

                            <span className={cn(
                                "text-[10px] font-medium tracking-tight transition-all duration-300",
                                active ? "translate-y-0 opacity-100" : "opacity-60"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
=======
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-32px)] max-w-md md:hidden">
            <nav className="glass-nav flex justify-around items-center h-16 px-1 rounded-[32px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`relative flex flex-col items-center justify-center gap-0.5 transition-all duration-500 rounded-2xl group flex-1 ${isNavItemActive(item)
                            ? 'text-white active'
                            : 'text-white/40 hover:text-white/60'
                            }`}
                        aria-label={item.label}
                    >
                        {/* active pill highlight - around the icon area */}
                        <div className={`relative flex items-center justify-center w-12 h-9 transition-all duration-300 ${isNavItemActive(item)
                            ? 'bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]'
                            : 'bg-transparent'
                            }`}>
                            <div className={`transition-transform duration-300 ${isNavItemActive(item) ? 'scale-110' : 'group-active:scale-95'}`}>
                                {item.icon}
                            </div>
                        </div>

                        <span className={`text-[10px] font-medium tracking-tight transition-all duration-300 ${isNavItemActive(item)
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-60'
                            }`}>
                            {item.label}
                        </span>
                    </Link>
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
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        </div>
    )
}

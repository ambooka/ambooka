'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Briefcase, FileText, LayoutDashboard, MessageSquare, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navIndicatorTransition } from '@/lib/motion'

const NAV_ITEMS = [
    { id: 'about', label: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} /> },
    { id: 'resume', label: 'Resume', href: '/resume', icon: <FileText size={20} /> },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: <Briefcase size={20} /> },
    { id: 'blog', label: 'Blog', href: '/blog', icon: <MessageSquare size={20} /> },
    { id: 'contact', label: 'Contact', href: '/contact', icon: <Send size={20} /> }
] as const

interface MobileBottomNavProps {
    className?: string
}

export default function MobileBottomNav({ className = '' }: MobileBottomNavProps) {
    const pathname = usePathname()

    const isNavItemActive = (item: typeof NAV_ITEMS[number]) => {
        if (item.href === '/') return pathname === '/'
        return pathname.startsWith(item.href)
    }

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
        </div>
    )
}

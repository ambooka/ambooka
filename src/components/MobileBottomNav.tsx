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
            "pointer-events-none fixed inset-x-0 bottom-0 z-[1000] w-full px-3 pt-2 md:hidden",
            "pb-[max(0.65rem,env(safe-area-inset-bottom))]",
            className
        )}>
            <nav className={cn(
                "glass-nav pointer-events-auto mx-auto grid h-[4.25rem] max-w-[30rem] grid-cols-5 items-stretch rounded-[1.5rem] px-1.5 py-1.5",
                "border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.96] backdrop-blur-2xl",
                "shadow-[0_16px_45px_rgba(0,0,0,0.22)] ring-1 ring-white/10"
            )}>
                {NAV_ITEMS.map((item) => {
                    const active = isNavItemActive(item)
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "group relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-[1.15rem] transition-all duration-300",
                                active
                                    ? "text-[hsl(var(--accent))]"
                                    : "text-[hsl(var(--muted-foreground))] active:bg-[hsl(var(--muted))/0.7]"
                            )}
                            aria-label={item.label}
                        >
                            <div className="relative flex h-8 w-11 items-center justify-center transition-all duration-300">
                                {active && (
                                    <motion.span
                                        layoutId="mobile-nav-indicator"
                                        className="absolute inset-0 -z-10 rounded-xl border border-[hsl(var(--accent))/0.22] bg-[hsl(var(--accent))/0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
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
                                    "max-w-full truncate px-0.5 text-[9px] font-bold tracking-tight transition-all duration-300 min-[390px]:text-[10px]",
                                    active ? "opacity-100" : "opacity-75"
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

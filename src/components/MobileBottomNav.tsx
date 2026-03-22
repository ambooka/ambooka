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
            "fixed bottom-0 left-0 right-0 z-[1000] w-full md:hidden p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
            className
        )}>
            <nav className={cn(
                "flex h-16 items-center justify-around px-2 rounded-2xl",
                "bg-card/85 backdrop-blur-xl border border-border pb-0 shadow-xl shadow-black/5"
            )}>
                {NAV_ITEMS.map((item) => {
                    const active = isNavItemActive(item)
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 h-full",
                                active
                                    ? "active text-accent"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            aria-label={item.label}
                        >
                            <div className="relative flex h-8 w-12 items-center justify-center transition-all duration-300">
                                {active && (
                                    <motion.span
                                        layoutId="mobile-nav-indicator"
                                        className="absolute inset-0 rounded-xl bg-accent/15 border border-accent/20 -z-10"
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
                                "text-[11px] font-medium tracking-tight transition-all duration-300",
                                active ? "translate-y-0 opacity-100" : "opacity-80"
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

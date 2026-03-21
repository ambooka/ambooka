'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Github, Linkedin, PanelLeft, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navIndicatorTransition, buttonTap } from '@/lib/motion'

const NAV_ITEMS = [
    { id: 'about', label: 'Dashboard', href: '/' },
    { id: 'resume', label: 'Resume', href: '/resume' },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'contact', label: 'Contact', href: '/contact' }
] as const

export default function TopHeader({ onProfileClick }: { onProfileClick?: () => void }) {
    const pathname = usePathname()

    const isNavItemActive = (item: typeof NAV_ITEMS[number]) => {
        if (item.href === '/') return pathname === '/'
        return pathname.startsWith(item.href)
    }

    return (
        <header className="sticky top-0 z-[120] px-3 pt-2.5 pb-1 backdrop-blur-[14px]">
            <div className={cn(
                "max-w-[1560px] mx-auto flex items-center justify-between gap-3",
                "px-3 py-2.5 rounded-3xl",
                "border border-[hsl(var(--border))]",
                "bg-gradient-to-b from-[hsl(var(--card)/0.62)] to-[hsl(var(--card)/0.4)]",
                "shadow-lg",
                "dark:from-[hsl(var(--card)/0.3)] dark:to-[hsl(var(--card)/0.1)]"
            )}>
                {/* Logo */}
                <div className="shrink-0">
                    <Link
                        href="/"
                        className={cn(
                            "inline-flex items-center justify-center min-h-[2.55rem]",
                            "px-4 py-2.5 rounded-full",
                            "bg-[hsl(var(--card)/0.82)] border border-[hsl(var(--border))]",
                            "text-[hsl(var(--foreground))] text-sm font-extrabold tracking-tighter",
                            "shadow-md hover:-translate-y-px hover:shadow-lg transition-all duration-200"
                        )}
                    >
                        ambooka
                    </Link>
                </div>

                {/* Nav Pills — hidden on mobile, visible md+ */}
                <nav
                    className={cn(
                        "nav-pills hidden md:flex items-center gap-1 min-w-0",
                        "max-w-[min(58vw,720px)] overflow-x-auto scrollbar-none",
                        "p-1 rounded-full",
                        "bg-[hsl(var(--foreground)/0.05)] border border-[hsl(var(--border))]"
                    )}
                    aria-label="Primary navigation"
                >
                    {NAV_ITEMS.map(item => {
                        const active = isNavItemActive(item)
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "relative inline-flex items-center justify-center",
                                    "min-h-[2.35rem] px-3.5 py-2.5 rounded-full",
                                    "text-[0.8rem] font-semibold",
                                    "whitespace-nowrap transition-colors duration-200",
                                    active
                                        ? "text-[hsl(var(--foreground))]"
                                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card)/0.52)]"
                                )}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="nav-indicator"
                                        className="absolute inset-0 rounded-full bg-[hsl(var(--card)/0.92)] shadow-md -z-10"
                                        transition={navIndicatorTransition}
                                    />
                                )}
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Profile trigger — visible below lg */}
                    <motion.button
                        type="button"
                        whileTap={buttonTap}
                        className={cn(
                            "hidden max-lg:inline-flex items-center gap-1.5",
                            "min-h-[2.45rem] px-3.5 py-2.5 rounded-full",
                            "border border-[hsl(var(--border))] bg-[hsl(var(--foreground)/0.05)]",
                            "text-[hsl(var(--foreground))] text-[0.78rem] font-bold",
                            "hover:-translate-y-px hover:bg-[hsl(var(--accent)/0.1)] hover:text-[hsl(var(--accent))]",
                            "transition-all duration-200 cursor-pointer",
                            "max-[420px]:w-[2.7rem] max-[420px]:p-0 max-[420px]:justify-center"
                        )}
                        onClick={onProfileClick}
                        aria-label="Open profile panel"
                    >
                        <PanelLeft size={17} />
                        <span className="max-[420px]:hidden">Profile</span>
                    </motion.button>

                    {/* Availability pill — hidden on small screens */}
                    <div className={cn(
                        "hidden xl:inline-flex items-center gap-2",
                        "min-h-[2.45rem] px-3 py-2 rounded-full",
                        "bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.14)]"
                    )}>
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_0_0.28rem_hsl(var(--accent)/0.14)]" />
                        <span className="text-[hsl(var(--accent))] text-[0.78rem] font-bold whitespace-nowrap">
                            Available for Hire
                        </span>
                    </div>

                    {/* Social links — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-1.5">
                        <motion.a
                            href="https://github.com/ambooka"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -2 }}
                            whileTap={buttonTap}
                            className={cn(
                                "social-btn inline-flex items-center justify-center",
                                "w-[2.45rem] h-[2.45rem] rounded-full",
                                "border border-[hsl(var(--border))] bg-[hsl(var(--foreground)/0.05)]",
                                "text-[hsl(var(--muted-foreground))]",
                                "hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.1)] hover:border-[hsl(var(--accent)/0.16)]",
                                "transition-colors duration-200"
                            )}
                            aria-label="GitHub"
                        >
                            <Github size={17} />
                        </motion.a>
                        <motion.a
                            href="https://linkedin.com/in/ambooka"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -2 }}
                            whileTap={buttonTap}
                            className={cn(
                                "social-btn inline-flex items-center justify-center",
                                "w-[2.45rem] h-[2.45rem] rounded-full",
                                "border border-[hsl(var(--border))] bg-[hsl(var(--foreground)/0.05)]",
                                "text-[hsl(var(--muted-foreground))]",
                                "hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.1)] hover:border-[hsl(var(--accent)/0.16)]",
                                "transition-colors duration-200"
                            )}
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={17} />
                        </motion.a>
                    </div>

                    {/* Contact CTA */}
                    <motion.div whileTap={buttonTap} whileHover={{ scale: 1.03 }}>
                        <Link
                            href="/contact"
                            className={cn(
                                "inline-flex items-center gap-1.5",
                                "min-h-[2.5rem] px-3.5 py-2.5 rounded-full",
                                "bg-[hsl(var(--foreground))] text-white",
                                "text-[0.79rem] font-bold",
                                "shadow-lg hover:bg-[hsl(var(--accent))]",
                                "transition-colors duration-200",
                                "max-md:w-[2.7rem] max-md:p-0 max-md:justify-center"
                            )}
                        >
                            <Send size={14} />
                            <span className="max-lg:hidden">Let&apos;s Talk</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </header>
    )
}

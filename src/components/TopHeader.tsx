'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
<<<<<<< HEAD
import { motion } from 'framer-motion'
import { Github, Linkedin, PanelLeft, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navIndicatorTransition, buttonTap } from '@/lib/motion'
=======
import { Github, Linkedin, Send } from 'lucide-react'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

const NAV_ITEMS = [
    { id: 'about', label: 'Dashboard', href: '/' },
    { id: 'resume', label: 'Resume', href: '/resume' },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'contact', label: 'Contact', href: '/contact' }
] as const

<<<<<<< HEAD
export default function TopHeader({ onProfileClick }: { onProfileClick?: () => void }) {
=======
export default function TopHeader({ onProfileClick: _onProfileClick }: { onProfileClick?: () => void }) {
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
    const pathname = usePathname()

    const isNavItemActive = (item: typeof NAV_ITEMS[number]) => {
        if (item.href === '/') return pathname === '/'
        return pathname.startsWith(item.href)
    }

    return (
<<<<<<< HEAD
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
=======
        <header className="app-header">
            <div className="header-inner">
                {/* Logo - Text with rounded border */}
                <div className="header-logo">
                    <Link href="/" className="logo-text">ambooka</Link>
                </div>

                {/* Navigation Pills */}
                <nav className="nav-pills">
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`nav-pill ${isNavItemActive(item) ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="header-actions">
                    {/* Availability Pill */}
                    <div className="availability-pill">
                        <span className="availability-dot"></span>
                        <span className="availability-text hidden sm:block">Available for Hire</span>
                    </div>

                    <div className="divider-v"></div>

                    {/* Social Icons */}
                    <div className="social-quick-links">
                        <a href="https://github.com/ambooka" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                            <Github size={18} />
                        </a>
                        <a href="https://linkedin.com/in/ambooka" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                            <Linkedin size={18} />
                        </a>
                    </div>

                    <div className="divider-v"></div>

                    {/* Contact CTA */}
                    <Link href="/contact" className="contact-cta">
                        <Send size={14} />
                        <span className="hidden xs:block">Let&apos;s Talk</span>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .app-header {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    padding: 8px 20px; /* Minimal padding */
                    background: transparent;
                    backdrop-filter: blur(8px);
                }

                .header-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                /* Logo - Clean pill */
                .header-logo {
                    display: flex;
                    align-items: center;
                }

                .logo-text {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    letter-spacing: -0.3px;
                    padding: 10px 20px;
                    background: #FFFFFF;
                    border: 1px solid rgba(30, 58, 66, 0.08);
                    border-radius: 50px;
                    box-shadow: 0 2px 8px rgba(30, 58, 66, 0.06);
                    transition: all 0.2s ease;
                }

                .logo-text:hover {
                    box-shadow: 0 4px 12px rgba(30, 58, 66, 0.1);
                }

                /* Navigation Pills - Clean background container */
                .nav-pills {
                    display: flex;
                    gap: 4px;
                    background: rgba(30, 58, 66, 0.06);
                    padding: 6px;
                    border-radius: 50px;
                    border: 1px solid rgba(30, 58, 66, 0.04);
                }

                .nav-pill {
                    border: none;
                    background: transparent;
                    padding: 10px 20px;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .nav-pill:hover {
                    color: var(--text-primary);
                    background: rgba(255, 255, 255, 0.5);
                }

                .nav-pill.active {
                    background: #FFFFFF;
                    color: var(--text-primary);
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(30, 58, 66, 0.1);
                }

                /* Action Buttons & Quick Links */
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                @media (max-width: 640px) {
                    .header-actions {
                        gap: 8px;
                    }
                    .divider-v {
                        display: none;
                    }
                    .availability-pill {
                        padding: 8px;
                    }
                }

                .availability-pill {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(154, 184, 168, 0.2); /* Matcha Tint */
                    border: 1px solid rgba(154, 184, 168, 0.3);
                    border-radius: 50px;
                }

                .availability-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--accent-success); /* Soft Teal */
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(118, 199, 178, 0.4);
                    animation: pulse-dot 2s infinite;
                }

                @keyframes pulse-dot {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }

                .availability-text {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--accent-primary); /* Matcha Green */
                    white-space: nowrap;
                }

                .social-quick-links {
                    display: flex;
                    gap: 8px;
                }

                .social-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(43, 27, 45, 0.05); /* Dark Purple Tint */
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                    text-decoration: none;
                }

                .social-btn:hover {
                    background: var(--accent-primary);
                    color: #FFFFFF;
                    transform: translateY(-2px);
                }

                .divider-v {
                    width: 1px;
                    height: 24px;
                    background: rgba(43, 27, 45, 0.1);
                }

                .contact-cta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: var(--text-primary);
                    color: #FFFFFF;
                    border: none;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: var(--shadow-sm);
                }

                .contact-cta:hover {
                    background: var(--accent-primary);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .app-header {
                        padding: 12px 10px;
                    }

                    .logo-text {
                        display: none;
                    }

                    .nav-pills {
                        gap: 2px;
                        padding: 3px;
                    }

                    .nav-pill {
                        padding: 8px 14px;
                        font-size: 0.8rem;
                    }
                }

                @media (max-width: 768px) {
                    .nav-pills {
                        display: none;
                    }
                }
            `}</style>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        </header>
    )
}

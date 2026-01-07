'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Send } from 'lucide-react'

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
                        <span className="hidden xs:block">Let's Talk</span>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .app-header {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    padding: 20px 40px;
                    background: transparent;
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

                /* Navigation Pills - Clean background */
                .nav-pills {
                    display: flex;
                    gap: 4px;
                    background: rgba(30, 58, 66, 0.04);
                    padding: 6px;
                    border-radius: 50px;
                }

                .nav-pill {
                    border: none;
                    background: transparent;
                    padding: 10px 20px;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .nav-pill:hover {
                    color: var(--text-primary);
                }

                .nav-pill.active {
                    background: #FFFFFF;
                    color: var(--text-primary);
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(30, 58, 66, 0.08);
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
                    background: rgba(20, 184, 166, 0.05);
                    border: 1px solid rgba(20, 184, 166, 0.1);
                    border-radius: 50px;
                }

                .availability-dot {
                    width: 8px;
                    height: 8px;
                    background: #10B981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10B981;
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
                    color: var(--accent-primary);
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
                    background: rgba(30, 58, 66, 0.04);
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                    text-decoration: none;
                }

                .social-btn:hover {
                    background: rgba(30, 58, 66, 0.08);
                    color: var(--text-primary);
                    transform: translateY(-2px);
                }

                .divider-v {
                    width: 1px;
                    height: 24px;
                    background: rgba(30, 58, 66, 0.1);
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
                    box-shadow: 0 4px 12px rgba(30, 58, 66, 0.15);
                }

                .contact-cta:hover {
                    background: var(--accent-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(20, 184, 166, 0.2);
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
        </header>
    )
}

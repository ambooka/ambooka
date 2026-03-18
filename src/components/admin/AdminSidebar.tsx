'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Briefcase,
    Code,
    Target,
    Users,
    FileText,
    PenTool,
    User,
    Settings,
    LogOut
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'

const SIDEBAR_WIDTH = 200

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    ]

    const contentItems = [
        { name: 'Profile & About', icon: User, path: '/admin/profile' },
        { name: 'Projects', icon: Briefcase, path: '/admin/projects' },
        { name: 'Skills', icon: Code, path: '/admin/skills' },
        { name: 'Roadmap', icon: Target, path: '/admin/roadmap' },
        { name: 'Testimonials', icon: Users, path: '/admin/testimonials' },
        { name: 'Resume', icon: FileText, path: '/admin/resume' },
        { name: 'Blog', icon: PenTool, path: '/admin/blog' },
    ]

    const generalItems = [
        { name: 'Settings', icon: Settings, path: '/admin/settings', disabled: true },
    ]

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

    const NavItem = ({ item }: { item: typeof menuItems[0] & { disabled?: boolean } }) => {
        const Icon = item.icon
        const active = isActive(item.path)

        if (item.disabled) {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    marginBottom: 4,
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#94a3b8',
                    opacity: 0.5,
                    cursor: 'not-allowed'
                }}>
                    <Icon size={18} />
                    <span>{item.name}</span>
                </div>
            )
        }

        return (
            <Link
                href={item.path}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    marginBottom: 4,
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: active ? '#0f766e' : '#64748b',
                    background: active ? 'linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(20, 184, 166, 0.08))' : 'transparent',
                    boxShadow: active ? '4px 4px 12px rgba(166, 180, 200, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.9)' : 'none',
                    transition: 'all 200ms'
                }}
            >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span>{item.name}</span>
            </Link>
        )
    }

    return (
        <aside style={{
            width: SIDEBAR_WIDTH,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(226, 232, 240, 0.6)',
            boxShadow: '4px 0 20px rgba(166, 180, 200, 0.15)'
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                    color: 'white', fontWeight: 700, fontSize: 14,
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
                }}>
                    A
                </div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Ambooka</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Admin Panel</div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
                {/* Menu */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 8, paddingLeft: 16 }}>
                        Menu
                    </div>
                    {menuItems.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </div>

                {/* Content */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 8, paddingLeft: 16 }}>
                        Content
                    </div>
                    {contentItems.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </div>

                {/* General */}
                <div>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 8, paddingLeft: 16 }}>
                        General
                    </div>
                    {generalItems.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </div>
            </nav>

            {/* Logout */}
            <div style={{ padding: 12, borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        width: '100%',
                        borderRadius: 12,
                        border: 'none',
                        background: 'transparent',
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#ef4444',
                        cursor: 'pointer'
                    }}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}

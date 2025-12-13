'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    BarChart3,
    Users,
    FileText,
    Code,
    Briefcase,
    PenTool,
    User,
    Settings,
    HelpCircle,
    LogOut,
    FileEdit,
    Github
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    const MenuItem = ({ item, isActive, isDisabled }: any) => {
        const Icon = item.icon

        if (isDisabled) {
            return (
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-slate-400 opacity-40 cursor-not-allowed">
                    <Icon size={18} strokeWidth={2} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-500">
                            {item.badge}
                        </span>
                    )}
                </div>
            )
        }

        return (
            <Link
                href={item.path}
                className={`
                    group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full relative
                    ${isActive
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                `}
            >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-600 rounded-full" />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md transition-colors ${isActive
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}>
                        {item.badge}
                    </span>
                )}
            </Link>
        )
    }

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', enabled: true },
        { name: 'Tasks', icon: CheckSquare, path: '/admin/tasks', badge: '02', enabled: false },
        { name: 'Calendar', icon: Calendar, path: '/admin/calendar', enabled: false },
        { name: 'Analytics', icon: BarChart3, path: '/admin/analytics', enabled: false },
        { name: 'Team', icon: Users, path: '/admin/team', enabled: false },
    ]

    const contentItems = [
        { name: 'About', icon: FileText, path: '/admin/about', enabled: true },
        { name: 'Projects', icon: Briefcase, path: '/admin/projects', enabled: true },
        { name: 'KPI Stats', icon: BarChart3, path: '/admin/kpis', enabled: true },
        { name: 'Testimonials', icon: Users, path: '/admin/testimonials', enabled: true },
        { name: 'Technologies', icon: Code, path: '/admin/technologies', enabled: true },
        { name: 'Social Links', icon: User, path: '/admin/social', enabled: true },
        { name: 'Resume', icon: FileText, path: '/admin/resume', enabled: true },
        { name: 'Skills', icon: Code, path: '/admin/skills', enabled: true },
        { name: 'Blog', icon: PenTool, path: '/admin/blog', enabled: true },
        { name: 'Profile', icon: User, path: '/admin/profile', enabled: true },
        { name: 'Update CV', icon: FileEdit, path: '/admin/update-cv', enabled: true },
    ]

    const generalItems = [
        { name: 'Settings', icon: Settings, path: '/admin/settings', enabled: false },
        { name: 'Help', icon: HelpCircle, path: '/admin/help', enabled: false },
    ]

    return (
        <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-5 border-b border-slate-50">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        A
                    </div>
                    <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                        Ambooka
                    </h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-6">
                {/* MENU Section */}
                <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                        MENU
                    </div>
                    <div className="space-y-0.5">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.path}
                                item={item}
                                isActive={pathname === item.path}
                                isDisabled={!item.enabled}
                            />
                        ))}
                    </div>
                </div>

                {/* CONTENT Section */}
                <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                        CONTENT
                    </div>
                    <div className="space-y-0.5">
                        {contentItems.map((item) => (
                            <MenuItem
                                key={item.path}
                                item={item}
                                isActive={pathname === item.path || pathname.startsWith(item.path + '/')}
                                isDisabled={!item.enabled}
                            />
                        ))}
                    </div>
                </div>

                {/* GENERAL Section */}
                <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                        GENERAL
                    </div>
                    <div className="space-y-0.5">
                        {generalItems.map((item) => (
                            <MenuItem
                                key={item.path}
                                item={item}
                                isActive={pathname === item.path}
                                isDisabled={!item.enabled}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium group"
                >
                    <LogOut size={18} strokeWidth={2} className="transition-transform group-hover:scale-110" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}

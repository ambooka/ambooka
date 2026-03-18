'use client'

import './admin-theme.css'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, Bell, ChevronDown } from 'lucide-react'

// CoachPro Design Tokens
const SIDEBAR_WIDTH = 200
const CONTENT_PADDING = 24
const GAP = 16

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const [userInfo, setUserInfo] = useState({ name: 'Admin' })

    const isLoginPage = pathname === '/admin/login'

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session && !isLoginPage) {
                router.push('/admin/login')
            } else if (session && isLoginPage) {
                router.push('/admin')
            }
            setAuthenticated(!!session)
            setLoading(false)
        }

        checkAuth()

        // Fetch user info
        supabase.from('personal_info').select('full_name').single().then(({ data }) => {
            if (data) setUserInfo({ name: data.full_name })
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session)
            if (!session && !isLoginPage) {
                router.push('/admin/login')
            }
        })

        return () => subscription.unsubscribe()
    }, [isLoginPage, router])

    if (loading) {
        return (
            <div id="admin-portal" style={{
                background: 'linear-gradient(135deg, #e0f2f1 0%, #e8eaf6 50%, #fce4ec 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: 48, height: 48,
                    border: '4px solid #0d9488',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'ad-spin 1s linear infinite'
                }} />
            </div>
        )
    }

    if (isLoginPage) {
        return (
            <div id="admin-portal" style={{
                background: 'linear-gradient(135deg, #e0f2f1 0%, #e8eaf6 50%, #fce4ec 100%)',
                minHeight: '100vh'
            }}>
                {children}
            </div>
        )
    }

    if (!authenticated) return null

    return (
        <div id="admin-portal" style={{
            background: 'linear-gradient(135deg, #e0f2f1 0%, #e8eaf6 50%, #fce4ec 100%)',
            minHeight: '100vh',
            display: 'flex'
        }}>
            {/* Sidebar - Fixed */}
            <div style={{
                position: 'fixed',
                left: 0, top: 0, bottom: 0,
                width: SIDEBAR_WIDTH,
                zIndex: 50
            }}>
                <AdminSidebar />
            </div>

            {/* Main Content Area */}
            <div style={{
                marginLeft: SIDEBAR_WIDTH,
                flex: 1,
                minHeight: '100vh',
                padding: CONTENT_PADDING
            }}>
                {/* Header Row - Integrated into content (like CoachPro) */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: GAP,
                    position: 'absolute',
                    top: CONTENT_PADDING,
                    right: CONTENT_PADDING
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                width: 200,
                                padding: '10px 12px 10px 38px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid rgba(203, 213, 225, 0.6)',
                                borderRadius: 12,
                                fontSize: 13,
                                color: '#1e293b',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Bell */}
                    <button style={{
                        width: 40, height: 40,
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: 'none', cursor: 'pointer',
                        color: '#475569'
                    }}>
                        <Bell size={18} />
                    </button>

                    {/* User */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 12px 6px 6px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 12
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 600, fontSize: 13
                        }}>
                            {userInfo.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{userInfo.name}</span>
                        <ChevronDown size={14} style={{ color: '#94a3b8' }} />
                    </div>
                </div>

                {/* Page Content */}
                <div style={{ paddingTop: 0 }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

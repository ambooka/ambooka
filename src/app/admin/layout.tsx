'use client'

import './admin-theme.css'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'

// CoachPro Design Tokens
const SIDEBAR_WIDTH = 232
const CONTENT_PADDING = 28

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
    const pageTitle = (() => {
        const segment = pathname.split('/').filter(Boolean)[1]
        if (!segment) return 'Dashboard'
        return segment
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
    })()

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
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 52%, #ecfeff 100%)',
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
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 52%, #ecfeff 100%)',
                minHeight: '100vh'
            }}>
                {children}
            </div>
        )
    }

    if (!authenticated) return null

    return (
        <div id="admin-portal" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 52%, #ecfeff 100%)',
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
                padding: CONTENT_PADDING,
                color: '#0f172a'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 24,
                    padding: '14px 16px',
                    border: '1px solid rgba(203, 213, 225, 0.72)',
                    borderRadius: 20,
                    background: 'rgba(255, 255, 255, 0.78)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)'
                }}>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f766e' }}>
                            Portfolio CMS
                        </p>
                        <h1 style={{ marginTop: 2, fontSize: 22, fontWeight: 850, letterSpacing: '-0.03em', color: '#0f172a' }}>
                            {pageTitle}
                        </h1>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                minHeight: 40,
                                padding: '0 14px',
                                borderRadius: 12,
                                background: '#0f172a',
                                color: 'white',
                                fontSize: 13,
                                fontWeight: 800,
                                textDecoration: 'none',
                            }}
                        >
                            Public Site <ExternalLink size={15} />
                        </a>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 600, fontSize: 13
                        }}>
                            {userInfo.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{userInfo.name}</span>
                    </div>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

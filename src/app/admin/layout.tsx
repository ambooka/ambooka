'use client'

import './admin.css'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (isLoginPage) {
        return <div className="min-h-screen bg-slate-50">{children}</div>
    }

    if (!authenticated) {
        return null
    }

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

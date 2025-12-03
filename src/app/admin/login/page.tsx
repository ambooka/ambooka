'use client'

import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/admin')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-md w-full rounded-xl shadow-lg p-8 border transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--utility-btn-hover-bg)' }}>
                        <Lock className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Login</h1>
                    <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Sign in to manage your portfolio</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 border rounded-lg text-sm" style={{ backgroundColor: 'var(--utility-btn-hover-bg)', borderColor: 'var(--accent-error)', color: 'var(--accent-error)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                        style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

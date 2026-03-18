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
        } catch (err: unknown) {
            setError((err as Error).message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'var(--ad-gradient-bg)' }}
        >
            <div
                className="max-w-md w-full p-8 ad-card"
                style={{ boxShadow: 'var(--ad-shadow-neu-lg)' }}
            >
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                        style={{
                            background: 'linear-gradient(135deg, var(--ad-primary-500), var(--ad-primary-700))',
                            boxShadow: '0 8px 20px rgba(13, 148, 136, 0.3)'
                        }}
                    >
                        <Lock style={{ color: 'white' }} size={28} />
                    </div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: 'var(--ad-text-primary)' }}
                    >
                        Admin Login
                    </h1>
                    <p
                        className="mt-2 text-sm"
                        style={{ color: 'var(--ad-text-tertiary)' }}
                    >
                        Sign in to manage your portfolio
                    </p>
                </div>

                {error && (
                    <div
                        className="mb-6 p-4 rounded-xl text-sm"
                        style={{
                            background: 'var(--ad-danger-50)',
                            border: '1px solid var(--ad-danger)',
                            color: 'var(--ad-danger-600)'
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label
                            className="block text-xs font-semibold uppercase mb-2"
                            style={{ color: 'var(--ad-text-tertiary)' }}
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="ad-input"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label
                            className="block text-xs font-semibold uppercase mb-2"
                            style={{ color: 'var(--ad-text-tertiary)' }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="ad-input"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="ad-btn ad-btn-primary w-full py-3.5"
                        style={{ fontSize: '15px' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

'use client'

import { Search, Bell, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    title: string
    type: string
}

export default function AdminHeader() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [showResults, setShowResults] = useState(false)
    const [userInfo, setUserInfo] = useState({ name: 'Admin', email: '' })

    useEffect(() => {
        fetchUserInfo()
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length > 2) {
                performSearch()
            } else {
                setSearchResults([])
                setShowResults(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery])

    const fetchUserInfo = async () => {
        const { data } = await supabase.from('personal_info').select('full_name, email').single()
        if (data) {
            setUserInfo({ name: data.full_name, email: data.email })
        }
    }

    const performSearch = async () => {
        const { data: projectsData } = await supabase
            .from('projects')
            .select('id, title')
            .ilike('title', `%${searchQuery}%`)
            .limit(5)

        const results: SearchResult[] = []
        if (projectsData) {
            projectsData.forEach(p => results.push({ id: p.id, title: p.title, type: 'project' }))
        }

        if (results.length > 0) {
            setSearchResults(results)
            setShowResults(true)
        } else {
            setSearchResults([])
            setShowResults(false)
        }
    }

    const handleResultClick = (_result: SearchResult) => {
        setShowResults(false)
        setSearchQuery('')
        router.push(`/admin/projects`)
    }

    return (
        <header style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
            {/* Search */}
            <div style={{ position: 'relative', width: 280 }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 38px',
                            background: 'rgba(241, 245, 249, 0.8)',
                            border: '1px solid rgba(203, 213, 225, 0.6)',
                            borderRadius: 12,
                            fontSize: 13,
                            color: '#1e293b',
                            outline: 'none',
                            boxShadow: 'inset 2px 2px 5px rgba(166, 180, 200, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.7)'
                        }}
                    />
                </div>

                {showResults && searchResults.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: 8,
                        padding: 8,
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 12,
                        boxShadow: '6px 6px 14px rgba(166, 180, 200, 0.25), -6px -6px 14px rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        zIndex: 50
                    }}>
                        {searchResults.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => handleResultClick(result)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: 'transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: 13
                                }}
                            >
                                <span style={{ fontWeight: 500, color: '#1e293b' }}>{result.title}</span>
                                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a' }}>
                                    {result.type}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Bell */}
                <button style={{
                    position: 'relative',
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '4px 4px 10px rgba(166, 180, 200, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.9)',
                    color: '#475569'
                }}>
                    <Bell size={18} />
                    <span style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#ef4444',
                        border: '2px solid white'
                    }} />
                </button>

                {/* User */}
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 10px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    boxShadow: '4px 4px 10px rgba(166, 180, 200, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.9)'
                }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 13
                    }}>
                        {userInfo.name.charAt(0)}
                    </div>
                    <ChevronDown size={14} style={{ color: '#94a3b8' }} />
                </button>
            </div>
        </header>
    )
}

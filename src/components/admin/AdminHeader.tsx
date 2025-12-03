'use client'

import { Search, Bell, Mail, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    title: string
    category: string
}

export default function AdminHeader() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [showResults, setShowResults] = useState(false)
    const [userInfo, setUserInfo] = useState({ name: 'Admin User', email: 'admin@ambooka.com' })

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
            setUserInfo({
                name: data.full_name,
                email: data.email
            })
        }
    }

    const performSearch = async () => {
        const { data } = await supabase
            .from('portfolio_content')
            .select('id, title, category')
            .ilike('title', `%${searchQuery}%`)
            .limit(5)

        if (data && data.length > 0) {
            setSearchResults(data)
            setShowResults(true)
        } else {
            setSearchResults([])
            setShowResults(false)
        }
    }

    const handleResultClick = (result: SearchResult) => {
        setShowResults(false)
        setSearchQuery('')
        if (result.category === 'project') {
            router.push(`/admin/projects/${result.id}`)
        } else if (result.category === 'blog') {
            router.push(`/admin/blog/${result.id}`)
        }
    }

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Search Bar */}
            <div className="relative w-96">
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search projects, blog posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-400">
                        ⌘K
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-20">
                        {searchResults.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => handleResultClick(result)}
                                className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center justify-between group border-b border-slate-50 last:border-0 transition-colors"
                            >
                                <span className="text-sm font-medium text-slate-900 group-hover:text-violet-600 transition-colors">{result.title}</span>
                                <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-md">{result.category}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    {/* Mail Icon */}
                    <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                        <Mail size={18} />
                    </button>

                    {/* Notification Bell */}
                    <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200"></div>

                {/* User Profile */}
                <button className="flex items-center gap-2.5 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {userInfo.name.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                        <div className="text-sm font-semibold text-slate-900 leading-tight">
                            {userInfo.name}
                        </div>
                        <div className="text-xs text-slate-500 leading-tight">
                            Admin
                        </div>
                    </div>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
            </div>
        </header>
    )
}


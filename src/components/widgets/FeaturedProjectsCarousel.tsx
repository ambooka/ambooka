'use client'

import { useState, useEffect, useRef } from 'react'
import { GitHubService } from '@/services/github'
import { ChevronLeft, ChevronRight, Star, ExternalLink, Github, Sparkles, FolderIcon } from 'lucide-react'

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

interface FeaturedProject {
    id: number
    name: string
    description: string
    language: string
    stars: number
    url: string
    homepage: string | null
}

interface FeaturedProjectsCarouselProps {
    compact?: boolean
}

export default function FeaturedProjectsCarousel({ compact = false }: FeaturedProjectsCarouselProps) {
    const [projects, setProjects] = useState<FeaturedProject[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        (async () => {
            try {
                const githubService = new GitHubService(GITHUB_TOKEN)
                const repos = await githubService.getRepositories(GITHUB_USERNAME, {
                    maxRepos: 100,
                    sortBy: 'updated',
                    includePrivate: Boolean(GITHUB_TOKEN)
                })

                const featured = repos
                    .filter(r => r.stargazers_count >= 1 || r.homepage)
                    .sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, 8)
                    .map(r => ({
                        id: r.id,
                        name: r.name,
                        description: r.description || 'No description',
                        language: r.language || 'Other',
                        stars: r.stargazers_count,
                        url: r.html_url,
                        homepage: r.homepage || null
                    }))

                setProjects(featured)
            } catch (e) {
                console.error('Failed to fetch featured projects:', e)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    useEffect(() => {
        if (isPaused || projects.length <= 1) return
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % projects.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [isPaused, projects.length])

    const goToSlide = (index: number) => setCurrentIndex(index)
    const goNext = () => setCurrentIndex(prev => (prev + 1) % projects.length)
    const goPrev = () => setCurrentIndex(prev => (prev - 1 + projects.length) % projects.length)

    if (loading) return <div className="glass-card p-12 animate-pulse text-center font-black text-[var(--text-tertiary)] uppercase tracking-widest">Compiling Featured Work...</div>

    return (
        <div
            className={`projects-widget glass-card group/main h-full ${compact ? 'p-3' : 'p-4'}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className={`flex justify-between items-center ${compact ? 'mb-2' : 'mb-4'}`}>
                <div className="flex items-center gap-2">
                    <div className={`${compact ? 'h-6 w-6' : 'h-7 w-7'} rounded-lg bg-[var(--accent-secondary)]/10 flex items-center justify-center text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/20 shadow-sm`}>
                        <Sparkles size={compact ? 12 : 14} />
                    </div>
                    <div>
                        <h2 className={`${compact ? 'text-xs' : 'text-sm'} font-black text-[var(--text-primary)] tracking-tight uppercase`}>Featured Projects</h2>
                        {!compact && <p className="text-[7px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest mt-0.5">Production Ready Solutions</p>}
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <button onClick={goPrev} className={`${compact ? 'w-6 h-6' : 'w-7 h-7'} rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-white hover:border-[var(--accent-primary)] transition-all active:scale-95 shadow-sm`}>
                        <ChevronLeft size={compact ? 12 : 14} />
                    </button>
                    <button onClick={goNext} className={`${compact ? 'w-6 h-6' : 'w-7 h-7'} rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-white hover:border-[var(--accent-primary)] transition-all active:scale-95 shadow-sm`}>
                        <ChevronRight size={compact ? 12 : 14} />
                    </button>
                </div>
            </div>

            <div className={`relative overflow-hidden rounded-xl ${compact ? 'h-[120px]' : 'h-[280px]'}`}>
                <div
                    className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {projects.map((project) => (
                        <div key={project.id} className="w-full shrink-0 px-1">
                            <div className="h-full bg-gradient-to-br from-[var(--bg-primary)]/40 to-[var(--bg-secondary)]/80 rounded-xl p-3 md:p-4 border border-[var(--border-light)] shadow-sm relative overflow-hidden group">
                                {/* Decorative Background Icon */}
                                <FolderIcon className="absolute -right-6 -bottom-6 w-28 h-28 text-[var(--text-primary)] opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />

                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase tracking-widest text-[var(--accent-primary)] mb-0.5">{project.language}</span>
                                            <h4 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight">{project.name}</h4>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] text-[8px] font-black text-[var(--text-secondary)]">
                                                <Star size={9} className="text-yellow-500" />
                                                {project.stars}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mb-4 flex-1 line-clamp-3 font-medium opacity-80">{project.description}</p>

                                    <div className="flex gap-2">
                                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-1.5 rounded-full bg-black text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-[var(--accent-primary)] transition-colors shadow-lg">
                                            <Github size={11} /> Repository
                                        </a>
                                        {project.homepage && (
                                            <a href={project.homepage} target="_blank" rel="noopener noreferrer"
                                                className="w-7 h-7 rounded-full border border-[var(--border-light)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-all">
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                {projects.map((_, i) => (
                    <button
                        key={i}
                        className={`transition-all duration-500 rounded-full h-1.5 ${i === currentIndex ? 'w-8 bg-[var(--accent-primary)]' : 'w-1.5 bg-[var(--border-light)]'}`}
                        onClick={() => goToSlide(i)}
                    />
                ))}
            </div>
        </div>
    )
}

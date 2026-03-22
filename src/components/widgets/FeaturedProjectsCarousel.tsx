'use client'

import { useState, useEffect } from 'react'
import { GitHubService } from '@/services/github'
import { ChevronLeft, ChevronRight, Star, ExternalLink, Github, Sparkles, FolderIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    embedded?: boolean
}

export default function FeaturedProjectsCarousel({ compact = false, embedded = false }: FeaturedProjectsCarouselProps) {
    const [projects, setProjects] = useState<FeaturedProject[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const embeddedCompact = embedded && compact

    useEffect(() => {
        ; (async () => {
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

    if (loading) {
        return (
            <div className={cn(
                "animate-pulse text-center font-black text-[hsl(var(--muted-foreground))] uppercase tracking-widest flex items-center justify-center min-h-[160px]",
                embedded ? "rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.5] p-6" : "rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] backdrop-blur-xl p-12 shadow-sm"
            )}>
                Compiling Featured Work...
            </div>
        )
    }

    if (projects.length === 0) return null

    return (
        <div
            className={cn(
                "group/main h-full",
                !embedded && "rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] backdrop-blur-xl shadow-sm",
                compact ? "p-3" : "p-5 md:p-6"
            )}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className={cn("flex justify-between items-center", compact ? "mb-3" : "mb-5")}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "rounded-xl bg-[hsl(var(--accent))/0.1] flex items-center justify-center text-[hsl(var(--accent))] border border-[hsl(var(--accent))/0.2] shadow-sm",
                        embeddedCompact ? "h-8 w-8" : compact ? "h-7 w-7" : "h-10 w-10"
                    )}>
                        <Sparkles size={embeddedCompact || compact ? 14 : 18} />
                    </div>
                    <div>
                        <h2 className={cn(
                            "font-black text-[hsl(var(--foreground))] tracking-tight",
                            embeddedCompact || compact ? "text-sm uppercase tracking-widest" : "text-base sm:text-lg"
                        )}>
                            {embeddedCompact || compact ? 'Featured' : 'Featured Projects'}
                        </h2>
                        {!compact && <p className="text-[11px] font-[900] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))] mt-0.5">Production-ready work</p>}
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <button onClick={goPrev} className={cn(
                        "rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-white hover:border-[hsl(var(--accent))] transition-all active:scale-95 shadow-sm",
                        embeddedCompact || compact ? "w-7 h-7" : "w-9 h-9"
                    )}>
                        <ChevronLeft size={embeddedCompact || compact ? 14 : 18} />
                    </button>
                    <button onClick={goNext} className={cn(
                        "rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-white hover:border-[hsl(var(--accent))] transition-all active:scale-95 shadow-sm",
                        embeddedCompact || compact ? "w-7 h-7" : "w-9 h-9"
                    )}>
                        <ChevronRight size={embeddedCompact || compact ? 14 : 18} />
                    </button>
                </div>
            </div>

            <div className={cn("relative overflow-hidden rounded-2xl",
                compact ? (embedded ? "h-[182px] sm:h-[196px]" : "h-[120px]") : "h-[280px]"
            )}>
                <div
                    className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {projects.map((project) => (
                        <div key={project.id} className="w-full shrink-0 px-1 py-1">
                            <div className={cn(
                                "h-full bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-white/5",
                                "rounded-[20px] border border-[hsl(var(--border))] shadow-[0_2px_10px_rgba(0,0,0,0.02)]",
                                "relative overflow-hidden group/card hover:border-[hsl(var(--accent))/0.3] transition-colors",
                                embeddedCompact ? "p-4" : "p-4 md:p-6"
                            )}>
                                {/* Decorative Background Icon */}
                                <FolderIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-[hsl(var(--foreground))] opacity-[0.03] group-hover/card:scale-110 group-hover/card:rotate-[-5deg] transition-all duration-700" />

                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "font-black uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-1.5",
                                                embeddedCompact || compact ? "text-[8px]" : "text-[10px]"
                                            )}>
                                                {project.language}
                                            </span>
                                            <h4 className={cn(
                                                "font-black text-[hsl(var(--foreground))] tracking-tight line-clamp-1",
                                                embeddedCompact ? "text-lg" : compact ? "text-base" : "text-xl sm:text-2xl"
                                            )}>
                                                {project.name}
                                            </h4>
                                        </div>
                                        <div className="flex gap-1.5 shrink-0 ml-3">
                                            <div className={cn(
                                                "flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-black/40 border border-[hsl(var(--border))]/50 font-black text-[hsl(var(--foreground))] shadow-sm",
                                                embeddedCompact || compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
                                            )}>
                                                <Star size={embeddedCompact || compact ? 12 : 14} className="text-[#fbbf24] fill-[#fbbf24]" />
                                                {project.stars}
                                            </div>
                                        </div>
                                    </div>

                                    <p className={cn(
                                        "text-[hsl(var(--muted-foreground))] leading-relaxed flex-1 font-medium",
                                        embeddedCompact || compact ? "text-xs line-clamp-3 mb-3" : "text-sm sm:text-[0.95rem] line-clamp-3 mb-5"
                                    )}>
                                        {project.description}
                                    </p>

                                    <div className="flex gap-2">
                                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                                            className={cn(
                                                "rounded-full  text-[hsl(var(--background))] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-[hsl(var(--accent))] hover:scale-[1.02] shadow-md",
                                                embeddedCompact || compact ? "px-3 py-2 text-[9px]" : "px-4 py-2.5 text-[10px]"
                                            )}>
                                            <Github size={embeddedCompact || compact ? 13 : 15} /> Repository
                                        </a>
                                        {project.homepage && (
                                            <a href={project.homepage} target="_blank" rel="noopener noreferrer"
                                                className={cn(
                                                    "rounded-full border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--foreground))] hover:text-white hover:bg-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] shadow-sm transition-all hover:scale-[1.02] bg-white/50 dark:bg-black/20",
                                                    embeddedCompact || compact ? "w-8 h-8" : "w-9 h-9"
                                                )}>
                                                <ExternalLink size={embeddedCompact || compact ? 14 : 15} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-4">
                {projects.map((_, i) => (
                    <button
                        key={i}
                        className={cn(
                            "transition-all duration-500 rounded-full h-1.5",
                            i === currentIndex ? "w-6 bg-[hsl(var(--accent))]" : "w-1.5 bg-[hsl(var(--border))] hover:bg-[hsl(var(--muted-foreground))]/50"
                        )}
                        onClick={() => goToSlide(i)}
                    />
                ))}
            </div>
        </div>
    )
}

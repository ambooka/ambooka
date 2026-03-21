'use client'

<<<<<<< HEAD
import { type CSSProperties, useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Code2, Github, Globe, Star, Users } from 'lucide-react'
import { GitHubService } from '@/services/github'
import FeaturedProjectsCarousel from '@/components/widgets/FeaturedProjectsCarousel'
import { cn } from '@/lib/utils'

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
=======
import { useState, useEffect } from 'react'
import { GitHubService } from '@/services/github'
import { Github, Star, Users, GitCommit } from 'lucide-react'
import Image from 'next/image'

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

interface LanguageData {
    name: string
    count: number
    color: string
    logo?: string
}

interface GitHubStats {
    totalRepos: number
    totalStars: number
    followers: number
    publicRepos: number
    topLanguages: LanguageData[]
}

<<<<<<< HEAD
const EMPTY_STATS: GitHubStats = {
    totalRepos: 0,
    totalStars: 0,
    followers: 0,
    publicRepos: 0,
    topLanguages: []
}

=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
// Language logos
const LANGUAGE_CONFIG: Record<string, { color: string; logo?: string }> = {
    TypeScript: { color: '#3178c6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    JavaScript: { color: '#f7df1e', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    Python: { color: '#3776ab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    Go: { color: '#00add8', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg' },
    Java: { color: '#ed8b00', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    'C++': { color: '#00599c', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    'C#': { color: '#239120', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    Shell: { color: '#89e051', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg' },
    Dockerfile: { color: '#2496ed', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    HCL: { color: '#7b42bc', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
    HTML: { color: '#e34c26', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    CSS: { color: '#663399', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    Vue: { color: '#42b883', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    Rust: { color: '#dea584' },
    Ruby: { color: '#cc342d', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
    PHP: { color: '#777bb4', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    Kotlin: { color: '#7f52ff', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
    Swift: { color: '#f05138', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
    Dart: { color: '#00b4ab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
    Other: { color: '#6b7280' }
}

interface GitHubStatsWidgetProps {
    fullWidth?: boolean
    compact?: boolean
    initialStats?: GitHubStats
}

<<<<<<< HEAD
const formatNumber = (value: number) => NUMBER_FORMATTER.format(value)

export default function GitHubStatsWidget({ fullWidth = false, compact = false, initialStats }: GitHubStatsWidgetProps) {
    const [stats, setStats] = useState<GitHubStats>(initialStats || EMPTY_STATS)
=======
export default function GitHubStatsWidget({ fullWidth = false, compact = false, initialStats }: GitHubStatsWidgetProps) {
    const [stats, setStats] = useState<GitHubStats>(initialStats || {
        totalRepos: 0,
        totalStars: 0,
        followers: 0,
        publicRepos: 0,
        topLanguages: []
    })
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
    const [loading, setLoading] = useState(!initialStats)

    useEffect(() => {
        if (initialStats) return
<<<<<<< HEAD

        ;(async () => {
=======
        (async () => {
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            try {
                const githubService = new GitHubService(GITHUB_TOKEN)
                const repos = await githubService.getRepositories(GITHUB_USERNAME, {
                    maxRepos: 100,
                    sortBy: 'updated',
                    includePrivate: Boolean(GITHUB_TOKEN)
                })

                const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
<<<<<<< HEAD
                const publicRepos = repos.filter(repo => !repo.private).length
=======
                const publicRepos = repos.filter(r => !r.private).length
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

                const langCounts: Record<string, number> = {}
                repos.forEach(repo => {
                    const lang = repo.language || 'Other'
                    langCounts[lang] = (langCounts[lang] || 0) + 1
                })

                const topLanguages = Object.entries(langCounts)
                    .filter(([name]) => name !== 'Other')
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([name, count]) => ({
                        name,
                        count,
                        color: LANGUAGE_CONFIG[name]?.color || '#6b7280',
                        logo: LANGUAGE_CONFIG[name]?.logo
                    }))

                let followers = 0
                try {
                    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
                        headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}
                    })
                    if (userRes.ok) {
                        const userData = await userRes.json()
                        followers = userData.followers || 0
                    }
<<<<<<< HEAD
                } catch (error) {
                    console.error('Failed to fetch user profile:', error)
                }

                setStats({ totalRepos: repos.length, totalStars, followers, publicRepos, topLanguages })
            } catch (error) {
                console.error('Failed to fetch GitHub stats:', error)
=======
                } catch (e) {
                    console.error('Failed to fetch user profile:', e)
                }

                setStats({ totalRepos: repos.length, totalStars, followers, publicRepos, topLanguages })
            } catch (e) {
                console.error('Failed to fetch GitHub stats:', e)
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            } finally {
                setLoading(false)
            }
        })()
    }, [initialStats])

<<<<<<< HEAD
    const publicShare = stats.totalRepos > 0 ? Math.round((stats.publicRepos / stats.totalRepos) * 100) : 0
    const visibleLanguages = stats.topLanguages.slice(0, compact ? 5 : 6)

    const statCards = [
        {
            label: 'Repositories',
            value: formatNumber(stats.totalRepos),
            unit: 'repos',
            meta: `${stats.publicRepos} public`,
            accentStrong: '#14B8A6',
            accentSoft: 'rgba(20, 184, 166, 0.18)',
            Icon: Code2
        },
        {
            label: 'Stars',
            value: formatNumber(stats.totalStars),
            unit: 'total',
            meta: 'Community signal',
            accentStrong: '#F59E0B',
            accentSoft: 'rgba(245, 158, 11, 0.18)',
            Icon: Star
        },
        {
            label: 'Followers',
            value: formatNumber(stats.followers),
            unit: 'people',
            meta: 'Watching updates',
            accentStrong: '#0891B2',
            accentSoft: 'rgba(8, 145, 178, 0.18)',
            Icon: Users
        },
        {
            label: 'Open Share',
            value: `${publicShare}%`,
            unit: 'public',
            meta: `${stats.publicRepos}/${stats.totalRepos} visible`,
            accentStrong: '#7C3AED',
            accentSoft: 'rgba(124, 58, 237, 0.18)',
            Icon: Globe
        }
    ]

    if (loading) {
        return (
            <div className={cn(
                "w-full relative overflow-hidden rounded-[24px] p-[clamp(0.9rem,1.8vw,1.3rem)] border border-[hsl(var(--accent))/0.18] shadow-[0_14px_30px_rgba(15,23,42,0.08)]",
                "bg-gradient-to-b from-white/70 to-white/40 dark:from-slate-900/90 dark:to-slate-900/95 transition-colors",
                compact && "p-3",
                fullWidth && "max-w-none"
            )}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[hsl(var(--accent))/0.16] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] text-[0.62rem] font-[800] tracking-widest uppercase">
                            GitHub Pulse V2
                        </span>
                        <div className="flex items-start gap-3 mt-2.5">
                            <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl border border-[hsl(var(--accent))/0.16] bg-gradient-to-br from-[hsl(var(--accent))/0.18] to-cyan-600/10 text-[hsl(var(--accent))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                                <Github size={18} />
                            </span>
                            <div>
                                <h3 className="m-0 text-[clamp(1rem,1.6vw,1.24rem)] font-[800] tracking-[-0.02em] leading-tight text-[hsl(var(--foreground))]">
                                    GitHub Activity
                                </h3>
                                <p className="m-0 mt-1 max-w-[56ch] text-[0.83rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                                    Loading repositories, contribution graph, and language mix.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex flex-col gap-3 min-h-[114px] p-3 rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-b from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-sm">
                            <span className="block w-[42%] h-3 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <span className="block w-[64%] h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <span className="block w-[86%] h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        </div>
                    ))}
                </div>
=======
    if (loading) {
        return (
            <div className={`github-stats-widget ${fullWidth ? 'github-fullwidth' : ''}`}>
                <div className="widget-header"><Github size={16} /><span>GitHub Activity</span></div>
                <div className="loading-placeholder">Loading...</div>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            </div>
        )
    }

    return (
<<<<<<< HEAD
        <div className={cn(
            "@container w-full relative overflow-hidden rounded-[24px] p-[clamp(0.9rem,1.8vw,1.3rem)] border border-[hsl(var(--accent))/0.18] shadow-[0_14px_30px_rgba(15,23,42,0.08)]",
            "bg-gradient-to-b from-white/70 to-white/40 dark:from-slate-900/90 dark:to-slate-900/95 transition-colors",
            compact && "p-3",
            fullWidth && "max-w-none"
        )}>
            {/* Background noise/glow decorations */}
            <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--accent)/0.15),transparent_24%),radial-gradient(circle_at_100%_4%,cyan/10,transparent_22%)]" />

            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[hsl(var(--accent))/0.16] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] text-[0.62rem] font-[800] tracking-widest uppercase">
                        GitHub Pulse V2
                    </span>
                    <div className="flex items-start gap-3 mt-2.5">
                        <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl border border-[hsl(var(--accent))/0.16] bg-gradient-to-br from-[hsl(var(--accent))/0.18] to-cyan-600/10 text-[hsl(var(--accent))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                            <Github size={18} />
                        </span>
                        <div>
                            <h3 className="m-0 text-[clamp(1rem,1.6vw,1.24rem)] font-[800] tracking-[-0.02em] leading-tight text-[hsl(var(--foreground))]">
                                GitHub Activity
                            </h3>
                            <p className="m-0 mt-1 max-w-[56ch] text-[0.83rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                                Clean snapshot of repository output, contribution rhythm, and active stack.
                            </p>
                        </div>
                    </div>
                </div>

=======
        <div className={`github-stats-widget ${compact ? 'github-compact' : ''} ${fullWidth ? 'github-fullwidth' : ''}`}>
            {/* Header */}
            <div className="github-header px-1 md:px-0">
                <div className="github-title">
                    <Github size={18} />
                    <span>GitHub Activity</span>
                </div>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
<<<<<<< HEAD
                    className="inline-flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto gap-1.5 px-3.5 py-2 rounded-full border border-[hsl(var(--border))] bg-white/60 dark:bg-white/10 text-[0.82rem] font-bold text-[hsl(var(--foreground))] no-underline shadow-sm transition-all hover:-translate-y-px hover:border-[hsl(var(--accent))/0.28] hover:text-[hsl(var(--accent))]"
                >
                    <span>@{GITHUB_USERNAME}</span>
                    <ArrowUpRight size={14} className="hidden sm:block" />
                </a>
            </div>

            <div className="grid grid-cols-2 @[56rem]:grid-cols-4 gap-3">
                {statCards.map(item => (
                    <article
                        key={item.label}
                        className={cn(
                            "relative overflow-hidden rounded-2xl p-3 border border-[hsl(var(--border))] bg-gradient-to-b from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-sm",
                            compact ? "min-h-[106px]" : "min-h-[114px]"
                        )}
                        style={{ '--card-accent': item.accentStrong, '--card-glow': item.accentSoft } as CSSProperties}
                    >
                        <div 
                            className="absolute left-0 top-0 bottom-0 w-[3px]"
                            style={{ background: `linear-gradient(180deg, var(--card-accent), transparent 82%)` }} 
                        />
                        <div 
                            className="absolute -top-6 -right-4 w-20 h-20 rounded-full pointer-events-none blur-md"
                            style={{ background: `var(--card-glow)` }}
                        />

                        <div className="flex items-start justify-between gap-2.5">
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-[0.7rem] font-[800] tracking-widest uppercase text-[hsl(var(--foreground))]">
                                    {item.label}
                                </span>
                                <span className="text-[0.74rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                                    {item.meta}
                                </span>
                            </div>
                            <span 
                                className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]"
                                style={{ color: `var(--card-accent)` }}
                            >
                                <item.Icon size={18} />
                            </span>
                        </div>

                        <div className="flex items-end gap-1.5 mt-3.5">
                            <span className="text-[clamp(1.28rem,7vw,1.72rem)] sm:text-[clamp(1.35rem,3.1vw,2rem)] font-[800] tracking-[-0.04em] leading-none text-[hsl(var(--foreground))]">
                                {item.value}
                            </span>
                            <span className="pb-0.5 text-[0.7rem] font-semibold tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
                                {item.unit}
                            </span>
                        </div>
                    </article>
                ))}
            </div>

            <div className="grid grid-cols-1 @[66rem]:grid-cols-[minmax(0,1.42fr)_minmax(16rem,0.92fr)] gap-3 mt-3 items-start">
                <div className="grid grid-cols-1 gap-3 order-1 min-w-0">
                    {/* Graph Panel */}
                    <section className="p-3 rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-b from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-sm min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                            <div className="min-w-0">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-[hsl(var(--accent))/0.16] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] text-[0.62rem] font-[800] tracking-widest uppercase mb-1">
                                    Past 12 months
                                </span>
                                <h4 className="m-0 text-[0.95rem] font-bold tracking-tight text-[hsl(var(--foreground))]">
                                    Contribution Heatmap
                                </h4>
                            </div>
                            <span className="self-start sm:self-auto inline-flex items-center justify-center px-2.5 py-1 rounded-full border border-[hsl(var(--border))] bg-white/60 dark:bg-white/10 text-[0.7rem] font-bold text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                                {stats.totalRepos} repos tracked
                            </span>
                        </div>

                        <div className="mt-3 rounded-[14px] border border-[hsl(var(--accent))/0.14] bg-gradient-to-b from-slate-900/5 to-slate-900/[0.01] dark:from-white/5 dark:to-white/[0.01] overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.08),transparent_30%)]">
                            <div className="overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-[hsl(var(--accent))/0.28] scrollbar-track-transparent">
                                <Image
                                    src={`https://ghchart.rshah.org/14B8A6/${GITHUB_USERNAME}`}
                                    alt="GitHub contribution graph"
                                    className="block max-w-none w-max sm:w-[560px] md:w-full h-auto brightness-[0.8] contrast-125 mix-blend-multiply dark:brightness-100 dark:contrast-100 dark:mix-blend-normal opacity-90"
                                    width={820}
                                    height={128}
                                    unoptimized
                                />
                            </div>
                        </div>
                    </section>

                    {/* Featured Panel */}
                    <section className="p-2 sm:p-3 rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-b from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-sm">
                        <FeaturedProjectsCarousel compact embedded />
                    </section>
                </div>

                {/* Language Panel */}
                <section className="order-2 p-3 rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-b from-white/60 to-white/30 dark:from-[hsl(var(--accent))/0.1] dark:to-white/5 backdrop-blur-md shadow-sm min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                        <div className="min-w-0">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-[hsl(var(--accent))/0.16] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] text-[0.62rem] font-[800] tracking-widest uppercase mb-1">
                                Stack profile
                            </span>
                            <h4 className="m-0 text-[0.95rem] font-bold tracking-tight text-[hsl(var(--foreground))]">
                                Language Mix
                            </h4>
                        </div>
                        <span className="self-start sm:self-auto inline-flex items-center justify-center px-2.5 py-1 rounded-full border border-[hsl(var(--border))] bg-white/60 dark:bg-white/10 text-[0.7rem] font-bold text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                            {visibleLanguages.length} active
                        </span>
                    </div>

                    {visibleLanguages.length > 0 ? (
                        <div className="grid grid-cols-1 @[56rem]:grid-cols-2 @[66rem]:grid-cols-1 gap-2 mt-3">
                            {visibleLanguages.map((language, index) => (
                                <div
                                    key={language.name}
                                    className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto] items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-[hsl(var(--border))] bg-white/60 dark:bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                    style={{ '--language-accent': language.color } as CSSProperties}
                                >
                                    <span 
                                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.55)] dark:shadow-[0_0_0_3px_rgba(0,0,0,0.2)]"
                                        style={{ background: 'var(--language-accent)' }}
                                    />
                                    
                                    {language.logo ? (
                                        <span className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-white/70 dark:bg-white/10 border border-white/40 dark:border-white/5 overflow-hidden">
                                            <Image
                                                src={language.logo}
                                                alt={`${language.name} logo`}
                                                width={18}
                                                height={18}
                                            />
                                        </span>
                                    ) : (
                                        <span className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-white/70 dark:bg-white/10 border border-white/40 dark:border-white/5 overflow-hidden text-[0.78rem] font-bold text-[hsl(var(--foreground))]">
                                            {language.name.slice(0, 1)}
                                        </span>
                                    )}

                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[0.82rem] font-bold text-[hsl(var(--foreground))] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {language.name}
                                        </span>
                                        <span className="text-[0.72rem] text-[hsl(var(--muted-foreground))]">
                                            {language.count} repos
                                        </span>
                                    </div>

                                    <span className="inline-flex items-center justify-center px-2 py-1 min-w-[2rem] rounded-full bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] text-[0.68rem] font-bold sm:col-auto col-start-2 justify-self-start sm:justify-self-auto">
                                        #{index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-3 p-3.5 rounded-xl border border-dashed border-[hsl(var(--accent))/0.24] bg-[hsl(var(--accent))/0.06] text-[0.8rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                            Language data will appear here once GitHub stats are available.
                        </div>
                    )}
                </section>
            </div>
=======
                    className="github-profile-link"
                >
                    @{GITHUB_USERNAME}
                </a>
            </div>

            {/* Stats Cards Grid - With meaningful graphics */}
            <div className="stats-cards-grid">
                {/* Repos Card - with folder stack graphic */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <Github size={14} />
                        <span>Repositories</span>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-card-value">
                            <span className="big-num">{stats.totalRepos}</span>
                            <span className="unit">repos</span>
                        </div>
                        <div className="folder-stack">
                            <div className="folder f1" />
                            <div className="folder f2" />
                            <div className="folder f3" />
                        </div>
                    </div>
                </div>

                {/* Stars Card - with actual star icons */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <Star size={14} />
                        <span>Stars Earned</span>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-card-value">
                            <span className="big-num">{stats.totalStars}</span>
                            <span className="unit">total</span>
                        </div>
                        <div className="stars-visual">
                            {[...Array(Math.min(stats.totalStars, 5))].map((_, i) => (
                                <Star key={i} size={10} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Followers Card - with growth trend */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <Users size={14} />
                        <span>Followers</span>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-card-value">
                            <span className="big-num">{stats.followers}</span>
                            <span className="unit">people</span>
                        </div>
                        <svg className="growth-line" viewBox="0 0 50 24">
                            <path d="M2,20 L10,16 L18,18 L26,12 L34,14 L42,8 L48,4" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="48" cy="4" r="3" fill="var(--accent-primary)" />
                        </svg>
                    </div>
                </div>

                {/* Public vs Private - with percentage ring */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <GitCommit size={14} />
                        <span>Public</span>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-card-value">
                            <span className="big-num">{stats.totalRepos > 0 ? Math.round((stats.publicRepos / stats.totalRepos) * 100) : 0}%</span>
                            <span className="unit">{stats.publicRepos} of {stats.totalRepos}</span>
                        </div>
                        <svg className="percent-ring" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border-light)" strokeWidth="4" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--accent-secondary)" strokeWidth="4"
                                strokeDasharray={`${stats.totalRepos > 0 ? (stats.publicRepos / stats.totalRepos) * 88 : 0} 88`}
                                strokeLinecap="round" transform="rotate(-90 18 18)" />
                            <text x="18" y="20" textAnchor="middle" fontSize="8" fill="var(--text-primary)" fontWeight="600">
                                {stats.publicRepos}
                            </text>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Contribution Graph */}
            <div className="github-graph">
                <Image
                    src={`https://ghchart.rshah.org/8E0E28/${GITHUB_USERNAME}`}
                    alt="GitHub Contribution Graph"
                    className="contribution-graph"
                    width={800}
                    height={120}
                    unoptimized
                />
            </div>

            <style jsx>{`
                .stats-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .stat-card {
                    background: var(--glass-bg-subtle);
                    backdrop-filter: var(--glass-blur);
                    -webkit-backdrop-filter: var(--glass-blur);
                    border-radius: var(--radius-lg);
                    padding: 16px;
                    border: 1px solid var(--glass-border-subtle);
                    box-shadow: var(--neu-shadow-sm);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .stat-card:hover {
                    background: var(--glass-bg);
                    border-color: var(--glass-border-hover);
                    transform: translateY(-2px);
                    box-shadow: var(--neu-shadow);
                }

                @media (max-width: 640px) {
                    .stat-card {
                        padding: 12px 10px;
                    }
                }

                .stat-card-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                }

                .stat-card-header svg {
                    opacity: 0.7;
                }

                .stat-card-body {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .stat-card-value {
                    display: flex;
                    flex-direction: column;
                }

                .big-num {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1;
                }

                .unit {
                    font-size: 9px;
                    color: var(--text-tertiary);
                    margin-top: 3px;
                }

                /* Folder Stack Graphic */
                .folder-stack {
                    position: relative;
                    width: 32px;
                    height: 28px;
                }

                .folder {
                    position: absolute;
                    width: 20px;
                    height: 14px;
                    background: var(--border-light);
                    border-radius: 2px 6px 4px 4px;
                    border: 1px solid rgba(0,0,0,0.1);
                }

                .folder::before {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: 0;
                    width: 8px;
                    height: 4px;
                    background: inherit;
                    border-radius: 2px 2px 0 0;
                }

                .folder.f1 { bottom: 0; left: 0; background: var(--accent-primary); opacity: 0.9; }
                .folder.f2 { bottom: 4px; left: 4px; background: var(--accent-secondary); opacity: 0.7; }
                .folder.f3 { bottom: 8px; left: 8px; background: var(--text-tertiary); opacity: 0.5; }

                /* Stars Visual */
                .stars-visual {
                    display: flex;
                    gap: 2px;
                    align-items: center;
                }

                .stars-visual :global(.star-icon) {
                    filter: drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3));
                }

                /* Growth Line */
                .growth-line {
                    width: 50px;
                    height: 24px;
                }

                .github-graph {
                    margin-top: 16px;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                }

                .contribution-graph {
                    width: 100%;
                    height: auto;
                    display: block;
                    padding: 0;
                    margin: 0;
                }

                @media (min-width: 769px) {
                    .github-graph {
                        width: calc(100% + 32px); /* Bleed past parent padding only on desktop */
                        margin-left: -16px;
                        margin-right: -16px;
                    }

                    .github-compact .stats-cards-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }

                    .github-compact .stat-card {
                        padding: 10px;
                    }

                    .github-compact .big-num {
                        font-size: 18px;
                    }

                    .github-compact .stat-card-header {
                        font-size: 9px;
                        margin-bottom: 4px;
                    }
                    
                    .github-compact .github-graph {
                        max-height: none;
                        margin-top: 12px;
                        width: calc(100% + 32px);
                        margin-left: -16px;
                        margin-right: -16px;
                    }
                }
            `}</style>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        </div>
    )
}

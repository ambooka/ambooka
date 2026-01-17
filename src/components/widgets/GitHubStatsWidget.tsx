'use client'

import { useState, useEffect } from 'react'
import { GitHubService } from '@/services/github'
import { Github, Star, Users, GitCommit } from 'lucide-react'
import Image from 'next/image'

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

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

export default function GitHubStatsWidget({ fullWidth = false, compact = false, initialStats }: GitHubStatsWidgetProps) {
    const [stats, setStats] = useState<GitHubStats>(initialStats || {
        totalRepos: 0,
        totalStars: 0,
        followers: 0,
        publicRepos: 0,
        topLanguages: []
    })
    const [loading, setLoading] = useState(!initialStats)

    useEffect(() => {
        if (initialStats) return
        (async () => {
            try {
                const githubService = new GitHubService(GITHUB_TOKEN)
                const repos = await githubService.getRepositories(GITHUB_USERNAME, {
                    maxRepos: 100,
                    sortBy: 'updated',
                    includePrivate: Boolean(GITHUB_TOKEN)
                })

                const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
                const publicRepos = repos.filter(r => !r.private).length

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
                } catch (e) {
                    console.error('Failed to fetch user profile:', e)
                }

                setStats({ totalRepos: repos.length, totalStars, followers, publicRepos, topLanguages })
            } catch (e) {
                console.error('Failed to fetch GitHub stats:', e)
            } finally {
                setLoading(false)
            }
        })()
    }, [initialStats])

    if (loading) {
        return (
            <div className={`github-stats-widget ${fullWidth ? 'github-fullwidth' : ''}`}>
                <div className="widget-header"><Github size={16} /><span>GitHub Activity</span></div>
                <div className="loading-placeholder">Loading...</div>
            </div>
        )
    }

    return (
        <div className={`github-stats-widget ${compact ? 'github-compact' : ''} ${fullWidth ? 'github-fullwidth' : ''}`}>
            {/* Header */}
            <div className="github-header px-1 md:px-0">
                <div className="github-title">
                    <Github size={18} />
                    <span>GitHub Activity</span>
                </div>
                <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
        </div>
    )
}

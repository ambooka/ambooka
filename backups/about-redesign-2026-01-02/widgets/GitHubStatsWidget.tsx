'use client'

import { useState, useEffect } from 'react'
import { GitHubService } from '@/services/github'
import { Github, Star, Users, GitCommit } from 'lucide-react'

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
}

export default function GitHubStatsWidget({ fullWidth = false }: GitHubStatsWidgetProps) {
    const [stats, setStats] = useState<GitHubStats>({
        totalRepos: 0,
        totalStars: 0,
        followers: 0,
        publicRepos: 0,
        topLanguages: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
    }, [])

    if (loading) {
        return (
            <div className={`github-stats-widget ${fullWidth ? 'github-fullwidth' : ''}`}>
                <div className="widget-header"><Github size={16} /><span>GitHub Activity</span></div>
                <div className="loading-placeholder">Loading...</div>
            </div>
        )
    }

    return (
        <div className={`github-stats-widget github-compact ${fullWidth ? 'github-fullwidth' : ''}`}>
            {/* Header */}
            <div className="github-header">
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

            {/* Stats Row */}
            <div className="github-stats-row">
                <div className="github-stat">
                    <span className="stat-num">{stats.totalRepos}</span>
                    <span className="stat-label">Repos</span>
                </div>
                <div className="github-stat">
                    <Star size={12} />
                    <span className="stat-num">{stats.totalStars}</span>
                    <span className="stat-label">Stars</span>
                </div>
                <div className="github-stat">
                    <Users size={12} />
                    <span className="stat-num">{stats.followers}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="github-stat">
                    <GitCommit size={12} />
                    <span className="stat-num">{stats.publicRepos}</span>
                    <span className="stat-label">Public</span>
                </div>
            </div>

            {/* Contribution Graph */}
            <div className="github-graph">
                <img
                    src={`https://ghchart.rshah.org/8E0E28/${GITHUB_USERNAME}`}
                    alt="GitHub Contribution Graph"
                    className="contribution-graph"
                />
            </div>

            {/* Top Languages */}
            <div className="github-languages">
                <div className="section-label">Top Languages</div>
                <div className="lang-chips">
                    {stats.topLanguages.map((lang, i) => (
                        <div key={i} className="lang-chip">
                            {lang.logo && (
                                <img src={lang.logo} alt={lang.name} className="lang-chip-logo" />
                            )}
                            <span className="lang-chip-name">{lang.name}</span>
                            <span className="lang-chip-count">{lang.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

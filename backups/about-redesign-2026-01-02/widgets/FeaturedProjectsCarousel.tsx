'use client'

import { useState, useEffect, useRef } from 'react'
import { GitHubService } from '@/services/github'
import { ChevronLeft, ChevronRight, Star, ExternalLink, Github, Sparkles } from 'lucide-react'

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

export default function FeaturedProjectsCarousel() {
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

                // Filter featured projects (has stars or homepage)
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

    // Auto-advance carousel
    useEffect(() => {
        if (isPaused || projects.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % projects.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [isPaused, projects.length])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const goNext = () => {
        setCurrentIndex(prev => (prev + 1) % projects.length)
    }

    const goPrev = () => {
        setCurrentIndex(prev => (prev - 1 + projects.length) % projects.length)
    }

    if (loading) {
        return (
            <div className="carousel-widget loading">
                <div className="widget-header">
                    <Sparkles size={18} />
                    <span>Featured Projects</span>
                </div>
                <div className="loading-placeholder">Loading...</div>
            </div>
        )
    }

    if (projects.length === 0) {
        return (
            <div className="carousel-widget">
                <div className="widget-header">
                    <Sparkles size={18} />
                    <span>Featured Projects</span>
                </div>
                <div className="empty-state">No featured projects</div>
            </div>
        )
    }

    return (
        <div
            className="carousel-widget"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="widget-header">
                <Sparkles size={18} />
                <span>Featured Projects</span>
                <div className="nav-buttons">
                    <button onClick={goPrev} className="nav-btn">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={goNext} className="nav-btn">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="carousel-container" ref={carouselRef}>
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {projects.map((project) => (
                        <div key={project.id} className="carousel-slide">
                            <div className="project-card">
                                <div className="project-header">
                                    <h4 className="project-name">{project.name}</h4>
                                    <span className="project-lang">{project.language}</span>
                                </div>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-footer">
                                    <div className="project-stats">
                                        <Star size={14} />
                                        <span>{project.stars}</span>
                                    </div>
                                    <div className="project-links">
                                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                                            <Github size={14} />
                                        </a>
                                        {project.homepage && (
                                            <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="project-link">
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-dots">
                {projects.map((_, i) => (
                    <button
                        key={i}
                        className={`dot ${i === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(i)}
                    />
                ))}
            </div>
        </div>
    )
}

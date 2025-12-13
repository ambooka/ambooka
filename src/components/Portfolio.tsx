'use client'

import { useState, useEffect, useMemo } from 'react'
import { GitHubService, GitHubRepo } from '../services/github'
import * as Dialog from '@radix-ui/react-dialog'
import { ExternalLink, Github, ChevronDown, EyeIcon, Star, Search, ChevronLeft, ChevronRight, Sparkles, Lock, Globe, Code } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'




// --- Interfaces and Default Config ---

interface PortfolioProps {
  isActive?: boolean
  github?: {
    username: string
    token?: string
    featuredThreshold: number
    maxRepos: number
    sortBy: 'updated' | 'created' | 'pushed' | 'full_name'
  }
}

const defaultGithubConfig = {
  username: 'ambooka',
  featuredThreshold: 5,
  maxRepos: 100,
  sortBy: 'updated' as const
}

const getProjectImage = (repo: GitHubRepo): string => {
  if (repo.homepage) {
    return `https://opengraph.githubassets.com/1/${repo.owner?.login}/${repo.name}`
  }
  return 'https://opengraph.githubassets.com/1/torvalds/reddit-news'
}

const FALLBACK_PROJECTS = [
  {
    id: 101,
    title: 'End-to-End ML Pipeline',
    description: 'Automated training pipeline with data validation, training, and deployment using Airflow and Kafka.',
    stack: ['Airflow', 'Kafka', 'PyTorch'],
    github_url: 'https://github.com/ambooka/ml-pipeline',
    is_featured: true,
    live_url: '#',
    display_order: 1
  },
  {
    id: 102,
    title: 'LLM RAG Platform',
    description: 'Document Q&A system with vector search, semantic retrieval, and LLM serving.',
    stack: ['LangChain', 'vLLM', 'Pinecone'],
    github_url: 'https://github.com/ambooka/rag-platform',
    is_featured: true,
    live_url: '#',
    display_order: 2
  },
  {
    id: 103,
    title: 'Real-Time ML System',
    description: 'Streaming inference system with sub-100ms latency using Kafka, Flink, and Redis.',
    stack: ['Kafka', 'Flink', 'Redis'],
    github_url: 'https://github.com/ambooka/realtime-ml',
    is_featured: true,
    live_url: '#',
    display_order: 3
  },
  {
    id: 104,
    title: 'Distributed Training Platform',
    description: 'Multi-GPU training environment utilizing Ray and DeepSpeed for large models.',
    stack: ['Ray', 'DeepSpeed', 'PyTorch'],
    github_url: 'https://github.com/ambooka/distributed-training',
    is_featured: true,
    live_url: '#',
    display_order: 4
  },
  {
    id: 105,
    title: 'Feature Store Platform',
    description: 'Centralized feature management system for consistent training and serving data.',
    stack: ['Feast', 'BigQuery', 'Redis'],
    github_url: 'https://github.com/ambooka/feature-store',
    is_featured: true,
    live_url: '#',
    display_order: 5
  },
  {
    id: 106,
    title: 'Multi-Cloud ML Platform',
    description: 'Unified interface for deploying models across AWS, GCP, and Azure.',
    stack: ['Terraform', 'Kubernetes', 'ArgCD'],
    github_url: 'https://github.com/ambooka/multicloud-ml',
    is_featured: true,
    live_url: '#',
    display_order: 6
  },
  {
    id: 107,
    title: 'ML Observability Suite',
    description: 'Comprehensive monitoring for data drift, model performance, and system health.',
    stack: ['Prometheus', 'Grafana', 'Evidently'],
    github_url: 'https://github.com/ambooka/ml-observability',
    is_featured: true,
    live_url: '#',
    display_order: 7
  },
  {
    id: 108,
    title: 'MLOps Governance System',
    description: 'Policy enforcement and audit trails for ML models and datasets.',
    stack: ['OPA', 'Kyverno', 'MLflow'],
    github_url: 'https://github.com/ambooka/mlops-governance',
    is_featured: true,
    live_url: '#',
    display_order: 8
  }
]

// --- Portfolio Component ---

// Helper to generate consistent gradients based on string input
const getProjectGradient = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `linear-gradient(135deg, hsl(${h}, 70%, 60%), hsl(${(h + 40) % 360}, 70%, 40%))`;
};

export default function Portfolio({ isActive = false, github = defaultGithubConfig }: PortfolioProps) {
  const [filter, setFilter] = useState('all')
  const [selectValue, setSelectValue] = useState('Select category')
  const [showSelectList, setShowSelectList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PROJECTS_PER_PAGE = 12

  const [projects, setProjects] = useState<Array<{
    id: number | string
    category: string
    title: string
    image: string
    url: string
    description: string
    stars: number
    language: string
    isPrivate?: boolean
    ownerLogin?: string
    homepage?: string | null
    isFeatured?: boolean
    updatedAt?: string
  }>>([])

  // Popup / README state
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)
  const [popupLoading, setPopupLoading] = useState(false)
  const [popupError, setPopupError] = useState<string | null>(null)
  const [popupContent, setPopupContent] = useState<string | null>(null)
  const [popupRepo, setPopupRepo] = useState<{
    title: string
    description: string
    language: string
    homepage?: string | null
    url: string
    isPrivate?: boolean
    ownerLogin?: string
    image?: string
  } | null>(null)

  // Ensure popup is closed when component unmounts
  useEffect(() => {
    return () => {
      if (popupWindow && !popupWindow.closed) popupWindow.close()
    }
  }, [popupWindow])

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)

      try {
        // 1. Try fetching from GitHub API (Primary Source)
        if (github?.username) {
          const githubService = new GitHubService(github.token)
          const repos = await githubService.getRepositories(github.username, {
            maxRepos: github.maxRepos,
            sortBy: github.sortBy,
            includePrivate: Boolean(github.token)
          })

          const mappedProjects = repos.map(repo => ({
            id: repo.id,
            category: repo.language?.toLowerCase() || 'other',
            title: repo.name,
            image: getProjectImage(repo),
            url: repo.html_url,
            description: repo.description || '',
            stars: repo.stargazers_count,
            language: repo.language || 'Other',
            isPrivate: !!repo.private,
            ownerLogin: repo.owner?.login,
            homepage: repo.homepage,
            isFeatured: repo.stargazers_count >= github.featuredThreshold || !!repo.homepage,
            updatedAt: repo.pushed_at || repo.updated_at
          }))

          // Sort: by most recently updated (most recent first)
          mappedProjects.sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
            return dateB - dateA
          })

          if (mappedProjects.length > 0) {
            setProjects(mappedProjects)
            setLoading(false)
            return
          }
        }

        // 2. Fallback to Supabase (MLOps Roadmap Projects) if GitHub fails or returns empty
        const { data: dbProjects, error: dbError } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })

        if (!dbError && dbProjects && dbProjects.length > 0) {
          const mappedDbProjects = dbProjects.map((p: any) => ({
            id: p.id,
            category: p.stack?.[0]?.toLowerCase() || 'mlops', // Use first stack item as category or default
            title: p.title,
            image: '', // DB might not have image yet, could implement logic
            url: p.github_url || '#',
            description: p.description,
            stars: 0, // DB doesn't track stars yet
            language: p.stack?.[0] || 'Python',
            isPrivate: false,
            ownerLogin: github.username,
            homepage: p.live_url !== '#' ? p.live_url : null,
            isFeatured: p.is_featured,
            updatedAt: new Date().toISOString()
          }))
          setProjects(mappedDbProjects)
          setLoading(false)
          return
        }

        // 3. Last resort: FALLBACK_PROJECTS (Hardcoded Roadmap)
        // If both GitHub and Supabase fail, use hardcoded roadmap projects
        const mappedFallback = FALLBACK_PROJECTS.map(p => ({
          id: p.id,
          category: p.stack[0].toLowerCase(),
          title: p.title,
          image: '',
          url: p.github_url,
          description: p.description,
          stars: 0,
          language: p.stack[0],
          isPrivate: false,
          ownerLogin: github.username,
          homepage: p.live_url !== '#' ? p.live_url : null,
          isFeatured: p.is_featured,
          updatedAt: new Date().toISOString()
        }))
        setProjects(mappedFallback)


      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setError('Failed to load projects. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [github])

  const openProject = async (project: any) => {
    setPopupRepo({
      title: project.title,
      description: project.description,
      language: project.language,
      homepage: project.homepage,
      url: project.url,
      isPrivate: project.isPrivate,
      ownerLogin: project.ownerLogin,
      image: project.image
    })
    setPopupError(null)
    setPopupContent(null)

    if (project.isPrivate && !github.token) {
      setPopupError('This repository is private. I can share a README preview here — please contact me for full access.')
      setPopupLoading(false)
      return
    }

    const githubService = new GitHubService(github.token)
    setPopupLoading(true)
    try {
      const owner = project.ownerLogin || github.username
      const readme = await githubService.getReadme(owner, project.title)
      setPopupContent(readme)
    } catch (err) {
      console.error('Failed to load README:', err)
      setPopupError('Could not load README. You can view the repository on GitHub if you have access.')
    } finally {
      setPopupLoading(false)
    }
  }

  // Advanced filtering with search
  const filteredProjects = useMemo(() => {
    let result = projects

    // Filter by category
    if (filter !== 'all') {
      result = result.filter(project => project.category === filter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.language.toLowerCase().includes(query)
      )
    }

    return result
  }, [projects, filter, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE)
  }, [filteredProjects, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery])

  const handleFilter = (newFilter: string, displayName: string) => {
    setFilter(newFilter)
    setSelectValue(displayName)
    setShowSelectList(false)
  }

  const filterOptions = [
    { value: 'all', label: 'All' },
    ...Array.from(new Set(projects.map(p => p.language)))
      .map(lang => ({
        value: lang.toLowerCase(),
        label: lang
      }))
  ]

  return (
    <article className={`portfolio portfolio-tab ${isActive ? 'active' : ''}`} data-page="portfolio">
      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      <section className="projects">
        {loading && (
          <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading projects...</div>
          </div>
        )}

        {error && (
          <div className="error" style={{
            padding: '20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#ef4444',
            textAlign: 'center'
          }}>{error}</div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="no-projects" style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-secondary)'
          }}>
            No projects found for username: {github.username}
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            {/* Search Bar */}
            <div style={{
              marginBottom: '30px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{
                flex: '1 1 300px',
                position: 'relative'
              }}>
                <Search style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none'
                }} />
                <input
                  type="text"
                  placeholder="Search projects by name, description, or technology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: ' 14px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-color)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Category Filters */}
            <ul className="filter-list">
              {filterOptions.map(option => (
                <li key={option.value} className="filter-item">
                  <button
                    className={filter === option.value ? 'active' : ''}
                    onClick={() => handleFilter(option.value, option.label)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="filter-select-box">
              <button
                className="filter-select"
                onClick={() => setShowSelectList(!showSelectList)}
              >
                <div className="select-value">{selectValue}</div>
                <div className="select-icon">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {showSelectList && (
                <ul className="select-list">
                  {filterOptions.map(option => (
                    <li key={option.value} className="select-item">
                      <button onClick={() => handleFilter(option.value, option.label)}>
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Project Cards & Skeletons */}
            {loading ? (
              <ul className="project-list" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
                padding: '10px'
              }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <li key={index} style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    height: '380px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div className="skeleton" style={{ width: '100%', height: '160px', background: 'rgba(0,0,0,0.05)' }} />
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="skeleton" style={{ width: '60%', height: '20px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)' }} />
                      <div className="skeleton" style={{ width: '40%', height: '14px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)' }} />
                      <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)' }} />
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                        <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)' }} />
                        <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)' }} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : paginatedProjects.length > 0 ? (
              <ul className="project-list" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
                padding: '10px'
              }}>
                {paginatedProjects.map((project, index) => (
                  <li
                    key={project.id}
                    className="project-item active"
                    data-category={project.category}
                    style={{
                      animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0,
                      transform: 'translateY(20px)'
                    }}
                  >
                    <div
                      className="project-card-inner"
                      style={{
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)'
                        e.currentTarget.style.boxShadow = '0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)'
                        e.currentTarget.style.borderColor = 'var(--accent-color)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        e.currentTarget.style.borderColor = 'var(--border-color)'
                      }}
                    >
                      {/* Featured Badge */}
                      {project.isFeatured && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '16px',
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#B8860B',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: '1px solid rgba(184, 134, 11, 0.2)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          <Sparkles style={{ width: '10px', height: '10px' }} />
                          Featured
                        </div>
                      )}

                      <div
                        className="project-link-button"
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'default'
                        }}
                      >
                        <figure className="project-img" style={{
                          width: '100%',
                          height: '160px',
                          overflow: 'hidden',
                          position: 'relative',
                          margin: 0,
                          borderBottom: '1px solid var(--border-color)'
                        }}>
                          <div className="project-item-icon-box" style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) scale(0.8)',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '10px',
                            padding: '10px',
                            opacity: 0,
                            transition: 'all 0.3s ease',
                            zIndex: 1
                          }}>
                            <EyeIcon style={{ color: '#fff', width: '20px', height: '20px' }} />
                          </div>
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                const iconBox = e.currentTarget.parentElement?.querySelector('.project-item-icon-box') as HTMLElement
                                if (iconBox) {
                                  iconBox.style.opacity = '1'
                                  iconBox.style.transform = 'translate(-50%, -50%) scale(1)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                const iconBox = e.currentTarget.parentElement?.querySelector('.project-item-icon-box') as HTMLElement
                                if (iconBox) {
                                  iconBox.style.opacity = '0'
                                  iconBox.style.transform = 'translate(-50%, -50%) scale(0.8)'
                                }
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: getProjectGradient(project.title),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.5s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                const iconBox = e.currentTarget.parentElement?.querySelector('.project-item-icon-box') as HTMLElement
                                if (iconBox) {
                                  iconBox.style.opacity = '1'
                                  iconBox.style.transform = 'translate(-50%, -50%) scale(1)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                const iconBox = e.currentTarget.parentElement?.querySelector('.project-item-icon-box') as HTMLElement
                                if (iconBox) {
                                  iconBox.style.opacity = '0'
                                  iconBox.style.transform = 'translate(-50%, -50%) scale(0.8)'
                                }
                              }}
                            >
                              <Code style={{ width: '48px', height: '48px', color: 'rgba(255,255,255,0.4)' }} />
                            </div>
                          )}
                        </figure>

                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <h3 className="project-title" style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: 'var(--text-primary)',
                              margin: 0,
                              lineHeight: '1.3',
                              fontFamily: 'var(--ff-display)'
                            }}>{project.title}</h3>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '12px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 8px',
                              background: 'rgba(0, 0, 0, 0.03)',
                              borderRadius: '6px',
                              fontWeight: '500'
                            }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-color)' }}></span>
                              {project.language}
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.7 }}>
                              {project.isPrivate ? (
                                <>
                                  <Lock style={{ width: '11px', height: '11px' }} />
                                  <span>Private</span>
                                </>
                              ) : (
                                <>
                                  <Globe style={{ width: '11px', height: '11px' }} />
                                  <span>Public</span>
                                </>
                              )}
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginLeft: 'auto'
                            }}>
                              <Star style={{ width: '12px', height: '12px', fill: 'var(--accent-color)', color: 'var(--accent-color)' }} />
                              <span style={{ fontWeight: '600' }}>{project.stars}</span>
                            </div>
                          </div>

                          {project.description && (
                            <p style={{
                              fontSize: '14px',
                              color: 'var(--text-secondary)',
                              lineHeight: '1.5',
                              marginBottom: '16px',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              flex: 1
                            }}>
                              {project.description}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: 'auto'
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openProject(project);
                              }}
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '10px',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--text-primary)'
                                e.currentTarget.style.background = 'var(--bg-primary)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)'
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.transform = 'translateY(0)'
                              }}
                            >
                              <EyeIcon style={{ width: '14px', height: '14px' }} />
                              Details
                            </button>

                            {project.homepage && (
                              <a
                                href={project.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  padding: '10px',
                                  background: 'var(--accent-color)',
                                  color: '#fff',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  textDecoration: 'none',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 4px 6px rgba(184, 134, 11, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)'
                                  e.currentTarget.style.boxShadow = '0 8px 12px rgba(184, 134, 11, 0.3)'
                                  e.currentTarget.style.filter = 'brightness(1.1)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)'
                                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(184, 134, 11, 0.2)'
                                  e.currentTarget.style.filter = 'brightness(1)'
                                }}
                              >
                                <ExternalLink style={{ width: '14px', height: '14px' }} />
                                Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                borderRadius: '20px',
                border: '1px dashed var(--border-color)'
              }}>
                <Search style={{ width: '64px', height: '64px', margin: '0 auto 24px', opacity: 0.2 }} />
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No projects found</h3>
                <p style={{ fontSize: '15px', opacity: 0.7, maxWidth: '400px', margin: '0 auto' }}>
                  We couldn't find any projects matching your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '40px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    background: currentPage === 1 ? 'transparent' : 'var(--bg-secondary)',
                    border: `1px solid ${currentPage === 1 ? 'var(--border-color)' : 'var(--accent-color)'}`,
                    borderRadius: '8px',
                    color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.background = 'var(--accent-color)'
                      e.currentTarget.style.color = '#000'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.background = 'var(--bg-secondary)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                >
                  <ChevronLeft style={{ width: '14px', height: '14px' }} />
                  <span className="pagination-text">Previous</span>
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        minWidth: '32px',
                        height: '32px',
                        padding: '0 6px',
                        background: currentPage === page ? 'var(--accent-color)' : 'var(--bg-secondary)',
                        border: `1px solid ${currentPage === page ? 'var(--accent-color)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        color: currentPage === page ? '#000' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: currentPage === page ? '600' : '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== page) {
                          e.currentTarget.style.background = 'var(--accent-color)'
                          e.currentTarget.style.color = '#000'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== page) {
                          e.currentTarget.style.background = 'var(--bg-secondary)'
                          e.currentTarget.style.color = 'var(--text-primary)'
                        }
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    background: currentPage === totalPages ? 'transparent' : 'var(--bg-secondary)',
                    border: `1px solid ${currentPage === totalPages ? 'var(--border-color)' : 'var(--accent-color)'}`,
                    borderRadius: '8px',
                    color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-primary)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.background = 'var(--accent-color)'
                      e.currentTarget.style.color = '#000'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.background = 'var(--bg-secondary)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                >
                  <span className="pagination-text">Next</span>
                  <ChevronRight style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal for README */}
      {popupRepo && (
        <Dialog.Root open={!!popupRepo} onOpenChange={() => setPopupRepo(null)}>
          <Dialog.Portal>
            <Dialog.Overlay style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }} />
            <Dialog.Content style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '20px',
              boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.5)',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              maxWidth: '650px',
              maxHeight: '85vh',
              overflow: 'hidden',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border-color)'
            }}>
              {/* Project Image Banner */}
              <div style={{
                width: '100%',
                height: '280px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src={popupRepo.image || `https://opengraph.githubassets.com/1/${popupRepo.ownerLogin}/${popupRepo.title}`}
                  alt={popupRepo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Scrollable Content Section */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '30px'
              }}>
                <Dialog.Title style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  {popupRepo.title}
                </Dialog.Title>

                {popupRepo.isPrivate && (
                  <div style={{
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    color: '#ffc107',
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}>
                    This repository is private. A README preview is shown here; contact me for full access.
                  </div>
                )}

                {/* About Section */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  About
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  {popupLoading && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      Loading README…
                    </div>
                  )}

                  {popupError && (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '14px'
                    }}>
                      {popupError}
                    </div>
                  )}

                  {!popupLoading && !popupError && popupContent && (
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.8'
                    }}>
                      <pre style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        margin: 0
                      }}>{popupContent}</pre>
                    </div>
                  )}
                </div>

                {/* Technologies Used Section */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  Technologies Used
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: 'var(--border-gradient-onyx)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    {projects.find(p => p.title === popupRepo.title)?.language || 'JavaScript'}
                  </span>
                </div>
              </div>

              {/* Fixed Action Buttons Footer */}
              <div style={{
                padding: '20px 30px',
                borderTop: '1px solid var(--jet)',
                flexShrink: 0,
                display: 'flex',
                gap: '12px'
              }}>
                {!popupRepo.isPrivate && popupRepo.homepage && (
                  <a
                    href={popupRepo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: 'var(--orange-yellow-crayola)',
                      color: 'var(--smoky-black)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ExternalLink style={{ width: '16px', height: '16px' }} />
                    Live Preview
                  </a>
                )}

                {!popupRepo.isPrivate && (
                  <a
                    href={popupRepo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      border: '2px solid var(--orange-yellow-crayola)',
                      color: 'var(--orange-yellow-crayola)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Github style={{ width: '16px', height: '16px' }} />
                    Source Code
                  </a>
                )}
              </div>

              {/* Close Button */}
              <Dialog.Close asChild>
                <button
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  aria-label="Close"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                >
                  ×
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      <style>{`
        @keyframes overlayShow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes contentShow {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </article>
  )
}
'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { GitHubService, GitHubRepo } from '../services/github'
import * as Dialog from '@radix-ui/react-dialog'
import { ExternalLink, Github, EyeIcon, Star, Search, ChevronLeft, ChevronRight, Lock, Code, ArrowUpRight } from 'lucide-react'
import { fetchProjectReadme } from '@/app/actions/github'

// --- Constants & Config ---

const LOGO_MAP: Record<string, string> = {
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'Go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg',
  'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'Ruby': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
  'Swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
  'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  'Rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'Sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  'GraphQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  'Unity': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg'
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

// --- Portfolio Component ---

interface Project {
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
}

interface PortfolioProps {
  isActive?: boolean
  github?: {
    username: string
    token?: string
    featuredThreshold: number
    maxRepos: number
    sortBy: 'updated' | 'stars' | 'created'
  }
  initialProjects?: Project[]
}

export default function Portfolio({ isActive = false, github = defaultGithubConfig, initialProjects }: PortfolioProps) {
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(!initialProjects)
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
  }>>(initialProjects || [])

  // README state
  const [popupLoading, setPopupLoading] = useState(false)
  const [popupError, setPopupError] = useState<string | null>(null)
  const [popupContent, setPopupContent] = useState<string | null>(null)
  const [popupRepo, setPopupRepo] = useState<Project | null>(null)

  useEffect(() => {
    if (initialProjects) return

    const fetchProjects = async () => {
      setLoading(true)
      try {
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

        mappedProjects.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
          return dateB - dateA
        })

        setProjects(mappedProjects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setError('Failed to load projects.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [github])

  const openProject = async (repo: Project) => {
    setPopupRepo(repo)
    setPopupError(null)
    setPopupContent(null)
    setPopupLoading(true)

    try {
      const owner = repo.ownerLogin || github.username
      const result = await fetchProjectReadme(owner, repo.title)

      if (result.error) {
        setPopupError(result.error)
      } else {
        setPopupContent(result.content || 'No README found.')
      }
    } catch (_err) {
      setPopupError('Could not load README.')
    } finally {
      setPopupLoading(false)
    }
  }

  const filteredProjects = useMemo(() => {
    let result = projects
    if (filter !== 'all') {
      result = result.filter(p => p.category === filter.toLowerCase())
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.language.toLowerCase().includes(q))
    }
    return result
  }, [projects, filter, searchQuery])

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECTS_PER_PAGE
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE)
  }, [filteredProjects, currentPage])

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)

  const filterOptions = [
    { value: 'all', label: 'All' },
    ...Array.from(new Set(projects.map(p => p.language))).filter(Boolean).map(lang => ({
      value: lang.toLowerCase(),
      label: lang
    }))
  ]

  return (
    <article className={`portfolio portfolio-tab ${isActive ? 'active' : ''}`} data-page="portfolio">
      <header className="mb-8">
        <h2 className="h2 article-title">Project Portfolio</h2>
        <p className="article-text mt-2">A showcase of my recent work, open-source contributions, and technical experiments.</p>
      </header>

      <section className="projects-section">
        {/* Expanded Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, tech or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--glass-bg-subtle)] backdrop-blur-md border border-[var(--glass-border-subtle)] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--accent-emerald-base)] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)] transition-all shadow-[var(--neu-shadow-inset-sm)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto overflow-y-visible py-1 px-1 scrollbar-hide bg-[rgba(30,58,66,0.06)] rounded-full border border-[rgba(30,58,66,0.04)]">
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setFilter(opt.value); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center justify-center ${filter === opt.value
                  ? 'bg-[var(--glass-bg-strong)] text-[var(--accent-emerald-base)] shadow-[var(--neu-shadow-sm)] font-bold border border-[var(--glass-border)]'
                  : 'bg-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-subtle)]'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="project-list">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] bg-[var(--bg-tertiary)] animate-pulse rounded-[var(--radius-xl)]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-[var(--accent-error)] bg-[var(--bg-tertiary)] rounded-[var(--radius-xl)] border border-[var(--accent-error)]/20">{error}</div>
        ) : (
          <>
            <div className="project-list">
              {paginatedProjects.map((repo, idx) => (
                <div
                  key={repo.id}
                  className="project-item active"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="project-card-inner card hover-lift overflow-hidden h-full flex flex-col">
                    {/* Image Header with Overlay */}
                    <div className="project-img h-56 relative group">
                      <Image
                        src={repo.image}
                        alt={repo.title}
                        width={400}
                        height={224}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                      <div className="project-item-icon-box opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-md flex gap-4 flex-row p-4">
                        <button
                          onClick={() => openProject(repo)}
                          className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                          title="View README"
                        >
                          <EyeIcon size={20} />
                        </button>
                        {!repo.isPrivate && (
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                            title="View Code"
                          >
                            <Github size={20} />
                          </a>
                        )}
                      </div>
                      {repo.isPrivate && <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 z-10"><Lock size={10} /> Private</div>}
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center p-2">
                            {LOGO_MAP[repo.language] ? (
                              <Image src={LOGO_MAP[repo.language]} alt={repo.language} width={40} height={40} className="w-full h-full object-contain" unoptimized />
                            ) : (
                              <Code className="text-[var(--text-secondary)]" size={20} />
                            )}
                          </div>
                          <div>
                            <h3 className="project-title !m-0 !text-[var(--text-primary)] !text-lg !font-bold capitalize">{repo.title.replace(/-/g, ' ')}</h3>
                            <span className="text-[10px] font-bold text-[var(--accent-emerald-base)] uppercase tracking-widest">{repo.language}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)]">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          {repo.stars}
                        </div>
                      </div>

                      <p className="project-text !text-[var(--text-secondary)] !text-sm leading-relaxed line-clamp-3 mb-6 flex-1 opacity-80">
                        {repo.description || 'Integrating complex systems with elegant solutions. This project showcases scalable architecture and modern engineering practices.'}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {!repo.isPrivate ? (
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[11px] font-black uppercase tracking-widest py-3 rounded-[var(--radius-sm)] hover:bg-[var(--accent-emerald-base)] transition-colors shadow-lg"
                          >
                            <Github size={14} /> Source Code
                          </a>
                        ) : (
                          <button
                            onClick={() => openProject(repo)}
                            className="flex-1 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)] text-[11px] font-black uppercase tracking-widest py-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-emerald-base)] hover:border-[var(--accent-emerald-base)] transition-all shadow-sm"
                          >
                            <EyeIcon size={14} /> View README
                          </button>
                        )}
                        {repo.homepage && (
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--accent-emerald-base)] hover:border-[var(--accent-emerald-base)] transition-all shadow-sm"
                            title="Live Preview"
                          >
                            <ArrowUpRight size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16 pb-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full bg-white border border-[rgba(30,58,66,0.08)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:shadow-[0_4px_12px_rgba(30,58,66,0.1)] disabled:opacity-30 disabled:hover:shadow-none transition-all shadow-[0_2px_8px_rgba(30,58,66,0.06)] flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1 bg-[rgba(30,58,66,0.06)] p-1 rounded-full border border-[rgba(30,58,66,0.04)]">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all flex items-center justify-center ${currentPage === p
                        ? 'bg-white text-[var(--text-primary)] shadow-[0_2px_8px_rgba(30,58,66,0.1)] font-semibold'
                        : 'bg-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-white/50'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full bg-white border border-[rgba(30,58,66,0.08)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:shadow-[0_4px_12px_rgba(30,58,66,0.1)] disabled:opacity-30 disabled:hover:shadow-none transition-all shadow-[0_2px_8px_rgba(30,58,66,0.06)] flex items-center justify-center"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* README Preview Modal */}
      {popupRepo && (
        <Dialog.Root open={!!popupRepo} onOpenChange={() => setPopupRepo(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] max-h-[90vh] bg-[var(--bg-primary)] rounded-[var(--radius-xl)] overflow-hidden z-[1001] border border-[var(--border-color)] shadow-2xl flex flex-col">
              <div className="relative h-64 flex-shrink-0">
                <Image src={popupRepo.image} alt={popupRepo.title} width={800} height={256} className="w-full h-full object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <span className="text-[var(--accent-emerald-base)] text-xs font-bold uppercase tracking-widest">{popupRepo.language}</span>
                  <Dialog.Title className="text-3xl font-black text-white uppercase tracking-tight mt-1">{popupRepo.title.replace(/-/g, ' ')}</Dialog.Title>
                </div>
                <Dialog.Close className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all font-bold">×</Dialog.Close>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[var(--bg-secondary)]">
                {popupLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-[var(--accent-emerald-base)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[var(--text-secondary)] font-bold uppercase text-xs tracking-widest">Decrypting README...</p>
                  </div>
                ) : popupError ? (
                  <div className="p-8 bg-red-50 text-[var(--accent-error)] rounded-[var(--radius-lg)] border border-[var(--accent-error)]/20 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><Lock size={20} /></div>
                    <div>
                      <p className="font-bold">Access Restricted</p>
                      <p className="text-sm opacity-80">{popupError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    <div
                      className="p-6 bg-[var(--bg-tertiary)] rounded-[var(--radius-lg)] border border-[var(--border-color)] text-[var(--text-primary)] [&>*:first-child]:mt-0"
                      dangerouslySetInnerHTML={{ __html: popupContent || '' }}
                    />
                  </div>
                )}
              </div>

              <div className="p-8 bg-[var(--bg-tertiary)] border-t border-[var(--border-color)] flex gap-4">
                {!popupRepo.isPrivate && (
                  <a
                    href={popupRepo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-black uppercase tracking-widest py-4 rounded-[var(--radius-md)] hover:bg-[var(--accent-emerald-base)] transition-all shadow-xl"
                  >
                    <Github size={20} /> Open Repository
                  </a>
                )}
                {popupRepo.homepage && (
                  <a
                    href={popupRepo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-black uppercase tracking-widest py-4 rounded-[var(--radius-md)] hover:border-[var(--accent-emerald-base)] hover:text-[var(--accent-emerald-base)] transition-all shadow-lg"
                  >
                    <ExternalLink size={20} /> Live Demo
                  </a>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      <style jsx>{`
        .portfolio-tab { display: none; }
        .portfolio-tab.active { display: block; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--accent-emerald-base); }
        
        .project-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 30px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .project-list {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </article>
  )
}
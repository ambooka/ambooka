'use client'

import { useState, useEffect } from 'react'
import { GitHubService, GitHubRepo } from '../services/github'
import * as Dialog from '@radix-ui/react-dialog'
import { styled } from '@stitches/react'
import { ExternalLink, Github, ChevronDown, EyeIcon, Star } from 'lucide-react'


// --- Styled Components ---

const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  position: 'fixed',
  inset: 0,
  animation: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  zIndex: 9999,
})

const DialogContent = styled(Dialog.Content, {
  borderRadius: '6px',
  boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35)',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '600px',
  maxHeight: '85vh',
  animation: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 10000,
})

const ModalHeader = styled('div', {
  backgroundColor: '#161B22',
  color: 'white',
  padding: '30px 25px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  borderTopLeftRadius: '6px',
  borderTopRightRadius: '6px',
  position: 'relative',
})

const ModalBody = styled('div', {
  backgroundColor: 'white',
  padding: '25px',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflowY: 'auto',
  gap: '1.5rem',
  borderBottomLeftRadius: '6px',
  borderBottomRightRadius: '6px',
})

const Button = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s, opacity 0.2s, border-color 0.2s',
  flexGrow: 1,

  variants: {
    variant: {
      primary: {
        backgroundColor: 'var(--accent-color)',
        color: 'white',
        '&:hover': { opacity: 0.9 },
      },
      secondary: {
        backgroundColor: 'transparent',
        border: '1px solid var(--accent-color)',
        color: 'var(--accent-color)',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
      },
      viewLive: {
        backgroundColor: 'transparent',
        border: '1px solid white',
        color: 'white',
        padding: '0.75rem 2rem',
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
      },
      sourceCode: {
        backgroundColor: 'white',
        border: '1px solid #D0D0D0',
        color: 'black',
        padding: '0.75rem 2rem',
        '&:hover': { backgroundColor: '#F5F5F5' },
      }
    },
  },
})

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

// --- Portfolio Component ---

export default function Portfolio({ isActive = false, github = defaultGithubConfig }: PortfolioProps) {
  const [filter, setFilter] = useState('all')
  const [selectValue, setSelectValue] = useState('Select category')
  const [showSelectList, setShowSelectList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Array<{
    id: number
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

      if (!github?.username) {
        setError('GitHub username is required')
        setLoading(false)
        return
      }

      const githubService = new GitHubService(github.token)
      try {
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
          homepage: repo.homepage
        }))

        setProjects(mappedProjects)
      } catch (error) {
        console.error('Failed to fetch GitHub repositories:', error)
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
      ownerLogin: project.ownerLogin
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

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category === filter)

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
    <article className={`portfolio ${isActive ? 'active' : ''}`} data-page="portfolio">
      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      <section className="projects">
        {loading && (
          <div className="loading">Loading projects...</div>
        )}

        {error && (
          <div className="error">{error}</div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="no-projects">
            No projects found for username: {github.username}
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
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

            <ul className="project-list">
              {filteredProjects.map(project => (
                <li
                  key={project.id}
                  className="project-item active"
                  data-category={project.category}
                >
                  <button
                    className="project-link-button"
                    onClick={() => openProject(project)}
                    aria-haspopup="dialog"
                    aria-label={`Open ${project.title} README`}
                  >
                    <figure className="project-img">
                      <div className="project-item-icon-box">
                        <EyeIcon />
                      </div>
                      <img src={project.image} alt={project.title} loading="lazy" />
                    </figure>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-category">{project.language}</p>
                    {project.stars >= github.featuredThreshold && (
                      <span className="featured-badge">
                        <Star /> Featured
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Modal for README */}
      {popupRepo && (
        <Dialog.Root open={!!popupRepo} onOpenChange={() => setPopupRepo(null)}>
          <Dialog.Portal>
            <Dialog.Overlay style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} />
            <Dialog.Content style={{
              backgroundColor: 'var(--eerie-black-1)',
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
              flexDirection: 'column'
            }}>
              {/* Project Image Banner */}
              <div style={{
                width: '100%',
                height: '280px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src={projects.find(p => p.title === popupRepo.title)?.image}
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
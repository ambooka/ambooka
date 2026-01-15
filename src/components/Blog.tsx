'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface BlogProps {
  isActive?: boolean
  initialPosts?: BlogPost[]
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image_url: string | null
  category: string
  tags: string[]
  published_at: string | null
  view_count: number
}

export default function Blog({ isActive = false, initialPosts }: BlogProps) {
  const [loading, setLoading] = useState(!initialPosts)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialPosts || [])

  useEffect(() => {
    if (!initialPosts) {
      fetchBlogPosts()
    }
  }, [initialPosts])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

      if (error) throw error

      if (data) {
        setBlogPosts(data)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Blog+Post'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <article className={`blog portfolio-tab ${isActive ? 'active' : ''}`} data-page="blog">
        <header>
          <h2 className="h2 article-title">Blog</h2>
        </header>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Loader2 size={40} className="animate-spin text-[var(--accent-primary)]" />
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">Loading Intelligence...</p>
        </div>
        <style jsx>{`
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </article>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <article className={`blog portfolio-tab ${isActive ? 'active' : ''}`} data-page="blog">
        <header>
          <h2 className="h2 article-title">Blog</h2>
        </header>
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No blog posts yet</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>Check back soon for new content!</p>
        </div>
      </article>
    )
  }

  return (
    <article className={`blog portfolio-tab ${isActive ? 'active' : ''}`} data-page="blog">
      <header>
        <h2 className="h2 article-title">Blog</h2>
      </header>

      <section className="blog-posts">
        <ul className="blog-posts-list">
          {blogPosts.map(post => (
            <li key={post.id} className="blog-post-item">
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <figure className="blog-banner-box">
                  <Image
                    src={post.image_url || 'https://via.placeholder.com/800x600?text=Blog+Post'}
                    alt={post.title}
                    width={800}
                    height={600}
                    loading="lazy"
                    onError={handleImageError}
                    className="w-full h-auto"
                  />
                </figure>

                <div className="blog-content !p-8">
                  <div className="blog-meta !mb-4">
                    <p className="blog-category !text-[var(--accent-primary)] !font-black !uppercase !tracking-widest !text-[10px]">{post.category}</p>
                    <span className="dot !bg-[var(--border-color)]"></span>
                    <time dateTime={post.published_at || ''} className="!text-[var(--text-tertiary)] !font-bold !uppercase !tracking-tighter !text-[11px]">
                      {formatDate(post.published_at)}
                    </time>
                  </div>

                  <h3 className="h3 blog-item-title !text-[var(--text-primary)] !font-black !uppercase !tracking-tight !mb-4 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="blog-text !text-[var(--text-secondary)] !text-sm leading-relaxed line-clamp-3 mb-6 opacity-80">{post.excerpt || post.content.slice(0, 150)}...</p>

                  {post.tags && post.tags.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '12px'
                    }}>
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} style={{
                          padding: '4px 12px',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
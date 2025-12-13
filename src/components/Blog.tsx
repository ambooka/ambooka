'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Loader2, Calendar, Tag } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface BlogProps {
  isActive?: boolean
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

export default function Blog({ isActive = false }: BlogProps) {
  const [loading, setLoading] = useState(true)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchBlogPosts()
  }, [])

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
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--orange-yellow-crayola)' }} />
          <p>Loading posts...</p>
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
                  <img
                    src={post.image_url || 'https://via.placeholder.com/800x600?text=Blog+Post'}
                    alt={post.title}
                    loading="lazy"
                    onError={handleImageError}
                  />
                </figure>

                <div className="blog-content">
                  <div className="blog-meta">
                    <p className="blog-category">{post.category}</p>
                    <span className="dot"></span>
                    <time dateTime={post.published_at || ''}>
                      {formatDate(post.published_at)}
                    </time>
                  </div>

                  <h3 className="h3 blog-item-title">{post.title}</h3>
                  <p className="blog-text">{post.excerpt || post.content.slice(0, 150)}...</p>

                  {post.tags && post.tags.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '12px'
                    }}>
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} style={{
                          padding: '2px 8px',
                          background: 'var(--border-gradient-onyx)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: 'var(--text-secondary)'
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
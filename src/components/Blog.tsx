'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Calendar, Eye } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import AnimatedPage from '@/components/AnimatedPage'
import {
  fadeUp,
  staggerContainer,
  staggerChildScale,
  scrollRevealTransition,
  defaultViewport,
} from '@/lib/motion'

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
      <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="blog">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
            Blog
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 size={40} className="animate-spin text-[hsl(var(--accent))]" />
          <p className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px]">Loading Intelligence...</p>
        </div>
      </article>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="blog">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
            Blog
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
        </header>
        <div className="text-center py-20 px-5 text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--muted))]">
          <p className="text-lg font-bold mb-2 text-[hsl(var(--foreground))]">No blog posts yet</p>
          <p className="text-sm opacity-80">Check back soon for new content!</p>
        </div>
      </article>
    )
  }

  return (
    <AnimatedPage>
    <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="blog">
      <motion.header
        className="mb-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={scrollRevealTransition}
      >
        <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
          Blog
          <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
        </h2>
      </motion.header>

      <section className="mb-8">
        <motion.ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 list-none m-0 p-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {blogPosts.map((post) => (
            <motion.li
              key={post.id}
              variants={staggerChildScale}
              className="group"
            >
              <Link 
                href={`/blog/${post.slug}`} 
                className="flex flex-col h-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-[hsl(var(--accent))/0.4]"
              >
                {/* Image Banner */}
                <figure className="relative w-full h-56 m-0 overflow-hidden bg-[hsl(var(--muted))] shrink-0">
                  <Image
                    src={post.image_url || 'https://via.placeholder.com/800x600?text=Blog+Post'}
                    alt={post.title}
                    fill
                    loading="lazy"
                    onError={handleImageError}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </figure>

                {/* Content */}
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-wider">
                    <span className="text-[hsl(var(--accent))] truncate max-w-[120px]">
                      {post.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[hsl(var(--border))]" />
                    <time dateTime={post.published_at || ''} className="text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.published_at)}
                    </time>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-[hsl(var(--foreground))] leading-tight mb-3 line-clamp-2 group-hover:text-[hsl(var(--accent))] transition-colors">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-3 mb-6 flex-1">
                    {post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 150) : '')}...
                  </p>

                  {/* Footer / Tags */}
                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-[hsl(var(--border))]">
                    {post.tags && post.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2 overflow-hidden max-h-[26px]">
                        {post.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-md text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest truncate max-w-[90px]">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="px-2 py-1 bg-transparent text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}
                    
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] shrink-0">
                      <Eye className="w-4 h-4" />
                      {post.view_count || 0}
                    </div>
                  </div>
                  
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </article>
    </AnimatedPage>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, Eye, Loader2, Search, Sparkles, TrendingUp } from 'lucide-react'
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
import { getReadingTimeMinutes, stripMarkdown } from '@/lib/blog-markdown'

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
  ai_generated?: boolean
  generation_topic?: string | null
  reading_time_minutes?: number | null
}

const focusTracks = ['Applied AI', 'Software Systems', 'Business Automation', 'Infrastructure']

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Draft'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getExcerpt = (post: BlogPost, length = 170) => {
  const text = post.excerpt || stripMarkdown(post.content)
  return text.length > length ? `${text.slice(0, length).trim()}...` : text
}

const BlogCover = ({ post, priority = false }: { post: BlogPost; priority?: boolean }) => {
  if (post.image_url) {
    return (
      <Image
        src={post.image_url}
        alt={post.title}
        fill
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        unoptimized
      />
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[hsl(var(--foreground))]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)),hsl(var(--accent))_55%,hsl(var(--secondary)))] opacity-95" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/20" />
      <div className="absolute bottom-5 left-5 right-5">
        <span className="inline-flex rounded-md bg-white/14 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white/90">
          {post.category || 'Engineering'}
        </span>
        <p className="mt-3 max-w-[18rem] text-lg font-black leading-tight text-white">
          {post.generation_topic || post.title}
        </p>
      </div>
    </div>
  )
}

const PostMeta = ({ post }: { post: BlogPost }) => {
  const readTime = post.reading_time_minutes || getReadingTimeMinutes(post.content)

  return (
    <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
      <span className="text-[hsl(var(--accent))]">{post.category || 'Engineering'}</span>
      <span className="h-1 w-1 rounded-full bg-[hsl(var(--border))]" />
      <time dateTime={post.published_at || undefined} className="inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(post.published_at)}
      </time>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        {readTime} min
      </span>
    </div>
  )
}

export default function Blog({ isActive = false, initialPosts }: BlogProps) {
  const [loading, setLoading] = useState(!initialPosts)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialPosts || [])
  const [activeCategory, setActiveCategory] = useState('All')

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
      if (data) setBlogPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    const unique = Array.from(new Set(blogPosts.map((post) => post.category).filter(Boolean)))
    return ['All', ...unique]
  }, [blogPosts])

  const filteredPosts = useMemo(
    () =>
      activeCategory === 'All'
        ? blogPosts
        : blogPosts.filter((post) => post.category === activeCategory),
    [activeCategory, blogPosts],
  )

  const [featuredPost, ...remainingPosts] = filteredPosts

  if (loading) {
    return (
      <article className={cn('w-full max-w-full m-0 p-0', isActive ? 'block' : 'hidden')} data-page="blog">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
          <Loader2 size={40} className="animate-spin text-[hsl(var(--accent))]" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Loading notes</p>
        </div>
      </article>
    )
  }

  return (
    <AnimatedPage>
      <article className={cn('w-full max-w-full m-0 p-0', isActive ? 'block' : 'hidden')} data-page="blog">
        <motion.header
          className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={scrollRevealTransition}
        >
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.7] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[hsl(var(--accent))]">
              <Sparkles className="h-3.5 w-3.5" />
              Trend-backed engineering notes
            </div>
            <h1 className="max-w-4xl text-[2rem] font-black leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
              Practical writing on software systems, AI, and the work behind reliable products.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
              Short technical essays designed to show judgment: what is changing, why it matters, and what I would build with it.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[24rem]">
            {[
              { label: 'Cadence', value: '3/wk' },
              { label: 'Focus', value: 'SE + AI' },
              { label: 'Mode', value: 'Draft first' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.72] p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{item.label}</p>
                <p className="mt-1 text-lg font-black text-[hsl(var(--foreground))]">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.header>

        <section className="mb-6 flex flex-col gap-3 border-y border-[hsl(var(--border))] py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-bold transition-colors',
                  activeCategory === category
                    ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-white'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--card))/0.7] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                )}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            <Search className="h-3.5 w-3.5" />
            {focusTracks.map((track) => (
              <span key={track}>{track}</span>
            ))}
          </div>
        </section>

        {blogPosts.length === 0 ? (
          <section className="py-20 text-center">
            <p className="text-lg font-black text-[hsl(var(--foreground))]">No posts published yet</p>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">AI drafts can be generated from the admin blog screen.</p>
          </section>
        ) : (
          <section className="grid gap-6">
            {featuredPost && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={scrollRevealTransition}>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group grid overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent))/0.35] hover:shadow-lg lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
                >
                  <figure className="relative m-0 min-h-[18rem] overflow-hidden bg-[hsl(var(--muted))]">
                    <BlogCover post={featuredPost} priority />
                  </figure>
                  <div className="flex min-w-0 flex-col p-6 sm:p-8">
                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[hsl(var(--accent))/0.1] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[hsl(var(--accent))]">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Featured signal
                    </div>
                    <PostMeta post={featuredPost} />
                    <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
                      {getExcerpt(featuredPost, 260)}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                      <div className="flex flex-wrap gap-2">
                        {(featuredPost.tags || []).slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.65] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[hsl(var(--accent))]">
                        Read note <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            <motion.ul
              className="grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 xl:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {remainingPosts.map((post) => (
                <motion.li key={post.id} variants={staggerChildScale} className="group">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent))/0.35] hover:shadow-lg"
                  >
                    <figure className="relative m-0 h-48 overflow-hidden bg-[hsl(var(--muted))]">
                      <BlogCover post={post} />
                    </figure>
                    <div className="flex flex-1 flex-col p-5">
                      <PostMeta post={post} />
                      <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {getExcerpt(post)}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4">
                        <div className="flex max-h-[1.65rem] flex-wrap gap-1.5 overflow-hidden">
                          {(post.tags || []).slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-md bg-[hsl(var(--muted))/0.65] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                          <Eye className="h-4 w-4" />
                          {post.view_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </section>
        )}
      </article>
    </AnimatedPage>
  )
}

import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, ExternalLink, Sparkles } from 'lucide-react'
import { BlogPosting, WithContext } from 'schema-dts'
import { supabase } from '@/integrations/supabase/client'
import { JsonLd } from '@/components/seo/JsonLd'
import { getReadingTimeMinutes, markdownToHtml, stripMarkdown } from '@/lib/blog-markdown'

export const revalidate = 3600

interface Props {
    params: Promise<{
        slug: string
    }>
}

interface BlogSource {
    title: string
    url: string
}

export async function generateStaticParams() {
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('is_published', true)

    return (posts || []).map((post) => ({ slug: post.slug }))
}

async function getBlogPost(slug: string, incrementView = false) {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (error || !data) return null

    if (incrementView) {
        await (supabase as unknown as { rpc: (fn: string, params: Record<string, string>) => Promise<unknown> }).rpc(
            'increment_page_view',
            { page_slug: slug },
        )
    }

    return data
}

const parseSources = (value: unknown): BlogSource[] => {
    if (!Array.isArray(value)) return []

    return value
        .map((source) => source as Partial<BlogSource>)
        .filter((source) => source.url && /^https?:\/\//.test(source.url))
        .map((source) => ({
            title: source.title || source.url || 'Source',
            url: source.url || '',
        }))
}

const getDescription = (post: Awaited<ReturnType<typeof getBlogPost>>) => {
    if (!post) return 'Technical article by Msah Ambooka.'
    return post.meta_description || post.excerpt || stripMarkdown(post.content).slice(0, 160)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params
    const post = await getBlogPost(resolvedParams.slug)

    if (!post) {
        return { title: 'Post Not Found' }
    }

    const description = getDescription(post)
    const title = post.seo_title || post.title
    const publishedTime = post.published_at || new Date().toISOString()

    return {
        title,
        description,
        keywords: post.tags || [],
        alternates: {
            canonical: `/blog/${resolvedParams.slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime,
            modifiedTime: post.updated_at || publishedTime,
            authors: ['Msah Ambooka'],
            images: post.image_url ? [{ url: post.image_url, alt: post.title }] : [{ url: '/og-image.png', alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: post.image_url ? [post.image_url] : ['/og-image.png'],
        },
    }
}

const ArticleCover = ({ title, imageUrl, category }: { title: string; imageUrl: string | null; category: string }) => {
    if (imageUrl) {
        return (
            <Image
                src={imageUrl}
                alt={title}
                fill
                priority
                className="object-cover"
                unoptimized
            />
        )
    }

    return (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)),hsl(var(--accent))_55%,hsl(var(--secondary)))]">
            <div className="absolute inset-x-0 top-0 h-px bg-white/35" />
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/20" />
            <div className="absolute bottom-8 left-8 right-8">
                <span className="inline-flex rounded-md bg-white/14 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/90">
                    {category || 'Engineering'}
                </span>
                <p className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">{title}</p>
            </div>
        </div>
    )
}

export default async function BlogPostPage({ params }: Props) {
    const resolvedParams = await params
    const post = await getBlogPost(resolvedParams.slug, true)

    if (!post) notFound()

    const sources = parseSources(post.source_urls)
    const readingTime = post.reading_time_minutes || getReadingTimeMinutes(post.content)
    const articleBody = stripMarkdown(post.content)
    const jsonLd: WithContext<BlogPosting> = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.image_url ? [post.image_url] : ['https://ambooka.dev/og-image.png'],
        datePublished: post.published_at || undefined,
        dateModified: post.updated_at || post.published_at || undefined,
        author: {
            '@type': 'Person',
            name: 'Msah Ambooka',
            url: 'https://ambooka.dev',
        },
        publisher: {
            '@type': 'Person',
            name: 'Msah Ambooka',
        },
        mainEntityOfPage: `https://ambooka.dev/blog/${post.slug}`,
        description: getDescription(post),
        keywords: post.tags?.join(', '),
        wordCount: articleBody.split(/\s+/).filter(Boolean).length,
        timeRequired: `PT${readingTime}M`,
        articleBody,
    }

    return (
        <article className="mx-auto w-full max-w-5xl">
            <JsonLd schema={jsonLd} />

            <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--accent))]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to blog
            </Link>

            <header className="mb-8">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--accent))/0.1] px-3 py-1 text-[hsl(var(--accent))]">
                        <Sparkles className="h-3.5 w-3.5" />
                        {post.ai_generated ? 'AI-assisted draft' : post.category}
                    </span>
                    <span>{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-[hsl(var(--border))]" />
                    <time dateTime={post.published_at || undefined} className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.published_at || Date.now()).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </time>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {readingTime} min read
                    </span>
                </div>

                <h1 className="max-w-4xl text-[2.25rem] font-black leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
                    {post.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
                    {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span key={tag} className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.72] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            <figure className="relative mb-10 h-[22rem] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] shadow-md sm:h-[28rem]">
                <ArticleCover title={post.title} imageUrl={post.image_url} category={post.category} />
            </figure>

            <div
                className="blog-article mx-auto max-w-3xl text-[hsl(var(--foreground))]"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
            />

            {sources.length > 0 && (
                <section className="mx-auto mt-12 max-w-3xl border-t border-[hsl(var(--border))] pt-8">
                    <h2 className="text-sm font-black uppercase tracking-widest text-[hsl(var(--foreground))]">Sources</h2>
                    <ul className="mt-4 grid gap-3">
                        {sources.map((source) => (
                            <li key={source.url}>
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start justify-between gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.72] p-4 text-sm font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
                                >
                                    <span>{source.title}</span>
                                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </article>
    )
}

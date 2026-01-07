
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
    params: {
        slug: string
    }
}

async function getBlogPost(slug: string) {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (error || !data) {
        return null
    }

    // Increment view count (fire and forget)
    // Note: In server component, this might not be ideal without cache revalidation, 
    // but acceptable for simple counter. ideally should be an API route.
    await supabase.rpc('increment_page_view', { page_slug: slug })

    return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getBlogPost(params.slug)

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    const publishedTime = post.published_at || new Date().toISOString()

    return {
        title: `${post.title} | Abdulrahman Ambooka`,
        description: post.excerpt || post.content.slice(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.slice(0, 160),
            type: 'article',
            publishedTime,
            authors: ['Abdulrahman Ambooka'],
            images: post.image_url ? [{ url: post.image_url }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.content.slice(0, 160),
            images: post.image_url ? [post.image_url] : [],
        },
        alternates: {
            canonical: `/blog/${params.slug}`,
        }
    }
}

export default async function BlogPostPage({ params }: Props) {
    const post = await getBlogPost(params.slug)

    if (!post) {
        notFound()
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.image_url ? [post.image_url] : [],
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: {
            '@type': 'Person',
            name: 'Abdulrahman Ambooka',
            url: 'https://ambooka.dev'
        },
        description: post.excerpt || post.content.slice(0, 160),
        articleBody: post.content
    }

    return (
        <>
            <Sidebar />
            <main className="main-content relative min-h-screen pb-12">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* Navigation Bar Replacement */}
                <nav
                    className="navbar absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10"
                    style={{
                        background: 'rgba(30, 30, 31, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Link
                        href="/#blog"
                        className="flex items-center gap-2 text-[var(--accent-color)] hover:text-[var(--accent-color-hover)] transition-colors font-medium"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Portfolio</span>
                    </Link>
                </nav>

                <article
                    className="blog-active px-6 pt-24 max-w-4xl mx-auto"
                    style={{ animation: 'fadeInUp 0.6s ease-out' }}
                >
                    <header className="mb-10 text-center">
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {post.tags.map((tag: string, idx: number) => (
                                    <span key={idx} className="bg-[var(--accent-color-alpha)] text-[var(--accent-color)] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h1
                            className="h1 article-title mb-6 leading-tight"
                            style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}
                        >
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-[var(--text-secondary)] text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <time dateTime={post.published_at}>
                                    {new Date(post.published_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                            {/* Placeholder for read time if we want to calculate it */}
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>5 min read</span>
                            </div>
                        </div>
                    </header>

                    {post.image_url && (
                        <figure className="w-full h-[400px] relative rounded-xl overflow-hidden mb-12 shadow-2xl">
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </figure>
                    )}

                    <div className="blog-content-body prose prose-lg prose-invert max-w-none text-[var(--text-gray)]">
                        {/* Note: In a real app, use a markdown parser like react-markdown here */}
                        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                    </div>
                </article>
            </main>

            {/* Styles moved to inline/tailwind to avoid styled-jsx issues in Server Component */}
        </>
    )
}

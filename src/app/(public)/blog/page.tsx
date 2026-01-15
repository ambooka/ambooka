import Blog from '@/components/Blog'
import { supabase } from '@/integrations/supabase/client'
import { Metadata } from 'next'

// ISR: Revalidate every hour
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
    const { data: latestPost } = await supabase
        .from('blog_posts')
        .select('title, excerpt')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(1)
        .single()

    const title = 'Blog | Abdulrahman Ambooka'
    const description = latestPost
        ? `Latest Insight: ${latestPost.title}. ${latestPost.excerpt || 'Read insights on MLOps and AI Engineering.'}`
        : 'Insights on MLOps, AI Engineering, Cloud Architecture, and Software Development by Abdulrahman Ambooka.'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
    }
}

export default async function BlogListPage() {
    const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    return <Blog isActive={true} initialPosts={blogPosts || []} />
}

import { MetadataRoute } from 'next'
import { supabase } from '@/integrations/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ambooka.dev' // Replace with your actual domain

    // Fetch all blog posts for dynamic routes
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('is_published', true)

    const blogUrls = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const routes = [
        '',
        '/resume',
        '/portfolio',
        '/blog',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes, ...blogUrls]
}

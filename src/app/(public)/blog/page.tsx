import Blog from '@/components/Blog'
import { supabase } from '@/integrations/supabase/client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog | Abdulrahman Ambooka',
    description: 'Insights on MLOps, AI Engineering, Cloud Architecture, and Software Development by Abdulrahman Ambooka.',
}

export default async function BlogListPage() {
    const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    return <Blog isActive={true} initialPosts={blogPosts || []} />
}

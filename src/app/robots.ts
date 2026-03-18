import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/auth/', '/private/'],
            },
            // AI/LLM Crawlers - Allow for discoverability
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'CCBot',
                    'Google-Extended',
                    'Applebot-Extended',
                    'anthropic-ai',
                    'Claude-Web',
                    'PerplexityBot',
                    'Googlebot'
                ],
                allow: '/',
            }
        ],
        sitemap: 'https://ambooka.dev/sitemap.xml',
    }
}

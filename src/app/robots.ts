import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/auth/', '/private/'],
            },
            {
                userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'Applebot-Extended'],
                allow: '/',
            }
        ],
        sitemap: 'https://ambooka.dev/sitemap.xml',
    }
}

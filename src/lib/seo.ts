/**
 * SEO and Metadata Utilities
 * Provides helper functions for generating SEO-friendly metadata and structured data
 */

export interface PersonSchemaData {
    name: string
    jobTitle: string
    url: string
    image?: string
    email?: string
    description?: string
    sameAs?: string[]
}

/**
 * Generates JSON-LD structured data for Person schema
 * @see https://schema.org/Person
 */
export function generatePersonSchema(data: PersonSchemaData): string {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name,
        jobTitle: data.jobTitle,
        url: data.url,
        ...(data.image && { image: data.image }),
        ...(data.email && { email: data.email }),
        ...(data.description && { description: data.description }),
        ...(data.sameAs && { sameAs: data.sameAs }),
    }

    return JSON.stringify(schema)
}

/**
 * Generates JSON-LD structured data for WebSite schema
 * @see https://schema.org/WebSite
 */
export function generateWebsiteSchema(url: string, name: string, description: string): string {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url,
        name,
        description,
    }

    return JSON.stringify(schema)
}

/**
 * Generates canonical URL for a page
 */
export function getCanonicalUrl(path: string = '', baseUrl: string = 'https://ambooka.dev'): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
}

/**
 * Generates optimized page title
 */
export function generatePageTitle(title: string, includeBase: boolean = true): string {
    if (!includeBase) return title
    return `${title} | Abdulrahman Ambooka`
}

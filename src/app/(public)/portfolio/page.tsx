import Portfolio from '@/components/Portfolio'
import { GitHubService, GitHubRepo } from '@/services/github'
import { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { ItemList, WithContext } from 'schema-dts'
import { projects as proofProjects } from '@/data/war-mode-projects'

// ISR: Revalidate every hour
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Portfolio',
        description: 'Featured software engineering, business systems, payment integration, IT infrastructure, and applied AI/ML projects by Msah Ambooka.',
        openGraph: {
            title: 'Portfolio | Msah Ambooka',
            description: 'Proof-first project work across business systems, payments, IT infrastructure, and applied AI/ML.',
            images: ['/og-image.png'], // Ensure fallback consistency
        }
    }
}

const githubConfig = {
    username: 'ambooka',
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
    featuredThreshold: 5,
    maxRepos: 100,
    sortBy: 'updated' as const
}

const getProjectImage = (repo: GitHubRepo): string => {
    if (repo.homepage) {
        return `https://opengraph.githubassets.com/1/${repo.owner?.login}/${repo.name}`
    }
    return 'https://opengraph.githubassets.com/1/torvalds/reddit-news'
}


interface Project {
    id: number
    category: string
    title: string
    image: string
    url: string
    description: string
    stars: number
    language: string
    isPrivate: boolean
    ownerLogin?: string
    homepage?: string | null
    isFeatured: boolean
    updatedAt?: string
}

export default async function PortfolioPage() {
    let initialProjects: Project[] = []
    const featuredProjects = proofProjects
        .filter(project => project.featured)
        .sort((a, b) => a.displayOrder - b.displayOrder)

    try {
        const githubService = new GitHubService(githubConfig.token)
        const repos = await githubService.getRepositories(githubConfig.username, {
            maxRepos: githubConfig.maxRepos,
            sortBy: githubConfig.sortBy,
            includePrivate: Boolean(githubConfig.token)
        })

        initialProjects = repos.map(repo => ({
            id: repo.id,
            category: repo.language?.toLowerCase() || 'other',
            title: repo.name,
            image: getProjectImage(repo),
            url: repo.html_url,
            description: repo.description || '',
            stars: repo.stargazers_count,
            language: repo.language || 'Other',
            isPrivate: !!repo.private,
            ownerLogin: repo.owner?.login,
            homepage: repo.homepage,
            isFeatured: repo.stargazers_count >= githubConfig.featuredThreshold || !!repo.homepage,
            updatedAt: repo.pushed_at || repo.updated_at
        }))

        initialProjects.sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
            return dateB - dateA
        })
    } catch (error) {
        console.error('Failed to fetch projects server-side:', error)
    }

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: [
            ...featuredProjects.map((project, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: project.title,
                    description: project.oneLine,
                    url: `https://ambooka.dev${project.proof.caseStudy || '/portfolio'}`
                }
            })),
            ...initialProjects.map((project, index) => ({
            '@type': 'ListItem',
            position: featuredProjects.length + index + 1,
            item: {
                '@type': 'SoftwareSourceCode',
                name: project.title,
                description: project.description,
                url: project.url,
                programmingLanguage: project.language
            }
        }))
        ]
    } as unknown as WithContext<ItemList>

    return (
        <>
            <JsonLd schema={itemListSchema} />
            <Portfolio isActive={true} github={githubConfig} initialProjects={initialProjects} featuredProjects={featuredProjects} />
        </>
    )
}

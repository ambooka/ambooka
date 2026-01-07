import Portfolio from '@/components/Portfolio'
import { GitHubService, GitHubRepo } from '@/services/github'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Portfolio | Abdulrahman Ambooka',
    description: 'Explore the featured projects, open-source contributions, and technical case studies by Abdulrahman Ambooka in AI, MLOps, and Cloud Engineering.',
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

export default async function PortfolioPage() {
    let initialProjects: any[] = []

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

    return <Portfolio isActive={true} github={githubConfig} initialProjects={initialProjects} />
}

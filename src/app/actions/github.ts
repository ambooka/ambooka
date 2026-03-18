'use server'

import { GitHubService } from '@/services/github'

export async function fetchProjectReadme(owner: string, repo: string): Promise<{ content?: string; error?: string }> {
    try {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
        const service = new GitHubService(token)
        const content = await service.getReadme(owner, repo)
        return { content }
    } catch (error) {
        console.error('Failed to fetch README:', error)
        return { error: 'Failed to fetch README content' }
    }
}

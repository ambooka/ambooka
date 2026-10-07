'use server'

import { GitHubService } from '@/services/github'

export async function fetchProjectReadme(owner: string, repo: string): Promise<{ content?: string; error?: string }> {
    try {
        const token = process.env.GITHUB_TOKEN
        const service = new GitHubService(token)
        const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
        if (!response.ok || (await response.json()).private) return { error: 'Only public repositories can be previewed.' };
        const content = await service.getReadme(owner, repo)
        return { content }
    } catch (error) {
        console.error('Failed to fetch README:', error)
        return { error: 'Failed to fetch README content' }
    }
}

// GitHub service using native fetch instead of Octokit

export interface GitHubRepo {
    id: number
    name: string
    full_name: string
    html_url: string
    description?: string
    language?: string | null
    stargazers_count: number
    owner?: { login: string }
    homepage?: string | null
    updated_at?: string
    pushed_at?: string
    [key: string]: unknown
}

export class GitHubService {
    private token?: string
    private base = 'https://api.github.com'

    constructor(token?: string) {
        this.token = token
    }

    private headers() {
        const h: Record<string, string> = { 'Accept': 'application/vnd.github+json' }
        if (this.token) h['Authorization'] = `token ${this.token}`
        return h
    }

    async getRepositories(username: string, opts: { maxRepos?: number; sortBy?: string; includePrivate?: boolean } = {}): Promise<GitHubRepo[]> {
        const per_page = Math.max(1, Math.min(100, opts.maxRepos || 100))
        const sort = opts.sortBy || 'updated'

        // If includePrivate is true we must use the authenticated endpoint /user/repos;
        // note: this will return repos for the token owner — not arbitrary usernames.
        const url = opts.includePrivate
            ? `${this.base}/user/repos?per_page=${per_page}&sort=${encodeURIComponent(sort)}&visibility=all`
            : `${this.base}/users/${encodeURIComponent(username)}/repos?per_page=${per_page}&sort=${encodeURIComponent(sort)}&type=public`

        const res = await fetch(url, { headers: this.headers() })
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`GitHub API error ${res.status}: ${text}`)
        }
        const data = await res.json()
        return data as GitHubRepo[]
    }

    /**
     * Fetch raw README.md content for a repository.
     * - Returns raw markdown text when successful.
     * - Requires authentication to read private repo READMEs.
     */
    async getReadme(owner: string, repo: string): Promise<string> {
        const url = `${this.base}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`
        // Request raw markdown text
        const headers = { ...this.headers(), Accept: 'application/vnd.github.html' }
        const res = await fetch(url, { headers })
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Failed to fetch README (${res.status}): ${text}`)
        }
        const markdown = await res.text()
        return markdown
    }
}
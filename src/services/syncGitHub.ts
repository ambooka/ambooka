import { GitHubService } from './github'
import { supabase } from '@/integrations/supabase/client'

export interface SyncResult {
    success: boolean
    synced: number
    created: number
    updated: number
    errors: string[]
}

/**
 * Sync GitHub repositories to Supabase projects table (client-side).
 * - Fetches all repos from GitHub
 * - Upserts to projects table (matches by github_url)
 * - Preserves admin-controlled fields: is_featured, status, display_order, stack
 */
export async function syncGitHubProjects(
    username: string,
    token?: string,
    options: { maxRepos?: number; includePrivate?: boolean } = {}
): Promise<SyncResult> {
    const result: SyncResult = {
        success: false,
        synced: 0,
        created: 0,
        updated: 0,
        errors: []
    }

    try {
        // 1. Fetch repos from GitHub
        const githubService = new GitHubService(token)
        const repos = await githubService.getRepositories(username, {
            maxRepos: options.maxRepos || 100,
            sortBy: 'updated',
            includePrivate: options.includePrivate && Boolean(token)
        })

        console.log(`[SyncGitHub] Fetched ${repos.length} repos from GitHub`)

        if (repos.length === 0) {
            result.errors.push('No repositories found on GitHub')
            return result
        }

        // 2. Get existing projects to check which already exist
        const { data: existingProjects, error: fetchError } = await supabase
            .from('projects')
            .select('id, title, github_url')

        if (fetchError) {
            result.errors.push(`Failed to fetch existing projects: ${fetchError.message}`)
            return result
        }

        const existingByUrl = new Map(
            existingProjects?.map(p => [p.github_url, p.id]) || []
        )
        const existingByTitle = new Map(
            existingProjects?.map(p => [p.title.toLowerCase(), p.id]) || []
        )

        console.log(`[SyncGitHub] Found ${existingProjects?.length || 0} existing projects in DB`)

        // 3. Process each repo
        for (const repo of repos) {
            // Check if project exists (by URL or by title)
            const existingId = existingByUrl.get(repo.html_url) || existingByTitle.get(repo.name.toLowerCase())

            const projectData = {
                title: repo.name,
                description: repo.description || null,
                github_url: repo.html_url,
                live_url: repo.homepage || null
            }

            if (existingId) {
                // Update existing - only update basic fields, preserve admin-controlled fields
                const { error } = await supabase
                    .from('projects')
                    .update({
                        description: projectData.description,
                        github_url: projectData.github_url,
                        live_url: projectData.live_url
                    })
                    .eq('id', existingId)

                if (error) {
                    result.errors.push(`Update ${repo.name}: ${error.message}`)
                } else {
                    result.updated++
                }
            } else {
                // Insert new project with default values
                const { error } = await supabase
                    .from('projects')
                    .insert({
                        ...projectData,
                        status: 'Deployed',
                        is_featured: repo.stargazers_count >= 5 || Boolean(repo.homepage),
                        display_order: 999,
                        stack: repo.language ? [repo.language] : []
                    })

                if (error) {
                    result.errors.push(`Create ${repo.name}: ${error.message}`)
                } else {
                    result.created++
                }
            }

            result.synced++
        }

        result.success = result.synced > 0
        console.log(`[SyncGitHub] Done: ${result.created} created, ${result.updated} updated, ${result.errors.length} errors`)

    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        result.errors.push(`Sync failed: ${msg}`)
        console.error('[SyncGitHub] Error:', error)
    }

    return result
}

import About from '@/components/About'
import { supabase } from '@/integrations/supabase/client'
import { GitHubService } from '@/services/github'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Abdulrahman Ambooka | MLOps Architect & Software Engineer',
    description: 'Portfolio of Abdulrahman Ambooka, an MLOps Architect and Software Engineer specializing in AI deployment, Kubernetes, and cloud infrastructure.',
}

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

export default async function DashboardPage() {
    // Fetch initial data for About component
    const [personalInfoResult, skillsResult, testimonialsResult] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('skills').select('*').order('display_order'),
        supabase.from('testimonials').select('*').order('display_order')
    ])

    const personalInfo = personalInfoResult.data
    const testimonials = testimonialsResult.data || []

    // Map technologies from skills
    const technologies = (skillsResult.data || []).map(skill => ({
        id: skill.id,
        name: skill.name,
        logo_url: skill.icon_url || `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.name.toLowerCase()}/${skill.name.toLowerCase()}-original.svg`,
        category: skill.category,
        display_order: skill.display_order || 0
    }))

    // Fetch GitHub stats
    let githubStats = null
    try {
        const githubService = new GitHubService(GITHUB_TOKEN)
        const repos = await githubService.getRepositories(GITHUB_USERNAME, {
            maxRepos: 100,
            sortBy: 'updated',
            includePrivate: Boolean(GITHUB_TOKEN)
        })

        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
        const publicRepos = repos.filter(r => !r.private).length

        const langCounts: Record<string, number> = {}
        repos.forEach(repo => {
            const lang = repo.language || 'Other'
            langCounts[lang] = (langCounts[lang] || 0) + 1
        })

        const LANGUAGE_CONFIG: Record<string, { color: string; logo?: string }> = {
            TypeScript: { color: '#3178c6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
            JavaScript: { color: '#f7df1e', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
            Python: { color: '#3776ab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
            Go: { color: '#00add8', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg' },
            Java: { color: '#ed8b00', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
            'C++': { color: '#00599c', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
            'C#': { color: '#239120', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
            Shell: { color: '#89e051', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg' },
            Dockerfile: { color: '#2496ed', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
            HCL: { color: '#7b42bc', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
            HTML: { color: '#e34c26', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
            CSS: { color: '#663399', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
            Vue: { color: '#42b883', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
            Rust: { color: '#dea584' },
            Ruby: { color: '#cc342d', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
            PHP: { color: '#777bb4', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
            Kotlin: { color: '#7f52ff', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
            Swift: { color: '#f05138', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
            Dart: { color: '#00b4ab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
            Other: { color: '#6b7280' }
        }

        const topLanguages = Object.entries(langCounts)
            .filter(([name]) => name !== 'Other')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, count]) => ({
                name,
                count,
                color: LANGUAGE_CONFIG[name]?.color || '#6b7280',
                logo: LANGUAGE_CONFIG[name]?.logo
            }))

        let followers = 0
        try {
            const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
                headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}
            })
            if (userRes.ok) {
                const userData = await userRes.json()
                followers = userData.followers || 0
            }
        } catch (e) {
            console.error('Failed to fetch user profile:', e)
        }

        githubStats = { totalRepos: repos.length, totalStars, followers, publicRepos, topLanguages }
    } catch (error) {
        console.error('Failed to fetch GitHub stats server-side:', error)
    }

    const initialData = {
        personalInfo: personalInfo as any,
        testimonials: testimonials as any[],
        technologies,
        githubStats
    }

    return <About isActive={true} initialData={initialData} />
}

import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

// ISR: Revalidate every hour
export const revalidate = 3600;

const PROFESSIONAL_TITLE = 'Software Engineer, Systems & AI';
const PROFESSIONAL_SCOPE = 'Software engineer based in Nairobi, Kenya working across full-stack products, business systems, payment integrations, infrastructure, and applied AI/ML.';
const LEGACY_TITLE_PATTERN = /Full-Stack Developer|AI\/ML Engineering|Software Engineer & Full-Stack/i;

const normalizeProfessionalTitle = (title?: string | null) => {
    const value = title?.trim();
    if (!value || LEGACY_TITLE_PATTERN.test(value)) return PROFESSIONAL_TITLE;
    return value;
};

export async function GET() {
    // Fetch dynamic content from Supabase
    const [personalInfoResult, blogPostsResult, skillsResult] = await Promise.all([
        supabase.from('personal_info').select('full_name, title, summary').single(),
        supabase.from('blog_posts').select('title, slug').eq('is_published', true).order('published_at', { ascending: false }).limit(5),
        supabase.from('skills').select('name, category').order('proficiency_level', { ascending: false }).limit(15)
    ]);

    const personalInfo = personalInfoResult.data;
    const blogPosts = blogPostsResult.data || [];
    const skills = skillsResult.data || [];
    const title = normalizeProfessionalTitle(personalInfo?.title);

    // Group skills by category
    const skillsByCategory: Record<string, string[]> = {};
    skills.forEach(skill => {
        const cat = skill.category || 'Other';
        if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
        skillsByCategory[cat].push(skill.name);
    });

    const skillsSection = Object.entries(skillsByCategory)
        .map(([category, skillNames]) => `- **${category}**: ${skillNames.join(', ')}`)
        .join('\n');

    const blogSection = blogPosts.length > 0
        ? blogPosts.map(post => `- [${post.title}](https://ambooka.dev/blog/${post.slug})`).join('\n')
        : '*(No published posts yet)*';

    const content = `
# ${personalInfo?.full_name || 'Msah Ambooka'} - ${title}

## Identity & Core Focus
${personalInfo?.summary || PROFESSIONAL_SCOPE}

- **Role**: ${title}
- **Location**: Nairobi, Kenya
- **Availability**: Open for freelance, contract, and high-impact full-time roles.
- **Website**: https://ambooka.dev
- **GitHub**: https://github.com/ambooka
- **LinkedIn**: https://www.linkedin.com/in/abdulrahman-ambooka/

## Technical Expertise

${skillsSection || `
- **Languages**: Python, TypeScript, Go, SQL.
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion.
- **Backend**: FastAPI, Node.js, PostgreSQL, Redis, Supabase.
    - **Infrastructure**: Docker, Linux, Nginx, GitHub Actions, Windows Server, Active Directory, TCP/IP networking.
`}

## Recent Blog Posts

${blogSection}

## Applied AI/ML Direction
- **Computer Vision**: YOLO, OpenCV, PyTorch, Flask inference APIs, real-time stream processing.
- **Production Software Base**: TypeScript, Python, FastAPI, PostgreSQL, Docker, and GitHub Actions.
- **LLM/RAG Learning Track**: LangChain, retrieval patterns, vector search, and model evaluation foundations.
- **Current Positioning**: Software engineering and business systems first, with applied AI/ML as a growing technical direction.

## Contact
- **Email**: abdulrahmanambooka@gmail.com
- **Twitter**: @ambooka

## Context & Region
- **Ecosystem**: Silicon Savannah, Nairobi Tech, African Tech Talent.
- **Remote Work**: Experienced in remote collaboration, asynchronous communication, and distributed teams.

## Hiring & Collaboration
- **Keywords**: Hire Software Engineer Kenya, Full-Stack Developer Nairobi, Backend Developer, Payment Integration Developer, IT Systems Engineer, Applied AI/ML Developer.
- **Engagement Models**: Full-time, contract, freelance, and project-based collaboration.

---
*This file is auto-generated from the Ambooka.dev database. Last updated: ${new Date().toISOString()}*
`.trim();

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
        },
    });
}

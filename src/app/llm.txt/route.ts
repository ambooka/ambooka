import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

// ISR: Revalidate every hour
export const revalidate = 3600;

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
# ${personalInfo?.full_name || 'Abdulrahman Ambooka'} - ${personalInfo?.title || 'MLOps Architect & Software Engineer'}

## Identity & Core Focus
${personalInfo?.summary || 'MLOps Architect and Full-Stack Software Engineer based in Nairobi, Kenya. Specializes in building scalable AI platforms, designing cloud-native infrastructure, and deploying machine learning models to production.'}

- **Role**: ${personalInfo?.title || 'MLOps Architect, Platform Engineer, Full-Stack Developer'}
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
- **Infrastructure**: Kubernetes (K8s), Docker, Terraform, AWS, Google Cloud.
`}

## Recent Blog Posts

${blogSection}

## AI & MLOps
- **Orchestration**: Kubeflow, Airflow.
- **Model Serving**: Triton Inference Server, TorchServe, KServe.
- **LLM Stack**: LangChain, LlamaIndex, OpenAI API, HuggingFace Transformers.
- **Practices**: CI/CD for ML (CML), Experiment Tracking (MLflow/Weights & Biases).

## Contact
- **Email**: (Check Website)
- **Twitter**: @ambooka

## Context & Region
- **Ecosystem**: Silicon Savannah, Nairobi Tech, African Tech Talent.
- **Remote Work**: Experienced in remote collaboration, asynchronous communication, and distributed teams.

## Hiring & Collaboration
- **Keywords**: Hire MLOps Engineer, Contract AI Engineer, Freelance Backend Developer, Tech Lead/SRE Consultant.
- **Engagement Models**: Freelance, Contract, Technical Co-founder, Fractional CTO.

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

import Resume from '@/components/Resume'
import { supabase } from '@/integrations/supabase/client'
import { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { Person, WithContext } from 'schema-dts'

interface PersonalInfoMock {
    id: string
    full_name: string
    title: string
    email: string
    summary: string
    phone: string | null
    location: string | null
    about_text: string | null
    linkedin_url: string | null
    github_url: string | null
    website_url: string | null
    twitter_url: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
    [key: string]: unknown
}

const PROFESSIONAL_TITLE = 'Software Engineer, Systems & AI'
const LEGACY_TITLE_PATTERN = /Full-Stack Developer|AI\/ML Engineering|Software Engineer & Full-Stack/i

const normalizeProfessionalTitle = (title?: string | null) => {
    const value = title?.trim()
    if (!value || LEGACY_TITLE_PATTERN.test(value)) return PROFESSIONAL_TITLE
    return value
}

// ISR: Revalidate every hour
export const revalidate = 3600

export const metadata: Metadata = {
    title: 'Resume',
    description: 'Technical expertise, professional experience, and educational background of Msah Ambooka, Software Engineer working across systems and applied AI.',
}

export default async function ResumePage() {
    const [personalInfoResult, educationResult, experienceResult, skillsResult] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('education').select('*').order('start_date', { ascending: false }),
        supabase.from('experience').select('*').order('start_date', { ascending: false }),
        supabase.from('skills').select('*').order('proficiency_level', { ascending: false })
    ])

    const personalInfo = personalInfoResult.data
    const skills = skillsResult.data || []
    const normalizedPersonalInfo = personalInfo
        ? { ...personalInfo, title: normalizeProfessionalTitle(personalInfo.title) }
        : null

    const initialData = {
        personal_info: normalizedPersonalInfo || ({
            id: 'mock',
            full_name: 'Msah Ambooka',
            title: PROFESSIONAL_TITLE,
            email: 'abdulrahmanambooka@gmail.com',
            summary: 'Computer Science graduate with hands-on experience across full-stack software, IT infrastructure, ERP implementation, payment integrations, and applied AI/ML.',
            phone: null,
            location: 'Nairobi, Kenya',
            about_text: null,
            linkedin_url: null,
            github_url: 'https://github.com/ambooka',
            website_url: 'https://ambooka.dev',
            twitter_url: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as PersonalInfoMock),
        education: educationResult.data || [],
        experience: experienceResult.data || [],
        skills: skills
    }

    // JSON-LD Person schema for SEO/LLM discoverability
    const personSchema: WithContext<Person> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personalInfo?.full_name || 'Msah Ambooka',
        jobTitle: normalizeProfessionalTitle(personalInfo?.title),
        url: 'https://ambooka.dev',
        sameAs: [
            'https://github.com/ambooka',
            'https://www.linkedin.com/in/abdulrahman-ambooka/',
            'https://twitter.com/ambooka'
        ],
        knowsAbout: skills.slice(0, 10).map(s => s.name),
        worksFor: {
            '@type': 'Organization',
            name: 'Freelance / Open to Work'
        }
    }

    return (
        <>
            <JsonLd schema={personSchema} />
            <Resume isActive={true} initialData={initialData} />
        </>
    )
}

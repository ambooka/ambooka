import Resume from '@/components/Resume'
import { supabase } from '@/integrations/supabase/client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Resume | Abdulrahman Ambooka',
    description: 'Technical expertise, professional experience, and educational background of Abdulrahman Ambooka, MLOps Architect & Software Engineer.',
}

export default async function ResumePage() {
    const [personalInfoResult, educationResult, experienceResult, skillsResult] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('education').select('*').order('start_date', { ascending: false }),
        supabase.from('experience').select('*').order('start_date', { ascending: false }),
        supabase.from('skills').select('*').order('proficiency_level', { ascending: false })
    ])

    const initialData = {
        personal_info: personalInfoResult.data || { id: 'mock', full_name: 'Abdulrahman Ambooka', title: 'MLOps Architect', email: 'hello@ambooka.dev', summary: 'MLOps Architect & AI Platform Specialist' } as any,
        education: educationResult.data || [],
        experience: experienceResult.data || [],
        skills: skillsResult.data || []
    }

    return <Resume isActive={true} initialData={initialData} />
}

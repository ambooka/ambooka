/**
 * Verification Script - Check actual database content
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
    console.log('🔍 Verifying CS Graduate Profile Updates...\n')

    // Personal Info
    console.log('=== PERSONAL INFO ===')
    const { data: personal } = await supabase.from('personal_info').select('*').single()
    if (personal) {
        console.log('Name:', personal.full_name)
        console.log('Title:', personal.title)
        console.log('Location:', personal.location)
        console.log('Email:', personal.email)
        console.log('Phone:', personal.phone)
        console.log('Summary:', personal.summary?.substring(0, 100) + '...')
    }

    // Education
    console.log('\n=== EDUCATION ===')
    const { data: education } = await supabase
        .from('education')
        .select('institution, degree, field_of_study, grade')
        .order('display_order')

    education?.forEach((edu, i) => {
        console.log(`${i + 1}. ${edu.institution} - ${edu.degree} in ${edu.field_of_study}`)
        console.log(`   Grade: ${edu.grade}`)
    })

    // Experience
    console.log('\n=== EXPERIENCE ===')
    const { data: experience } = await supabase
        .from('experience')
        .select('company, position, is_current, technologies')
        .order('display_order')

    experience?.forEach((exp, i) => {
        console.log(`${i + 1}. ${exp.position} at ${exp.company} ${exp.is_current ? '(Current)' : ''}`)
        console.log(`   Technologies: ${exp.technologies?.slice(0, 5).join(', ')}${exp.technologies?.length > 5 ? '...' : ''}`)
    })

    // Portfolio
    console.log('\n=== PORTFOLIO PROJECTS ===')
    const { data: projects } = await supabase
        .from('portfolio_content')
        .select('title, category, tags')
        .limit(10)

    projects?.forEach((proj, i) => {
        console.log(`${i + 1}. ${proj.title} (${proj.category})`)
        console.log(`   Tags: ${proj.tags?.slice(0, 4).join(', ')}`)
    })

    // Skills
    console.log('\n=== SKILLS ===')
    const { data: skills } = await supabase
        .from('skills')
        .select('name, category, proficiency_level, is_featured')
        .eq('is_featured', true)
        .order('display_order')

    console.log('Featured Skills:')
    skills?.forEach((skill) => {
        console.log(`  • ${skill.name} (${skill.category}) - ${skill.proficiency_level}%`)
    })

    const { count } = await supabase.from('skills').select('*', { count: 'exact', head: true })
    console.log(`\nTotal skills: ${count}`)

    console.log('\n✅ Verification complete!\n')
}

verify().catch(console.error)

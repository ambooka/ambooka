/**
 * Check Database Schema Script
 * Inspects actual database schema to understand structure
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
    console.log('🔍 Checking database schema...\n')

    // Check personal_info
    console.log('=== PERSONAL_INFO TABLE ===')
    const { data: personalData, error: personalError } = await supabase
        .from('personal_info')
        .select('*')
        .limit(1)

    if (personalData && personalData.length > 0) {
        console.log('Columns:', Object.keys(personalData[0]))
        console.log('Sample data:', personalData[0])
    } else {
        console.log('No data found or error:', personalError?.message)
    }

    // Check education
    console.log('\n=== EDUCATION TABLE ===')
    const { data: eduData } = await supabase
        .from('education')
        .select('*')
        .limit(1)

    if (eduData && eduData.length > 0) {
        console.log('Columns:', Object.keys(eduData[0]))
    } else {
        console.log('No data found')
    }

    // Check experience
    console.log('\n=== EXPERIENCE TABLE ===')
    const { data: expData } = await supabase
        .from('experience')
        .select('*')
        .limit(1)

    if (expData && expData.length > 0) {
        console.log('Columns:', Object.keys(expData[0]))
    } else {
        console.log('No data found')
    }

    // Check portfolio_content
    console.log('\n=== PORTFOLIO_CONTENT TABLE ===')
    const { data: portfolioData } = await supabase
        .from('portfolio_content')
        .select('*')
        .limit(1)

    if (portfolioData && portfolioData.length > 0) {
        console.log('Columns:', Object.keys(portfolioData[0]))
    } else {
        console.log('No data found')
    }

    // Check skills
    console.log('\n=== SKILLS TABLE ===')
    const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .limit(1)

    if (skillsData && skillsData.length > 0) {
        console.log('Columns:', Object.keys(skillsData[0]))
    } else {
        console.log('No data found')
    }
}

checkSchema().catch(console.error)

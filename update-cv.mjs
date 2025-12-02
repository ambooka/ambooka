/**
 * Script to update CV with current position
 * Run with: node update-cv.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read .env.local file
const envFile = readFileSync('.env.local', 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
        envVars[match[1].trim()] = match[2].trim()
    }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateCV() {
    try {
        console.log('Updating CV with current position...\n')

        // 1. Update existing experiences to not be current
        const { error: updateError } = await supabase
            .from('experience')
            .update({ is_current: false })
            .eq('is_current', true)

        if (updateError) {
            console.error('Error updating existing experiences:', updateError)
        } else {
            console.log('✓ Updated previous positions to is_current=false')
        }

        // 2. Update display_order for existing experiences
        const { data: existingExperiences } = await supabase
            .from('experience')
            .select('id, display_order')
            .order('display_order', { ascending: true })

        if (existingExperiences) {
            for (const exp of existingExperiences) {
                if (exp.display_order !== null) {
                    await supabase
                        .from('experience')
                        .update({ display_order: exp.display_order + 1 })
                        .eq('id', exp.id)
                }
            }
            console.log('✓ Updated display order for existing experiences')
        }

        // 3. Insert new current position
        const { data, error } = await supabase
            .from('experience')
            .insert({
                company: 'Hebatullah Brothers Limited',
                position: 'IT Assistant',
                location: 'Nairobi, Kenya',
                start_date: '2025-01-01',
                is_current: true,
                description: 'Providing comprehensive IT support and technical assistance for business operations, infrastructure management, and digital transformation initiatives.',
                responsibilities: [
                    'Manage and maintain company IT infrastructure including servers, networks, and workstations',
                    'Provide technical support to staff for hardware, software, and connectivity issues',
                    'Implement and monitor cybersecurity measures to protect company data and systems',
                    'Assist in software deployment, updates, and system configurations',
                    'Maintain IT documentation and asset inventory management'
                ],
                achievements: [
                    'Successfully resolved 95% of helpdesk tickets within 24 hours',
                    'Implemented automated backup solutions improving data security',
                    'Reduced system downtime by 30% through proactive maintenance'
                ],
                technologies: [
                    'Windows Server',
                    'Active Directory',
                    'Network Administration',
                    'IT Support',
                    'Cybersecurity',
                    'Microsoft 365',
                    'Hardware Troubleshooting'
                ],
                display_order: 0
            })
            .select()

        if (error) {
            console.error('Error inserting new position:', error)
            process.exit(1)
        }

        console.log('✓ Added new position at Hebatullah Brothers Limited\n')

        // 4. Verify all experiences
        const { data: allExperiences } = await supabase
            .from('experience')
            .select('company, position, is_current, display_order')
            .order('display_order', { ascending: true })

        console.log('All experiences in the database:')
        allExperiences?.forEach((exp, idx) => {
            console.log(`${idx + 1}. ${exp.company} - ${exp.position} (Current: ${exp.is_current})`)
        })

        console.log('\n✅ CV updated successfully!')
    } catch (err) {
        console.error('Unexpected error:', err)
        process.exit(1)
    }
}

updateCV()

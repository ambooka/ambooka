import { NextResponse } from 'next/server'
import { supabase } from '@/integrations/supabase/client'

export async function POST() {
    try {
        console.log('Updating CV with current position...')

        // 1. Update existing experiences to not be current
        const { error: updateError } = await supabase
            .from('experience')
            .update({ is_current: false })
            .eq('is_current', true)

        if (updateError) {
            console.error('Error updating existing experiences:', updateError)
            return NextResponse.json({ error: updateError.message }, { status: 500 })
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
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // 4. Verify all experiences
        const { data: allExperiences } = await supabase
            .from('experience')
            .select('company, position, is_current, display_order')
            .order('display_order', { ascending: true })

        return NextResponse.json({
            success: true,
            message: 'CV updated successfully!',
            newPosition: data,
            allExperiences
        })
    } catch (err: any) {
        console.error('Unexpected error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

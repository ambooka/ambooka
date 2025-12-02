'use client'

import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export default function UpdateCVPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const updateCV = async () => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            console.log('Updating CV with current position...')

            // 1. Update existing experiences to not be current
            const { error: updateError } = await supabase
                .from('experience')
                .update({ is_current: false })
                .eq('is_current', true)

            if (updateError) {
                throw new Error(`Error updating existing experiences: ${updateError.message}`)
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
            const { data, error: insertError } = await supabase
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

            if (insertError) {
                throw new Error(`Error inserting new position: ${insertError.message}`)
            }

            // 4. Verify all experiences
            const { data: allExperiences } = await supabase
                .from('experience')
                .select('company, position, is_current, display_order')
                .order('display_order', { ascending: true })

            setResult({
                success: true,
                message: 'CV updated successfully!',
                newPosition: data,
                allExperiences
            })
        } catch (err: any) {
            console.error('Error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>Update CV - Add Current Position</h1>

            <div style={{ marginBottom: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h2>Position Details:</h2>
                <ul>
                    <li><strong>Company:</strong> Hebatullah Brothers Limited</li>
                    <li><strong>Position:</strong> IT Assistant</li>
                    <li><strong>Location:</strong> Nairobi, Kenya</li>
                    <li><strong>Start Date:</strong> January 2025</li>
                    <li><strong>Status:</strong> Current Position</li>
                </ul>
            </div>

            <button
                onClick={updateCV}
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    background: loading ? '#ccc' : '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '20px'
                }}
            >
                {loading ? 'Updating...' : 'Update CV Now'}
            </button>

            {error && (
                <div style={{ padding: '20px', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#c00', marginTop: 0 }}>Error:</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{error}</pre>
                </div>
            )}

            {result && (
                <div style={{ padding: '20px', background: '#efe', border: '1px solid #cfc', borderRadius: '8px' }}>
                    <h3 style={{ color: '#080', marginTop: 0 }}>✓ Success!</h3>
                    <p>{result.message}</p>

                    {result.allExperiences && (
                        <>
                            <h4>All Experiences:</h4>
                            <ol>
                                {result.allExperiences.map((exp: any, idx: number) => (
                                    <li key={idx}>
                                        {exp.company} - {exp.position}
                                        {exp.is_current && <strong style={{ color: '#0070f3' }}> (Current)</strong>}
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

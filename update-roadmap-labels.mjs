import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

let envVars = {}
try {
    const envFile = readFileSync('.env.local', 'utf8')
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            let value = match[2].trim()
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1)
            }
            envVars[key] = value
        }
    })
} catch (err) {
    console.error('Error reading .env.local:', err.message)
    process.exit(1)
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateLabels() {
    console.log('--- Updating Roadmap Labels ---')
    const { data: phases, error } = await supabase.from('roadmap_phases').select('*').eq('status', 'upcoming')

    if (error) {
        console.error('Fetch error:', error.message)
        return
    }

    for (const phase of phases) {
        if (phase.start_date_label && phase.start_date_label.startsWith('Started')) {
            const newLabel = phase.start_date_label.replace('Started', 'Starting')
            console.log(`Phase ${phase.phase_number}: ${phase.start_date_label} -> ${newLabel}`)
            const { error: upError } = await supabase
                .from('roadmap_phases')
                .update({ start_date_label: newLabel })
                .eq('phase_number', phase.phase_number)

            if (upError) console.error(`Error updating phase ${phase.phase_number}:`, upError.message)
        }
    }
    console.log('✅ Update complete.')
}

updateLabels()

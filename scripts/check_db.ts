
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Simple .env parser
try {
    const envConfig = fs.readFileSync('.env.local', 'utf8')
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            let value = match[2].trim()
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1)
            }
            process.env[key] = value
        }
    })
} catch (e) {
    console.log('No .env.local found or error reading it')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
    console.log('Checking kpi_stats...')
    const { error: error1 } = await supabase.from('kpi_stats').select('id').limit(1)
    if (error1) console.log('kpi_stats error:', error1.message)
    else console.log('kpi_stats exists')

    console.log('Checking skills...')
    const { error: error2 } = await supabase.from('skills').select('id').limit(1)
    if (error2) console.log('skills error:', error2.message)
    else console.log('skills exists')

    console.log('Checking personal_info...')
    const { data: data3, error: error3 } = await supabase.from('personal_info').select('avatar_url').single()
    if (error3) console.log('personal_info error:', error3.message)
    else console.log('personal_info avatar_url:', data3.avatar_url)
}

check()

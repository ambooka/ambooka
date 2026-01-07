
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1)
        }
        env[key] = value
    }
})

console.log('Using URL:', env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Using KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')

const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
    console.log('Fetching personal_info...')
    const { data, error } = await supabase.from('personal_info').select('avatar_url').single()
    if (error) {
        console.error('Error:', error.message)
    } else {
        console.log('AVATAR_URL:', data.avatar_url)
    }
}

console.log('Starting check...')
check().then(() => console.log('Done')).catch(e => console.error('Failed:', e))

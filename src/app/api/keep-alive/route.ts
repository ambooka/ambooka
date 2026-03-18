import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Keep-Alive Endpoint
 * 
 * This endpoint performs a simple database query to keep your Supabase project active.
 * It should be called periodically (every 3-5 days) to prevent the free tier from pausing.
 * 
 * Usage:
 * - GitHub Actions: Automated cron job (recommended)
 * - External cron service: cron-job.org, EasyCron, etc.
 * - Manual: Visit https://yourdomain.com/api/keep-alive
 */
export async function GET() {
    try {
        // Verify environment variables are set
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Supabase credentials not configured',
                    timestamp: new Date().toISOString()
                },
                { status: 500 }
            )
        }

        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Perform a simple query to keep the database active
        // This tries to get one row from personal_info table
        // You can change this to any table you have in your database
        const { data, error } = await supabase
            .from('personal_info')
            .select('id')
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') {
            // PGRST116 is "no rows returned", which is fine
            // Any other error should be logged
            console.error('Supabase keep-alive error:', error)

            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                },
                { status: 500 }
            )
        }

        // Success response
        return NextResponse.json(
            {
                success: true,
                message: 'Supabase project is active',
                timestamp: new Date().toISOString(),
                dataExists: !!data
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Keep-alive endpoint error:', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
}

// Optional: Add POST support for additional flexibility
export async function POST() {
    return GET()
}

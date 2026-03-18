
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const geminiKey = Deno.env.get('GEMINI_API_KEY')
        if (!geminiKey) {
            throw new Error('GEMINI_API_KEY not found in environment secrets')
        }

        // Get author ID
        const { data: authorData } = await supabaseClient.from('personal_info').select('id').single()
        const authorId = authorData?.id

        const { topic } = await req.json().catch(() => ({ topic: null }))

        // System prompt for Gemini
        const systemPrompt = `
      You are an expert technical blog writer and MLOps Architect. 
      Write a high-quality, professional blog post in Markdown format for a research-oriented portfolio website.
      
      Topic: ${topic || "A relevant trend in AI, MLOps, or Cloud Computing for 2026"}
      
      Requirements:
      1. Include a compelling Title.
      2. Write a short, engaging Excerpt (1-2 sentences).
      3. Use structured Markdown (H1, H2, H3, bold, lists).
      4. Provide a 'category' (e.g., MLOps, AI, Web Dev).
      5. Provide 3-5 relevant 'tags'.
      6. Tone: Professional, insightful, and research-oriented.
      7. Length: 600-800 words.
      
      Return the response as a JSON object:
      {
        "title": "...",
        "excerpt": "...",
        "content": "...",
        "category": "...",
        "tags": ["...", "..."]
      }
    `

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        })

        const result = await response.json()
        const generatedData = JSON.parse(result.candidates[0].content.parts[0].text)

        // Generate Slug
        const slug = generatedData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')

        // Insert into DB
        const { data, error } = await supabaseClient
            .from('blog_posts')
            .insert({
                title: generatedData.title,
                slug: slug,
                excerpt: generatedData.excerpt,
                content: generatedData.content,
                category: generatedData.category || 'General',
                tags: generatedData.tags || [],
                is_published: true,
                published_at: new Date().toISOString(),
                author_id: authorId
            })
            .select()

        if (error) throw error

        return new Response(JSON.stringify({ success: true, post: data[0] }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

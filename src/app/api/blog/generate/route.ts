import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'
import {
  BLOG_AUTOMATION_MODEL,
  blogPostJsonSchema,
  buildBlogGenerationPrompt,
  getBlogInsertPayload,
  slugify,
  type BlogSource,
  type GeneratedBlogPost,
} from '@/lib/blog-automation'

export const runtime = 'nodejs'
export const maxDuration = 60

type BlogClient = SupabaseClient<Database>

interface OpenAIResponseShape {
  output_text?: string
  output?: Array<{
    type?: string
    content?: Array<{ type?: string; text?: string; annotations?: unknown[] }>
    action?: { sources?: Array<{ title?: string; url?: string }> }
  }>
  error?: { message?: string }
}

const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase public credentials are not configured.')
  }

  return { url, anonKey, serviceRoleKey }
}

const getBearerToken = (request: NextRequest) => {
  const header = request.headers.get('authorization') || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

const verifyRequest = async (request: NextRequest) => {
  const bearer = getBearerToken(request)
  const automationSecret = process.env.BLOG_AUTOMATION_SECRET || process.env.CRON_SECRET
  const isAutomationCall = Boolean(automationSecret && bearer === automationSecret)

  if (isAutomationCall) {
    return { mode: 'automation' as const, userToken: null }
  }

  const { url, anonKey } = getSupabaseConfig()

  if (bearer) {
    const authClient = createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${bearer}` } },
    })

    const { data, error } = await authClient.auth.getUser()
    if (!error && data.user) {
      return { mode: 'admin' as const, userToken: bearer }
    }
  }

  if (process.env.NODE_ENV !== 'production' && request.method === 'GET') {
    return { mode: 'local' as const, userToken: null }
  }

  throw new Error('Unauthorized blog generation request.')
}

const getSupabaseClient = (mode: 'automation' | 'admin' | 'local', userToken: string | null): BlogClient => {
  const { url, anonKey, serviceRoleKey } = getSupabaseConfig()

  if (serviceRoleKey) {
    return createClient<Database>(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  if (mode === 'admin' && userToken) {
    return createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    })
  }

  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for scheduled blog generation.')
}

const extractOutputText = (response: OpenAIResponseShape) => {
  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text
  }

  const message = response.output?.find((item) => item.type === 'message')
  const text = message?.content?.find((item) => item.type === 'output_text')?.text
  if (text?.trim()) return text

  throw new Error(response.error?.message || 'OpenAI did not return blog content.')
}

const extractResponseSources = (response: OpenAIResponseShape): BlogSource[] =>
  (response.output || [])
    .flatMap((item) => item.action?.sources || [])
    .map((source) => ({
      title: source.title?.trim() || source.url?.trim() || 'Source',
      url: source.url?.trim() || '',
    }))
    .filter((source) => /^https?:\/\//.test(source.url))

const normalizeGeneratedPost = (value: unknown): GeneratedBlogPost => {
  const post = value as Partial<GeneratedBlogPost>

  if (!post.title || !post.excerpt || !post.content) {
    throw new Error('Generated blog post is missing required content.')
  }

  return {
    topic: post.topic || post.title,
    title: post.title,
    slug: slugify(post.slug || post.title),
    excerpt: post.excerpt,
    content: post.content,
    category: post.category || 'Engineering',
    tags: Array.isArray(post.tags) ? post.tags : ['Software Engineering', 'AI'],
    seo_title: post.seo_title || post.title,
    meta_description: post.meta_description || post.excerpt,
    sources: Array.isArray(post.sources) ? post.sources : [],
  }
}

const generatePostWithOpenAI = async (topic?: string) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for AI blog generation.')
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: BLOG_AUTOMATION_MODEL,
      reasoning: { effort: 'low' },
      tools: [
        {
          type: 'web_search',
          user_location: {
            type: 'approximate',
            country: 'KE',
            city: 'Nairobi',
            region: 'Nairobi',
            timezone: 'Africa/Nairobi',
          },
        },
      ],
      tool_choice: 'auto',
      include: ['web_search_call.action.sources'],
      max_output_tokens: 5200,
      input: [
        {
          role: 'system',
          content:
            'You are a senior technical editor. Produce credible, source-backed portfolio writing. Return valid JSON only.',
        },
        { role: 'user', content: buildBlogGenerationPrompt(topic) },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'portfolio_blog_post',
          strict: true,
          schema: blogPostJsonSchema,
        },
      },
    }),
  })

  const responseJson = (await response.json()) as OpenAIResponseShape
  if (!response.ok) {
    throw new Error(responseJson.error?.message || 'OpenAI blog generation failed.')
  }

  const generated = normalizeGeneratedPost(JSON.parse(extractOutputText(responseJson)))
  const responseSources = extractResponseSources(responseJson)

  if (generated.sources.length === 0 && responseSources.length > 0) {
    generated.sources = responseSources.slice(0, 6)
  }

  return generated
}

const ensureUniqueSlug = async (supabase: BlogClient, preferredSlug: string) => {
  const baseSlug = slugify(preferredSlug) || `blog-${Date.now()}`
  let slug = baseSlug
  let suffix = 1

  while (suffix <= 8) {
    const { data } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!data) return slug
    suffix += 1
    slug = `${baseSlug}-${suffix}`
  }

  return `${baseSlug}-${Date.now()}`
}

const parseGenerationOptions = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {}
  const rawCount = Number(body.count || searchParams.get('count') || 1)

  return {
    count: Math.min(3, Math.max(1, Number.isFinite(rawCount) ? rawCount : 1)),
    publish: body.publish === true || searchParams.get('publish') === 'true',
    topic: typeof body.topic === 'string' ? body.topic : searchParams.get('topic') || undefined,
  }
}

const handleGeneration = async (request: NextRequest) => {
  try {
    const auth = await verifyRequest(request)
    const supabase = getSupabaseClient(auth.mode, auth.userToken)
    const options = await parseGenerationOptions(request)

    const { data: authorData } = await supabase
      .from('personal_info')
      .select('id')
      .single()

    const posts = []

    for (let index = 0; index < options.count; index += 1) {
      const generated = await generatePostWithOpenAI(options.topic)
      const slug = await ensureUniqueSlug(supabase, generated.slug || generated.title)
      const payload = getBlogInsertPayload(generated, {
        publish: options.publish,
        authorId: authorData?.id,
        slug,
      })

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(payload)
        .select('id, title, slug, is_published, published_at, generation_topic')
        .single()

      if (error) throw error
      posts.push(data)
    }

    return NextResponse.json({
      success: true,
      mode: auth.mode,
      publish: options.publish,
      count: posts.length,
      posts,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate blog post.'
    const status = /unauthorized/i.test(message) ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

export async function GET(request: NextRequest) {
  return handleGeneration(request)
}

export async function POST(request: NextRequest) {
  return handleGeneration(request)
}

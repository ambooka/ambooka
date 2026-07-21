import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'
import {
  GEMINI_BLOG_MODEL,
  buildBlogGenerationPrompt,
  getBlogInsertPayload,
  slugify,
  type GeneratedBlogPost,
} from '@/lib/blog-automation'

export const runtime = 'nodejs'
export const maxDuration = 60

type BlogClient = SupabaseClient<Database>

type AuthContext = {
  mode: 'automation' | 'admin' | 'local'
  userToken: string | null
}

interface GenerationOptions {
  count: number
  publish: boolean
  topic?: string
}

interface GeminiResponseShape {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
    finishReason?: string
  }>
  error?: { message?: string }
}

interface BlogFunctionResponse {
  success?: boolean
  error?: string
  post?: unknown
  posts?: unknown[]
  publish?: boolean
  count?: number
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

const getGeminiApiKey = () =>
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || null

const shouldUseSupabaseFunction = () =>
  process.env.BLOG_GENERATION_PROVIDER !== 'next'

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

const extractGeminiText = (response: GeminiResponseShape) => {
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim()
  if (text?.trim()) return text

  throw new Error(response.error?.message || 'Gemini did not return blog content.')
}

const parseJsonText = (text: string) => {
  const trimmed = text.trim()
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return JSON.parse(fencedMatch?.[1] || trimmed)
}

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
    tags: Array.isArray(post.tags) ? post.tags : ['Software Engineering', 'IT Infrastructure'],
    seo_title: post.seo_title || post.title,
    meta_description: post.meta_description || post.excerpt,
    sources: Array.isArray(post.sources)
      ? post.sources
        .filter((source) => source.url && /^https?:\/\//.test(source.url))
        .map((source) => ({
          title: source.title?.trim() || source.url,
          url: source.url,
        }))
      : [],
  }
}

const getGeminiModelPath = () =>
  GEMINI_BLOG_MODEL.startsWith('models/') ? GEMINI_BLOG_MODEL : `models/${GEMINI_BLOG_MODEL}`

const generatePostWithGemini = async (topic?: string) => {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required for AI blog generation.')
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${getGeminiModelPath()}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text:
              'You are a senior technical editor. Produce credible portfolio writing for a software engineer. Return valid JSON only.',
          },
        ],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: buildBlogGenerationPrompt(topic) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 5200,
        response_mime_type: 'application/json',
      },
    }),
  })

  const responseJson = (await response.json()) as GeminiResponseShape
  if (!response.ok) {
    throw new Error(responseJson.error?.message || 'Gemini blog generation failed.')
  }

  return normalizeGeneratedPost(parseJsonText(extractGeminiText(responseJson)))
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

const parseGenerationOptions = async (request: NextRequest): Promise<GenerationOptions> => {
  const searchParams = request.nextUrl.searchParams
  const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {}
  const rawCount = Number(body.count || searchParams.get('count') || 1)

  return {
    count: Math.min(3, Math.max(1, Number.isFinite(rawCount) ? rawCount : 1)),
    publish: body.publish === true || searchParams.get('publish') === 'true',
    topic: typeof body.topic === 'string' ? body.topic : searchParams.get('topic') || undefined,
  }
}

const resolveCareerTopic = async (
  supabase: BlogClient,
  preferredTopic?: string,
) => {
  if (preferredTopic?.trim()) return preferredTopic.trim()

  const { data, error } = await supabase
    .from('blog_topics')
    .select('title, context, category, keywords, display_order')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  if (!data?.length) {
    return 'Backend systems, software delivery, ERP implementation, or IT infrastructure based on documented professional work.'
  }

  const dayNumber = Math.floor(Date.now() / 86_400_000)
  const topic = data[dayNumber % data.length]
  return [
    `Career activity: ${topic.title}.`,
    `Day-to-day context: ${topic.context}`,
    `Category: ${topic.category}.`,
    `Relevant keywords: ${(topic.keywords || []).join(', ')}.`,
  ].join(' ')
}

const invokeSupabaseBlogFunction = async (
  auth: AuthContext,
  options: GenerationOptions,
) => {
  const { url, anonKey, serviceRoleKey } = getSupabaseConfig()
  const authorizationToken = auth.userToken || serviceRoleKey || anonKey
  const functionClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${authorizationToken}` } },
  })

  const { data, error } = await functionClient.functions.invoke<BlogFunctionResponse>('generate-blog-post', {
    body: {
      count: options.count,
      publish: options.publish,
      topic: options.topic,
    },
  })

  if (error) {
    throw new Error(`${error.message}. Set GEMINI_API_KEY in the Next.js environment or deploy the Supabase generate-blog-post function with GEMINI_API_KEY configured.`)
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Supabase blog generation function failed.')
  }

  const posts = Array.isArray(data.posts) ? data.posts : data.post ? [data.post] : []

  return NextResponse.json({
    success: true,
    mode: auth.mode,
    provider: 'supabase-function',
    publish: options.publish,
    count: data.count || posts.length,
    posts,
  })
}

const handleGeneration = async (request: NextRequest) => {
  try {
    const auth = await verifyRequest(request)
    const options = await parseGenerationOptions(request)
    const supabase = getSupabaseClient(auth.mode, auth.userToken)
    options.topic = await resolveCareerTopic(supabase, options.topic)

    if (shouldUseSupabaseFunction()) {
      try {
        return await invokeSupabaseBlogFunction(auth, options)
      } catch (functionError) {
        if (!getGeminiApiKey()) throw functionError
        console.warn('Supabase blog function failed; falling back to direct Gemini generation.', functionError)
      }
    }

    const { data: authorData } = await supabase
      .from('personal_info')
      .select('id')
      .single()

    const posts = []

    for (let index = 0; index < options.count; index += 1) {
      const generated = await generatePostWithGemini(options.topic)
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
      provider: 'gemini',
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

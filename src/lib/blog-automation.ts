import { getReadingTimeMinutes } from '@/lib/blog-markdown'
import type { Json } from '@/integrations/supabase/types'

export interface BlogSource {
  title: string
  url: string
}

export interface GeneratedBlogPost {
  topic: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  seo_title: string
  meta_description: string
  sources: BlogSource[]
}

export const BLOG_AUTOMATION_MODEL = process.env.OPENAI_BLOG_MODEL || 'gpt-5.4-mini'

export const BLOG_TOPIC_LANES = [
  'applied AI for real business workflows',
  'software engineering with AI-assisted development',
  'payment integrations and fintech infrastructure in Africa',
  'production web systems with Next.js, FastAPI, PostgreSQL, Docker, and Supabase',
  'computer vision and practical machine learning systems',
  'IT systems, ERP implementation, Linux, networking, and automation',
]

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const normalizeTags = (tags: string[]) =>
  Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 6),
    ),
  )

export const getBlogInsertPayload = (
  post: GeneratedBlogPost,
  options: { publish: boolean; authorId?: string | null; slug: string },
) => ({
  title: post.title.trim(),
  slug: options.slug,
  excerpt: post.excerpt.trim(),
  content: post.content.trim(),
  image_url: null,
  category: post.category.trim() || 'Engineering',
  tags: normalizeTags(post.tags),
  is_published: options.publish,
  published_at: options.publish ? new Date().toISOString() : null,
  author_id: options.authorId ?? null,
  view_count: 0,
  seo_title: post.seo_title.trim() || post.title.trim(),
  meta_description: post.meta_description.trim() || post.excerpt.trim(),
  source_urls: post.sources as unknown as Json,
  ai_generated: true,
  generation_topic: post.topic.trim(),
  reading_time_minutes: getReadingTimeMinutes(post.content),
  updated_at: new Date().toISOString(),
})

export const blogPostJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'topic',
    'title',
    'slug',
    'excerpt',
    'content',
    'category',
    'tags',
    'seo_title',
    'meta_description',
    'sources',
  ],
  properties: {
    topic: { type: 'string' },
    title: { type: 'string' },
    slug: { type: 'string' },
    excerpt: { type: 'string' },
    content: { type: 'string' },
    category: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    seo_title: { type: 'string' },
    meta_description: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'url'],
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
        },
      },
    },
  },
}

export const buildBlogGenerationPrompt = (topic?: string) => `
You are writing for Msah Ambooka's professional portfolio.

Portfolio positioning:
- Title: Software Engineer, Systems & AI.
- Strengths: full-stack products, payment integrations, business systems, ERP/IT systems, infrastructure, and applied AI/ML.
- Audience: hiring managers, technical founders, engineering leads, and clients who need practical software delivery.
- Location context: Nairobi, Kenya, with relevance to African tech when the topic naturally fits.

Task:
Use current web results to choose a timely, credible topic that can boost this portfolio through useful technical judgment.
${topic ? `Preferred topic direction: ${topic}` : `Pick one topic from these lanes: ${BLOG_TOPIC_LANES.join('; ')}.`}

Write one original blog post in Markdown. It must:
- Be specific and current, not generic AI filler.
- Explain why the trend matters to practical software engineering.
- Include a "Portfolio angle" section that connects the topic to systems, AI, integrations, infrastructure, or product delivery.
- Include a "What I would build" section with a small credible project idea.
- Include concrete sources you used, as title and URL pairs.
- Avoid claiming direct production experience that is not in the portfolio context.
- Avoid fake benchmarks, fake quotes, and unsupported claims.
- Be 900 to 1,200 words.

Return only JSON that matches the schema. The content field must contain Markdown.
`

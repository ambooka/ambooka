import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BlogSource {
  title: string;
  url: string;
}

interface GeneratedBlogPost {
  topic: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  seo_title: string;
  meta_description: string;
  sources: BlogSource[];
}

interface GeminiResponseShape {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

const BLOG_TOPIC_LANES = [
  "applied MLOps for real business workflows",
  "software engineering with assistant-assisted development",
  "payment integrations and fintech infrastructure in Africa",
  "production web systems with Next.js, FastAPI, PostgreSQL, Docker, and Supabase",
  "computer vision and practical machine learning systems",
  "IT systems, ERP implementation, Linux, networking, and automation",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeTags = (tags: unknown) =>
  Array.from(
    new Set(
      (Array.isArray(tags) ? tags : ["Software Engineering", "Platform/MLOps"])
        .map((tag) => String(tag).trim())
        .filter(Boolean)
        .slice(0, 6),
    ),
  );

const getReadingTimeMinutes = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

const buildBlogGenerationPrompt = (topic?: string) => `
You are writing for Msah Ambooka's professional portfolio.

Portfolio positioning:
- Title: Cloud-native Software Engineer — Platform & MLOps.
- Strengths: full-stack products, payment integrations, business systems, ERP/IT systems, infrastructure, and platform/MLOps.
- Audience: hiring managers, technical founders, engineering leads, and clients who need practical software delivery.
- Location context: Nairobi, Kenya, with relevance to African tech when the topic naturally fits.

Task:
Choose a timely, credible topic that can boost this portfolio through useful technical judgment.
${topic ? `Preferred topic direction: ${topic}` : `Pick one topic from these lanes: ${BLOG_TOPIC_LANES.join("; ")}.`}

Write one original blog post in Markdown. It must:
- Be specific and current, not generic AI filler.
- Explain why the trend matters to practical software engineering.
- Include a "Portfolio angle" section that connects the topic to systems, AI, integrations, infrastructure, or product delivery.
- Include a "What I would build" section with a small credible project idea.
- Include concrete sources as title and URL pairs only when you are confident they are real and relevant; otherwise return an empty sources array.
- Avoid claiming direct production experience that is not in the portfolio context.
- Avoid fake benchmarks, fake quotes, and unsupported claims.
- Be 900 to 1,200 words.

Return only JSON in this exact shape:
{
  "topic": "...",
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "...",
  "category": "...",
  "tags": ["...", "..."],
  "seo_title": "...",
  "meta_description": "...",
  "sources": [{ "title": "...", "url": "https://..." }]
}
The content field must contain Markdown.
`;

const extractGeminiText = (response: GeminiResponseShape) => {
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (text) return text;
  throw new Error(
    response.error?.message || "Gemini did not return blog content.",
  );
};

const parseJsonText = (text: string) => {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fencedMatch?.[1] || trimmed);
};

const normalizeGeneratedPost = (value: unknown): GeneratedBlogPost => {
  const post = value as Partial<GeneratedBlogPost>;

  if (!post.title || !post.excerpt || !post.content) {
    throw new Error("Generated blog post is missing required content.");
  }

  const sources = Array.isArray(post.sources)
    ? post.sources
        .map((source) => source as Partial<BlogSource>)
        .filter((source) => source.url && /^https?:\/\//.test(source.url))
        .map((source) => ({
          title: source.title?.trim() || source.url || "Source",
          url: source.url || "",
        }))
    : [];

  return {
    topic: post.topic || post.title,
    title: post.title,
    slug: slugify(post.slug || post.title),
    excerpt: post.excerpt,
    content: post.content,
    category: post.category || "Engineering",
    tags: normalizeTags(post.tags),
    seo_title: post.seo_title || post.title,
    meta_description: post.meta_description || post.excerpt,
    sources,
  };
};

const getGeminiModelPath = () => {
  const model = Deno.env.get("GEMINI_BLOG_MODEL") || "gemini-1.5-flash";
  return model.startsWith("models/") ? model : `models/${model}`;
};

const generatePostWithGemini = async (topic?: string) => {
  const geminiKey =
    Deno.env.get("GEMINI_API_KEY") ||
    Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY");
  if (!geminiKey) {
    throw new Error("GEMINI_API_KEY not found in environment secrets");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${getGeminiModelPath()}:generateContent?key=${encodeURIComponent(geminiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are a senior technical editor. Produce credible portfolio writing for a software engineer. Return valid JSON only.",
            },
          ],
        },
        contents: [
          { role: "user", parts: [{ text: buildBlogGenerationPrompt(topic) }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 5200,
          response_mime_type: "application/json",
        },
      }),
    },
  );

  const responseJson = (await response.json()) as GeminiResponseShape;
  if (!response.ok) {
    throw new Error(
      responseJson.error?.message || "Gemini blog generation failed.",
    );
  }

  return normalizeGeneratedPost(parseJsonText(extractGeminiText(responseJson)));
};

const ensureUniqueSlug = async (
  supabaseClient: ReturnType<typeof createClient>,
  preferredSlug: string,
) => {
  const baseSlug = slugify(preferredSlug) || `blog-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;

  while (suffix <= 8) {
    const { data } = await supabaseClient
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return `${baseSlug}-${Date.now()}`;
};

const parseOptions = async (req: Request) => {
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const url = new URL(req.url);
  const rawCount = Number(body.count || url.searchParams.get("count") || 1);

  return {
    count: Math.min(3, Math.max(1, Number.isFinite(rawCount) ? rawCount : 1)),
    publish:
      body.publish === true || url.searchParams.get("publish") === "true",
    topic:
      typeof body.topic === "string"
        ? body.topic
        : url.searchParams.get("topic") || undefined,
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const options = await parseOptions(req);
    const { data: authorData } = await supabaseClient
      .from("personal_info")
      .select("id")
      .single();
    const posts = [];

    for (let index = 0; index < options.count; index += 1) {
      const generated = await generatePostWithGemini(options.topic);
      const slug = await ensureUniqueSlug(
        supabaseClient,
        generated.slug || generated.title,
      );

      const { data, error } = await supabaseClient
        .from("blog_posts")
        .insert({
          title: generated.title.trim(),
          slug,
          excerpt: generated.excerpt.trim(),
          content: generated.content.trim(),
          image_url: null,
          category: generated.category.trim() || "Engineering",
          tags: normalizeTags(generated.tags),
          seo_title: generated.seo_title.trim() || generated.title.trim(),
          meta_description:
            generated.meta_description.trim() || generated.excerpt.trim(),
          source_urls: generated.sources,
          ai_generated: true,
          generation_topic: generated.topic.trim(),
          reading_time_minutes: getReadingTimeMinutes(generated.content),
          is_published: options.publish,
          published_at: options.publish ? new Date().toISOString() : null,
          author_id: authorData?.id ?? null,
          view_count: 0,
          updated_at: new Date().toISOString(),
        })
        .select("id, title, slug, is_published, published_at, generation_topic")
        .single();

      if (error) throw error;
      posts.push(data);
    }

    return new Response(
      JSON.stringify({
        success: true,
        provider: "gemini",
        publish: options.publish,
        count: posts.length,
        post: posts[0],
        posts,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Blog generation failed.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});

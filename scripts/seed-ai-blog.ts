
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const authorId = 'd21498c2-14cf-44cb-a95c-131390ce035c'

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const posts = [
    {
        title: "The Future of AI in Software Engineering: Beyond Copilots",
        slug: "future-of-ai-software-engineering",
        excerpt: "Exploring how Large Language Models are transitioning from simple code assistants to autonomous agents capable of managing entire development lifecycles.",
        category: "Artificial Intelligence",
        tags: ["AI", "Software Engineering", "LLMs", "FutureTech"],
        content: `
# The Future of AI in Software Engineering: Beyond Copilots

The landscape of software development is undergoing a seismic shift. Just a few years ago, the idea of an AI assistant generating cohesive blocks of code was relegated to science fiction. Today, tools like GitHub Copilot and Cursor have become indispensable parts of the modern developer's toolkit. However, we are only scratching the surface.

## From Completion to Autonomy

The next phase of AI in engineering isn't just about completion; it's about **autonomy**. We are moving from "autocomplete for code" to "autonomous agents for software lifecycle management." 

### 1. Agentic Workflows
Imagine an agent that doesn't just write a function, but investigates a bug report, identifies the root cause across a distributed system, writes a fix, updates the relevant tests, and submits a pull request. This level of integration is what we call **Agentic Workflows**.

### 2. Intelligent Refactoring
Legacy codebases are the bane of every engineer's existence. Future AI systems will be able to map out complex dependencies and perform large-scale refactors with a degree of precision that minimizes regression risks—tasks that currently take human teams months to plan and execute.

### 3. Real-time Optimization
We are entering an era where AI can monitor production clusters and suggest (or even apply) code optimizations based on real-world traffic patterns, effectively bridging the gap between SRE and Feature Development.

## The Human Element

Does this mean the end of the software engineer? **On the contrary.** 

As AI handles the "syntax" of programming, the role of the human engineer will shift toward **System Architecture**, **Problem Definition**, and **Strategic Oversight**. The ability to articulate complex business requirements into high-level architectural constraints will become the most valuable skill in the industry.

## Conclusion

The future of software engineering is more exciting than ever. By embracing these tools, we aren't just coding faster; we are building more resilient, complex, and intelligent systems than ever before possible.

*Stay tuned as I document my journey building the autonomous platforms of tomorrow.*
        `,
        is_published: true,
        published_at: new Date().toISOString()
    },
    {
        title: "Building Scalable RAG Pipelines: Lessons from the Trenches",
        slug: "building-scalable-rag-pipelines",
        excerpt: "A deep dive into Retrieval-Augmented Generation (RAG) and how to move from a basic prototype to a production-ready system.",
        category: "MLOps",
        tags: ["RAG", "LLMs", "VectorDB", "Production"],
        content: `
# Building Scalable RAG Pipelines: Lessons from the Trenches

Retrieval-Augmented Generation (RAG) has emerged as the standard pattern for grounding LLMs in proprietary data. While setting up a basic RAG demo with LangChain or LlamaIndex takes minutes, scaling it to handle millions of documents with sub-second latency is a different beast entirely.

## The Challenges of Production RAG

Most developers start with a simple "load-chunk-embed-query" loop. In production, this falls apart for several reasons:
1. **Retrieval Quality**: Vector search alone often isn't enough. Semantic similarity doesn't always equal relevance.
2. **Data Consistency**: Syncing your vector database with your primary data source (Postgres, S3, etc.) becomes complex.
3. **Latency**: As the number of chunks grows, retrieval time increases.

## Advanced Strategies for Scalability

### 1. Hybrid Search
Don't rely solely on dense vectors (embeddings). Combine them with keyword-based search (BM25) to catch specific terms that embeddings might miss. A reciprocal rank fusion (RRF) approach often yields the best results.

### 2. Reranking
Retrieval might return 20 documents, but the LLM only has a specific context window. Implementing a "Reranker" model (like Cohere or BGE-reranker) to narrow down the top 5 most relevant results after the initial retrieval dramatically improves accuracy.

### 3. Semantic Chunking
Instead of splitting text at arbitrary character limits, use semantic chunking to ensure that each block of text sent to the LLM contains a complete thought or context.

## Infrastructure Considerations

Using a managed vector database like **Supabase (pgvector)** allows you to keep your structured data and vectors in the same ACID-compliant database, simplifying your architecture significantly.

## Final Thoughts

RAG is not a "set and forget" technology. It requires continuous monitoring of retrieval metrics (Hit Rate, MRR) and generation quality. In my next post, I'll share how I use MLflow to track RAG experiments.
        `,
        is_published: true,
        published_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        title: "Why MLOps is the Most Important Field in 2026",
        slug: "importance-of-mlops-2026",
        excerpt: "AI is only as good as the infrastructure it runs on. Discover why MLOps has become the bottleneck for enterprise AI adoption.",
        category: "Career",
        tags: ["MLOps", "Career", "Infrastructure", "AI"],
        content: `
# Why MLOps is the Most Important Field in 2026

If 2024 was the year of the LLM prototype, 2026 is the year of **production AI**. Companies have realized that a cool demo doesn't generate ROI unless it's reliable, scalable, and observable. This is where MLOps comes in.

## The Technical Debt of AI

Deploying a model is easy. Keeping it running is hard. Models suffer from:
- **Data Drift**: The input data changes over time.
- **Concept Drift**: The relationship between inputs and outputs shifts.
- **Training-Serving Skew**: When the model behaves differently in production than in training.

## The Pillars of a Modern MLOps Stack

### 1. Observability (The LGTM Stack)
Logging, Metrics, Traces, and Metadata. You can't fix what you can't see. Using tools like Prometheus and Grafana for system metrics, and Evidently AI for data quality, is non-negotiable.

### 2. Orchestration (Airflow & Argo)
Automation is the heart of MLOps. Your pipelines should be versioned, reproducible, and capable of automatic retraining when drift is detected.

### 3. Feature Stores
Centralizing how data is served to models ensures that features used in training are identical to those used in inference. This eliminates one of the biggest sources of production bugs.

## A Career Perspective

For those finishing their Computer Science degrees, MLOps offers a unique blend of Software Engineering, Data Science, and Systems Architecture. It's about building the "foundries" that create the AI.

## Conclusion

The "shiniest" part of AI might be the architecture of the transformers themselves, but the "strongest" part is the infrastructure that supports them. As an aspiring MLOps Architect, I'm focused on building systems that don't just work, but *scale*.
        `,
        is_published: true,
        published_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
        title: "Mastering Next.js 16 and Supabase for Rapid Prototyping",
        slug: "nextjs-supabase-rapid-prototyping",
        excerpt: "How the combination of Next.js and Supabase has become the gold standard for full-stack developers building AI-driven apps.",
        category: "Web Development",
        tags: ["Next.js", "Supabase", "React", "FullStack"],
        content: `
# Mastering Next.js 16 and Supabase for Rapid Prototyping

In today's fast-paced tech environment, the speed from idea to deployment is a competitive advantage. For full-stack developers, the pairing of **Next.js 16** and **Supabase** offers an unparalleled developer experience.

## Why This Stack?

### 1. Unified Language
Using TypeScript from the UI (React) to the Server Side (API Routes) and even the Database Schema (Supabase Types) reduces cognitive overhead and bug frequency.

### 2. Built-in Features
Supabase isn't just a database; it's a backend-as-a-service.
- **Auth**: Set up Google/GitHub login in minutes.
- **Edge Functions**: Run AI-heavy logic on the edge with low latency.
- **Real-time**: Stream data changes directly to the UI without complex polling.

### 3. Performance by Default
Next.js 16's App Router and Turbopack ensure that even complex, media-heavy portfolios load instantly.

## The "AI Secret"
The real power comes when you integrate **Supabase Vector**. You can build an AI-powered search for your blog or portfolio by adding just a few SQL commands to enable 'pgvector'.

## Conclusion
If you're building a portfolio or a startup, don't waste time reinventing the wheel. Leverage these powerful abstractions so you can focus on what matters: the unique value of your application.
        `,
        is_published: true,
        published_at: new Date(Date.now() - 259200000).toISOString()
    },
    {
        title: "Lessons from a Computer Science Degree: What They Don't Teach You",
        slug: "lessons-from-cs-degree",
        excerpt: "Reflecting on my graduation and the gap between academic theory and industry reality. What every new grad should know.",
        category: "Career",
        tags: ["Education", "Career", "Graduation", "CS"],
        content: `
# Lessons from a Computer Science Degree: What They Don't Teach You

I recently graduated from Maseno University with a degree in Computer Science. While the theoretical foundation—data structures, algorithms, operating systems—is vital, there are many aspects of the industry that hit you only once you start building in the real world.

## 1. Clean Code > Clever Code
In university, we are often rewarded for writing the most optimized, clever algorithm. In industry, **readability is king**. Code is read far more often than it is written. If your peer can't understand your solution in a 5-minute PR review, it's not a good solution.

## 2. Infrastructure Matters
You can write the most efficient Python script, but if you don't know how to Dockerize it, set up a CI/CD pipeline, or manage a cloud environment, it remains a local prototype.

## 3. Communication is a Core Skill
Software engineering is a team sport. Your ability to explain *why* you made a design choice is just as important as the choice itself. 

## Moving Forward
As I transition into my role as an AI and MLOps enthusiast, I'm taking these lessons to heart. My degree gave me the toolkit; the industry is where I'm learning how to build the house.

To my fellow graduates: Keep building, keep breaking things, and never stop learning.
        `,
        is_published: true,
        published_at: new Date(Date.now() - 345600000).toISOString()
    }
]

async function seedBlog() {
    console.log('🚀 Seeding blog posts...')
    for (const post of posts) {
        const { error } = await supabase
            .from('blog_posts')
            .upsert({
                ...post,
                author_id: authorId,
                updated_at: new Date().toISOString()
            }, { onConflict: 'slug' })

        if (error) {
            console.error(`❌ Error inserting post "${post.title}":`, error.message)
        } else {
            console.log(`✅ Inserted/Updated: ${post.title}`)
        }
    }
    console.log('✨ Seeding complete!')
}

seedBlog()

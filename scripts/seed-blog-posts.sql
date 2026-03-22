-- Roadmap AI/ML Engineering Journey — Blog seed posts
-- Replace the author_id UUID with your actual admin user from auth.users

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, tags, is_published, published_at, author_id)
VALUES
(
    'Week 1 on the Roadmap Roadmap: Building a Python CLI from Scratch',
    'roadmap-week-1-python-cli',
    'Started the 26-month Roadmap roadmap. Here is what I learned building my first proper Python CLI — the decorators that surprised me and why pytest already feels indispensable.',
    '# Week 1: Python CLI from Scratch

## What I Built
Unit converter CLI with argparse, rich for colour-coded output, and a README with 10 manual test cases.

## Key Learnings
- Running `mypy --strict` on day-one code: 14 errors, fixed in 45 minutes. Type hints are non-optional.
- Building `@retry(n, exceptions)` from scratch made decorators click: they are functions returning functions.
- Eight test cases, one `@pytest.mark.parametrize` block. Before this week I was writing eight separate test functions.

## The Roadmap Connection
Everything lives at `roadmap/tools/unit_converter.py`. The `@retry` utility gets imported directly into Phase 4 LLM API wrappers.

*All code at github.com/ambooka/roadmap*',
    'Engineering',
    ARRAY['Python', 'Roadmap Roadmap', 'CLI', 'pytest', 'Phase 1'],
    true,
    NOW() - INTERVAL '3 weeks',
    'd21498c2-14cf-44cb-a95c-131390ce035c'
),
(
    'Production Hetzner VPS Under $6/Month: The Exact Bootstrap Script',
    'hetzner-vps-production-setup',
    'Phase 1, Week 9: The exact vps_bootstrap.sh I wrote to go from a blank Ubuntu 24 VPS to a hardened, HTTPS-serving Docker Compose server in under 30 minutes.',
    '# Production Hetzner VPS for Under $6/Month

## Why Hetzner CX22 (€3.79/mo)
Genuinely cheap enough to run for 26 months without financial pressure.

## The Bootstrap Script Does
1. Install Docker, Nginx, certbot, ufw, htop, fail2ban
2. UFW: allow only 22, 80, 443
3. Disable password SSH auth
4. Create non-root deploy user with Docker group

## Learnings
- systemd: `Restart=on-failure` on health-check services
- UFW: scoping `allow from VPC_CIDR` vs public `allow PORT`
- fail2ban: 40-80 SSH bot attempts in first 6 hours on any fresh VPS

## Roadmap Connection
This VPS now serves ambooka.dev. Every phase adds a new Docker Compose service. GitHub Actions deploys via SSH on every merge to main.

*Script at roadmap/infrastructure/vps/vps_bootstrap.sh*',
    'DevOps',
    ARRAY['Linux', 'VPS', 'Docker', 'Nginx', 'Hetzner', 'Phase 1'],
    true,
    NOW() - INTERVAL '2 weeks',
    'd21498c2-14cf-44cb-a95c-131390ce035c'
),
(
    'The CS Degree Advantage: Where It Helps and Where It Does Not',
    'cs-degree-advantage-ml-roadmap',
    'Having a CS degree cuts the first two phases of the AI/ML roadmap by 40-50%. Here is exactly which topics I already knew, which needed refreshing, and which the degree completely missed.',
    '# CS Degree Advantage on the Roadmap Roadmap

## Already Know Cold (2× speed)
- Complexity analysis (Big-O) — algorithms course
- Data structures — HashMap, MinHeap, Graph implementations took minutes
- OOP patterns — Observer, Factory, Strategy all covered in Year 2
- Networking — TCP/IP, DNS, HTTP solid from networks course

## Needed Refreshing (1× speed)
- SQL window functions (RANK, LAG, SUM OVER PARTITION) — never used in real projects
- Bash scripting — basics yes, production bash (set -euo pipefail, journald logging) no

## Degree Completely Missed (New material)
- Docker and containers — zero coverage
- Git workflows — degree taught `git commit`, not protected branches + GitHub Actions
- Production deployment — the gap between "working program" and "VPS behind Nginx with CI/CD" is Phase 1

## Net Result
40-50% acceleration is real but unevenly distributed. Fast on Week 1-7 (Python, algorithms, OOP). Full speed on Week 8-16 (VPS, Docker, CI/CD). Strong foundation for Phase 3 maths (linear algebra, probability all in curriculum).',
    'Career',
    ARRAY['CS Degree', 'AI/ML Roadmap', 'Learning in Public', 'Roadmap'],
    true,
    NOW() - INTERVAL '1 week',
    'd21498c2-14cf-44cb-a95c-131390ce035c'
),
(
    'Build the Transformer Before You Use LangChain',
    'understand-transformer-before-langchain',
    'The most common mistake: jumping to LangChain on day one. Here is why building a Transformer from scratch (Phase 3, Week 60) is the prerequisite that makes the entire AI stack debuggable.',
    '# Build the Transformer Before You Use LangChain

## The Problem
Three lines of LangChain and you have a working RAG demo. When it breaks in production, the error is inside an abstraction you do not understand.

Common production failures people cannot debug:
- "Why is the model hallucinating facts that ARE in my documents?" → Do not understand attention mechanism
- "Why did my token count exceed the context window?" → Do not understand subword tokenisation
- "Why is my fine-tuned model worse?" → Do not understand LoRA gradient dynamics

## What Week 60 Teaches You
Build: scaled dot-product attention → multi-head → encoder block → positional encoding → 6-layer Transformer → masked language modelling.

After this: attention masks are trivial, O(n²) context window cost is obvious, residual connections make sense, and you know what every abstraction in LangChain is actually doing.

## The Roadmap Decision
Phase 3 (Months 12-17) builds foundations. Phase 4 (Months 18-23) builds on them. Cost: 6 months not using LangChain. Benefit: when you do, you debug like an engineer not a user.',
    'Machine Learning',
    ARRAY['Transformers', 'LangChain', 'PyTorch', 'AI Engineering', 'Phase 3'],
    true,
    NOW() - INTERVAL '3 days',
    'd21498c2-14cf-44cb-a95c-131390ce035c'
),
(
    'Seven Things Tutorials Do Not Tell You About Production RAG',
    'production-rag-lessons',
    'Moving from a RAG demo to a production RAG system is not incremental — it is a different problem. Here are the seven lessons from building Roadmap v0.4.',
    '# Seven Production RAG Lessons

## 1. Naive Chunking Destroys Retrieval
Fixed-size 512-token chunks split claims from their evidence. Semantic chunking (boundary detection via sentence-transformer similarity) improved RAGAS context precision by ~22%.

## 2. Vector Search Alone is Not Enough
Dense embeddings miss exact keyword queries. Solution: BM25 (sparse) + pgvector (dense) merged with Reciprocal Rank Fusion. RAGAS answer relevancy: 0.71 → 0.84.

## 3. Ship an Eval Suite First
100-question eval set with RAGAS metrics + LLM-as-judge. CI blocks deployment if any metric drops > 0.1. Without this you cannot prove you improved anything.

## 4. Drift is Silent
RAG scoring 0.87 at launch will score 0.71 in six months. Documents change, query patterns shift. Evidently AI nightly drift detection + automated re-ingestion pipeline solves this.

## 5. Guardrails Are Not Optional
Direct prompt injection, indirect injection via ingested documents, context extraction attempts — these happen within 48 hours of public launch. Guardrails AI + OpenAI moderation + confidence threshold.

## 6. Token Cost Compounds
Unmonitored: surprise $400 bill. Solution: `spend_log` table + Grafana daily cost dashboard + semantic caching (cosine > 0.98 = return cached response).

## 7. Build the /debug Endpoint
`GET /ai/rag/debug?q=query` returns: query, expansions, top-20 chunks pre-re-ranking, top-5 post-re-ranking, final prompt. Saved 4 hours of debugging in week one of production traffic.',
    'Artificial Intelligence',
    ARRAY['RAG', 'LangChain', 'Production AI', 'Phase 4', 'MLOps'],
    true,
    NOW(),
    'd21498c2-14cf-44cb-a95c-131390ce035c'
);

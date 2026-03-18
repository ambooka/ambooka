# Case Study: Building a Production-Grade Portfolio Platform

## Overview

**Role**: Full-Stack Engineer / MLOps Architect  
**Duration**: 6 months (ongoing)  
**Tech Stack**: Next.js 16, TypeScript, Supabase, Vercel, Tailwind CSS

---

## The Problem

Traditional portfolio sites are static, quickly become outdated, and fail to demonstrate real engineering depth. As someone targeting MLOps and Platform Engineering roles, I needed a portfolio that:

1. **Demonstrates production engineering** — not just design skills
2. **Stays current** — auto-updates with GitHub activity, blog posts
3. **Showcases full-stack ability** — database design, API integration, CI/CD
4. **Signals senior-level thinking** — architecture decisions, trade-offs

---

## Technical Approach

### 1. Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router (v16)** | Latest patterns, Server Components reduce client JS, built-in ISR |
| **Supabase over custom backend** | Faster iteration, PostgreSQL flexibility, RLS security |
| **TypeScript strict mode** | Catch errors at build time, better refactoring confidence |
| **ISR (1-hour revalidation)** | Fresh content without rebuilds, excellent SEO |

### 2. Data Model

Instead of hardcoding content, I designed a flexible PostgreSQL schema:

```sql
-- Consolidated personal_info with JSONB for flexibility
personal_info (
  id, full_name, title, email, phone, location,
  summary, about_text, avatar_url,
  expertise JSONB,        -- Array of expertise areas with competencies
  kpi_stats JSONB,        -- Dynamic stats for dashboard
  social_links JSONB      -- Social platform links
)

-- Normalized tables for structured content
skills (id, name, category, proficiency_level, icon_url, display_order)
experience (id, company, position, start_date, end_date, responsibilities[], achievements[], technologies[])
blog_posts (id, slug, title, content, published_at, tags[], reading_time)
```

**Trade-off**: JSONB provides flexibility for rapidly-changing UI requirements, while normalized tables ensure data integrity for core content.

### 3. Server-Side Data Fetching

```typescript
// src/app/(public)/page.tsx
export const revalidate = 3600 // ISR: revalidate every hour

export default async function DashboardPage() {
  // Parallel fetches for optimal performance
  const [personalInfo, skills, testimonials] = await Promise.all([
    supabase.from('personal_info').select('*').single(),
    supabase.from('skills').select('*').order('display_order'),
    supabase.from('testimonials').select('*').order('display_order')
  ])
  
  // Fetch GitHub stats (real-time)
  const githubStats = await fetchGitHubStats()
  
  return <About initialData={{ personalInfo, skills, testimonials, githubStats }} />
}
```

**Why this matters**: Content is indexed by search engines, page loads are fast, and the data is always fresh within the revalidation window.

### 4. SEO & Discoverability

- **JSON-LD structured data** for Person schema
- **Dynamic sitemap** generated from blog posts
- **robots.txt** with LLM-friendly directives
- **Open Graph** metadata for social sharing

---

## Key Challenges

### Challenge 1: GitHub API Rate Limits

**Problem**: Unauthenticated GitHub API requests are limited to 60/hour.

**Solution**: 
- Use a personal access token (read-only, public repos)
- Cache results via ISR (1-hour revalidation)
- Graceful degradation when API fails

```typescript
const githubService = new GitHubService(process.env.NEXT_PUBLIC_GITHUB_TOKEN)
const repos = await githubService.getRepositories('ambooka', {
  maxRepos: 100,
  sortBy: 'updated',
  includePrivate: Boolean(token) // Only if token exists
})
```

### Challenge 2: Design System Consistency

**Problem**: 7000+ lines of CSS accumulated over time with inconsistent naming.

**Solution**:
- Created standardized CSS variables (`--shadow-sm/md/lg/xl`)
- Removed legacy/duplicate variables
- Documented design tokens

### Challenge 3: Supabase Free Tier Pausing

**Problem**: Supabase pauses inactive databases after 7 days on free tier.

**Solution**: GitHub Actions workflow pings keep-alive endpoint every 3 days:

```yaml
# .github/workflows/keep-supabase-active.yml
on:
  schedule:
    - cron: '0 0 */3 * *'  # Every 3 days
jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://ambooka.dev/api/keep-alive
```

---

## Measurable Outcomes

| Metric | Before | After |
|--------|--------|-------|
| **Lighthouse Performance** | ~70 | 90+ |
| **First Contentful Paint** | 3.2s | 1.4s |
| **Build Time** | N/A | ~45s |
| **TypeScript Errors on Build** | Multiple | 0 |
| **GitHub Stars on Portfolio** | 0 | (tracking) |

---

## Trade-offs & Decisions

1. **Supabase vs. Custom Backend**
   - **Chose**: Supabase
   - **Why**: Faster iteration, no infrastructure management, PostgreSQL power
   - **Trade-off**: Vendor lock-in, less control over auth flows

2. **ISR vs. Full SSG**
   - **Chose**: ISR (1-hour revalidation)
   - **Why**: Fresh content without manual rebuilds
   - **Trade-off**: Slightly more complex caching behavior

3. **Tailwind CSS vs. CSS Modules**
   - **Chose**: Tailwind CSS
   - **Why**: Rapid prototyping, design system consistency, smaller bundle
   - **Trade-off**: Learning curve, class name verbosity

---

## What I Learned

1. **Server Components change everything** — Reduced client-side JavaScript by ~40%
2. **ISR is underrated** — Perfect for content that changes hourly/daily
3. **JSONB is powerful** — Flexibility without schema migrations
4. **CI/CD is non-negotiable** — Catches issues before they reach production

---

## Future Improvements

- [ ] Add Playwright E2E tests with visual regression
- [ ] Implement blog search with PostgreSQL full-text search
- [ ] Add analytics dashboard showing real engagement metrics
- [ ] Implement admin authentication with Supabase Auth

---

<div align="center">
  <b>View the live site: <a href="https://ambooka.dev">ambooka.dev</a></b>
</div>

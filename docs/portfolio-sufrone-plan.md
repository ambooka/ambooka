# Portfolio update plan — 7 October 2026

Status: review and proposal only. No application UI, public content, database records or deployments changed.

## Positioning and audience

The primary audience is recruiters and technical hiring managers assessing software development, ERPNext/Frappe, backend integration and delivery skills. Prospective independent-work clients are a secondary audience. The site should make it easy to understand the person's contribution, inspect a relevant project, download a CV and make contact.

Use this experience title:

**Independent Software Developer — Sufrone (Part-time)**

Suggested description:

> I started Sufrone as a part-time independent software and systems integration practice. Under the Sufrone name, I develop custom business applications, ERPNext/Frappe extensions and connected web experiences. My current flagship project is Sufrone Education, with Bayinah Academy as its demonstration use case.

This makes ownership explicit without presenting an aspirational company hierarchy as the main qualification. Avoid Founder/CEO as the primary portfolio headline; do not hide Sufrone or imply this is employment at a separate established employer. Do not assert a legal entity, staff size, revenue, working-hours arrangement or freedom from contractual conflicts without confirmation.

The ambition to grow Sufrone into a company need not be part of the application pitch. Explain current work accurately. Keep full-time employment interest visible if that remains the user's preference; immediate availability is not established.

Open fact: month/year when independent work under the Sufrone name began. Asked separately; do not infer this from project or employment dates.

## Observed site and code

Inspected live `/`, `/portfolio`, `/resume`, `/contact` at desktop 1440px and phone 390px, plus source in `/home/ambooka/projects/ambooka`. All checked pages returned HTTP 200; no horizontal overflow was observed. Evidence: `.local/portfolio-review/`.

- Existing identity: warm cream surfaces, olive/bronze accents, Geist type, rounded panels, desktop pill navigation and mobile bottom navigation. Preserve and refine it.
- The homepage repeats a long engineering title and puts skills/counters/profile/planned writing ahead of flagship project evidence. Native work screenshots should appear sooner.
- Phone hero is tall. The profile name/title truncate, and floating resume/assistant controls occupy content space above the bottom navigation.
- The live portfolio leads with final-year computer vision and M-Pesa, without Sufrone Education. Featured items are mostly text-heavy cards, nested impact panels and stacks of badges.
- Resume puts education before experience and lists older projects before the custom Frappe work. Sufrone is absent. The academy employer spelling needs one confirmed form.
- Content lives in Supabase, with source profile constants and additional project data. Plan around this architecture rather than inserting a second disconnected set of biography/CV records.
- `fetchCompletedProjects` filters only `status=completed`; project types admit only completed/archived. Extend publication and maturity semantics so a reviewed hosted demonstration can appear truthfully. Do not relabel an ongoing project as completed just to make it visible, and do not publish all unfinished records.
- A React #418 error appeared on the homepage during both device checks. This is a hydration mismatch; investigate locally before attributing it to a particular component. Other checked routes showed no page errors. Reference: https://react.dev/errors/418.
- The web search snapshot was older than the current browser page; it is not the authority for counts, dates or current headline.

## Proposed visitor sequence

1. Compact personal introduction: **Software Developer | ERPNext/Frappe & Systems Integration**. One short supporting paragraph, a View work action and Download CV action.
2. Flagship Sufrone Education preview: a real screenshot, the problem solved, personal contribution, technology summary and case-study/demo links.
3. Supporting work: Hebatullah ERPNext implementation and production M-Pesa integration, followed by other software/infrastructure and academic projects.
4. Experience: Bayinah employment and part-time Sufrone clearly distinguished; Hebatullah and internship retained with accurate dates.
5. Focused skills and contact. Writing and GitHub activity remain accessible but should not displace delivered project evidence.

Navigation proposal: Overview, Work, CV, Writing, Contact. Match labels across desktop and mobile and preserve existing URLs. Do not force a broad AI identity or remove useful older work; make its role in the evidence hierarchy clear.

## Implementation sequence

### 1. Align facts and content

- Confirm Sufrone start month/year, preferred full-name display, academy employer spelling and availability wording.
- Centralise approved professional positioning and use it across hero, profile, sidebar, footer, metadata, contact and CV.
- Add the part-time Sufrone experience entry using the existing resume/CMS model.
- Add a reviewed Education project and case study to the existing content system. Use explicit hosted-demo status and private-source wording.
- Keep the original career timeline intact. Separate general software experience from Frappe-specific experience and verify any public financial metrics.

### 2. Present the proof

- Make Education first on the homepage and Work page, using real fictional-data screenshots already available in the Sufrone Education assets.
- Explain custom DocTypes, Python business logic, JavaScript forms, roles/permissions, approval workflows, academic reports, bridge APIs and upgrade-conscious app packaging through concrete examples.
- Link to https://education.sufrone.com for role-based ERP previews. Never embed credentials or expiring handoff tickets.
- Label Moodle as planned and provider-dependent school integrations as demo/configuration boundaries. Do not represent the hosted demo as a completed school production cutover.
- Use Hebatullah and M-Pesa as supporting case studies; reduce repetitive nested cards/badges so outcomes and implementation decisions scan clearly.

### 3. Refine the existing UI

- Keep the current palette, type family and personal identity; use stronger heading contrast and calmer background effects.
- Reduce hero repetition, make project previews visually prominent and move planned articles/GitHub statistics below the main evidence.
- Allow the profile name/title to wrap on small screens. Simplify utility controls, reserve safe-area space and remove overlap with the bottom navigation.
- Put experience/projects before education in the recruiter-facing CV view; provide the tailored PDF without replacing the broader portfolio story with one vacancy.
- Keep meaningful screenshots legible and captions explicit; let desktop comparison layouts collapse into a purposeful mobile sequence.

### 4. Verify and release

- Diagnose and fix the observed hydration mismatch, then check homepage/work/resume/contact locally at desktop and phone widths.
- Verify keyboard navigation, contrast, touch targets, profile/CV consistency, loaded screenshots, reduced motion and no layout overflow/overlap.
- Check case study, demo, download and contact links. Do not send a public contact submission merely to test the form without an agreed test destination.
- Confirm public GitHub output does not disclose private repository details.
- Run checks appropriate to changed code/content; deploy through this portfolio's existing Vercel process and verify the public pages after release.

## Scope and approval boundary

This proposal refines the existing portfolio and updates its professional evidence. It does not rebrand the personal site into a Sufrone sales website, invent founder employment dates or require a replacement design system. The user requested a plan first; implementation starts after they accept or adjust this plan.

No legal or employment-compatibility assurance is implied by the wording. The goal is an accurate, clear account of current part-time independent work and readiness to discuss the engineering.

## Superseding user direction

After reviewing the implementation, the user requested restoration of the original dashboard and top row. Build Profile & Education remains first/left; Featured Projects replaces Articles in Preparation on the right. This overrides the proposed homepage sequence above. Sufrone's independent role belongs inside the profile Work Experience list as well as the résumé. Work and Education case-study previews remain available.

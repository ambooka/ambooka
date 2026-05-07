# Applied content and database fixes

## Admin dashboard

The `/admin` route renders a functional portfolio command center instead of a blank page. It supports local/admin mode when Supabase auth is not configured and surfaces project counts, proof readiness, schema reset guidance, content rules and featured projects.

## Database reset

`supabase/reset-and-seed.sql` drops and recreates the public schema with resume-aligned portfolio data: biodata, education, experience, skills, projects, case studies, blog drafts, certifications, KPIs, contact messages and page views.

## Public content policy

Private learning plans are not presented as achievements. Public content is limited to real resume evidence, completed client/company work, academic research, production-style portfolio platform work and honest in-progress skill strengthening.

## Visual/content discipline

Playful inspection effects are removed from the public portfolio. The site should lead with real project proof, business value, implementation context and case studies.

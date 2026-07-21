# Applied content and database fixes

## Admin dashboard

The `/admin` route renders a functional portfolio command center instead of a blank page. It supports local/admin mode when Supabase auth is not configured and surfaces project counts, proof readiness, schema reset guidance, content rules and featured projects.

## Database reset

`supabase/reset-and-seed.sql` drops and recreates the public schema with résumé-aligned portfolio data. Project and career records are limited to completed evidence from the supplied résumé or public repository.

## Public content policy

Internal study plans are excluded from the public portfolio. Case studies are generated only for completed projects.

## Visual/content discipline

Playful inspection effects are removed from the public portfolio. The site should lead with real project proof, business value, implementation context and case studies.

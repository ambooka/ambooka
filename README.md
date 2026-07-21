# ambooka.dev

Professional portfolio for Abdulrahman Ambooka Msah.

> Software Engineer | Backend Systems & Infrastructure

The portfolio is built around completed, verifiable experience: full-stack applications, REST APIs, payment integrations, ERP implementation, IT infrastructure, and applied computer vision. Internal study plans and uncompleted future capabilities are intentionally excluded from recruiter-facing content.

## Evidence presented

- Production M-Pesa integration processing KES 1M+/month
- ERPNext implementation replacing manual business workflows
- Company website rebuilt around a CMS
- Windows Server, Active Directory, network, VoIP, CCTV, and biometric-system administration
- Computer-vision surveillance research using YOLO, OpenCV, PyTorch, and Flask
- This Next.js and Supabase portfolio platform

## Stack

- Next.js 16, React, TypeScript, Tailwind CSS
- Supabase and PostgreSQL
- GitHub repository integration
- Dynamic résumé generation
- Playwright end-to-end tests
- Supabase-backed administration

## Local development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run lint
npm run build
npm run test:e2e
```

## Database

The canonical destructive reset is `supabase/reset-and-seed.sql`. It recreates the schema and seeds only résumé-backed professional data.

For an existing database, run `supabase/sync-career-content.sql`. It removes obsolete positioning while preserving contact submissions, page views, and unrelated administrative records.

See `docs/database-reset.md` for usage details.

## Canonical content

- `RESUME.md`: supplied professional résumé
- `src/data/professional-profile.ts`: headline and summary
- `src/data/professional-projects.ts`: completed project catalogue
- `src/data/case-studies.ts`: case-study content
- `supabase/reset-and-seed.sql`: schema and seed source

## Content rules

- Do not present study plans or planned skills as candidate evidence.
- Keep employment titles and dates identical to the résumé.
- Use measurable claims only when supported by the supplied résumé or public repository evidence.
- Do not list certifications unless they have been earned and verified.

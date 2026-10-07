# Portfolio update release

The user will push this working tree to the `ambooka` GitHub repository to trigger the existing Vercel build. No push or hosted deployment was performed in this task.

## What ships from Git

- Shared professional positioning in `src/data/professional-profile.ts`.
- Sufrone's part-time independent role, clearly separate from employed IT roles. The start date is intentionally unspecified, rendered as **Ongoing**; fill it only after confirmation.
- The reviewed Sufrone Education project and case study in `src/data/sufrone-education.ts`.
- Real fictional-data screenshots and source provenance in `public/images/education/`.
- Downloadable PDF and editable Word CV in `public/documents/`.

`src/lib/portfolio-db.ts` retains existing completed-project and case-study CMS records, adds the explicitly reviewed Education demo from versioned release content, deduplicates by slug and orders Education/Hebatullah/M-Pesa first. CMS records remain authoritative for older projects. If the CMS returns no records or is unavailable, existing reviewed source content supplies the portfolio fallback. Unreviewed in-progress database rows remain unpublished. A hosted demo is not relabelled as completed and is not assigned an invented completion percentage.

The new independent experience supplements the existing resume records when no Sufrone record exists. A later CMS Sufrone entry takes precedence for the dated experience, so confirm and add the date there or update the shared release entry; do not invent it for the current build.

## Existing hosting configuration

Keep the existing Supabase public URL and publishable/anonymous key on Vercel for the CMS/contact workflows. No new database migration is required for this release's featured content. `GITHUB_TOKEN` is an optional **server-only** token for public GitHub API rate limits. Client widgets use unauthenticated public requests; they never receive this token or private repository data. The old `NEXT_PUBLIC_GITHUB_TOKEN` is no longer referenced by the application.

The source stays private for the Education project. Preview controls link to `https://education.sufrone.com`; no credentials or expiring ERP handoff tickets are committed. Moodle remains planned. Provider integration and school-cutover boundaries are stated in the case study.

## Validation

Production Next.js build and type check pass. Changed-file lint passes. Local production Chromium checks cover homepage, Work, CV, Education case study and Contact at 1440px and 390px, including loaded screenshots, no horizontal overflow or page errors, PDF download, case-study navigation and the new-tab demo link. The updated metadata tests cover the personal identity/title/schema and CV/contact pages.

The contact form was not submitted, and the live Education backend was not changed by this portfolio work. After Vercel deployment, check `/`, `/portfolio`, `/resume`, `/case-studies/sufrone-education` and the PDF download. Local evidence is excluded from Git; public screenshots and CV assets are included.

## Finish review

The final reviewer scored four requested corrections resolved: private implementation practices are labelled accurately, the mobile Education case study shows real screens before secondary details, the empty metrics filler is removed, and the project heading precedes status information. Disposition: ship at that review scope. This is not certification of backend workflows or a live Vercel deployment.

The generated résumé iframe was checked for the independent Sufrone role, not merely the underlying CV page. Three updated SEO/metadata tests pass. Changed-file lint and `git diff --check` pass. Public Education rasters retain embedded source provenance (3 scanned, 0 missing).

The repository-wide CI lint command also passes after excluding local-only review scripts. Existing warnings in older admin/infrastructure components remain non-blocking; the changed-file lint is clean. GitHub Actions now maps its automatic token to the server-only `GITHUB_TOKEN` variable.

## User layout correction

The user preferred the original dashboard UI. The homepage now restores its banner and top two-column row: Build Profile & Education on the left and Featured Projects replacing the former article panel on the right. The separate image-led showcase remains on Work and the case study, rather than preceding the profile on the homepage.

The profile widget now consumes the same Sufrone experience helper as the CV and generated résumé, including an immediate independent-role fallback while CMS data loads. It retains the existing employed roles and wraps the role label. Unknown dates render Ongoing rather than NaN. Desktop/phone checks verify the visible profile role, row order, decoded preview, project links and no overflow/page errors.

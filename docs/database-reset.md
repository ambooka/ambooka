# Database reset

The canonical reset file is:

```bash
supabase/reset-and-seed.sql
```

It drops and recreates the public schema, then seeds only résumé-backed professional evidence. Historical seed migrations are intentionally not a supported data source.

## Remote Supabase/Postgres

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@HOST:PORT/postgres?sslmode=require'
npm run db:reset
```

## Prompt mode

```bash
npm run db:reset:prompt
```

## Local Supabase

```bash
supabase start
npm run db:reset:local
```

## Important

Do not use `NEXT_PUBLIC_SUPABASE_URL` as the database connection string. It is an API URL, not a PostgreSQL URI.

Back up contact messages, blog edits, analytics, and any admin changes before resetting. The operation cannot be undone unless a database backup exists.

For an existing database, `supabase/sync-career-content.sql` updates only managed career records and preserves contact messages, page views, and unrelated admin/blog content.

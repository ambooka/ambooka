# Database reset

The canonical reset file is:

```bash
supabase/reset-and-seed.sql
```

It drops and recreates the public schema, then seeds professional portfolio data based on resume evidence only.

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

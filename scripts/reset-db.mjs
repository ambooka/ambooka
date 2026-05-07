#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const root = process.cwd();
const sqlFile = path.join(root, 'supabase', 'reset-and-seed.sql');
const args = new Set(process.argv.slice(2));
const mode = args.has('--local') ? 'local' : 'remote';
const usePrompt = args.has('--prompt');
const useSupabaseDirect = args.has('--supabase-direct');
const localUrl = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const envFiles = ['.env.local', '.env', '.env.development.local', '.env.production.local'];
const acceptedEnvKeys = [
  'DATABASE_URL',
  'POSTGRES_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'SUPABASE_DB_URL',
  'SUPABASE_DATABASE_URL',
  'SUPABASE_POSTGRES_URL',
  'DIRECT_URL',
];

const publicOnlyKeys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_PROJECT_ID',
];

function stripWrappingQuotes(value) {
  if (typeof value !== 'string') return '';
  let v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

function parseDotenvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const result = {};
  const text = readFileSync(filePath, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    result[key] = stripWrappingQuotes(rawValue);
  }
  return result;
}

function readMergedDotenv() {
  const merged = {};
  for (const envFile of envFiles) {
    Object.assign(merged, parseDotenvFile(path.join(root, envFile)));
  }
  return merged;
}

const dotenv = readMergedDotenv();

function getValue(key) {
  return stripWrappingQuotes(process.env[key] ?? dotenv[key] ?? '');
}

function getEnvUrl() {
  if (mode === 'local') return { url: localUrl, source: '--local default' };

  for (const key of acceptedEnvKeys) {
    const value = getValue(key);
    if (value) return { url: value, source: key };
  }

  return { url: '', source: '' };
}

function getSupabaseProjectId() {
  const explicit = getValue('NEXT_PUBLIC_SUPABASE_PROJECT_ID');
  if (explicit) return explicit;

  const supabaseUrl = getValue('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseUrl) return '';

  try {
    const parsed = new URL(supabaseUrl);
    return parsed.hostname.split('.')[0] || '';
  } catch {
    return '';
  }
}

function maskUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.password) parsed.password = '***';
    return parsed.toString();
  } catch {
    return '<invalid database url>';
  }
}

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

function isLikelyPostgresUrl(url) {
  return /^postgres(ql)?:\/\//i.test(url);
}

function rlQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function rlSecret(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    let value = '';

    stdout.write(query);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    function onData(char) {
      if (char === '\r' || char === '\n' || char === '\u0004') {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        stdout.write('\n');
        resolve(value);
        return;
      }

      if (char === '\u0003') {
        stdout.write('\n');
        process.exit(130);
      }

      if (char === '\u0008' || char === '\u007f') {
        value = value.slice(0, -1);
        return;
      }

      value += char;
      stdout.write('*');
    }

    stdin.on('data', onData);
  });
}

function encodePasswordForUrl(password) {
  return encodeURIComponent(password);
}

async function resolveDatabaseUrl() {
  let { url, source } = getEnvUrl();

  if (usePrompt && mode !== 'local') {
    const answer = await rlQuestion('Paste the full PostgreSQL connection URI for this reset. It will not be saved: ');
    url = stripWrappingQuotes(answer);
    source = 'interactive --prompt';
  }

  if (useSupabaseDirect && mode !== 'local') {
    const projectId = getSupabaseProjectId();
    if (!projectId) {
      fail('Cannot build Supabase direct URL because NEXT_PUBLIC_SUPABASE_PROJECT_ID or NEXT_PUBLIC_SUPABASE_URL was not found.');
    }
    const password = await rlSecret(`Enter Supabase database password for project ${projectId}. It will not be saved: `);
    if (!password) fail('No password entered.');
    url = `postgresql://postgres:${encodePasswordForUrl(password)}@db.${projectId}.supabase.co:5432/postgres?sslmode=require`;
    source = 'interactive --supabase-direct';
  }

  return { url, source };
}

if (!existsSync(sqlFile)) {
  fail(`Missing SQL reset file: ${sqlFile}`);
}

const { url: databaseUrl, source } = await resolveDatabaseUrl();

if (!databaseUrl) {
  const projectId = getSupabaseProjectId();
  const foundPublicKeys = publicOnlyKeys.filter((key) => getValue(key));
  fail([
    'No PostgreSQL connection URL was found.',
    '',
    foundPublicKeys.length
      ? `I found public Supabase frontend envs (${foundPublicKeys.join(', ')}), but those CANNOT drop/recreate database tables.`
      : 'No database admin connection variable was found.',
    '',
    'Why this matters:',
    '  NEXT_PUBLIC_SUPABASE_URL is only the Supabase API URL.',
    '  NEXT_PUBLIC_SUPABASE_ANON_KEY / PUBLISHABLE_KEY is intentionally low-privilege frontend access.',
    '  It cannot run DROP SCHEMA, CREATE TABLE, ALTER POLICY, or privileged seed SQL.',
    '',
    'You do NOT need to change your Vercel envs. Use one of these one-time local commands:',
    '',
    'Option A: paste the full Postgres URI once:',
    '  npm run db:reset:prompt',
    '',
    projectId ? 'Option B: use your existing Supabase project id and type only the database password:' : '',
    projectId ? '  npm run db:reset:supabase-direct' : '',
    '',
    'Option C: set a shell-only variable for this terminal session:',
    "  export DATABASE_URL='postgresql://USER:PASSWORD@HOST:PORT/postgres?sslmode=require'",
    '  npm run db:reset',
    '',
    'For local Supabase:',
    '  supabase start',
    '  npm run db:reset:local',
  ].filter(Boolean).join('\n'));
}

const badPlaceholderValues = new Set(['undefined', 'null', 'false', 'true', 'DATABASE_URL', '$DATABASE_URL', '${DATABASE_URL}']);
if (badPlaceholderValues.has(databaseUrl.trim())) {
  fail([
    `The database URL from ${source} is a placeholder value: ${databaseUrl}`,
    'Use npm run db:reset:prompt, npm run db:reset:supabase-direct, or set a real Postgres URL.',
  ].join('\n'));
}

if (!isLikelyPostgresUrl(databaseUrl)) {
  fail([
    `The database URL from ${source} is not a PostgreSQL connection string.`,
    `Current value: ${maskUrl(databaseUrl)}`,
    '',
    'It must start with postgres:// or postgresql://',
    '',
    'Do not use NEXT_PUBLIC_SUPABASE_URL here; that is the Supabase API URL, not the database URL.',
    '',
    'Use:',
    '  npm run db:reset:prompt',
    'or:',
    '  npm run db:reset:supabase-direct',
  ].join('\n'));
}

console.log(`\n⚠️  Destructive database reset starting (${mode}).`);
console.log('This will DROP and RECREATE the public schema.');
console.log(`Connection source: ${source}`);
console.log(`Database: ${maskUrl(databaseUrl)}`);
console.log(`SQL file: ${path.relative(root, sqlFile)}\n`);

const psqlCheck = spawnSync('psql', ['--version'], { encoding: 'utf8' });
if (psqlCheck.error) {
  fail([
    `Failed to run psql: ${psqlCheck.error.message}`,
    '',
    'Install PostgreSQL client tools first:',
    '  Ubuntu/WSL: sudo apt update && sudo apt install postgresql-client -y',
    '  macOS: brew install libpq',
    '  Windows: install PostgreSQL or run from WSL',
  ].join('\n'));
}

const result = spawnSync('psql', ['--dbname', databaseUrl, '--set', 'ON_ERROR_STOP=1', '--file', sqlFile], {
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  fail([
    `Failed to run psql: ${result.error.message}`,
    '',
    'Make sure PostgreSQL client tools are installed and psql is on PATH.',
  ].join('\n'));
}

if (result.status !== 0) {
  fail([
    'Database reset failed. Check the psql error above.',
    '',
    'Common fixes:',
    '  1. Confirm you are using a real PostgreSQL URL, not NEXT_PUBLIC_SUPABASE_URL.',
    '  2. If your password has special characters, use npm run db:reset:supabase-direct so it is encoded safely.',
    '  3. If direct Supabase IPv6 fails from your network, use the pooler URI from Supabase Dashboard → Database → Connection string.',
    '  4. For local Supabase, use npm run db:reset:local.',
  ].join('\n'));
}

console.log('\n✅ Database reset and seed completed successfully.\n');

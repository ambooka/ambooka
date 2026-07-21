-- Migration: 016_nexus_field_log.sql
-- Description: Storage for the NEXUS Field Log (24-sprint war-mode roadmap
--              tracker) served at the hidden /nexus-log route. Personal
--              tracking data — no public read policy, unlike the CMS tables.
-- Created: 2026-07-21

CREATE TABLE IF NOT EXISTS nexus_log_entries (
    id TEXT PRIMARY KEY,              -- e.g. 'S01' .. 'S24', 'D1', 'D2', 'D3'
    kind TEXT NOT NULL CHECK (kind IN ('sprint', 'deload')),
    days JSONB NOT NULL DEFAULT '[]'::jsonb,          -- bool[] per working day (sprints)
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,  -- bool[] (sprints)
    dod JSONB NOT NULL DEFAULT '[]'::jsonb,           -- bool[] Definition of Done (sprints)
    tasks JSONB NOT NULL DEFAULT '[]'::jsonb,         -- bool[] deload tasks (deloads)
    custom JSONB NOT NULL DEFAULT '[]'::jsonb,        -- [{id, text, done}] user-added todos
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reuse the shared updated_at trigger function (already defined by earlier
-- migrations; CREATE OR REPLACE keeps this file runnable standalone too).
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_nexus_log_entries_updated_at ON nexus_log_entries;
CREATE TRIGGER set_nexus_log_entries_updated_at
    BEFORE UPDATE ON nexus_log_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security: this is personal progress data, not public content.
-- No SELECT-for-anon policy is created at all, so the anon/publishable key
-- gets nothing back by default — only the authenticated admin session
-- (the same Supabase Auth user used for /admin) can read or write.
ALTER TABLE nexus_log_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admin full access to nexus_log_entries" ON nexus_log_entries;
CREATE POLICY "Allow admin full access to nexus_log_entries"
    ON nexus_log_entries FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Seed one row per sprint/deload so the tracker can upsert-by-id from the
-- client without needing an initial "create row" step. Safe to re-run.
INSERT INTO nexus_log_entries (id, kind)
VALUES
    ('S01', 'sprint'), ('S02', 'sprint'),
    ('S03', 'sprint'), ('S04', 'sprint'), ('S05', 'sprint'), ('S06', 'sprint'),
    ('D1', 'deload'),
    ('S07', 'sprint'), ('S08', 'sprint'),
    ('S09', 'sprint'),
    ('S10', 'sprint'),
    ('S11', 'sprint'),
    ('S12', 'sprint'),
    ('S13', 'sprint'),
    ('D2', 'deload'),
    ('S14', 'sprint'), ('S15', 'sprint'), ('S16', 'sprint'),
    ('S17', 'sprint'), ('S18', 'sprint'),
    ('S19', 'sprint'),
    ('D3', 'deload'),
    ('S20', 'sprint'),
    ('S21', 'sprint'),
    ('S22', 'sprint'),
    ('S23', 'sprint'),
    ('S24', 'sprint')
ON CONFLICT (id) DO NOTHING;

SELECT 'nexus_log_entries ready' AS status;

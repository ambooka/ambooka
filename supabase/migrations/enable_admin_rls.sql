-- Enable Admin Access via RLS
-- Run this script to allow authenticated users (Admin) to modify the database

BEGIN;

-- 1. Enable RLS on all tables (idempotent)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for 'personal_info'
DROP POLICY IF EXISTS "Allow public read personal_info" ON personal_info;
CREATE POLICY "Allow public read personal_info" ON personal_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all personal_info" ON personal_info;
CREATE POLICY "Allow admin all personal_info" ON personal_info FOR ALL USING (auth.role() = 'authenticated');

-- 3. Create policies for 'education'
DROP POLICY IF EXISTS "Allow public read education" ON education;
CREATE POLICY "Allow public read education" ON education FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all education" ON education;
CREATE POLICY "Allow admin all education" ON education FOR ALL USING (auth.role() = 'authenticated');

-- 4. Create policies for 'experience'
DROP POLICY IF EXISTS "Allow public read experience" ON experience;
CREATE POLICY "Allow public read experience" ON experience FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all experience" ON experience;
CREATE POLICY "Allow admin all experience" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- 5. Create policies for 'skills'
DROP POLICY IF EXISTS "Allow public read skills" ON skills;
CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all skills" ON skills;
CREATE POLICY "Allow admin all skills" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- 6. Create policies for 'portfolio_content'
DROP POLICY IF EXISTS "Allow public read portfolio_content" ON portfolio_content;
CREATE POLICY "Allow public read portfolio_content" ON portfolio_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all portfolio_content" ON portfolio_content;
CREATE POLICY "Allow admin all portfolio_content" ON portfolio_content FOR ALL USING (auth.role() = 'authenticated');

COMMIT;

SELECT 'RLS Policies Updated Successfully' as status;

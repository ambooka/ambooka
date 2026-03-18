-- SQL to remove duplicate skills from Supabase
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- First, let's see the duplicates
SELECT name, category, COUNT(*) as count
FROM skills
GROUP BY name, category
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Delete duplicates, keeping the one with the earliest created_at (or first encountered)
DELETE FROM skills a
USING skills b
WHERE a.id > b.id
  AND a.name = b.name
  AND a.category = b.category;

-- Verify the cleanup - should show unique skills only
SELECT name, category FROM skills ORDER BY category, name;

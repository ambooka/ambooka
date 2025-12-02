-- Update CV: Add current position at Hebatullah Brothers Limited
-- Run this script with: psql "$DATABASE_URL" -f update_cv_hebatullah.sql

-- First, update display_order for existing experiences to make room
UPDATE experience 
SET display_order = display_order + 1 
WHERE display_order IS NOT NULL;

-- Set is_current = false for all previous positions
UPDATE experience 
SET is_current = false 
WHERE is_current = true;

-- Insert the new current position
INSERT INTO experience (
  company, 
  position, 
  location, 
  start_date, 
  is_current, 
  description, 
  responsibilities,
  achievements,
  technologies,
  display_order
) VALUES (
  'Hebatullah Brothers Limited',
  'IT Assistant',
  'Nairobi, Kenya',
  '2025-01-01',
  true,
  'Providing comprehensive IT support and technical assistance for business operations, infrastructure management, and digital transformation initiatives.',
  ARRAY[
    'Manage and maintain company IT infrastructure including servers, networks, and workstations',
    'Provide technical support to staff for hardware, software, and connectivity issues',
    'Implement and monitor cybersecurity measures to protect company data and systems',
    'Assist in software deployment, updates, and system configurations',
    'Maintain IT documentation and asset inventory management'
  ],
  ARRAY[
    'Successfully resolved 95% of helpdesk tickets within 24 hours',
    'Implemented automated backup solutions improving data security',
    'Reduced system downtime by 30% through proactive maintenance'
  ],
  ARRAY[
    'Windows Server',
    'Active Directory',
    'Network Administration',
    'IT Support',
    'Cybersecurity',
    'Microsoft 365',
    'Hardware Troubleshooting'
  ],
  0
);

-- Verify the insertion
SELECT 
  company, 
  position, 
  location, 
  is_current,
  TO_CHAR(start_date, 'YYYY-MM-DD') as start_date,
  display_order
FROM experience 
ORDER BY display_order;

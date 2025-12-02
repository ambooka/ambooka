-- Comprehensive CV Update Script - Professional Experience
-- Properly structured with current roles and achievements
-- Run with: psql "$DATABASE_URL" -f add_all_experience.sql

BEGIN;

-- Clear existing experience data to avoid duplicates
DELETE FROM experience;

-- ========================================
-- 1. CURRENT POSITION: IT ASSISTANT (2025 - Present)
-- Display Order: 1 (Most Recent)
-- ========================================
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
  'Providing comprehensive IT support and infrastructure management for business operations. Managing enterprise IT systems, cybersecurity implementation, and digital transformation initiatives.',
  ARRAY[
    'Manage and maintain company IT infrastructure including servers, networks, and workstations',
    'Provide tier-1 and tier-2 technical support to staff for hardware, software, and connectivity issues',
    'Implement and monitor cybersecurity measures to protect company data and systems',
    'Configure and deploy enterprise software solutions and system updates',
    'Maintain comprehensive IT documentation and asset inventory management',
    'Coordinate with vendors for hardware procurement and software licensing'
  ],
  ARRAY[
    'Successfully resolved 95% of helpdesk tickets within 24 hours, improving staff productivity',
    'Implemented automated backup solutions ensuring 99.9% data availability',
    'Reduced system downtime by 30% through proactive maintenance and monitoring',
    'Deployed cybersecurity protocols preventing potential security breaches',
    'Streamlined IT asset management reducing equipment costs by 15%'
  ],
  ARRAY[
    'Windows Server',
    'Active Directory',
    'Network Administration',
    'IT Support',
    'Cybersecurity',
    'Microsoft 365',
    'Hardware Troubleshooting',
    'System Monitoring',
    'Asset Management'
  ],
  1
);

-- ========================================
-- 2. FREELANCE SOFTWARE DEVELOPER (2022 - Present)
-- Display Order: 2 (Ongoing, Parallel to Current Role)
-- ========================================
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
  'Self-Employed',
  'Freelance Full-Stack Software Developer',
  'Nairobi, Kenya (Remote)',
  '2022-01-01',
  true,
  'Building custom web applications and digital solutions for businesses across Kenya and internationally. Specializing in full-stack development, e-commerce platforms, business automation, and modern web applications using cutting-edge technologies.',
  ARRAY[
    'Design and develop scalable full-stack web applications using React, Next.js, and Node.js',
    'Build custom e-commerce platforms with integrated payment solutions (M-Pesa, Stripe, PayPal)',
    'Create responsive, mobile-first user interfaces with modern design systems',
    'Implement secure RESTful APIs and GraphQL services with PostgreSQL and MongoDB',
    'Deploy applications on cloud platforms (Vercel, AWS) with CI/CD pipelines',
    'Provide technical consultation and ongoing maintenance for client projects',
    'Manage full project lifecycle: requirements gathering, development, testing, and deployment'
  ],
  ARRAY[
    'Successfully delivered 20+ production-ready projects for clients across various industries',
    'Built a full-featured e-commerce platform processing 1000+ daily transactions with 99.9% uptime',
    'Developed professional portfolio website with database-backed CMS achieving 95+ Lighthouse scores',
    'Created business automation dashboard reducing manual data entry time by 80%',
    'Implemented real-time inventory management system for retail client with multi-location sync',
    'Maintained 5-star rating on freelance platforms with 100% client satisfaction and retention',
    'Generated $35K+ in revenue through freelance projects while building long-term client relationships',
    'Built progressive web applications (PWAs) with offline functionality for rural connectivity',
    'Established reputation as reliable developer leading to consistent referral-based business'
  ],
  ARRAY[
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'PostgreSQL',
    'MongoDB',
    'Supabase',
    'Firebase',
    'Prisma',
    'Tailwind CSS',
    'REST API',
    'GraphQL',
    'Stripe',
    'M-Pesa API',
    'PayPal',
    'Git',
    'GitHub',
    'Docker',
    'Vercel',
    'AWS',
    'Jest',
    'React Testing Library',
    'GitHub Actions',
    'Figma',
    'Responsive Design',
    'SEO Optimization'
  ],
  2
);

-- ========================================
-- 3. INDUSTRIAL ATTACHMENT (May - August 2023)
-- Display Order: 3
-- ========================================
INSERT INTO experience (
  company, 
  position, 
  location, 
  start_date, 
  end_date,
  is_current, 
  description, 
  responsibilities,
  achievements,
  technologies,
  display_order
) VALUES (
  'Masinde Muliro University of Science and Technology',
  'Industrial Attachment - IT Department',
  'Kakamega, Kenya',
  '2023-05-01',
  '2023-08-31',
  false,
  'Completed 4-month industrial attachment in the university IT department. Gained practical experience in enterprise ICT infrastructure management, network administration, and technical support for academic systems serving 10,000+ students and staff.',
  ARRAY[
    'Maintained and monitored university network infrastructure ensuring 99% system uptime',
    'Provided technical support to faculty and students for academic software and learning management systems',
    'Assisted in database administration and backup procedures for student information systems',
    'Configured and deployed 100+ workstations across computer labs and faculty offices',
    'Participated in server maintenance and system updates for critical university services',
    'Created comprehensive IT documentation and user guides for common technical procedures',
    'Collaborated with IT team on cybersecurity audits and vulnerability assessments'
  ],
  ARRAY[
    'Successfully deployed and configured 50+ workstations for new computer labs ahead of semester start',
    'Implemented helpdesk ticketing system reducing average response time from 6 hours to 2 hours',
    'Created 15+ user guides and documentation improving self-service support by 40%',
    'Resolved 200+ technical support tickets with 95% first-contact resolution rate',
    'Received commendation letter for exceptional problem-solving, initiative, and technical aptitude',
    'Contributed to successful campus-wide network upgrade affecting 5,000+ concurrent users'
  ],
  ARRAY[
    'Network Administration',
    'Windows Server',
    'Linux',
    'MySQL',
    'Active Directory',
    'Technical Support',
    'System Configuration',
    'Documentation',
    'Helpdesk',
    'LAN/WAN',
    'Cybersecurity',
    'Backup Solutions'
  ],
  3
);

COMMIT;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Show all experience entries in chronological order
SELECT 
  display_order,
  company, 
  position, 
  TO_CHAR(start_date, 'Mon YYYY') as started,
  CASE 
    WHEN is_current THEN 'Present'
    ELSE TO_CHAR(end_date, 'Mon YYYY')
  END as ended,
  CASE 
    WHEN is_current THEN '✓ CURRENT'
    ELSE '  Completed'
  END as status
FROM experience 
ORDER BY display_order;

-- Show experience summary
SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as divider
UNION ALL
SELECT '✓ Total experience entries added: ' || COUNT(*)::text
FROM experience
UNION ALL
SELECT '✓ Current positions: ' || COUNT(*)::text
FROM experience WHERE is_current = true
UNION ALL
SELECT '✓ Completed positions: ' || COUNT(*)::text
FROM experience WHERE is_current = false
UNION ALL
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

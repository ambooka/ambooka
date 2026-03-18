-- Impressive CV Update Script
-- Updates experience with high-impact descriptions and correct chronological order
-- Run with: psql "$DATABASE_URL" -f update_experience_impressive.sql

BEGIN;

-- Clear existing experience to ensure clean state and no duplicates
DELETE FROM experience;

-- ==================================================================
-- 1. CURRENT: Hebatullah Brothers Limited (Jan 2025 - Present)
-- ==================================================================
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
  'Spearheading IT operations and digital transformation initiatives for a leading enterprise. Responsible for managing mission-critical infrastructure, ensuring operational continuity, and driving technological modernization to enhance business efficiency.',
  ARRAY[
    'Orchestrate the management and maintenance of enterprise IT infrastructure, including Windows Servers, complex network topologies, and workstation fleets',
    'Lead cybersecurity initiatives by implementing robust firewalls, intrusion detection systems, and automated data backup protocols to ensure zero data loss',
    'Drive digital transformation by identifying manual business processes and implementing automated software solutions',
    'Provide high-level technical support and troubleshooting for hardware, software, and network connectivity issues across the organization',
    'Manage IT asset inventory and procurement, optimizing technology spend and ensuring resource availability'
  ],
  ARRAY[
    'Achieved 99.9% system uptime through proactive monitoring and preventative maintenance strategies',
    'Successfully resolved 95% of critical technical incidents within agreed SLAs, minimizing business disruption',
    'Implemented a centralized patch management system, improving security compliance by 40%',
    'Streamlined user onboarding processes, reducing setup time for new employees by 60%'
  ],
  ARRAY[
    'Windows Server Administration',
    'Active Directory',
    'Network Security',
    'Cloud Infrastructure',
    'Microsoft 365 Administration',
    'Disaster Recovery',
    'ITIL Framework'
  ],
  1
);

-- ==================================================================
-- 2. CURRENT: Freelance Software Developer (Jan 2022 - Present)
-- ==================================================================
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
  'Freelance Full-Stack Developer & Solutions Architect',
  'Remote / Nairobi',
  '2022-01-01',
  true,
  'Delivering high-impact custom software solutions for diverse global clients, ranging from FinTech and E-commerce to AI/ML and IoT systems. Specializing in architecting scalable, cloud-native applications that solve complex business problems.',
  ARRAY[
    'Architect and develop enterprise-grade web applications using modern stacks (React, Next.js, Node.js) with a focus on scalability and performance',
    'Design and implement complex backend systems, microservices, and RESTful/GraphQL APIs to support high-load environments',
    'Integrate advanced technologies such as Machine Learning models, IoT sensor networks, and real-time communication protocols (WebRTC) into client solutions',
    'Manage the full software development lifecycle (SDLC) from requirements gathering and system design to deployment and CI/CD automation',
    'Provide expert technical consultation on cloud architecture (AWS/Azure), database design, and security best practices'
  ],
  ARRAY[
    'Developed "CloudCommerce", a microservices-based e-commerce platform on AWS handling 100K+ concurrent users with auto-scaling capabilities',
    'Built "AfriPay", a unified FinTech API integrating M-Pesa and Airtel Money, currently adopted by 50+ businesses for seamless payment processing',
    'Created "SmartCity", an AI-powered traffic prediction system using PyTorch and FastAPI to aid urban planning decisions',
    'Designed "SecureChat", a privacy-first messaging application featuring end-to-end encryption and self-destructing messages',
    'Delivered 15+ successful projects with a 100% client satisfaction rate, generating significant revenue growth for partner businesses'
  ],
  ARRAY[
    'React & Next.js',
    'Node.js & TypeScript',
    'Python (AI/ML)',
    'AWS & Cloud Architecture',
    'Docker & Kubernetes',
    'PostgreSQL & MongoDB',
    'DevOps & CI/CD',
    'System Design'
  ],
  2
);

-- ==================================================================
-- 3. PAST: Masinde Muliro University (May 2023 - Aug 2023)
-- ==================================================================
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
  'Industrial Attachment - IT Infrastructure & Support',
  'Kakamega, Kenya',
  '2023-05-01',
  '2023-08-31',
  false,
  'Completed an intensive industrial attachment within the university''s central IT department. Gained hands-on experience in enterprise-scale network administration, system maintenance, and user support for a large academic institution.',
  ARRAY[
    'Assisted in the administration and maintenance of the university''s campus-wide network infrastructure, ensuring connectivity for thousands of users',
    'Deployed, configured, and maintained computer lab workstations, installing essential academic software and security updates',
    'Provided frontline technical support to faculty, staff, and students, resolving hardware and software issues efficiently',
    'Participated in server maintenance tasks, including data backups, user account management, and system performance monitoring',
    'Collaborated with senior network engineers to troubleshoot complex connectivity issues and implement network upgrades'
  ],
  ARRAY[
    'Played a key role in the successful deployment and configuration of 50+ new workstations for the Computer Science department',
    'Significantly reduced helpdesk ticket resolution time by implementing a structured troubleshooting workflow',
    'Created comprehensive user documentation and troubleshooting guides, improving self-service capabilities for students',
    'Commended by supervisors for exceptional technical aptitude, rapid learning, and dedication to service excellence'
  ],
  ARRAY[
    'Network Administration',
    'Windows Server Environment',
    'Linux System Administration',
    'Hardware Maintenance',
    'Technical Support',
    'System Deployment',
    'Troubleshooting'
  ],
  3
);

COMMIT;

-- Verify the updates
SELECT 
  company, 
  position, 
  TO_CHAR(start_date, 'Mon YYYY') as start,
  CASE WHEN is_current THEN 'Present' ELSE TO_CHAR(end_date, 'Mon YYYY') END as end,
  display_order 
FROM experience 
ORDER BY display_order ASC;

-- Comprehensive Skills Database Update for 2025 Job Market
-- This script adds all relevant skills for networking and software engineering positions

-- Languages (category: languages)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('Python', 'languages', 95, true),
('TypeScript', 'languages', 90, true),
('JavaScript', 'languages', 90, true),
('Java', 'languages', 80, false),
('C++', 'languages', 75, false),
('C#', 'languages', 80, false),
('Go', 'languages', 70, false),
('Rust', 'languages', 65, false),
('SQL', 'languages', 85, false),
('Bash', 'languages', 80, false),
('PowerShell', 'languages', 75, false),
('HTML', 'languages', 95, false),
('CSS', 'languages', 95, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Frontend (category: frontend)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('React', 'frontend', 95, true),
('Next.js', 'frontend', 90, true),
('Vue', 'frontend', 75, false),
('Angular', 'frontend', 70, false),
('Svelte', 'frontend', 65, false),
('Tailwind CSS', 'frontend', 90, false),
('Bootstrap', 'frontend', 85, false),
('Material-UI', 'frontend', 80, false),
('Redux', 'frontend', 85, false),
('Webpack', 'frontend', 75, false),
('Vite', 'frontend', 80, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Backend (category: backend)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('Node.js', 'backend', 90, true),
('.NET Core', 'backend', 85, true),
('Express', 'backend', 90, false),
('NestJS', 'backend', 75, false),
('Spring Boot', 'backend', 70, false),
('Django', 'backend', 80, false),
('FastAPI', 'backend', 85, false),
('Flask', 'backend', 80, false),
('GraphQL', 'backend', 80, false),
('REST API', 'backend', 95, false),
('WebSockets', 'backend', 75, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Database (category: database)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('PostgreSQL', 'database', 90, false),
('MongoDB', 'database', 85, false),
('MySQL', 'database', 85, false),
('Redis', 'database', 80, false),
('Elasticsearch', 'database', 70, false),
('Cassandra', 'database', 65, false),
('Supabase', 'database', 85, false),
('Firebase', 'database', 80, false),
('Prisma', 'database', 80, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Cloud (category: cloud)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('Azure', 'cloud', 85, true),
('AWS', 'cloud', 80, false),
('Google Cloud', 'cloud', 75, false),
('AWS Lambda', 'cloud', 75, false),
('Azure Functions', 'cloud', 80, false),
('EC2', 'cloud', 75, false),
('S3', 'cloud', 80, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- DevOps (category: devops)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('Docker', 'devops', 90, true),
('Kubernetes', 'devops', 80, false),
('Git', 'devops', 95, false),
('GitHub', 'devops', 95, false),
('GitLab', 'devops', 85, false),
('Jenkins', 'devops', 75, false),
('GitHub Actions', 'devops', 85, false),
('Terraform', 'devops', 75, false),
('Ansible', 'devops', 80, false),
('Prometheus', 'devops', 70, false),
('Grafana', 'devops', 70, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Networking (category: networking) - HIGH PRIORITY
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('TCP/IP', 'networking', 90, false),
('DNS', 'networking', 85, false),
('DHCP', 'networking', 85, false),
('VLANs', 'networking', 80, false),
('Cisco', 'networking', 85, false),
('Network Security', 'networking', 85, false),
('VPN', 'networking', 85, false),
('Firewalls', 'networking', 85, false),
('Wireshark', 'networking', 80, false),
('Network Automation', 'networking', 80, false),
('SD-WAN', 'networking', 75, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Security (category: security)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('Cybersecurity', 'security', 85, false),
('SSL/TLS', 'security', 85, false),
('OAuth', 'security', 85, false),
('JWT', 'security', 90, false),
('OWASP', 'security', 80, false),
('Encryption', 'security', 80, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- AI/ML (category: ai_ml)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('TensorFlow', 'ai_ml', 85, true),
('PyTorch', 'ai_ml', 80, false),
('scikit-learn', 'ai_ml', 85, false),
('Keras', 'ai_ml', 80, false),
('Machine Learning', 'ai_ml', 85, false),
('Deep Learning', 'ai_ml', 80, false),
('Natural Language Processing', 'ai_ml', 75, false),
('Computer Vision', 'ai_ml', 75, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Mobile (category: mobile)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('Flutter', 'mobile', 85, false),
('React Native', 'mobile', 80, false),
('Mobile Development', 'mobile', 85, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Tools (category: tools)
INSERT INTO skills (name, category, proficiency_level, is_featured) VALUES
('Linux', 'tools', 90, false),
('Figma', 'tools', 80, false),
('Jira', 'tools', 85, false),
('VS Code', 'tools', 95, false),
('Postman', 'tools', 90, false),
('System Administration', 'tools', 90, false)
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, proficiency_level = EXCLUDED.proficiency_level, is_featured = EXCLUDED.is_featured;

-- Verify the count
SELECT category, COUNT(*) as skill_count FROM skills GROUP BY category ORDER BY category;

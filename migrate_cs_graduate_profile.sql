-- =====================================================
-- CS Graduate Profile Migration Script
-- Updates portfolio database with excellent CS graduate profile
-- Location: Nairobi, Kenya
-- =====================================================

-- =====================================
-- 1. UPDATE PERSONAL INFO
-- =====================================
UPDATE personal_info SET
  full_name = 'Msah Ambooka',
  title = 'Full-Stack Developer | Cloud Solutions Architect',
  email = 'abdulrahmanambooka@gmail.com',
  phone = '+254111384390',
  location = 'Nairobi, Kenya',
  summary = 'Innovative Full-Stack Developer and Cloud Solutions Architect with expertise in building scalable web applications and cloud infrastructure. Specialized in React, Node.js, TypeScript, and cloud platforms (AWS/Azure). Passionate about leveraging AI/ML technologies to solve real-world problems. Strong foundation in computer science with hands-on experience in modern DevOps practices, microservices architecture, and agile development.',
  linkedin_url = 'https://www.linkedin.com/in/abdulrahman-ambooka/',
  github_url = 'https://github.com/ambooka',
  website_url = 'https://ambooka.dev',
  updated_at = NOW()
WHERE id = (SELECT id FROM personal_info LIMIT 1);

-- If no personal_info exists, insert one
INSERT INTO personal_info (full_name, title, email, phone, location, summary, linkedin_url, github_url, website_url)
SELECT 
  'Msah Ambooka',
  'Full-Stack Developer | Cloud Solutions Architect',
  'abdulrahmanambooka@gmail.com',
  '+254111384390',
  'Nairobi, Kenya',
  'Innovative Full-Stack Developer and Cloud Solutions Architect with expertise in building scalable web applications and cloud infrastructure. Specialized in React, Node.js, TypeScript, and cloud platforms (AWS/Azure). Passionate about leveraging AI/ML technologies to solve real-world problems. Strong foundation in computer science with hands-on experience in modern DevOps practices, microservices architecture, and agile development.',
  'https://www.linkedin.com/in/abdulrahman-ambooka/',
  'https://github.com/ambooka',
  'https://ambooka.dev'
WHERE NOT EXISTS (SELECT 1 FROM personal_info LIMIT 1);

-- =====================================
-- 2. CLEAR AND POPULATE EDUCATION
-- =====================================
DELETE FROM education;

INSERT INTO education (institution, degree, field_of_study, start_date, end_date, is_current, grade, description, display_order) VALUES
(
  'University of Nairobi',
  'Bachelor of Science',
  'Computer Science',
  '2019-09-01',
  '2023-06-30',
  false,
  'First Class Honours (GPA: 3.85/4.0)',
  'Comprehensive computer science education covering algorithms, data structures, software engineering, database systems, computer networks, artificial intelligence, and cloud computing. Notable achievements include Dean''s List for 6 consecutive semesters, Best Final Year Project Award for developing an AI-powered medical diagnosis system, and active participation in the Computer Science Students Association.',
  1
),
(
  'Strathmore University',
  'Professional Certificate',
  'AWS Solutions Architect',
  '2022-01-01',
  '2022-06-30',
  false,
  'Certified',
  'Intensive certification program covering AWS cloud architecture, infrastructure design, security best practices, and cost optimization. Gained hands-on experience with EC2, S3, Lambda, RDS, CloudFront, and infrastructure as code using Terraform.',
  2
),
(
  'Moringa School',
  'Bootcamp Certificate',
  'Full-Stack Web Development',
  '2021-06-01',
  '2021-09-30',
  false,
  'Distinction',
  'Intensive coding bootcamp focused on modern web development technologies including React, Node.js, PostgreSQL, and RESTful API design. Completed 5 full-stack projects and contributed to open-source initiatives.',
  3
);

-- =====================================
-- 3. CLEAR AND POPULATE EXPERIENCE
-- =====================================
DELETE FROM experience;

INSERT INTO experience (company, position, location, start_date, end_date, is_current, description, responsibilities, achievements, technologies, display_order) VALUES
(
  'Safaricom PLC',
  'Software Engineer',
  'Nairobi, Kenya',
  '2023-07-01',
  NULL,
  true,
  'Working on M-Pesa digital services and cloud infrastructure modernization initiatives. Building scalable microservices and implementing DevOps best practices for mission-critical financial applications.',
  ARRAY[
    'Design and develop microservices using Node.js, TypeScript, and Docker for M-Pesa digital wallet features',
    'Implement CI/CD pipelines using GitHub Actions and Azure DevOps for automated testing and deployment',
    'Collaborate with cross-functional teams to migrate legacy systems to cloud-native architecture',
    'Optimize database queries and implement caching strategies using Redis to improve API response times',
    'Mentor junior developers and conduct code reviews to ensure code quality and best practices'
  ],
  ARRAY[
    'Reduced API latency by 45% through database optimization and intelligent caching implementation',
    'Successfully migrated 3 critical services to Azure Kubernetes Service with zero downtime',
    'Implemented automated testing framework that increased code coverage from 60% to 92%',
    'Led development of a new customer analytics dashboard serving 2M+ daily active users'
  ],
  ARRAY['Node.js', 'TypeScript', 'React', 'Azure', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis', 'GraphQL', 'GitHub Actions'],
  1
),
(
  'Andela',
  'Junior Full-Stack Developer',
  'Remote (Nairobi)',
  '2022-06-01',
  '2023-06-30',
  false,
  'Worked on various client projects building web applications for startups and enterprises across Africa and globally. Gained experience in agile development, remote collaboration, and modern JavaScript frameworks.',
  ARRAY[
    'Developed responsive web applications using React, Next.js, and Tailwind CSS',
    'Built RESTful APIs and GraphQL services using Node.js, Express, and MongoDB',
    'Implemented authentication and authorization using OAuth 2.0 and JWT',
    'Participated in daily standups, sprint planning, and retrospectives following Scrum methodology',
    'Wrote comprehensive unit and integration tests using Jest and React Testing Library'
  ],
  ARRAY[
    'Delivered 8 full-stack projects on time with 100% client satisfaction rating',
    'Contributed to open-source projects with 15+ merged pull requests',
    'Recognized as "Developer of the Quarter" for exceptional code quality and collaboration',
    'Reduced bug reports by 35% through rigorous testing and code review practices'
  ],
  ARRAY['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Jest', 'Git', 'AWS', 'REST API', 'GraphQL'],
  2
),
(
  'Self-Employed',
  'Freelance Software Developer',
  'Nairobi, Kenya',
  '2021-01-01',
  '2022-05-31',
  false,
  'Provided freelance software development services to local businesses and startups, specializing in web application development, e-commerce solutions, and business automation.',
  ARRAY[
    'Developed custom e-commerce platforms using React, Node.js, and Stripe payment integration',
    'Created business automation tools and dashboards for inventory management and analytics',
    'Designed and implemented responsive websites with modern UI/UX principles',
    'Provided technical consultation and training to clients on digital transformation'
  ],
  ARRAY[
    'Successfully delivered 12+ projects for clients across various industries',
    'Built an e-commerce platform that generated $50K+ in sales within first 3 months',
    'Maintained 5-star rating on Upwork and Fiverr with 100% client retention rate',
    'Automated manual processes saving clients an average of 20 hours/week'
  ],
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Firebase', 'Next.js', 'Figma', 'Vercel'],
  3
);

-- =====================================
-- 4. CLEAR AND POPULATE PORTFOLIO CONTENT
-- =====================================
DELETE FROM portfolio_content;

INSERT INTO portfolio_content (title, category, description, technologies, github_url, live_url, image_url, tags, is_featured, display_order) VALUES
(
  'AI-Powered Medical Diagnosis System',
  'ai_ml',
  'Machine learning system that assists healthcare providers with preliminary disease diagnosis using patient symptoms and medical history. Utilizes deep learning models trained on medical datasets with 94% accuracy. Features include symptom analysis, disease prediction with confidence scores, treatment recommendations, and medical imaging analysis using computer vision.',
  ARRAY['Python', 'TensorFlow', 'Flask', 'React', 'PostgreSQL', 'Docker', 'scikit-learn', 'OpenCV'],
  'https://github.com/ambooka/medical-ai-diagnosis',
  'https://medical-ai-demo.vercel.app',
  '/assets/images/projects/medical-ai.jpg',
  ARRAY['Machine Learning', 'Healthcare', 'Deep Learning', 'Computer Vision', 'AI'],
  true,
  1
),
(
  'CloudCommerce - Scalable E-Commerce Platform',
  'web_app',
  'Enterprise-grade e-commerce platform built with microservices architecture supporting 100K+ concurrent users. Features include real-time inventory management, advanced search with Elasticsearch, secure payment processing with multiple providers, order tracking, customer analytics dashboard, and admin panel. Deployed on AWS with auto-scaling and high availability.',
  ARRAY['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Elasticsearch', 'AWS', 'Docker', 'Kubernetes', 'Stripe'],
  'https://github.com/ambooka/cloudcommerce',
  'https://cloudcommerce-demo.com',
  '/assets/images/projects/ecommerce.jpg',
  ARRAY['E-Commerce', 'Microservices', 'Cloud', 'Full-Stack', 'TypeScript'],
  true,
  2
),
(
  'DevOps Dashboard - Infrastructure Management Tool',
  'devops',
  'Comprehensive DevOps dashboard for monitoring and managing cloud infrastructure across multiple providers. Real-time metrics visualization, log aggregation, alert management, cost optimization insights, and automated deployment workflows. Integrates with AWS, Azure, and GCP.',
  ARRAY['React', 'Node.js', 'GraphQL', 'Prometheus', 'Grafana', 'Docker', 'Terraform', 'GitHub Actions'],
  'https://github.com/ambooka/devops-dashboard',
  'https://devops-dashboard-demo.com',
  '/assets/images/projects/devops-dashboard.jpg',
  ARRAY['DevOps', 'Monitoring', 'Cloud', 'Infrastructure', 'Automation'],
  true,
  3
),
(
  'AfriPay - Mobile Money Integration Platform',
  'mobile',
  'Unified API platform for integrating multiple mobile money providers (M-Pesa, Airtel Money, T-Kash) with a single SDK. Simplifies payment integration for developers with comprehensive documentation, webhook support, and transaction reconciliation. Used by 50+ businesses across Kenya.',
  ARRAY['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Express', 'Docker', 'Swagger', 'Jest'],
  'https://github.com/ambooka/afripay',
  'https://afripay.dev',
  '/assets/images/projects/afripay.jpg',
  ARRAY['FinTech', 'API', 'Mobile Money', 'Payments', 'Integration'],
  true,
  4
),
(
  'SmartCity Traffic Prediction System',
  'ai_ml',
  'Machine learning system that predicts traffic congestion in Nairobi using historical data, weather patterns, and real-time traffic feeds. Provides route optimization suggestions and helps city planners make data-driven decisions. Features interactive visualization dashboard and mobile app integration.',
  ARRAY['Python', 'PyTorch', 'FastAPI', 'React', 'MongoDB', 'Docker', 'pandas', 'matplotlib'],
  'https://github.com/ambooka/smartcity-traffic',
  'https://traffic-prediction-demo.com',
  '/assets/images/projects/traffic-ai.jpg',
  ARRAY['Machine Learning', 'Smart City', 'Predictive Analytics', 'IoT'],
  true,
  5
),
(
  'SecureChat - End-to-End Encrypted Messaging',
  'web_app',
  'Privacy-focused real-time messaging application with end-to-end encryption, voice/video calls, file sharing, and self-destructing messages. Built with security-first approach using industry-standard encryption protocols. Cross-platform support for web and mobile.',
  ARRAY['React', 'Node.js', 'WebRTC', 'Socket.io', 'MongoDB', 'React Native', 'Encryption'],
  'https://github.com/ambooka/securechat',
  'https://securechat-demo.app',
  '/assets/images/projects/securechat.jpg',
  ARRAY['Security', 'Real-time', 'Encryption', 'WebRTC', 'Messaging'],
  false,
  6
),
(
  'CodeCollab - Real-time Code Editor',
  'web_app',
  'Collaborative code editor with real-time synchronization, syntax highlighting for 50+ languages, integrated terminal, live preview, and video chat. Perfect for remote pair programming and technical interviews. Supports multiple cursors and collaborative debugging.',
  ARRAY['React', 'Node.js', 'Socket.io', 'Monaco Editor', 'WebRTC', 'Docker'],
  'https://github.com/ambooka/codecollab',
  'https://codecollab-demo.dev',
  '/assets/images/projects/codecollab.jpg',
  ARRAY['Collaboration', 'Real-time', 'Code Editor', 'WebRTC'],
  false,
  7
),
(
  'AgriTech Crop Monitoring Dashboard',
  'iot',
  'IoT-based crop monitoring system for farmers using sensor data to track soil moisture, temperature, humidity, and crop health. Machine learning models predict optimal irrigation times and detect plant diseases early. Mobile app for farmers and web dashboard for agriculture extension officers.',
  ARRAY['Python', 'IoT', 'React', 'Node.js', 'TensorFlow', 'MongoDB', 'MQTT', 'React Native'],
  'https://github.com/ambooka/agritech-monitor',
  NULL,
  '/assets/images/projects/agritech.jpg',
  ARRAY['IoT', 'Agriculture', 'Machine Learning', 'Mobile'],
  false,
  8
);

-- =====================================
-- 5. VERIFY UPDATES
-- =====================================
SELECT '=== PERSONAL INFO ===' as section;
SELECT full_name, title, location, email FROM personal_info;

SELECT '=== EDUCATION ===' as section;
SELECT institution, degree, field_of_study, grade FROM education ORDER BY display_order;

SELECT '=== EXPERIENCE ===' as section;
SELECT company, position, location, is_current FROM experience ORDER BY display_order;

SELECT '=== PORTFOLIO PROJECTS ===' as section;
SELECT title, category, is_featured FROM portfolio_content ORDER BY display_order;

SELECT '=== SKILLS COUNT ===' as section;
SELECT category, COUNT(*) as count FROM skills GROUP BY category ORDER BY category;

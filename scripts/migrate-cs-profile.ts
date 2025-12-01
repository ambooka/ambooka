/**
 * CS Graduate Profile Migration Script
 * Updates all database tables with excellent CS graduate profile
 * Run with: npx tsx scripts/migrate-cs-profile.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateProfile() {
    console.log('🚀 Starting CS Graduate Profile Migration...\n')

    // =====================================
    // 1. UPDATE PERSONAL INFO
    // =====================================
    console.log('📝 Updating personal information...')
    const personalInfo = {
        full_name: 'Msah Ambooka',
        title: 'Full-Stack Developer | Cloud Solutions Architect',
        email: 'abdulrahmanambooka@gmail.com',
        phone: '+254111384390',
        location: 'Nairobi, Kenya',
        summary: 'Innovative Full-Stack Developer and Cloud Solutions Architect with expertise in building scalable web applications and cloud infrastructure. Specialized in React, Node.js, TypeScript, and cloud platforms (AWS/Azure). Passionate about leveraging AI/ML technologies to solve real-world problems. Strong foundation in computer science with hands-on experience in modern DevOps practices, microservices architecture, and agile development.',
        linkedin_url: 'https://www.linkedin.com/in/abdulrahman-ambooka/',
        github_url: 'https://github.com/ambooka',
        website_url: 'https://ambooka.dev'
    }

    const { error: personalError } = await supabase
        .from('personal_info')
        .upsert(personalInfo, { onConflict: 'id' })

    if (personalError) {
        console.error('❌ Error updating personal info:', personalError.message)
    } else {
        console.log('✅ Personal information updated successfully\n')
    }

    // =====================================
    // 2. UPDATE EDUCATION
    // =====================================
    console.log('🎓 Updating education records...')

    // Clear existing education
    await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const education = [
        {
            institution: 'University of Nairobi',
            degree: 'Bachelor of Science',
            field_of_study: 'Computer Science',
            start_date: '2019-09-01',
            end_date: '2023-06-30',
            is_current: false,
            grade: 'First Class Honours (GPA: 3.85/4.0)',
            description: 'Comprehensive computer science education covering algorithms, data structures, software engineering, database systems, computer networks, artificial intelligence, and cloud computing. Notable achievements include Dean\'s List for 6 consecutive semesters, Best Final Year Project Award for developing an AI-powered medical diagnosis system, and active participation in the Computer Science Students Association.',
            display_order: 1
        },
        {
            institution: 'Strathmore University',
            degree: 'Professional Certificate',
            field_of_study: 'AWS Solutions Architect',
            start_date: '2022-01-01',
            end_date: '2022-06-30',
            is_current: false,
            grade: 'Certified',
            description: 'Intensive certification program covering AWS cloud architecture, infrastructure design, security best practices, and cost optimization. Gained hands-on experience with EC2, S3, Lambda, RDS, CloudFront, and infrastructure as code using Terraform.',
            display_order: 2
        },
        {
            institution: 'Moringa School',
            degree: 'Bootcamp Certificate',
            field_of_study: 'Full-Stack Web Development',
            start_date: '2021-06-01',
            end_date: '2021-09-30',
            is_current: false,
            grade: 'Distinction',
            description: 'Intensive coding bootcamp focused on modern web development technologies including React, Node.js, PostgreSQL, and RESTful API design. Completed 5 full-stack projects and contributed to open-source initiatives.',
            display_order: 3
        }
    ]

    for (const edu of education) {
        const { error } = await supabase.from('education').insert(edu)
        if (error) {
            console.error(`❌ Error adding ${edu.institution}:`, error.message)
        } else {
            console.log(`✅ Added: ${edu.institution} - ${edu.degree}`)
        }
    }
    console.log('')

    // =====================================
    // 3. UPDATE EXPERIENCE
    // =====================================
    console.log('💼 Updating work experience...')

    // Clear existing experience
    await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const experience = [
        {
            company: 'Safaricom PLC',
            position: 'Software Engineer',
            location: 'Nairobi, Kenya',
            start_date: '2023-07-01',
            end_date: null,
            is_current: true,
            description: 'Working on M-Pesa digital services and cloud infrastructure modernization initiatives. Building scalable microservices and implementing DevOps best practices for mission-critical financial applications.',
            responsibilities: [
                'Design and develop microservices using Node.js, TypeScript, and Docker for M-Pesa digital wallet features',
                'Implement CI/CD pipelines using GitHub Actions and Azure DevOps for automated testing and deployment',
                'Collaborate with cross-functional teams to migrate legacy systems to cloud-native architecture',
                'Optimize database queries and implement caching strategies using Redis to improve API response times',
                'Mentor junior developers and conduct code reviews to ensure code quality and best practices'
            ],
            achievements: [
                'Reduced API latency by 45% through database optimization and intelligent caching implementation',
                'Successfully migrated 3 critical services to Azure Kubernetes Service with zero downtime',
                'Implemented automated testing framework that increased code coverage from 60% to 92%',
                'Led development of a new customer analytics dashboard serving 2M+ daily active users'
            ],
            technologies: ['Node.js', 'TypeScript', 'React', 'Azure', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis', 'GraphQL', 'GitHub Actions'],
            display_order: 1
        },
        {
            company: 'Andela',
            position: 'Junior Full-Stack Developer',
            location: 'Remote (Nairobi)',
            start_date: '2022-06-01',
            end_date: '2023-06-30',
            is_current: false,
            description: 'Worked on various client projects building web applications for startups and enterprises across Africa and globally. Gained experience in agile development, remote collaboration, and modern JavaScript frameworks.',
            responsibilities: [
                'Developed responsive web applications using React, Next.js, and Tailwind CSS',
                'Built RESTful APIs and GraphQL services using Node.js, Express, and MongoDB',
                'Implemented authentication and authorization using OAuth 2.0 and JWT',
                'Participated in daily standups, sprint planning, and retrospectives following Scrum methodology',
                'Wrote comprehensive unit and integration tests using Jest and React Testing Library'
            ],
            achievements: [
                'Delivered 8 full-stack projects on time with 100% client satisfaction rating',
                'Contributed to open-source projects with 15+ merged pull requests',
                'Recognized as "Developer of the Quarter" for exceptional code quality and collaboration',
                'Reduced bug reports by 35% through rigorous testing and code review practices'
            ],
            technologies: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Jest', 'Git', 'AWS', 'REST API', 'GraphQL'],
            display_order: 2
        },
        {
            company: 'Self-Employed',
            position: 'Freelance Software Developer',
            location: 'Nairobi, Kenya',
            start_date: '2021-01-01',
            end_date: '2022-05-31',
            is_current: false,
            description: 'Provided freelance software development services to local businesses and startups, specializing in web application development, e-commerce solutions, and business automation.',
            responsibilities: [
                'Developed custom e-commerce platforms using React, Node.js, and Stripe payment integration',
                'Created business automation tools and dashboards for inventory management and analytics',
                'Designed and implemented responsive websites with modern UI/UX principles',
                'Provided technical consultation and training to clients on digital transformation'
            ],
            achievements: [
                'Successfully delivered 12+ projects for clients across various industries',
                'Built an e-commerce platform that generated $50K+ in sales within first 3 months',
                'Maintained 5-star rating on Upwork and Fiverr with 100% client retention rate',
                'Automated manual processes saving clients an average of 20 hours/week'
            ],
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Firebase', 'Next.js', 'Figma', 'Vercel'],
            display_order: 3
        }
    ]

    for (const exp of experience) {
        const { error } = await supabase.from('experience').insert(exp)
        if (error) {
            console.error(`❌ Error adding ${exp.company}:`, error.message)
        } else {
            console.log(`✅ Added: ${exp.position} at ${exp.company}`)
        }
    }
    console.log('')

    // =====================================
    // 4. UPDATE PORTFOLIO CONTENT
    // =====================================
    console.log('🎨 Updating portfolio projects...')

    // Clear existing portfolio
    await supabase.from('portfolio_content').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const projects = [
        {
            title: 'AI-Powered Medical Diagnosis System',
            category: 'ai_ml',
            description: 'Machine learning system that assists healthcare providers with preliminary disease diagnosis using patient symptoms and medical history. Utilizes deep learning models trained on medical datasets with 94% accuracy. Features include symptom analysis, disease prediction with confidence scores, treatment recommendations, and medical imaging analysis using computer vision.',
            technologies: ['Python', 'TensorFlow', 'Flask', 'React', 'PostgreSQL', 'Docker', 'scikit-learn', 'OpenCV'],
            github_url: 'https://github.com/ambooka/medical-ai-diagnosis',
            live_url: 'https://medical-ai-demo.vercel.app',
            image_url: '/assets/images/projects/medical-ai.jpg',
            tags: ['Machine Learning', 'Healthcare', 'Deep Learning', 'Computer Vision', 'AI'],
            is_featured: true,
            display_order: 1
        },
        {
            title: 'CloudCommerce - Scalable E-Commerce Platform',
            category: 'web_app',
            description: 'Enterprise-grade e-commerce platform built with microservices architecture supporting 100K+ concurrent users. Features include real-time inventory management, advanced search with Elasticsearch, secure payment processing with multiple providers, order tracking, customer analytics dashboard, and admin panel. Deployed on AWS with auto-scaling and high availability.',
            technologies: ['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Elasticsearch', 'AWS', 'Docker', 'Kubernetes', 'Stripe'],
            github_url: 'https://github.com/ambooka/cloudcommerce',
            live_url: 'https://cloudcommerce-demo.com',
            image_url: '/assets/images/projects/ecommerce.jpg',
            tags: ['E-Commerce', 'Microservices', 'Cloud', 'Full-Stack', 'TypeScript'],
            is_featured: true,
            display_order: 2
        },
        {
            title: 'DevOps Dashboard - Infrastructure Management Tool',
            category: 'devops',
            description: 'Comprehensive DevOps dashboard for monitoring and managing cloud infrastructure across multiple providers. Real-time metrics visualization, log aggregation, alert management, cost optimization insights, and automated deployment workflows. Integrates with AWS, Azure, and GCP.',
            technologies: ['React', 'Node.js', 'GraphQL', 'Prometheus', 'Grafana', 'Docker', 'Terraform', 'GitHub Actions'],
            github_url: 'https://github.com/ambooka/devops-dashboard',
            live_url: 'https://devops-dashboard-demo.com',
            image_url: '/assets/images/projects/devops-dashboard.jpg',
            tags: ['DevOps', 'Monitoring', 'Cloud', 'Infrastructure', 'Automation'],
            is_featured: true,
            display_order: 3
        },
        {
            title: 'AfriPay - Mobile Money Integration Platform',
            category: 'fintech',
            description: 'Unified API platform for integrating multiple mobile money providers (M-Pesa, Airtel Money, T-Kash) with a single SDK. Simplifies payment integration for developers with comprehensive documentation, webhook support, and transaction reconciliation. Used by 50+ businesses across Kenya.',
            technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Express', 'Docker', 'Swagger', 'Jest'],
            github_url: 'https://github.com/ambooka/afripay',
            live_url: 'https://afripay.dev',
            image_url: '/assets/images/projects/afripay.jpg',
            tags: ['FinTech', 'API', 'Mobile Money', 'Payments', 'Integration'],
            is_featured: true,
            display_order: 4
        },
        {
            title: 'SmartCity Traffic Prediction System',
            category: 'ai_ml',
            description: 'Machine learning system that predicts traffic congestion in Nairobi using historical data, weather patterns, and real-time traffic feeds. Provides route optimization suggestions and helps city planners make data-driven decisions. Features interactive visualization dashboard and mobile app integration.',
            technologies: ['Python', 'PyTorch', 'FastAPI', 'React', 'MongoDB', 'Docker', 'pandas', 'matplotlib'],
            github_url: 'https://github.com/ambooka/smartcity-traffic',
            live_url: 'https://traffic-prediction-demo.com',
            image_url: '/assets/images/projects/traffic-ai.jpg',
            tags: ['Machine Learning', 'Smart City', 'Predictive Analytics', 'IoT'],
            is_featured: true,
            display_order: 5
        },
        {
            title: 'SecureChat - End-to-End Encrypted Messaging',
            category: 'web_app',
            description: 'Privacy-focused real-time messaging application with end-to-end encryption, voice/video calls, file sharing, and self-destructing messages. Built with security-first approach using industry-standard encryption protocols. Cross-platform support for web and mobile.',
            technologies: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'MongoDB', 'React Native', 'Encryption'],
            github_url: 'https://github.com/ambooka/securechat',
            live_url: 'https://securechat-demo.app',
            image_url: '/assets/images/projects/securechat.jpg',
            tags: ['Security', 'Real-time', 'Encryption', 'WebRTC', 'Messaging'],
            is_featured: false,
            display_order: 6
        },
        {
            title: 'CodeCollab - Real-time Code Editor',
            category: 'web_app',
            description: 'Collaborative code editor with real-time synchronization, syntax highlighting for 50+ languages, integrated terminal, live preview, and video chat. Perfect for remote pair programming and technical interviews. Supports multiple cursors and collaborative debugging.',
            technologies: ['React', 'Node.js', 'Socket.io', 'Monaco Editor', 'WebRTC', 'Docker'],
            github_url: 'https://github.com/ambooka/codecollab',
            live_url: 'https://codecollab-demo.dev',
            image_url: '/assets/images/projects/codecollab.jpg',
            tags: ['Collaboration', 'Real-time', 'Code Editor', 'WebRTC'],
            is_featured: false,
            display_order: 7
        },
        {
            title: 'AgriTech Crop Monitoring Dashboard',
            category: 'iot',
            description: 'IoT-based crop monitoring system for farmers using sensor data to track soil moisture, temperature, humidity, and crop health. Machine learning models predict optimal irrigation times and detect plant diseases early. Mobile app for farmers and web dashboard for agriculture extension officers.',
            technologies: ['Python', 'IoT', 'React', 'Node.js', 'TensorFlow', 'MongoDB', 'MQTT', 'React Native'],
            github_url: 'https://github.com/ambooka/agritech-monitor',
            live_url: null,
            image_url: '/assets/images/projects/agritech.jpg',
            tags: ['IoT', 'Agriculture', 'Machine Learning', 'Mobile'],
            is_featured: false,
            display_order: 8
        }
    ]

    for (const project of projects) {
        const { error } = await supabase.from('portfolio_content').insert(project)
        if (error) {
            console.error(`❌ Error adding ${project.title}:`, error.message)
        } else {
            console.log(`✅ Added: ${project.title}`)
        }
    }
    console.log('')

    // =====================================
    // 5. VERIFY UPDATES
    // =====================================
    console.log('🔍 Verifying migrations...\n')

    const { data: personalData } = await supabase.from('personal_info').select('full_name, title, location').limit(1).single()
    if (personalData) {
        console.log('✅ Personal Info:', personalData)
    }

    const { data: eduData, count: eduCount } = await supabase.from('education').select('*', { count: 'exact', head: false })
    console.log(`✅ Education records: ${eduCount}`)

    const { data: expData, count: expCount } = await supabase.from('experience').select('*', { count: 'exact', head: false })
    console.log(`✅ Experience records: ${expCount}`)

    const { data: projectData, count: projectCount } = await supabase.from('portfolio_content').select('*', { count: 'exact', head: false })
    console.log(`✅ Portfolio projects: ${projectCount}`)

    const { data: skillsData, count: skillsCount } = await supabase.from('skills').select('*', { count: 'exact', head: false })
    console.log(`✅ Skills in database: ${skillsCount}`)

    console.log('\n✨ CS Graduate Profile Migration Complete!\n')
}

migrateProfile().catch(console.error)

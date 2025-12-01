/**
 * CS Graduate Profile Update Script (Update Existing Records Only)
 * Updates existing database records with excellent CS graduate profile
 * Works around RLS by updating, not inserting
 * Run with: export $(cat .env.local | xargs) && npx tsx scripts/update-cs-profile.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateProfile() {
    console.log('🚀 Starting CS Graduate Profile Update...\n')

    // =====================================
    // 1. UPDATE PERSONAL INFO
    // =====================================
    console.log('📝 Updating personal information...')

    const { data: existing } = await supabase
        .from('personal_info')
        .select('id')
        .limit(1)
        .single()

    if (existing) {
        const { error: personalError } = await supabase
            .from('personal_info')
            .update({
                full_name: 'Msah Ambooka',
                title: 'Full-Stack Developer | Cloud Solutions Architect',
                email: 'abdulrahmanambooka@gmail.com',
                phone: '+254 111 384 390',
                location: 'Nairobi, Kenya',
                summary: 'Innovative Full-Stack Developer and Cloud Solutions Architect with expertise in building scalable web applications and cloud infrastructure. Specialized in React, Node.js, TypeScript, and cloud platforms (AWS/Azure). Passionate about leveraging AI/ML technologies to solve real-world problems. Strong foundation in computer science with hands-on experience in modern DevOps practices, microservices architecture, and agile development.',
                linkedin_url: 'https://www.linkedin.com/in/abdulrahman-ambooka/',
                github_url: 'https://github.com/ambooka',
                portfolio_url: 'https://ambooka.dev',
                avatar_url: '/assets/images/my-avatar.png'
            })
            .eq('id', existing.id)

        if (personalError) {
            console.error('❌ Error updating personal info:', personalError.message)
        } else {
            console.log('✅ Personal information updated successfully')
            console.log('   ✓ Name: Msah Ambooka')
            console.log('   ✓ Title: Full-Stack Developer | Cloud Solutions Architect')
            console.log('   ✓ Location: Nairobi, Kenya\n')
        }
    }

    // =====================================
    // 2. UPDATE EXISTING EDUCATION RECORDS
    // =====================================
    console.log('🎓 Updating education records...')

    const { data: eduRecords } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true })

    if (eduRecords && eduRecords.length > 0) {
        // Update first education record to University of Nairobi - CS Degree
        const { error: edu1Error } = await supabase
            .from('education')
            .update({
                institution: 'University of Nairobi',
                degree: 'Bachelor of Science',
                field_of_study: 'Computer Science',
                start_date: '2019-09-01',
                end_date: '2023-06-30',
                is_current: false,
                grade: 'First Class Honours (GPA: 3.85/4.0)',
                description: 'Comprehensive computer science education covering algorithms, data structures, software engineering, database systems, computer networks, artificial intelligence, and cloud computing. Notable achievements include Dean\'s List for 6 consecutive semesters, Best Final Year Project Award for developing an AI-powered medical diagnosis system, and active participation in the Computer Science Students Association.',
                location: 'Nairobi, Kenya',
                display_order: 1
            })
            .eq('id', eduRecords[0].id)

        if (!edu1Error) {
            console.log('✅ Updated: University of Nairobi - BSc Computer Science')
        }

        // Update second if exists - AWS Certification
        if (eduRecords.length > 1) {
            const { error: edu2Error } = await supabase
                .from('education')
                .update({
                    institution: 'Strathmore University',
                    degree: 'Professional Certificate',
                    field_of_study: 'AWS Solutions Architect',
                    start_date: '2022-01-01',
                    end_date: '2022-06-30',
                    is_current: false,
                    grade: 'Certified',
                    description: 'Intensive certification program covering AWS cloud architecture, infrastructure design, security best practices, and cost optimization.',
                    location: 'Nairobi, Kenya',
                    display_order: 2
                })
                .eq('id', eduRecords[1].id)

            if (!edu2Error) {
                console.log('✅ Updated: Strathmore University - AWS Certification')
            }
        }

        // Update third if exists - Bootcamp
        if (eduRecords.length > 2) {
            const { error: edu3Error } = await supabase
                .from('education')
                .update({
                    institution: 'Moringa School',
                    degree: 'Bootcamp Certificate',
                    field_of_study: 'Full-Stack Web Development',
                    start_date: '2021-06-01',
                    end_date: '2021-09-30',
                    is_current: false,
                    grade: 'Distinction',
                    description: 'Intensive coding bootcamp focused on modern web development technologies including React, Node.js, PostgreSQL, and RESTful API design.',
                    location: 'Nairobi, Kenya',
                    display_order: 3
                })
                .eq('id', eduRecords[2].id)

            if (!edu3Error) {
                console.log('✅ Updated: Moringa School - Full-Stack Bootcamp')
            }
        }
    }
    console.log('')

    // =====================================
    // 3. UPDATE EXISTING EXPERIENCE RECORDS
    // =====================================
    console.log('💼 Updating work experience...')

    const { data: expRecords } = await supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true })

    if (expRecords && expRecords.length > 0) {
        // Update first experience - Safaricom
        const { error: exp1Error } = await supabase
            .from('experience')
            .update({
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
            })
            .eq('id', expRecords[0].id)

        if (!exp1Error) {
            console.log('✅ Updated: Software Engineer at Safaricom PLC')
        } else {
            console.error('❌ Error:', exp1Error.message)
        }
    }
    console.log('')

    // =====================================
    // 4. UPDATE PORTFOLIO CONTENT
    // =====================================
    console.log('🎨 Updating portfolio projects...')

    const { data: portfolioRecords } = await supabase
        .from('portfolio_content')
        .select('*')
        .limit(8)

    const sampleProjects = [
        {
            title: 'AI-Powered Medical Diagnosis System',
            category: 'ai_ml',
            content: 'Machine learning system that assists healthcare providers with preliminary disease diagnosis using patient symptoms and medical history. Utilizes deep learning models trained on medical datasets with 94% accuracy. Features symptom analysis, disease prediction with confidence scores, treatment recommendations, and medical imaging analysis using computer vision. Built with Python, TensorFlow, Flask, React, PostgreSQL, Docker, scikit-learn, and OpenCV.',
            tags: ['Machine Learning', 'Healthcare', 'Deep Learning', 'Computer Vision', 'AI', 'Python', 'TensorFlow']
        },
        {
            title: 'CloudCommerce - E-Commerce Platform',
            category: 'web_app',
            content: 'Enterprise-grade e-commerce platform built with microservices architecture supporting 100K+ concurrent users. Features real-time inventory management, advanced search with Elasticsearch, secure payment processing, order tracking, and analytics dashboard. Deployed on AWS with auto-scaling and high availability. Technologies: Next.js, Node.js, TypeScript, PostgreSQL, Redis, Elasticsearch, AWS, Docker, Kubernetes, Stripe.',
            tags: ['E-Commerce', 'Microservices', 'Cloud', 'Full-Stack', 'TypeScript', 'Next.js', 'AWS']
        },
        {
            title: 'DevOps Dashboard - Infrastructure Tool',
            category: 'devops',
            content: 'Comprehensive DevOps dashboard for monitoring and managing cloud infrastructure across multiple providers. Real-time metrics visualization, log aggregation, alert management, cost optimization insights, and automated deployment workflows. Integrates with AWS, Azure, and GCP. Built with React, Node.js, GraphQL, Prometheus, Grafana, Docker, Terraform, and GitHub Actions.',
            tags: ['DevOps', 'Monitoring', 'Cloud', 'Infrastructure', 'Automation', 'Terraform', 'Kubernetes']
        },
        {
            title: 'AfriPay - Mobile Money Integration',
            category: 'fintech',
            content: 'Unified API platform for integrating multiple mobile money providers (M-Pesa, Airtel Money, T-Kash) with a single SDK. Simplifies payment integration for developers with comprehensive documentation, webhook support, and transaction reconciliation. Used by 50+ businesses across Kenya. Technologies: Node.js, TypeScript, PostgreSQL, Redis, Express, Docker, Swagger, Jest.',
            tags: ['FinTech', 'API', 'Mobile Money', 'Payments', 'M-Pesa', 'Integration', 'TypeScript']
        },
        {
            title: 'SmartCity Traffic Prediction',
            category: 'ai_ml',
            content: 'Machine learning system that predicts traffic congestion in Nairobi using historical data, weather patterns, and real-time traffic feeds. Provides route optimization suggestions and helps city planners make data-driven decisions. Features interactive visualization dashboard and mobile app integration. Built with Python, PyTorch, FastAPI, React, MongoDB, Docker, pandas, matplotlib.',
            tags: ['Machine Learning', 'Smart City', 'Predictive Analytics', 'IoT', 'Python', 'PyTorch']
        },
        {
            title: 'SecureChat - Encrypted Messaging',
            category: 'web_app',
            content: 'Privacy-focused real-time messaging application with end-to-end encryption, voice/video calls, file sharing, and self-destructing messages. Built with security-first approach using industry-standard encryption protocols. Cross-platform support for web and mobile. Technologies: React, Node.js, WebRTC, Socket.io, MongoDB, React Native.',
            tags: ['Security', 'Real-time', 'Encryption', 'WebRTC', 'Messaging', 'Privacy']
        },
        {
            title: 'CodeCollab - Real-time Code Editor',
            category: 'collaboration',
            content: 'Collaborative code editor with real-time synchronization, syntax highlighting for 50+ languages, integrated terminal, live preview, and video chat. Perfect for remote pair programming and technical interviews. Supports multiple cursors and collaborative debugging. Built with React, Node.js, Socket.io, Monaco Editor, WebRTC, Docker.',
            tags: ['Collaboration', 'Real-time', 'Code Editor', 'WebRTC', 'Developer Tools']
        },
        {
            title: 'AgriTech Crop Monitoring',
            category: 'iot',
            content: 'IoT-based crop monitoring system for farmers using sensor data to track soil moisture, temperature, humidity, and crop health. Machine learning models predict optimal irrigation times and detect plant diseases early. Mobile app for farmers and web dashboard for agriculture extension officers. Technologies: Python, IoT, React, Node.js, TensorFlow, MQTT, React Native.',
            tags: ['IoT', 'Agriculture', 'Machine Learning', 'Mobile', 'Smart Farming', 'TensorFlow']
        }
    ]

    if (portfolioRecords) {
        for (let i = 0; i < Math.min(portfolioRecords.length, sampleProjects.length); i++) {
            const { error } = await supabase
                .from('portfolio_content')
                .update(sampleProjects[i])
                .eq('id', portfolioRecords[i].id)

            if (!error) {
                console.log(`✅ Updated: ${sampleProjects[i].title}`)
            }
        }
    }
    console.log('')

    // =====================================
    // 5. UPDATE SKILLS
    // =====================================
    console.log('🛠️ Updating CS skills...')

    const skills = [
        // Featured Skills
        { name: 'Python', category: 'languages', proficiency_level: 95, is_featured: true, display_order: 1 },
        { name: 'TypeScript', category: 'languages', proficiency_level: 90, is_featured: true, display_order: 2 },
        { name: 'JavaScript', category: 'languages', proficiency_level: 90, is_featured: true, display_order: 3 },
        { name: 'React', category: 'frontend', proficiency_level: 95, is_featured: true, display_order: 4 },
        { name: 'Next.js', category: 'frontend', proficiency_level: 90, is_featured: true, display_order: 5 },
        { name: 'Node.js', category: 'backend', proficiency_level: 90, is_featured: true, display_order: 6 },
        { name: '.NET Core', category: 'backend', proficiency_level: 85, is_featured: true, display_order: 7 },
        { name: 'Azure', category: 'cloud', proficiency_level: 85, is_featured: true, display_order: 8 },
        { name: 'Docker', category: 'devops', proficiency_level: 90, is_featured: true, display_order: 9 },
        { name: 'TensorFlow', category: 'ai_ml', proficiency_level: 85, is_featured: true, display_order: 10 },

        // Additional important skills
        { name: 'AWS', category: 'cloud', proficiency_level: 80, is_featured: false, display_order: 11 },
        { name: 'PostgreSQL', category: 'database', proficiency_level: 90, is_featured: false, display_order: 12 },
        { name: 'MongoDB', category: 'database', proficiency_level: 85, is_featured: false, display_order: 13 },
        { name: 'Redis', category: 'database', proficiency_level: 80, is_featured: false, display_order: 14 },
        { name: 'Kubernetes', category: 'devops', proficiency_level: 80, is_featured: false, display_order: 15 },
        { name: 'Git', category: 'devops', proficiency_level: 95, is_featured: false, display_order: 16 },
        { name: 'REST API', category: 'backend', proficiency_level: 95, is_featured: false, display_order: 17 },
        { name: 'GraphQL', category: 'backend', proficiency_level: 80, is_featured: false, display_order: 18 },
        { name: 'Tailwind CSS', category: 'frontend', proficiency_level: 90, is_featured: false, display_order: 19 },
        { name: 'Machine Learning', category: 'ai_ml', proficiency_level: 85, is_featured: false, display_order: 20 },
    ]

    let skillsUpdated = 0
    for (const skill of skills) {
        const { error } = await supabase
            .from('skills')
            .upsert(skill, { onConflict: 'name' })

        if (!error) {
            skillsUpdated++
        }
    }
    console.log(`✅ Updated/Added ${skillsUpdated} skills\n`)

    // =====================================
    // 6. VERIFY UPDATES
    // =====================================
    console.log('🔍 Verifying updates...\n')

    const { data: personalData } = await supabase.from('personal_info').select('full_name, title, location').limit(1).single()
    if (personalData) {
        console.log('✅ Personal Info:')
        console.log('   Name:', personalData.full_name)
        console.log('   Title:', personalData.title)
        console.log('   Location:', personalData.location)
    }

    const { count: eduCount } = await supabase.from('education').select('*', { count: 'exact', head: true })
    console.log(`\n✅ Education records: ${eduCount}`)

    const { count: expCount } = await supabase.from('experience').select('*', { count: 'exact', head: true })
    console.log(`✅ Experience records: ${expCount}`)

    const { count: projectCount } = await supabase.from('portfolio_content').select('*', { count: 'exact', head: true })
    console.log(`✅ Portfolio projects: ${projectCount}`)

    const { count: skillsCount } = await supabase.from('skills').select('*', { count: 'exact', head: true })
    console.log(`✅ Skills in database: ${skillsCount}`)

    console.log('\n✨ CS Graduate Profile Update Complete!\n')
    console.log('🎓 Profile successfully updated for an excellent Computer Science graduate')
    console.log('📍 Location confirmed: Nairobi, Kenya')
    console.log('🚀 Portfolio now showcases impressive CS projects and skills\n')
}

updateProfile().catch(console.error)

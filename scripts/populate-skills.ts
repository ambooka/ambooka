/**
 * Script to populate the Supabase database with comprehensive 2025 skills
 * Run with: npx tsx scripts/populate-skills.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const skills = [
    // Languages - 13 skills
    { name: 'Python', category: 'languages', proficiency_level: 95, is_featured: true },
    { name: 'TypeScript', category: 'languages', proficiency_level: 90, is_featured: true },
    { name: 'JavaScript', category: 'languages', proficiency_level: 90, is_featured: true },
    { name: 'Java', category: 'languages', proficiency_level: 80, is_featured: false },
    { name: 'C++', category: 'languages', proficiency_level: 75, is_featured: false },
    { name: 'C#', category: 'languages', proficiency_level: 80, is_featured: false },
    { name: 'Go', category: 'languages', proficiency_level: 70, is_featured: false },
    { name: 'Rust', category: 'languages', proficiency_level: 65, is_featured: false },
    { name: 'SQL', category: 'languages', proficiency_level: 85, is_featured: false },
    { name: 'Bash', category: 'languages', proficiency_level: 80, is_featured: false },
    { name: 'PowerShell', category: 'languages', proficiency_level: 75, is_featured: false },
    { name: 'HTML', category: 'languages', proficiency_level: 95, is_featured: false },
    { name: 'CSS', category: 'languages', proficiency_level: 95, is_featured: false },

    // Frontend - 11 skills
    { name: 'React', category: 'frontend', proficiency_level: 95, is_featured: true },
    { name: 'Next.js', category: 'frontend', proficiency_level: 90, is_featured: true },
    { name: 'Vue', category: 'frontend', proficiency_level: 75, is_featured: false },
    { name: 'Angular', category: 'frontend', proficiency_level: 70, is_featured: false },
    { name: 'Svelte', category: 'frontend', proficiency_level: 65, is_featured: false },
    { name: 'Tailwind CSS', category: 'frontend', proficiency_level: 90, is_featured: false },
    { name: 'Bootstrap', category: 'frontend', proficiency_level: 85, is_featured: false },
    { name: 'Material-UI', category: 'frontend', proficiency_level: 80, is_featured: false },
    { name: 'Redux', category: 'frontend', proficiency_level: 85, is_featured: false },
    { name: 'Webpack', category: 'frontend', proficiency_level: 75, is_featured: false },
    { name: 'Vite', category: 'frontend', proficiency_level: 80, is_featured: false },

    // Backend - 11 skills
    { name: 'Node.js', category: 'backend', proficiency_level: 90, is_featured: true },
    { name: '.NET Core', category: 'backend', proficiency_level: 85, is_featured: true },
    { name: 'Express', category: 'backend', proficiency_level: 90, is_featured: false },
    { name: 'NestJS', category: 'backend', proficiency_level: 75, is_featured: false },
    { name: 'Spring Boot', category: 'backend', proficiency_level: 70, is_featured: false },
    { name: 'Django', category: 'backend', proficiency_level: 80, is_featured: false },
    { name: 'FastAPI', category: 'backend', proficiency_level: 85, is_featured: false },
    { name: 'Flask', category: 'backend', proficiency_level: 80, is_featured: false },
    { name: 'GraphQL', category: 'backend', proficiency_level: 80, is_featured: false },
    { name: 'REST API', category: 'backend', proficiency_level: 95, is_featured: false },
    { name: 'WebSockets', category: 'backend', proficiency_level: 75, is_featured: false },

    // Database - 9 skills
    { name: 'PostgreSQL', category: 'database', proficiency_level: 90, is_featured: false },
    { name: 'MongoDB', category: 'database', proficiency_level: 85, is_featured: false },
    { name: 'MySQL', category: 'database', proficiency_level: 85, is_featured: false },
    { name: 'Redis', category: 'database', proficiency_level: 80, is_featured: false },
    { name: 'Elasticsearch', category: 'database', proficiency_level: 70, is_featured: false },
    { name: 'Cassandra', category: 'database', proficiency_level: 65, is_featured: false },
    { name: 'Supabase', category: 'database', proficiency_level: 85, is_featured: false },
    { name: 'Firebase', category: 'database', proficiency_level: 80, is_featured: false },
    { name: 'Prisma', category: 'database', proficiency_level: 80, is_featured: false },

    // Cloud - 7 skills
    { name: 'Azure', category: 'cloud', proficiency_level: 85, is_featured: true },
    { name: 'AWS', category: 'cloud', proficiency_level: 80, is_featured: false },
    { name: 'Google Cloud', category: 'cloud', proficiency_level: 75, is_featured: false },
    { name: 'AWS Lambda', category: 'cloud', proficiency_level: 75, is_featured: false },
    { name: 'Azure Functions', category: 'cloud', proficiency_level: 80, is_featured: false },
    { name: 'EC2', category: 'cloud', proficiency_level: 75, is_featured: false },
    { name: 'S3', category: 'cloud', proficiency_level: 80, is_featured: false },

    // DevOps - 11 skills
    { name: 'Docker', category: 'devops', proficiency_level: 90, is_featured: true },
    { name: 'Kubernetes', category: 'devops', proficiency_level: 80, is_featured: false },
    { name: 'Git', category: 'devops', proficiency_level: 95, is_featured: false },
    { name: 'GitHub', category: 'devops', proficiency_level: 95, is_featured: false },
    { name: 'GitLab', category: 'devops', proficiency_level: 85, is_featured: false },
    { name: 'Jenkins', category: 'devops', proficiency_level: 75, is_featured: false },
    { name: 'GitHub Actions', category: 'devops', proficiency_level: 85, is_featured: false },
    { name: 'Terraform', category: 'devops', proficiency_level: 75, is_featured: false },
    { name: 'Ansible', category: 'devops', proficiency_level: 80, is_featured: false },
    { name: 'Prometheus', category: 'devops', proficiency_level: 70, is_featured: false },
    { name: 'Grafana', category: 'devops', proficiency_level: 70, is_featured: false },

    // Networking - 11 skills
    { name: 'TCP/IP', category: 'networking', proficiency_level: 90, is_featured: false },
    { name: 'DNS', category: 'networking', proficiency_level: 85, is_featured: false },
    { name: 'DHCP', category: 'networking', proficiency_level: 85, is_featured: false },
    { name: 'VLANs', category: 'networking', proficiency_level: 80, is_featured: false },
    { name: 'Cisco', category: 'networking', proficiency_level: 85, is_featured: false },
    { name: 'Network Security', category: 'networking', proficiency_level: 85, is_featured: false },
    { name: 'VPN', category: 'networking', proficiency_level: 85, is_featured: false },
    { name: 'Firewalls', category: 'networking', proficiency_level: 85, is_featured: false },
    { name: 'Wireshark', category: 'networking', proficiency_level: 80, is_featured: false },
    { name: 'Network Automation', category: 'networking', proficiency_level: 80, is_featured: false },
    { name: 'SD-WAN', category: 'networking', proficiency_level: 75, is_featured: false },

    // Security - 6 skills
    { name: 'Cybersecurity', category: 'security', proficiency_level: 85, is_featured: false },
    { name: 'SSL/TLS', category: 'security', proficiency_level: 85, is_featured: false },
    { name: 'OAuth', category: 'security', proficiency_level: 85, is_featured: false },
    { name: 'JWT', category: 'security', proficiency_level: 90, is_featured: false },
    { name: 'OWASP', category: 'security', proficiency_level: 80, is_featured: false },
    { name: 'Encryption', category: 'security', proficiency_level: 80, is_featured: false },

    // AI/ML - 8 skills
    { name: 'TensorFlow', category: 'ai_ml', proficiency_level: 85, is_featured: true },
    { name: 'PyTorch', category: 'ai_ml', proficiency_level: 80, is_featured: false },
    { name: 'scikit-learn', category: 'ai_ml', proficiency_level: 85, is_featured: false },
    { name: 'Keras', category: 'ai_ml', proficiency_level: 80, is_featured: false },
    { name: 'Machine Learning', category: 'ai_ml', proficiency_level: 85, is_featured: false },
    { name: 'Deep Learning', category: 'ai_ml', proficiency_level: 80, is_featured: false },
    { name: 'Natural Language Processing', category: 'ai_ml', proficiency_level: 75, is_featured: false },
    { name: 'Computer Vision', category: 'ai_ml', proficiency_level: 75, is_featured: false },

    // Mobile - 3 skills
    { name: 'Flutter', category: 'mobile', proficiency_level: 85, is_featured: false },
    { name: 'React Native', category: 'mobile', proficiency_level: 80, is_featured: false },
    { name: 'Mobile Development', category: 'mobile', proficiency_level: 85, is_featured: false },

    // Tools - 6 skills
    { name: 'Linux', category: 'tools', proficiency_level: 90, is_featured: false },
    { name: 'Figma', category: 'tools', proficiency_level: 80, is_featured: false },
    { name: 'Jira', category: 'tools', proficiency_level: 85, is_featured: false },
    { name: 'VS Code', category: 'tools', proficiency_level: 95, is_featured: false },
    { name: 'Postman', category: 'tools', proficiency_level: 90, is_featured: false },
    { name: 'System Administration', category: 'tools', proficiency_level: 90, is_featured: false },
]

async function populateSkills() {
    console.log('🚀 Starting skills population...')
    console.log(`📊 Total skills to add: ${skills.length}`)

    // Upsert all skills
    for (const skill of skills) {
        try {
            const { data, error } = await supabase
                .from('skills')
                .upsert(skill, { onConflict: 'name' })

            if (error) {
                console.error(`❌ Error adding ${skill.name}:`, error.message)
            } else {
                console.log(`✅ Added/Updated: ${skill.name} (${skill.category})`)
            }
        } catch (err) {
            console.error(`❌ Exception for ${skill.name}:`, err)
        }
    }

    // Verify counts
    const { data: skillsData, error: countError } = await supabase
        .from('skills')
        .select('category', { count: 'exact', head: false })

    if (!countError && skillsData) {
        const categories = skillsData.reduce((acc: any, skill: any) => {
            acc[skill.category] = (acc[skill.category] || 0) + 1
            return acc
        }, {})

        console.log('\n📈 Skills by category:')
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count}`)
        })
    }

    console.log('\n✨ Skills population complete!')
}

populateSkills().catch(console.error)

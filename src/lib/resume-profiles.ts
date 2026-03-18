/**
 * Resume Role Profiles - Fine-Tuned for ATS Optimization
 * 
 * Each profile has STRICT skill filtering:
 * - Skills filtered by CATEGORY (include/exclude lists)
 * - Skills filtered by NAME (exclude specific tools not relevant to role)
 */

export type RoleVariant =
    | 'software-engineer'
    | 'full-stack'
    | 'frontend'
    | 'backend'
    | 'cloud-mlops'
    | 'it-assistant';

export interface RoleProfile {
    id: RoleVariant;
    displayName: string;
    title: string;
    languages: string[];           // For GitHub project filtering
    keywords: string[];            // ATS keywords for this role
    skillCategories: string[];     // ONLY these categories shown
    excludeCategories: string[];   // Explicitly exclude these categories
    excludeSkillNames: string[];   // Exclude specific skill names (ML tools, DevOps, etc.)
    summaryFocus: string;
    experienceEmphasis: string[];
    professionalSummary: string;
}

// ============================================================================
// SKILL EXCLUSION LISTS - Skills to exclude by NAME for specific roles
// ============================================================================

/** ML/AI specific tools - exclude from non-ML resumes */
const ML_TOOLS = [
    'PyTorch', 'TensorFlow', 'scikit-learn', 'Keras', 'pandas', 'numpy',
    'MLflow', 'Kubeflow', 'Ray', 'LangChain', 'LlamaIndex', 'OpenAI',
    'HuggingFace', 'Transformers', 'CUDA', 'Jupyter', 'Ollama',
    'Model Serving', 'Feature Store', 'Weights & Biases', 'DVC'
];

/** DevOps/Infrastructure tools - exclude from dev-focused resumes */
const DEVOPS_TOOLS = [
    'Kubernetes', 'Docker', 'Terraform', 'ArgoCD', 'Helm', 'Ansible',
    'Jenkins', 'CircleCI', 'GitLab CI', 'GitHub Actions',
    'Prometheus', 'Grafana', 'Datadog', 'ELK Stack', 'Jaeger',
    'Apache Airflow', 'Prefect', 'Dagster', 'Nginx', 'Traefik'
];

/** Cloud-specific tools - exclude from pure dev resumes */
const CLOUD_TOOLS = [
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Lambda', 'EC2', 'S3',
    'CloudFormation', 'CDK', 'Serverless', 'Cloud Run', 'Cloud Functions'
];

/** Backend-specific tools - exclude from frontend resumes */
const BACKEND_TOOLS = [
    'FastAPI', 'Django', 'Flask', 'Express', 'NestJS', 'Spring Boot',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
    'GraphQL', 'gRPC', 'RabbitMQ', 'Kafka', 'Celery'
];

/** Frontend-specific tools - exclude from backend resumes */
const FRONTEND_TOOLS = [
    'React', 'Next.js', 'Vue', 'Angular', 'Svelte',
    'Tailwind CSS', 'Styled Components', 'Material UI', 'Chakra UI',
    'Framer Motion', 'GSAP', 'Three.js', 'WebGL'
];

/** IT Support / Help Desk specific tools */
const IT_SUPPORT_TOOLS = [
    'Windows Server', 'Active Directory', 'Office 365', 'Microsoft 365',
    'ServiceNow', 'JIRA Service Desk', 'Zendesk', 'Freshdesk',
    'Remote Desktop', 'TeamViewer', 'VPN', 'TCP/IP', 'DNS', 'DHCP',
    'Printer Management', 'Network Troubleshooting', 'Hardware Support',
    'Antivirus', 'Backup Solutions', 'User Account Management'
];

// ============================================================================
// ROLE PROFILES
// ============================================================================

export const ROLE_PROFILES: Record<RoleVariant, RoleProfile> = {
    'software-engineer': {
        id: 'software-engineer',
        displayName: 'Software Engineer (General)',
        title: 'Software Engineer',
        languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'C++', 'C#'],
        keywords: [
            'Software Development', 'System Design', 'Data Structures', 'Algorithms',
            'Object-Oriented Programming', 'Design Patterns', 'Testing', 'Agile', 'Scrum',
            'Clean Code', 'SOLID Principles', 'Version Control'
        ],
        skillCategories: ['Languages', 'Frameworks', 'Databases', 'Tools'],
        excludeCategories: ['ML', 'Cloud', 'DevOps'],
        excludeSkillNames: [...ML_TOOLS, ...DEVOPS_TOOLS, ...CLOUD_TOOLS],
        summaryFocus: 'building robust software systems with clean architecture',
        experienceEmphasis: ['software', 'development', 'engineering', 'design', 'architecture'],
        professionalSummary: 'CS graduate (Maseno University) with 3+ years delivering production software in Python and TypeScript. Transitioning into AI/ML Engineering through the Nexus platform — a 26-month, 5-phase build from Dockerised CLI to production multi-agent AI systems. Delivered M-Pesa payment integrations, custom dashboards, and REST APIs for Kenyan SME clients. Currently in Phase 1: Python, Docker, SQL, and CI/CD foundations.'
    },

    'full-stack': {
        id: 'full-stack',
        displayName: 'Full-Stack Developer',
        title: 'Full-Stack Developer',
        languages: ['TypeScript', 'JavaScript', 'Python'],
        keywords: [
            'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB',
            'REST API', 'GraphQL', 'Responsive Design', 'Authentication', 'Full-Stack'
        ],
        skillCategories: ['Languages', 'Frontend', 'Backend', 'Databases', 'Frameworks', 'Tools'],
        excludeCategories: ['ML', 'Cloud', 'DevOps'],
        excludeSkillNames: [...ML_TOOLS, ...DEVOPS_TOOLS, ...CLOUD_TOOLS],
        summaryFocus: 'building end-to-end web applications',
        experienceEmphasis: ['full-stack', 'web', 'frontend', 'backend', 'api', 'database'],
        professionalSummary: 'Full-Stack Developer with 3+ years building React, Next.js, and Node.js applications for Kenyan and international clients. Specialised in M-Pesa Daraja API integrations, custom business dashboards, and OpenAPI-documented REST services. Delivered 12+ projects on time with 100% client satisfaction. CS graduate transitioning into AI/ML Engineering through the Nexus platform.'
    },

    'frontend': {
        id: 'frontend',
        displayName: 'Frontend Developer',
        title: 'Frontend Developer',
        languages: ['TypeScript', 'JavaScript', 'CSS', 'HTML'],
        keywords: [
            'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'CSS-in-JS',
            'Responsive Design', 'Accessibility', 'Performance', 'Component Libraries',
            'State Management', 'Web Vitals', 'UI/UX'
        ],
        skillCategories: ['Languages', 'Frontend', 'Frameworks', 'Tools'],
        excludeCategories: ['Backend', 'Databases', 'ML', 'Cloud', 'DevOps'],
        excludeSkillNames: [...ML_TOOLS, ...DEVOPS_TOOLS, ...CLOUD_TOOLS, ...BACKEND_TOOLS],
        summaryFocus: 'creating performant and accessible user interfaces',
        experienceEmphasis: ['frontend', 'ui', 'ux', 'react', 'css', 'javascript', 'accessibility'],
        professionalSummary: 'Frontend Developer with 3+ years crafting performant, accessible web interfaces using React, Next.js, and TypeScript. Built responsive applications serving 100K+ users with focus on Core Web Vitals optimization and WCAG accessibility standards. Experienced in component architecture, state management, and delivering pixel-perfect designs across 15+ production projects.'
    },

    'backend': {
        id: 'backend',
        displayName: 'Backend Developer',
        title: 'Backend Developer',
        languages: ['Python', 'Node.js', 'Go', 'Java', 'TypeScript'],
        keywords: [
            'REST API', 'GraphQL', 'PostgreSQL', 'Redis', 'Message Queues',
            'Authentication', 'Authorization', 'Database Design', 'Caching',
            'Microservices', 'System Design', 'API Security'
        ],
        skillCategories: ['Languages', 'Backend', 'Databases', 'Frameworks', 'Tools'],
        excludeCategories: ['Frontend', 'ML', 'Cloud', 'DevOps'],
        excludeSkillNames: [...ML_TOOLS, ...DEVOPS_TOOLS, ...CLOUD_TOOLS, ...FRONTEND_TOOLS],
        summaryFocus: 'designing scalable backend systems and APIs',
        experienceEmphasis: ['backend', 'api', 'database', 'server', 'microservices', 'performance'],
        professionalSummary: 'Backend Engineer with 3+ years building Node.js, Express, and FastAPI services for production use. Deep experience with M-Pesa Daraja API (STK Push, B2C, webhooks), PostgreSQL schema design, Redis caching, and BullMQ async job queues. Containerised deployments on Nginx-fronted Hetzner VPS with GitHub Actions CI/CD. CS graduate building toward AI/ML Engineering.'
    },

    'cloud-mlops': {
        id: 'cloud-mlops',
        displayName: 'Cloud & MLOps Engineer',
        title: 'Cloud & MLOps Engineer',
        languages: ['Python', 'Go', 'Bash', 'YAML'],
        keywords: [
            'AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform',
            'CI/CD', 'Infrastructure as Code', 'MLflow', 'Kubeflow',
            'Model Serving', 'ML Pipelines', 'Monitoring', 'GitOps'
        ],
        skillCategories: ['Cloud', 'DevOps', 'ML', 'Languages', 'Tools', 'Databases'],
        excludeCategories: ['Frontend'],
        excludeSkillNames: [...FRONTEND_TOOLS],
        summaryFocus: 'building ML infrastructure and cloud-native platforms',
        experienceEmphasis: ['cloud', 'infrastructure', 'kubernetes', 'docker', 'ml', 'pipeline', 'automation'],
        professionalSummary: 'Software Engineer transitioning into AI/ML through the 26-month Nexus roadmap. Phase 1 (current): Python, Docker Compose, GitHub Actions CI/CD, PostgreSQL, Nginx on Hetzner VPS. Phase 2 (upcoming): TypeScript, k3s Kubernetes, Terraform AWS, Prometheus/Grafana. Phase 3+: PyTorch, HuggingFace, RAG, LangChain, MLflow. CS graduate with 3+ years full-stack production experience.'
    },

    'it-assistant': {
        id: 'it-assistant',
        displayName: 'IT Assistant / Support',
        title: 'IT Assistant',
        languages: ['Windows', 'Linux', 'macOS', 'Bash', 'PowerShell', 'SQL'],
        keywords: [
            // Core IT Support
            'Technical Support', 'Help Desk', 'IT Support', 'Troubleshooting', 'Problem Resolution',
            'Hardware Support', 'Software Installation', 'System Administration', 'User Training',
            // Microsoft Stack
            'Active Directory', 'Office 365', 'Microsoft 365', 'Windows Server', 'Azure AD',
            'Remote Desktop', 'Microsoft Teams', 'SharePoint', 'Exchange Online',
            // Hospitality Technology
            'Opera PMS', 'Property Management System', 'Simphony POS', 'Point of Sale',
            'Guest WiFi', 'IPTV Systems', 'Digital Signage', 'Room Technology',
            'Hotel Technology', 'Hospitality IT', 'Front Desk Systems', 'Back Office Systems',
            // Networking & Security
            'Network Administration', 'TCP/IP', 'VPN', 'Firewall', 'Network Security',
            'Printer Management', 'Backup Solutions', 'Disaster Recovery',
            // Service Management
            'ITIL', 'ServiceNow', 'Ticketing Systems', 'SLA Management', 'Incident Management',
            'Customer Service', 'Guest Experience', 'End User Support'
        ],
        // Show only IT Support appropriate categories
        skillCategories: ['Tools', 'Networking', 'Security', 'IT Support'],
        excludeCategories: ['ML', 'Frontend', 'Backend', 'Languages', 'Databases', 'Cloud', 'DevOps', 'Frameworks'],
        // Exclude developer tools - keep only IT support appropriate ones
        excludeSkillNames: [
            ...ML_TOOLS, ...FRONTEND_TOOLS, ...BACKEND_TOOLS, ...DEVOPS_TOOLS, ...CLOUD_TOOLS,
            // Also exclude programming languages (not needed for IT Assistant)
            'Python', 'TypeScript', 'JavaScript', 'Java', 'Go', 'Rust', 'C++', 'C#',
            'Node.js', 'React', 'Vue', 'Angular', 'Next.js',
            // Exclude advanced tools
            'pytest', 'Jest', 'Webpack', 'Vite', 'npm', 'yarn'
        ],
        summaryFocus: 'delivering exceptional IT support in hospitality environments',
        experienceEmphasis: ['support', 'helpdesk', 'technical', 'troubleshooting', 'customer', 'service', 'it', 'hotel', 'hospitality', 'guest'],
        professionalSummary: 'IT Professional with 3+ years delivering technical support and ensuring seamless technology operations in fast-paced environments. Expert in troubleshooting hardware/software issues, managing Active Directory, and maintaining 99%+ system uptime. Passionate about guest experience with a "Yes I Can!" service attitude, combining technical expertise with exceptional communication skills. Experienced with hospitality systems including Property Management Systems, Point of Sale, and guest-facing technology. Skilled in network administration, Microsoft 365, and providing end-user training to enhance operational efficiency.'
    },
};

/**
 * Get all role options for UI dropdown
 */
export function getRoleOptions(): Array<{ value: RoleVariant; label: string }> {
    return Object.values(ROLE_PROFILES).map(profile => ({
        value: profile.id,
        label: profile.displayName,
    }));
}

/**
 * Filter skills by role profile - filters by BOTH category AND skill name
 */
export function filterSkillsByRole(
    skills: Array<{ name: string; category: string;[key: string]: unknown }>,
    role: RoleVariant
): Array<{ name: string; category: string;[key: string]: unknown }> {
    const profile = ROLE_PROFILES[role];

    // [RESUME FIX]: Force hardcoded skills for IT Assistant to ensure perfect alignment
    if (role === 'it-assistant') {
        return [
            { name: 'Windows Server', category: 'IT Support', id: 'it-win', proficiency_level: 90 },
            { name: 'Active Directory', category: 'IT Support', id: 'it-ad', proficiency_level: 90 },
            { name: 'Network Administration', category: 'IT Support', id: 'it-net', proficiency_level: 85 },
            { name: 'Cybersecurity', category: 'IT Support', id: 'it-sec', proficiency_level: 85 },
            { name: 'Microsoft 365', category: 'IT Support', id: 'it-m365', proficiency_level: 90 },
            { name: 'Hardware Troubleshooting', category: 'IT Support', id: 'it-hw', proficiency_level: 95 },
            { name: 'IT Support', category: 'IT Support', id: 'it-sup', proficiency_level: 95 },
            { name: 'Office 365 Administration', category: 'IT Support', id: 'it-o365', proficiency_level: 90 },
            { name: 'Remote Desktop Support', category: 'IT Support', id: 'it-rdp', proficiency_level: 90 },
            { name: 'Printer Management', category: 'IT Support', id: 'it-print', proficiency_level: 85 },
            { name: 'System Maintenance', category: 'IT Support', id: 'it-maint', proficiency_level: 90 },
            { name: 'User Training', category: 'IT Support', id: 'it-train', proficiency_level: 85 },
            { name: 'Ticketing Systems', category: 'IT Support', id: 'it-ticket', proficiency_level: 90 }
        ] as Array<{ name: string; category: string;[key: string]: unknown }>;
    }

    return skills.filter(skill => {
        // Step 1: Check if category is allowed
        const isIncludedCategory = profile.skillCategories.includes(skill.category);
        const isExcludedCategory = profile.excludeCategories.includes(skill.category);

        if (!isIncludedCategory || isExcludedCategory) {
            return false;
        }

        // Step 2: Check if skill name should be excluded (ML tools in Software Eng, etc.)
        const isExcludedByName = profile.excludeSkillNames.some(
            excludedName => skill.name.toLowerCase().includes(excludedName.toLowerCase())
        );

        return !isExcludedByName;
    });
}

/**
 * Language to role mapping for GitHub project filtering
 */
export const LANGUAGE_ROLE_MAP: Record<string, RoleVariant[]> = {
    'TypeScript': ['software-engineer', 'full-stack', 'frontend', 'backend'],
    'JavaScript': ['software-engineer', 'full-stack', 'frontend'],
    'Python': ['software-engineer', 'backend', 'cloud-mlops'],
    'Go': ['software-engineer', 'backend', 'cloud-mlops'],
    'Java': ['software-engineer', 'backend'],
    'C#': ['software-engineer'],
    'C++': ['software-engineer'],
    'CSS': ['frontend'],
    'HTML': ['frontend'],
    'HCL': ['cloud-mlops'],
    'Shell': ['cloud-mlops'],
    'Dockerfile': ['cloud-mlops'],
    'Jupyter Notebook': ['cloud-mlops'],
    'Windows': ['it-assistant'],
    'macOS': ['it-assistant'],
};

/**
 * Check if a GitHub language matches a role profile
 */
export function languageMatchesRole(language: string | null | undefined, role: RoleVariant): boolean {
    if (!language) return false;
    const profile = ROLE_PROFILES[role];
    return profile.languages.some(
        lang => language.toLowerCase().includes(lang.toLowerCase())
    );
}

/**
 * Fallback project descriptions for GitHub repos without descriptions
 */
export const PROJECT_FALLBACK_DESCRIPTIONS: Record<string, string> = {
    'ambooka': 'Personal portfolio site built with Next.js 16 and Supabase — features admin CMS, AI-generated resume variants, GitHub sync, and Playwright e2e tests.',
    'nexus': 'The Nexus platform: a 26-month, 5-phase AI/ML engineering portfolio project building from a Dockerised Python CLI to a production multi-agent AI system.',
    'storyline': 'Interactive storytelling platform built with TypeScript — exploring narrative structure and real-time collaborative writing.',
    'GenAI': 'Generative AI experiments: RAG prototypes, prompt engineering studies, and LLM API integrations documented as learning artefacts.',
    'Teleboard': 'Java-based telecommunications dashboard for managing and visualising network operations data.',
    'Skytracks': 'Aviation tracking application built with Java — real-time flight data and route visualisation.',
    'charity': 'Non-profit website template with donation integration and event management.',
    'BrigdeOfHope': 'Community support platform connecting donors with charitable causes.',
    'QuranApp': 'Privacy-focused mobile application for exploring the Holy Quran — ad-free reading experience.',
    'Online3DViewer': 'Browser-based 3D model visualisation tool supporting multiple file formats.',
};

/**
 * Get project description with fallback
 */
export function getProjectDescription(projectName: string, existingDescription?: string | null): string {
    if (existingDescription && existingDescription.trim().length > 0) {
        return existingDescription;
    }
    return PROJECT_FALLBACK_DESCRIPTIONS[projectName] ||
        `${projectName} - A software project demonstrating modern development practices.`;
}

/**
 * Portfolio configuration
 */
export const PORTFOLIO_CONFIG = {
    url: 'ambooka.dev',
    github: 'github.com/ambooka',
    linkedin: 'www.linkedin.com/in/ambooka',
    username: 'ambooka',
};

export default ROLE_PROFILES;


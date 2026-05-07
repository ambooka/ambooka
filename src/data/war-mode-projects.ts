import type { Project, ProjectCategory, ProjectStatus } from "@/types/portfolio";

export const portfolioMode = "professional-proof" as const;

export const statusLegend: Record<ProjectStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
  archived: "Archived"
};

export const categoryLabels: Record<ProjectCategory, string> = {
  backend: "Backend / Payments",
  frontend: "Frontend / Product UI",
  data: "Data / Reporting",
  ml: "AI / Computer Vision",
  mlops: "AI / ML Engineering",
  rag: "AI Applications",
  devops: "IT Infrastructure / DevOps",
  security: "Security",
  iot: "IoT / Industrial",
  mobile: "Mobile",
  systems: "Systems",
  enterprise: "ERP / Enterprise Tools",
  writing: "Writing"
};

export const projects: Project[] = [
  {
    slug: "ambooka-dev-portfolio-platform",
    title: "ambooka.dev Portfolio Platform",
    oneLine: "Full-stack Next.js portfolio platform with Supabase content, admin CMS, resume variants, GitHub sync and Playwright e2e tests.",
    category: "frontend" as ProjectCategory,
    displayOrder: 1,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: true,
    anchor: true,
    problem: "A static portfolio could not present real project evidence, resume variants, case studies and evolving technical positioning.",
    solution: "Built a database-backed Next.js portfolio platform with admin-managed content, structured project data, resume views, GitHub sync and tests.",
    businessValue: "Turns professional evidence into a structured proof system instead of a flat resume page.",
    stack: ["Next.js 16", "TypeScript", "React", "Supabase", "PostgreSQL", "Playwright", "Tailwind CSS"],
    coreSkills: ["Full-stack engineering", "Content systems", "Testing", "Portfolio architecture", "Supabase"],
    proof: {
  "caseStudy": "/case-studies/ambooka-dev-portfolio-platform",
  "github": "https://github.com/ambooka/ambooka",
  "liveDemo": "https://ambooka.dev"
},
    engineeringEvidence: {
  "tests": true,
  "ci": true,
  "docker": false,
  "databaseMigrations": true,
  "monitoring": false,
  "docs": true,
  "deployed": true
},
    metrics: {
  "status": "Live portfolio platform"
},
    recruiterSummary: "Built a full-stack Next.js portfolio platform with Supabase backend, admin CMS, GitHub sync, resume variants and Playwright e2e tests."
  },
  {
    slug: "hebatullah-erpnext-implementation",
    title: "Hebatullah ERPNext Implementation",
    oneLine: "ERPNext implementation for accounting, items and procurement workflows replacing manual inventory, finance and HR processes.",
    category: "enterprise" as ProjectCategory,
    displayOrder: 2,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: true,
    anchor: true,
    problem: "Manual inventory, finance and procurement workflows created slow operations, weak visibility and inconsistent records.",
    solution: "Implemented ERPNext from scratch, including chart of accounts, item catalogue and procurement workflows.",
    businessValue: "Created a structured foundation for business operations across inventory, finance, procurement and HR workflows.",
    stack: ["ERPNext", "Accounting Setup", "Inventory", "Procurement Workflows", "Business Process Design"],
    coreSkills: ["ERP implementation", "Business systems", "Requirements analysis", "Process automation"],
    proof: {
  "caseStudy": "/case-studies/hebatullah-erpnext-implementation"
},
    engineeringEvidence: {
  "tests": false,
  "ci": false,
  "docker": false,
  "databaseMigrations": false,
  "monitoring": false,
  "docs": true,
  "deployed": true
},
    metrics: {
  "staffSupported": "70+ office staff",
  "fieldWorkersSupported": "300+"
},
    recruiterSummary: "Implemented ERPNext from scratch for a trading company, replacing manual processes across inventory, finance, procurement and HR workflows."
  },
  {
    slug: "mpesa-payment-integration-library",
    title: "M-Pesa Payment Integration Library",
    oneLine: "Production TypeScript integration for Safaricom Daraja API with STK Push, B2C, C2B callbacks, queues, retries and audit logs.",
    category: "backend" as ProjectCategory,
    displayOrder: 3,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: true,
    anchor: true,
    problem: "Payment integrations need reliability, traceability and safe retry behavior because failures affect real money.",
    solution: "Built a typed Daraja API integration layer with STK Push, B2C, C2B callbacks, BullMQ jobs, retries, webhook validation and PostgreSQL transaction audit logs.",
    businessValue: "Supported a live e-commerce environment processing KES 1M+/month.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "BullMQ", "Redis", "Safaricom Daraja API"],
    coreSkills: ["Payment integrations", "Backend APIs", "Async jobs", "Reliability", "Audit logging"],
    proof: {
  "caseStudy": "/case-studies/mpesa-payment-integration-library"
},
    engineeringEvidence: {
  "tests": true,
  "ci": true,
  "docker": true,
  "databaseMigrations": true,
  "monitoring": false,
  "docs": true,
  "deployed": true
},
    metrics: {
  "monthlyVolume": "KES 1M+",
  "flows": "STK Push, B2C, C2B"
},
    recruiterSummary: "Built a production M-Pesa Daraja integration with typed APIs, async jobs, retries, webhook validation and transaction audit logs."
  },
  {
    slug: "sme-invoicing-reporting-dashboard",
    title: "SME Invoicing & Reporting Dashboard",
    oneLine: "React + FastAPI dashboard replacing Excel invoicing with PDF generation, WhatsApp notifications and live analytics.",
    category: "backend" as ProjectCategory,
    displayOrder: 4,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: true,
    anchor: true,
    problem: "Manual Excel-based invoicing consumed time, increased errors and limited visibility.",
    solution: "Built a React + FastAPI dashboard with automated PDF generation, WhatsApp notifications through Africa’s Talking API and live analytics.",
    businessValue: "Reduced manual processing effort by approximately 80%.",
    stack: ["React", "FastAPI", "PostgreSQL", "PDF Generation", "Africa’s Talking API"],
    coreSkills: ["Full-stack development", "Business automation", "Reporting", "API integration"],
    proof: {
  "caseStudy": "/case-studies/sme-invoicing-reporting-dashboard"
},
    engineeringEvidence: {
  "tests": true,
  "ci": true,
  "docker": true,
  "databaseMigrations": true,
  "monitoring": false,
  "docs": true,
  "deployed": true
},
    metrics: {
  "manualEffortReduction": "80%"
},
    recruiterSummary: "Replaced manual Excel invoicing with a custom React + FastAPI dashboard, automated PDFs, WhatsApp notifications and analytics."
  },
  {
    slug: "ai-powered-surveillance-system",
    title: "AI-Powered Surveillance System",
    oneLine: "Final-year research project implementing real-time object detection and threat recognition using YOLO, OpenCV and Flask.",
    category: "ml" as ProjectCategory,
    displayOrder: 5,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: true,
    anchor: true,
    problem: "Urban surveillance workflows often rely on manual monitoring and delayed threat recognition.",
    solution: "Built a YOLO-based real-time object detection system with Flask API, OpenCV stream processing and automated alerting.",
    businessValue: "Demonstrated functional automated threat recognition with real-time inference and alert pipeline.",
    stack: ["Python", "PyTorch", "YOLOv5/v8", "OpenCV", "Flask", "NumPy", "Linux"],
    coreSkills: ["Computer vision", "Model inference", "API development", "Research", "Real-time systems"],
    proof: {
  "caseStudy": "/case-studies/ai-powered-surveillance-system"
},
    engineeringEvidence: {
  "tests": false,
  "ci": false,
  "docker": false,
  "databaseMigrations": false,
  "monitoring": true,
  "docs": true,
  "deployed": false
},
    metrics: {
  "domain": "Computer Vision",
  "projectType": "Final-year research"
},
    recruiterSummary: "Built an end-to-end AI surveillance system with YOLO, OpenCV, Flask inference API and automated alert generation."
  },
  {
    slug: "hebatullah-cms-website-rebuild",
    title: "Hebatullah CMS Website Rebuild",
    oneLine: "Company website rebuild from static HTML into a CMS-backed system for non-developer content updates.",
    category: "frontend" as ProjectCategory,
    displayOrder: 6,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: true,
    anchor: false,
    problem: "The company website was static, making every marketing update dependent on developer involvement.",
    solution: "Rebuilt the website around a CMS workflow so the marketing team could manage content independently.",
    businessValue: "Reduced update friction and improved ownership for business content.",
    stack: ["CMS", "Web Development", "Content Management", "Hosting"],
    coreSkills: ["CMS implementation", "Business enablement", "Web development"],
    proof: {
  "caseStudy": "/case-studies/hebatullah-cms-website-rebuild",
  "liveDemo": "https://hebatullah.com"
},
    engineeringEvidence: {
  "tests": false,
  "ci": false,
  "docker": false,
  "databaseMigrations": false,
  "monitoring": false,
  "docs": true,
  "deployed": true
},
    metrics: {
  "site": "hebatullah.com"
},
    recruiterSummary: "Reworked hebatullah.com from static HTML into a CMS-backed site for non-developer content management."
  },
  {
    slug: "company-it-infrastructure-rollout",
    title: "Company IT Infrastructure Rollout",
    oneLine: "Ground-up company network and VoIP infrastructure rollout: switches, wireless access points, cabling and desk phones.",
    category: "devops" as ProjectCategory,
    displayOrder: 7,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: true,
    anchor: false,
    problem: "The company needed reliable internal connectivity and phone communication infrastructure.",
    solution: "Installed and commissioned network infrastructure and VoIP desk phone system.",
    businessValue: "Created the infrastructure foundation for office connectivity and internal communication.",
    stack: ["Switches", "Wireless Access Points", "Structured Cabling", "VoIP", "TCP/IP"],
    coreSkills: ["Networking", "Infrastructure deployment", "Troubleshooting", "IT operations"],
    proof: {
  "caseStudy": "/case-studies/company-it-infrastructure-rollout"
},
    engineeringEvidence: {
  "tests": false,
  "ci": false,
  "docker": false,
  "databaseMigrations": false,
  "monitoring": false,
  "docs": true,
  "deployed": true
},
    metrics: {
  "environment": "Company infrastructure"
},
    recruiterSummary: "Installed and commissioned switches, wireless access points, cabling and VoIP phone system for company operations."
  },
  {
    slug: "mmust-lab-network-support",
    title: "MMUST Lab & Network Support",
    oneLine: "Configured 40+ lab workstations and resolved a DHCP conflict affecting 200+ campus devices.",
    category: "enterprise" as ProjectCategory,
    displayOrder: 8,
    status: "completed" as ProjectStatus,
    completionPercent: 100,
    featured: false,
    anchor: false,
    problem: "A new computer lab needed reliable workstation setup, and a DHCP conflict was disrupting campus connectivity.",
    solution: "Configured lab machines, supported network administration and diagnosed the DHCP issue affecting campus devices.",
    businessValue: "Helped complete lab setup ahead of semester start and restored connectivity stability for affected users.",
    stack: ["Network Administration", "Linux", "Windows Server", "TCP/IP", "Hardware Configuration"],
    coreSkills: ["IT infrastructure", "Network troubleshooting", "User support", "Systems setup"],
    proof: {
  "caseStudy": "/case-studies/mmust-lab-network-support"
},
    engineeringEvidence: {
  "tests": false,
  "ci": false,
  "docker": false,
  "databaseMigrations": false,
  "monitoring": false,
  "docs": true,
  "deployed": true
},
    metrics: {
  "workstations": "40+",
  "devicesAffected": "200+"
},
    recruiterSummary: "Configured 40+ workstations and helped resolve a recurring DHCP conflict affecting 200+ campus devices."
  },

];

export const featuredProjects = projects.filter((project) => project.featured || project.anchor);

export const anchorProjects = projects.filter((project) => project.anchor);

export const projectsByCategory = (category: ProjectCategory) =>
  projects.filter((project) => project.category === category);

export const projectCategories = Array.from(new Set(projects.map((project) => project.category))) as ProjectCategory[];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const portfolioStats = {
  anchorSystems: anchorProjects.length,
  solutionArtifacts: projects.length,
  coreLanguages: 5,
  totalLanguagesTouched: 15,
  productionPatterns: 8,
  warModeWeeks: "3+ yrs"
};

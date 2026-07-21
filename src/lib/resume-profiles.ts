/** Honest, role-specific résumé variants based on completed experience. */
export type RoleVariant =
  | "software-engineer"
  | "backend-engineer"
  | "full-stack-engineer"
  | "it-systems-administrator";

export interface RoleProfile {
  id: RoleVariant;
  displayName: string;
  title: string;
  languages: string[];
  keywords: string[];
  skillCategories: string[];
  excludeCategories: string[];
  excludeSkillNames: string[];
  summaryFocus: string;
  experienceEmphasis: string[];
  professionalSummary: string;
}

const ENGINEERING_CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps & Infrastructure",
  "Tools",
];

const RESUME_BASE =
  "Computer Science graduate with 3+ years of hands-on experience building and shipping full-stack applications, REST APIs, payment integrations, and production systems. Built a TypeScript M-Pesa integration processing KES 1M+/month and brings applied ERP, Windows Server, networking, and computer-vision experience.";

export const ROLE_PROFILES: Record<RoleVariant, RoleProfile> = {
  "software-engineer": {
    id: "software-engineer",
    displayName: "Software Engineer",
    title: "Software Engineer",
    languages: ["TypeScript", "JavaScript", "Python", "Java", "Kotlin", "C#"],
    keywords: ["Software Engineering", "REST APIs", "PostgreSQL", "Docker", "CI/CD", "Payment Integrations"],
    skillCategories: ENGINEERING_CATEGORIES,
    excludeCategories: ["IT Systems"],
    excludeSkillNames: [],
    summaryFocus: "production software, APIs, integrations, and reliable delivery",
    experienceEmphasis: ["software", "api", "payment", "database", "website", "delivery"],
    professionalSummary: `${RESUME_BASE} Strongest evidence includes production payment software, a full-stack portfolio platform, and business-facing web systems.`,
  },
  "backend-engineer": {
    id: "backend-engineer",
    displayName: "Backend Engineer",
    title: "Backend Engineer",
    languages: ["TypeScript", "JavaScript", "Python", "SQL"],
    keywords: ["REST APIs", "Node.js", "FastAPI", "PostgreSQL", "Redis", "BullMQ", "Webhooks", "Payment Integrations"],
    skillCategories: ["Languages", "Backend", "Databases", "DevOps & Infrastructure", "Tools"],
    excludeCategories: ["Frontend", "IT Systems"],
    excludeSkillNames: [],
    summaryFocus: "backend APIs, payments, data integrity, and integration reliability",
    experienceEmphasis: ["api", "backend", "payment", "webhook", "database", "queue"],
    professionalSummary: `${RESUME_BASE} Strongest backend evidence includes typed Daraja API contracts, webhook validation, retry logic, BullMQ jobs, Redis, and PostgreSQL.`,
  },
  "full-stack-engineer": {
    id: "full-stack-engineer",
    displayName: "Full-Stack Engineer",
    title: "Full-Stack Engineer",
    languages: ["TypeScript", "JavaScript", "Python", "SQL"],
    keywords: ["React", "Next.js", "Node.js", "FastAPI", "REST APIs", "PostgreSQL", "Supabase"],
    skillCategories: ENGINEERING_CATEGORIES,
    excludeCategories: ["IT Systems"],
    excludeSkillNames: [],
    summaryFocus: "end-to-end web applications, APIs, databases, and deployment",
    experienceEmphasis: ["website", "frontend", "backend", "api", "database", "cms"],
    professionalSummary: `${RESUME_BASE} Has shipped frontend, backend, database, CMS, and deployment work across client, employer, and portfolio systems.`,
  },
  "it-systems-administrator": {
    id: "it-systems-administrator",
    displayName: "IT Systems Administrator",
    title: "IT Systems Administrator",
    languages: ["Python", "PowerShell", "Bash", "SQL"],
    keywords: ["Windows Server", "Active Directory", "ERPNext", "Networking", "TCP/IP", "VoIP", "CCTV", "User Support"],
    skillCategories: ["Languages", "DevOps & Infrastructure", "IT Systems", "Tools"],
    excludeCategories: ["Frontend", "AI / ML"],
    excludeSkillNames: [],
    summaryFocus: "business systems, infrastructure administration, networking, and user support",
    experienceEmphasis: ["infrastructure", "network", "server", "active directory", "erp", "support", "access"],
    professionalSummary: `${RESUME_BASE} Administers business and institutional IT environments spanning ERPNext, Windows Server, Active Directory, networks, VoIP, CCTV, biometric systems, websites, and end-user support.`,
  },
};

export function getRoleOptions(): Array<{ value: RoleVariant; label: string }> {
  return Object.values(ROLE_PROFILES).map((profile) => ({
    value: profile.id,
    label: profile.displayName,
  }));
}

export function filterSkillsByRole(
  skills: Array<{ name: string; category: string; [key: string]: unknown }>,
  role: RoleVariant,
): Array<{ name: string; category: string; [key: string]: unknown }> {
  const profile = ROLE_PROFILES[role];
  return skills.filter((skill) => {
    if (
      !profile.skillCategories.includes(skill.category) ||
      profile.excludeCategories.includes(skill.category)
    ) {
      return false;
    }
    return !profile.excludeSkillNames.some((excluded) =>
      skill.name.toLowerCase().includes(excluded.toLowerCase()),
    );
  });
}

export const LANGUAGE_ROLE_MAP: Record<string, RoleVariant[]> = {
  TypeScript: ["software-engineer", "backend-engineer", "full-stack-engineer"],
  JavaScript: ["software-engineer", "backend-engineer", "full-stack-engineer"],
  Python: Object.keys(ROLE_PROFILES) as RoleVariant[],
  SQL: Object.keys(ROLE_PROFILES) as RoleVariant[],
  Java: ["software-engineer"],
  Kotlin: ["software-engineer"],
  "C#": ["software-engineer"],
  Shell: ["it-systems-administrator"],
  Dockerfile: ["software-engineer", "backend-engineer", "full-stack-engineer"],
};

export function languageMatchesRole(
  language: string | null | undefined,
  role: RoleVariant,
): boolean {
  if (!language) return false;
  return ROLE_PROFILES[role].languages.some((item) =>
    language.toLowerCase().includes(item.toLowerCase()),
  );
}

export const PROJECT_FALLBACK_DESCRIPTIONS: Record<string, string> = {
  ambooka:
    "Next.js and Supabase portfolio platform with admin-managed content, GitHub sync, résumé variants, and Playwright tests.",
};

export function getProjectDescription(
  projectName: string,
  existingDescription?: string | null,
): string {
  if (existingDescription?.trim()) return existingDescription;
  return (
    PROJECT_FALLBACK_DESCRIPTIONS[projectName] ||
    `${projectName} — repository details and current status are available on GitHub.`
  );
}

export const PORTFOLIO_CONFIG = {
  url: "ambooka.dev",
  github: "github.com/ambooka",
  linkedin: "linkedin.com/in/abdulrahman-ambooka",
  username: "ambooka",
};

export default ROLE_PROFILES;

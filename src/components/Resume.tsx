"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Book, BriefcaseBusiness, Loader2, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AnimatedPage from "@/components/AnimatedPage";
import { getCardPattern } from "@/lib/design-patterns";
import { fadeUp, scrollRevealTransition, defaultViewport } from "@/lib/motion";

interface ResumeProps {
  isActive?: boolean;
  initialData?: ResumeData;
}

interface PersonalInfo {
  id: string;
  full_name: string;
  title: string;
  email: string;
  phone: string | null;
  location: string | null;
  summary: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  grade: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  responsibilities: string[] | null;
  achievements: string[] | null;
  technologies: string[] | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level?: number | null;
  proficiency?: number | null;
  icon_url?: string | null;
  is_featured: boolean;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

interface ResumeData {
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

const PROFESSIONAL_TITLE = "Cloud-native Software Engineer — Platform & MLOps";
const LEGACY_TITLE_PATTERN =
  /Full-Stack Developer|AI\/ML Engineering|Software Engineer & Full-Stack|AI Engineer/i;

const normalizeProfessionalTitle = (title?: string | null) => {
  const value = title?.trim();
  if (!value || LEGACY_TITLE_PATTERN.test(value)) return PROFESSIONAL_TITLE;
  return value;
};

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const SIMPLE_ICON_BASE = "https://cdn.simpleicons.org";

const devicon = (path: string) => `${DEVICON_BASE}/${path}`;
const simpleIcon = (slug: string, color: string) =>
  `${SIMPLE_ICON_BASE}/${slug}/${color}`;

const SKILL_LOGOS: Record<string, string[]> = {
  python: [devicon("python/python-original.svg")],
  typescript: [devicon("typescript/typescript-original.svg")],
  javascript: [devicon("javascript/javascript-original.svg")],
  sql: [devicon("microsoftsqlserver/microsoftsqlserver-original.svg")],
  bash: [devicon("bash/bash-original.svg")],
  go: [devicon("go/go-original-wordmark.svg")],
  java: [devicon("java/java-original.svg")],
  "c#": [devicon("csharp/csharp-original.svg")],
  "c++": [devicon("cplusplus/cplusplus-original.svg")],
  kotlin: [devicon("kotlin/kotlin-original.svg")],

  react: [devicon("react/react-original.svg")],
  "react native": [devicon("react/react-original.svg")],
  "next.js": [devicon("nextjs/nextjs-original.svg")],
  vue: [devicon("vuejs/vuejs-original.svg")],
  angular: [devicon("angularjs/angularjs-original.svg")],
  html: [devicon("html5/html5-original.svg")],
  html5: [devicon("html5/html5-original.svg")],
  css: [devicon("css3/css3-original.svg")],
  css3: [devicon("css3/css3-original.svg")],
  tailwind: [devicon("tailwindcss/tailwindcss-original.svg")],
  "tailwind css": [devicon("tailwindcss/tailwindcss-original.svg")],
  zustand: [devicon("react/react-original.svg")],

  "node.js": [devicon("nodejs/nodejs-original.svg")],
  nodejs: [devicon("nodejs/nodejs-original.svg")],
  express: [devicon("express/express-original.svg")],
  "express.js": [devicon("express/express-original.svg")],
  fastapi: [devicon("fastapi/fastapi-original.svg")],
  django: [devicon("django/django-plain.svg")],
  flask: [devicon("flask/flask-original.svg")],
  "spring boot": [devicon("spring/spring-original.svg")],
  "rest apis": [devicon("openapi/openapi-original.svg")],
  "rest api": [devicon("openapi/openapi-original.svg")],
  openapi: [devicon("openapi/openapi-original.svg")],
  "openapi / swagger": [
    devicon("openapi/openapi-original.svg"),
    simpleIcon("swagger", "85EA2D"),
  ],
  swagger: [simpleIcon("swagger", "85EA2D")],
  graphql: [devicon("graphql/graphql-plain.svg")],

  postgresql: [devicon("postgresql/postgresql-original.svg")],
  mysql: [devicon("mysql/mysql-original.svg")],
  mongodb: [devicon("mongodb/mongodb-original.svg")],
  redis: [devicon("redis/redis-original.svg")],
  supabase: [devicon("supabase/supabase-original.svg")],
  firebase: [devicon("firebase/firebase-plain.svg")],
  sqlite: [devicon("sqlite/sqlite-original.svg")],
  pgvector: [devicon("postgresql/postgresql-original.svg")],

  docker: [devicon("docker/docker-original.svg")],
  "docker compose": [devicon("docker/docker-original.svg")],
  kubernetes: [devicon("kubernetes/kubernetes-original.svg")],
  git: [devicon("git/git-original.svg")],
  github: [devicon("github/github-original.svg")],
  "github actions": [devicon("githubactions/githubactions-original.svg")],
  "git & github actions": [
    devicon("git/git-original.svg"),
    devicon("githubactions/githubactions-original.svg"),
  ],
  gitlab: [devicon("gitlab/gitlab-original.svg")],
  jenkins: [devicon("jenkins/jenkins-original.svg")],
  terraform: [devicon("terraform/terraform-original.svg")],
  ansible: [devicon("ansible/ansible-original.svg")],
  nginx: [devicon("nginx/nginx-original.svg")],
  apache: [devicon("apache/apache-original.svg")],
  aws: [devicon("amazonwebservices/amazonwebservices-original-wordmark.svg")],
  azure: [devicon("azure/azure-original.svg")],
  "google cloud": [devicon("googlecloud/googlecloud-original.svg")],
  linux: [devicon("linux/linux-original.svg")],
  "linux ubuntu": [devicon("ubuntu/ubuntu-original.svg")],
  ubuntu: [devicon("ubuntu/ubuntu-original.svg")],
  "hetzner vps": [simpleIcon("hetzner", "D50C2D")],
  grafana: [devicon("grafana/grafana-original.svg")],
  prometheus: [devicon("prometheus/prometheus-original.svg")],
  "prometheus + grafana": [
    devicon("prometheus/prometheus-original.svg"),
    devicon("grafana/grafana-original.svg"),
  ],

  "windows server": [devicon("windows11/windows11-original.svg")],
  "active directory": [devicon("azure/azure-original.svg")],
  erpnext: [simpleIcon("erpnext", "0089FF")],
  voip: [simpleIcon("cisco", "1BA0D7")],
  "tcp/ip networking": [simpleIcon("cisco", "1BA0D7")],

  tensorflow: [devicon("tensorflow/tensorflow-original.svg")],
  pytorch: [devicon("pytorch/pytorch-original.svg")],
  keras: [devicon("keras/keras-original.svg")],
  opencv: [devicon("opencv/opencv-original.svg")],
  yolo: [simpleIcon("yolo", "00FFFF")],
  "scikit-learn": [devicon("scikitlearn/scikitlearn-original.svg")],
  scikitlearn: [devicon("scikitlearn/scikitlearn-original.svg")],
  "hugging face": [simpleIcon("huggingface", "FFD21E")],
  huggingface: [simpleIcon("huggingface", "FFD21E")],
  jupyter: [devicon("jupyter/jupyter-original.svg")],
  langchain: [simpleIcon("langchain", "1C3C3C")],
  mlflow: [simpleIcon("mlflow", "0194E2")],

  figma: [devicon("figma/figma-original.svg")],
  postman: [simpleIcon("postman", "FF6C37")],
  "vs code": [devicon("vscode/vscode-original.svg")],
  vscode: [devicon("vscode/vscode-original.svg")],
  powershell: [devicon("powershell/powershell-original.svg")],
  pytest: [simpleIcon("pytest", "0A9EDC")],
  dvc: [simpleIcon("dvc", "13ADC7")],
  airflow: [simpleIcon("apacheairflow", "017CEE")],
};

const CORE_COMPETENCY_GROUPS = [
  {
    title: "Product Interfaces",
    summary: "Frontend systems for polished, responsive web products.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend APIs",
    summary: "Service layers, integrations, and documented HTTP APIs.",
    skills: ["Python", "FastAPI", "Node.js", "REST APIs"],
  },
  {
    title: "Data Platforms",
    summary: "Relational data modeling, managed backends, and caching.",
    skills: ["PostgreSQL", "SQL", "Supabase", "Redis"],
  },
  {
    title: "Deployment",
    summary: "Containerized apps, Linux servers, reverse proxies, and CI.",
    skills: ["Docker", "GitHub Actions", "Linux Ubuntu", "Nginx"],
  },
  {
    title: "Business Systems",
    summary: "Operational IT, ERP support, and production environments.",
    skills: [
      "ERPNext",
      "Windows Server",
      "Active Directory",
      "TCP/IP Networking",
    ],
  },
  {
    title: "Applied AI / CV",
    summary: "Computer vision workflows and practical ML model work.",
    skills: ["PyTorch", "OpenCV", "YOLO", "scikit-learn"],
  },
];

const normalizeSkillKey = (skillName: string) =>
  skillName.trim().toLowerCase().replace(/\s+/g, " ");

const isGenericDeviconLogo = (url?: string | null) =>
  Boolean(url?.includes("/devicon/devicon-original.svg"));

const getSkillLogos = (
  skillName: string,
  iconUrl?: string | null,
): string[] => {
  const mappedLogos = SKILL_LOGOS[normalizeSkillKey(skillName)];
  if (mappedLogos) return mappedLogos;
  if (iconUrl && !isGenericDeviconLogo(iconUrl)) return [iconUrl];
  return [];
};

const getSkillInitials = (skillName: string) =>
  skillName
    .replace(/[^a-zA-Z0-9+#. ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "SK";

export default function Resume({ isActive = false, initialData }: ResumeProps) {
  const normalizedInitialData = initialData
    ? {
        ...initialData,
        personal_info: {
          ...initialData.personal_info,
          title: normalizeProfessionalTitle(initialData.personal_info.title),
        },
      }
    : null;
  const [loading, setLoading] = useState(!normalizedInitialData);
  const [resumeData, setResumeData] = useState<ResumeData | null>(
    normalizedInitialData,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetchResumeData();
    }
  }, [initialData]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        personalInfoResult,
        educationResult,
        experienceResult,
        skillsResult,
      ] = await Promise.all([
        supabase.from("personal_info").select("*").single(),
        supabase
          .from("education")
          .select("*")
          .order("start_date", { ascending: false }),
        supabase
          .from("experience")
          .select("*")
          .order("start_date", { ascending: false }),
        supabase
          .from("skills")
          .select("*")
          .order("proficiency_level", { ascending: false }),
      ]);

      const pInfoRaw =
        personalInfoResult.data ||
        ({
          id: "mock",
          full_name: "Msah Ambooka",
          title: PROFESSIONAL_TITLE,
          email: "abdulrahmanambooka@gmail.com",
          summary:
            "Computer Science graduate with hands-on experience across full-stack software, IT infrastructure, ERP implementation, payment integrations, and platform/MLOps.",
        } as PersonalInfo);
      const pInfo = {
        ...pInfoRaw,
        title: normalizeProfessionalTitle(pInfoRaw.title),
      } as PersonalInfo;

      setResumeData({
        personal_info: pInfo,
        education: educationResult.data || [],
        experience: experienceResult.data || [],
        skills: skillsResult.data || [],
      });
    } catch (err: unknown) {
      console.error("Error fetching resume data:", err);
      setResumeData({
        personal_info: {} as PersonalInfo,
        education: [],
        experience: [],
        skills: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null, isCurrent: boolean): string => {
    if (isCurrent) return "Present";
    if (!date) return "";
    return new Date(date).getFullYear().toString();
  };

  const formatDateRange = (
    startDate: string,
    endDate: string | null,
    isCurrent: boolean,
  ): string => {
    const start = formatDate(startDate, false);
    const end = formatDate(endDate, isCurrent);
    return `${start} — ${end}`;
  };

  if (loading) {
    return (
      <article
        className={cn(
          "w-full max-w-full m-0 p-0",
          isActive ? "block" : "hidden",
        )}
        data-page="resume"
      >
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
            Resume
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2
            size={40}
            className="animate-spin text-[hsl(var(--accent))]"
          />
          <p className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px]">
            Loading resume...
          </p>
        </div>
      </article>
    );
  }

  if (error || !resumeData) {
    return (
      <article
        className={cn(
          "w-full max-w-full m-0 p-0",
          isActive ? "block" : "hidden",
        )}
        data-page="resume"
      >
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
            Resume
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
        </header>
        <div className="p-8 text-center text-[hsl(var(--muted-foreground))] flex flex-col items-center justify-center border border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--muted))]">
          <p className="mb-4">{error || "Failed to load resume data"}</p>
          <button
            onClick={fetchResumeData}
            className="px-6 py-2.5 bg-[hsl(var(--accent))] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </article>
    );
  }

  const skillsByKey = new Map(
    resumeData.skills.map((skill) => [normalizeSkillKey(skill.name), skill]),
  );
  const competencyGroups = CORE_COMPETENCY_GROUPS.filter((group) =>
    group.skills.some((skillName) =>
      skillsByKey.has(normalizeSkillKey(skillName)),
    ),
  );

  return (
    <AnimatedPage>
      <article
        className={cn(
          "w-full max-w-full m-0 p-0",
          isActive ? "block" : "hidden",
        )}
        data-page="resume"
      >
        <motion.header
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={scrollRevealTransition}
        >
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3 w-fit">
            Resume
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
        </motion.header>

        {/* Education Section */}
        {resumeData.education && resumeData.education.length > 0 && (
          <motion.section
            className="mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={scrollRevealTransition}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 flex items-center justify-center bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] rounded-xl border border-[hsl(var(--accent))/0.2] shadow-sm">
                <Book size={24} />
              </div>
              <h3 className="text-xl font-black text-[hsl(var(--foreground))] uppercase tracking-tight">
                Education
              </h3>
            </div>

            <div className="relative border-l-2 border-[hsl(var(--border))] ml-6 pb-2 space-y-10 pl-8">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[hsl(var(--accent))] border-4 border-[hsl(var(--card))] shadow-sm transition-transform duration-300 group-hover:scale-125" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h4 className="text-lg font-bold text-[hsl(var(--foreground))]">
                      {edu.institution}
                    </h4>
                    <span className="shrink-0 inline-flex items-center text-[hsl(var(--accent))] font-black text-[11px] uppercase tracking-widest bg-[hsl(var(--accent))/0.1] px-3 py-1 rounded-full border border-[hsl(var(--accent))/0.2]">
                      {formatDateRange(
                        edu.start_date,
                        edu.end_date || null,
                        edu.is_current,
                      )}
                    </span>
                  </div>

                  {(edu.degree || edu.field_of_study) && (
                    <p className="text-[15px] font-semibold text-[hsl(var(--foreground))] mb-3">
                      {edu.degree}
                      {edu.degree && edu.field_of_study ? " in " : ""}
                      {edu.field_of_study}
                    </p>
                  )}

                  {edu.grade && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-full mb-4 text-[13px] font-medium text-[hsl(var(--muted-foreground))]">
                      <span className="text-base">🎓</span>
                      {edu.grade}
                    </div>
                  )}

                  {edu.description && (
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <motion.section
            className="mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={scrollRevealTransition}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 flex items-center justify-center bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] rounded-xl border border-[hsl(var(--accent))/0.2] shadow-sm">
                <BriefcaseBusiness size={24} />
              </div>
              <h3 className="text-xl font-black text-[hsl(var(--foreground))] uppercase tracking-tight">
                Experience
              </h3>
            </div>

            <div className="relative border-l-2 border-[hsl(var(--border))] ml-6 pb-2 space-y-12 pl-8">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[hsl(var(--accent))] border-4 border-[hsl(var(--card))] shadow-sm transition-transform duration-300 group-hover:scale-125" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h4 className="text-lg font-bold text-[hsl(var(--foreground))]">
                      {exp.position}
                    </h4>
                    <span className="shrink-0 inline-flex items-center text-[hsl(var(--accent))] font-black text-[11px] uppercase tracking-widest bg-[hsl(var(--accent))/0.1] px-3 py-1 rounded-full border border-[hsl(var(--accent))/0.2]">
                      {formatDateRange(
                        exp.start_date,
                        exp.end_date || null,
                        exp.is_current,
                      )}
                    </span>
                  </div>

                  <p className="text-[15px] font-semibold text-[hsl(var(--muted-foreground))] mb-4 flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    {exp.company}
                    {exp.location && ` • ${exp.location}`}
                  </p>

                  {exp.description && (
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-5 italic border-l-2 border-[hsl(var(--muted))] pl-4 py-1">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mb-5">
                      <strong className="text-sm text-[hsl(var(--foreground))] mb-3 block">
                        Key Responsibilities:
                      </strong>
                      <ul className="list-disc ml-5 space-y-2 text-sm text-[hsl(var(--muted-foreground))] marker:text-[hsl(var(--muted-foreground))/50]">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="line-clamp-none pl-1">
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-5">
                      <strong className="text-sm text-[hsl(var(--foreground))] mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        Key Achievements:
                      </strong>
                      <ul className="list-none space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                        {exp.achievements.map((ach, idx) => (
                          <li
                            key={idx}
                            className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-[hsl(var(--accent))] before:rounded-sm"
                          >
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg text-xs font-semibold text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))/0.5]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills Section */}
        {competencyGroups.length > 0 && (
          <motion.section
            className="mt-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={scrollRevealTransition}
          >
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl font-black text-[hsl(var(--foreground))] uppercase tracking-tight">
                Technical Skills
              </h3>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-6">
                Competency Areas
              </h4>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {competencyGroups.map((group, index) => {
                  const pattern = getCardPattern(index);
                  return (
                    <div
                      key={group.title}
                      className={cn(
                        "group relative min-h-[168px] p-5 border border-[hsl(var(--border))] rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[hsl(var(--accent))/0.5] overflow-hidden",
                        pattern.bgClass,
                      )}
                    >
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      <div
                        className={cn(
                          pattern.blobClass,
                          "z-0 pointer-events-none",
                        )}
                      />

                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h5 className="text-base font-black text-[hsl(var(--foreground))] tracking-tight">
                            {group.title}
                          </h5>
                          <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                            {group.summary}
                          </p>
                        </div>

                        <div className="flex shrink-0 -space-x-2">
                          {group.skills.slice(0, 4).map((skillName) => {
                            const skill = skillsByKey.get(
                              normalizeSkillKey(skillName),
                            );
                            const skillLogo = getSkillLogos(
                              skillName,
                              skill?.icon_url,
                            )[0];

                            return (
                              <div
                                key={skillName}
                                className="grid h-9 w-9 place-items-center rounded-xl border border-[hsl(var(--border))] bg-white p-1.5 shadow-sm"
                                title={skillName}
                              >
                                {skillLogo ? (
                                  <Image
                                    src={skillLogo}
                                    alt={`${skillName} logo`}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                    loading="lazy"
                                    unoptimized
                                  />
                                ) : (
                                  <span className="text-[10px] font-black text-slate-700">
                                    {getSkillInitials(skillName)}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                        {group.skills.map((skillName) => (
                          <span
                            key={skillName}
                            className="px-2.5 py-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.72)] text-[11px] font-bold text-[hsl(var(--foreground))]"
                          >
                            {skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </article>
    </AnimatedPage>
  );
}

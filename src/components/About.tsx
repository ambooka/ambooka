"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GitHubService } from "@/services/github";
import GitHubStatsWidget from "@/components/widgets/GitHubStatsWidget";
import LatestBlogWidget from "@/components/widgets/LatestBlogWidget";
import EngineeringBentoGrid from "@/components/widgets/EngineeringBentoGrid";
import ProfileWidget from "@/components/widgets/ProfileWidget";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { Button } from "@/components/ui";
import AnimatedPage from "@/components/AnimatedPage";
import { getCardPattern } from "@/lib/design-patterns";
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  staggerChildScale,
  scrollRevealTransition,
  defaultViewport,
} from "@/lib/motion";

const GITHUB_USERNAME = "ambooka";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";
const PROFESSIONAL_TITLE = "Software Engineer, Systems & AI";
const PROFESSIONAL_SCOPE =
  "Full-stack products, payment integrations, business systems, infrastructure, and applied AI/ML.";
const PROFESSIONAL_FOCUS = "Software · Systems · Applied AI";

// --- Interfaces (from original file) ---
interface Testimonial {
  id: string;
  name: string;
  avatar_url: string | null;
  text: string;
  date: string;
  is_featured: boolean;
  display_order: number;
}

interface AboutContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string;
  icon: string | null;
  badge: string | null;
  tags?: string[];
  competencies?: string[];
  proof_of_work?: { label: string; url: string };
  display_order: number;
  is_active: boolean;
}

interface PersonalInfo {
  full_name: string;
  title: string;
  avatar_url: string | null;
  about_text: string | null;
  expertise: AboutContent[] | null;
  kpi_stats: KpiStats | null;
}

interface KpiStats {
  years_experience?: string;
  current_phase?: string;
  tagline?: string;
  headline?: string;
  role?: string;
  focus?: string;
  project_count?: number;
  expertise_breakdown?: {
    software?: number;
    cloud_infra?: number;
    data?: number;
    ml_ai?: number;
  };
}

interface Technology {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  display_order: number;
}

interface GitHubStatsData {
  totalRepos: number;
  totalStars: number;
  followers: number;
  publicRepos: number;
  topLanguages: Array<{
    name: string;
    count: number;
    color: string;
    logo?: string;
  }>;
}

interface AboutProps {
  isActive?: boolean;
  onOpenResume?: () => void;
  initialData?: {
    personalInfo?: PersonalInfo;
    skills?: Technology[];
    testimonials?: Testimonial[];
    technologies?: Technology[];
    githubStats?: GitHubStatsData;
  };
}

// --- Helper Component ---
const StatCounter = ({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration;
    const incrementTime = totalMiliseconds / end;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// --- Main Component ---
export default function About({
  isActive = false,
  onOpenResume,
  initialData,
}: AboutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const [loading, setLoading] = useState(!initialData);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialData?.testimonials || [],
  );

  const [skillCount, setSkillCount] = useState(40);
  const [projectCount, setProjectCount] = useState(25);
  const [kpiStats, setKpiStats] = useState<KpiStats>({
    years_experience:
      initialData?.personalInfo?.kpi_stats?.years_experience || "3+",
    expertise_breakdown: initialData?.personalInfo?.kpi_stats
      ?.expertise_breakdown || {
      software: 40,
      cloud_infra: 35,
      data: 10,
      ml_ai: 15,
    },
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(
    initialData?.personalInfo || null,
  );

  const focusAreas = ["Software Engineering", "Business Systems", "Applied AI/ML"];

  useEffect(() => {
    if (!initialData) {
      fetchAboutData();
    }
  }, [initialData]);

  const fetchAboutData = async () => {
    try {
      setLoading(true);

      const [personalInfoResult, skillsResult, testimonialsResult] =
        await Promise.all([
          supabase.from("personal_info").select("*").single(),
          supabase.from("skills").select("*").order("display_order"),
          supabase.from("testimonials").select("*").order("display_order"),
        ]);

      if (personalInfoResult.data) {
        const info = personalInfoResult.data as unknown as PersonalInfo;
        setPersonalInfo(info);
        if (info.kpi_stats && !Array.isArray(info.kpi_stats)) {
          setKpiStats((prev) => ({
            ...prev,
            ...(info.kpi_stats as unknown as KpiStats),
          }));
        }
      }

      if (testimonialsResult.data && testimonialsResult.data.length > 0) {
        setTestimonials(testimonialsResult.data);
      }

      try {
        const githubService = new GitHubService(GITHUB_TOKEN);
        const repos = await githubService.getRepositories(GITHUB_USERNAME, {
          maxRepos: 100,
          sortBy: "updated",
          includePrivate: Boolean(GITHUB_TOKEN),
        });

        let count = repos.length;
        if (personalInfoResult.data) {
          const info = personalInfoResult.data as unknown as PersonalInfo;
          const dbStats = info.kpi_stats as unknown as KpiStats;
          if (dbStats?.project_count && dbStats.project_count > count) {
            count = dbStats.project_count;
          }
        }
        if (count > 0) setProjectCount(count);
      } catch (e) {
        console.error("Error fetching GitHub repos:", e);
        if (personalInfoResult.data) {
          const info = personalInfoResult.data as unknown as PersonalInfo;
          const dbStats = info.kpi_stats as unknown as KpiStats;
          if (dbStats?.project_count) {
            setProjectCount(dbStats.project_count);
          }
        }
      }

      if (skillsResult.data) {
        setSkillCount(skillsResult.data.length);
      }

    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const openResumeFromCta = () => {
    if (onOpenResume) {
      onOpenResume();
      return;
    }
    window.dispatchEvent(new CustomEvent("open-resume-modal"));
  };

  if (loading) {
    return (
      <article
        className={cn(
          "flex flex-col items-center justify-center min-h-[300px] gap-3",
          isActive ? "block" : "hidden",
        )}
      >
        <Loader2 size={40} className="animate-spin text-[hsl(var(--accent))]" />
        <p className="text-[hsl(var(--muted-foreground))]">Loading...</p>
      </article>
    );
  }

  return (
    <AnimatedPage variant="dramatic">
      <article
        className={cn(
          "w-full max-w-full m-0 p-0",
          isActive ? "block" : "hidden",
        )}
        data-page="about"
      >
        <div className="grid gap-4 min-w-0">
          {/* 1. Welcome Banner */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={cn(
              "relative overflow-hidden p-6 rounded-2xl",
              "border border-[hsl(var(--border))]",
              "bg-[hsl(var(--card))/0.8] backdrop-blur-xl",
              "shadow-md",
              "lg:grid lg:grid-cols-[1fr_auto] lg:gap-5 lg:items-center max-sm:p-4 max-sm:mb-8",
            )}
          >
            {/* Decorative background glow */}
            <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[160%] rounded-full bg-[radial-gradient(circle,hsl(var(--accent)/0.08),transparent_60%)] pointer-events-none" />

            <motion.div
              variants={staggerChild}
              className="min-w-0 mb-3 sm:mb-6 lg:mb-0"
            >
              <motion.h1
                variants={staggerChild}
                className="!text-[1.75rem] sm:!text-3xl lg:!text-4xl font-extrabold mb-3 leading-tight tracking-tight text-[hsl(var(--foreground))]"
              >
                <span className="bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
                  Software Engineer
                </span>
                , Systems & AI
              </motion.h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                <p className="text-[0.8rem] md:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {kpiStats.role || PROFESSIONAL_TITLE} •
                  <span className="text-[hsl(var(--accent))] font-semibold ml-1">
                    {kpiStats.focus || PROFESSIONAL_SCOPE}
                  </span>
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))]/10 to-[hsl(var(--secondary))]/10 border border-[hsl(var(--accent))]/20 text-[9px] font-bold text-[hsl(var(--accent))] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                  {PROFESSIONAL_FOCUS}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
                {focusAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.55] px-3 py-1.5 text-[0.72rem] font-bold text-[hsl(var(--foreground))] shadow-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={staggerChild}
              className="flex flex-wrap gap-2.5 max-sm:grid max-sm:grid-cols-3"
            >
              {[
                {
                  label: "Years Exp",
                  value: `${kpiStats.years_experience || "3"}+`,
                },
                { label: "Skills", value: skillCount, counter: true },
                { label: "Projects", value: projectCount, counter: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 min-w-[80px] p-3 rounded-2xl border border-[hsl(var(--border))]",
                    "bg-[hsl(var(--card))/0.6] backdrop-blur-md",
                    "shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  )}
                >
                  <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
                    {i === 0 && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
                      </svg>
                    )}
                    {i === 1 && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    )}
                    {i === 2 && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    )}
                    <span className="text-xl md:text-2xl font-extrabold text-[hsl(var(--foreground))]">
                      {stat.counter ? (
                        <StatCounter value={stat.value as number} />
                      ) : (
                        stat.value
                      )}
                    </span>
                  </div>
                  <span className="block mt-1 text-[0.64rem] tracking-widest uppercase font-bold text-[hsl(var(--muted-foreground))]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.section>

          {/* 2. Dashboard Grid (Layout) */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 xl:gap-8"
            data-testid="dashboard-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {/* Center Column (Now Left) */}
            <motion.div
              variants={staggerChild}
              className="flex flex-col gap-4 min-w-0"
            >
              {/* Profile & Education Widget */}
              <ProfileWidget
                personalInfo={personalInfo}
                onOpenResume={onOpenResume}
              />
            </motion.div>

            {/* Right Column */}
            <motion.div
              variants={staggerChild}
              className="flex flex-col gap-4 min-w-0"
            >
              <div className="min-w-0 w-full">
                <LatestBlogWidget />
              </div>
            </motion.div>
          </motion.div>

          {/* 3. Engineering Bento Grid */}
          <motion.section
            className="min-w-0"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={scrollRevealTransition}
          >
            <EngineeringBentoGrid />
          </motion.section>

          {/* 4. Expertise Section (What I Build) */}
          <motion.section
            className={cn(
              "relative overflow-hidden p-6 lg:p-7 rounded-2xl",
              "border border-[hsl(var(--border))]",
              "bg-[hsl(var(--card))/0.8] backdrop-blur-xl",
              "shadow-md text-left",
            )}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={scrollRevealTransition}
          >
            {/* Corner glow */}
            <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[140%] rounded-full bg-[radial-gradient(circle,hsl(var(--secondary)/0.06),transparent_55%)] pointer-events-none" />

            <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] mb-1.5">
              What I Build
            </h2>
            <p className="max-w-[72ch] text-[0.88rem] leading-relaxed text-[hsl(var(--muted-foreground))] mb-5">
              Full-stack software, IT systems, business automation, ERP
              implementation and applied AI/ML work from real client, company
              and academic projects
            </p>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-3.5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {[
                {
                  phase: "Software",
                  title: "Software Engineering",
                  desc: "Python, TypeScript, Node.js REST APIs, React frontends, PostgreSQL, Docker, Nginx, and GitHub Actions used in client and portfolio systems.",
                  tags: ["Python", "TypeScript", "Docker"],
                  iconBase:
                    "text-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.1]",
                  iconSvg: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  ),
                },
                {
                  phase: "Infrastructure",
                  title: "IT Systems & Infrastructure",
                  desc: "Windows Server, Active Directory, TCP/IP networking, VoIP, CCTV, biometric systems, Linux, Docker, and VPS deployment practice.",
                  tags: ["Kubernetes", "Terraform", "AWS"],
                  iconBase:
                    "text-[hsl(var(--secondary))] bg-[hsl(var(--secondary))/0.1]",
                  iconSvg: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                    </svg>
                  ),
                },
                {
                  phase: "AI/ML",
                  title: "Machine Learning",
                  desc: "Applied computer vision research with YOLO, OpenCV, PyTorch, Flask inference APIs, real-time video processing, and model evaluation.",
                  tags: ["PyTorch", "HuggingFace", "FastAPI"],
                  iconBase: "text-[hsl(192_82%_37%)] bg-[hsl(192_82%_37%)/0.1]",
                  iconSvg: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  ),
                },
                {
                  phase: "Phase 4–5",
                  title: "AI / LLM Systems",
                  desc: "RAG pipelines, LangChain LCEL, QLoRA fine-tuning, MLOps with drift detection, and multi-agent systems via LangGraph.",
                  tags: ["LangChain", "RAG", "LangGraph"],
                  iconBase:
                    "text-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.15]",
                  iconSvg: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V9.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4Z" />
                      <path d="M8 14v.5" />
                      <path d="M16 14v.5" />
                      <path d="M12 14v8" />
                      <path d="M8 18h8" />
                    </svg>
                  ),
                },
              ].map((card, i) => {
                const pattern = getCardPattern(i);
                return (
                  <motion.div
                    key={i}
                    variants={staggerChildScale}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl p-5 border border-[hsl(var(--border))]",
                      pattern.bgClass,
                      "shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[hsl(var(--accent))/0.2]",
                    )}
                  >
                    <div
                      className={cn(
                        pattern.blobClass,
                        "z-0 pointer-events-none",
                      )}
                    />
                    {/* Edge highlight on hover */}
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[hsl(var(--accent))] to-[hsl(var(--secondary))] opacity-0 transition-opacity group-hover:opacity-100 z-10" />

                    <div
                      className={cn(
                        "relative w-11 h-11 rounded-xl flex items-center justify-center mb-3 z-10",
                        card.iconBase,
                      )}
                    >
                      {card.iconSvg}
                    </div>

                    <span className="absolute top-4 right-4 text-[0.58rem] font-bold px-2 py-1 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-md">
                      {card.phase}
                    </span>

                    <h3 className="text-base font-bold text-[hsl(var(--foreground))] mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-[0.82rem] leading-relaxed text-[hsl(var(--muted-foreground))] mb-3">
                      {card.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.64rem] font-semibold px-2 py-1 rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] transition-colors group-hover:bg-[hsl(var(--accent))/0.1] group-hover:text-[hsl(var(--accent))]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          {/* 6. Compact CTA */}
          <motion.section
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 lg:p-6 lg:flex lg:items-center lg:justify-between gap-4",
              "border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] backdrop-blur-xl shadow-md",
            )}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={scrollRevealTransition}
          >
            {/* Top border highlight */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />

            <div className="min-w-0 mb-4 lg:mb-0">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
                  "border border-[hsl(var(--accent))/0.22] bg-[hsl(var(--accent))/0.1]",
                  "text-[hsl(var(--accent))] text-[0.66rem] font-extrabold uppercase tracking-widest",
                )}
              >
                Open for opportunities
              </span>
              <h3 className="mt-2.5 mb-1.5 text-[clamp(1rem,2.2vw,1.3rem)] font-extrabold tracking-[-0.025em] text-[hsl(var(--foreground))] leading-tight">
                Let&apos;s build production-grade software and AI systems.
              </h3>
              <p className="text-[0.86rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                If you need practical engineering with strong ownership,
                I&apos;m available for selective collaborations and full-time
                roles.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-2.5 shrink-0 lg:w-auto">
              <Button
                className="w-full rounded-xl px-5 h-10 font-extrabold tracking-widest uppercase text-[0.74rem] shadow-sm bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accent))/0.9] sm:w-auto"
                onClick={openResumeFromCta}
              >
                Open Resume
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl px-5 h-10 font-extrabold tracking-widest uppercase text-[0.74rem] bg-[hsl(var(--muted))/0.5] sm:w-auto"
                asChild
              >
                <a href="/contact">Contact Me</a>
              </Button>
            </div>
          </motion.section>

          {/* 7. GitHub Activity */}
          <motion.section
            className="min-w-0"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={scrollRevealTransition}
          >
            <GitHubStatsWidget
              fullWidth
              initialStats={initialData?.githubStats}
            />
          </motion.section>
        </div>

        {/* Testimonial Modal via shadcn/ui Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md bg-[hsl(var(--card))] border-[hsl(var(--border))]">
            <DialogHeader>
              <DialogTitle className="sr-only">
                Testimonial from {selectedTestimonial?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedTestimonial && (
              <div className="flex flex-col items-center text-center mt-2">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[hsl(var(--card))] shadow-lg mb-4">
                  <Image
                    src={
                      selectedTestimonial.avatar_url ||
                      "/assets/images/avatar-placeholder.png"
                    }
                    alt={selectedTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Image
                  src="/assets/images/icon-quote.svg"
                  alt="quote icon"
                  width={32}
                  height={32}
                  className="mb-3 opacity-20"
                />
                <h4 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">
                  {selectedTestimonial.name}
                </h4>
                <DialogDescription className="text-xs font-medium mb-4">
                  {new Date(selectedTestimonial.date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </DialogDescription>
                <p className="text-[0.9rem] leading-relaxed text-[hsl(var(--muted-foreground))] italic">
                  &quot;{selectedTestimonial.text}&quot;
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </article>
    </AnimatedPage>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Target, Award, Check, Zap, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RoadmapPhase {
  id: string;
  phase_number: number;
  title: string;
  duration_months: number;
  experience_label: string | null;
  start_date_label: string | null;
  target_role: string | null;
  status: "completed" | "in_progress" | "upcoming";
  icons: string[];
}

interface Certification {
  id: string;
  name: string;
  phase_number: number;
  is_obtained: boolean;
}

// Phase colour accents
const PHASE_COLORS: Record<
  number,
  { accent: string; dim: string; text: string }
> = {
  1: { accent: "#4A5D45", dim: "rgba(74,93,69,0.12)", text: "#4A5D45" },
  2: { accent: "#8C7C58", dim: "rgba(140,124,88,0.12)", text: "#8C7C58" },
  3: { accent: "#A86B3B", dim: "rgba(168,107,59,0.12)", text: "#A86B3B" },
  4: { accent: "#6D7A4A", dim: "rgba(109,122,74,0.12)", text: "#6D7A4A" },
  5: { accent: "#7B5E3B", dim: "rgba(123,94,59,0.12)", text: "#7B5E3B" },
};

// Roadmap milestone label per phase
const PHASE_MILESTONE: Record<number, string> = {
  1: "Roadmap v1 — Toolbox",
  2: "Roadmap v2 — Platform",
  3: "Roadmap v3 — ML Layer",
  4: "Roadmap v4 — AI Platform",
  5: "Roadmap v5 — Goal",
};

// Weeks per phase
const PHASE_WEEKS: Record<number, string> = {
  1: "Wks 1–16",
  2: "Wks 17–44",
  3: "Wks 45–68",
  4: "Wks 69–92",
  5: "Wks 93–104",
};

// Static fallback phases if DB is empty
const FALLBACK_PHASES: RoadmapPhase[] = [
  {
    id: "1",
    phase_number: 1,
    title: "Foundations & Tooling",
    duration_months: 4,
    experience_label: "3 Yrs Exp",
    start_date_label: "Month 1–4",
    target_role: "Software Engineer",
    status: "in_progress",
    icons: [],
  },
  {
    id: "2",
    phase_number: 2,
    title: "Web Eng. & Cloud",
    duration_months: 7,
    experience_label: "",
    start_date_label: "Month 5–11",
    target_role: "Full-Stack Engineer",
    status: "upcoming",
    icons: [],
  },
  {
    id: "3",
    phase_number: 3,
    title: "Data Science & ML",
    duration_months: 6,
    experience_label: "",
    start_date_label: "Month 12–17",
    target_role: "ML Engineer I",
    status: "upcoming",
    icons: [],
  },
  {
    id: "4",
    phase_number: 4,
    title: "MLOps Engineering",
    duration_months: 6,
    experience_label: "",
    start_date_label: "Month 18–23",
    target_role: "MLOps Engineer",
    status: "upcoming",
    icons: [],
  },
  {
    id: "5",
    phase_number: 5,
    title: "ML Platform Design",
    duration_months: 3,
    experience_label: "",
    start_date_label: "Month 24–26",
    target_role: "Platform Engineer",
    status: "upcoming",
    icons: [],
  },
];

export default function CareerTimelineWidget() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        type DBPhase = {
          phase_number: number;
          title: string;
          duration_months: number;
          experience_label: string | null;
          start_date_label: string | null;
          target_role: string | null;
          status: "completed" | "in_progress" | "upcoming";
        };
        type DBCert = {
          id: string;
          name: string;
          phase_number: number;
          is_obtained: boolean;
        };
        type DBSkill = {
          icon_url: string | null;
          roadmap_phase: number | null;
        };

        const [phasesRes, certsRes, skillsRes] = await Promise.all([
          (
            supabase as unknown as {
              from: (t: string) => {
                select: (c: string) => {
                  order: (o: string) => Promise<{ data: DBPhase[] | null }>;
                };
              };
            }
          )
            .from("roadmap_phases")
            .select("*")
            .order("phase_number"),
          (
            supabase as unknown as {
              from: (t: string) => {
                select: (c: string) => Promise<{ data: DBCert[] | null }>;
              };
            }
          )
            .from("certifications")
            .select("*"),
          supabase
            .from("skills")
            .select("icon_url, roadmap_phase")
            .not("icon_url", "is", null)
            .order("display_order"),
        ]);

        const iconMap: Record<number, string[]> = {};
        (skillsRes.data as unknown as DBSkill[] | null)?.forEach((s) => {
          if (s.roadmap_phase && s.icon_url) {
            if (!iconMap[s.roadmap_phase]) iconMap[s.roadmap_phase] = [];
            if (!iconMap[s.roadmap_phase].includes(s.icon_url))
              iconMap[s.roadmap_phase].push(s.icon_url);
          }
        });

        const finalPhases = ((phasesRes.data ?? []) as DBPhase[]).map((p) => ({
          ...p,
          id: String(p.phase_number),
          icons: (iconMap[p.phase_number] || []).slice(0, 4),
        })) as RoadmapPhase[];

        setPhases(finalPhases.length ? finalPhases : FALLBACK_PHASES);
        setCerts((certsRes.data ?? []) as unknown as Certification[]);
      } catch {
        setPhases(FALLBACK_PHASES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCount = phases.filter((p) => p.status === "completed").length;
  const inProgressPhase = phases.find((p) => p.status === "in_progress");
  const totalWeeks = 104;
  const completedWeeks =
    completedCount === 0 && inProgressPhase ? 1 : completedCount * 20; // approximate
  const progressPct = Math.min(
    Math.round((completedWeeks / totalWeeks) * 100),
    99,
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[hsl(var(--card))/0.8] backdrop-blur-xl border border-[hsl(var(--border))] shadow-md min-h-[300px] items-center justify-center">
        <Target size={32} className="animate-spin text-[hsl(var(--accent))]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[hsl(var(--card))/0.8] backdrop-blur-xl border border-[hsl(var(--border))] shadow-md">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[0.72rem] font-[800] tracking-widest uppercase text-[hsl(var(--foreground))]">
          <Target size={14} className="text-[hsl(var(--accent))]" />
          <span>Career Roadmap</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.62rem] font-[600] whitespace-nowrap text-[hsl(var(--muted-foreground))]">
            104 weeks
          </span>
          <div className="w-[60px] h-[5px] rounded-full overflow-hidden bg-[hsl(var(--muted))]">
            <div
              className="h-full min-w-[4px] rounded-full bg-[hsl(var(--accent))] transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Phase list ─────────────────────────────────────────── */}
      <div className="flex overflow-x-auto pb-4 pt-2 gap-4 snap-x max-w-full scrollbar-thin scrollbar-thumb-[hsl(var(--border))] scrollbar-track-transparent">
        {phases.map((phase, idx) => {
          const col = PHASE_COLORS[phase.phase_number] ?? PHASE_COLORS[1];
          const isLast = idx === phases.length - 1;
          const phaseCerts = certs.filter(
            (c) => c.phase_number === phase.phase_number,
          );
          const obtainedCerts = phaseCerts.filter((c) => c.is_obtained);
          const isUpcoming = phase.status === "upcoming";

          return (
            <div
              key={phase.id}
              className="flex flex-col gap-3 shrink-0 w-[min(76vw,20rem)] snap-start relative"
            >
              {/* horizontal connector track */}
              <div className="flex items-center relative h-[22px]">
                <div
                  className="flex items-center justify-center shrink-0 w-[22px] h-[22px] rounded-full border-[1.5px] border-[hsl(var(--border))] bg-[hsl(var(--muted))] z-10 transition-all duration-300"
                  style={
                    !isUpcoming
                      ? {
                          background: col.accent,
                          boxShadow: `0 0 0 3px ${col.dim}`,
                          borderColor: "transparent",
                        }
                      : {}
                  }
                >
                  {phase.status === "completed" && (
                    <Check size={10} strokeWidth={3} className="text-white" />
                  )}
                  {phase.status === "in_progress" && (
                    <Zap size={10} className="text-white dark:text-black" />
                  )}
                  {phase.status === "upcoming" && (
                    <Lock
                      size={9}
                      className="text-[hsl(var(--muted-foreground))]"
                    />
                  )}
                </div>
                {!isLast && (
                  <div
                    className="absolute top-1/2 left-[22px] right-[-1rem] h-[2px] -translate-y-1/2 rounded-sm bg-[hsl(var(--border))] transition-colors duration-300"
                    style={
                      phase.status === "completed"
                        ? { background: col.accent }
                        : {}
                    }
                  />
                )}
              </div>

              {/* content card */}
              <div
                className={cn(
                  "flex-1 min-w-0 flex flex-col p-4 rounded-xl border border-[hsl(var(--border))] bg-white/40 dark:bg-black/20 backdrop-blur-sm transition-all duration-300 shadow-sm",
                  isUpcoming && "opacity-60",
                )}
                style={
                  phase.status === "in_progress"
                    ? { borderColor: col.accent, background: col.dim }
                    : {}
                }
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className="text-[0.65rem] font-[900] tracking-wider shrink-0 pt-0.5"
                      style={{
                        color: !isUpcoming ? col.accent : "currentColor",
                      }}
                    >
                      P{phase.phase_number}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[0.75rem] font-bold leading-tight text-[hsl(var(--foreground))]">
                        {phase.title}
                      </span>
                      {phase.target_role && (
                        <span className="text-[0.62rem] text-[hsl(var(--muted-foreground))] mt-0.5">
                          {phase.target_role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {phase.status === "in_progress" && (
                      <span
                        className="px-1.5 py-[1px] rounded-full text-[0.55rem] font-[900] tracking-wider text-white dark:text-black"
                        style={{ background: col.accent }}
                      >
                        NOW
                      </span>
                    )}
                    <span className="text-[0.58rem] font-[600] whitespace-nowrap text-[hsl(var(--muted-foreground))]">
                      {PHASE_WEEKS[phase.phase_number]}
                    </span>
                  </div>
                </div>

                {/* milestone label */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[0.65rem] shrink-0">🏗</span>
                  <span className="text-[0.63rem] font-[600] text-[hsl(var(--muted-foreground))]">
                    {PHASE_MILESTONE[phase.phase_number]}
                  </span>
                </div>

                {/* tech icons row */}
                {phase.icons.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {phase.icons.map((icon, i) => (
                      <Image
                        key={i}
                        src={icon}
                        alt=""
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain opacity-80"
                        unoptimized
                      />
                    ))}
                  </div>
                )}

                {/* obtained certs for this phase */}
                {obtainedCerts.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1.5 mt-1 border-t border-[hsl(var(--border))]">
                    <Award
                      size={10}
                      className="text-[hsl(var(--primary))] shrink-0"
                    />
                    {obtainedCerts.map((c) => (
                      <span
                        key={c.id}
                        className="px-1.5 py-[1px] rounded-full border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-[0.6rem] font-bold whitespace-nowrap"
                      >
                        {c.name.length > 28
                          ? c.name.slice(0, 26) + "…"
                          : c.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 pt-2.5 mt-1 border-t border-[hsl(var(--border))] sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[0.62rem] font-[500] text-[hsl(var(--muted-foreground))]">
          Professional Focus · Software Engineering · IT Systems ·
          Platform/MLOps
        </span>
        <a
          href="https://ambooka.dev"
          className="inline-flex min-h-10 items-center text-[0.65rem] font-bold text-[hsl(var(--accent))] no-underline transition-opacity hover:opacity-70"
        >
          ambooka.dev →
        </a>
      </div>
    </div>
  );
}

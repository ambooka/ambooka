"use client";

import { motion } from "framer-motion";
import {
  Box,
  Braces,
  CheckCircle2,
  Database,
  FileCode2,
  GitBranch,
  ServerCog,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

const DELIVERY_PRINCIPLES = [
  { title: "Ship working software", icon: CheckCircle2 },
  { title: "Design for reliability", icon: ShieldCheck },
  { title: "Document decisions", icon: Workflow },
];

const CORE_STACK = [
  { name: "TypeScript", icon: Braces },
  { name: "Python", icon: FileCode2 },
  { name: "Node.js", icon: ServerCog },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: Box },
  { name: "Supabase", icon: Zap },
  { name: "GitHub Actions", icon: GitBranch },
];

const VERIFIED_PROOF = [
  { value: "KES 1M+", label: "payments monthly" },
  { value: "300+", label: "field workers supported" },
  { value: "40+", label: "workstations deployed" },
];

const STACK_ICONS: Record<string, LucideIcon> = {
  TypeScript: Braces,
  Python: FileCode2,
  "Node.js": ServerCog,
  PostgreSQL: Database,
  Docker: Box,
  Supabase: Zap,
  "GitHub Actions": GitBranch,
};

const PREFERRED_STACK = Object.keys(STACK_ICONS);
const PREFERRED_PROOF = [
  "Payment Volume",
  "Field Workers Supported",
  "Workstations Configured",
];

interface EngineeringBentoGridProps {
  skills?: Array<{ name: string }>;
  proofStats?: Array<{ label: string; value: string }>;
}

export default function EngineeringBentoGrid({
  skills,
  proofStats,
}: EngineeringBentoGridProps) {
  const databaseStack = PREFERRED_STACK.flatMap((name) => {
    const skill = skills?.find((item) => item.name === name);
    return skill ? [{ name: skill.name, icon: STACK_ICONS[name] }] : [];
  });
  const stack = databaseStack.length ? databaseStack : CORE_STACK;

  const databaseProof = PREFERRED_PROOF.flatMap((label) => {
    const stat = proofStats?.find((item) => item.label === label);
    return stat
      ? [{ value: stat.value, label: stat.label.toLowerCase() }]
      : [];
  });
  const proof = databaseProof.length ? databaseProof : VERIFIED_PROOF;

  return (
    <section className="w-full">
      <header className="mb-3 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-8 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-transparent" />
            <h2 className="text-xl font-black tracking-tight text-[hsl(var(--foreground))] md:text-2xl">
              Engineering Snapshot
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
            How I deliver, the tools I use, and evidence from real systems.
          </p>
        </div>
      </header>

      <motion.article
        whileHover={{ y: -2 }}
        className="relative grid overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] p-4 shadow-md backdrop-blur-xl md:grid-cols-2 lg:grid-cols-[0.9fr_1.25fr_0.85fr] lg:p-5"
      >
        <div className="min-w-0 border-b border-[hsl(var(--border))] pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
          <h3 className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
            Delivery Principles
          </h3>
          <div className="flex flex-wrap gap-2">
            {DELIVERY_PRINCIPLES.map((item) => (
              <span
                key={item.title}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--muted))/0.45] px-2.5 py-2 text-xs font-bold text-[hsl(var(--foreground))]"
              >
                <item.icon size={13} className="text-[hsl(var(--accent))]" />
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 border-b border-[hsl(var(--border))] py-4 md:border-b-0 md:py-0 md:pl-4 lg:border-r lg:px-4">
          <h3 className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
            Core Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {stack.map((tool) => (
              <span
                key={tool.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-white/40 px-2.5 py-2 text-xs font-bold text-[hsl(var(--muted-foreground))] dark:bg-white/5"
              >
                <tool.icon size={13} className="text-[hsl(var(--accent))]" />
                {tool.name}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 pt-4 md:col-span-2 md:border-t md:border-[hsl(var(--border))] lg:col-span-1 lg:border-0 lg:pl-4 lg:pt-0">
          <h3 className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
            Verified Proof
          </h3>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            {proof.map((item) => (
              <div key={item.label} className="min-w-0">
                <strong className="block text-sm font-black text-[hsl(var(--foreground))]">
                  {item.value}
                </strong>
                <span className="block truncate text-[9px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[hsl(var(--accent))/0.06] blur-3xl" />
      </motion.article>
    </section>
  );
}

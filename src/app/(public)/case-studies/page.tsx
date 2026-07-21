import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import {
  categoryLabels,
  getProject,
  statusLegend,
} from "@/data/professional-projects";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Résumé-backed case studies for software engineering, payment integrations, infrastructure, ERP systems, and applied computer vision.",
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies | Abdulrahman Ambooka Msah",
    description:
      "Proof-focused case studies covering delivered software, payment integrations, business systems, infrastructure, and computer vision.",
    type: "website",
    url: "https://ambooka.dev/case-studies",
    images: [{ url: "/og-image.png", alt: "Abdulrahman Ambooka Msah case studies" }],
  },
};

const proofStats = [
  { label: "Case studies", value: caseStudies.length.toString() },
  { label: "Focus", value: "Verified delivery" },
  { label: "Proof style", value: "Outcome-led" },
];

export default function CaseStudiesPage() {
  return (
    <main className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] p-6 shadow-md sm:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.38fr)] lg:gap-8">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent))/0.22] bg-[hsl(var(--accent))/0.1] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[hsl(var(--accent))]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Project proof
          </span>
          <h1 className="mt-4 max-w-4xl text-[2.25rem] font-black leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
            Case studies that show decisions, tradeoffs, and business value.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
            Each write-up keeps the focus on the problem, architecture,
            implementation choices, quality evidence, and measurable impact.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 lg:mt-0 lg:grid-cols-1">
          {proofStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.72] p-3"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                {stat.label}
              </p>
              <p className="mt-1 text-lg font-black text-[hsl(var(--foreground))]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {caseStudies.map((study) => {
          const project = getProject(study.projectSlug);
          const evidence = project
            ? Object.entries(project.engineeringEvidence).filter(
                ([, enabled]) => enabled,
              )
            : [];

          return (
            <article
              key={study.slug}
              className="group flex min-w-0 flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent))/0.35] hover:shadow-lg sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--accent))/0.1] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[hsl(var(--accent))]">
                  <Layers3 className="h-3.5 w-3.5" />
                  {project ? categoryLabels[project.category] : "System"}
                </span>
                {project && (
                  <span className="rounded-full border border-[hsl(var(--border))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                    {statusLegend[project.status]}
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-[hsl(var(--foreground))]">
                {study.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                {study.summary}
              </p>

              {project && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.42] px-2.5 py-1 text-[0.68rem] font-semibold text-[hsl(var(--muted-foreground))]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 grid gap-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] sm:grid-cols-2">
                {evidence.slice(0, 4).map(([key]) => (
                  <span key={key} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--accent))/0.25] bg-[hsl(var(--accent))] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-[hsl(var(--accent))/0.9]"
                >
                  Read case study <ArrowUpRight size={14} />
                </Link>
                {project?.proof.github && (
                  <a
                    href={project.proof.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(var(--foreground))] shadow-sm transition-colors hover:border-[hsl(var(--accent))/0.35] hover:bg-[hsl(var(--accent))/0.08] hover:text-[hsl(var(--accent))]"
                  >
                    Source <Github size={14} />
                  </a>
                )}
                {project?.proof.liveDemo && (
                  <a
                    href={project.proof.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(var(--foreground))] shadow-sm transition-colors hover:border-[hsl(var(--accent))/0.35] hover:bg-[hsl(var(--accent))/0.08] hover:text-[hsl(var(--accent))]"
                  >
                    Live <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

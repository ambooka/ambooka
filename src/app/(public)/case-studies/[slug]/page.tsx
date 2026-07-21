import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import {
  categoryLabels,
  getProject,
  statusLegend,
} from "@/data/war-mode-projects";

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  return {
    title: study ? `${study.title} | Case Study` : "Case Study",
    description: study?.summary ?? "Technical case study.",
    alternates: study
      ? { canonical: `/case-studies/${study.slug}` }
      : undefined,
    openGraph: {
      title: study ? `${study.title} | Case Study` : "Case Study",
      description: study?.summary ?? "Technical case study.",
      type: "article",
      images: [{ url: "/og-image.png", alt: study?.title ?? "Case study" }],
    },
  };
}

const formatEvidenceLabel = (value: string) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();

  const project = getProject(study.projectSlug);
  const evidence = project
    ? Object.entries(project.engineeringEvidence).filter(
        ([, enabled]) => enabled,
      )
    : [];
  const metrics = project?.metrics
    ? Object.entries(project.metrics).filter(([, value]) => value)
    : [];

  return (
    <main className="space-y-7">
      <Link
        href="/case-studies"
        className="inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--accent))]"
      >
        <ArrowLeft size={16} />
        Back to case studies
      </Link>

      <section className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.84] p-6 shadow-md sm:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.38fr)] lg:gap-8">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent))/0.22] bg-[hsl(var(--accent))/0.1] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[hsl(var(--accent))]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Case study
            </span>
            {project && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.7] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                {statusLegend[project.status]}
              </span>
            )}
          </div>

          <h1 className="mt-4 max-w-4xl text-[2.25rem] font-black leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
            {study.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
            {study.subtitle}
          </p>

          {project && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.slice(0, 10).map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.42] px-2.5 py-1 text-[0.7rem] font-semibold text-[hsl(var(--muted-foreground))]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {project && (
          <aside className="mt-7 grid gap-3 lg:mt-0">
            <InfoCard
              label="Category"
              value={categoryLabels[project.category]}
              icon={<Layers3 size={16} />}
            />
            <InfoCard
              label="Impact"
              value={project.businessValue}
              icon={<Activity size={16} />}
            />
            <InfoCard
              label="Evidence"
              value={`${evidence.length} proof points`}
              icon={<Sparkles size={16} />}
            />
          </aside>
        )}
      </section>

      {project && (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(18rem,0.28fr)]">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--accent))]">
              Project summary
            </p>
            <p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {project.oneLine}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {project.proof.github && (
                <a
                  href={project.proof.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-[hsl(var(--accent))/0.9] focus-visible:outline-none focus-visible:ring-0"
                >
                  Source code <Github size={14} />
                </a>
              )}
              {project.proof.liveDemo && (
                <a
                  href={project.proof.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(var(--foreground))] shadow-sm transition-colors hover:border-[hsl(var(--accent))/0.35] hover:bg-[hsl(var(--accent))/0.08] hover:text-[hsl(var(--accent))]"
                >
                  Live project <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            {metrics.length > 0 ? (
              metrics.slice(0, 4).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] p-4 shadow-sm"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                    {formatEvidenceLabel(label)}
                  </p>
                  <p className="mt-2 text-lg font-black text-[hsl(var(--foreground))]">
                    {value}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] p-4 shadow-sm">
                <p className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                  Metrics are described in the results section where public
                  disclosure is safe.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <CaseBlock title="Problem" items={[study.problem]} emphasis />
        <CaseBlock title="Architecture" items={study.architecture} />
        <CaseBlock title="Key Decisions" items={study.keyDecisions} />
        <CaseBlock title="Implementation" items={study.implementation} />
        <CaseBlock title="Quality Gates" items={study.quality} />
        <CaseBlock title="Results" items={study.results} emphasis />
        <CaseBlock
          title="Future Improvements"
          items={study.futureImprovements}
        />
        {evidence.length > 0 && (
          <CaseBlock
            title="Public Evidence"
            items={evidence.map(([key]) => formatEvidenceLabel(key))}
          />
        )}
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.72] p-4">
      <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-[hsl(var(--foreground))]">
        {value}
      </p>
    </div>
  );
}

function CaseBlock({
  title,
  items,
  emphasis = false,
}: {
  title: string;
  items: string[];
  emphasis?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.82] p-6 shadow-sm">
      <h2 className="text-xl font-black tracking-tight text-[hsl(var(--foreground))]">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]"
          >
            <CheckCircle2
              className={`mt-1 h-4 w-4 shrink-0 ${emphasis ? "text-[hsl(var(--accent))]" : "text-emerald-500"}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

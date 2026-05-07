import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { getProject } from "@/data/war-mode-projects";
export const metadata: Metadata = {
  title: "Case Studies | Msah Ambooka",
  description:
    "Technical case studies for real software engineering, IT systems, business automation and applied AI/ML projects.",
};
export default function CaseStudiesPage() {
  return (
    <main className="space-y-8 text-slate-100">
      <section className="rounded-[2rem] border border-slate-800 bg-[#070A0F] p-6 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          Project proof
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
          Case studies
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          Each case study explains the problem, implementation choices, quality
          evidence, results and safe next improvements.
        </p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {caseStudies.map((study) => {
          const project = getProject(study.projectSlug);
          return (
            <article
              key={study.slug}
              className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                  {project?.category.toUpperCase() ?? "SYSTEM"}
                </span>
                <span className="text-xs text-slate-500">
                  Project #{project?.displayOrder ?? "—"}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">
                {study.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {study.summary}
              </p>
              <Link
                href={`/case-studies/${study.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300"
              >
                Read case study <ArrowUpRight size={16} />
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}

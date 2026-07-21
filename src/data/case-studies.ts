import type { CaseStudy } from "@/types/portfolio";
import { projects } from "@/data/professional-projects";

export const caseStudies: CaseStudy[] = projects
  .filter((project) => project.featured && project.status === "completed")
  .map((project) => ({
    slug: project.slug,
    projectSlug: project.slug,
    title: project.title,
    subtitle: project.recruiterSummary,
    summary: project.recruiterSummary,
    problem: project.problem,
    architecture: [
      "Problem-first presentation: the case study opens with the operational or engineering pain point, not a UI effect.",
      "Implementation details are summarized through stack, workflow, integrations, data handling and deployment context.",
      "Sensitive client/company details are sanitized while preserving real business value and technical credibility.",
      "Every project record links stack, proof, engineering evidence and measurable impact where available.",
    ],
    keyDecisions: [
      "Use real resume evidence only: client work, company work, academic research and completed portfolio platform work.",
      "Use only completed work supported by the résumé or public repository evidence.",
      "Avoid overclaiming: status, proof and metrics must reflect actual evidence.",
      "Prioritize readable business value and implementation decisions over decorative presentation.",
    ],
    implementation: [
      project.solution,
      `Stack used: ${project.stack.join(", ")}.`,
      "Documented the project with a recruiter summary, business value and engineering evidence.",
      "Prepared the project for public case-study presentation with safe disclosure boundaries.",
    ],
    quality: [
      project.engineeringEvidence.tests
        ? "Testing evidence is expected or present."
        : "Testing evidence is limited or not public for this project.",
      project.engineeringEvidence.ci
        ? "CI/CD evidence is expected or present."
        : "CI/CD is not public or not applicable for this project.",
      project.engineeringEvidence.deployed
        ? "Deployment or real operational use is part of the proof."
        : "Deployment proof is not public or not applicable.",
      "Public wording avoids private planning language and keeps the portfolio professional.",
    ],
    results: [
      project.businessValue,
      "Strengthens the portfolio through real-world experience instead of tutorial-style claims.",
      "Demonstrates practical delivery across software, payments, business systems, infrastructure, and computer vision.",
    ],
    futureImprovements: [
      "Add screenshots or diagrams where safe to publish.",
      "Add demo videos for public-facing work.",
      "Attach more measurable performance, reliability or business impact metrics when available.",
      "Keep client/company-sensitive details sanitized.",
    ],
  }));

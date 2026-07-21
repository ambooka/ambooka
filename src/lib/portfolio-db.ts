import { supabase } from "@/integrations/supabase/client";
import type {
  CaseStudy,
  EngineeringEvidence,
  Project,
  ProjectCategory,
  ProjectMetrics,
  ProjectProof,
} from "@/types/portfolio";

const asRecord = <T extends Record<string, unknown>>(value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as T)
    : ({} as T);

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.map(String) : [];

const toCategory = (category: string | null): ProjectCategory => {
  const value = (category || "").toLowerCase();
  if (value.includes("backend") || value.includes("payment")) return "backend";
  if (value.includes("erp") || value.includes("enterprise")) return "enterprise";
  if (value.includes("vision") || value === "ml") return "ml";
  if (value.includes("full") || value.includes("web") || value.includes("cms")) {
    return "frontend";
  }
  return "devops";
};

const toEngineeringEvidence = (value: unknown): EngineeringEvidence => {
  const evidence = asRecord<Partial<EngineeringEvidence>>(value);
  return {
    tests: Boolean(evidence.tests),
    ci: Boolean(evidence.ci),
    docker: Boolean(evidence.docker),
    databaseMigrations: Boolean(evidence.databaseMigrations),
    monitoring: Boolean(evidence.monitoring),
    docs: Boolean(evidence.docs),
    deployed: Boolean(evidence.deployed),
  };
};

export const fetchCompletedProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "completed")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return (data || []).map((project) => ({
    slug: project.slug,
    title: project.title,
    oneLine: project.one_line || project.description || project.title,
    category: toCategory(project.category),
    displayOrder: project.display_order || 0,
    status: "completed",
    completionPercent: project.completion_percent || 100,
    featured: project.is_featured,
    anchor: project.is_anchor,
    problem: project.problem || "",
    solution: project.solution || "",
    businessValue: project.business_value || "",
    stack: asStringArray(project.stack),
    coreSkills: asStringArray(project.core_skills),
    proof: asRecord<ProjectProof>(project.proof),
    engineeringEvidence: toEngineeringEvidence(project.engineering_evidence),
    metrics: asRecord<ProjectMetrics>(project.metrics),
    recruiterSummary:
      project.recruiter_summary || project.one_line || project.description || "",
  }));
};

export const fetchCaseStudies = async (): Promise<CaseStudy[]> => {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map((study) => ({
    slug: study.slug,
    projectSlug: study.project_slug || study.slug,
    title: study.title,
    subtitle: study.subtitle || study.title,
    summary: study.summary || study.subtitle || study.title,
    problem: study.problem || "",
    architecture: asStringArray(study.architecture),
    keyDecisions: asStringArray(study.key_decisions),
    implementation: asStringArray(study.implementation),
    quality: asStringArray(study.quality),
    results: asStringArray(study.results),
    futureImprovements: asStringArray(study.future_improvements),
  }));
};

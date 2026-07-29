import { aiResources } from "./ai";
import { cloudSecurityResources } from "./cloud-security";
import { foundationResources } from "./foundation";
import { systemsResources } from "./systems";
import type { NexusStudyPlan } from "./types";

const RESOURCE_CATALOG = {
  ...foundationResources,
  ...cloudSecurityResources,
  ...aiResources,
  ...systemsResources,
} as const;

type ResourceKey = keyof typeof RESOURCE_CATALOG;

const ENTRY_PLANS: Record<string, { focus: string; resources: ResourceKey[] }> = {
  "S01": {
    focus: "Build production Python, SQL, and algorithm foundations before polishing the first public repositories.",
    resources: [
      "cs50p_youtube",
      "cs50p",
      "python_packaging",
      "pytest",
      "postgres_tutorial",
      "algorithms",
    ],
  },
  "S02": {
    focus: "Learn the deployment path first, then keep the official operational references open while securing and automating the VPS.",
    resources: [
      "missing_semester",
      "docker_youtube",
      "docker_get_started",
      "nginx",
      "github_actions",
      "postgres_backup",
    ],
  },
  "S03": {
    focus: "Use the official FastAPI and database stack from domain model through migrations, tests, and OpenAPI documentation.",
    resources: [
      "fastapi_youtube",
      "fastapi",
      "sqlalchemy",
      "alembic",
      "pydantic",
      "openapi",
    ],
  },
  "S04": {
    focus: "Treat authentication, authorization, ledger integrity, and auditability as security design problems rather than only coding tasks.",
    resources: [
      "threat_model_youtube",
      "fastapi",
      "owasp_authn",
      "owasp_authz",
      "jwt",
      "owasp_asvs",
    ],
  },
  "S05": {
    focus: "Build the dashboard from current App Router, React, and TypeScript patterns, with accessibility and authorization visible in the UI.",
    resources: [
      "next_youtube",
      "next_learn",
      "next_docs",
      "typescript",
      "react",
      "shadcn",
    ],
  },
  "S06": {
    focus: "Learn document generation, reporting, deployment packaging, and technical communication together so the milestone is recruiter-ready.",
    resources: [
      "weasyprint",
      "postgres_explain",
      "nginx",
      "tech_writing",
      "mermaid",
      "github_profile",
    ],
  },
  "D1": {
    focus: "Use the recovery week to consolidate evidence, repair documentation, and begin certification study without adding new project scope.",
    resources: [
      "aws_skill",
      "security_plus",
      "tech_writing",
      "github_profile",
      "missing_semester",
    ],
  },
  "S07": {
    focus: "Follow a complete data-engineering path while using authoritative references for cleaning, modelling, quality, and repeatable loads.",
    resources: [
      "de_youtube",
      "de_zoomcamp",
      "pandas",
      "dimensional",
      "postgres_tutorial",
      "tech_writing",
    ],
  },
  "S08": {
    focus: "Move from scripts to observable scheduled workflows, then produce a report that proves retries, backfills, and business value.",
    resources: [
      "airflow_youtube",
      "airflow",
      "de_zoomcamp",
      "r4ds",
      "github_actions",
      "tech_writing",
    ],
  },
  "S09": {
    focus: "Study AWS architecture before provisioning, then validate every design choice against official networking, IAM, database, and Well-Architected guidance.",
    resources: [
      "aws_youtube",
      "aws_skill",
      "aws_well",
      "aws_vpc",
      "aws_iam",
      "aws_rds",
    ],
  },
  "S10": {
    focus: "Learn Terraform workflow and state first, then build reusable AWS modules with security and CI as completion requirements.",
    resources: [
      "terraform_youtube",
      "terraform",
      "terraform_aws",
      "terraform_security",
      "github_actions",
      "aws_iam",
    ],
  },
  "S11": {
    focus: "Understand Kubernetes objects visually, then implement the restricted security posture with official RBAC, network, pod, ingress, and observability references.",
    resources: [
      "k8s_youtube",
      "k8s_basics",
      "k8s_rbac",
      "k8s_network",
      "k8s_pod",
      "prometheus",
    ],
  },
  "S12": {
    focus: "Use a repeatable threat-modelling method and measurable security requirements to harden authentication, authorization, and secrets.",
    resources: [
      "threat_model_youtube",
      "owasp_threat",
      "owasp_asvs",
      "owasp_authn",
      "owasp_authz",
      "secrets_manager",
    ],
  },
  "S13": {
    focus: "Build one coherent security pipeline and use each scanner’s own documentation to configure gates, exceptions, SARIF, and SBOM outputs correctly.",
    resources: [
      "devsecops_youtube",
      "github_code_security",
      "semgrep",
      "trivy",
      "gitleaks",
      "syft",
    ],
  },
  "D2": {
    focus: "Prioritise AWS and Security+ exam preparation, then use remaining energy to close documentation and observability gaps.",
    resources: [
      "aws_exam",
      "aws_skill",
      "aws_youtube",
      "security_plus",
      "tech_writing",
    ],
  },
  "S14": {
    focus: "Start with sound ML evaluation, then serve explainable predictions through a tested API and document model limits honestly.",
    resources: [
      "ml_youtube",
      "google_ml",
      "sklearn_mooc",
      "model_cards",
      "shap",
      "fastapi",
    ],
  },
  "S15": {
    focus: "Learn experiment tracking and registry concepts before implementing promotion, aliases, rollback, lineage, and CI integration.",
    resources: [
      "mlflow_youtube",
      "mlflow",
      "mlflow_registry",
      "model_cards",
      "github_actions",
      "tech_writing",
    ],
  },
  "S16": {
    focus: "Treat drift detection as an evaluated production workflow: monitor, retrain, gate, register, and require explicit promotion.",
    resources: [
      "mlflow",
      "evidently",
      "airflow",
      "google_ml",
      "mlflow_registry",
      "tech_writing",
    ],
  },
  "S17": {
    focus: "Study modern RAG and MCP patterns, then implement ingestion, retrieval, citations, streaming, debugging, and tool exposure as one system.",
    resources: [
      "rag_youtube",
      "hf_llm",
      "langchain_rag",
      "pgvector",
      "mcp_course",
      "mcp_docs",
    ],
  },
  "S18": {
    focus: "Use a formal evaluation set and typed extraction pipeline so improvements are measured and multimodal outputs remain verifiable.",
    resources: [
      "hf_llm",
      "ragas",
      "openai_evals",
      "pydantic",
      "pymupdf",
      "model_cards",
    ],
  },
  "S19": {
    focus: "Base every guardrail and red-team case on recognised AI-risk frameworks, then make safety decisions testable and auditable.",
    resources: [
      "ai_safety_youtube",
      "owasp_llm",
      "nist_ai",
      "presidio",
      "pyrit",
      "owasp_threat",
    ],
  },
  "D3": {
    focus: "Use the deload to consolidate AI-safety evidence, finish certification preparation, and repair project packaging before systems work begins.",
    resources: [
      "aws_exam",
      "security_plus",
      "owasp_llm",
      "nist_ai",
      "tech_writing",
    ],
  },
  "S20": {
    focus: "Learn idiomatic Rust CLI design before implementing secret detection, entropy checks, Git scanning, SARIF, and integrity verification.",
    resources: [
      "rust_youtube",
      "rust_book",
      "rust_cli",
      "gitleaks",
      "sarif",
      "github_actions",
    ],
  },
  "S21": {
    focus: "Keep the enterprise Java service and low-level simulators disciplined with official framework references, strict builds, tests, and clear interfaces.",
    resources: [
      "spring_youtube",
      "spring",
      "spring_data",
      "beej_c",
      "learncpp",
      "cmake",
    ],
  },
  "S22": {
    focus: "Build three small but complete proofs using each ecosystem’s primary learning path, and keep the scope honest and demonstrable.",
    resources: [
      "kotlin_youtube",
      "android",
      "csharp",
      "dotnet_youtube",
      "laravel",
      "tech_writing",
    ],
  },
  "S23": {
    focus: "Learn LangGraph’s state and interruption model first, then implement supervisors, approval gates, MCP tools, tracing, and adversarial tests.",
    resources: [
      "langgraph_youtube",
      "langgraph",
      "langgraph_docs",
      "mcp_course",
      "langsmith",
      "pyrit",
    ],
  },
  "S24": {
    focus: "Use official exam objectives and a packaging checklist to complete security review, portfolio proof, role-specific positioning, and launch.",
    resources: [
      "aws_exam",
      "aws_skill",
      "security_plus",
      "github_profile",
      "tech_writing",
      "system_design",
      "owasp_asvs",
    ],
  },
};

const FALLBACK_PLAN: { focus: string; resources: ResourceKey[] } = {
  focus:
    "Learn the topic, implement it with authoritative references, verify the result, and package the evidence clearly.",
  resources: [
    "missing_semester",
    "tech_writing",
    "github_actions",
    "system_design",
  ],
};

export function getNexusStudyPlan(entryId: string): NexusStudyPlan {
  const plan = ENTRY_PLANS[entryId] ?? FALLBACK_PLAN;
  return {
    focus: plan.focus,
    resources: plan.resources.map((key) => {
      const [title, kind, source, url, description] = RESOURCE_CATALOG[key];
      return { title, kind, source, url, description };
    }),
  };
}

export function hasCompleteNexusResourceCoverage(entryIds: string[]): boolean {
  return entryIds.every((id) => {
    const plan = ENTRY_PLANS[id];
    if (!plan || plan.resources.length < 3) return false;
    const kinds = new Set(
      plan.resources.map((key) => RESOURCE_CATALOG[key][1]),
    );
    const hasWatch = kinds.has("Watch") || kinds.has("Course");
    const hasReading = kinds.has("Read") || kinds.has("Course");
    const hasReference = kinds.has("Reference") || kinds.has("Practice");
    return hasWatch && hasReading && hasReference;
  });
}

export type { NexusResourceKind, NexusStudyResource } from "./types";

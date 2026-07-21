export type ProjectStatus = "completed" | "archived";

export type ProjectCategory =
  | "backend"
  | "frontend"
  | "ml"
  | "devops"
  | "enterprise";

export type EngineeringEvidence = {
  tests: boolean;
  ci: boolean;
  docker: boolean;
  databaseMigrations: boolean;
  monitoring: boolean;
  docs: boolean;
  deployed: boolean;
};

export type ProjectProof = {
  github?: string;
  liveDemo?: string;
  apiDocs?: string;
  caseStudy?: string;
  video?: string;
  screenshots?: string[];
};

export type ProjectMetrics = {
  testCoverage?: string;
  latency?: string;
  modelAccuracy?: string;
  uptime?: string;
  recordsProcessed?: string;
  throughput?: string;
  [key: string]: string | undefined;
};

export type Project = {
  slug: string;
  title: string;
  oneLine: string;
  category: ProjectCategory;
  displayOrder: number;
  status: ProjectStatus;
  completionPercent: number;
  featured?: boolean;
  anchor?: boolean;
  problem: string;
  solution: string;
  businessValue: string;
  stack: string[];
  coreSkills: string[];
  proof: ProjectProof;
  engineeringEvidence: EngineeringEvidence;
  metrics?: ProjectMetrics;
  recruiterSummary: string;
};

export type CaseStudy = {
  slug: string;
  projectSlug: string;
  title: string;
  subtitle: string;
  summary: string;
  problem: string;
  architecture: string[];
  keyDecisions: string[];
  implementation: string[];
  quality: string[];
  results: string[];
  futureImprovements: string[];
};

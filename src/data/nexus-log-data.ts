// Content for the NEXUS Field Log tracker (hidden route: /nexus-log).
// This mirrors the NEXUS Engineering Logbook (War Mode v3.2). Only the
// checklist *state* (booleans + notes) lives in Supabase — the copy below
// is static so editing wording never requires a migration.

export const PHASES = [
  "Foundation",
  "Full-Stack Business Platform",
  "Data Engineering",
  "Cloud Engineering",
  "Infrastructure as Code",
  "Platform Engineering",
  "Security Engineering",
  "DevSecOps",
  "ML / MLOps",
  "RAG / LLMOps",
  "AI Safety",
  "Systems / Security",
  "Systems / Enterprise",
  "Secondary Breadth",
  "AI Agents",
  "Launch",
] as const;

export type SprintEntry = {
  id: string;
  kind: "sprint";
  num: string;
  title: string;
  phase: (typeof PHASES)[number];
  mission: string;
  days: string[];
  deliverables: string[];
  dod: string[];
};

export type DeloadEntry = {
  id: string;
  kind: "deload";
  num: string;
  title: string;
  phase: (typeof PHASES)[number];
  mission: string;
  tasks: string[];
};

export type LogEntry = SprintEntry | DeloadEntry;

export type ProgramGuideSection = {
  title: string;
  summary: string;
  bullets: string[];
};

export const PROGRAM_GUIDE_SECTIONS: ProgramGuideSection[] = [
  {
    title: "NEXUS WAR MODE",
    summary:
      "Expanded battle manual for becoming a job-market weapon with a cloud-native, security-aware, model-driven platform profile.",
    bullets: [
      "Target duration: 24 sprints over 35–39 calendar weeks under the default employed/founder track.",
      "Primary goal: be employable before the plan ends by building a flagship platform plus 8 polished anchor projects.",
      "The plan spans software engineering, cloud, platform, security, ML/MLOps, RAG/LLMOps, agents, and systems breadth.",
    ],
  },
  {
    title: "Final target profile",
    summary:
      "By Sprint 24, the profile should read like a builder and systems engineer, not a student.",
    bullets: [
      "Cloud-native software engineer specializing in intelligent systems, platform engineering, cloud infrastructure, and security architecture.",
      "Expected proof: FastAPI + Next.js business system, AWS deployment, Terraform IaC, Kubernetes security, DevSecOps pipeline, RAG assistant, ML/MLOps lifecycle, and AI safety controls.",
      "Roles to target: software engineer, backend, cloud, platform, DevSecOps, security, MLOps, intelligent application, and agentic AI roles.",
    ],
  },
  {
    title: "War-mode workload and survival rules",
    summary: "This plan is ambitious, but it is designed to be sustainable.",
    bullets: [
      "Track A default: 25–30 focused hours/week with one full protected rest day.",
      "Track B full-time: 45–55 hours/week, six days of build, one full day off.",
      "Deload weeks after Sprints 6, 13, and 19 are scheduled recovery windows, not reactive burnout responses.",
      "No all-nighters, no scope creep without a recorded cut, and every sprint ends with runnable proof and a case-study note.",
    ],
  },
  {
    title: "Nexus platform architecture",
    summary:
      "Use the flagship monorepo as the foundation and extract 8–10 polished projects around it.",
    bullets: [
      "Apps: web dashboard, Android field app, admin desktop, supplier portal.",
      "Services: core API, ML API, RAG service, agent service, workflow service, telemetry gateway.",
      "Infrastructure: AWS VPC, EC2, RDS, S3, CloudWatch, Terraform modules, Kubernetes manifests, Docker Compose, Nginx.",
      "Security: threat model, RBAC/ABAC, secrets manager, SAST/SCA/container/secret scanning, and red-team reports.",
    ],
  },
  {
    title: "Sprint phase map",
    summary:
      "The curriculum is arranged as a progression from foundation to launch.",
    bullets: [
      "Sprints 1–2: foundation and deployment proof.",
      "Sprints 3–6: full-stack business platform and first job-ready milestone.",
      "Sprints 7–8: data engineering and orchestration.",
      "Sprints 9–13: AWS, Terraform, Kubernetes, security, DevSecOps.",
      "Sprints 14–19: ML/MLOps, RAG/LLMOps, AI safety.",
      "Sprints 20–24: systems breadth, agents, portfolio polish, and launch.",
    ],
  },
  {
    title: "Recruiter-visible artifacts",
    summary:
      "The plan is designed to produce evidence that recruiters can scan quickly.",
    bullets: [
      "97 named deliverables, including one stretch deliverable, span foundations, business stack, cloud, IaC, platform, security, DevSecOps, ML/MLOps, RAG/LLMOps, AI safety, systems, and agents.",
      "The 8 anchor projects are the ones to polish hardest: business platform, data platform, cloud platform, security platform, MLOps platform, RAG/LLMOps platform, AI safety layer, and systems/security tools.",
      "Every artifact needs a README, screenshots or demo proof, a short problem/solution statement, and a clear resume bullet.",
    ],
  },
  {
    title: "Anchor project specs",
    summary:
      "Each anchor project should be complete enough to support interviews and portfolio discussion.",
    bullets: [
      "A1: Nexus Business Platform — FastAPI + PostgreSQL + Next.js business system with approvals, ledger, audit logs, reports, and PDFs.",
      "A2: Nexus Data Platform — ETL, Airflow, warehouse, and executive reporting.",
      "A3: Nexus Cloud Platform — live AWS deployment and Terraform IaC for VPC, RDS, S3, ALB, monitoring, and secrets.",
      "A4: Nexus Security Platform — threat model, OWASP review, DevSecOps pipeline, SBOM, and security telemetry.",
      "A5: Nexus ML/MLOps Platform — inference API, registry, drift detection, retraining, and explainability.",
      "A6: Nexus RAG/LLMOps Platform — document ingestion, embeddings, semantic search, citations, evals, and MCP tools.",
      "A7: Nexus AI Safety Layer — prompt-injection detection, PII handling, grounding checks, and red-team harness.",
      "A8: Nexus Systems Suite — Rust security tooling, Java workflow/ledger service, C/C++ industrial simulations, and optional telemetry gateway stretch.",
    ],
  },
  {
    title: "Skill mastery rubrics",
    summary:
      "The plan is designed to build visible competence rather than passive study.",
    bullets: [
      "Python backend: package structure, typed services, pytest, FastAPI, SQLAlchemy, Pydantic, Docker, CI, deployment.",
      "SQL/PostgreSQL: schemas, transactions, indexes, analytics queries, warehouse, explain plans.",
      "TypeScript frontend: typed apps, forms, tables, auth, role-based UI, dashboard UX.",
      "Cloud/platform/security: AWS, Terraform, Kubernetes, RBAC/NetworkPolicies/PSS, threat models, DevSecOps, secrets management.",
    ],
  },
  {
    title: "Non-negotiable engineering standards",
    summary:
      "Every artifact should look like something a hiring manager can trust.",
    bullets: [
      "Every repo needs a README, architecture note, setup steps, env example, screenshots or demo proof, security notes, and next steps.",
      "Use linting, typed code where possible, tests, deployment health checks, and structured logs.",
      "Treat cloud and security as first-class engineering responsibilities, not afterthoughts.",
    ],
  },
  {
    title: "Study blocks and interview prep",
    summary: "Learning time should feed directly into shipping work.",
    bullets: [
      "Theory block: official docs plus implementation notes mapped to today's feature.",
      "Build block: implement end-to-end without over-polishing.",
      "Hardening block: tests, errors, logging, edge cases, security scans.",
      "Packaging block: README, screenshots, architecture note, demo clip, and resume bullet.",
      "Interview block: DSA, SQL, system design, cloud architecture, security scenarios, and a weekly 5-minute verbal walkthrough.",
    ],
  },
  {
    title: "Job-market attack strategy",
    summary:
      "Use the plan to calibrate, then attack the market with the differentiated material.",
    bullets: [
      "Sprint 6 wave: light applications for backend, automation, business systems, and full-stack roles.",
      "Sprint 10+ wave: backend, DevOps, cloud, and data engineering roles.",
      "Sprint 13+ wave: security engineering, DevSecOps, and platform roles.",
      "Sprint 16+ wave: ML/MLOps and AI application roles; Sprint 19+ wave: RAG/LLMOps and AI safety; Sprint 23+ wave: agentic AI roles.",
    ],
  },
  {
    title: "Resume and portfolio",
    summary:
      "The resume should tell a coherent story of a builder moving from IT admin into cloud and security engineering.",
    bullets: [
      "Move the Projects section above Work Experience once you have 2–3 strong anchor projects.",
      "Lead each project bullet with what you built, what it was for, and a quantified outcome or scope.",
      "Use the certifications and project keywords strategically: AWS SAA-C03, Security+, cloud, platform, DevSecOps, AI safety, MCP, Terraform, Kubernetes.",
    ],
  },
  {
    title: "Scope control",
    summary: "The plan is broad, but scope discipline is what keeps it real.",
    bullets: [
      "Polish the 8 anchors hard; keep secondary proofs smaller and honest.",
      "If a sprint slips by more than 30%, cut scope rather than adding hours.",
      "Use the secondary-language proofs as breadth, not as a sign that the core platform is incomplete.",
    ],
  },
  {
    title: "Failure modes and recovery",
    summary: "When something breaks, recover without losing the sprint.",
    bullets: [
      "A tool breaks for two days: replace it with a simpler stack and keep the weekly proof alive.",
      "ML metrics are weak: document baseline, limitations, and improvement plan rather than fabricating results.",
      "RAG hallucinates: add refusal behavior, citations, eval failures, and safety notes.",
      "AWS costs spike: set budgets first, terminate unused resources, and keep cost discipline from the first week.",
    ],
  },
  {
    title: "Launch checklist",
    summary:
      "The closing week is for packaging, security review, and aggressive outreach.",
    bullets: [
      "Portfolio has a clear engineering progression narrative and links to the 8 anchor projects.",
      "Resume has role-specific variants for software, cloud, platform, DevSecOps, and security targets.",
      "Security checks are complete: no critical findings unaddressed, Kubernetes baseline posture verified, Terraform state clean.",
      "Launch with LinkedIn updates, outreach, and 15–25 targeted applications.",
    ],
  },
  {
    title: "Certification roadmap",
    summary:
      "Certifications are filters and supporting signals, not substitutes for shipping projects.",
    bullets: [
      "Register for Security+ and AWS SAA-C03 by Sprint 13 and sit them by Sprint 20.",
      "Use the certifications to reinforce the cloud and security pillars already being built in the plan.",
      "Keep project proof primary and let certs make the portfolio easier to discover.",
    ],
  },
  {
    title: "Sustain mode",
    summary: "The plan does not end when the sprint tracker ends.",
    bullets: [
      "Keep CI pipelines green, continue shipping one small feature every month, and review security findings regularly.",
      "Tear down cloud resources you are no longer demoing so the live asset remains useful rather than expensive.",
      "Treat the portfolio as a living system that keeps proving competence after the initial plan ends.",
    ],
  },
];

const RAW: Omit<SprintEntry, "id" | "kind">[] = [
  {
    num: "01",
    title: "Python Engineering Core + SQL/DSA Shock Start",
    phase: "Foundation",
    mission:
      "Turn Python into a production tool. Typed, tested, packaged CLI tools, plus CS fundamentals proven with benchmarks and SQL analysis.",
    days: [
      "Production Python template: pyproject, ruff, mypy, pytest, CI skeleton",
      "CLI toolkit: file search, JSON/CSV converter, hash checker, bulk rename, log cleaner",
      "HashMap, Heap, Graph, BFS, DFS, Dijkstra + benchmarks vs built-ins",
      "PostgreSQL analytics lab: schema, seed data, 15 queries, 5 indexes, EXPLAIN before/after",
      "Test everything, add coverage gates, fix typing errors, write usage examples",
      "Polish READMEs/diagrams, tag v0.1.0, capstone case study",
    ],
    deliverables: [
      "nexus-python-toolkit",
      "algorithm-benchmark-suite",
      "sql-analytics-lab",
      "repo-template-python-production",
    ],
    dod: [
      "Every package installs with pip install -e .",
      "Zero mypy errors in strict mode on core modules",
      "80%+ test coverage on template + toolkit",
      "SQL report has 5+ EXPLAIN ANALYZE outputs",
      "One public repo with clean README",
    ],
  },
  {
    num: "02",
    title: "Linux, Docker, VPS, CI/CD, Public HTTPS",
    phase: "Foundation",
    mission:
      "Ship something real: server setup, containers, reverse proxy, HTTPS, CI/CD, backups, health checks.",
    days: [
      "Provision VPS, deploy user, SSH lockdown, UFW, fail2ban (script it if familiar)",
      "Containerise Python toolkit; Compose stack with app + PostgreSQL",
      "Nginx reverse proxy + HTTPS; deploy static Nexus landing page",
      "Backup/restore manager; test restore into a fresh database",
      "GitHub Actions: lint -> test -> build image -> push -> deploy",
      "Network diagnostics tool + deployment case study + demo video capstone",
    ],
    deliverables: [
      "vps-bootstrap-script",
      "docker-compose-production-stack",
      "database-backup-manager",
      "network-diagnostics-toolkit",
      "Nexus v0.1 landing page",
    ],
    dod: [
      "Public domain loads over HTTPS",
      "docker compose ps shows healthy services",
      "GitHub Actions deploys to VPS on merge",
      "Backup restores into a fresh database",
      "README has exact setup + troubleshooting",
    ],
  },
  {
    num: "03",
    title: "Industrial Requisition API v1",
    phase: "Full-Stack Business Platform",
    mission:
      "Serious backend around a real business problem: inventory requisition, stock visibility, approvals, auditability.",
    days: [
      "Domain model + ERD; database schema; Alembic migrations",
      "CRUD for users, branches, warehouses, items, departments",
      "Requisition creation + requisition items",
      "Validation, pagination, filtering, search, structured errors",
      "Tests for models, services, repositories, routes",
      "Dockerise API + DB, connect to CI + API/ERD docs capstone",
    ],
    deliverables: ["industrial-requisition-api"],
    dod: [
      "OpenAPI docs expose all endpoints",
      "Migrations run from zero to ready schema",
      "Seed script creates realistic demo data",
      "Integration tests cover happy + negative-permission paths",
      "Compose starts API + DB locally",
    ],
  },
  {
    num: "04",
    title: "Auth, RBAC, Branch Permissions, Stock Ledger",
    phase: "Full-Stack Business Platform",
    mission:
      "Make the backend production-like: auth, authorization, branch-scoped data, immutable stock movement, audit trails.",
    days: [
      "Register, login, refresh, logout, password hashing",
      "RBAC tables, policies, route guards, branch scoping",
      "Stock ledger: stock_in, stock_out, transfer, adjustment",
      "Requisition approval state machine + audit trail",
      "Idempotency keys + webhook event log",
      "Permission/ledger tests + production-readiness review + initial threat model capstone",
    ],
    deliverables: [
      "JWT auth service",
      "branch permission engine",
      "stock ledger engine",
      "webhook/idempotency processor",
    ],
    dod: [
      "Unauthorised access returns correct status codes",
      "Branch users can't touch other branch data",
      "Ledger rows immutable except compensating entries",
      "Duplicate idempotency key doesn't double-post",
      "Audit log records actor/action/before-after",
    ],
  },
  {
    num: "05",
    title: "TypeScript Operations Dashboard",
    phase: "Full-Stack Business Platform",
    mission:
      "Build the user-facing proof: a clean dashboard connected to a real backend.",
    days: [
      "Scaffold Next.js, TypeScript, linting, Tailwind, shadcn/ui",
      "Typed API client + auth store/session handling",
      "Dashboard shell, sidebar, layout, protected routes",
      "Item/warehouse/branch/user pages with tables + forms",
      "Requisition create flow + approval queue",
      "Error boundaries, loading states, mobile layout + demo recording capstone",
    ],
    deliverables: [
      "operations-dashboard",
      "typed-api-client",
      "approval-queue-ui",
    ],
    dod: [
      "Frontend authenticates against real backend",
      "All forms validate client- and server-side",
      "Role-based UI hides unauthorised actions",
      "Works on mobile and desktop width",
      "Demo flow works end-to-end, no manual DB edits",
    ],
  },
  {
    num: "06",
    title: "Documents, Reports, Deployment, First Job-Ready Milestone",
    phase: "Full-Stack Business Platform",
    mission:
      "Turn the platform into a business system: PDFs, reports, deployment, case study, first application wave.",
    days: [
      "Design PO, delivery note, issue voucher, statement templates",
      "Implement PDF generation from real API data",
      "Invoice aging + stock reports",
      "Deploy full stack behind Nginx with HTTPS",
      "Polish seed data, screenshots, demo users, landing links",
      "Case study + resume bullets + application-wave prep capstone",
    ],
    deliverables: [
      "purchase-order-generator",
      "delivery-note-generator",
      "invoice-aging-report",
      "customer-statement-generator",
      "full-stack deployment",
    ],
    dod: [
      "Public demo has recruiter/demo login",
      "PDFs render cleanly on A4",
      "Reports generated from SQL, not hardcoded",
      "Case study covers problem/architecture/trade-offs",
      "README has setup, demo, stack, tests",
    ],
  },
  {
    num: "07",
    title: "Data Engineering Core",
    phase: "Data Engineering",
    mission:
      "Become useful to businesses drowning in spreadsheets: ingestion, validation, normalisation, warehouse foundations.",
    days: [
      "Collect/create messy demo CSV/Excel files",
      "Validation schema + bad-record quarantine",
      "Transformations into normalised tables",
      "Warehouse facts/dimensions + materialised views",
      "Quality report + load summary",
      "Integrate reports into dashboard + case study capstone",
    ],
    deliverables: [
      "csv-excel-cleaner",
      "business-etl-pipeline",
      "data-quality-reporter",
      "analytics-warehouse",
    ],
    dod: [
      "Pipeline reruns without duplicate loads",
      "Bad records stored with error reasons",
      "Warehouse answers 10 business questions",
      "Quality report outputs HTML/PDF",
      "Dashboard uses warehouse data",
    ],
  },
  {
    num: "08",
    title: "Airflow, Scheduling, Reports",
    phase: "Data Engineering",
    mission:
      "Move from scripts to orchestrated workflows: scheduled DAGs, retries, logs, backfills, automated reports.",
    days: [
      "Run Airflow locally in Docker Compose",
      "Convert ETL into DAG tasks",
      "Retries, alert hooks, backfill command, logs",
      "Scheduled business report from warehouse",
      "R executive report with charts",
      "Deploy Airflow service + dashboard screenshots capstone",
    ],
    deliverables: [
      "Airflow business pipeline",
      "scheduled report generator",
      "R executive report",
    ],
    dod: [
      "DAG runs from UI and CLI",
      "Failed-task retry demonstrated",
      "Report generated from real warehouse data",
      "Backfill works for a past date range",
      "README has Airflow setup + troubleshooting",
    ],
  },
  {
    num: "09",
    title: "Cloud Engineering – AWS Core + Nexus Production Deployment",
    phase: "Cloud Engineering",
    mission:
      "Deploy Nexus on real cloud infrastructure: IAM, VPC, EC2, S3, RDS, CloudWatch, security services on day one.",
    days: [
      "AWS Budget + MFA + billing alarm; CloudTrail, GuardDuty, Security Hub, Flow Logs on",
      "VPC: public/private subnets, IGW, NAT, route tables, NACLs",
      "EC2 (bastion + app), security groups minimal open ports",
      "RDS PostgreSQL in private subnet; migrate Nexus DB",
      "Deploy Nexus API on EC2, ALB/Nginx HTTPS termination",
      "S3 backups + CloudWatch alarms + cloud architecture case study capstone",
    ],
    deliverables: [
      "aws-vpc-architecture",
      "nexus-aws-deployment",
      "iam-policy-library",
      "s3-backup-integration",
      "cloudwatch-monitoring-stack",
    ],
    dod: [
      "Nexus API reachable over HTTPS on AWS",
      "DB on RDS in private subnet",
      "Budget alerts + CloudTrail/GuardDuty/SecurityHub/FlowLogs active",
      "IAM least-privilege, documented",
      "S3 backup restores into fresh RDS",
      "CloudWatch dashboard with 3+ alarms",
      "VPC diagram published",
    ],
  },
  {
    num: "10",
    title: "Infrastructure as Code – Terraform + Nexus IaC Repository",
    phase: "Infrastructure as Code",
    mission:
      "Never click-ops again: define the entire AWS infrastructure as code, reproducible and version-controlled.",
    days: [
      "Terraform layout, provider config, versioned S3 remote backend + locking supported by the installed Terraform/backend version",
      "VPC module: subnets, IGW, NAT, route tables, NACLs, outputs",
      "Security groups + EC2 compute module",
      "RDS module with Secrets Manager password rotation",
      "S3 module (backups) + CloudWatch module (alarms/dashboard)",
      "GitHub Actions IaC CI + docs + security ADR capstone",
    ],
    deliverables: [
      "nexus-terraform-infrastructure",
      "terraform-state-backend",
      "infrastructure-ci-pipeline",
    ],
    dod: [
      "Fresh apply is timed by stage; <15 min is the target, and any environment-specific target change is measured and explicitly approved",
      "Remote state, no state in git",
      "All secrets from Secrets Manager/env, never in code",
      "CI runs plan on every PR",
      "Modules fully documented",
      "Security ADR on execution role scope",
    ],
  },
  {
    num: "11",
    title:
      "Platform Engineering – Kubernetes Security + Security Observability",
    phase: "Platform Engineering",
    mission:
      "Deploy Nexus on Kubernetes with production security posture: RBAC, NetworkPolicies, Pod Security, sealed secrets, secure ingress.",
    days: [
      "RBAC manifests per service: ServiceAccount, Role, RoleBinding",
      "NetworkPolicies (deny-all default) + Pod Security Standards",
      "sealed-secrets/ESO; remove plain K8s Secrets",
      "Secure Ingress: TLS termination, routing, rate-limiting",
      "Extend CloudWatch dashboard with security telemetry panel",
      "Platform engineering case study capstone (protected rest day for stretch goals)",
    ],
    deliverables: [
      "k8s-security-manifests",
      "secure-ingress-tls",
      "security-telemetry-extension",
      "STRETCH: Go telemetry gateway + Prometheus/Grafana/Loki",
    ],
    dod: [
      "Every service has scoped ServiceAccount",
      "NetworkPolicies whitelist-only",
      "No plaintext sensitive values in committed K8s Secret manifests; runtime Secret delivery, RBAC, and etcd/control-plane exposure are controlled",
      "Ingress terminates TLS + rate-limits",
      "Security telemetry panel live",
    ],
  },
  {
    num: "12",
    title: "Security Engineering – Threat Modelling + Application Security",
    phase: "Security Engineering",
    mission:
      "Think like a security engineer: STRIDE threat model, OWASP-aligned controls, hardened auth/authorization.",
    days: [
      "DFDs for all services: flows, trust boundaries, stores",
      "Apply STRIDE per component, assign risk ratings",
      "OWASP Top 10 checklist against API + frontend",
      "Harden JWT: short expiry, refresh rotation, blacklist, secure cookies",
      "ABAC policy for branch isolation + unit tests",
      "Migrate secrets to Secrets Manager + security architecture review + ADRs capstone",
    ],
    deliverables: [
      "nexus-threat-model",
      "security-architecture-review",
      "auth-authz-library",
      "secrets-management-integration",
      "secure-sdlc-checklist",
    ],
    dod: [
      "STRIDE model published in /docs/security/",
      "OWASP Top 10 findings addressed/tracked",
      "JWT rotation covered by security tests",
      "ABAC tests cover cross-branch edge cases",
      "Zero secrets in code or committed env files",
      "Security ADR on auth/authz/secrets",
    ],
  },
  {
    num: "13",
    title: "DevSecOps – CI/CD Security Gates + Automated Scanning",
    phase: "DevSecOps",
    mission:
      "Build security into the pipeline: every merge passes automated SAST/SCA/container/secret gates.",
    days: [
      "Semgrep SAST + Bandit + ESLint security plugin",
      "pip-audit + npm audit SCA gate, fail-on-critical policy",
      "Trivy image scan + severity threshold + waiver YAML",
      "gitleaks pre-commit hook + CI gate, test with seeded credential",
      "Unified security stage; SARIF to GitHub Security tab",
      "SBOM via Syft as release artifact + scan dashboard capstone",
    ],
    deliverables: [
      "nexus-devsecops-pipeline",
      "security-scan-dashboard",
      "SBOM-generator",
      "pre-commit-security-hooks",
    ],
    dod: [
      "SAST/SCA/container/secret scans run on every PR",
      "Critical findings block merge automatically",
      "Secret scan catches seeded credential pre-commit + CI",
      "SBOM published per release tag",
      "Dashboard shows dated scan history; a 4-week trend claim requires four real weekly snapshots",
      "SARIF visible in GitHub Security tab",
    ],
  },
  {
    num: "14",
    title: "Classical ML for Business Problems + ML Inference API",
    phase: "ML / MLOps",
    mission:
      "Build models that solve real business problems, then serve them as production inference endpoints with logging and explainability.",
    days: [
      "Problem statements + target variables; SQL feature extraction",
      "Train baseline + improved models; document model cards",
      "Package training scripts; FastAPI inference service",
      "/predict endpoints + prediction logging",
      "SHAP explanation endpoint + Prometheus metrics",
      "Deploy ML API, connect frontend + case study capstone",
    ],
    deliverables: [
      "stock-out-prediction-model",
      "supplier-delay-predictor",
      "sales-forecasting-baseline",
      "FastAPI inference service",
      "SHAP explanation API",
      "model monitoring dashboard",
    ],
    dod: [
      "Documented baseline vs improved comparison per model",
      "Feature leakage checks documented",
      "ML API deployed and callable from dashboard",
      "Every prediction logged (version, latency, input hash)",
      "Explanation endpoint returns feature contributions",
      "Tests cover invalid input, load failure, happy path",
    ],
  },
  {
    num: "15",
    title: "MLOps Registry + Experiment Tracking",
    phase: "ML / MLOps",
    mission:
      "Build the lifecycle layer: experiments, model versions, promotion, rollback, lineage, production aliases.",
    days: [
      "Registry schema + API; experiment tracking table",
      "Model version registration + artifact metadata",
      "Promote/rollback flow + production alias lookup",
      "Connect ML API to registry for active-model lookup",
      "Dashboard pages: experiment browser + model version list",
      "CLI for registration/promotion from CI + case study/ADR capstone",
    ],
    deliverables: [
      "lightweight-model-registry",
      "experiment-tracking-service",
      "model-promotion-workflow",
    ],
    dod: [
      "Models registered with reproducible artifact refs",
      "Production model switchable without redeploy",
      "Rollback restores previous version correctly",
      "Inference reads active version from registry at startup",
      "Case study: custom registry vs MLflow trade-offs",
    ],
  },
  {
    num: "16",
    title: "Drift Detection + Retraining Pipeline",
    phase: "ML / MLOps",
    mission:
      "Close the ML loop: detect drift, trigger retraining, evaluate candidates, gate promotion.",
    days: [
      "Reference/current windows; drift metric calculations",
      "Drift dashboard + alert thresholds",
      "Airflow retraining DAG: extract -> train -> evaluate",
      "Evaluation gate: block promotion below threshold",
      "Register candidate model + manual promote flow",
      "Simulate drift end-to-end + model-decay report capstone",
    ],
    deliverables: [
      "drift-detection-service",
      "retraining-pipeline",
      "evaluation-gate",
    ],
    dod: [
      "Drift report runs on schedule with dashboard panel",
      "Retraining DAG produces registered candidate",
      "Gate can intentionally pass and fail",
      "Candidate visible with metrics pre-promotion",
      "Manual approval required before production alias updates",
    ],
  },
  {
    num: "17",
    title: "Document Ingestion + RAG Chatbot with Citations",
    phase: "RAG / LLMOps",
    mission:
      "Ingest documents, generate embeddings, answer questions with grounded citations, streaming UX, MCP tool-server.",
    days: [
      "Ingestion CLI (PDF/Markdown/text) + chunker comparison",
      "pgvector tables, embedding service (cached/batched), search endpoint",
      "Retrieve -> prompt -> grounded answer chain with citations",
      "Chat history persistence + graceful low-context fallback",
      "Streaming backend (SSE/WS) + streaming Next.js UI",
      "Retrieval-debug dashboard + minimal MCP server capstone",
    ],
    deliverables: [
      "document-ingestion-pipeline",
      "embedding-service",
      "pgvector-semantic-search",
      "RAG chatbot with citations",
      "streaming chat UI",
      "retrieval-debug dashboard",
      "mcp-tool-server",
    ],
    dod: [
      "Ingestion idempotent, stable chunk IDs",
      "Embeddings cached/batched",
      "Semantic search returns ranked, scored, linked chunks",
      "Answers cite sources, flag uncertainty",
      "Streaming renders token-by-token",
      "Debug view shows chunks/scores/prompt",
      "30+ test questions documented",
      "MCP server exposes at least one narrow authorized tool to a generic client",
    ],
  },
  {
    num: "18",
    title: "RAG Evaluation + Structured Extraction + Multimodal",
    phase: "RAG / LLMOps",
    mission:
      "Stop treating RAG quality as vibes: evaluation harness, then structured extraction and multimodal PDF pages.",
    days: [
      "50-question golden set + retrieval evaluation script",
      "Answer rubric + LLM-as-judge scorer + prompt A/B runner",
      "Evaluation dashboard report; improve chunking/prompt",
      "Pydantic schemas for invoices, delivery notes, POs",
      "Text extraction pipeline + validation + correction endpoint",
      "PDF image rendering + multimodal extraction + demo capstone",
    ],
    deliverables: [
      "RAG evaluation suite",
      "prompt A/B testing tool",
      "hallucination test set",
      "invoice-extraction-api",
      "delivery-note-extraction-api",
      "multimodal-document-analyzer",
    ],
    dod: [
      "Eval compares 2+ prompt versions with rationale",
      "Retrieval + answer metrics reported separately",
      "Failures categorised by type",
      "Extraction returns validated typed JSON",
      "Correction endpoint updates records + flags for review",
      "UI shows source alongside extracted fields",
    ],
  },
  {
    num: "19",
    title: "AI Guardrails + Prompt Injection + PII Safety",
    phase: "AI Safety",
    mission:
      "Add security/safety controls: prompt injection defence, PII protection, grounding verification, formal red-team report.",
    days: [
      "OWASP LLM Top 10 study; Nexus AI threat model",
      "Prompt injection detector (patterns, embeddings, keywords)",
      "PII detector (regex + optional NER) + redaction policy",
      "Grounding verification: cross-reference claims vs chunks",
      "Safety gateway middleware; log all safety decisions",
      "30+ case red-team session + formal report capstone",
    ],
    deliverables: [
      "prompt-injection-detector",
      "PII-leakage-checker",
      "grounding-verification-layer",
      "AI-safety-gateway",
    ],
    dod: [
      "Injection patterns flagged/blocked in test harness",
      "PII detected and redacted pre-storage/display",
      "Weakly-grounded answers rejected or flagged",
      "Every safety decision audit-logged with reason code",
      "Formal red-team report with 30+ cases",
    ],
  },
  {
    num: "20",
    title: "Rust Security Tools",
    phase: "Systems / Security",
    mission:
      "Sharp systems/security credibility: practical Rust CLIs — a secret scanner and an artifact integrity verifier.",
    days: [
      "Rust CLI skeleton with clap; scan command + config parsing",
      "Regex rule set + recursive file walker + ignore lists",
      "Shannon entropy detection for candidate secrets",
      "Git history scan + .secscanignore config",
      "SARIF/JSON output + GitHub Actions integration",
      "Artifact integrity verifier + tooling case study capstone",
    ],
    deliverables: [
      "secscan (Rust secret scanner)",
      "integrity-agent (artifact integrity verifier)",
    ],
    dod: [
      "Scanner finds seeded secrets across languages",
      "False positives suppressible via config, not rule-disable",
      "JSON/SARIF report parseable by CI with correct exit codes",
      "Integrity verifier detects artifact changes relative to an authenticated or otherwise trusted manifest",
      "README explains rules, entropy threshold, integration",
    ],
  },
  {
    num: "21",
    title: "Java Enterprise Workflow + C/C++ Industrial Proof",
    phase: "Systems / Enterprise",
    mission:
      "Enterprise backend strength via Spring Boot workflow/ledger, plus hardware depth via C firmware and C++ simulation.",
    days: [
      "Spring Boot project: workflow entities, state transitions, validation",
      "Ledger posting service (idempotent) + REST + integration tests",
      "Dockerise Java service; verify Python core-api can call it",
      "C firmware simulator: sensor loop, calibration, UART output, faults",
      "C++ machine simulator: time-step model, noise, fault injection, CSV",
      "Feed dataset into anomaly detection + two ADRs capstone",
    ],
    deliverables: [
      "Java approval workflow service",
      "Java ledger posting service",
      "C sensor firmware simulator",
      "C++ machine fault simulator",
      "predictive-maintenance-dataset-generator",
    ],
    dod: [
      "State machine rejects invalid transitions correctly",
      "Ledger posting idempotent under duplicate keys",
      "Java service has passing integration tests + Dockerfile",
      "C simulator compiles clean under strict flags",
      "C++ simulator outputs labelled fault time-series CSV",
      "Dataset usable for ML anomaly detection",
    ],
  },
  {
    num: "22",
    title: "Secondary Breadth Proofs – Kotlin, C#, PHP",
    phase: "Secondary Breadth",
    mission:
      "Add language breadth without pretending mastery — compact, complete tools, explicitly secondary proofs.",
    days: [
      "Kotlin app: login mock, offline list, create requisition, sync queue (1/2)",
      "Kotlin app continued (2/2)",
      "C# Excel validator: import, validate rows, export clean CSV",
      "PHP Laravel portal: login, view POs, upload delivery note PDF",
      "Connect apps to real or well-structured mock endpoints",
      "Honest READMEs (scope/limitations) + showcase section capstone",
    ],
    deliverables: [
      "Kotlin offline field app",
      "C# Excel import validator",
      "PHP Laravel supplier portal (light scope)",
    ],
    dod: [
      "Each app demonstrates one real end-to-end workflow",
      "No project left as empty scaffold",
      "READMEs state limited scope clearly",
      "Kotlin or C# app connects to real Nexus API",
      "Labelled as secondary breadth, not primary anchors",
    ],
  },
  {
    num: "23",
    title: "LangGraph Agents + Human Approval + Red Teaming",
    phase: "AI Agents",
    mission:
      "Flagship AI systems demo: multi-agent research with human approval gates, agent red-teaming, safety documentation.",
    days: [
      "LangGraph state machine skeleton: tool executor, state schema",
      "Supervisor: researcher, analyst, writer, critic/safety nodes",
      "Human-approval gate before side-effect tools; wire MCP client",
      "Red-team harness: 30+ attacks (injection, extraction, escalation)",
      "Formal agent safety + red-team report with severities",
      "Observability -> security dashboard + LangSmith/Langfuse trace capstone",
    ],
    deliverables: [
      "LangGraph research agent",
      "supervisor-agent-network",
      "human-approval-gateway",
      "agent-red-team-harness",
    ],
    dod: [
      "Agent completes cited multi-tool research report",
      "Risky tools require human approval, no bypass",
      "Red-team report: 30+ cases, severities, mitigations",
      "Agent events flow to security telemetry dashboard",
      "One tool invoked via MCP client/server, traces visible",
      "Case study covers supervisor pattern + MCP + safety design",
    ],
  },
  {
    num: "24",
    title: "Final Portfolio Polish + Security Review + Full Launch",
    phase: "Launch",
    mission:
      "Production-hardened, cloud-deployed, security-reviewed platform plus recruiter packaging and the first application wave.",
    days: [
      "Review Security Hub/GuardDuty findings; remediate criticals; K8s audit pass",
      "Finalise portfolio site: headline, categories, diagrams, demo links",
      "Resume into 5 role-specific variants with quantified scope",
      "LinkedIn featured/headline/summary; target list of 10 contacts",
      "Confirm Security+ and SAA-C03 passed (hard deadline)",
      "Buffer/QA day, rehearse outreach — Day 7 is LAUNCH: post, outreach, 15-25 applications",
    ],
    deliverables: [
      "final portfolio website",
      "security review report",
      "role-specific resume variants",
      "certification exam results",
    ],
    dod: [
      "No Critical Security Hub findings unaddressed",
      "All K8s workloads pass baseline Pod Security Standards",
      "Portfolio has clear progression narrative + 8 anchor links",
      "Resume has 8+ strong bullets + role variants",
      "Both certifications passed",
      "15-25 applications submitted on launch day",
    ],
  },
];

const DELOADS: Record<string, Omit<DeloadEntry, "id" | "kind">> = {
  afterS06: {
    num: "D1",
    title: "Deload 1 – Recovery + Consolidation",
    phase: "Full-Stack Business Platform",
    mission:
      "End of the Business Platform phase. No new build requirement — consolidate, rest, get ahead on certification study.",
    tasks: [
      "Certification study (designated cram window)",
      "Fix previous 6 sprints' READMEs, broken demo links, open bugs",
      "One informational interview / meetup / technical write-up",
      "Actual physical recovery: sleep, exercise, reconnecting",
    ],
  },
  afterS13: {
    num: "D2",
    title: "Deload 2 – Recovery + Cert Cram + Stretch Goals",
    phase: "DevSecOps",
    mission:
      "End of Security/DevSecOps, before the ML/MLOps trilogy. Heaviest certification study push window.",
    tasks: [
      "Heaviest cert push: Security+ and AWS SAA-C03",
      "Fix previous 6-7 sprints' READMEs, broken links, open bugs",
      "OPTIONAL: finish Week 11 Go/Prometheus/Grafana/Loki stretch goals",
      "One informational interview / meetup / write-up",
      "Actual physical recovery",
    ],
  },
  afterS19: {
    num: "D3",
    title: "Deload 3 – Recovery + Consolidation",
    phase: "AI Safety",
    mission:
      "End of AI Safety, before Systems breadth and Agents begin. No new build requirement.",
    tasks: [
      "Certification study buffer (hard deadline: Sprint 20)",
      "Fix previous 6 sprints' READMEs, broken links, open bugs",
      "One informational interview / meetup / write-up",
      "Actual physical recovery",
    ],
  },
};

function buildEntries(): LogEntry[] {
  const out: LogEntry[] = [];
  RAW.forEach((s) => {
    out.push({ id: "S" + s.num, kind: "sprint", ...s });
    if (s.num === "06")
      out.push({ id: "D1", kind: "deload", ...DELOADS.afterS06 });
    if (s.num === "13")
      out.push({ id: "D2", kind: "deload", ...DELOADS.afterS13 });
    if (s.num === "19")
      out.push({ id: "D3", kind: "deload", ...DELOADS.afterS19 });
  });
  return out;
}

export const NEXUS_LOG_ENTRIES: LogEntry[] = buildEntries();

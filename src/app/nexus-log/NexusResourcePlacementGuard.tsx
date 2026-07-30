"use client";

import { useEffect } from "react";

type FallbackResource = {
  title: string;
  source: string;
  url: string;
  description: string;
};

type PlacementRule = {
  task: RegExp;
  resource: RegExp;
  fallback: FallbackResource;
};

const fallback = (
  title: string,
  source: string,
  url: string,
  description: string,
): FallbackResource => ({ title, source, url, description });

const RULES: PlacementRule[] = [
  {
    task: /python|pyproject|ruff|mypy|pytest|coverage|typing|package|pip install|python-toolkit/i,
    resource: /python|pyproject|packaging|pytest|mypy|ruff|cs50p/i,
    fallback: fallback("Python Packaging User Guide", "PyPA", "https://packaging.python.org/en/latest/", "Use for pyproject.toml, package structure, dependencies, builds, and installation."),
  },
  {
    task: /cli|json|csv converter|hash checker|bulk rename|file search|log cleaner|pathlib|argparse/i,
    resource: /python|argparse|pathlib|csv|json|hashlib|cs50p/i,
    fallback: fallback("Python standard library", "Python", "https://docs.python.org/3/library/", "Primary reference for the modules used to build the CLI toolkit."),
  },
  {
    task: /hashmap|hash map|heap|graph|bfs|dfs|dijkstra|algorithm|complexity|benchmark/i,
    resource: /algorithm|visualgo|data structure|cs50/i,
    fallback: fallback("VisuAlgo", "National University of Singapore", "https://visualgo.net/en", "Visualise the exact data structures and graph algorithms used in this task."),
  },
  {
    task: /postgres|sql|schema|query|index|explain|database|warehouse|materialised|fact|dimension/i,
    resource: /postgres|sql|sqlalchemy|alembic|dimensional|dbt|database/i,
    fallback: fallback("PostgreSQL documentation", "PostgreSQL", "https://www.postgresql.org/docs/current/", "Use the official PostgreSQL reference for schema, queries, indexes, transactions, and EXPLAIN."),
  },
  {
    task: /ssh|ufw|fail2ban|vps|linux|server lockdown|bastion|deploy user|bootstrap/i,
    resource: /linux|ubuntu|openssh|ssh|missing semester|server/i,
    fallback: fallback("Ubuntu Server documentation", "Canonical", "https://documentation.ubuntu.com/server/", "Server administration, OpenSSH, firewall, networking, storage, and security guidance."),
  },
  {
    task: /docker|compose|container|dockerfile/i,
    resource: /docker|compose|container/i,
    fallback: fallback("Docker Get Started", "Docker", "https://docs.docker.com/get-started/", "Use for images, containers, volumes, networks, Compose, and multi-container applications."),
  },
  {
    task: /https|tls|certificate|reverse proxy|nginx|ingress terminates|public domain/i,
    resource: /nginx|https|tls|certificate|let.s encrypt|ingress/i,
    fallback: fallback("NGINX beginner’s guide", "NGINX", "https://nginx.org/en/docs/beginners_guide.html", "Reverse proxying, routing, static content, and HTTPS-facing configuration."),
  },
  {
    task: /github actions|ci\/cd|ci gate|ci runs|pipeline|deploys to vps|deploy on merge|from ci|github security tab|security stage|release artifact/i,
    resource: /github actions|workflow|ci\/cd|pipeline|github security|sarif/i,
    fallback: fallback("GitHub Actions documentation", "GitHub", "https://docs.github.com/en/actions", "Workflow syntax, caching, artifacts, environments, secrets, and deployment."),
  },
  {
    task: /backup|restore|pg_dump|pg_restore/i,
    resource: /backup|restore|postgres|s3/i,
    fallback: fallback("PostgreSQL backup and restore", "PostgreSQL", "https://www.postgresql.org/docs/current/backup.html", "Authoritative backup, dump, restore, and recovery guidance."),
  },
  {
    task: /fastapi|openapi|crud|api|route|endpoint|pagination|validation|requisition|integration test|seed script/i,
    resource: /fastapi|openapi|pydantic|sqlalchemy|alembic|api/i,
    fallback: fallback("FastAPI Tutorial", "FastAPI", "https://fastapi.tiangolo.com/tutorial/", "Typed APIs, validation, dependencies, authentication, testing, and deployment."),
  },
  {
    task: /auth|login|logout|password|jwt|rbac|abac|permission|authori[sz]ation|branch scoping|protected route|secure cookie/i,
    resource: /auth|jwt|owasp|asvs|permission|security/i,
    fallback: fallback("OWASP Cheat Sheet Series", "OWASP", "https://cheatsheetseries.owasp.org/", "Authentication, authorization, sessions, secrets, APIs, and access-control guidance."),
  },
  {
    task: /ledger|idempotency|webhook|duplicate|state machine|audit trail|compensating entr/i,
    resource: /idempot|http semantics|ledger|postgres|sql|owasp|api/i,
    fallback: fallback("HTTP Semantics", "IETF", "https://www.rfc-editor.org/rfc/rfc9110", "Use the primary HTTP semantics when designing idempotent operations and status behavior."),
  },
  {
    task: /next\.js|nextjs|typescript|react|frontend|dashboard|ui|sidebar|layout|form|table|mobile|responsive|loading state|error boundar|approval queue/i,
    resource: /next|typescript|react|shadcn|accessibility|wcag/i,
    fallback: fallback("Next.js App Router documentation", "Next.js", "https://nextjs.org/docs/app/getting-started", "Layouts, server and client components, route handlers, errors, caching, and deployment."),
  },
  {
    task: /pdf|purchase order|delivery note|issue voucher|statement|invoice|document extraction|a4|pymupdf/i,
    resource: /weasyprint|pdf|pymupdf|pydantic|document/i,
    fallback: fallback("WeasyPrint first steps", "WeasyPrint", "https://doc.courtbouillon.org/weasyprint/stable/first_steps.html", "HTML/CSS-to-PDF generation, page styling, fonts, and print-ready documents."),
  },
  {
    task: /readme|case study|architecture|diagram|resume|portfolio|demo video|demo link|screenshots|technical write-up|adr|documentation|showcase/i,
    resource: /technical writing|mermaid|github profile|system design|readme|documentation/i,
    fallback: fallback("Technical Writing Courses", "Google for Developers", "https://developers.google.com/tech-writing", "Use for READMEs, architecture notes, case studies, procedures, and troubleshooting."),
  },
  {
    task: /etl|messy|csv|excel|cleaner|transform|normalis|data quality|bad-record|quarantine|load summary|analytics warehouse|duplicate load/i,
    resource: /data engineering|pandas|dimensional|postgres|warehouse/i,
    fallback: fallback("pandas user guide", "pandas", "https://pandas.pydata.org/docs/user_guide/index.html", "Ingestion, cleaning, missing data, joins, reshaping, grouping, and file formats."),
  },
  {
    task: /airflow|dag|backfill|scheduled|schedule|retry|alert hook|orchestrat/i,
    resource: /airflow|dag|data engineering/i,
    fallback: fallback("Apache Airflow tutorials", "Apache Airflow", "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html", "DAGs, scheduling, retries, logs, testing, and backfills."),
  },
  {
    task: /aws|iam|ec2|rds|s3|cloudwatch|cloudtrail|guardduty|security hub|alb|billing|budget|mfa|vpc|subnet|nacl/i,
    resource: /aws|well-architected|vpc|iam|rds|cloudwatch|secrets manager/i,
    fallback: fallback("AWS Well-Architected", "AWS", "https://aws.amazon.com/architecture/well-architected/", "Use AWS architectural guidance to validate security, reliability, operations, performance, and cost decisions."),
  },
  {
    task: /terraform|iac|remote state|dynamodb lock|provider config|module|terraform apply|state in git/i,
    resource: /terraform|hashicorp/i,
    fallback: fallback("Terraform tutorials", "HashiCorp", "https://developer.hashicorp.com/terraform/tutorials", "Workflow, state, modules, variables, outputs, testing, and infrastructure automation."),
  },
  {
    task: /kubernetes|k8s|serviceaccount|rolebinding|networkpolic|pod security|sealed-secret|eso|ingress|prometheus|grafana|loki/i,
    resource: /kubernetes|rbac|network|pod|prometheus|grafana|loki/i,
    fallback: fallback("Kubernetes documentation", "Kubernetes", "https://kubernetes.io/docs/", "Use for workload objects, RBAC, NetworkPolicies, Pod Security, ingress, and operations."),
  },
  {
    task: /threat|stride|dfd|trust boundar|owasp top 10|risk rating|secure sdlc|security architecture|security review/i,
    resource: /threat|owasp|asvs|security|nist/i,
    fallback: fallback("OWASP Threat Modeling", "OWASP", "https://owasp.org/www-community/Threat_Modeling", "Data-flow diagrams, trust boundaries, threats, risk assessment, and mitigations."),
  },
  {
    task: /semgrep|bandit|pip-audit|npm audit|trivy|gitleaks|sbom|syft|sarif|sca|sast|secret scan|critical findings/i,
    resource: /semgrep|trivy|gitleaks|syft|sarif|security|sbom/i,
    fallback: fallback("GitHub code security documentation", "GitHub", "https://docs.github.com/en/code-security", "Security scanning, dependency review, secret protection, code scanning, and SARIF."),
  },
  {
    task: /machine learning|\bml\b|model|prediction|shap|feature|training|inference|baseline|leakage|forecast|anomaly detection/i,
    resource: /machine learning|scikit|model card|shap|mlflow|fastapi/i,
    fallback: fallback("Machine Learning Crash Course", "Google", "https://developers.google.com/machine-learning/crash-course", "Core ML concepts, evaluation, data, generalisation, and responsible model development."),
  },
  {
    task: /mlflow|registry|experiment|model version|promotion|rollback|lineage|production alias|active model|artifact metadata/i,
    resource: /mlflow|registry|experiment|model card/i,
    fallback: fallback("MLflow documentation", "MLflow", "https://mlflow.org/docs/latest/", "Experiment tracking, models, registry, aliases, promotion, rollback, and lineage."),
  },
  {
    task: /drift|retrain|evaluation gate|reference\/current window|candidate model|model decay/i,
    resource: /evidently|mlflow|airflow|machine learning/i,
    fallback: fallback("Evidently documentation", "Evidently AI", "https://docs.evidentlyai.com/", "Data and prediction drift, reports, tests, monitoring, and alert thresholds."),
  },
  {
    task: /rag|embedding|pgvector|retrieval|citation|chunk|streaming|semantic search|chat history|grounded answer|mcp server/i,
    resource: /rag|llm|langchain|pgvector|mcp|hugging face/i,
    fallback: fallback("Build a RAG application", "LangChain", "https://docs.langchain.com/oss/python/langchain/rag", "Ingestion, splitting, embeddings, retrieval, generation, grounding, and citations."),
  },
  {
    task: /golden set|llm-as-judge|prompt a\/b|rag evaluation|hallucination|structured extraction|multimodal|correction endpoint|typed json|source alongside/i,
    resource: /ragas|eval|pydantic|pymupdf|model card|llm/i,
    fallback: fallback("Ragas documentation", "Ragas", "https://docs.ragas.io/", "Evaluate retrieval and answer quality with reproducible datasets and metrics."),
  },
  {
    task: /prompt injection|pii|guardrail|red-team|red team|grounding verification|ai safety|safety gateway|redaction|weakly-grounded/i,
    resource: /owasp|nist|presidio|pyrit|safety|llm/i,
    fallback: fallback("OWASP Top 10 for LLM Applications", "OWASP", "https://genai.owasp.org/llm-top-10/", "Threats and controls for prompt injection, data leakage, excessive agency, and insecure output handling."),
  },
  {
    task: /rust|clap|secret scanner|entropy|secscan|integrity-agent|artifact integrity|\.secscanignore/i,
    resource: /rust|gitleaks|sarif/i,
    fallback: fallback("The Rust Programming Language", "Rust", "https://doc.rust-lang.org/book/", "Ownership, error handling, traits, testing, project structure, and idiomatic Rust."),
  },
  {
    task: /java|spring|ledger posting|workflow entities/i,
    resource: /spring|java/i,
    fallback: fallback("Spring guides", "Spring", "https://spring.io/guides", "Build REST services, validation, persistence, testing, and production-oriented Spring applications."),
  },
  {
    task: /c\+\+|c firmware|cmake|uart|sensor loop|machine simulator|fault injection|strict flags/i,
    resource: /c\+\+|cmake|beej|learncpp/i,
    fallback: fallback("Learn C++", "LearnCpp", "https://www.learncpp.com/", "Language fundamentals, build discipline, testing, simulation, and modern C++ practices."),
  },
  {
    task: /kotlin|android|offline field app|sync queue/i,
    resource: /kotlin|android/i,
    fallback: fallback("Android Developers training", "Google", "https://developer.android.com/courses", "Official Android and Kotlin learning paths for app architecture, storage, networking, and UI."),
  },
  {
    task: /c#|dotnet|\.net|excel import validator|excel validator/i,
    resource: /c#|dotnet|\.net|microsoft/i,
    fallback: fallback("C# documentation", "Microsoft", "https://learn.microsoft.com/dotnet/csharp/", "Language, files, collections, validation, testing, and .NET application patterns."),
  },
  {
    task: /php|laravel|supplier portal/i,
    resource: /laravel|php/i,
    fallback: fallback("Laravel documentation", "Laravel", "https://laravel.com/docs", "Routing, authentication, validation, storage, uploads, testing, and deployment."),
  },
  {
    task: /langgraph|agent|supervisor|human approval|tool executor|langsmith|langfuse|side-effect tool|multi-tool/i,
    resource: /langgraph|mcp|langsmith|pyrit|agent/i,
    fallback: fallback("LangGraph documentation", "LangChain", "https://docs.langchain.com/oss/python/langgraph/", "State graphs, durable execution, interrupts, human approval, tools, and agent workflows."),
  },
  {
    task: /security\+|saa-c03|certification|exam|cert push|cert study/i,
    resource: /security\+|saa-c03|aws exam|aws skill|retrieval practice/i,
    fallback: fallback("Retrieval practice", "The Learning Scientists", "https://www.learningscientists.org/retrieval-practice", "Use active recall, spaced review, and error correction for certification study."),
  },
  {
    task: /informational interview|meetup|networking|linkedin|outreach|applications|application-wave|target list|role-specific resume/i,
    resource: /technical writing|github profile|resume|portfolio|informational interview|networking/i,
    fallback: fallback("Informational interviews", "UC Berkeley Career Engagement", "https://www.career.berkeley.edu/start-exploring/informational-interviews/", "Prepare, conduct, and follow up on focused career conversations."),
  },
  {
    task: /physical recovery|sleep|exercise|reconnecting|protected rest/i,
    resource: /sleep|physical activity|recovery/i,
    fallback: fallback("About sleep", "CDC", "https://www.cdc.gov/sleep/about/index.html", "Use deloads for real recovery, learning consolidation, and sustainable performance."),
  },
];

const ACTIONS_RESOURCE = /github actions|workflow syntax|ci\/cd|pipeline|github security tab/i;
const ACTIONS_TASK = /github actions|ci\/cd|ci gate|ci runs|pipeline|deploys to vps|deploy on merge|from ci|github security tab|security stage|release artifact/i;

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim();
}

function tokenOverlap(task: string, resource: string) {
  const ignored = new Set(["and", "the", "for", "with", "from", "into", "this", "that", "service", "project", "system"]);
  const resourceText = normalise(resource);
  return normalise(task)
    .split(/\s+/)
    .filter((token) => token.length > 3 && !ignored.has(token))
    .filter((token) => resourceText.includes(token)).length;
}

function taskTextFor(host: HTMLElement) {
  const parent = host.parentElement;
  const button = parent?.querySelector<HTMLButtonElement>(":scope > button");
  return button?.textContent?.trim() ?? parent?.textContent?.trim() ?? "";
}

function createFallbackCard(resource: FallbackResource) {
  const link = document.createElement("a");
  link.className = "nexus-task-resource-card nexus-placement-fallback";
  link.href = resource.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.innerHTML = `<span class="nexus-task-resource-kind">Reference</span><strong></strong><p></p><small></small>`;
  link.querySelector("strong")!.textContent = resource.title;
  link.querySelector("p")!.textContent = resource.description;
  link.querySelector("small")!.textContent = resource.source;
  return link;
}

function auditHost(host: HTMLElement) {
  const taskText = taskTextFor(host);
  if (!taskText) return;

  const details = host.querySelector<HTMLElement>(".nexus-task-learning");
  const grid = details?.querySelector<HTMLElement>(".nexus-task-resource-grid");
  if (!details || !grid) return;

  const matchedRules = RULES.filter((rule) => rule.task.test(taskText));
  const cards = Array.from(grid.querySelectorAll<HTMLAnchorElement>(".nexus-task-resource-card:not(.nexus-placement-fallback)"));

  for (const card of cards) {
    const text = card.textContent ?? "";
    const actionsMismatch = ACTIONS_RESOURCE.test(text) && !ACTIONS_TASK.test(taskText);
    const eligible = matchedRules.length
      ? matchedRules.some((rule) => rule.resource.test(text))
      : tokenOverlap(taskText, text) >= 2;
    card.hidden = actionsMismatch || !eligible;
  }

  const video = details.querySelector<HTMLElement>(".nexus-task-video");
  const iframeTitle = video?.querySelector("iframe")?.title ?? "";
  if (video && iframeTitle) {
    const actionsMismatch = ACTIONS_RESOURCE.test(iframeTitle) && !ACTIONS_TASK.test(taskText);
    const eligible = matchedRules.length
      ? matchedRules.some((rule) => rule.resource.test(iframeTitle))
      : tokenOverlap(taskText, iframeTitle) >= 2;
    video.hidden = actionsMismatch || !eligible;
  }

  grid.querySelector(".nexus-placement-fallback")?.remove();
  let visibleCards = cards.filter((card) => !card.hidden);

  if (visibleCards.length === 0 && matchedRules[0]) {
    grid.appendChild(createFallbackCard(matchedRules[0].fallback));
    visibleCards = Array.from(grid.querySelectorAll<HTMLAnchorElement>(".nexus-task-resource-card:not([hidden])"));
  }

  const firstTitle = visibleCards[0]?.querySelector("strong")?.textContent?.trim();
  const summary = details.querySelector<HTMLElement>(".nexus-task-learning-summary small");
  if (summary && firstTitle) {
    const selfCheck = summary.textContent?.match(/self-check\s+\d+\/3/i)?.[0] ?? "self-check 0/3";
    summary.textContent = `${firstTitle} · ${selfCheck}`;
  }
}

export default function NexusResourcePlacementGuard() {
  useEffect(() => {
    const shell = document.getElementById("nexus-log-shell");
    if (!shell) return;

    let frame = 0;
    const audit = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        shell
          .querySelectorAll<HTMLElement>(".nexus-task-resource-host")
          .forEach(auditHost);
      });
    };

    const observer = new MutationObserver(audit);
    observer.observe(shell, { childList: true, subtree: true, characterData: true });
    audit();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}

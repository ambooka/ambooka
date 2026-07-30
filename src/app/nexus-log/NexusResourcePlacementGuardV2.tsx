"use client";

import { useEffect } from "react";

type Rule = {
  task: RegExp;
  allowed: RegExp;
  fallback: readonly [title: string, source: string, url: string, description: string];
};

const R = (
  task: RegExp,
  allowed: RegExp,
  title: string,
  source: string,
  url: string,
  description: string,
): Rule => ({ task, allowed, fallback: [title, source, url, description] });

const RULES: Rule[] = [
  R(/python|pyproject|ruff|mypy|pytest|coverage|typing|package|pip install|python-toolkit/i, /python|pyproject|packaging|pytest|mypy|ruff|cs50p/i, "Python Packaging User Guide", "PyPA", "https://packaging.python.org/en/latest/", "pyproject.toml, package structure, dependencies, builds, and installation."),
  R(/cli|json|csv converter|hash checker|bulk rename|file search|log cleaner|pathlib|argparse/i, /python|argparse|pathlib|csv|json|hashlib|cs50p/i, "Python standard library", "Python", "https://docs.python.org/3/library/", "The modules used to build the CLI toolkit."),
  R(/hashmap|hash map|heap|graph|bfs|dfs|dijkstra|algorithm|complexity|benchmark/i, /algorithm|visualgo|data structure|cs50/i, "VisuAlgo", "NUS", "https://visualgo.net/en", "Visualise the data structures and graph algorithms used in this task."),
  R(/postgres|sql|schema|query|index|explain|database|warehouse|materialised|fact|dimension/i, /postgres|sql|sqlalchemy|alembic|dimensional|dbt|database/i, "PostgreSQL documentation", "PostgreSQL", "https://www.postgresql.org/docs/current/", "Schema, queries, indexes, transactions, and EXPLAIN."),
  R(/ssh|ufw|fail2ban|vps|linux|server lockdown|bastion|deploy user|bootstrap/i, /linux|ubuntu|openssh|ssh|missing semester|server/i, "Ubuntu Server documentation", "Canonical", "https://documentation.ubuntu.com/server/", "Server administration, OpenSSH, firewall, networking, storage, and security."),
  R(/docker|compose|container|dockerfile/i, /docker|compose|container/i, "Docker Get Started", "Docker", "https://docs.docker.com/get-started/", "Images, containers, volumes, networks, Compose, and multi-container applications."),
  R(/https|tls|certificate|reverse proxy|nginx|ingress terminates|public domain/i, /nginx|https|tls|certificate|let.s encrypt|ingress/i, "NGINX beginner’s guide", "NGINX", "https://nginx.org/en/docs/beginners_guide.html", "Reverse proxying, routing, static content, and HTTPS-facing configuration."),
  R(/github actions|ci\/cd|ci gate|ci runs|deploys to vps|deploy on merge|from ci|github security tab|security stage|release artifact|infrastructure-ci|devsecops-pipeline|security pipeline/i, /github actions|workflow|ci\/cd|github security|sarif/i, "GitHub Actions documentation", "GitHub", "https://docs.github.com/en/actions", "Workflow syntax, caching, artifacts, environments, secrets, and deployment."),
  R(/backup|restore|pg_dump|pg_restore/i, /backup|restore|postgres|s3/i, "PostgreSQL backup and restore", "PostgreSQL", "https://www.postgresql.org/docs/current/backup.html", "Backup, dump, restore, and recovery guidance."),
  R(/fastapi|openapi|crud|api|route|endpoint|pagination|validation|requisition|integration test|seed script/i, /fastapi|openapi|pydantic|sqlalchemy|alembic|api/i, "FastAPI Tutorial", "FastAPI", "https://fastapi.tiangolo.com/tutorial/", "Typed APIs, validation, dependencies, authentication, testing, and deployment."),
  R(/auth|login|logout|password|jwt|rbac|abac|permission|authori[sz]ation|branch scoping|protected route|secure cookie|secret|secrets manager/i, /auth|jwt|owasp|asvs|permission|security|secret/i, "OWASP Cheat Sheet Series", "OWASP", "https://cheatsheetseries.owasp.org/", "Authentication, authorization, sessions, secrets, APIs, and access control."),
  R(/ledger|idempotency|webhook|duplicate|state machine|audit trail|compensating entr/i, /idempot|http semantics|ledger|postgres|sql|owasp|api/i, "HTTP Semantics", "IETF", "https://www.rfc-editor.org/rfc/rfc9110", "Safe and idempotent operations, methods, status codes, and request behavior."),
  R(/next\.js|nextjs|typescript|react|frontend|dashboard|ui|sidebar|layout|form|table|mobile|responsive|loading state|error boundar|approval queue/i, /next|typescript|react|shadcn|accessibility|wcag/i, "Next.js App Router documentation", "Next.js", "https://nextjs.org/docs/app/getting-started", "Layouts, components, route handlers, errors, caching, and deployment."),
  R(/pdf|purchase order|delivery note|issue voucher|statement|invoice|document extraction|a4|pymupdf/i, /weasyprint|pdf|pymupdf|pydantic|document/i, "WeasyPrint first steps", "WeasyPrint", "https://doc.courtbouillon.org/weasyprint/stable/first_steps.html", "HTML/CSS-to-PDF generation and print-ready documents."),
  R(/readme|case study|architecture|diagram|resume|portfolio|demo video|demo link|screenshots|technical write-up|adr|documentation|showcase/i, /technical writing|mermaid|github profile|system design|readme|documentation/i, "Technical Writing Courses", "Google", "https://developers.google.com/tech-writing", "READMEs, architecture notes, case studies, procedures, and troubleshooting."),
  R(/etl|messy|csv|excel|cleaner|transform|normalis|data quality|bad-record|quarantine|load summary|analytics warehouse|duplicate load/i, /data engineering|pandas|dimensional|postgres|warehouse/i, "pandas user guide", "pandas", "https://pandas.pydata.org/docs/user_guide/index.html", "Ingestion, cleaning, missing data, joins, reshaping, grouping, and file formats."),
  R(/airflow|dag|backfill|scheduled|schedule|retry|alert hook|orchestrat/i, /airflow|dag|data engineering/i, "Apache Airflow tutorials", "Airflow", "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html", "DAGs, scheduling, retries, logs, testing, and backfills."),
  R(/full-stack deployment|public demo|deploy full stack|deployment case study|landing page/i, /nginx|docker|deployment|https|technical writing/i, "NGINX beginner’s guide", "NGINX", "https://nginx.org/en/docs/beginners_guide.html", "Production-facing reverse proxy and deployment configuration."),
  R(/observability|telemetry|monitoring dashboard|security telemetry|prometheus|grafana|loki|trace capstone/i, /prometheus|grafana|loki|cloudwatch|langsmith|observability|telemetry/i, "Prometheus documentation", "Prometheus", "https://prometheus.io/docs/introduction/overview/", "Metrics, instrumentation, querying, alerting, and observability."),
  R(/aws|iam|ec2|rds|s3|cloudwatch|cloudtrail|guardduty|security hub|alb|billing|budget|mfa|vpc|subnet|nacl/i, /aws|well-architected|vpc|iam|rds|cloudwatch|secrets manager/i, "AWS Well-Architected", "AWS", "https://aws.amazon.com/architecture/well-architected/", "Security, reliability, operations, performance, and cost decisions."),
  R(/terraform|iac|remote state|dynamodb lock|provider config|module|terraform apply|state in git/i, /terraform|hashicorp/i, "Terraform tutorials", "HashiCorp", "https://developer.hashicorp.com/terraform/tutorials", "Workflow, state, modules, variables, outputs, and infrastructure automation."),
  R(/kubernetes|k8s|serviceaccount|rolebinding|networkpolic|pod security|sealed-secret|eso|ingress|prometheus|grafana|loki/i, /kubernetes|rbac|network|pod|prometheus|grafana|loki/i, "Kubernetes documentation", "Kubernetes", "https://kubernetes.io/docs/", "Workloads, RBAC, NetworkPolicies, Pod Security, ingress, and operations."),
  R(/threat|stride|dfd|trust boundar|owasp top 10|risk rating|secure sdlc|security architecture|security review/i, /threat|owasp|asvs|security|nist/i, "OWASP Threat Modeling", "OWASP", "https://owasp.org/www-community/Threat_Modeling", "Data-flow diagrams, trust boundaries, threats, risks, and mitigations."),
  R(/semgrep|bandit|pip-audit|npm audit|trivy|gitleaks|sbom|syft|sarif|sca|sast|secret scan|security scan|critical findings|pre-commit security/i, /semgrep|trivy|gitleaks|syft|sarif|security|sbom/i, "GitHub code security documentation", "GitHub", "https://docs.github.com/en/code-security", "Code, dependency, container, and secret scanning plus SARIF reporting."),
  R(/machine learning|\bml\b|model|prediction|predictive maintenance|dataset|shap|feature|training|inference|baseline|leakage|forecast|anomaly detection/i, /machine learning|scikit|model card|shap|mlflow|fastapi/i, "Machine Learning Crash Course", "Google", "https://developers.google.com/machine-learning/crash-course", "ML concepts, evaluation, data, generalisation, and responsible development."),
  R(/mlflow|registry|experiment|model version|promotion|rollback|lineage|production alias|active model|artifact metadata/i, /mlflow|registry|experiment|model card/i, "MLflow documentation", "MLflow", "https://mlflow.org/docs/latest/", "Experiment tracking, models, registry, aliases, promotion, rollback, and lineage."),
  R(/drift|retrain|evaluation gate|reference\/current window|candidate model|model decay/i, /evidently|mlflow|airflow|machine learning/i, "Evidently documentation", "Evidently", "https://docs.evidentlyai.com/", "Data and prediction drift, tests, reports, monitoring, and alerts."),
  R(/rag|embedding|pgvector|retrieval|citation|chunk|streaming|semantic search|chat history|grounded answer|mcp server/i, /rag|llm|langchain|pgvector|mcp|hugging face/i, "Build a RAG application", "LangChain", "https://docs.langchain.com/oss/python/langchain/rag", "Ingestion, splitting, embeddings, retrieval, generation, grounding, and citations."),
  R(/golden set|llm-as-judge|prompt a\/b|rag evaluation|hallucination|structured extraction|multimodal|correction endpoint|typed json|source alongside/i, /ragas|eval|pydantic|pymupdf|model card|llm/i, "Ragas documentation", "Ragas", "https://docs.ragas.io/", "Reproducible retrieval and answer-quality evaluation."),
  R(/prompt injection|pii|guardrail|red-team|red team|grounding verification|ai safety|safety gateway|redaction|weakly-grounded/i, /owasp|nist|presidio|pyrit|safety|llm/i, "OWASP Top 10 for LLM Applications", "OWASP", "https://genai.owasp.org/llm-top-10/", "Prompt injection, data leakage, excessive agency, and insecure output handling."),
  R(/rust|clap|secret scanner|entropy|secscan|integrity-agent|artifact integrity|\.secscanignore/i, /rust|gitleaks|sarif/i, "The Rust Programming Language", "Rust", "https://doc.rust-lang.org/book/", "Ownership, error handling, traits, testing, and idiomatic Rust."),
  R(/java|spring|ledger posting|workflow entities/i, /spring|java/i, "Spring guides", "Spring", "https://spring.io/guides", "REST services, validation, persistence, testing, and Spring applications."),
  R(/c\+\+|c firmware|cmake|uart|sensor loop|machine simulator|fault injection|strict flags/i, /c\+\+|cmake|beej|learncpp/i, "Learn C++", "LearnCpp", "https://www.learncpp.com/", "Language fundamentals, build discipline, simulation, and modern C++."),
  R(/kotlin|android|offline field app|sync queue/i, /kotlin|android/i, "Android Developers training", "Google", "https://developer.android.com/courses", "Android and Kotlin architecture, storage, networking, and UI."),
  R(/c#|dotnet|\.net|excel import validator|excel validator/i, /c#|dotnet|\.net|microsoft/i, "C# documentation", "Microsoft", "https://learn.microsoft.com/dotnet/csharp/", "Language, files, collections, validation, testing, and .NET patterns."),
  R(/php|laravel|supplier portal/i, /laravel|php/i, "Laravel documentation", "Laravel", "https://laravel.com/docs", "Routing, authentication, validation, storage, uploads, testing, and deployment."),
  R(/langgraph|agent|supervisor|human approval|tool executor|langsmith|langfuse|side-effect tool|multi-tool/i, /langgraph|mcp|langsmith|pyrit|agent/i, "LangGraph documentation", "LangChain", "https://docs.langchain.com/oss/python/langgraph/", "State graphs, durable execution, interrupts, approval, tools, and agents."),
  R(/security\+|saa-c03|certification|exam|cert push|cert study/i, /security\+|saa-c03|aws exam|aws skill|retrieval practice/i, "Retrieval practice", "The Learning Scientists", "https://www.learningscientists.org/retrieval-practice", "Active recall, spaced review, and error correction for certification study."),
  R(/informational interview|meetup|networking|linkedin|outreach|applications|application-wave|target list|role-specific resume/i, /technical writing|github profile|resume|portfolio|informational interview|networking/i, "Informational interviews", "UC Berkeley", "https://www.career.berkeley.edu/start-exploring/informational-interviews/", "Prepare, conduct, and follow up on focused career conversations."),
  R(/physical recovery|sleep|exercise|reconnecting|protected rest/i, /sleep|physical activity|recovery/i, "About sleep", "CDC", "https://www.cdc.gov/sleep/about/index.html", "Use deloads for real recovery, learning consolidation, and sustainable performance."),
];

const ACTIONS_RESOURCE = /github actions|workflow syntax|ci\/cd|github security tab/i;
const ACTIONS_TASK = /github actions|ci\/cd|ci gate|ci runs|deploys to vps|deploy on merge|from ci|github security tab|security stage|release artifact|infrastructure-ci|devsecops-pipeline|security pipeline/i;

function taskText(host: HTMLElement) {
  return host.parentElement?.querySelector<HTMLButtonElement>(":scope > button")?.textContent?.trim() ?? "";
}

function fallbackCard([title, source, url, description]: Rule["fallback"]) {
  const link = document.createElement("a");
  link.className = "nexus-task-resource-card nexus-placement-fallback";
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.innerHTML = `<span class="nexus-task-resource-kind">Reference</span><strong></strong><p></p><small></small>`;
  link.querySelector("strong")!.textContent = title;
  link.querySelector("p")!.textContent = description;
  link.querySelector("small")!.textContent = source;
  return link;
}

function auditHost(host: HTMLElement) {
  const task = taskText(host);
  const details = host.querySelector<HTMLElement>(".nexus-task-learning");
  const grid = details?.querySelector<HTMLElement>(".nexus-task-resource-grid");
  if (!task || !details || !grid) return;

  const matched = RULES.filter((rule) => rule.task.test(task));
  const cards = Array.from(grid.querySelectorAll<HTMLAnchorElement>(".nexus-task-resource-card:not(.nexus-placement-fallback)"));
  cards.forEach((card) => {
    const content = card.textContent ?? "";
    const wrongActions = ACTIONS_RESOURCE.test(content) && !ACTIONS_TASK.test(task);
    card.hidden = wrongActions || (matched.length > 0 && !matched.some((rule) => rule.allowed.test(content)));
  });

  const video = details.querySelector<HTMLElement>(".nexus-task-video");
  const videoTitle = video?.querySelector("iframe")?.title ?? "";
  if (video && videoTitle) {
    const wrongActions = ACTIONS_RESOURCE.test(videoTitle) && !ACTIONS_TASK.test(task);
    video.hidden = wrongActions || (matched.length > 0 && !matched.some((rule) => rule.allowed.test(videoTitle)));
  }

  let inserted = grid.querySelector<HTMLAnchorElement>(".nexus-placement-fallback");
  let visible = cards.filter((card) => !card.hidden);
  if (visible.length > 0) {
    inserted?.remove();
    inserted = null;
  } else if (matched[0]) {
    const requiredUrl = new URL(matched[0].fallback[2]).href;
    if (!inserted || inserted.href !== requiredUrl) {
      inserted?.remove();
      inserted = fallbackCard(matched[0].fallback);
      grid.appendChild(inserted);
    }
    visible = [inserted];
  }

  const title = visible[0]?.querySelector("strong")?.textContent?.trim();
  const summary = details.querySelector<HTMLElement>(".nexus-task-learning-summary small");
  if (title && summary) {
    const progress = summary.textContent?.match(/self-check\s+\d+\/3/i)?.[0] ?? "self-check 0/3";
    const next = `${title} · ${progress}`;
    if (summary.textContent !== next) summary.textContent = next;
  }
}

export default function NexusResourcePlacementGuardV2() {
  useEffect(() => {
    const shell = document.getElementById("nexus-log-shell");
    if (!shell) return;
    let frame = 0;
    const audit = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        shell.querySelectorAll<HTMLElement>(".nexus-task-resource-host").forEach(auditHost);
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

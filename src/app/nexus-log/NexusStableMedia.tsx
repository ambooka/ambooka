"use client";

import { useEffect } from "react";

type MediaRule = {
  task: RegExp;
  allowed: RegExp;
};

const MEDIA_RULES: MediaRule[] = [
  {
    task: /python|pyproject|ruff|mypy|pytest|coverage|typing|package|pip install|python-toolkit|cli|json|csv converter|hash checker|bulk rename|file search|log cleaner/i,
    allowed: /python|cs50p|packaging|pytest|mypy|ruff/i,
  },
  {
    task: /hashmap|hash map|heap|graph|bfs|dfs|dijkstra|algorithm|complexity|benchmark/i,
    allowed: /algorithm|data structure|cs50|visualgo/i,
  },
  {
    task: /postgres|sql|schema|query|index|explain|database|warehouse|materialised|fact|dimension/i,
    allowed: /postgres|sql|database|data engineering/i,
  },
  {
    task: /ssh|ufw|fail2ban|vps|linux|server lockdown|bastion|deploy user|bootstrap/i,
    allowed: /linux|ubuntu|openssh|ssh|missing semester|server/i,
  },
  {
    task: /docker|compose|container|dockerfile/i,
    allowed: /docker|compose|container/i,
  },
  {
    task: /fastapi|openapi|crud|api|route|endpoint|pagination|validation|requisition|integration test|seed script/i,
    allowed: /fastapi|openapi|pydantic|sqlalchemy|api/i,
  },
  {
    task: /next\.js|nextjs|typescript|react|frontend|dashboard|ui|sidebar|layout|form|table|mobile|responsive|loading state|error boundar|approval queue/i,
    allowed: /next|typescript|react|frontend|accessibility/i,
  },
  {
    task: /etl|messy|csv|excel|cleaner|transform|normalis|data quality|bad-record|quarantine|load summary|analytics warehouse|duplicate load/i,
    allowed: /data engineering|zoomcamp|pandas|warehouse/i,
  },
  {
    task: /airflow|dag|backfill|scheduled|schedule|retry|alert hook|orchestrat/i,
    allowed: /airflow|data engineering|zoomcamp/i,
  },
  {
    task: /aws|iam|ec2|rds|s3|cloudwatch|cloudtrail|guardduty|security hub|alb|billing|budget|mfa|vpc|subnet|nacl/i,
    allowed: /aws|cloud|well.architected|vpc|iam/i,
  },
  {
    task: /terraform|iac|remote state|dynamodb lock|provider config|module|terraform apply|state in git/i,
    allowed: /terraform|hashicorp|infrastructure as code/i,
  },
  {
    task: /kubernetes|k8s|serviceaccount|rolebinding|networkpolic|pod security|sealed-secret|eso|ingress|prometheus|grafana|loki/i,
    allowed: /kubernetes|k8s|prometheus|grafana|platform/i,
  },
  {
    task: /threat|stride|dfd|trust boundar|owasp|security|devsecops|semgrep|bandit|trivy|gitleaks|sbom|syft|sarif|sca|sast/i,
    allowed: /security|devsecops|threat|owasp|semgrep|trivy|gitleaks/i,
  },
  {
    task: /machine learning|\bml\b|model|prediction|shap|feature|training|inference|baseline|leakage|forecast|mlflow|registry|experiment|drift|retrain/i,
    allowed: /machine learning|mlflow|mlops|model|scikit/i,
  },
  {
    task: /rag|embedding|pgvector|retrieval|citation|chunk|streaming|semantic search|chat history|grounded answer|mcp server|llm-as-judge|multimodal/i,
    allowed: /rag|llm|langchain|pgvector|mcp|hugging face/i,
  },
  {
    task: /prompt injection|pii|guardrail|red-team|red team|grounding verification|ai safety|safety gateway|redaction/i,
    allowed: /ai safety|owasp|llm|red team|prompt injection/i,
  },
  {
    task: /rust|clap|secret scanner|entropy|secscan|integrity-agent|artifact integrity/i,
    allowed: /rust|security|systems/i,
  },
  {
    task: /java|spring|ledger posting|workflow entities/i,
    allowed: /java|spring/i,
  },
  {
    task: /c\+\+|c firmware|cmake|uart|sensor loop|machine simulator|fault injection/i,
    allowed: /c\+\+|cmake|systems|firmware/i,
  },
  {
    task: /kotlin|android|offline field app|sync queue/i,
    allowed: /kotlin|android/i,
  },
  {
    task: /c#|dotnet|\.net|excel import validator|excel validator/i,
    allowed: /c#|dotnet|\.net|microsoft/i,
  },
  {
    task: /php|laravel|supplier portal/i,
    allowed: /php|laravel/i,
  },
  {
    task: /langgraph|agent|supervisor|human approval|tool executor|langsmith|langfuse|side-effect tool|multi-tool/i,
    allowed: /langgraph|agent|mcp|langsmith/i,
  },
];

const PYTHON_TEMPLATE_TASK =
  /production python template:.*pyproject.*ruff.*mypy.*pytest.*ci skeleton/i;

function getTaskText(host: HTMLElement) {
  return (
    host.parentElement
      ?.querySelector<HTMLButtonElement>(":scope > button")
      ?.textContent?.trim() ?? ""
  );
}

function stabilizeVideo(host: HTMLElement, task: string) {
  const details = host.querySelector<HTMLElement>(".nexus-task-learning");
  const video = details?.querySelector<HTMLElement>(".nexus-task-video");
  if (!video) return;

  const title = video.querySelector("iframe")?.title ?? "";
  const rule = MEDIA_RULES.find((candidate) => candidate.task.test(task));
  if (rule && title && !rule.allowed.test(title)) return;

  video.hidden = false;
  video.classList.remove("nexus-task-video");
  video.classList.add("nexus-stable-video");
  video.dataset.nexusStableVideo = "true";
}

function createPythonCourseCard() {
  const link = document.createElement("a");
  link.className =
    "nexus-task-resource-card nexus-placement-exact nexus-stable-course-card";
  link.dataset.nexusStableCourse = "python";
  link.href = "https://cs50.harvard.edu/python/";
  link.target = "_blank";
  link.rel = "noreferrer";
  link.innerHTML =
    '<span class="nexus-task-resource-kind">Course</span><strong></strong><p></p><small></small>';
  link.querySelector("strong")!.textContent =
    "CS50’s Introduction to Programming with Python";
  link.querySelector("p")!.textContent =
    "Use the structured course for the broader Python concepts, then use the focused references for packaging, Ruff, mypy, pytest, and CI.";
  link.querySelector("small")!.textContent = "Harvard CS50";
  return link;
}

function ensurePythonCourse(host: HTMLElement, task: string) {
  if (!PYTHON_TEMPLATE_TASK.test(task)) return;

  const grid = host.querySelector<HTMLElement>(".nexus-task-resource-grid");
  if (!grid?.dataset.nexusExactSignature) return;

  const existing = grid.querySelector<HTMLAnchorElement>(
    '[data-nexus-stable-course="python"]',
  );
  if (existing) {
    existing.hidden = false;
    return;
  }

  grid.prepend(createPythonCourseCard());
}

function stabilizeHost(host: HTMLElement) {
  const task = getTaskText(host);
  if (!task) return;
  stabilizeVideo(host, task);
  ensurePythonCourse(host, task);
}

export default function NexusStableMedia() {
  useEffect(() => {
    const shell = document.getElementById("nexus-log-shell");
    if (!shell) return;

    const stabilizeAll = () => {
      shell
        .querySelectorAll<HTMLElement>(".nexus-task-resource-host")
        .forEach(stabilizeHost);
    };

    const observer = new MutationObserver((mutations) => {
      const hasAddedContent = mutations.some(
        (mutation) => mutation.addedNodes.length > 0,
      );
      if (hasAddedContent) stabilizeAll();
    });

    observer.observe(shell, { childList: true, subtree: true });
    stabilizeAll();

    return () => observer.disconnect();
  }, []);

  return null;
}

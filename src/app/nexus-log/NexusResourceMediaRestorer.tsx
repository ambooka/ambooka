"use client";

import { useEffect } from "react";

type MediaRule = {
  task: RegExp;
  allowed: RegExp;
};

const MEDIA_RULES: MediaRule[] = [
  { task: /python|pyproject|ruff|mypy|pytest|coverage|typing|package|pip install|python-toolkit|cli|json|csv converter|hash checker|bulk rename|file search|log cleaner/i, allowed: /python|cs50p|packaging|pytest|mypy|ruff/i },
  { task: /hashmap|hash map|heap|graph|bfs|dfs|dijkstra|algorithm|complexity|benchmark/i, allowed: /algorithm|data structure|cs50|visualgo/i },
  { task: /postgres|sql|schema|query|index|explain|database|warehouse|materialised|fact|dimension/i, allowed: /postgres|sql|database|data engineering/i },
  { task: /ssh|ufw|fail2ban|vps|linux|server lockdown|bastion|deploy user|bootstrap/i, allowed: /linux|ubuntu|openssh|ssh|missing semester|server/i },
  { task: /docker|compose|container|dockerfile/i, allowed: /docker|compose|container/i },
  { task: /fastapi|openapi|crud|api|route|endpoint|pagination|validation|requisition|integration test|seed script/i, allowed: /fastapi|openapi|pydantic|sqlalchemy|api/i },
  { task: /next\.js|nextjs|typescript|react|frontend|dashboard|ui|sidebar|layout|form|table|mobile|responsive|loading state|error boundar|approval queue/i, allowed: /next|typescript|react|frontend|accessibility/i },
  { task: /etl|messy|csv|excel|cleaner|transform|normalis|data quality|bad-record|quarantine|load summary|analytics warehouse|duplicate load/i, allowed: /data engineering|zoomcamp|pandas|warehouse/i },
  { task: /airflow|dag|backfill|scheduled|schedule|retry|alert hook|orchestrat/i, allowed: /airflow|data engineering|zoomcamp/i },
  { task: /aws|iam|ec2|rds|s3|cloudwatch|cloudtrail|guardduty|security hub|alb|billing|budget|mfa|vpc|subnet|nacl/i, allowed: /aws|cloud|well.architected|vpc|iam/i },
  { task: /terraform|iac|remote state|dynamodb lock|provider config|module|terraform apply|state in git/i, allowed: /terraform|hashicorp|infrastructure as code/i },
  { task: /kubernetes|k8s|serviceaccount|rolebinding|networkpolic|pod security|sealed-secret|eso|ingress|prometheus|grafana|loki/i, allowed: /kubernetes|k8s|prometheus|grafana|platform/i },
  { task: /threat|stride|dfd|trust boundar|owasp|security|devsecops|semgrep|bandit|trivy|gitleaks|sbom|syft|sarif|sca|sast/i, allowed: /security|devsecops|threat|owasp|semgrep|trivy|gitleaks/i },
  { task: /machine learning|\bml\b|model|prediction|shap|feature|training|inference|baseline|leakage|forecast|mlflow|registry|experiment|drift|retrain/i, allowed: /machine learning|mlflow|mlops|model|scikit/i },
  { task: /rag|embedding|pgvector|retrieval|citation|chunk|streaming|semantic search|chat history|grounded answer|mcp server|llm-as-judge|multimodal/i, allowed: /rag|llm|langchain|pgvector|mcp|hugging face/i },
  { task: /prompt injection|pii|guardrail|red-team|red team|grounding verification|ai safety|safety gateway|redaction/i, allowed: /ai safety|owasp|llm|red team|prompt injection/i },
  { task: /rust|clap|secret scanner|entropy|secscan|integrity-agent|artifact integrity/i, allowed: /rust|security|systems/i },
  { task: /java|spring|ledger posting|workflow entities/i, allowed: /java|spring/i },
  { task: /c\+\+|c firmware|cmake|uart|sensor loop|machine simulator|fault injection/i, allowed: /c\+\+|cmake|systems|firmware/i },
  { task: /kotlin|android|offline field app|sync queue/i, allowed: /kotlin|android/i },
  { task: /c#|dotnet|\.net|excel import validator|excel validator/i, allowed: /c#|dotnet|\.net|microsoft/i },
  { task: /php|laravel|supplier portal/i, allowed: /php|laravel/i },
  { task: /langgraph|agent|supervisor|human approval|tool executor|langsmith|langfuse|side-effect tool|multi-tool/i, allowed: /langgraph|agent|mcp|langsmith/i },
];

const PYTHON_TEMPLATE_TASK = /production python template:.*pyproject.*ruff.*mypy.*pytest.*ci skeleton/i;
const CS50P_URL = "https://cs50.harvard.edu/python/";
const CS50P_VIDEO_URL = "https://www.youtube.com/watch?v=nLRL_NcnK-4";
const CS50P_EMBED_URL = "https://www.youtube-nocookie.com/embed/nLRL_NcnK-4";

function taskText(host: HTMLElement) {
  return (
    host.parentElement
      ?.querySelector<HTMLButtonElement>(":scope > button")
      ?.textContent?.trim() ?? ""
  );
}

function resourceKind(card: HTMLAnchorElement) {
  return (
    card.querySelector<HTMLElement>(".nexus-task-resource-kind")?.textContent ??
    ""
  ).toLowerCase();
}

function createCourseCard() {
  const link = document.createElement("a");
  link.className =
    "nexus-task-resource-card nexus-placement-exact nexus-media-restored-card";
  link.dataset.nexusMediaKey = "python-course";
  link.href = CS50P_URL;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.innerHTML =
    '<span class="nexus-task-resource-kind">Course</span><strong></strong><p></p><small></small>';
  link.querySelector("strong")!.textContent =
    "CS50’s Introduction to Programming with Python";
  link.querySelector("p")!.textContent =
    "Use this as the structured Python course behind the sprint. For this task, focus on testing, file structure, exceptions, and the final-project workflow, while using the tool-specific references for Ruff, mypy, pytest, and packaging.";
  link.querySelector("small")!.textContent = "Harvard CS50";
  return link;
}

function createVideoBlock() {
  const block = document.createElement("div");
  block.className = "nexus-task-video nexus-media-restored-video";
  block.dataset.nexusMediaKey = "python-video";

  const head = document.createElement("div");
  head.className = "nexus-task-video-head";

  const label = document.createElement("span");
  label.textContent = "Watch guided Python course";

  const external = document.createElement("a");
  external.href = CS50P_VIDEO_URL;
  external.target = "_blank";
  external.rel = "noreferrer";
  external.textContent = "Open on YouTube";

  const frame = document.createElement("iframe");
  frame.src = CS50P_EMBED_URL;
  frame.title = "CS50P full course on YouTube";
  frame.loading = "lazy";
  frame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen = true;

  head.append(label, external);
  block.append(head, frame);
  return block;
}

function restoreExistingMedia(
  details: HTMLElement,
  grid: HTMLElement,
  allowed: RegExp,
) {
  const cards = Array.from(
    grid.querySelectorAll<HTMLAnchorElement>(
      ".nexus-task-resource-card:not(.nexus-media-restored-card)",
    ),
  );

  let courseRestored = false;
  let watchRestored = false;

  cards.forEach((card) => {
    const kind = resourceKind(card);
    if (kind !== "course" && kind !== "watch") return;
    const content = card.textContent ?? "";
    if (!allowed.test(content)) return;

    if (kind === "course" && !courseRestored) {
      card.hidden = false;
      courseRestored = true;
    } else if (kind === "watch" && !watchRestored) {
      card.hidden = false;
      watchRestored = true;
    }
  });

  const video = details.querySelector<HTMLElement>(".nexus-task-video");
  const videoTitle = video?.querySelector("iframe")?.title ?? "";
  if (video && videoTitle && allowed.test(videoTitle)) {
    video.hidden = false;
  }
}

function restorePythonTemplateMedia(details: HTMLElement, grid: HTMLElement) {
  let course = grid.querySelector<HTMLAnchorElement>(
    '[data-nexus-media-key="python-course"]',
  );
  if (!course) {
    course = createCourseCard();
    grid.prepend(course);
  }
  course.hidden = false;

  let video = details.querySelector<HTMLElement>(
    '[data-nexus-media-key="python-video"]',
  );
  if (!video) {
    video = createVideoBlock();
    grid.before(video);
  }
  video.hidden = false;

  const summary = details.querySelector<HTMLElement>(
    ".nexus-task-learning-summary small",
  );
  if (summary) {
    const progress =
      summary.textContent?.match(/self-check\s+\d+\/3/i)?.[0] ??
      "self-check 0/3";
    summary.textContent = `Video + course + focused references · ${progress}`;
  }
}

function restoreHost(host: HTMLElement) {
  const task = taskText(host);
  const details = host.querySelector<HTMLElement>(".nexus-task-learning");
  const grid = details?.querySelector<HTMLElement>(
    ".nexus-task-resource-grid",
  );
  if (!task || !details || !grid) return;

  const rule = MEDIA_RULES.find((candidate) => candidate.task.test(task));
  if (rule) restoreExistingMedia(details, grid, rule.allowed);

  if (PYTHON_TEMPLATE_TASK.test(task)) {
    restorePythonTemplateMedia(details, grid);
  }
}

export default function NexusResourceMediaRestorer() {
  useEffect(() => {
    const shell = document.getElementById("nexus-log-shell");
    if (!shell) return;

    let frame = 0;
    const restore = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        shell
          .querySelectorAll<HTMLElement>(".nexus-task-resource-host")
          .forEach(restoreHost);
      });
    };

    const observer = new MutationObserver(restore);
    observer.observe(shell, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    restore();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  GraduationCap,
  ListChecks,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { NEXUS_LOG_ENTRIES, type LogEntry } from "@/data/nexus-log-data";
import {
  getNexusStudyPlan,
  type NexusResourceKind,
  type NexusStudyResource,
} from "./resources/plans";

type TaskSection = "days" | "deliverables" | "dod" | "tasks";

type TaskDescriptor = {
  key: string;
  entryId: string;
  section: TaskSection;
  index: number;
  text: string;
  label: string;
};

type PortalHost = {
  key: string;
  element: HTMLDivElement;
  task: TaskDescriptor;
};

type TaskAssessment = {
  checks: boolean[];
  reflection: string;
};

type ContextRule = {
  test: RegExp;
  resources: NexusStudyResource[];
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "before",
  "by",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "or",
  "the",
  "to",
  "via",
  "with",
  "your",
]);

const ASSESSMENT_LABELS = [
  "I can explain the concept in my own words",
  "I can apply it without copying the walkthrough",
  "I can verify the result and explain failures",
];

function resource(
  title: string,
  kind: NexusResourceKind,
  source: string,
  url: string,
  description: string,
): NexusStudyResource {
  return { title, kind, source, url, description };
}

const CONTEXT_RULES: ContextRule[] = [
  {
    test: /ssh|ufw|fail2ban|vps|linux|server lockdown|bastion/i,
    resources: [
      resource(
        "Ubuntu Server documentation",
        "Reference",
        "Canonical",
        "https://documentation.ubuntu.com/server/",
        "Authoritative server administration, networking, OpenSSH, firewall, storage, and security guidance.",
      ),
      resource(
        "OpenSSH manuals",
        "Reference",
        "OpenBSD",
        "https://www.openssh.com/manual.html",
        "Use the primary manuals when configuring keys, clients, servers, forwarding, and secure SSH access.",
      ),
    ],
  },
  {
    test: /pyproject|ruff|mypy|pytest|coverage|typing|package|pip install/i,
    resources: [
      resource(
        "Python Packaging User Guide",
        "Reference",
        "Python Packaging Authority",
        "https://packaging.python.org/en/latest/",
        "Project structure, pyproject.toml, builds, dependencies, distribution, and reproducible packaging.",
      ),
      resource(
        "mypy documentation",
        "Reference",
        "mypy",
        "https://mypy.readthedocs.io/en/stable/",
        "Strict typing configuration, annotations, generics, narrowing, and common error patterns.",
      ),
    ],
  },
  {
    test: /cli|json|csv|hash checker|bulk rename|file search|log cleaner|pathlib|argparse/i,
    resources: [
      resource(
        "Python standard library",
        "Reference",
        "Python",
        "https://docs.python.org/3/library/",
        "Primary reference for argparse, pathlib, csv, json, hashlib, logging, subprocess, and file operations.",
      ),
    ],
  },
  {
    test: /hashmap|hash map|heap|graph|bfs|dfs|dijkstra|algorithm|complexity|benchmark/i,
    resources: [
      resource(
        "VisuAlgo",
        "Practice",
        "National University of Singapore",
        "https://visualgo.net/en",
        "Interactive visualizations for data structures, graph traversal, shortest paths, and complexity.",
      ),
    ],
  },
  {
    test: /https|tls|certificate|let'?s encrypt|reverse proxy|nginx/i,
    resources: [
      resource(
        "Let’s Encrypt documentation",
        "Reference",
        "Internet Security Research Group",
        "https://letsencrypt.org/docs/",
        "Certificate issuance, renewal, challenge types, rate limits, and HTTPS operational guidance.",
      ),
    ],
  },
  {
    test: /readme|case study|architecture note|resume|portfolio|demo video|diagram/i,
    resources: [
      resource(
        "About READMEs",
        "Reference",
        "GitHub",
        "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
        "Structure project documentation so setup, purpose, evidence, limitations, and usage are immediately clear.",
      ),
    ],
  },
  {
    test: /idempotency|webhook|duplicate|state machine|audit trail|ledger/i,
    resources: [
      resource(
        "HTTP Semantics",
        "Read",
        "IETF / RFC Editor",
        "https://www.rfc-editor.org/rfc/rfc9110",
        "Primary HTTP semantics for safe and idempotent operations, methods, status codes, and request behavior.",
      ),
    ],
  },
  {
    test: /accessibility|loading state|error boundary|responsive|mobile|form|table|dashboard/i,
    resources: [
      resource(
        "Web Content Accessibility Guidelines",
        "Reference",
        "W3C",
        "https://www.w3.org/WAI/standards-guidelines/wcag/",
        "Use the accessibility standard while implementing navigation, forms, errors, focus, contrast, and responsive interfaces.",
      ),
    ],
  },
  {
    test: /threat|stride|owasp|authentication|authorization|jwt|rbac|abac|secret/i,
    resources: [
      resource(
        "OWASP Cheat Sheet Series",
        "Reference",
        "OWASP",
        "https://cheatsheetseries.owasp.org/",
        "Practical, reviewable security guidance for authentication, authorization, sessions, secrets, APIs, and threat controls.",
      ),
    ],
  },
  {
    test: /security\s*\+|saa-c03|certification|exam/i,
    resources: [
      resource(
        "Retrieval practice study method",
        "Practice",
        "The Learning Scientists",
        "https://www.learningscientists.org/retrieval-practice",
        "Use active recall, spaced practice, and error review rather than passive rereading during certification study.",
      ),
    ],
  },
];

const RESOURCE_ALIASES: Array<{ task: RegExp; resource: RegExp; bonus: number }> = [
  { task: /sql|postgres|schema|index|query|warehouse|materialised|database/i, resource: /postgres|sql|alembic|sqlalchemy|dimensional|dbt/i, bonus: 9 },
  { task: /fastapi|api|openapi|crud|route|endpoint|pagination|validation/i, resource: /fastapi|openapi|pydantic|sqlalchemy/i, bonus: 9 },
  { task: /docker|compose|container/i, resource: /docker|container/i, bonus: 10 },
  { task: /github action|ci|pipeline|deploy/i, resource: /github actions|ci|deployment/i, bonus: 8 },
  { task: /next|typescript|react|frontend|dashboard|ui/i, resource: /next|typescript|react|shadcn/i, bonus: 9 },
  { task: /pdf|document|invoice|statement|purchase order|delivery note/i, resource: /weasyprint|pdf|pydantic|pymupdf/i, bonus: 9 },
  { task: /etl|csv|excel|clean|transform|data quality/i, resource: /data engineering|pandas|airflow|warehouse/i, bonus: 9 },
  { task: /airflow|dag|backfill|schedule|retry/i, resource: /airflow/i, bonus: 12 },
  { task: /aws|vpc|iam|ec2|rds|s3|cloudwatch|guardduty|security hub/i, resource: /aws|well-architected|vpc|iam|rds/i, bonus: 10 },
  { task: /terraform|iac|remote state|module/i, resource: /terraform|hashicorp/i, bonus: 12 },
  { task: /kubernetes|k8s|rbac|networkpolic|pod security|ingress|prometheus/i, resource: /kubernetes|rbac|network|pod|prometheus/i, bonus: 10 },
  { task: /semgrep|bandit|trivy|gitleaks|sbom|syft|sarif|sca|sast/i, resource: /semgrep|trivy|gitleaks|syft|security|sarif/i, bonus: 11 },
  { task: /model|ml|prediction|shap|feature|training|inference/i, resource: /machine learning|scikit|model|shap|mlflow|fastapi/i, bonus: 9 },
  { task: /registry|experiment|promotion|rollback|lineage/i, resource: /mlflow|registry|experiment/i, bonus: 12 },
  { task: /drift|retrain|evaluation gate/i, resource: /evidently|mlflow|airflow|machine learning/i, bonus: 12 },
  { task: /rag|embedding|pgvector|retrieval|citation|chunk|streaming|mcp/i, resource: /rag|llm|langchain|pgvector|mcp/i, bonus: 11 },
  { task: /prompt injection|pii|guardrail|red.team|grounding|ai safety/i, resource: /owasp|nist|presidio|pyrit|safety/i, bonus: 11 },
  { task: /rust|secret scanner|entropy|integrity/i, resource: /rust|gitleaks|sarif/i, bonus: 11 },
  { task: /java|spring|ledger posting/i, resource: /spring|java/i, bonus: 11 },
  { task: /c\+\+|c firmware|cmake|simulator|uart/i, resource: /c\+\+|cmake|beej/i, bonus: 11 },
  { task: /kotlin|android/i, resource: /kotlin|android/i, bonus: 11 },
  { task: /c#|dotnet|\.net/i, resource: /c#|dotnet|\.net/i, bonus: 11 },
  { task: /php|laravel/i, resource: /laravel|php/i, bonus: 11 },
  { task: /langgraph|agent|supervisor|human approval|langsmith/i, resource: /langgraph|mcp|langsmith|pyrit/i, bonus: 11 },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim();
}

function tokens(value: string) {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function buildTasks(entry: LogEntry): TaskDescriptor[] {
  const make = (section: TaskSection, values: string[], label: string) =>
    values.map((text, index) => ({
      key: `${entry.id}:${section}:${index}`,
      entryId: entry.id,
      section,
      index,
      text,
      label: section === "days" ? `Day ${index + 1}` : `${label} ${index + 1}`,
    }));

  if (entry.kind === "deload") {
    return make("tasks", entry.tasks, "Task");
  }

  return [
    ...make("days", entry.days, "Day"),
    ...make("deliverables", entry.deliverables, "Deliverable"),
    ...make("dod", entry.dod, "Verification"),
  ];
}

function scoreResource(
  resource: NexusStudyResource,
  task: TaskDescriptor,
  position: number,
) {
  const taskTokens = tokens(task.text);
  const haystack = normalize(
    `${resource.title} ${resource.source} ${resource.description}`,
  );
  let score = taskTokens.reduce(
    (total, token) => total + (haystack.includes(token) ? 3 : 0),
    0,
  );

  RESOURCE_ALIASES.forEach((alias) => {
    if (alias.task.test(task.text) && alias.resource.test(haystack)) {
      score += alias.bonus;
    }
  });

  if (task.section === "days" || task.section === "tasks") {
    if (resource.kind === "Watch") score += 3;
    if (resource.kind === "Course") score += 2;
  }
  if (task.section === "deliverables" && resource.kind === "Reference") {
    score += 3;
  }
  if (task.section === "dod" && resource.kind === "Practice") score += 5;
  if (task.section === "dod" && resource.kind === "Reference") score += 3;

  // Rotate equally relevant resources so adjacent rows do not repeat the same card.
  score += Math.max(0, 1.5 - Math.abs(position - (task.index % 4)) * 0.35);
  return score;
}

function uniqueResources(resources: NexusStudyResource[]) {
  const seen = new Set<string>();
  return resources.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function getTaskResources(task: TaskDescriptor) {
  const plan = getNexusStudyPlan(task.entryId);
  const contextual = CONTEXT_RULES.filter((rule) => rule.test.test(task.text)).flatMap(
    (rule) => rule.resources,
  );
  const candidates = uniqueResources([...contextual, ...plan.resources]);
  const ranked = candidates
    .map((item, position) => ({
      item,
      score: scoreResource(item, task, position),
    }))
    .sort((a, b) => b.score - a.score);

  const selected: NexusStudyResource[] = [];
  const add = (item?: NexusStudyResource) => {
    if (item && !selected.some((resourceItem) => resourceItem.url === item.url)) {
      selected.push(item);
    }
  };

  const primaryLearning = ranked.find(
    ({ item, score }) =>
      (item.kind === "Watch" || item.kind === "Course") && score >= 4,
  );
  const primaryReference = ranked.find(({ item }) =>
    item.kind === "Read" || item.kind === "Reference",
  );
  const practice = ranked.find(({ item }) => item.kind === "Practice");

  if (task.section === "days" || task.section === "tasks") {
    add(primaryLearning?.item);
  }
  add(ranked[0]?.item);
  add(primaryReference?.item);
  if (task.section === "dod") add(practice?.item);
  ranked.forEach(({ item }) => {
    if (selected.length < 3) add(item);
  });

  return {
    focus: plan.focus,
    resources: selected.slice(0, 3),
  };
}

function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
      const playlist = parsed.searchParams.get("list");
      if (playlist) {
        return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlist}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function iconFor(kind: NexusResourceKind) {
  if (kind === "Watch") return <PlayCircle size={16} />;
  if (kind === "Course") return <GraduationCap size={16} />;
  if (kind === "Read") return <BookOpen size={16} />;
  if (kind === "Practice") return <ListChecks size={16} />;
  return <FileText size={16} />;
}

function loadAssessment(storageKey: string): TaskAssessment {
  if (typeof window === "undefined") return { checks: [false, false, false], reflection: "" };
  try {
    const value = window.localStorage.getItem(storageKey);
    if (!value) return { checks: [false, false, false], reflection: "" };
    const parsed = JSON.parse(value) as Partial<TaskAssessment>;
    return {
      checks: Array.isArray(parsed.checks)
        ? [0, 1, 2].map((index) => Boolean(parsed.checks?.[index]))
        : [false, false, false],
      reflection: typeof parsed.reflection === "string" ? parsed.reflection : "",
    };
  } catch {
    return { checks: [false, false, false], reflection: "" };
  }
}

function TaskLearningBlock({ task }: { task: TaskDescriptor }) {
  const learning = useMemo(() => getTaskResources(task), [task]);
  const storageKey = `nexus-learning:${task.key}`;
  const [assessment, setAssessment] = useState<TaskAssessment>(() =>
    loadAssessment(storageKey),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(assessment));
    } catch {
      // Progress persistence is an enhancement; the tracker remains usable without it.
    }
  }, [assessment, storageKey]);

  const video = learning.resources.find((item) => {
    return item.kind === "Watch" && youtubeEmbedUrl(item.url);
  });
  const embedUrl = video ? youtubeEmbedUrl(video.url) : null;
  const completedChecks = assessment.checks.filter(Boolean).length;

  return (
    <details
      className="nexus-task-learning"
      open={task.index === 0 && (task.section === "days" || task.section === "tasks")}
    >
      <summary>
        <span className="nexus-task-learning-icon">
          <Sparkles size={15} />
        </span>
        <span className="nexus-task-learning-summary">
          <strong>Learn before executing</strong>
          <small>
            {learning.resources[0]?.title ?? "Contextual study material"} · self-check {completedChecks}/3
          </small>
        </span>
        <ChevronDown className="nexus-task-learning-chevron" size={17} />
      </summary>

      <div className="nexus-task-learning-body">
        <div className="nexus-task-learning-intro">
          <span>{task.label}</span>
          <p>{learning.focus}</p>
        </div>

        {embedUrl && video && (
          <div className="nexus-task-video">
            <div className="nexus-task-video-head">
              <span>
                <PlayCircle size={16} /> Watch here
              </span>
              <a href={video.url} target="_blank" rel="noreferrer">
                Open on YouTube <ExternalLink size={13} />
              </a>
            </div>
            <iframe
              src={embedUrl}
              title={`${task.label}: ${video.title}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        <div className="nexus-task-resource-grid">
          {learning.resources.map((item) => (
            <a
              className="nexus-task-resource-card"
              href={item.url}
              target="_blank"
              rel="noreferrer"
              key={`${task.key}:${item.url}`}
            >
              <span className="nexus-task-resource-kind">
                {iconFor(item.kind)} {item.kind}
              </span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <small>
                {item.source} <ExternalLink size={12} />
              </small>
            </a>
          ))}
        </div>

        <div className="nexus-task-assessment">
          <div className="nexus-task-assessment-head">
            <div>
              <strong>Quick understanding check</strong>
              <span>Do this before marking the task complete.</span>
            </div>
            <b>{completedChecks}/3</b>
          </div>
          <div className="nexus-task-checks">
            {ASSESSMENT_LABELS.map((label, index) => (
              <button
                type="button"
                className={assessment.checks[index] ? "is-checked" : ""}
                onClick={() =>
                  setAssessment((current) => ({
                    ...current,
                    checks: current.checks.map((checked, checkIndex) =>
                      checkIndex === index ? !checked : checked,
                    ),
                  }))
                }
                key={label}
              >
                <span>{assessment.checks[index] && <Check size={13} />}</span>
                {label}
              </button>
            ))}
          </div>
          <label className="nexus-task-reflection">
            <span>What did you learn, and what is still unclear?</span>
            <textarea
              value={assessment.reflection}
              onChange={(event) =>
                setAssessment((current) => ({
                  ...current,
                  reflection: event.target.value,
                }))
              }
              placeholder="Write a short explanation in your own words…"
              rows={3}
            />
          </label>
        </div>
      </div>
    </details>
  );
}

function findTaskButton(
  main: HTMLElement,
  task: TaskDescriptor,
  used: Set<HTMLButtonElement>,
) {
  const taskText = normalize(task.text);
  return Array.from(main.querySelectorAll<HTMLButtonElement>("button")).find(
    (button) => {
      if (used.has(button)) return false;
      const buttonText = normalize(button.textContent ?? "");
      return buttonText.includes(taskText);
    },
  );
}

export default function NexusResources() {
  const [hosts, setHosts] = useState<PortalHost[]>([]);
  const hostsRef = useRef(new Map<string, PortalHost>());
  const signatureRef = useRef("");

  useEffect(() => {
    const shell = document.getElementById("nexus-log-shell");
    if (!shell) return;

    let frame = 0;
    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const main = shell.querySelector<HTMLElement>("main");
        const title = main?.querySelector("h1")?.textContent?.trim();
        if (!main || !title) return;

        const entry = NEXUS_LOG_ENTRIES.find(
          (item) => item.title.trim() === title,
        );
        if (!entry) return;

        const tasks = buildTasks(entry);
        const used = new Set<HTMLButtonElement>();
        const nextHosts: PortalHost[] = [];
        const activeKeys = new Set(tasks.map((task) => task.key));

        hostsRef.current.forEach((host, key) => {
          if (!activeKeys.has(key) || !host.element.isConnected) {
            host.element.remove();
            hostsRef.current.delete(key);
          }
        });

        tasks.forEach((task) => {
          const button = findTaskButton(main, task, used);
          if (!button) return;
          used.add(button);

          const parent = button.parentElement;
          if (!parent) return;

          let host = hostsRef.current.get(task.key);
          if (!host || !host.element.isConnected) {
            const element = document.createElement("div");
            element.className = "nexus-task-resource-host";
            element.dataset.taskKey = task.key;
            parent.appendChild(element);
            host = { key: task.key, element, task };
            hostsRef.current.set(task.key, host);
          }
          nextHosts.push(host);
        });

        const signature = nextHosts.map((host) => host.key).join("|");
        if (signature !== signatureRef.current) {
          signatureRef.current = signature;
          setHosts(nextHosts);
        }
      });
    };

    const observer = new MutationObserver(sync);
    observer.observe(shell, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    sync();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      hostsRef.current.forEach((host) => host.element.remove());
      hostsRef.current.clear();
    };
  }, []);

  return (
    <>
      {hosts.map((host) =>
        createPortal(
          <TaskLearningBlock task={host.task} />,
          host.element,
          host.key,
        ),
      )}
    </>
  );
}

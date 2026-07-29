"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Library,
  PlayCircle,
  Search,
  X,
} from "lucide-react";

type ResourceKind = "Video" | "Course" | "Notes" | "Book" | "Docs";

type StudyResource = {
  title: string;
  description: string;
  category: string;
  kind: ResourceKind;
  url: string;
  recommended?: boolean;
};

const RESOURCES: StudyResource[] = [
  {
    title: "Harvard CS50P — Full Python Course",
    description:
      "A complete Python foundation covering functions, testing, file I/O, regular expressions, OOP, and practical exercises.",
    category: "Foundation & engineering",
    kind: "Video",
    url: "https://www.youtube.com/watch?v=nLRL_NcnK-4",
    recommended: true,
  },
  {
    title: "MIT Missing Semester",
    description:
      "Shells, Git, debugging, profiling, data wrangling, security, and the developer tools most courses skip.",
    category: "Foundation & engineering",
    kind: "Video",
    url: "https://www.youtube.com/playlist?list=PLyzOVJj3bHQuloKGG59rS43e29ro7I57J",
    recommended: true,
  },
  {
    title: "Python Packaging User Guide",
    description:
      "Practical notes on pyproject.toml, packaging, dependency management, publishing, and reproducible Python projects.",
    category: "Foundation & engineering",
    kind: "Notes",
    url: "https://packaging.python.org/en/latest/",
  },
  {
    title: "PostgreSQL Tutorial",
    description:
      "Official PostgreSQL tutorial and reference material for schemas, queries, transactions, indexes, and administration.",
    category: "Foundation & engineering",
    kind: "Docs",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
  },
  {
    title: "FastAPI Tutorial",
    description:
      "Official step-by-step guide for typed APIs, validation, dependencies, authentication, testing, and deployment.",
    category: "Full-stack & APIs",
    kind: "Course",
    url: "https://fastapi.tiangolo.com/tutorial/",
    recommended: true,
  },
  {
    title: "FastAPI Comprehensive Video Course",
    description:
      "A YouTube course search focused on FastAPI, PostgreSQL, authentication, testing, Docker, and deployment.",
    category: "Full-stack & APIs",
    kind: "Video",
    url: "https://www.youtube.com/results?search_query=freecodecamp+python+api+development+fastapi+comprehensive+course",
  },
  {
    title: "Next.js Learn",
    description:
      "Official hands-on Next.js learning path covering App Router, data fetching, authentication, accessibility, and deployment.",
    category: "Full-stack & APIs",
    kind: "Course",
    url: "https://nextjs.org/learn",
    recommended: true,
  },
  {
    title: "Full Stack Open",
    description:
      "University of Helsinki course notes and exercises for React, TypeScript, testing, containers, CI/CD, and relational databases.",
    category: "Full-stack & APIs",
    kind: "Course",
    url: "https://fullstackopen.com/en/",
  },
  {
    title: "Docker Get Started",
    description:
      "Official container fundamentals, image building, Compose, persistence, multi-container apps, and production concepts.",
    category: "Cloud, IaC & platform",
    kind: "Course",
    url: "https://docs.docker.com/get-started/",
  },
  {
    title: "AWS Skill Builder",
    description:
      "Official AWS digital training for cloud fundamentals, architecture, security, and Solutions Architect preparation.",
    category: "Cloud, IaC & platform",
    kind: "Course",
    url: "https://skillbuilder.aws/",
    recommended: true,
  },
  {
    title: "AWS Well-Architected Framework",
    description:
      "Architecture notes for operational excellence, security, reliability, performance, cost, and sustainability.",
    category: "Cloud, IaC & platform",
    kind: "Notes",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
  },
  {
    title: "Terraform Tutorials",
    description:
      "Official HashiCorp learning paths for providers, modules, state, variables, workspaces, testing, and cloud deployment.",
    category: "Cloud, IaC & platform",
    kind: "Course",
    url: "https://developer.hashicorp.com/terraform/tutorials",
    recommended: true,
  },
  {
    title: "Kubernetes Basics",
    description:
      "Official interactive lessons covering deployments, services, scaling, updates, debugging, and cluster concepts.",
    category: "Cloud, IaC & platform",
    kind: "Course",
    url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
  },
  {
    title: "Kubernetes Beginner Video Course",
    description:
      "A YouTube course search for a complete beginner-friendly Kubernetes walkthrough with hands-on container orchestration.",
    category: "Cloud, IaC & platform",
    kind: "Video",
    url: "https://www.youtube.com/results?search_query=freecodecamp+kubernetes+full+course+beginners",
  },
  {
    title: "PortSwigger Web Security Academy",
    description:
      "Hands-on labs for authentication, access control, SQL injection, XSS, SSRF, API testing, and modern web attacks.",
    category: "Security & DevSecOps",
    kind: "Course",
    url: "https://portswigger.net/web-security",
    recommended: true,
  },
  {
    title: "OWASP Web Security Testing Guide",
    description:
      "A structured testing reference for threat discovery, web application assessment, reporting, and verification.",
    category: "Security & DevSecOps",
    kind: "Book",
    url: "https://owasp.org/www-project-web-security-testing-guide/",
  },
  {
    title: "GitHub Actions Documentation",
    description:
      "Official CI/CD notes for workflows, reusable actions, environments, secrets, security hardening, and deployments.",
    category: "Security & DevSecOps",
    kind: "Docs",
    url: "https://docs.github.com/en/actions",
  },
  {
    title: "Data Engineering Zoomcamp",
    description:
      "Free project-driven course with videos and notes covering Docker, SQL, orchestration, warehouses, batch, streaming, and analytics.",
    category: "Data, ML & MLOps",
    kind: "Course",
    url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
  },
  {
    title: "Google Machine Learning Crash Course",
    description:
      "Video-backed lessons, visual explanations, quizzes, and exercises covering core ML and production ML systems.",
    category: "Data, ML & MLOps",
    kind: "Course",
    url: "https://developers.google.com/machine-learning/crash-course/",
    recommended: true,
  },
  {
    title: "scikit-learn MOOC",
    description:
      "Free Inria course with notebooks on model selection, preprocessing, pipelines, evaluation, and practical machine learning.",
    category: "Data, ML & MLOps",
    kind: "Course",
    url: "https://inria.github.io/scikit-learn-mooc/",
  },
  {
    title: "MLflow Documentation",
    description:
      "Tracking, model packaging, registries, evaluation, deployment, and lifecycle management for MLOps projects.",
    category: "Data, ML & MLOps",
    kind: "Docs",
    url: "https://mlflow.org/docs/latest/",
  },
  {
    title: "Hugging Face LLM Course",
    description:
      "Transformers, tokenizers, datasets, fine-tuning, demos, and practical NLP/LLM workflows with notebooks.",
    category: "RAG, LLMOps & agents",
    kind: "Course",
    url: "https://huggingface.co/learn/llm-course/chapter1/1",
    recommended: true,
  },
  {
    title: "LangChain Academy",
    description:
      "Courses on LangGraph, agent orchestration, memory, state, tools, deployment, observability, and production patterns.",
    category: "RAG, LLMOps & agents",
    kind: "Course",
    url: "https://academy.langchain.com/",
  },
  {
    title: "Model Context Protocol",
    description:
      "Official MCP concepts and implementation notes for resources, tools, prompts, clients, and servers.",
    category: "RAG, LLMOps & agents",
    kind: "Docs",
    url: "https://modelcontextprotocol.io/docs/getting-started/intro",
  },
  {
    title: "OpenAI Cookbook",
    description:
      "Practical examples for retrieval, structured outputs, tool use, evaluations, agents, embeddings, and production AI patterns.",
    category: "RAG, LLMOps & agents",
    kind: "Notes",
    url: "https://cookbook.openai.com/",
  },
  {
    title: "OWASP Top 10 for LLM Applications",
    description:
      "Threat categories and mitigation guidance for prompt injection, data leakage, insecure output handling, and agent risks.",
    category: "AI safety",
    kind: "Notes",
    url: "https://genai.owasp.org/llm-top-10/",
    recommended: true,
  },
  {
    title: "NIST AI RMF Playbook",
    description:
      "Action-oriented guidance for governing, mapping, measuring, and managing AI risks across the system lifecycle.",
    category: "AI safety",
    kind: "Book",
    url: "https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook",
  },
  {
    title: "The Rust Programming Language",
    description:
      "The official Rust book covering ownership, lifetimes, traits, concurrency, testing, unsafe Rust, and project structure.",
    category: "Systems & interviews",
    kind: "Book",
    url: "https://doc.rust-lang.org/book/",
    recommended: true,
  },
  {
    title: "Operating Systems: Three Easy Pieces",
    description:
      "A free systems book covering virtualization, concurrency, persistence, scheduling, memory, and file systems.",
    category: "Systems & interviews",
    kind: "Book",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
  },
  {
    title: "Dev.java Learning Paths",
    description:
      "Official Java lessons covering language fundamentals, collections, streams, concurrency, JVM tooling, and modern Java.",
    category: "Systems & interviews",
    kind: "Course",
    url: "https://dev.java/learn/",
  },
  {
    title: "System Design Primer",
    description:
      "Open notes, diagrams, interview questions, trade-offs, scalability patterns, databases, caching, and distributed systems.",
    category: "Systems & interviews",
    kind: "Notes",
    url: "https://github.com/donnemartin/system-design-primer",
  },
];

const KINDS: Array<"All" | ResourceKind> = [
  "All",
  "Video",
  "Course",
  "Notes",
  "Book",
  "Docs",
];

function iconFor(kind: ResourceKind) {
  if (kind === "Video") return <PlayCircle size={16} />;
  if (kind === "Book") return <BookOpen size={16} />;
  if (kind === "Notes" || kind === "Docs") return <FileText size={16} />;
  return <Library size={16} />;
}

export default function NexusResources() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return RESOURCES.filter((resource) => {
      const matchesKind = kind === "All" || resource.kind === kind;
      const matchesQuery =
        !term ||
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term) ||
        resource.category.toLowerCase().includes(term);
      return matchesKind && matchesQuery;
    });
  }, [kind, query]);

  const grouped = useMemo(() => {
    const result = new Map<string, StudyResource[]>();
    filtered.forEach((resource) => {
      const current = result.get(resource.category) ?? [];
      current.push(resource);
      result.set(resource.category, current);
    });
    return Array.from(result.entries());
  }, [filtered]);

  return (
    <>
      <button
        type="button"
        className="nexus-resource-trigger"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="nexus-resource-drawer"
      >
        <Library size={18} />
        <span>Study resources</span>
        <strong>{RESOURCES.length}</strong>
      </button>

      <button
        type="button"
        aria-label="Close study resources"
        className={`nexus-resource-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside
        id="nexus-resource-drawer"
        className={`nexus-resource-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Nexus study resources"
      >
        <div className="nexus-resource-header">
          <div>
            <div className="nexus-resource-eyebrow">NEXUS LIBRARY</div>
            <h2>Study resources</h2>
            <p>
              Courses, videos, notes, books, and official documentation mapped
              to the Nexus roadmap.
            </p>
          </div>
          <button
            type="button"
            className="nexus-resource-close"
            onClick={() => setOpen(false)}
            aria-label="Close study resources"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nexus-resource-controls">
          <label className="nexus-resource-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Python, AWS, security, RAG…"
            />
          </label>
          <div className="nexus-resource-filters" aria-label="Resource types">
            {KINDS.map((item) => (
              <button
                type="button"
                key={item}
                className={item === kind ? "is-active" : ""}
                onClick={() => setKind(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="nexus-resource-scroll">
          {grouped.length === 0 ? (
            <div className="nexus-resource-empty">
              No resources match this search.
            </div>
          ) : (
            grouped.map(([category, resources]) => (
              <section className="nexus-resource-group" key={category}>
                <div className="nexus-resource-group-title">
                  <span>{category}</span>
                  <small>{resources.length}</small>
                </div>
                <div className="nexus-resource-grid">
                  {resources.map((resource) => (
                    <a
                      key={`${resource.category}-${resource.title}`}
                      className="nexus-resource-card"
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="nexus-resource-card-top">
                        <span className="nexus-resource-kind">
                          {iconFor(resource.kind)}
                          {resource.kind}
                        </span>
                        {resource.recommended && (
                          <span className="nexus-resource-recommended">
                            Start here
                          </span>
                        )}
                        <ExternalLink size={15} />
                      </div>
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                    </a>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

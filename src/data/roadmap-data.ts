import {
    Clock,
    Award,
    Briefcase,
    Target,
    LucideIcon
} from 'lucide-react';

export interface RoadmapMetric {
    label: string;
    value: string;
    unit?: string;
    icon: LucideIcon;
    color: string;
}

export interface RoadmapTarget {
    label: string;
    value: string;
    detail: string;
}

export interface RoadmapPhase {
    id: string;
    title: string;
    duration: string;
    role: string;
    salary: string;
    focus: string;
    weeklyHours: string;
    keyDeliverable: string;
    tracks: { name: string; skills: string[] }[];
}

export interface RoadmapProject {
    id: number | string;
    title: string;
    description: string;
    stack: string | string[];
    status: string;
    phase: string;
    type?: string;
    completed?: boolean;
    url?: string;
}

export interface RoadmapData {
    executiveSummary: {
        title: string;
        subtitle: string;
        metrics: RoadmapMetric[];
        targets: RoadmapTarget[];
    };
    salaryProgression: { phase: string; role: string; range: string; color: string }[];
    phases: RoadmapPhase[];
    projects: RoadmapProject[];
    studyPlan: {
        daily: string;
        weeklyTarget: string;
        schedule: { day: string; focus: string; hours: number }[];
    };
}

export const ROADMAP_DATA: RoadmapData = {
    executiveSummary: {
        title: "AI / ML Engineer Career Roadmap",
        subtitle: "CS Graduate → AI/ML Engineer · Roadmap",
        metrics: [
            { label: "Total Duration", value: "26", unit: "Months", icon: Clock, color: "bg-blue-600" },
            { label: "Weekly Projects", value: "104", unit: "Total", icon: Target, color: "bg-green-600" },
            { label: "Certifications", value: "8+", unit: "Mapped", icon: Award, color: "bg-purple-600" },
            { label: "Portfolio Phases", value: "5", unit: "Phases", icon: Briefcase, color: "bg-orange-600" },
        ],
        targets: [
            { label: "Certifications", value: "8+", detail: "Phase-Mapped" },
            { label: "Entry Salary", value: "$120K-$160K", detail: "AI/ML Engineer" },
            { label: "Senior Salary", value: "$180K-$240K+", detail: "Senior AI Eng." },
            { label: "Job Growth", value: "35%+", detail: "Year-over-Year" }
        ]
    },
    salaryProgression: [
        { phase: "Phase 1–2: Engineering Core", role: "Software Engineer", range: "$60K - $100K", color: "bg-gray-400" },
        { phase: "Phase 3: Classical ML", role: "ML Engineer I", range: "$100K - $140K", color: "bg-blue-400" },
        { phase: "Phase 4: AI Engineering", role: "AI/ML Engineer", range: "$140K - $180K", color: "bg-purple-400" },
        { phase: "Phase 5: Agentic AI", role: "Senior AI Engineer", range: "$180K - $240K+", color: "bg-orange-400" },
    ],
    phases: [
        {
            id: "phase1",
            title: "Phase 1: Foundations & Tooling",
            duration: "Months 1–4",
            role: "Software Engineer (Building)",
            salary: "Portfolio Phase",
            focus: "Python mastery, Linux/VPS admin, Docker Compose, SQL, Git CI/CD",
            weeklyHours: "~20h",
            keyDeliverable: "Dockerised CLI + static HTTPS site on Hetzner VPS",
            tracks: [
                { name: "Python Core", skills: ["Python 3.12", "OOP", "Type Hints", "pytest", "Decorators", "Generators"] },
                { name: "Computer Science", skills: ["Algorithms", "Data Structures", "Big-O", "Design Patterns"] },
                { name: "Linux & VPS", skills: ["Bash Scripting", "SSH", "systemd", "UFW", "Nginx"] },
                { name: "Containers", skills: ["Docker", "Compose", "Multi-stage Builds", "GHCR"] },
                { name: "SQL & Git", skills: ["PostgreSQL", "JOINs", "Indexes", "GitHub Actions CI/CD"] }
            ]
        },
        {
            id: "phase2",
            title: "Phase 2: Web Engineering & Cloud",
            duration: "Months 5–11",
            role: "Full-Stack Engineer (Building)",
            salary: "Portfolio Phase",
            focus: "TypeScript, React, Node.js REST API, k3s Kubernetes, AWS Terraform",
            weeklyHours: "~25h",
            keyDeliverable: "Full-stack app on k3s + AWS Terraform + Prometheus",
            tracks: [
                { name: "TypeScript & React", skills: ["TS Type System", "React Hooks", "Zustand", "RTL"] },
                { name: "Node.js API", skills: ["Express", "OpenAPI", "JWT Auth", "BullMQ", "Redis"] },
                { name: "Kubernetes", skills: ["k3s", "Helm", "HPA", "Ingress", "RBAC", "PVCs"] },
                { name: "AWS & Terraform", skills: ["IAM", "EC2", "S3", "ECS", "Terraform Modules"] },
                { name: "Observability", skills: ["Prometheus", "Grafana", "Loki", "Alertmanager"] }
            ]
        },
        {
            id: "phase3",
            title: "Phase 3: Data Science & Classical ML",
            duration: "Months 12–17",
            role: "ML Engineer I (Building)",
            salary: "Portfolio Phase",
            focus: "Statistics, linear algebra, PyTorch, HuggingFace, FastAPI model serving",
            weeklyHours: "~25h",
            keyDeliverable: "FastAPI ML model API (HuggingFace + scikit-learn) on k3s",
            tracks: [
                { name: "Mathematics", skills: ["Linear Algebra", "Calculus / Gradients", "Statistics", "Probability"] },
                { name: "Classical ML", skills: ["scikit-learn Pipelines", "EDA", "Feature Engineering", "Optuna"] },
                { name: "Deep Learning", skills: ["PyTorch", "CNNs", "RNNs", "Transformers from scratch"] },
                { name: "HuggingFace", skills: ["Model Hub", "Tokenisers", "Trainer API", "Fine-tuning"] },
                { name: "MLOps Basics", skills: ["FastAPI Serving", "DVC", "SHAP / LIME", "Airflow"] }
            ]
        },
        {
            id: "phase4",
            title: "Phase 4: AI Engineering & MLOps",
            duration: "Months 18–23",
            role: "AI/ML Engineer (Target)",
            salary: "$120K–$180K",
            focus: "LLMs, RAG, LangChain, fine-tuning, MLflow, drift detection, evals",
            weeklyHours: "~25h",
            keyDeliverable: "RAG chatbot + prompt evals + retraining pipeline live",
            tracks: [
                { name: "Prompt Engineering", skills: ["Zero/Few-shot", "Chain-of-Thought", "ReAct", "LLM-as-Judge"] },
                { name: "LLM Engineering", skills: ["OpenAI/Anthropic APIs", "RAG (naive→advanced)", "pgvector", "LangChain LCEL"] },
                { name: "Fine-tuning", skills: ["QLoRA", "LoRA", "SFTTrainer", "HuggingFace Hub"] },
                { name: "MLOps", skills: ["MLflow", "TorchServe", "Feast", "Evidently", "Model Registry"] },
                { name: "LlamaIndex & Multimodal", skills: ["Document Q&A", "GPT-4V", "Guardrails AI"] }
            ]
        },
        {
            id: "phase5",
            title: "Phase 5: Agentic AI & Hardening",
            duration: "Months 24–26",
            role: "Senior AI Engineer (Goal)",
            salary: "$180K–$240K+",
            focus: "LangGraph, multi-agent systems, safety layers, red teaming",
            weeklyHours: "~20h",
            keyDeliverable: "Complete public AI platform at ambooka.dev → apply for roles",
            tracks: [
                { name: "Agent Architecture", skills: ["ReAct Loop", "LangGraph StateGraph", "Tool Use", "Memory"] },
                { name: "Multi-Agent", skills: ["Supervisor Pattern", "CrewAI", "AutoGen", "Agent Evals"] },
                { name: "Safety & Red Team", skills: ["Prompt Injection", "Guardrails v2", "OWASP LLM Top 10"] },
                { name: "Production", skills: ["Human-in-the-Loop", "Audit Logging", "Rate Limiting"] }
            ]
        }
    ],
    projects: [
        {
            id: 1,
            title: "The Toolbox",
            description: "Dockerised Python CLI + static HTTPS site on Hetzner VPS with GitHub Actions CI/CD.",
            stack: ["Python 3.12", "Docker Compose", "Nginx", "PostgreSQL", "GitHub Actions"],
            status: "In Progress",
            phase: "Phase 1",
            type: "Core"
        },
        {
            id: 2,
            title: "The Platform",
            description: "Full-stack TypeScript app on k3s Kubernetes with Terraform-managed AWS infrastructure and Prometheus monitoring.",
            stack: ["TypeScript", "React", "Node.js", "k3s", "Terraform", "Prometheus"],
            status: "Planned",
            phase: "Phase 2",
            type: "Core"
        },
        {
            id: 3,
            title: "Intelligence Layer",
            description: "FastAPI ML model API serving HuggingFace transformer and scikit-learn classifier with SHAP explanations.",
            stack: ["PyTorch", "HuggingFace", "FastAPI", "DVC", "scikit-learn"],
            status: "Planned",
            phase: "Phase 3",
            type: "Core"
        },
        {
            id: 4,
            title: "AI Platform",
            description: "RAG chatbot over a personal knowledge base with prompt evals, QLoRA fine-tuned model, and automated retraining pipeline.",
            stack: ["LangChain", "LlamaIndex", "pgvector", "MLflow", "Evidently"],
            status: "Planned",
            phase: "Phase 4",
            type: "Core"
        },
        {
            id: 5,
            title: "Complete AI Platform",
            description: "Autonomous research agent (LangGraph), multi-agent pipelines, safety layer, and red team report — live at ambooka.dev.",
            stack: ["LangGraph", "CrewAI", "Guardrails AI", "Triton", "AutoGen"],
            status: "Planned",
            phase: "Phase 5",
            type: "Core"
        }
    ],
    studyPlan: {
        daily: "1–2 Hours",
        weeklyTarget: "~20 Hours",
        schedule: [
            { day: "Mon", focus: "Study (6–7 am)", hours: 1 },
            { day: "Tue", focus: "Study (6–7 am)", hours: 1 },
            { day: "Wed", focus: "Study (6–7 am)", hours: 1 },
            { day: "Thu", focus: "Study (6–7 am)", hours: 1 },
            { day: "Fri", focus: "Study (6–7 am)", hours: 1 },
            { day: "Sat", focus: "Deep Work (8 am–12 pm)", hours: 4 },
            { day: "Sun", focus: "Review / Ship", hours: 2 }
        ]
    }
};

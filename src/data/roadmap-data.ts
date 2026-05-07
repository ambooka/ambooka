import { Clock, Award, Briefcase, Target, LucideIcon } from "lucide-react";

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
  salaryProgression: {
    phase: string;
    role: string;
    range: string;
    color: string;
  }[];
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
    title: "Professional Focus Areas",
    subtitle: "Software Engineering · IT Systems · Business Automation · Applied AI/ML",
    metrics: [
      {
        label: "Experience",
        value: "3+",
        unit: "Years",
        icon: Clock,
        color: "bg-blue-600",
      },
      {
        label: "Client Projects",
        value: "12+",
        unit: "Delivered",
        icon: Target,
        color: "bg-green-600",
      },
      {
        label: "Core Degree",
        value: "BSc",
        unit: "Computer Science",
        icon: Award,
        color: "bg-purple-600",
      },
      {
        label: "Field Support",
        value: "300+",
        unit: "Workers",
        icon: Briefcase,
        color: "bg-orange-600",
      },
    ],
    targets: [
      { label: "Core Role", value: "Software Engineer", detail: "Full-stack + backend" },
      { label: "Systems Strength", value: "IT Systems", detail: "Windows Server, AD, networks" },
      { label: "AI Direction", value: "Applied AI/ML", detail: "Computer vision and model APIs" },
      { label: "Market Edge", value: "Business Systems", detail: "ERP, payments, automation" },
    ],
  },
  salaryProgression: [
    { phase: "Software Engineering", role: "Full-Stack Developer", range: "Python · TypeScript · APIs", color: "bg-gray-400" },
    { phase: "Infrastructure", role: "IT Systems", range: "Windows Server · Networks · ERP", color: "bg-blue-400" },
    { phase: "Applied AI/ML", role: "AI/ML Engineering", range: "YOLO · OpenCV · PyTorch", color: "bg-purple-400" },
    { phase: "Production Strengthening", role: "AI/ML + Backend", range: "FastAPI · Docker · PostgreSQL", color: "bg-orange-400" },
  ],
  phases: [
    {
      id: "phase1",
      title: "Software Engineering",
      duration: "2022–Present",
      role: "Full-Stack Developer",
      salary: "Professional Experience",
      focus: "Python, TypeScript, React, Next.js, REST APIs, PostgreSQL, Redis, Docker and CI/CD",
      weeklyHours: "Ongoing",
      keyDeliverable: "Client applications, payment integrations, business dashboards and the ambooka.dev platform",
      tracks: [
        { name: "Frontend", skills: ["React", "Next.js", "Tailwind CSS", "Zustand"] },
        { name: "Backend", skills: ["Node.js", "Express", "FastAPI", "REST APIs", "OpenAPI"] },
        { name: "Data", skills: ["PostgreSQL", "Redis", "Supabase", "SQLite"] },
      ],
    },
    {
      id: "phase2",
      title: "IT Systems & Infrastructure",
      duration: "2023–Present",
      role: "IT Systems Practitioner",
      salary: "Company Operations",
      focus: "Windows Server, Active Directory, TCP/IP, VoIP, CCTV, biometrics, lab/network deployment and user support",
      weeklyHours: "Full-time / Applied",
      keyDeliverable: "Enterprise IT support, network rollout, Windows Server administration and operational systems support",
      tracks: [
        { name: "Enterprise Systems", skills: ["Windows Server", "Active Directory", "Group Policies", "User Lifecycle"] },
        { name: "Networking", skills: ["TCP/IP", "Switches", "Wireless APs", "VoIP"] },
        { name: "Operations", skills: ["CCTV", "Biometrics", "Helpdesk", "Hardware Support"] },
      ],
    },
    {
      id: "phase3",
      title: "Business Systems & Automation",
      duration: "2022–Present",
      role: "Freelance Full-Stack Developer",
      salary: "Client Work",
      focus: "M-Pesa Daraja integrations, invoicing dashboards, PDF generation, WhatsApp notifications, ERPNext and CMS workflows",
      weeklyHours: "Project-based",
      keyDeliverable: "Systems that replace manual business processes and handle real operational value",
      tracks: [
        { name: "Payments", skills: ["M-Pesa Daraja", "BullMQ", "Webhooks", "Audit Logs"] },
        { name: "Automation", skills: ["PDF Generation", "Notifications", "Dashboards", "Analytics"] },
        { name: "ERP / CMS", skills: ["ERPNext", "Procurement Workflows", "CMS Content Updates"] },
      ],
    },
    {
      id: "phase4",
      title: "Applied AI/ML",
      duration: "2023–Present",
      role: "AI/ML Engineering Direction",
      salary: "Research + Build",
      focus: "Computer vision, YOLO, OpenCV, PyTorch, Flask inference APIs, model evaluation and practical deployment foundations",
      weeklyHours: "Strengthening",
      keyDeliverable: "AI-powered surveillance research project and continued production AI skill development",
      tracks: [
        { name: "Computer Vision", skills: ["YOLOv5/v8", "OpenCV", "PyTorch", "NumPy"] },
        { name: "Serving", skills: ["Flask", "FastAPI", "REST APIs", "Monitoring"] },
        { name: "Model Practice", skills: ["Accuracy-Latency Tradeoffs", "Evaluation", "Documentation"] },
      ],
    },
    {
      id: "phase5",
      title: "Production AI Strengthening",
      duration: "Ongoing",
      role: "AI/ML Engineering Growth",
      salary: "Professional Growth",
      focus: "Kubernetes, Terraform, MLflow, LangChain, pgvector, AWS and production-grade AI application patterns",
      weeklyHours: "Ongoing",
      keyDeliverable: "Convert AI/ML skills into production-ready backend and platform systems",
      tracks: [
        { name: "MLOps Foundations", skills: ["MLflow", "Model Registry", "Monitoring"] },
        { name: "LLM Applications", skills: ["LangChain", "pgvector", "RAG"] },
        { name: "Cloud", skills: ["Kubernetes", "Terraform", "AWS"] },
      ],
    },
  ],
  projects: [],
  studyPlan: {
    daily: "Build, document and improve production-style software evidence.",
    weeklyTarget: "One meaningful improvement to portfolio proof, project quality or technical depth.",
    schedule: [
      { day: "Mon–Fri", focus: "Implementation and systems work", hours: 3 },
      { day: "Sat", focus: "Deep build and documentation", hours: 5 },
      { day: "Sun", focus: "Review, polish and planning", hours: 2 },
    ],
  },
};

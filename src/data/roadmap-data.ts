import {
    Clock,
    Award,
    Briefcase,
    BookOpen,
    Target,
    TrendingUp,
    Zap,
    Cpu,
    Database,
    Cloud,
    Server,
    Layout,
    GitBranch,
    Shield,
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
        title: "MLOps Architect Career Roadmap",
        subtitle: "CS Graduate → Industry Architect (30-36 Months)",
        metrics: [
            { label: "Total Duration", value: "30-36", unit: "Months", icon: Clock, color: "bg-blue-600" },
            { label: "Weekly Commitment", value: "15-20", unit: "Hours", icon: Target, color: "bg-green-600" },
            { label: "Certifications", value: "6-8", unit: "Total", icon: Award, color: "bg-purple-600" },
            { label: "Portfolio Projects", value: "8", unit: "Major", icon: Briefcase, color: "bg-orange-600" },
        ],
        targets: [
            { label: "Certifications", value: "6-8", detail: "Industry Recognized" },
            { label: "Entry Salary", value: "$140K-$180K", detail: "Base Range" },
            { label: "Architect Salary", value: "$220K-$350K+", detail: "Goal Range" },
            { label: "Job Growth", value: "40%+", detail: "Year-over-Year" }
        ]
    },
    salaryProgression: [
        { phase: "Phase 1: Foundations", role: "MLOps Engineer I", range: "$110K - $140K", color: "bg-gray-400" },
        { phase: "Phase 2: MLOps Core", role: "MLOps Engineer II", range: "$140K - $180K", color: "bg-blue-400" },
        { phase: "Phase 3: Platform Eng", role: "Principal Engineer", range: "$180K - $240K", color: "bg-purple-400" },
        { phase: "Phase 4: Architect", role: "MLOps Architect", range: "$220K - $350K+", color: "bg-orange-400" },
    ],
    phases: [
        {
            id: "phase1",
            title: "Phase 1: Foundations",
            duration: "Months 0-6",
            role: "MLOps Engineer I",
            salary: "$110K-$140K",
            focus: "Build engineering foundation: Cloud + Data + ML basics",
            weeklyHours: "15-20h",
            keyDeliverable: "End-to-end ETL pipeline + cloud deployment",
            tracks: [
                { name: "Programming Mastery", skills: ["Python Advanced", "Testing (PyTest)", "Code Quality", "Package Mgmt"] },
                { name: "Data Engineering", skills: ["SQL Mastery", "Data Warehousing", "dbt", "Airflow"] },
                { name: "Cloud Foundations", skills: ["AWS/GCP Core", "IAM", "Networking", "Compute"] },
                { name: "Orchestration", skills: ["Airflow", "DAGs", "Scheduling"] },
                { name: "Version Control", skills: ["Git Advanced", "Branching", "CI/CD Basics"] }
            ]
        },
        {
            id: "phase2",
            title: "Phase 2: MLOps Core",
            duration: "Months 4-15",
            role: "MLOps Engineer II",
            salary: "$140K-$180K",
            focus: "Training workflows, deployment, Kubernetes",
            weeklyHours: "20-25h",
            keyDeliverable: "End-to-end ML pipeline with CI/CD",
            tracks: [
                { name: "ML Engineering", skills: ["Scikit-learn", "PyTorch", "Deep Learning"] },
                { name: "LLM Engineering", skills: ["Prompt Eng", "RAG", "Embeddings", "Fine-tuning"] },
                { name: "Experiment Tracking", skills: ["MLflow", "Weights & Biases", "Model Registry"] },
                { name: "Kubernetes", skills: ["Pods", "Deployments", "Services", "Helm"] },
                { name: "CI/CD for ML", skills: ["GitHub Actions", "Automated Testing", "Model Validation"] }
            ]
        },
        {
            id: "phase3",
            title: "Phase 3: Platform Eng",
            duration: "Months 12-30",
            role: "Principal Engineer",
            salary: "$180K-$240K",
            focus: "Scalable platforms, IaC, observability",
            weeklyHours: "25-30h",
            keyDeliverable: "Complete ML platform infrastructure",
            tracks: [
                { name: "Infrastructure as Code", skills: ["Terraform", "Modules", "State Mgmt"] },
                { name: "Advanced K8s", skills: ["Autoscaling", "GPU Scheduling", "Service Mesh"] },
                { name: "Observability", skills: ["Prometheus", "Grafana", "Loki", "Distributed Tracing"] },
                { name: "Feature Stores", skills: ["Feast", "Online/Offline Stores"] },
                { name: "Security", skills: ["RBAC", "Network Policies", "Governance"] }
            ]
        },
        {
            id: "phase4",
            title: "Phase 4: Architect",
            duration: "Months 30-36+",
            role: "MLOps Architect",
            salary: "$220K-$350K+",
            focus: "Strategy, design, leadership",
            weeklyHours: "30-35h",
            keyDeliverable: "Multi-cloud ML platform architecture",
            tracks: [
                { name: "System Design", skills: ["Multi-cloud", "High Availability", "Scalability"] },
                { name: "Technical Leadership", skills: ["Mentoring", "Code Review", "Strategy"] },
                { name: "Cost Management", skills: ["FinOps", "Resource Optimization"] },
                { name: "Governance", skills: ["Compliance", "Audit", "Policy"] }
            ]
        }
    ],
    projects: [
        {
            id: 1,
            title: "End-to-End ML Pipeline",
            description: "Automated training pipeline with data validation, training, and deployment.",
            stack: ["Airflow", "Kafka", "PyTorch", "KServe"],
            status: "Completed",
            phase: "Phase 1/2",
            type: "Core"
        },
        {
            id: 2,
            title: "LLM RAG Platform",
            description: "Document Q&A system with vector search and LLM integration.",
            stack: ["LangChain", "Pinecone", "vLLM", "React"],
            status: "WIP",
            phase: "Phase 2",
            type: "Core"
        },
        {
            id: 3,
            title: "Real-Time Fraud Detection",
            description: "Streaming inference system with sub-100ms latency.",
            stack: ["Kafka", "Flink", "Redis", "Triton"],
            status: "Planned",
            phase: "Phase 2/3",
            type: "Advanced"
        },
        {
            id: 4,
            title: "Distributed Training Operator",
            description: "K8s operator for distributed model training on GPU clusters.",
            stack: ["Go", "Kubebuilder", "PyTorch DDP"],
            status: "Research",
            phase: "Phase 3"
        },
        {
            id: 5,
            title: "Feature Store Platform",
            description: "Centralized feature management with online/offline serving.",
            stack: ["Feast", "BigQuery", "Redis"],
            status: "Planned",
            phase: "Phase 3"
        }
    ],
    studyPlan: {
        daily: "2.5 Hours",
        weeklyTarget: "15-20 Hours",
        schedule: [
            { day: "Mon", focus: "Python/Code", hours: 2 },
            { day: "Tue", focus: "SQL/Data", hours: 2 },
            { day: "Wed", focus: "Cloud/DevOps", hours: 2 },
            { day: "Thu", focus: "Project Work", hours: 3 },
            { day: "Fri", focus: "Theory/Reading", hours: 1.5 },
            { day: "Sat", focus: "Deep Work", hours: 5 },
            { day: "Sun", focus: "Review/Plan", hours: 1 }
        ]
    }
};

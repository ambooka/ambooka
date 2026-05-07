import { Clock, Award, Briefcase, Target, LucideIcon } from 'lucide-react'

export interface FocusMetric {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  color: string
}

export interface FocusTarget {
  label: string
  value: string
  detail: string
}

export interface FocusPhase {
  id: string
  title: string
  duration: string
  role: string
  salary: string
  focus: string
  weeklyHours: string
  keyDeliverable: string
  tracks: { name: string; skills: string[] }[]
}

export interface FocusProject {
  id: number | string
  title: string
  description: string
  stack: string | string[]
  status: string
  phase: string
  type?: string
  completed?: boolean
  url?: string
}

export interface FocusData {
  executiveSummary: {
    title: string
    subtitle: string
    metrics: FocusMetric[]
    targets: FocusTarget[]
  }
  salaryProgression: { phase: string; role: string; range: string; color: string }[]
  phases: FocusPhase[]
  projects: FocusProject[]
  studyPlan: {
    daily: string
    weeklyTarget: string
    schedule: { day: string; focus: string; hours: number }[]
  }
}

export const CAREER_FOCUS_DATA: FocusData = {
  executiveSummary: {
    title: 'Professional Engineering Focus',
    subtitle: 'Software Engineering · IT Systems · Applied AI/ML',
    metrics: [
      { label: 'Experience', value: '3+', unit: 'Years', icon: Clock, color: 'bg-blue-600' },
      { label: 'Projects', value: '12+', unit: 'Delivered', icon: Target, color: 'bg-green-600' },
      { label: 'Support', value: '70+', unit: 'Staff', icon: Award, color: 'bg-purple-600' },
      { label: 'Operations', value: '300+', unit: 'Workers', icon: Briefcase, color: 'bg-orange-600' },
    ],
    targets: [
      { label: 'Core Role', value: 'Software Engineer', detail: 'Full-stack + backend' },
      { label: 'Systems Strength', value: 'IT Infrastructure', detail: 'Windows Server, AD, networks' },
      { label: 'AI Direction', value: 'Applied AI/ML', detail: 'Computer vision and model APIs' },
      { label: 'Market Edge', value: 'Business Systems', detail: 'ERP, payments, automation' },
    ],
  },
  salaryProgression: [
    { phase: 'Software Engineering', role: 'Full-Stack Developer', range: 'Python · TypeScript · APIs', color: 'bg-gray-400' },
    { phase: 'Infrastructure', role: 'IT Systems', range: 'Windows Server · Networks · ERP', color: 'bg-blue-400' },
    { phase: 'Applied AI/ML', role: 'AI/ML Engineering', range: 'YOLO · OpenCV · PyTorch', color: 'bg-purple-400' },
    { phase: 'Production AI', role: 'MLOps Direction', range: 'FastAPI · Docker · PostgreSQL', color: 'bg-orange-400' },
  ],
  phases: [
    {
      id: 'phase1',
      title: 'Core: Software Engineering',
      duration: '2022–Now',
      role: 'Full-Stack Developer',
      salary: 'Professional Experience',
      focus: 'Python, TypeScript, React, Next.js, REST APIs, PostgreSQL, Docker',
      weeklyHours: 'Ongoing',
      keyDeliverable: 'Client applications, payment integrations, business dashboards and portfolio platform',
      tracks: [
        { name: 'Frontend', skills: ['React', 'Next.js', 'Tailwind', 'Zustand'] },
        { name: 'Backend', skills: ['Node.js', 'FastAPI', 'REST APIs', 'OpenAPI'] },
        { name: 'Data', skills: ['PostgreSQL', 'Redis', 'Supabase'] },
      ],
    },
    {
      id: 'phase2',
      title: 'Infrastructure: IT Systems',
      duration: '2025–Now',
      role: 'IT Assistant',
      salary: 'Company Operations',
      focus: 'ERPNext, Windows Server, Active Directory, TCP/IP, VoIP, CCTV, biometrics',
      weeklyHours: 'Full-time',
      keyDeliverable: 'ERP implementation, network rollout, support for office staff and field workers',
      tracks: [
        { name: 'Enterprise Systems', skills: ['ERPNext', 'Active Directory', 'Windows Server'] },
        { name: 'Networking', skills: ['TCP/IP', 'Switches', 'Wireless APs', 'VoIP'] },
        { name: 'Operations', skills: ['CCTV', 'Biometrics', 'Helpdesk'] },
      ],
    },
    {
      id: 'phase3',
      title: 'Business Automation',
      duration: '2022–Now',
      role: 'Freelance Developer',
      salary: 'Client Work',
      focus: 'M-Pesa integrations, invoicing dashboards, PDFs, WhatsApp notifications and analytics',
      weeklyHours: 'Project-based',
      keyDeliverable: 'Systems that replace manual business processes and handle real money',
      tracks: [
        { name: 'Payments', skills: ['M-Pesa Daraja', 'BullMQ', 'Webhooks'] },
        { name: 'Automation', skills: ['PDF generation', 'Notifications', 'Dashboards'] },
        { name: 'Deployment', skills: ['Docker', 'Nginx', 'GitHub Actions'] },
      ],
    },
    {
      id: 'phase4',
      title: 'Applied AI/ML',
      duration: '2023–Now',
      role: 'AI/ML Engineering Direction',
      salary: 'Research + Build',
      focus: 'Computer vision, YOLO, OpenCV, PyTorch, Flask inference APIs and model serving fundamentals',
      weeklyHours: 'Strengthening',
      keyDeliverable: 'AI-powered surveillance research project and continued production AI skill development',
      tracks: [
        { name: 'Computer Vision', skills: ['YOLO', 'OpenCV', 'PyTorch'] },
        { name: 'Serving', skills: ['Flask', 'FastAPI', 'APIs'] },
        { name: 'Model Ops', skills: ['Evaluation', 'Monitoring', 'Documentation'] },
      ],
    },
    {
      id: 'phase5',
      title: 'Production AI Strengthening',
      duration: 'Ongoing',
      role: 'AI/MLOps Direction',
      salary: 'Professional Growth',
      focus: 'Kubernetes, Terraform, MLflow, LangChain, pgvector and AWS as strengthening areas',
      weeklyHours: 'Ongoing',
      keyDeliverable: 'Convert AI/ML skills into production-ready backend and platform systems',
      tracks: [
        { name: 'MLOps', skills: ['MLflow', 'Model Registry', 'Monitoring'] },
        { name: 'LLM Apps', skills: ['LangChain', 'pgvector', 'RAG'] },
        { name: 'Cloud', skills: ['Kubernetes', 'Terraform', 'AWS'] },
      ],
    },
  ],
  projects: [],
  studyPlan: {
    daily: 'Build, document and improve production-style software evidence.',
    weeklyTarget: 'One meaningful improvement to portfolio, project proof or technical depth.',
    schedule: [
      { day: 'Mon–Fri', focus: 'Implementation and systems work', hours: 3 },
      { day: 'Sat', focus: 'Deep build and documentation', hours: 5 },
      { day: 'Sun', focus: 'Review, polish and planning', hours: 2 },
    ],
  },
}

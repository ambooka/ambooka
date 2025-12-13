'use client'
import React from 'react'
import { Server, Database, Zap, Brain, Layers, Globe, Activity, ShieldCheck, Code2 } from 'lucide-react'

const blueprints = [
    {
        id: 1,
        title: "End-to-End ML Pipeline",
        phase: "Phase 1",
        icon: Server,
        color: "text-green-600 bg-green-50",
        stack: ["Airflow", "Kafka", "Spark", "Feast", "KServe"],
        complexity: "High",
        metric: "< 100ms Latency"
    },
    {
        id: 2,
        title: "LLM RAG Platform",
        phase: "Phase 2",
        icon: Database,
        color: "text-blue-600 bg-blue-50",
        stack: ["LangChain", "Pinecone", "vLLM", "React", "K8s"],
        complexity: "Very High",
        metric: "500ms Response"
    },
    {
        id: 3,
        title: "Real-Time ML System",
        phase: "Phase 2",
        icon: Zap,
        color: "text-yellow-600 bg-yellow-50",
        stack: ["Kafka", "Flink", "Redis", "KServe"],
        complexity: "High",
        metric: "10k msg/sec"
    },
    {
        id: 4,
        title: "Distributed Training",
        phase: "Phase 3",
        icon: Brain,
        color: "text-purple-600 bg-purple-50",
        stack: ["Ray", "DeepSpeed", "PyTorch FSDP", "A100s"],
        complexity: "Very High",
        metric: "80% Scaling Eff."
    },
    {
        id: 5,
        title: "Feature Store Platform",
        phase: "Phase 3",
        icon: Layers,
        color: "text-orange-600 bg-orange-50",
        stack: ["Feast", "Redis Cluster", "BigQuery", "Spark"],
        complexity: "Medium",
        metric: "< 10ms Serving"
    },
    {
        id: 6,
        title: "Multi-Cloud Platform",
        phase: "Phase 3",
        icon: Globe,
        color: "text-cyan-600 bg-cyan-50",
        stack: ["EKS", "GKE", "Terraform", "Crossplane"],
        complexity: "High",
        metric: "99.99% Uptime"
    },
    {
        id: 7,
        title: "Observability Suite",
        phase: "Phase 3",
        icon: Activity,
        color: "text-pink-600 bg-pink-50",
        stack: ["Prometheus", "Loki", "Grafana", "Evidently"],
        complexity: "Medium",
        metric: "Full Visibility"
    },
    {
        id: 8,
        title: "Governance Platform",
        phase: "Phase 3",
        icon: ShieldCheck,
        color: "text-indigo-600 bg-indigo-50",
        stack: ["MLflow", "Fairlearn", "OPA", "Trivy"],
        complexity: "Medium",
        metric: "100% Audit"
    }
]

export const ProjectBlueprints = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blueprints.map((project) => (
                <div key={project.id} className="glass-card p-5 group hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${project.color} bg-opacity-50`}>
                                <project.icon size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{project.title}</h4>
                                <span className="text-xs text-gray-400 font-mono uppercase">{project.phase}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded-full mb-1">
                                {project.complexity}
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack Bubbles */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.stack.map((tech) => (
                            <span key={tech} className="text-[10px] px-2 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-100">
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Metric Footer */}
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Key Metric</span>
                        <span className="font-mono font-medium text-gray-700">{project.metric}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

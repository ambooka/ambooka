'use client'
import React from 'react'
import { Check, Circle, Monitor, Zap, MessageCircle, BarChart2, Link as LinkIcon, Server, Database, Brain, Layers, CheckCircle2, Clock } from 'lucide-react'

export const ProjectList = () => {
    // Roadmap Portfolio Projects
    const projects = [
        {
            id: 1,
            title: "End-to-End ML Pipeline",
            time: "Phase 1",
            completed: true,
            icon: Server,
            color: "text-green-600 bg-green-50"
        },
        {
            id: 2,
            title: "LLM RAG Platform",
            time: "Phase 2",
            completed: false,
            icon: Database,
            color: "text-blue-600 bg-blue-50"
        },
        {
            id: 3,
            title: "Real-Time ML System",
            time: "Phase 2",
            completed: false,
            icon: Zap,
            color: "text-yellow-600 bg-yellow-50"
        },
        {
            id: 4,
            title: "Distributed Training",
            time: "Phase 3",
            completed: false,
            icon: Brain,
            color: "text-purple-600 bg-purple-50"
        },
        {
            id: 5,
            title: "Feature Store Platform",
            time: "Phase 3",
            completed: false,
            icon: Layers,
            color: "text-red-600 bg-red-50"
        }
    ]

    return (
        <div className="flex flex-col gap-3">
            {projects.map((project, index) => (
                <div key={project.id} className="group flex items-center justify-between p-2 rounded-[24px] hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${project.completed ? 'bg-[#f4c542] text-black' : 'bg-white/10 text-gray-400'}`}>
                            {project.completed ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-gray-500" />}
                        </div>
                        <div>
                            <h4 className={`text-sm font-medium ${project.completed ? 'text-white' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                                {project.title}
                            </h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                <Clock size={10} />
                                {project.time}
                            </p>
                        </div>
                    </div>
                    <div className={`p-2 rounded-full ${project.color} opacity-80`}>
                        <project.icon size={14} />
                    </div>
                </div>
            ))}
        </div>
    )
}

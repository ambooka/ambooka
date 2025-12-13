'use client'
import React from 'react'
import { Award, CheckCircle2, Clock, DollarSign, BookOpen } from 'lucide-react'

const certifications = [
    {
        id: 1,
        name: "AWS Sol. Architect Assoc.",
        provider: "AWS",
        cost: "$150",
        hours: "80-100h",
        priority: "High",
        status: "In Progress",
        timeline: "Month 4-6"
    },
    {
        id: 2,
        name: "Databricks Data Eng.",
        provider: "Databricks",
        cost: "$200",
        hours: "60-80h",
        priority: "High",
        status: "Planned",
        timeline: "Month 6"
    },
    {
        id: 3,
        name: "GCP Pro ML Engineer",
        provider: "Google Cloud",
        cost: "$200",
        hours: "100-120h",
        priority: "Critical",
        status: "Planned",
        timeline: "Month 10-12"
    },
    {
        id: 4,
        name: "CKAD (Kubernetes Dev)",
        provider: "CNCF",
        cost: "$395",
        hours: "80-100h",
        priority: "Critical",
        status: "Planned",
        timeline: "Month 12-14"
    },
    {
        id: 5,
        name: "AWS DevOps Pro",
        provider: "AWS",
        cost: "$300",
        hours: "120-150h",
        priority: "High",
        status: "Planned",
        timeline: "Month 18-20"
    },
    {
        id: 6,
        name: "CKS (Security)",
        provider: "CNCF",
        cost: "$395",
        hours: "100-120h",
        priority: "Medium",
        status: "Planned",
        timeline: "Month 22-24"
    }
]

export const CertificationTracker = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">Certification Nexus</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Total Value: $10k+ Salary Boost</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((cert) => (
                    <div key={cert.id} className="glass-card p-4 border border-transparent hover:border-[#f4c542]/30 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${cert.priority === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                                <Award size={18} />
                            </div>
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full 
                                ${cert.status === 'In Progress' ? 'bg-[#f4c542] text-black' : 'bg-gray-100 text-gray-400'}`}>
                                {cert.status}
                            </span>
                        </div>

                        <h4 className="font-medium text-gray-900 leading-tight mb-1">{cert.name}</h4>
                        <p className="text-xs text-gray-500 mb-4">{cert.provider}</p>

                        <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Clock size={12} /> {cert.timeline}</span>
                                <span className="flex items-center gap-1"><BookOpen size={12} /> {cert.hours}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                                <span className="flex items-center gap-1"><DollarSign size={12} /> {cert.cost}</span>
                                <span className={`${cert.priority === 'Critical' ? 'text-red-500 font-bold' : ''}`}>{cert.priority} Priority</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

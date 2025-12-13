'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Laptop, DollarSign, Gift, Briefcase } from 'lucide-react'

// Using static data to match the "Crextio" reference image exactly
export const SkillAccordion = ({ openAccordion, setOpenAccordion }: { openAccordion: string | null, setOpenAccordion: (id: string | null) => void }) => {

    // Exact items from MLOps Roadmap
    const items = [
        {
            id: 'foundations',
            label: "Phase 1: Foundations",
            icon: Briefcase,
            content: (
                <div className="flex flex-col gap-2 text-sm text-gray-500 px-1">
                    <div className="flex justify-between items-center">
                        <span>Python (Async, Type hints)</span>
                        <span className="text-[#f4c542] font-bold">In Progress</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Data Engineering (SQL, dbt)</span>
                        <span className="text-gray-400">Queue</span>
                    </div>
                </div>
            )
        },
        {
            id: 'cloud',
            label: "Cloud & Infrastructure",
            icon: Laptop,
            content: (
                <div className="flex flex-col gap-2 p-1">
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[24px]">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Laptop size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-900 font-medium text-xs">AWS Solutions Arch.</span>
                            <span className="text-[10px] text-gray-500">Certification Target</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'ml_eng',
            label: "ML Engineering",
            icon: DollarSign, // Reusing icon prop but implies "High Value"
            content: (
                <div className="flex flex-col gap-2 text-sm text-gray-500 px-1">
                    <div className="flex justify-between">
                        <span>PyTorch / Deep Learning</span>
                        <span className="text-gray-900">Phase 2</span>
                    </div>
                    <div className="flex justify-between">
                        <span>LLMs / RAG</span>
                        <span className="text-gray-900">Phase 2</span>
                    </div>
                </div>
            )
        },
        {
            id: 'orchestration',
            label: "Orchestration & Ops",
            icon: Gift, // Reusing icon prop
            content: (
                <div className="flex flex-col gap-2 text-sm text-gray-500 px-1">
                    <div className="flex justify-between">
                        <span>Docker & Kubernetes</span>
                        <span className="text-gray-900">Critical</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Airflow / CI/CD</span>
                        <span className="text-gray-900">Track 4</span>
                    </div>
                </div>
            )
        }
    ];

    const toggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    }

    return (
        <div className="flex flex-col gap-1 h-full">
            {items.map((item) => {
                const isOpen = openAccordion === item.id || (item.id === 'devices' && openAccordion === null);
                return (
                    <div key={item.id} className="border-b border-gray-100 last:border-0 pb-2 mb-2">
                        <button
                            onClick={() => toggle(item.id)}
                            className="w-full flex items-center justify-between py-2 group"
                        >
                            <span className="text-sm text-gray-900 group-hover:text-gray-600 transition-colors font-normal tracking-tight">
                                {item.label}
                            </span>
                            {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-32 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}
                        >
                            {item.content}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

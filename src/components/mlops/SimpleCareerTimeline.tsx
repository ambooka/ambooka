'use client'
import React from 'react'
import { Zap, Layers, Trophy, Briefcase, ChevronsRight, TrendingUp } from 'lucide-react'

// Resume Graph Data with spatial coordinates (x, y)
const nodes = [
    {
        id: 'mobile',
        title: 'START',
        role: 'Mobile Lead',
        years: '2019-2021',
        x: 10,
        y: 80,
        color: 'border-green-400',
        bg: 'bg-green-50/95',
        icon: Zap,
        inputs: ['Java', 'CS Fund.'],
        outputs: ['UI/UX', 'Apps']
    },
    {
        id: 'fullstack',
        title: 'SCALE',
        role: 'Senior Fullstack',
        years: '2021-2023',
        x: 35,
        y: 50,
        color: 'border-blue-400',
        bg: 'bg-blue-50/95',
        icon: Briefcase,
        inputs: ['React', 'Node.js'],
        outputs: ['System Design']
    },
    {
        id: 'devops',
        title: 'CURRENT',
        role: 'Senior DevOps',
        years: '2023-Present',
        x: 62,
        y: 20,
        color: 'border-[#f4c542]',
        bg: 'bg-[#1a1a1a]',
        isCurrent: true,
        icon: Layers,
        metrics: [{ label: 'Uptime', val: '99.9%' }, { label: 'Clusters', val: '7+' }],
        inputs: ['Microservices', 'Cloud'],
        outputs: ['K8s Platform', 'IaC']
    },
    {
        id: 'architect',
        title: 'TARGET',
        role: 'MLOps Architect',
        years: '2026+',
        x: 88,
        y: 35,
        color: 'border-purple-400',
        bg: 'bg-white/90',
        isFuture: true,
        icon: Trophy,
        inputs: ['AI Models', 'Big Data'],
        outputs: ['Enterprise AI']
    }
]

export const SimpleCareerTimeline = () => {
    return (
        <div className="flex flex-col h-full bg-[#fcfbf7] rounded-[24px] relative overflow-hidden font-sans border border-gray-100/50 shadow-sm">
            {/* Header */}
            <div className="absolute top-4 left-6 z-30">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#e0b836]" />
                    Career Trajectory
                </h3>
                <p className="text-[10px] text-gray-400 font-medium pl-6">Skills & Growth Map</p>
            </div>

            {/* Graph Container */}
            <div className="relative w-full h-[360px] mt-4">

                {/* 1. The Connector Line (SVG Layer) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="career-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="50%" stopColor="#60a5fa" />
                            <stop offset="70%" stopColor="#f4c542" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 10 80 C 25 80 25 50 35 50 C 50 50 50 20 62 20 C 75 20 80 35 88 35"
                        fill="none"
                        stroke="url(#career-gradient)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="opacity-60 dashed"
                        strokeDasharray="4 4"
                    />
                </svg>

                {/* 2. The Cards (Nodes) - Exact Career Map Style */}
                {nodes.map((node) => {
                    const Icon = node.icon
                    const isDark = node.isCurrent

                    return (
                        <div
                            key={node.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 w-[140px] group transition-all duration-300 hover:z-50 hover:scale-110`}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        >
                            {/* Node Dot behind card */}
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-0 shadow-sm ${isDark ? 'bg-[#f4c542] animate-ping opacity-20' : 'bg-gray-300'
                                }`}></div>

                            {/* CARD COMPONENT: Exact Match to Career Map */}
                            <div className={`relative rounded-md border ${node.color} ${node.bg} backdrop-blur-md shadow-sm hover:shadow-xl flex flex-col overflow-hidden`}>

                                {/* Header */}
                                <div className={`px-2 py-1.5 border-b flex justify-between items-center ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-white/50'
                                    }`}>
                                    <div className="flex flex-col">
                                        <span className={`text-[7px] font-bold tracking-widest leading-none ${isDark ? 'text-[#f4c542]' : 'text-gray-400'
                                            }`}>
                                            {node.title}
                                        </span>
                                        <div className={`font-bold text-[9px] leading-tight mt-0.5 whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'
                                            }`}>
                                            {node.role}
                                        </div>
                                    </div>
                                    <div className={`p-0.5 rounded ${isDark ? 'bg-gray-800 text-[#f4c542]' : 'bg-white text-gray-500 shadow-sm'
                                        }`}>
                                        <Icon size={10} />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-1.5 flex-1 flex flex-col justify-center gap-1.5">

                                    {/* Metrics (Only if present) */}
                                    {node.metrics && (
                                        <div className="flex gap-1">
                                            {node.metrics.map((m, idx) => (
                                                <div key={idx} className="bg-gray-800/80 border border-gray-700 rounded px-1 py-0.5 flex-1 text-center">
                                                    <div className="text-[6px] text-gray-400 uppercase leading-none">{m.label}</div>
                                                    <div className="text-[8px] font-bold text-green-400 leading-none">{m.val}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Inputs / Outputs Flow */}
                                    <div className="flex justify-between items-center relative gap-1">
                                        {/* Inputs */}
                                        <div className="flex flex-col gap-1 w-1/2">
                                            {node.inputs.map((txt, idx) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0"></div>
                                                    <span className={`text-[7px] font-medium leading-none whitespace-nowrap overflow-hidden text-ellipsis ${isDark ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>{txt}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Center Arrow */}
                                        <div className="opacity-20 shrink-0">
                                            <ChevronsRight size={10} className={isDark ? 'text-white' : 'text-black'} />
                                        </div>

                                        {/* Outputs */}
                                        <div className="flex flex-col gap-1 w-1/2 items-end">
                                            {node.outputs.map((txt, idx) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <span className={`text-[7px] font-bold leading-none whitespace-nowrap overflow-hidden text-ellipsis ${isDark ? 'text-gray-200' : 'text-gray-700'
                                                        }`}>{txt}</span>
                                                    <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: Years */}
                                <div className={`px-1 py-0.5 text-[6px] font-mono text-center leading-none ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-white/40 text-gray-400'
                                    }`}>
                                    {node.years}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

'use client'
import React, { useState } from 'react'
import { Target, Maximize2, GitCommit, ArrowRight, Zap, Briefcase, Trophy, Layers, Play, TrendingUp, Calendar, Network, ChevronsRight, Sparkles } from 'lucide-react'

// --- Unified Data Structure ---
interface NodeData {
    id: string
    title: string
    role: string
    years: string
    color: string
    bg: string
    icon: any
    metrics?: { label: string, val: string }[]
    inputs: string[]
    outputs: string[]
    x: number // 0-100 percentage of container width
    y: number // 0-100 percentage of container height
}

const nodeData: NodeData[] = [
    {
        id: 'phase1',
        title: 'PHASE 1 (FOUNDATIONS)',
        role: 'MLOps Engineer I',
        years: 'Months 0-6',
        color: 'border-green-400',
        bg: 'bg-green-50/90',
        icon: GitCommit,
        inputs: ['Python Advanced', 'SQL Mastery'],
        outputs: ['ETL Pipelines', 'Cloud Basics'],
        x: 10, y: 70
    },
    {
        id: 'phase2',
        title: 'PHASE 2 (ENGINEERING)',
        role: 'MLOps Engineer II',
        years: 'Months 4-15',
        color: 'border-blue-400',
        bg: 'bg-blue-50/90',
        icon: Layers,
        inputs: ['ML Pipelines', 'Docker'],
        outputs: ['Kubernetes', 'Model Serving'],
        x: 35, y: 45
    },
    {
        id: 'phase3',
        title: 'PHASE 3 (PLATFORM)',
        role: 'Principal Engineer',
        years: 'Months 12-30',
        color: 'border-purple-400',
        bg: 'bg-purple-50/90',
        icon: Network,
        inputs: ['Kubernetes', 'Observability'],
        outputs: ['AI Platform', 'IaC/Terraform'],
        x: 60, y: 25
    },
    {
        id: 'phase4',
        title: 'PHASE 4 (ARCHITECT)',
        role: 'MLOps Architect',
        years: 'Months 30-36+',
        color: 'border-[#f4c542]',
        bg: 'bg-[#1a1a1a]', // Premium Dark
        icon: Trophy,
        metrics: [{ label: 'Salary', val: '$350K+' }, { label: 'Growth', val: '40% YoY' }],
        inputs: ['Strategy', ' governance'],
        outputs: ['Enterprise Scale', 'Leadership'],
        x: 85, y: 10
    }
]

const nodeConnections = [
    { from: 'phase1', fromIdx: 0, to: 'phase2', toIdx: 0 },
    { from: 'phase1', fromIdx: 1, to: 'phase2', toIdx: 1 },
    { from: 'phase2', fromIdx: 0, to: 'phase3', toIdx: 0 },
    { from: 'phase2', fromIdx: 1, to: 'phase3', toIdx: 1 },
    { from: 'phase3', fromIdx: 0, to: 'phase4', toIdx: 0 },
    { from: 'phase3', fromIdx: 1, to: 'phase4', toIdx: 1 },
]

export const CareerTimeline = () => {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)
    const [replay, setReplay] = useState(0)

    const handleReplay = () => setReplay(prev => prev + 1)

    // Dynamic Coordinate Helper
    const getCoords = (node: NodeData, type: 'in' | 'center' | 'out', socketIdx: number = 0) => {
        const W = 950
        const H = 380
        const CARD_W = 140 // Micro-Compact Width
        const CARD_H = 90  // Micro-Compact Height

        let cx = (node.x / 100) * W
        if (node.x > 80) cx -= (CARD_W * 0.8)

        const cy = (node.y / 100) * H

        if (type === 'center') return { x: cx + (CARD_W / 2), y: cy + (CARD_H / 2) }

        const sx = type === 'in' ? cx : cx + CARD_W
        const sy = cy + 40 + (socketIdx * 12) // Adjusted for new height
        return { x: sx, y: sy }
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50 rounded-[24px] relative overflow-hidden shadow-sm border border-gray-100 group font-sans">

            {/* Header */}
            <div className="relative z-20 flex justify-between items-center px-4 pt-3 pb-2 bg-white/50 backdrop-blur-sm border-b border-gray-100/50">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-xs font-extrabold text-[#2a2a2a] flex items-center gap-2 tracking-tight">
                        <div className="w-1 h-3 bg-[#f4c542] rounded-full"></div>
                        CAREER MAP
                    </h3>
                    <p className="text-[9px] text-gray-400 font-medium pl-4">
                        TRAJECTORY & SKILLS
                    </p>
                </div>
                <button onClick={handleReplay} className="p-1.5 rounded-full hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-[#f4c542]">
                    <Play size={12} fill="currentColor" className="ml-0.5" />
                </button>
            </div>

            {/* Container */}
            <div className="h-[380px] relative p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <div className="min-w-[1000px] h-full relative pr-8">

                    {/* 1. CALENDAR GRID LINES */}
                    <div className="absolute inset-x-0 bottom-4 top-4 flex justify-between px-[2%] pointer-events-none opacity-20 z-0">
                        {['2019', '2021', '2023', '2025', '2027'].map(year => (
                            <div key={year} className="flex flex-col items-center h-full">
                                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1 py-0.5 rounded mb-2">{year}</span>
                                <div className="w-px h-full bg-gray-300 border-r border-dashed border-gray-400"></div>
                            </div>
                        ))}
                    </div>

                    {/* 2. TRAJECTORY PATH */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" key={`traj-${replay}`}>
                        <defs>
                            <linearGradient id="mainGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#f4c542" stopOpacity="0.6" />
                            </linearGradient>
                        </defs>
                        <path
                            d={`M ${getCoords(nodeData[0], 'center').x} ${getCoords(nodeData[0], 'center').y}
                           C ${getCoords(nodeData[1], 'center').x} ${getCoords(nodeData[0], 'center').y},
                             ${getCoords(nodeData[2], 'center').x} ${getCoords(nodeData[2], 'center').y},
                             ${getCoords(nodeData[3], 'center').x} ${getCoords(nodeData[3], 'center').y}`}
                            fill="none"
                            stroke="url(#mainGradient)"
                            strokeWidth="16"
                            strokeLinecap="round"
                            className="animate-[draw_1.5s_ease-out_forwards] blur-md"
                            style={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
                        />
                        <path
                            d={`M ${getCoords(nodeData[0], 'center').x} ${getCoords(nodeData[0], 'center').y}
                           C ${getCoords(nodeData[1], 'center').x} ${getCoords(nodeData[0], 'center').y},
                             ${getCoords(nodeData[2], 'center').x} ${getCoords(nodeData[2], 'center').y},
                             ${getCoords(nodeData[3], 'center').x} ${getCoords(nodeData[3], 'center').y}`}
                            fill="none"
                            stroke="#f4c542"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="4 4"
                            className="opacity-50"
                        />
                    </svg>

                    {/* 3. NODE CONNECTIONS */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                        {nodeConnections.map((conn, i) => {
                            const fromNode = nodeData.find(n => n.id === conn.from)!; const toNode = nodeData.find(n => n.id === conn.to)!
                            const start = getCoords(fromNode, 'out', conn.fromIdx); const end = getCoords(toNode, 'in', conn.toIdx)
                            const isActive = hoveredNode && (hoveredNode !== fromNode.id && hoveredNode !== toNode.id)

                            return <path key={i} d={`M ${start.x} ${start.y} C ${start.x + 30} ${start.y}, ${end.x - 30} ${end.y}, ${end.x} ${end.y}`}
                                fill="none" stroke={isActive ? '#f3f4f6' : '#94a3b8'} strokeWidth={isActive ? 1 : 1.5} className="transition-all duration-300" />
                        })}
                    </svg>

                    {/* 4. COMPACT CARDS */}
                    <div className="relative w-full h-full min-h-[400px]">
                        {nodeData.map((node, i) => {
                            const isDark = node.id === 'devops'
                            const BaseIcon = node.icon

                            return (
                                <div
                                    key={node.id}
                                    className={`absolute w-[140px] rounded-md border ${node.color} ${node.bg} backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 z-20 cursor-default group/card flex flex-col overflow-hidden
                                ${hoveredNode && hoveredNode !== node.id ? 'opacity-30 grayscale blur-[1px]' : 'scale-100 hover:scale-[1.02]'}`}
                                    style={{
                                        left: `${node.x}%`,
                                        top: `${node.y}%`,
                                        marginLeft: node.x > 80 ? '-120px' : '0'
                                    }}
                                    onMouseEnter={() => setHoveredNode(node.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                >
                                    {/* Card Header */}
                                    <div className={`px-1.5 py-1 border-b ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-white/50'} flex justify-between items-center`}>
                                        <div className="flex flex-col">
                                            <span className={`text-[7px] font-bold tracking-widest leading-none ${isDark ? 'text-[#f4c542]' : 'text-gray-400'}`}>{node.title}</span>
                                            <div className={`font-bold text-[9px] leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-gray-800'}`}>{node.role}</div>
                                        </div>
                                        <div className={`p-0.5 rounded ${isDark ? 'bg-gray-800 text-[#f4c542]' : 'bg-white text-gray-500 shadow-sm'}`}>
                                            <BaseIcon size={10} />
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-1 flex-1 flex flex-col justify-center gap-1">

                                        {/* Compact Metrics */}
                                        {node.metrics && (
                                            <div className="flex gap-1 mb-0.5">
                                                {node.metrics.map((m, idx) => (
                                                    <div key={idx} className="bg-gray-800/80 border border-gray-700 rounded px-1 py-0.5 flex-1 text-center">
                                                        <div className="text-[6px] text-gray-400 uppercase leading-none">{m.label}</div>
                                                        <div className="text-[8px] font-bold text-green-400 leading-none">{m.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center relative h-full">
                                            {/* Inputs - Limit to 2 */}
                                            <div className="flex flex-col gap-1 relative z-10 w-1/2 pr-0.5 justify-center">
                                                {node.inputs.slice(0, 2).map((txt, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 group/socket">
                                                        <div className="w-1 h-1 rounded-full bg-gray-400 group-hover/socket:bg-black transition-colors shrink-0"></div>
                                                        <span className={`text-[7px] font-medium leading-none whitespace-nowrap overflow-hidden text-ellipsis ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{txt}</span>
                                                    </div>
                                                ))}
                                                {node.inputs.length > 2 && <div className="text-[6px] text-gray-300 pl-2">+{node.inputs.length - 2}</div>}
                                            </div>

                                            {/* Cheat Arrow - Smaller */}
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                                                <ChevronsRight size={12} className={isDark ? 'text-white' : 'text-black'} />
                                            </div>

                                            {/* Outputs - Limit to 2 */}
                                            <div className="flex flex-col gap-1 relative z-10 w-1/2 pl-0.5 items-end justify-center">
                                                {node.outputs.slice(0, 2).map((txt, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 group/socket text-right w-full justify-end">
                                                        <span className={`text-[7px] font-bold leading-none whitespace-nowrap overflow-hidden text-ellipsis ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{txt}</span>
                                                        <div className="w-1 h-1 rounded-full bg-blue-400 group-hover/socket:bg-blue-600 transition-colors shrink-0"></div>
                                                    </div>
                                                ))}
                                                {node.outputs.length > 2 && <div className="text-[6px] text-gray-300 pr-2">+{node.outputs.length - 2}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className={`px-1 py-0.5 text-[6px] font-mono text-center leading-none ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-white/40 text-gray-400'}`}>
                                        {node.years}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <style jsx global>{`
                @keyframes draw { to { stroke-dashoffset: 0; } }
            `}</style>
            </div>
        </div>
    )
}

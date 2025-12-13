'use client'
import React from 'react'
import { Database, Server, Brain, Activity, ArrowRight, Zap, Shield, GitBranch } from 'lucide-react'

export const ArchitectureShowcase = () => {
    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] rounded-[24px] p-6 text-white overflow-hidden relative group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)',
                backgroundSize: '24px 24px'
            }}></div>

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-medium text-white mb-1">System Architecture</h3>
                    <p className="text-xs text-gray-400">End-to-End MLOps Platform</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Live
                </div>
            </div>

            {/* Pipeline Visualization */}
            <div className="flex-1 flex flex-col justify-center gap-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-green-500/20 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                </div>

                {/* Stage 1: Data */}
                <div className="flex items-center gap-4 z-10 animate-in slide-in-from-left-4 duration-500 delay-100">
                    <div className="w-16 h-16 rounded-2xl bg-[#2a2a2a] border border-gray-700 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-900/10 group-hover:scale-105 transition-transform">
                        <Database size={24} />
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                        <div className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-1 flex items-center gap-2">
                            Ingestion Layer
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">Kafka • Spark • Airflow</div>
                    </div>
                </div>

                {/* Stage 2: Training */}
                <div className="flex items-center gap-4 z-10 animate-in slide-in-from-left-4 duration-500 delay-200">
                    <div className="w-16 h-16 rounded-2xl bg-[#2a2a2a] border border-gray-700 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-900/10 group-hover:scale-105 transition-transform">
                        <Brain size={24} />
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                        <div className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">Training Hub</div>
                        <div className="text-[10px] text-gray-500 font-mono">PyTorch • Ray • MLflow</div>
                    </div>
                </div>

                {/* Stage 3: Serving */}
                <div className="flex items-center gap-4 z-10 animate-in slide-in-from-left-4 duration-500 delay-300">
                    <div className="w-16 h-16 rounded-2xl bg-[#2a2a2a] border border-gray-700 flex items-center justify-center text-green-400 shadow-lg shadow-green-900/10 group-hover:scale-105 transition-transform">
                        <Zap size={24} />
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                        <div className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">Inference Engine</div>
                        <div className="text-[10px] text-gray-500 font-mono">KServe • Redis • FastAPI</div>
                    </div>
                </div>
            </div>

            {/* Metrics Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                    <div className="text-[10px] text-gray-500 uppercase">Throughput</div>
                    <div className="text-lg font-mono text-white">12k<span className="text-xs text-gray-500 ml-1">req/s</span></div>
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 uppercase">Latency</div>
                    <div className="text-lg font-mono text-green-400">45<span className="text-xs text-gray-500 ml-1">ms</span></div>
                </div>
            </div>
        </div>
    )
}

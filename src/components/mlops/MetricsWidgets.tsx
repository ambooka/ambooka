'use client'
import React from 'react'
import { Activity, Clock, GitBranch, GitCommit, GitPullRequest, Layout, Server, Gauge } from 'lucide-react'

export const GitHubActivity = () => {
    return (
        <>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                    <GitBranch size={20} className="text-gray-700" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    Contribs
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-2xl font-light text-gray-900">1,248</h3>
                    <p className="text-xs text-gray-500">Commits this year</p>
                </div>

                {/* Visual contribution graph simulation */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                        <div key={col} className="flex flex-col gap-1">
                            {[1, 2, 3, 4, 5].map((row) => (
                                <div
                                    key={row}
                                    className={`w-2 h-2 rounded-sm ${Math.random() > 0.5 ? 'bg-green-500' :
                                        Math.random() > 0.3 ? 'bg-green-300' : 'bg-gray-100'
                                        }`}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                        <GitCommit size={12} />
                        <span>24 PRs</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <GitPullRequest size={12} />
                        <span>12 Issues</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export const SystemHealth = () => {
    const [latency, setLatency] = React.useState(45);
    const [gpu, setGpu] = React.useState(82);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => Math.max(30, Math.min(60, prev + (Math.random() - 0.5) * 10)));
            setGpu(prev => Math.max(70, Math.min(95, prev + (Math.random() - 0.5) * 5)));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 animate-glow">
                    <Activity size={20} />
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Stable</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-4">
                <div>
                    <h3 className="text-2xl font-light text-gray-900">99.9%</h3>
                    <p className="text-xs text-gray-500">Pipeline Uptime</p>
                </div>

                {/* Simulated Metrics */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Server size={10} /> API Latency</span>
                        <span className="font-mono text-gray-900">{Math.round(latency)}ms</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-in-out"
                            style={{ width: `${(latency / 100) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-gray-500 flex items-center gap-1"><Gauge size={10} /> GPU Load</span>
                        <span className="font-mono text-gray-900">{Math.round(gpu)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-in-out"
                            style={{ width: `${gpu}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    )
}

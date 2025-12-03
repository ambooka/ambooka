'use client'

import { Play, Pause } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function TimeTrackerWidget() {
    const [time, setTime] = useState(new Date())
    const [isRunning, setIsRunning] = useState(true)

    useEffect(() => {
        const timer = setInterval(() => {
            if (isRunning) {
                setTime(new Date())
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [isRunning])

    return (
        <div className="p-6 rounded-3xl relative overflow-hidden h-full flex flex-col justify-between" style={{
            backgroundColor: '#1a1a1a', // Dark background as in reference
            color: 'white'
        }}>
            {/* Abstract background curves */}
            <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 50 Q 50 100 100 50" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
                    <path d="M0 60 Q 50 110 100 60" stroke="var(--accent-secondary)" strokeWidth="2" fill="none" />
                    <path d="M0 70 Q 50 120 100 70" stroke="var(--accent-success)" strokeWidth="2" fill="none" />
                </svg>
            </div>

            <h3 className="font-medium text-white/80 relative z-10">Time Tracker</h3>

            <div className="text-4xl font-mono font-bold tracking-wider relative z-10 my-4">
                {time.toLocaleTimeString([], { hour12: false })}
            </div>

            <div className="flex gap-3 relative z-10">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                </button>
            </div>
        </div>
    )
}

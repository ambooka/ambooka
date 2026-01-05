'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface RobotChatFABProps {
    onClick: () => void
    isActive?: boolean
}

export function RobotChatFAB({ onClick, isActive = false }: RobotChatFABProps) {
    // Alternate between two frames for waving animation
    const [frame, setFrame] = useState(1)

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => f === 1 ? 2 : 1)
        }, 400) // Switch every 400ms for smooth waving

        return () => clearInterval(interval)
    }, [])

    return (
        <button
            onClick={onClick}
            className="robot-fab-container group"
            title="Chat with AI (Ctrl+K)"
            aria-label="Open AI Chat"
        >
            <div className={`robot-wrapper ${isActive ? 'robot-active' : ''}`}>
                {/* Waving animation: swap between two frames */}
                <div className="robot-frames">
                    <Image
                        src="/assets/images/robot-wave-1.png"
                        alt="AI Assistant Robot"
                        width={100}
                        height={120}
                        className={`robot-image ${frame === 1 ? 'visible' : 'hidden'}`}
                        priority
                    />
                    <Image
                        src="/assets/images/robot-wave-2.png"
                        alt="AI Assistant Robot"
                        width={100}
                        height={120}
                        className={`robot-image ${frame === 2 ? 'visible' : 'hidden'}`}
                        priority
                    />
                </div>

                {/* Glow effect when active */}
                {isActive && (
                    <div className="active-glow"></div>
                )}

                {/* Speech bubble indicator */}
                {isActive && (
                    <div className="speech-indicator">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                )}
            </div>

            <style jsx>{`
                .robot-fab-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 100px;
                    height: 120px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    z-index: 50;
                    outline: none;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0;
                }

                .robot-wrapper {
                    position: relative;
                    animation: float 3s ease-in-out infinite;
                    transition: transform 0.3s ease, filter 0.3s ease;
                }

                .robot-wrapper:hover {
                    transform: scale(1.15) translateY(-5px);
                }

                .robot-active {
                    animation: float-active 2s ease-in-out infinite;
                }

                .robot-frames {
                    position: relative;
                    width: 100px;
                    height: 120px;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }

                @keyframes float-active {
                    0%, 100% { transform: translateY(0px) scale(1.05); }
                    50% { transform: translateY(-6px) scale(1.08); }
                }

                .active-glow {
                    position: absolute;
                    inset: -15px;
                    background: radial-gradient(circle, rgba(0, 230, 230, 0.5) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: pulse-glow 1.5s ease-in-out infinite;
                    pointer-events: none;
                    z-index: -1;
                }

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.15); }
                }

                .speech-indicator {
                    position: absolute;
                    top: -10px;
                    right: -5px;
                    background: white;
                    padding: 6px 10px;
                    border-radius: 15px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .speech-indicator::after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 8px solid white;
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    background: #00e6e6;
                    border-radius: 50%;
                    animation: typing 1.4s ease-in-out infinite;
                }

                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-4px); opacity: 1; }
                }

                /* Shadow under robot */
                .robot-fab-container::after {
                    content: '';
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 10px;
                    background: radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%);
                    animation: shadow-float 3s ease-in-out infinite;
                    pointer-events: none;
                }

                @keyframes shadow-float {
                    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.4; }
                    50% { transform: translateX(-50%) scale(0.8); opacity: 0.2; }
                }
            `}</style>

            <style jsx global>{`
                .robot-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    object-fit: contain;
                    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.25));
                    transition: opacity 0.1s ease;
                }
                
                .robot-image.visible {
                    opacity: 1;
                }
                
                .robot-image.hidden {
                    opacity: 0;
                }
                
                .robot-wrapper:hover .robot-image {
                    filter: drop-shadow(0 12px 30px rgba(0,0,0,0.35));
                }
                
                .robot-active .robot-image {
                    filter: drop-shadow(0 0 25px rgba(0, 230, 230, 0.6));
                }
            `}</style>
        </button>
    )
}

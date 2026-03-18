'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

interface StaticNoiseProps {
    title?: string;
    message?: string;
    fullscreen?: boolean;
    onRetry?: () => void;
    showHomeButton?: boolean;
}

export default function StaticNoise({
    title = "NO SIGNAL",
    message = "CHANNEL LOST",
    fullscreen = false,
    onRetry,
    showHomeButton = true
}: StaticNoiseProps) {
    const [isActive, setIsActive] = useState(false);
    const [mounted, setMounted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Dynamic Channel Name Logic
    // e.g. "/about" -> "CH ABOUT", "/" -> "CH 01"
    const getChannelName = () => {
        if (!pathname || pathname === '/') return 'CH 01';

        // Remove leading slash, uppercase, and truncate to 8 chars for VCR look
        let cleanPath = pathname.substring(1).toUpperCase();
        // Remove any trailing slashes or sub-paths if you want just the top level
        // But for now, let's just take the first chunk
        const parts = cleanPath.split('/');
        if (parts.length > 0 && parts[0]) {
            cleanPath = parts[0];
        }

        if (cleanPath.length > 8) {
            cleanPath = cleanPath.substring(0, 8);
        }
        return `CH ${cleanPath}`;
    };

    const channelName = getChannelName();

    useEffect(() => {
        setMounted(true);
        // Small delay to ensure mount before opening animation
        const timer = setTimeout(() => setIsActive(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Realistic TV Static using Canvas (High Performance)
    useEffect(() => {
        if (!mounted) return;

        // We need to wait for the DOM element to be available if portal is used
        const rafId = requestAnimationFrame(() => {
            setupCanvas();
        });

        return () => cancelAnimationFrame(rafId);
    }, [mounted, fullscreen, isActive]);

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            if (fullscreen) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            } else if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const loop = () => {
            const w = canvas.width;
            const h = canvas.height;
            if (w === 0 || h === 0) return;

            const idata = ctx.createImageData(w, h);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;

            for (let i = 0; i < len; i++) {
                // High-performance random noise
                buffer32[i] = (Math.random() < 0.5) ? 0xff000000 : 0xffffffff;
            }

            ctx.putImageData(idata, 0, 0);
            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        (canvas as any)._cleanup = () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (canvasRef.current && (canvasRef.current as any)._cleanup) {
                (canvasRef.current as any)._cleanup();
            }
        }
    }, []);


    const handleToggle = () => {
        if (isActive) {
            setIsActive(false);
            if (showHomeButton) {
                setTimeout(() => router.push('/'), 600);
            }
        } else {
            setIsActive(true);
        }
    };

    const ComponentContent = (
        <div
            className={`relative flex items-center justify-center bg-[#202020] overflow-hidden select-none cursor-pointer transition-colors duration-1000 ease-out`}
            // Force viewport units when fullscreen to ignore parent containing block constraints
            style={{
                ...(fullscreen ? {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999,
                    margin: 0,
                    padding: 0,
                    borderRadius: 0,
                    inset: 'auto'
                } : {
                    width: '100%',
                    height: '100%',
                    minHeight: '400px',
                    borderRadius: '1rem'
                }),
                // Fade out background brightness when turning off, to reveal next page smoothly if loaded
                backgroundColor: isActive ? '#202020' : 'rgba(0,0,0,0)'
            }}
            onClick={handleToggle}
        >
            {/* REBOOT MESSAGE - Visible when "off" / transitioning */}
            {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <span className="text-white font-mono text-xl md:text-2xl tracking-[0.5em] animate-pulse font-bold"
                        style={{ fontFamily: '"Courier New", Courier, monospace', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                        SYSTEM REBOOTING...
                    </span>
                </div>
            )}

            <div
                id="tv-aperture"
                className={`relative overflow-hidden bg-black transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] z-10 ${isActive
                    ? 'w-full h-full rounded-none'
                    : 'w-0 h-0.5 opacity-0' // Shrink to nothing and fade out
                    }`}
                style={{
                    boxShadow: isActive ? 'none' : '0 0 20px 5px rgba(255,255,255,1)' // Bright flash when closing
                }}
            >
                {/* STATIC NOISE LAYER */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
                />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_90%,rgba(0,0,0,0.8)_100%)] z-10" />
                <div className="absolute inset-0 pointer-events-none z-20 opacity-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[length:100%_4px]" />

                {/* CONTENT OVERLAY - VCR STYLE */}
                <div className="relative z-50 flex flex-col items-center justify-center w-full h-full text-center pointer-events-none">
                    {/* "NO SIGNAL" Box Style */}
                    <div className="pointer-events-auto relative px-12 py-8 bg-black border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.8)] transform transition-transform hover:scale-105 duration-300">
                        <h1 className="text-5xl md:text-8xl font-bold tracking-widest text-white uppercase mb-4 animate-pulse whitespace-nowrap"
                            style={{
                                textShadow: '4px 4px 0px #333',
                                fontFamily: '"Courier New", Courier, monospace' // Forced retro font
                            }}
                        >
                            {title}
                        </h1>

                        {message && (
                            <p className="text-lg md:text-2xl text-zinc-300 uppercase tracking-[0.2em] mb-6 font-bold"
                                style={{ fontFamily: '"Courier New", Courier, monospace' }}
                            >
                                {message}
                            </p>
                        )}

                        {showHomeButton && isActive && (
                            <div className="mt-4 pt-6 border-t-2 border-white/20">
                                <button className="px-8 py-3 bg-white text-black font-bold text-base uppercase hover:bg-zinc-200 transition-colors tracking-wider"
                                    style={{ fontFamily: '"Courier New", Courier, monospace' }}
                                >
                                    REBOOT SYSTEM
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Channel Number / OSD Overlay (Top Right) */}
                    {isActive && (
                        <div className="absolute top-8 right-8 md:top-12 md:right-12 text-white text-2xl md:text-4xl font-bold tracking-widest drop-shadow-md opacity-80"
                            style={{ fontFamily: '"Courier New", Courier, monospace', textShadow: '2px 2px 0 #000' }}
                        >
                            {channelName}
                        </div>
                    )}

                    {/* Rec/Play Overlay (Top Left) */}
                    {isActive && (
                        <div className="absolute top-8 left-8 md:top-12 md:left-12 text-red-500 text-xl md:text-2xl font-bold tracking-widest animate-pulse drop-shadow-md"
                            style={{ fontFamily: '"Courier New", Courier, monospace', textShadow: '1px 1px 0 #000' }}
                        >
                            ● ERROR
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (fullscreen && mounted) {
        return createPortal(ComponentContent, document.body);
    }

    return ComponentContent;
}

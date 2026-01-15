'use client'

import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

interface Robot3DFABProps {
    onClick: () => void
    isActive?: boolean
}

function RobotModel({ isActive }: { isActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null)
    const { scene } = useGLTF('/3d_models/bot_nonanim.glb')
    const [hovered, setHovered] = useState(false)

    // Clone the scene to avoid issues with reusing
    const clonedScene = scene.clone()

    // Idle animation - gentle rotation and bobbing
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime

            // Gentle side-to-side rotation (like looking around)
            groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2

            // Slight tilt for personality
            groupRef.current.rotation.z = Math.sin(time * 0.7) * 0.05

            // Extra bounce when active
            if (isActive) {
                groupRef.current.position.y = Math.sin(time * 3) * 0.05
            }
        }
    })

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={hovered ? 1.1 : 1}
        >
            <primitive
                object={clonedScene}
                scale={1.5}
                position={[0, -0.5, 0]}
            />
        </group>
    )
}

function LoadingFallback() {
    return (
        <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#00e6e6" wireframe />
        </mesh>
    )
}

export function Robot3DFAB({ onClick, isActive = false }: Robot3DFABProps) {
    return (
        <button
            onClick={onClick}
            className="robot-3d-container"
            title="Chat with AI (Ctrl+K)"
            aria-label="Open AI Chat"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '120px',
                height: '140px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                zIndex: 50,
                outline: 'none',
                padding: 0,
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 3], fov: 50 }}
                style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto',
                }}
                gl={{ alpha: true, antialias: true }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#00e6e6" />

                {/* Environment for reflections */}
                <Environment preset="city" />

                {/* Robot with float animation */}
                <Suspense fallback={<LoadingFallback />}>
                    <Float
                        speed={2}
                        rotationIntensity={0.2}
                        floatIntensity={0.5}
                        floatingRange={[-0.1, 0.1]}
                    >
                        <RobotModel isActive={isActive} />
                    </Float>
                </Suspense>

                {/* Ground shadow */}
                <ContactShadows
                    position={[0, -1, 0]}
                    opacity={0.4}
                    scale={3}
                    blur={2}
                    far={2}
                />
            </Canvas>

            {/* Active glow effect */}
            {isActive && (
                <div
                    style={{
                        position: 'absolute',
                        inset: '-10px',
                        background: 'radial-gradient(circle, rgba(0, 230, 230, 0.4) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse-glow 1.5s ease-in-out infinite',
                        pointerEvents: 'none',
                        zIndex: -1,
                    }}
                />
            )}

            {/* Speech bubble when active */}
            {isActive && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '0px',
                        background: 'white',
                        padding: '6px 10px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center',
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            style={{
                                width: '6px',
                                height: '6px',
                                background: '#00e6e6',
                                borderRadius: '50%',
                                animation: `typing 1.4s ease-in-out infinite ${i * 0.2}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <style jsx global>{`
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-4px); opacity: 1; }
                }
            `}</style>
        </button>
    )
}

// Preload the model
useGLTF.preload('/3d_models/bot_nonanim.glb')

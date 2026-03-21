'use client'

import { motion } from 'framer-motion'
import {
    Code2,
    Users,
    Coffee,
    Terminal,
    Braces,
    FileCode2,
    Box,
    GitBranch,
    Database,
    PenTool,
    Rocket,
    ShieldCheck,
    MessageSquare,
    Zap
} from 'lucide-react'

// Content cut down to meaningful minimums for high impact
const WORK_PRINCIPLES = [
    { title: 'Ship Often', icon: Rocket, color: 'text-orange-500 bg-orange-500/10' },
    { title: 'Explainable Systems', icon: MessageSquare, color: 'text-indigo-500 bg-indigo-500/10' },
    { title: 'Durable Architecture', icon: ShieldCheck, color: 'text-teal-500 bg-teal-500/10' },
]

const ALL_TOOLS = [
    { name: 'Neovim', icon: Terminal },
    { name: 'VS Code', icon: Code2 },
    { name: 'TypeScript', icon: Braces },
    { name: 'Python', icon: FileCode2 },
    { name: 'Docker', icon: Box },
    { name: 'Git Actions', icon: GitBranch },
    { name: 'Supabase', icon: Zap },
    { name: 'PostgreSQL', icon: Database },
    { name: 'Figma', icon: PenTool },
]

const OFF_HOURS = ['Lo-fi playlists', 'Strategy games', 'Photography', 'Sci-fi reading', 'Coffee walks', 'Travel days']

export default function EngineeringBentoGrid() {
    return (
        <section className="w-full">
            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-[3px] bg-gradient-to-r from-[hsl(var(--accent))] to-transparent rounded-full" />
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-[hsl(var(--foreground))]">
                        Engineering Routine
                    </h2>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Principles Card */}
                <motion.article 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative overflow-hidden rounded-3xl p-6 lg:p-7 border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2.5 rounded-xl bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]">
                            <Code2 size={20} />
                        </div>
                        <h3 className="font-extrabold text-[hsl(var(--foreground))]">Core Principles</h3>
                    </div>
                    
                    <div className="flex flex-col gap-4 relative z-10">
                        {WORK_PRINCIPLES.map((item, i) => (
                            <motion.div 
                                key={item.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 group cursor-default"
                            >
                                <div className={`p-2.5 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={18} />
                                </div>
                                <span className="font-bold text-sm text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors">
                                    {item.title}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Decorative background glow */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[hsl(var(--accent))]/5 rounded-full blur-3xl" />
                </motion.article>

                {/* Daily Tools Card */}
                <motion.article 
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="relative overflow-hidden rounded-3xl p-6 lg:p-7 border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm col-span-1 lg:col-span-2 flex flex-col justify-between"
                >
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                            <Box size={20} />
                        </div>
                        <h3 className="font-extrabold text-[hsl(var(--foreground))]">Tech Stack & Tools</h3>
                    </div>

                    <div className="flex flex-wrap gap-3.5 relative z-10 overflow-visible py-1">
                        {ALL_TOOLS.map((tool, i) => (
                            <motion.div
                                key={tool.name}
                                whileHover={{ y: -5, scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[hsl(var(--muted))]/30 border border-transparent hover:border-[hsl(var(--accent))]/30 hover:shadow-sm cursor-default group transition-colors"
                            >
                                <tool.icon size={16} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))] transition-colors" />
                                <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors">{tool.name}</span>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Decorative background glow */}
                    <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                </motion.article>

                {/* Building In Public Card */}
                <motion.article 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative overflow-hidden rounded-3xl p-6 lg:p-7 border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/30 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]">
                            <Users size={20} />
                        </div>
                        <h3 className="font-extrabold text-[hsl(var(--foreground))]">Building In Public</h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[hsl(var(--muted-foreground))] mb-6 max-w-sm">
                        Proof of motion through public repos, system case-studies, and transparent roadmaps.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--accent))] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--accent))]"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--foreground))]">
                            Engine Running
                        </span>
                    </div>
                </motion.article>

                {/* Off Hours Card */}
                <motion.article 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative overflow-hidden rounded-3xl p-6 lg:p-7 border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                            <Coffee size={20} />
                        </div>
                        <h3 className="font-extrabold text-[hsl(var(--foreground))]">Off Hours</h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {OFF_HOURS.map((hobby, i) => (
                            <motion.span 
                                key={hobby}
                                whileHover={{ scale: 1.08, rotate: (i % 2 === 0 ? 3 : -3) }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, type: 'spring' }}
                                className="inline-flex items-center px-4 py-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-[0.7rem] uppercase tracking-wider font-bold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]/30 transition-colors cursor-default"
                            >
                                {hobby}
                            </motion.span>
                        ))}
                    </div>
                </motion.article>
            </div>
        </section>
    )
}

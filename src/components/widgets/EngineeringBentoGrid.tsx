'use client'

import { Zap, Shield, Target, GraduationCap, Users, ArrowUpRight, Clock, Award, Star } from 'lucide-react'
import Image from 'next/image'

export default function EngineeringBentoGrid() {
    return (
        <section className="py-8 md:py-16">
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                    Engineering & <span className="text-[var(--accent-primary)]">Background</span>
                </h3>
                <div className="h-px flex-1 bg-[var(--border-light)]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 1. Main Philosophy Card - Large & Vibrant (Like the Lime card) */}
                <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-[var(--accent-primary)] rounded-[32px] p-8 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <Zap className="text-white" size={18} fill="currentColor" />
                                <span className="text-xs font-bold text-white uppercase tracking-widest">Philosophy</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Star className="text-white animate-[spin_5s_linear_infinite]" size={18} />
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-4xl md:text-5xl font-black text-white leading-[0.9] mb-4">
                                BUILD.<br />SHIP.<br />SCALE.
                            </h4>
                            <div className="w-full bg-black/10 rounded-full h-1.5 mb-4 overflow-hidden">
                                <div className="bg-white h-full rounded-full w-[85%] animate-[width_2s_ease-out]" />
                            </div>
                            <div className="flex justify-between text-white/80 text-xs font-bold uppercase tracking-wider">
                                <span>Performance</span>
                                <span>99.9%</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            {['Pragmatic ML', 'Clean Arch', 'Security', 'User Centric'].map((tag, i) => (
                                <div key={i} className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm rounded-xl p-3 border border-white/5 cursor-default">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        <span className="text-[10px] font-bold text-white uppercase">{tag}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decorative Blob */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* 2. Education/Timeline Card (Like "Upcoming Meetings") */}
                <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-[32px] p-6 flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-black text-[var(--text-primary)] leading-tight">
                            Education<br />Journey
                        </h4>
                        <div className="px-3 py-1 bg-[var(--bg-primary)] rounded-full border border-[var(--border-light)] text-[10px] font-bold text-[var(--text-secondary)]">
                            Timeline
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {[
                            { title: "BSc Comp Sci", place: "Maseno Univ.", time: "2020-25", icon: GraduationCap, color: "text-[var(--accent-primary)]", bg: "bg-[var(--accent-primary)]/10" },
                            { title: "KCSE", place: "Starehe Boys", time: "2015-18", icon: Award, color: "text-orange-500", bg: "bg-orange-500/10" },
                            { title: "MLOps Spec.", place: "DeepLearning.AI", time: "2024", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        ].map((item, i) => (
                            <div key={i} className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--bg-primary)] transition-colors border border-transparent hover:border-[var(--border-light)]">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                                    <item.icon className={item.color} size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-[var(--text-primary)]">{item.title}</span>
                                    </div>
                                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">{item.place}</p>
                                </div>
                                <div className="ml-auto text-[10px] font-bold text-[var(--text-tertiary)] bg-white/50 px-2 py-0.5 rounded-md">
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fader for list */}
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent pointer-events-none" />
                </div>

                {/* 3. Dark Stats Card (Like "Efficiency") */}
                <div className="md:col-span-1 lg:col-span-1 row-span-1 bg-[#1a1a1a] rounded-[32px] p-6 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-xs font-medium text-white/60 mb-1">Total Impact</div>
                        <div className="text-3xl font-black text-white mb-4">120k+</div>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                +40% YoY
                            </div>
                            <span className="text-[10px] text-white/40">Lines of Code</span>
                        </div>

                        {/* Mini Chart */}
                        <div className="h-12 flex items-end gap-1">
                            {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-t-sm opacity-60 group-hover:opacity-100 transition-all duration-300"
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Mentorship & Community (Wide Card) */}
                <div className="md:col-span-2 lg:col-span-2 row-span-1 bg-white border border-[var(--border-light)] rounded-[32px] p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 min-w-0 z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-secondary)]">Community</span>
                        </div>
                        <h4 className="text-2xl font-black text-[var(--text-primary)] mb-2">Technical Mentor</h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                            Guiding the next generation of developers in Python, Cloud Native, and System Design.
                        </p>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 relative hover:z-10 hover:scale-110 transition-transform">
                                    <Users size={12} />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-[var(--accent-secondary)] flex items-center justify-center text-[10px] font-bold text-white relative z-10">
                                +50
                            </div>
                        </div>
                    </div>

                    {/* Image/Visual side */}
                    <div className="w-full md:w-48 h-32 md:h-full bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')] bg-cover bg-center opacity-80 hover:opacity-100 transition-opacity duration-500 scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-50" />
                        <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-black/5">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-center">Mentorship<br />Sessions</div>
                        </div>
                    </div>
                </div>

                {/* 5. Quick Stat / Status */}
                <div className="md:col-span-1 lg:col-span-1 bg-[var(--bg-tertiary)] rounded-[32px] p-6 flex flex-col items-center justify-center text-center group border border-transparent hover:border-[var(--accent-primary)] transition-all">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--accent-primary)] mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Clock size={20} />
                    </div>
                    <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-1">Timezone</div>
                    <div className="text-xl font-black text-[var(--text-primary)]">GMT+3</div>
                    <div className="text-[10px] text-[var(--text-tertiary)] font-medium">Nairobi, Kenya</div>
                </div>

                {/* 6. Values List (Like "3 Reasons") */}
                <div className="md:col-span-1 lg:col-span-1 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-light)] rounded-[32px] p-6 flex flex-col">
                    <h5 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wide mb-4">Core Focus</h5>
                    <div className="space-y-3 flex-1">
                        {['Velocity', 'Reliability', 'Quality'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center text-[10px] font-bold">
                                    {i + 1}
                                </div>
                                <span className="text-xs font-bold text-[var(--text-secondary)]">{item}</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 bg-[var(--text-primary)] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent-primary)] transition-colors">
                        View Principles
                    </button>
                </div>
            </div>
        </section>
    )
}

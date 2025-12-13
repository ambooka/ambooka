'use client'

import React from 'react'
import {
    Search, Bell, User, Settings, ChevronDown,
    Play, Pause, Briefcase, Clock,
    ArrowUpRight, MoreHorizontal, CheckCircle2
} from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-10 flex justify-center items-center">
            <div className="w-full max-w-[1600px] bg-[#EFECE6] rounded-[50px] overflow-hidden shadow-2xl p-8 lg:p-10 relative">

                {/* HEADER */}
                <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
                    <div className="px-6 py-2.5 rounded-full border border-black/5 bg-white/40 backdrop-blur-sm text-lg font-medium text-slate-800">
                        Crextio
                    </div>

                    <nav className="flex items-center bg-white/40 backdrop-blur-sm p-1.5 rounded-full border border-black/5 overflow-x-auto max-w-full no-scrollbar">
                        {['Dashboard', 'People', 'Hiring', 'Devices', 'Apps', 'Salary', 'Calendar', 'Reviews'].map((item, i) => (
                            <button
                                key={item}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${i === 0 ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-slate-500 hover:bg-white/50'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 border border-black/5 text-sm font-medium text-slate-600 hover:bg-white/60 transition-all">
                            <Settings size={18} />
                            <span>Setting</span>
                        </button>
                        <button className="w-11 h-11 rounded-full bg-white/40 border border-black/5 flex items-center justify-center text-slate-600 relative hover:bg-white/60 transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-400 rounded-full border border-white"></span>
                        </button>
                        <button className="w-11 h-11 rounded-full bg-white/40 border border-black/5 flex items-center justify-center text-slate-600 hover:bg-white/60 transition-all">
                            <User size={20} />
                        </button>
                    </div>
                </header>

                {/* HERO / WELCOME */}
                <section className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-8">
                    <div className="w-full lg:w-3/5">
                        <h1 className="text-5xl lg:text-6xl font-normal text-slate-800 mb-8 tracking-tight">
                            Welcome in, <span className="font-medium">Nixtio</span>
                        </h1>

                        {/* Stats Bar */}
                        <div className="w-full">
                            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-3">
                                <span className="w-[100px]">Interviews</span>
                                <span className="w-[100px]">Hired</span>
                                <span className="flex-grow">Project time</span>
                                <span className="w-[80px] text-right">Output</span>
                            </div>

                            <div className="flex items-center gap-2 p-1.5 bg-white/40 border border-white/50 rounded-full backdrop-blur-sm">
                                <div className="px-8 py-3.5 rounded-full bg-[#1A1A1A] text-white text-sm font-medium min-w-[100px] text-center">15%</div>
                                <div className="px-8 py-3.5 rounded-full bg-[#FACC15] text-[#1A1A1A] text-sm font-medium min-w-[100px] text-center">15%</div>

                                {/* Striped Bar */}
                                <div className="flex-grow h-12 bg-white/30 rounded-full relative overflow-hidden flex items-center px-4">
                                    {/* CSS Striped Pattern would go here */}
                                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InAiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDhMOCAwIiBzdHJva2U9IiMxYTFhMWEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwKSIgLz48L3N2Zz4=')]"></div>
                                    <span className="relative z-10 text-xs font-semibold text-slate-500">60%</span>
                                </div>

                                <div className="px-6 py-3.5 rounded-full border border-black/5 text-sm font-medium text-slate-500 min-w-[80px] text-center">10%</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Stats - Right Aligned */}
                    <div className="flex gap-12 lg:gap-16 pb-2">
                        {[
                            { val: '78', label: 'Employe' },
                            { val: '56', label: 'Hirings' },
                            { val: '203', label: 'Projects' }
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-5xl lg:text-6xl font-light text-slate-800 tracking-tighter hover:scale-105 transition-transform cursor-pointer">{stat.val}</div>
                                <div className="text-[10px] mobile:text-xs font-semibold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 min-h-[600px]">

                    {/* --- COL 1: Profile & Menu --- */}
                    <div className="flex flex-col gap-6">
                        {/* Profile Card */}
                        <div className="relative h-[380px] rounded-[40px] overflow-hidden group shadow-lg">
                            <div className="absolute inset-0 bg-[#A8A4CE]">
                                <img src="/assets/images/profile-warm.png" alt="Profile" className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                            <div className="absolute bottom-8 left-8">
                                <h2 className="text-2xl font-medium text-white mb-1">Lora Piterson</h2>
                                <p className="text-sm text-white/80">UX/UI Designer</p>
                            </div>
                            <div className="absolute bottom-8 right-8 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium">
                                $1,200
                            </div>
                        </div>

                        {/* Menu List */}
                        <div className="bg-[#FFFCF6] rounded-[40px] p-6 shadow-sm border border-black/5 flex-grow flex flex-col justify-between">
                            {/* Item 1 */}
                            <div className="flex justify-between items-center py-4 border-b border-dashed border-slate-200 cursor-pointer hover:bg-slate-50 rounded-xl px-2 transition-colors">
                                <span className="text-sm font-medium text-slate-500">Pension contributions</span>
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>

                            {/* Item 2 - Active */}
                            <div className="py-2">
                                <div className="flex justify-between items-center mb-3 px-2">
                                    <span className="text-sm font-semibold text-slate-800">Devices</span>
                                    <ChevronDown size={18} className="text-slate-800 rotate-180" />
                                </div>
                                <div className="flex items-center gap-4 bg-[#F2F3F5] p-3 rounded-2xl">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">💻</div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-bold text-slate-900">MacBook Air</div>
                                        <div className="text-[10px] font-medium text-slate-500">Version M1</div>
                                    </div>
                                    <MoreHorizontal className="text-slate-400" size={18} />
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex justify-between items-center py-4 border-t border-dashed border-slate-200 cursor-pointer hover:bg-slate-50 rounded-xl px-2 transition-colors">
                                <span className="text-sm font-medium text-slate-500">Compensation Summary</span>
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>
                            {/* Item 4 */}
                            <div className="flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 rounded-xl px-2 transition-colors">
                                <span className="text-sm font-medium text-slate-500">Employee Benefits</span>
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* --- COL 2 & 3: Middle Section --- */}
                    <div className="md:col-span-2 flex flex-col gap-6">

                        {/* Row 1: Charts */}
                        <div className="grid grid-cols-2 gap-6 h-[260px]">
                            {/* Progress Chart */}
                            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5 relative flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-800">Progress</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-light text-slate-900">6.1 h</span>
                                            <span className="text-[10px] font-medium text-slate-400 uppercase leading-tight">Work Time<br />this week</span>
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>

                                <div className="flex items-end gap-3 h-24 mt-2">
                                    {[30, 50, 40, 85, 55, 20].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                                            {i === 3 && (
                                                <div className="bg-[#FACC15] text-[#1A1A1A] text-[9px] font-bold px-2 py-1 rounded-md mb-[-5px] shadow-sm animate-bounce">
                                                    5h 23m
                                                </div>
                                            )}
                                            <div className="w-1.5 bg-slate-100 rounded-full h-full relative overflow-hidden group-hover:w-2 transition-all">
                                                <div className={`absolute bottom-0 w-full rounded-full ${i === 3 ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]'}`} style={{ height: `${h}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-300 group-hover:text-slate-500">{['S', 'M', 'T', 'W', 'T', 'F'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Time Tracker */}
                            <div className="bg-[#FFFAEB] rounded-[40px] p-8 shadow-sm border border-black/5 relative flex flex-col items-center justify-between">
                                <div className="w-full flex justify-between items-start">
                                    <h3 className="text-lg font-medium text-slate-800">Time tracker</h3>
                                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm hover:scale-110 transition-transform cursor-pointer">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>

                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    {/* SVG Circle */}
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="64" cy="64" r="56" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" />
                                        <circle cx="64" cy="64" r="56" fill="none" stroke="#FACC15" strokeWidth="6" strokeDasharray="350" strokeDashoffset="100" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute text-center">
                                        <div className="text-3xl font-light text-slate-900">02:35</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Work Time</div>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full justify-start pl-2">
                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm hover:shadow-md transition-all">
                                        <Play size={14} fill="currentColor" className="ml-0.5" />
                                    </button>
                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm hover:shadow-md transition-all">
                                        <Pause size={14} fill="currentColor" />
                                    </button>
                                </div>

                                <button className="absolute bottom-8 right-8 w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors">
                                    <Clock size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Row 2: Calendar */}
                        <div className="bg-[#FFFCF6] rounded-[40px] p-8 shadow-sm border border-black/5 flex-grow">
                            <div className="flex justify-between items-center mb-8">
                                <button className="px-5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50">August</button>
                                <span className="text-lg font-medium text-slate-800">September 2024</span>
                                <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm hover:shadow-md">October</button>
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-4 text-center mb-6">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                                    <div key={d} className={`flex flex-col gap-2 ${i === 2 ? 'opacity-100' : 'opacity-40'}`}>
                                        <span className="text-xs font-semibold text-slate-500">{d}</span>
                                        <span className={`text-xl ${i === 2 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{22 + i}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Timeline Events */}
                            <div className="space-y-6 relative">
                                {/* Event 1 */}
                                <div className="flex items-center gap-6">
                                    <span className="text-xs font-medium text-slate-400 w-12 text-right">8:00 am</span>
                                    <div className="flex-grow bg-[#1A1A1A] p-4 rounded-[24px] flex justify-between items-center text-white shadow-xl hover:scale-[1.01] transition-transform cursor-pointer">
                                        <div>
                                            <div className="text-sm font-bold">Weekly Team Sync</div>
                                            <div className="text-[10px] text-white/50 mt-0.5">Discuss progress on projects</div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-500 border-2 border-[#1A1A1A]"></div>
                                            <div className="w-7 h-7 rounded-full bg-slate-400 border-2 border-[#1A1A1A]"></div>
                                            <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-[#1A1A1A]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-6">
                                    <span className="text-xs font-medium text-slate-400 w-12 text-right">9:00 am</span>
                                    <div className="flex-grow border-b border-dashed border-slate-200"></div>
                                </div>

                                {/* Event 2 */}
                                <div className="flex items-center gap-6">
                                    <span className="text-xs font-medium text-slate-400 w-12 text-right">10:00 am</span>
                                    <div className="flex-grow bg-white border border-slate-100 p-4 rounded-[24px] flex justify-between items-center ml-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">Onboarding Session</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Introduction for new hires</div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {/* Avatar placeholders */}
                                            <img src="https://i.pravatar.cc/100?img=5" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                                            <img src="https://i.pravatar.cc/100?img=9" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- COL 4: Right Section --- */}
                    <div className="flex flex-col gap-6">

                        {/* Onboarding Status */}
                        <div className="bg-[#FFFAEB] rounded-[40px] p-6 h-[260px] flex flex-col justify-between shadow-sm border border-black/5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900">Onboarding</h3>
                                    <p className="text-xs text-slate-400 font-medium">Task Completion</p>
                                </div>
                                <span className="text-4xl font-light text-slate-900">18%</span>
                            </div>

                            {/* Horizontal Stacked Bar */}
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="h-12 w-[35%] bg-[#FACC15] rounded-[16px] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A] shadow-sm">Task</div>
                                <div className="h-12 w-[25%] bg-[#1A1A1A] rounded-[16px] shadow-sm"></div>
                                <div className="h-12 w-[15%] bg-[#1A1A1A]/10 rounded-[16px]"></div>
                            </div>

                            <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1 mt-auto">
                                <span>30%</span>
                                <span>25%</span>
                                <span>0%</span>
                            </div>
                        </div>

                        {/* Dark Task List */}
                        <div className="bg-[#1A1A1A] rounded-[40px] p-8 flex-grow flex flex-col relative overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10 z-10">
                                <h3 className="text-lg font-light text-white">Onboarding Task</h3>
                                <span className="text-xl font-light text-white/50">2/8</span>
                            </div>

                            <div className="space-y-6 flex-grow overflow-y-auto z-10 custom-scrollbar pr-2">
                                {/* Task Item 1 */}
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center text-lg bg-white/5 group-hover:bg-white/10 transition-colors">📺</div>
                                    <div className="flex-grow">
                                        <div className="text-xs font-bold text-white">Interview</div>
                                        <div className="text-[10px] text-white/40 mt-1">Sep 13, 08:30</div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-[#FACC15] flex items-center justify-center text-[#1A1A1A]">
                                        <CheckCircle2 size={12} strokeWidth={4} />
                                    </div>
                                </div>

                                {/* Task Item 2 */}
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center text-lg bg-white/5 group-hover:bg-white/10 transition-colors">⚡</div>
                                    <div className="flex-grow">
                                        <div className="text-xs font-bold text-white">Team-Meeting</div>
                                        <div className="text-[10px] text-white/40 mt-1">Sep 13, 10:30</div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-[#FACC15] flex items-center justify-center text-[#1A1A1A]">
                                        <CheckCircle2 size={12} strokeWidth={4} />
                                    </div>
                                </div>

                                {/* Task Item 3 (Inactive) */}
                                <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center text-lg">💬</div>
                                    <div className="flex-grow">
                                        <div className="text-xs font-bold text-white">Project Update</div>
                                        <div className="text-[10px] text-white/40 mt-1">Sep 13, 13:00</div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border border-white/30"></div>
                                </div>

                                {/* Task Item 4 (Inactive) */}
                                <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center text-lg">🔗</div>
                                    <div className="flex-grow">
                                        <div className="text-xs font-bold text-white">HR Policy Review</div>
                                        <div className="text-[10px] text-white/40 mt-1">Sep 13, 16:30</div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border border-white/30"></div>
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FACC15] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

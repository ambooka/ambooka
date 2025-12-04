"use client"
import "./test-styles.css";
import React, { useState } from 'react';
import {
    Settings,
    Bell,
    User,
    Code, // Replaced Users with Code
    Users,
    Briefcase, // Replaced UserPlus with Briefcase for Projects
    Github, // Replaced Monitor with Github for Repos
    ChevronRight,
    ChevronDown,
    MoreVertical,
    Play,
    Pause,
    BookOpen, // Replaced Clock with BookOpen for Blog
    ArrowUpRight,
    CheckCircle2,
    MessageSquare,
    FileText,
    Link as LinkIcon,
    Zap,
    Cpu, // New Icon for AI/ML Model Performance
    Target, // New Icon for Accuracy
    TrendingUp, // New Icon for F1 Score
    Maximize
} from 'lucide-react';

// --- Components ---

// NavButton: Now used for Portfolio Sections
const NavButton = ({ text, active = false }) => (
    <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? 'bg-[#2a2a2a] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
        {text}
    </button>
);

// IconButton: Now used for External Links (GitHub, LinkedIn)
const IconButton = ({ icon: Icon, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
        <Icon size={18} />
    </a>
);

// StatPill: Used for Skill/Achievement Highlights
const StatPill = ({ label, value, color, type = 'solid' }) => {
    if (type === 'solid') {
        return (
            <div className={`flex flex-col justify-center px-4 py-2 rounded-2xl ${color} h-full min-w-[100px]`}>
                <span className="text-xs font-medium mb-0.5 opacity-80">{label}</span>
                <span className="text-lg font-bold">{value}</span>
            </div>
        );
    } else if (type === 'striped') {
        return (
            <div className="flex flex-col justify-center px-4 py-2 rounded-2xl bg-gray-100 h-full relative overflow-hidden min-w-[160px]">
                {/* Subtle striping background effect */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
                <span className="text-xs font-medium mb-0.5 text-gray-500 z-10">{label}</span>
                <span className="text-lg font-bold z-10">{value}</span>
            </div>
        );
    } else {
        // Outline
        return (
            <div className="flex flex-col justify-center px-4 py-2 rounded-2xl border border-gray-300 h-full min-w-[90px]">
                <span className="text-xs font-medium mb-0.5 text-gray-500">{label}</span>
                <span className="text-lg font-bold">{value}</span>
            </div>
        );
    }
};

// HeaderStat: Used for Major Portfolio Metrics
const HeaderStat = ({ icon: Icon, value, label }) => (
    <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
            <Icon size={16} className="text-gray-400" />
            <span className="text-4xl font-light text-[#2a2a2a]">{value}</span>
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
);

// ProfileCard: The main identity section
const ProfileCard = () => (
    <div className="relative h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700 group">
        <img
            src="https://placehold.co/800x800/2a2a2a/ffffff?text=AI+Engineer"
            alt="Nixtio - AI Engineer"
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"; }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-semibold">Nixtio Dev</h3>
                    <p className="text-sm opacity-80">Software & AI Engineer</p>
                </div>
                <div className="bg-green-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium border border-white/20">
                    Available
                </div>
            </div>
        </div>
    </div>
);

// AccordionItem: Used for detailed skill/tech stack breakdown
const AccordionItem = ({ title, isOpen, toggle, children }) => (
    <div className="border-b border-gray-100 last:border-0">
        <button
            onClick={toggle}
            className="w-full flex items-center justify-between py-4 text-left group"
        >
            <span className="font-medium text-gray-700 group-hover:text-gray-900">{title}</span>
            {isOpen ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>
        {isOpen && (
            <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
);

// ChartBar: Used for GitHub Contribution Frequency
const ChartBar = ({ height, day, active = false, value }) => (
    <div className="flex flex-col items-center gap-2 group relative">
        {/* Tooltip/Value display */}
        {active && (
            <div className="absolute -top-10 bg-[#facc15] text-[#2a2a2a] text-xs font-bold py-1 px-2 rounded-lg shadow-sm whitespace-nowrap z-10 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#facc15]">
                {value}
            </div>
        )}
        {/* Bar container */}
        <div className="h-24 w-1.5 bg-gray-100 rounded-full relative flex items-end">
            <div
                className={`w-full rounded-full ${active ? 'bg-[#facc15]' : 'bg-[#2a2a2a]'}`}
                style={{ height: height }}
            ></div>
        </div>
        <span className="text-xs text-gray-400 font-medium">{day}</span>
    </div>
);

// TimeTracker: Used for current learning focus (Donut Chart)
const TimeTracker = () => (
    <div className="bg-[#fffdf5] p-6 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Domain Focus</h3>
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowUpRight size={18} className="text-gray-400" />
            </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Solid light gray track (r=55, cx/cy=64, dasharray=345) */}
                    <circle cx="64" cy="64" r="55" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    {/* Yellow progress arc (dashoffset 110 for ~68% progress) */}
                    {/* Dasharray for r=55 is 2 * pi * 55 = 345.57. Used 345 */}
                    <circle cx="64" cy="64" r="55" fill="none" stroke="#facc15" strokeWidth="8" strokeDasharray="345" strokeDashoffset="110" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-light text-[#2a2a2a]">68%</span>
                    <span className="text-xs text-gray-400 uppercase mt-1">Deep Learning</span>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-400 hover:text-[#facc15] hover:border-[#facc15] transition-all">
                    <Play size={16} fill="currentColor" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-400 hover:text-[#2a2a2a] transition-colors">
                    <Pause size={16} fill="currentColor" />
                </button>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center shadow-lg hover:bg-black transition-colors">
                <BookOpen size={18} />
            </button>
        </div>
    </div>
);

// TaskItem: Now used for Featured Projects
const ProjectItem = ({ title, stack, status, completed, index, total }) => {
    let StatusIcon = Github; // Default to a code-related icon
    if (status === 'Completed') StatusIcon = CheckCircle2;
    if (status === 'WIP') StatusIcon = Zap;
    if (status === 'Research') StatusIcon = FileText;
    if (status === 'Deployed') StatusIcon = LinkIcon;

    return (
        <div className="flex items-start gap-4 py-3 relative group">
            {/* Timeline line */}
            {index !== total - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-[1px] bg-gray-700/50"></div>
            )}

            {/* Completion Indicator (Square check) */}
            <div className="flex-shrink-0 mt-1 w-7 h-7 flex items-center justify-center">
                {completed ? (
                    <div className="w-5 h-5 rounded-lg bg-[#facc15] flex items-center justify-center">
                        <CheckCircle2 size={12} strokeWidth={2.5} color="#2a2a2a" />
                    </div>
                ) : (
                    <div className="w-5 h-5 rounded-lg border-2 border-gray-600 bg-transparent"></div>
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`text-sm font-medium ${completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>{title}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <StatusIcon size={12} />
                    <span>{stack} | {status}</span>
                </div>
            </div>
        </div>
    );
};

// New Component: AI Model Performance Metrics
const AIModelPerformance = () => {
    const MetricCard = ({ icon: Icon, title, value, unit, color }) => (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className={`p-2 rounded-full ${color} text-white`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-700">{title}</p>
                <p className="text-xl font-bold text-[#2a2a2a]">{value}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span></p>
            </div>
        </div>
    );

    return (
        <div className="bg-[#fffdf5] p-6 rounded-3xl border border-gray-100 flex-1 min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#2a2a2a] flex items-center gap-2">
                    <Cpu size={20} className="text-[#facc15]" />
                    ML Model Performance
                </h3>
                <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                    <Maximize size={18} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricCard
                    icon={Target}
                    title="Accuracy"
                    value="98.5"
                    unit="%"
                    color="bg-green-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="F1 Score"
                    value="0.96"
                    unit=""
                    color="bg-blue-600"
                />
            </div>

            <h4 className="text-sm font-medium text-gray-600 mb-3">Recent Model Training</h4>
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Model Version 3.1 (Stable)</span>
                    <span className="font-semibold">7 Days Uptime</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Inference Latency (P95)</span>
                    <span className="font-semibold">45 ms</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Data Drift Metric</span>
                    <span className="font-semibold text-green-600">Low</span>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [openAccordion, setOpenAccordion] = useState('Skills');

    // Defined heights for visual proportionality
    const TOP_SECTION_HEIGHT_CLS = 'h-64'; // Matches Profile Card height

    return (
        <div className="min-h-screen bg-[#e5e6eb] p-4 md:p-8 font-sans flex justify-center items-center">
            {/* Main Container / Portfolio Panel */}
            <div className="w-full max-w-[1400px] bg-[#fcfbf7] rounded-[40px] shadow-2xl p-6 md:p-8 overflow-hidden relative">

                {/* --- Header / Nav --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
                        <div className="border border-gray-300 rounded-full px-5 py-2">
                            <span className="font-semibold text-xl tracking-tight">Nixtio Dev</span>
                        </div>
                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1 bg-white/50 p-1 rounded-full border border-gray-100">
                            <NavButton text="About Me" active />
                            <NavButton text="Projects" />
                            <NavButton text="Experience" />
                            <NavButton text="Skills" />
                            <NavButton text="Blog" />
                            <NavButton text="Contact" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <IconButton icon={Github} href="https://github.com/nixtio" />
                        <IconButton icon={Users} href="https://linkedin.com/in/nixtio" />
                        <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* --- Welcome & Top Stats --- */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-light text-[#2a2a2a] mb-8">
                        Solving problems with <span className="font-medium">Intelligence & Code</span>
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Left Stats Pills (Achievements/Highlights) */}
                        <div className="flex flex-wrap gap-4">
                            <StatPill label="Yrs Experience" value="5+" color="bg-[#2a2a2a] text-white" />
                            <StatPill label="AI Models" value="15" color="bg-[#facc15] text-[#2a2a2a]" />
                            <div className="hidden md:block">
                                <StatPill label="Favorite Stack" value="Python/React" type="striped" />
                            </div>
                            <StatPill label="Client Rating" value="9.8/10" type="outline" />
                        </div>

                        {/* Right Big Numbers (Key Metrics) */}
                        <div className="flex items-center gap-8 md:gap-12 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0">
                            <HeaderStat icon={Briefcase} value="12" label="Projects" />
                            <HeaderStat icon={Code} value="56K" label="Lines of Code" />
                            <HeaderStat icon={Github} value="203" label="Commits" />
                        </div>
                    </div>
                </div>

                {/* --- Main Grid Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-fr">

                    {/* --- Column 1: Identity & Skills (3/12) --- */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <ProfileCard />

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
                            <div className="divide-y divide-gray-100">

                                {/* Accordion Item: Core Languages */}
                                <AccordionItem
                                    title="Core Languages"
                                    isOpen={openAccordion === 'Languages'}
                                    toggle={() => setOpenAccordion(openAccordion === 'Languages' ? '' : 'Languages')}
                                >
                                    <div className="text-sm text-gray-700 space-y-2 mt-2">
                                        <p className="font-semibold">Python (Advanced)</p>
                                        <p className="font-semibold">JavaScript/TypeScript (Full Stack)</p>
                                        <p className="font-semibold">GoLang (Microservices)</p>
                                        <p className="font-semibold">SQL (PostgreSQL, MongoDB)</p>
                                    </div>
                                </AccordionItem>

                                {/* Accordion Item: Tech Stack (Default Open) */}
                                <AccordionItem
                                    title="Tech Stack & Tools"
                                    isOpen={openAccordion === 'Skills'}
                                    toggle={() => setOpenAccordion(openAccordion === 'Skills' ? '' : 'Skills')}
                                >
                                    <div className="text-sm text-gray-700 space-y-3 mt-2">
                                        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                            <div className="w-12 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-xs font-semibold text-red-600">
                                                TF
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#2a2a2a]">Deep Learning Frameworks</p>
                                                <p className="text-xs text-gray-500">TensorFlow, PyTorch, Keras</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                            <div className="w-12 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-xs font-semibold text-blue-600">
                                                K8s
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#2a2a2a]">Deployment & DevOps</p>
                                                <p className="text-xs text-gray-500">Kubernetes, Docker, CI/CD, Terraform</p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionItem>

                                {/* Accordion Item: Professional Experience */}
                                <AccordionItem
                                    title="Professional Experience"
                                    isOpen={openAccordion === 'Experience'}
                                    toggle={() => setOpenAccordion(openAccordion === 'Experience' ? '' : 'Experience')}
                                >
                                    <div className="text-sm text-gray-500">5+ years in ML/Backend Development.</div>
                                </AccordionItem>

                                {/* Accordion Item: Certifications & Education */}
                                <AccordionItem
                                    title="Certifications & Education"
                                    isOpen={openAccordion === 'Certifications'}
                                    toggle={() => setOpenAccordion(openAccordion === 'Certifications' ? '' : 'Certifications')}
                                >
                                    <div className="text-sm text-gray-500">M.Sc. Computer Science. AWS Certified.</div>
                                </AccordionItem>
                            </div>
                        </div>
                    </div>

                    {/* --- Column 2: Activity & AI Model Metrics (5/12) --- */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Row: GitHub Activity & Domain Focus */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${TOP_SECTION_HEIGHT_CLS}`}>
                            {/* GitHub Activity Chart */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">GitHub Activity</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-3xl font-light text-[#2a2a2a]">6.1K</span>
                                            <span className="text-xs text-gray-500 max-w-[60px] leading-tight">Total Contributions 2024</span>
                                        </div>
                                    </div>
                                    <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                        <ArrowUpRight size={18} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end h-24 px-2">
                                    <ChartBar day="Mon" height="30%" value="12" />
                                    <ChartBar day="Tue" height="50%" value="20" />
                                    <ChartBar day="Wed" height="40%" value="16" />
                                    <ChartBar day="Thu" height="60%" value="24" />
                                    <ChartBar day="Fri" height="80%" active value="32" />
                                    <ChartBar day="Sat" height="45%" value="18" />
                                    <ChartBar day="Sun" height="20%" value="8" />
                                </div>
                            </div>

                            {/* Domain Focus Tracker (Donut Chart) */}
                            <TimeTracker />
                        </div>

                        {/* AI Model Performance Section (Replaced Project Roadmap) */}
                        <AIModelPerformance />
                    </div>

                    {/* --- Column 3: Project Summary & Featured List (4/12) --- */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Project Status Summary */}
                        <div className={`bg-[#fffdf5] p-6 rounded-3xl border border-gray-100 h-52`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[#2a2a2a]">Current Project: Apollo</h3>
                                <span className="text-3xl font-light text-[#2a2a2a]">80%</span>
                            </div>

                            {/* Project Phase Progress Bar */}
                            <div className="relative w-full mb-6 h-10">
                                <div className="flex w-full h-full">
                                    <div className="h-full bg-green-500 rounded-l-2xl flex items-center justify-center px-2" style={{ width: '45%' }}>
                                        <span className="text-xs font-semibold text-[#2a2a2a]">Data Prep</span>
                                    </div>
                                    <div className="h-full bg-[#facc15]" style={{ width: '35%' }}>
                                        <span className="text-xs font-semibold text-[#2a2a2a] pl-2">Modeling</span>
                                    </div>
                                    <div className="h-full bg-gray-300 rounded-r-2xl" style={{ width: '20%' }}>
                                        <span className="text-xs font-semibold text-gray-500 pl-2">Deployment</span>
                                    </div>
                                </div>

                                {/* Percentage Labels */}
                                <div className="absolute inset-x-0 bottom-[-1.25rem] flex text-xs text-gray-400">
                                    <span className="absolute" style={{ left: '15%' }}>45% Done</span>
                                    <span className="absolute" style={{ left: '55%' }}>35% In Progress</span>
                                    <span className="absolute" style={{ right: '5%' }}>20% To Go</span>
                                </div>
                            </div>
                        </div>

                        {/* Dark Featured Projects List Card */}
                        <div className="bg-[#1f1f1f] p-6 rounded-[32px] text-white flex-1 min-h-[400px]">
                            <div className="flex justify-between items-end mb-8 border-b border-gray-700/50 pb-4">
                                <h3 className="text-lg font-medium text-gray-200">Featured Projects</h3>
                                <span className="text-3xl font-light text-gray-300">5/12</span>
                            </div>

                            <div className="flex flex-col">
                                <ProjectItem
                                    title="LLM Chatbot for E-commerce"
                                    stack="Python, PyTorch, LangChain"
                                    status="Completed"
                                    completed={true}
                                    index={0}
                                    total={5}
                                />
                                <ProjectItem
                                    title="Real-Time Fraud Detection API"
                                    stack="Go, Kafka, Redis"
                                    status="Completed"
                                    completed={true}
                                    index={1}
                                    total={5}
                                />
                                <ProjectItem
                                    title="Serverless Image Processing Pipeline"
                                    stack="AWS Lambda, S3, Node.js"
                                    status="WIP"
                                    completed={false}
                                    index={2}
                                    total={5}
                                />
                                <ProjectItem
                                    title="Interactive Data Visualization Dashboard"
                                    stack="React, D3.js, FastAPI"
                                    status="WIP"
                                    completed={false}
                                    index={3}
                                    total={5}
                                />
                                <ProjectItem
                                    title="Quantum Machine Learning Study"
                                    stack="Qiskit, Python"
                                    status="Research"
                                    completed={false}
                                    index={4}
                                    total={5}
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
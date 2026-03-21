'use client'

<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
    GraduationCap, Users, Globe, Wrench, Terminal,
    BookOpen, Coffee, Music, Gamepad2, Camera, Plane,
    Quote, Sparkles, Rocket
} from 'lucide-react'

// ============================================================================
// DATA
// ============================================================================

const EDUCATION = [
    {
        degree: "BSc Computer Science",
        school: "Maseno University",
        year: "2019 — 2024",
        current: false,
        logo: "/assets/badges/maseno-university.png"
    },
    {
        degree: "KCSE",
        school: "Starehe Boys' Centre",
        year: "2015 — 2018",
        logo: "/images/starehe-logo.png"
    }
]

const LANGUAGES = [
    { name: "English", level: "Fluent", flag: "🇺🇸", percent: 95 },
    { name: "Swahili", level: "Native", flag: "🇰🇪", percent: 100 },
    { name: "Arabic", level: "Basic", flag: "🇸🇦", percent: 30 },
]

const METHODOLOGIES = [
    { name: "Trunk-Based Dev", icon: "🌿" },
    { name: "TDD", icon: "🧪" },
    { name: "GitOps", icon: "🔄" },
    { name: "Docs-First", icon: "📝" }
]

const DEV_TOOLS = [
    { name: "Neovim", icon: "⌨️" },
    { name: "VSCode", icon: "💻" },
    { name: "Arc", icon: "🌐" },
    { name: "Warp", icon: "⚡" },
    { name: "Obsidian", icon: "📓" },
    { name: "Linear", icon: "📋" }
]

const INTERESTS = [
    { icon: <Music size={14} />, label: "Lo-fi" },
    { icon: <Gamepad2 size={14} />, label: "Strategy" },
    { icon: <Camera size={14} />, label: "Photo" },
    { icon: <BookOpen size={14} />, label: "Sci-Fi" },
    { icon: <Coffee size={14} />, label: "Coffee" },
    { icon: <Plane size={14} />, label: "Travel" },
]

const QUOTES = [
    "The best code is the code you don't have to write.",
    "Simplicity is the ultimate sophistication.",
    "First, solve the problem. Then, write the code.",
    "Code is like humor. When you have to explain it, it's bad.",
    "Make it work, make it right, make it fast."
]

// ============================================================================
// MAIN COMPONENT - ENHANCED VISUAL DESIGN
// ============================================================================
export default function EngineeringBentoGrid() {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
    const [isQuoteFading, setIsQuoteFading] = useState(false)

    // Rotate quotes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsQuoteFading(true)
            setTimeout(() => {
                setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length)
                setIsQuoteFading(false)
            }, 300)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="about-summary">
            {/* Section Header with gradient accent */}
            <header className="section-header">
                <div className="header-content">
                    <h2>
                        <Sparkles size={20} className="header-icon" />
                        About Me
                    </h2>
                    <p>Background, interests, and how I work</p>
                </div>
            </header>

            {/* Enhanced Grid Layout */}
            <div className="summary-grid stagger-fade-in">

                {/* Education - Timeline with glow */}
                <div className="card card-education hover-lift card-accent-hover">
                    <div className="card-header icon-bounce">
                        <GraduationCap size={16} />
                        <span>Education</span>
                    </div>
                    <div className="edu-list">
                        {EDUCATION.map((edu, i) => (
                            <div key={i} className="edu-item">
                                <div className="edu-dot-wrapper">
                                    <span className={`edu-dot ${edu.current ? 'active pulse-dot' : ''}`} />
                                    {i < EDUCATION.length - 1 && <span className="edu-line" />}
                                </div>
                                <div className="edu-content">
                                    <div className="edu-main">
                                        {edu.logo && (
                                            <Image
                                                src={edu.logo}
                                                alt={edu.school}
                                                width={36}
                                                height={36}
                                                className="edu-logo"
                                                unoptimized
                                            />
                                        )}
                                        <div>
                                            <span className="edu-degree">{edu.degree}</span>
                                            <span className="edu-school">{edu.school}</span>
                                        </div>
                                    </div>
                                    <span className="edu-year">{edu.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Languages with progress bars */}
                <div className="card card-languages hover-lift card-accent-hover">
                    <div className="card-header icon-bounce">
                        <Globe size={16} />
                        <span>Languages</span>
                    </div>
                    <div className="lang-list">
                        {LANGUAGES.map((lang, i) => (
                            <div key={i} className="lang-item">
                                <span className="lang-flag">{lang.flag}</span>
                                <div className="lang-info">
                                    <div className="lang-top">
                                        <span className="lang-name">{lang.name}</span>
                                        <span className="lang-level">{lang.level}</span>
                                    </div>
                                    <div className="lang-bar">
                                        <div
                                            className="lang-bar-fill"
                                            style={{ width: `${lang.percent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Methodologies with icons */}
                <div className="card card-methods hover-lift card-accent-hover">
                    <div className="card-header icon-bounce">
                        <Terminal size={16} />
                        <span>How I Work</span>
                    </div>
                    <div className="tag-list">
                        {METHODOLOGIES.map((m, i) => (
                            <span key={i} className="tag tag-with-icon">
                                <span className="tag-icon">{m.icon}</span>
                                {m.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Rotating Quote with gradient background */}
                <div className="card card-quote hover-glow-purple">
                    <Quote size={24} className="quote-icon" />
                    <blockquote className={isQuoteFading ? 'fading' : ''}>
                        &ldquo;{QUOTES[currentQuoteIndex]}&rdquo;
                    </blockquote>
                    <div className="quote-dots">
                        {QUOTES.map((_, i) => (
                            <span
                                key={i}
                                className={`quote-dot ${i === currentQuoteIndex ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Dev Tools with icons */}
                <div className="card card-tools hover-lift card-accent-hover">
                    <div className="card-header icon-bounce">
                        <Wrench size={16} />
                        <span>Daily Drivers</span>
                    </div>
                    <div className="tag-list">
                        {DEV_TOOLS.map((tool, i) => (
                            <span key={i} className="tag tag-with-icon">
                                <span className="tag-icon">{tool.icon}</span>
                                {tool.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Community - Enhanced with personal story */}
                <div className="card card-community hover-lift card-accent-hover">
                    <div className="card-header icon-bounce">
                        <Users size={16} />
                        <span>Community</span>
                    </div>
                    <p className="card-text">
                        Building in public — sharing weekly Nexus progress on GitHub and writing case-study posts on ambooka.dev to document the CS → AI/ML transition.
                    </p>
                    <div className="community-stats">
                        <div className="community-stat">
                            <Rocket size={14} />
                            <span>26 months · 104 projects</span>
                        </div>
                    </div>
                </div>

                {/* Interests with hover effects */}
                <div className="card card-interests hover-lift card-accent-hover">
                    <div className="card-header">
                        <span className="emoji">✨</span>
                        <span>Off-Hours</span>
                    </div>
                    <div className="interests-list">
                        {INTERESTS.map((item, i) => (
                            <span key={i} className="interest-item hover-scale">
                                {item.icon}
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            <style jsx>{`
                .about-summary {
                    width: 100%;
                }

                .section-header {
                    margin-bottom: 1.5rem;
                }

                .header-content h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .header-icon {
                    color: var(--accent-primary);
                }

                .section-header p {
                    font-size: 0.8rem;
                    color: var(--text-tertiary);
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }

                .card {
                    background: var(--glass-bg);
                    backdrop-filter: var(--glass-blur);
                    -webkit-backdrop-filter: var(--glass-blur);
                    border: none;
                    box-shadow: var(--shadow-sm);
                    border-radius: 1rem;
                    padding: 1.25rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .card:hover {
                    border-color: var(--glass-border-hover);
                    transform: translateY(-4px);
                    box-shadow: var(--neu-shadow);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .card-header .emoji {
                    font-size: 1rem;
                }

                .card-text {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                /* Education */
                .card-education {
                    background: var(--surface-card);
                }

                .edu-list {
                    display: flex;
                    flex-direction: column;
                }

                .edu-item {
                    display: flex;
                    gap: 0.75rem;
                }

                .edu-dot-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 4px;
                }

                .edu-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: var(--border-medium);
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }

                .edu-dot.active {
                    background: var(--accent-primary);
                    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
                }

                .edu-line {
                    width: 2px;
                    flex: 1;
                    min-height: 16px;
                    background: linear-gradient(to bottom, var(--accent-primary), var(--border-light));
                    margin: 2px 0;
                }

                .edu-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    padding-bottom: 0.5rem;
                }

                .edu-main {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                .edu-logo {
                    width: 36px;
                    height: 42px;
                    object-fit: contain;
                    flex-shrink: 0;
                }

                .edu-degree {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .edu-school {
                    display: block;
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                }

                .edu-year {
                    font-size: 0.65rem;
                    color: var(--text-tertiary);
                    margin-top: 0.125rem;
                }

                /* Languages */
                .card-languages {
                    background: var(--surface-card);
                }

                .lang-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .lang-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                .lang-flag {
                    font-size: 1.25rem;
                    line-height: 1;
                }

                .lang-info {
                    flex: 1;
                }

                .lang-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.25rem;
                }

                .lang-name {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .lang-level {
                    font-size: 0.6rem;
                    color: var(--text-tertiary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .lang-bar {
                    height: 4px;
                    background: var(--bg-tertiary);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .lang-bar-fill {
                    height: 100%;
                    background: var(--gradient-primary);
                    border-radius: 2px;
                    transition: width 0.5s ease;
                }

                /* Tags */
                .tag-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.375rem;
                }

                .tag {
                    padding: 0.375rem 0.625rem;
                    background: var(--bg-tertiary);
                    border-radius: 0.375rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                }

                .tag:hover {
                    background: var(--accent-primary);
                    color: white;
                    transform: translateY(-1px);
                }

                .tag-with-icon {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                }

                .tag-icon {
                    font-size: 0.8rem;
                }

                /* Community */
                .card-community {
                    grid-column: span 2;
                    background: var(--surface-card);
                }

                .community-stats {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--border-light);
                }

                .community-stat {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--accent-primary);
                }

                /* Interests */
                .interests-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .interest-item {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.75rem;
                    background: var(--bg-tertiary);
                    border-radius: 1rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    cursor: default;
                    transition: all 0.2s ease;
                }

                .interest-item:hover {
                    background: var(--accent-primary);
                    color: white;
                }

                /* Quote */
                .card-quote {
                    background: radial-gradient(circle at 0% 0%, var(--bg-secondary) 0%, var(--bg-primary) 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .quote-icon {
                    color: var(--accent-tertiary);
                    opacity: 0.6;
                    margin-bottom: 0.5rem;
                }

                blockquote {
                    font-size: 0.85rem;
                    font-style: italic;
                    color: var(--text-primary);
                    line-height: 1.5;
                    transition: opacity 0.3s ease;
                }

                blockquote.fading {
                    opacity: 0.3;
                }

                .quote-dots {
                    display: flex;
                    gap: 0.375rem;
                    margin-top: 0.75rem;
                }

                .quote-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--border-medium);
                    transition: all 0.3s ease;
                }

                .quote-dot.active {
                    background: var(--accent-tertiary);
                    transform: scale(1.2);
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .summary-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .card-education {
                        grid-row: span 1;
                    }
                    
                    .card-community {
                        grid-column: span 2;
                    }
                }

                @media (max-width: 600px) {
                    .summary-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .card-community,
                    .card-education {
                        grid-column: span 1;
                    }
                }
            `}</style>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        </section>
    )
}

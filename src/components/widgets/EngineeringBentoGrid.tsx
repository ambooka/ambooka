'use client'

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
        year: "2020 — 2025",
        current: true,
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
                        Active mentor in open source communities, helping junior developers
                        break into tech through code reviews and pair programming.
                    </p>
                    <div className="community-stats">
                        <div className="community-stat">
                            <Rocket size={14} />
                            <span>10+ mentees</span>
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
        </section>
    )
}

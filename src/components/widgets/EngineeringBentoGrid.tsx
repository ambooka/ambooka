'use client'

import Image from 'next/image'
import {
    GraduationCap, Users, Globe, Wrench, Terminal,
    BookOpen, Coffee, Music, Gamepad2, Camera, Plane,
    Quote
} from 'lucide-react'

// ============================================================================
// DATA
// ============================================================================

const EDUCATION = [
    {
        degree: "BSc Computer Science",
        school: "Maseno University",
        year: "2020 — 2025",
        current: true
    },
    {
        degree: "KCSE",
        school: "Starehe Boys' Centre",
        year: "2015 — 2018",
        logo: "https://stareheboyscentre.ac.ke/wp-content/uploads/2023/10/cropped-SBC-Logo-Round.png"
    }
]

const LANGUAGES = [
    { name: "English", level: "Fluent", flag: "🇺🇸" },
    { name: "Swahili", level: "Native", flag: "🇰🇪" },
    { name: "Arabic", level: "Basic", flag: "🇸🇦" },
]

const METHODOLOGIES = ["Trunk-Based Dev", "TDD", "GitOps", "Docs-First"]

const DEV_TOOLS = ["Neovim", "iTerm2", "Arc", "Raycast", "Obsidian", "Linear"]

const INTERESTS = [
    { icon: <Music size={14} />, label: "Lo-fi" },
    { icon: <Gamepad2 size={14} />, label: "Strategy" },
    { icon: <Camera size={14} />, label: "Photo" },
    { icon: <BookOpen size={14} />, label: "Sci-Fi" },
    { icon: <Coffee size={14} />, label: "Coffee" },
    { icon: <Plane size={14} />, label: "Travel" },
]

// ============================================================================
// MAIN COMPONENT - CLEAN, CONSISTENT DESIGN
// ============================================================================
export default function EngineeringBentoGrid() {
    return (
        <section className="about-summary">
            {/* Section Header */}
            <header className="section-header">
                <h2>About Me</h2>
                <p>Background, interests, and how I work</p>
            </header>

            {/* Clean Grid Layout */}
            <div className="summary-grid">

                {/* Education */}
                <div className="card card-education">
                    <div className="card-header">
                        <GraduationCap size={16} />
                        <span>Education</span>
                    </div>
                    <div className="edu-list">
                        {EDUCATION.map((edu, i) => (
                            <div key={i} className="edu-item">
                                <div className="edu-dot-wrapper">
                                    <span className={`edu-dot ${edu.current ? 'active' : ''}`} />
                                    {i < EDUCATION.length - 1 && <span className="edu-line" />}
                                </div>
                                <div className="edu-content">
                                    <div className="edu-main">
                                        {edu.logo && (
                                            <Image
                                                src={edu.logo}
                                                alt={edu.school}
                                                width={20}
                                                height={20}
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

                {/* Languages */}
                <div className="card card-languages">
                    <div className="card-header">
                        <Globe size={16} />
                        <span>Languages</span>
                    </div>
                    <div className="lang-list">
                        {LANGUAGES.map((lang, i) => (
                            <div key={i} className="lang-item">
                                <span className="lang-flag">{lang.flag}</span>
                                <span className="lang-name">{lang.name}</span>
                                <span className="lang-level">{lang.level}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Methodologies */}
                <div className="card card-methods">
                    <div className="card-header">
                        <Terminal size={16} />
                        <span>How I Work</span>
                    </div>
                    <div className="tag-list">
                        {METHODOLOGIES.map((m, i) => (
                            <span key={i} className="tag">{m}</span>
                        ))}
                    </div>
                </div>

                {/* Dev Tools */}
                <div className="card card-tools">
                    <div className="card-header">
                        <Wrench size={16} />
                        <span>Daily Drivers</span>
                    </div>
                    <div className="tag-list">
                        {DEV_TOOLS.map((tool, i) => (
                            <span key={i} className="tag">{tool}</span>
                        ))}
                    </div>
                </div>

                {/* Community */}
                <div className="card card-community">
                    <div className="card-header">
                        <Users size={16} />
                        <span>Community</span>
                    </div>
                    <p className="card-text">
                        Active mentor in open source communities, helping junior developers
                        break into tech through code reviews and pair programming.
                    </p>
                </div>

                {/* Interests */}
                <div className="card card-interests">
                    <div className="card-header">
                        <span className="emoji">✨</span>
                        <span>Off-Hours</span>
                    </div>
                    <div className="interests-list">
                        {INTERESTS.map((item, i) => (
                            <span key={i} className="interest-item">
                                {item.icon}
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Quote */}
                <div className="card card-quote">
                    <Quote size={20} className="quote-icon" />
                    <blockquote>
                        &ldquo;The best code is the code you don&apos;t have to write.&rdquo;
                    </blockquote>
                </div>

            </div>

            <style jsx>{`
                .about-summary {
                    width: 100%;
                }

                .section-header {
                    margin-bottom: 1.5rem;
                }

                .section-header h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
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
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-light);
                    border-radius: 1rem;
                    padding: 1.25rem;
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
                    grid-row: span 2;
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
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--border-medium);
                    flex-shrink: 0;
                }

                .edu-dot.active {
                    background: var(--accent-primary);
                }

                .edu-line {
                    width: 1px;
                    flex: 1;
                    min-height: 24px;
                    background: var(--border-light);
                    margin: 4px 0;
                }

                .edu-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.125rem;
                    padding-bottom: 1rem;
                }

                .edu-main {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                .edu-logo {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    background: white;
                    margin-top: 2px;
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
                .lang-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .lang-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .lang-flag {
                    font-size: 1.1rem;
                }

                .lang-name {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    flex: 1;
                }

                .lang-level {
                    font-size: 0.65rem;
                    color: var(--text-tertiary);
                    padding: 0.2rem 0.5rem;
                    background: var(--bg-tertiary);
                    border-radius: 0.25rem;
                }

                /* Tags (Methodologies & Tools) */
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
                }

                /* Community */
                .card-community {
                    grid-column: span 2;
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
                    padding: 0.375rem 0.625rem;
                    background: var(--bg-tertiary);
                    border-radius: 1rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                }

                /* Quote */
                .card-quote {
                    background: var(--bg-tertiary);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .quote-icon {
                    color: var(--accent-primary);
                    opacity: 0.5;
                    margin-bottom: 0.5rem;
                }

                blockquote {
                    font-size: 0.85rem;
                    font-style: italic;
                    color: var(--text-primary);
                    line-height: 1.4;
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

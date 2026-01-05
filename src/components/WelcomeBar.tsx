'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { GitHubService } from '@/services/github'

const GITHUB_USERNAME = 'ambooka'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

export default function WelcomeBar() {
    const [expertise] = useState({
        mlops: 30,
        cloud: 25,
        devops: 30,
        development: 15
    })

    const [yearsExp] = useState('3+')
    const [skillCount, setSkillCount] = useState(40)
    const [projectCount, setProjectCount] = useState(25)

    useEffect(() => {
        (async () => {
            try {
                // Fetch skills count from DB
                const { count: skillsCount } = await supabase
                    .from('skills')
                    .select('id', { count: 'exact', head: true })

                if (skillsCount !== null && skillsCount > 0) {
                    setSkillCount(skillsCount)
                }

                // Fetch project count from GitHub directly (including private repos)
                const githubService = new GitHubService(GITHUB_TOKEN)
                const repos = await githubService.getRepositories(GITHUB_USERNAME, {
                    maxRepos: 100,
                    sortBy: 'updated',
                    includePrivate: Boolean(GITHUB_TOKEN)
                })

                if (repos.length > 0) {
                    setProjectCount(repos.length)
                }
            } catch (e) {
                console.error('Error fetching stats:', e)
            }
        })()
    }, [])

    const segments = [
        { label: 'Cloud', pct: expertise.cloud, type: 'dark' },
        { label: 'DevOps', pct: expertise.devops, type: 'yellow' },
        { label: 'MLOps', pct: expertise.mlops, type: 'striped' },
        { label: 'Dev', pct: expertise.development, type: 'light' }
    ]

    return (
        <section className="welcome-bar">
            <div className="welcome-left">
                <h3 className="welcome-title">Build Fast. <span>Deploy Faster. Scale Smart.</span></h3>

                <div className="segments-container">
                    {segments.map((seg, i) => (
                        <div key={i} className="segment-wrapper" style={{ flex: seg.pct }}>
                            <span className="segment-label">{seg.label}</span>
                            <div className={`segment ${seg.type}`}>
                                <span className="segment-value">{seg.pct}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="welcome-stats">
                <div className="welcome-stat">
                    <div className="stat-row">
                        <svg className="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="8" r="5" />
                            <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
                        </svg>
                        <span className="welcome-stat-value">{yearsExp}</span>
                    </div>
                    <span className="welcome-stat-label">Years</span>
                </div>
                <div className="welcome-stat">
                    <div className="stat-row">
                        <svg className="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span className="welcome-stat-value">{skillCount}</span>
                    </div>
                    <span className="welcome-stat-label">Skills</span>
                </div>
                <div className="welcome-stat">
                    <div className="stat-row">
                        <svg className="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        <span className="welcome-stat-value">{projectCount}</span>
                    </div>
                    <span className="welcome-stat-label">Projects</span>
                </div>
            </div>

            <style jsx>{`
                .segments-container {
                    display: flex;
                    gap: 6px;
                    align-items: flex-end;
                    max-width: 500px;
                }

                .segment-wrapper {
                    display: flex;
                    flex-direction: column;
                    min-width: 50px;
                }

                .segment-label {
                    font-size: 0.72rem;
                    color: #555;
                    font-weight: 400;
                    margin-bottom: 4px;
                }

                .segment {
                    height: 28px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .segment.dark {
                    background: #333;
                }

                .segment.yellow {
                    background: #F7DC6F;
                }

                .segment.striped {
                    background: repeating-linear-gradient(-55deg,
                        #ddd,
                        #ddd 8px,
                        #fff 8px,
                        #fff 10px);
                }

                .segment.light {
                    background: #fff;
                    border: 1px solid #ddd;
                }

                .segment-value {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #fff;
                }

                .segment.yellow .segment-value {
                    color: #333;
                }

                .segment.striped .segment-value {
                    color: #555;
                }

                .segment.light .segment-value {
                    color: #555;
                }

                .stat-row {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .welcome-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }

                .welcome-stat-value {
                    font-size: 2rem;
                    font-weight: 300;
                    color: #333;
                    line-height: 1;
                }

                .welcome-stat-label {
                    font-size: 0.7rem;
                    color: #888;
                    font-weight: 400;
                }

                .stat-icon {
                    color: #888;
                }
            `}</style>
        </section>
    )
}

'use client'

import './test-styles.css'
import { Settings, Bell, User, ChevronDown, ArrowUpRight, Play, Pause, Circle, CheckCircle, Monitor } from 'lucide-react'

export default function PortfolioTestLayout() {
    return (
        <div className="test-dashboard">
            <div className="test-container">

                {/* Header */}
                <header className="test-header">
                    <div className="test-logo">Crextio</div>

                    <nav className="test-nav">
                        <button className="test-nav-btn active">Dashboard</button>
                        <button className="test-nav-btn">People</button>
                        <button className="test-nav-btn">Hiring</button>
                        <button className="test-nav-btn">Devices</button>
                        <button className="test-nav-btn">Apps</button>
                        <button className="test-nav-btn">Salary</button>
                        <button className="test-nav-btn">Calendar</button>
                        <button className="test-nav-btn">Reviews</button>
                        <button className="test-icon-btn"><Settings size={20} /></button>
                        <button className="test-icon-btn">
                            <Bell size={20} />
                            <span className="test-notification-dot"></span>
                        </button>
                        <button className="test-icon-btn"><User size={20} /></button>
                    </nav>
                </header>

                {/* Welcome Section */}
                <div className="test-welcome">
                    <h1 className="test-title">Welcome in, Nixtio</h1>

                    <div className="test-tabs">
                        <div className="test-tab-group">
                            <span className="test-tab-label">Interviews</span>
                            <div className="test-tab-value dark">15%</div>
                        </div>
                        <div className="test-tab-group">
                            <span className="test-tab-label">Hired</span>
                            <div className="test-tab-value yellow">15%</div>
                        </div>
                        <div className="test-tab-group">
                            <span className="test-tab-label">Project Time</span>
                            <div className="test-tab-value light">60%</div>
                        </div>
                        <div className="test-tab-group">
                            <span className="test-tab-label">Output</span>
                            <div className="test-tab-value light">10%</div>
                        </div>
                    </div>

                    <div className="test-stats-row">
                        <div className="test-stat-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="test-stat-icon">
                                <rect x="6" y="10" width="3" height="8" fill="currentColor" />
                                <rect x="10.5" y="6" width="3" height="12" fill="currentColor" />
                                <rect x="15" y="8" width="3" height="10" fill="currentColor" />
                            </svg>
                            <div>
                                <div className="test-stat-number">78</div>
                                <div className="test-stat-label">Employe</div>
                            </div>
                        </div>
                        <div className="test-stat-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="test-stat-icon">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <div>
                                <div className="test-stat-number">56</div>
                                <div className="test-stat-label">Hirings</div>
                            </div>
                        </div>
                        <div className="test-stat-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="test-stat-icon">
                                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <div>
                                <div className="test-stat-number">203</div>
                                <div className="test-stat-label">Projects</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="test-grid">

                    {/* Left Column */}
                    <div className="test-left-col">
                        {/* Profile Card */}
                        <div className="test-card light-gray">
                            <div style={{ position: 'relative' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                                    alt="Lora Piterson"
                                    className="test-profile-img"
                                />
                                <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: 'white' }}>
                                    <h3 className="test-profile-name">Lora Piterson</h3>
                                    <p className="test-profile-title">UX/UI Designer</p>
                                </div>
                                <div className="test-profile-salary">$1,200</div>
                            </div>
                        </div>

                        {/* Dropdowns */}
                        <div className="test-dropdown">
                            <div className="test-dropdown-header">
                                Pension contributions
                                <ChevronDown size={16} />
                            </div>
                        </div>

                        <div className="test-dropdown">
                            <div className="test-dropdown-header">
                                Devices
                                <ChevronDown size={16} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                            <div className="test-dropdown-content">
                                <div className="test-device-item">
                                    <div className="test-device-icon">
                                        <Monitor size={24} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="test-device-name">MacBook Air</div>
                                        <div className="test-device-version">Version 14.1</div>
                                    </div>
                                    <button style={{ padding: '4px' }}>
                                        <svg width="4" height="16" viewBox="0 0 4 16" fill="#666">
                                            <circle cx="2" cy="2" r="2" />
                                            <circle cx="2" cy="8" r="2" />
                                            <circle cx="2" cy="14" r="2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="test-dropdown">
                            <div className="test-dropdown-header">
                                Compensation Summary
                                <ChevronDown size={16} />
                            </div>
                        </div>

                        <div className="test-dropdown">
                            <div className="test-dropdown-header">
                                Employee Benefits
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Middle Column */}
                    <div className="test-middle-col">
                        {/* Progress Widget */}
                        <div className="test-card">
                            <div className="test-progress-header">
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>Progress</h3>
                                    <div className="test-progress-time">
                                        <span className="test-progress-hours">6.1</span>
                                        <span className="test-progress-unit">h</span>
                                    </div>
                                    <p className="test-progress-label">Work Time<br />this week</p>
                                </div>
                                <button className="test-icon-btn"><ArrowUpRight size={20} /></button>
                            </div>

                            <div className="test-chart">
                                {[30, 50, 60, 45, 80, 35, 25].map((height, idx) => (
                                    <div key={idx} className="test-bar-container">
                                        <div className={`test-bar ${idx === 4 ? 'highlight' : ''}`} style={{ height: `${height}%` }}>
                                            {idx === 4 && <div className="test-bar-label">9h 25m</div>}
                                        </div>
                                        <span className="test-day-label">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="test-card">
                            <div className="test-calendar-nav">
                                <span className="test-calendar-month">August</span>
                                <span className="test-calendar-current">September 2024</span>
                                <span className="test-calendar-month">October</span>
                            </div>

                            <div className="test-week-grid">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                    <div key={day} className="test-week-day">
                                        <div className="test-week-label">{day}</div>
                                        <div className="test-week-date">{23 + idx}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                <div className="test-event-time">8:00 am</div>
                                <div className="test-event-time">9:00 am</div>

                                <div className="test-event dark">
                                    <div className="test-event-header">
                                        <span className="test-event-title">Weekly Team Sync</span>
                                        <div className="test-avatars">
                                            <div className="test-avatar" style={{ background: '#6b7280', borderColor: '#111827' }}></div>
                                            <div className="test-avatar" style={{ background: '#9ca3af', borderColor: '#111827' }}></div>
                                            <div className="test-avatar" style={{ background: '#d1d5db', borderColor: '#111827' }}></div>
                                        </div>
                                    </div>
                                    <p className="test-event-desc">Discuss progress on projects</p>
                                </div>

                                <div className="test-event-time" style={{ marginTop: '12px' }}>10:00 am</div>
                                <div className="test-event-time">11:00 am</div>

                                <div className="test-event light">
                                    <div className="test-event-header">
                                        <span className="test-event-title">Onboarding Session</span>
                                        <div className="test-avatars">
                                            <div className="test-avatar" style={{ background: '#d1d5db', borderColor: 'white' }}></div>
                                            <div className="test-avatar" style={{ background: '#9ca3af', borderColor: 'white' }}></div>
                                        </div>
                                    </div>
                                    <p className="test-event-desc">Introduction for new hires</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="test-right-col">
                        {/* Time Tracker */}
                        <div className="test-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 500 }}>Time tracker</h3>
                                <button className="test-icon-btn"><ArrowUpRight size={20} /></button>
                            </div>

                            <div className="test-timer-circle">
                                <svg className="test-timer-svg">
                                    <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeDasharray="2 6" />
                                    <circle cx="80" cy="80" r="70" fill="none" stroke="#fbbf24" strokeWidth="12" strokeDasharray="330 440" strokeLinecap="round" />
                                </svg>
                                <div className="test-timer-content">
                                    <div className="test-timer-time">02:35</div>
                                    <div className="test-timer-label">Work Time</div>
                                </div>
                            </div>

                            <div className="test-timer-controls">
                                <button className="test-control-btn"><Play size={20} fill="currentColor" /></button>
                                <button className="test-control-btn"><Pause size={20} /></button>
                                <button className="test-control-btn primary"><Circle size={16} /></button>
                            </div>
                        </div>

                        {/* Onboarding */}
                        <div className="test-card dark">
                            <div className="test-onboarding-header">
                                <h3 className="test-onboarding-title">Onboarding</h3>
                                <div className="test-onboarding-percent">18%</div>
                            </div>

                            <div className="test-progress-bar-container">
                                <span className="test-progress-text">30%</span>
                                <div className="test-progress-bar">
                                    <div className="test-progress-segment yellow" style={{ width: '30%' }}></div>
                                    <div className="test-progress-segment gray" style={{ width: '25%' }}></div>
                                    <div className="test-progress-segment light-gray" style={{ width: '45%' }}></div>
                                </div>
                                <span className="test-progress-text">25%</span>
                                <span className="test-progress-text">0%</span>
                            </div>

                            <div className="test-task-header">Task</div>
                            <div className="test-task-title-row">
                                <span className="test-task-title">Onboarding Task</span>
                                <span className="test-task-count">2/8</span>
                            </div>

                            <div className="test-task-list">
                                <div className="test-task-item">
                                    <div className="test-task-icon complete">
                                        <Circle size={16} color="#fbbf24" />
                                    </div>
                                    <div className="test-task-info">
                                        <div className="test-task-name">Interview</div>
                                        <div className="test-task-date">Sep 13, 08:00</div>
                                    </div>
                                    <CheckCircle size={16} className="test-task-check" />
                                </div>

                                <div className="test-task-item">
                                    <div className="test-task-icon complete">
                                        <Circle size={16} color="#fbbf24" />
                                    </div>
                                    <div className="test-task-info">
                                        <div className="test-task-name">Team Meetings</div>
                                        <div className="test-task-date">Sep 13, 10:30</div>
                                    </div>
                                    <CheckCircle size={16} className="test-task-check" />
                                </div>

                                <div className="test-task-item">
                                    <div className="test-task-icon pending">
                                        <Circle size={20} color="white" />
                                    </div>
                                    <div className="test-task-info">
                                        <div className="test-task-name">Project Update</div>
                                        <div className="test-task-date">Sep 15, 15:00</div>
                                    </div>
                                </div>

                                <div className="test-task-item">
                                    <div className="test-task-icon pending">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M12 2v20M2 12h20" />
                                        </svg>
                                    </div>
                                    <div className="test-task-info">
                                        <div className="test-task-name">Discuss Q3 Goals</div>
                                        <div className="test-task-date">Sep 13, 14:45</div>
                                    </div>
                                </div>

                                <div className="test-task-item">
                                    <div className="test-task-icon pending">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M9 12l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className="test-task-info">
                                        <div className="test-task-name">HR Policy Review</div>
                                        <div className="test-task-date">Sep 13, 16:30</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

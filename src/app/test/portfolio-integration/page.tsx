'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
    Search, Settings, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, MoreHorizontal, Play, Pause, Expand,
    ArrowUpRight, CheckCircle2, AlertCircle, ExternalLink, EyeIcon, Phone, MessageSquare,
    Code, Cloud, Database, Activity, Shield, Terminal, Server, Lock,
    Brain, Bot, BrainCircuit, Layers, Box, Cpu, Workflow,
    Zap, GitBranch, Github, Linkedin, Mail, MapPin, Send,
    Globe, Star, Sparkles, Calendar, Book, Briefcase,
    Loader2, User, FileText, Clock, Users, FolderGit2, TrendingUp, Laptop,
    Sun, Moon, ArrowUp
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { CareerTimeline } from '@/components/mlops/CareerTimeline'
import { GitHubService, GitHubRepo } from '@/services/github'

// ============================================================================
// DESIGN SYSTEM (CREXTIO)
// ============================================================================
const BOARD_RADIUS = 'rounded-[40px]'
const CARD_RADIUS = 'rounded-[32px]'
const CREAM_BG = '#FFFDF9'
const WARM_CREAM = '#FFF9E6'
const GOLD = '#FACC15'
const BLACK = '#1A1A1A'
const PURPLE = '#A8A4CE'

// ============================================================================
// TYPES
// ============================================================================
type ViewState = 'overview' | 'portfolio' | 'resume' | 'blog' | 'contact'

interface Project { id: string | number; title: string; description: string; status: string; stack: string[]; is_featured: boolean; github_url?: string; live_url?: string; stars?: number; language?: string }
interface Skill { id: string | number; name: string; proficiency: number; category: string }
interface AboutContent { id: string; section_key: string; title: string | null; content: string; icon: string | null; badge: string | null; tags?: string[]; competencies?: string[] }
interface Testimonial { id: string; name: string; avatar_url: string | null; text: string; date: string }
interface Technology { id: string; name: string; logo_url: string; category: string }
interface Experience { id: string; company: string; position: string; start_date: string; end_date: string | null; is_current: boolean; description: string | null; technologies: string[] | null; responsibilities?: string[] | null; achievements?: string[] | null; location?: string | null }
interface Education { id: string; institution: string; degree: string | null; field_of_study: string | null; start_date: string; end_date: string | null; is_current: boolean }
interface BlogPost { id: string; title: string; excerpt: string | null; category: string; published_at: string | null; image_url: string | null }
interface PersonalInfo { id: string; full_name: string; title: string; email: string; phone: string | null; location: string | null; summary: string | null; linkedin_url: string | null; github_url: string | null }
interface SocialLink { id: string; platform: string; url: string; icon_url: string | null; display_order: number }
interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }

// ============================================================================
// ICON + LOGO MAPS
// ============================================================================
const iconMap: Record<string, React.ComponentType<{ className?: string, size?: number }>> = { BrainCircuit, Layers, Box, Cpu, Workflow, Brain, Code, Bot, Cloud, Database, Shield, Terminal, Server, Activity, Lock }

const LOGO_MAP: Record<string, string> = {
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
    'Terraform': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
    'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'FastAPI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
}

// ============================================================================
// FALLBACK DATA (11 EXPERTISE AREAS FROM ABOUT.TSX)
// ============================================================================
const FALLBACK_EXPERTISE: AboutContent[] = [
    { id: 'exp1', section_key: 'expertise_devops', title: 'DevOps & CI/CD', content: 'Automating the software lifecycle with robust CI/CD pipelines.', icon: 'Workflow', badge: 'Proficient', tags: ['Docker', 'GitHub Actions', 'Linux', 'Terraform'], competencies: ['GitOps workflow', 'Container orchestration', 'IaC with Terraform', 'Automated testing'] },
    { id: 'exp2', section_key: 'expertise_cloud', title: 'Cloud Architecture', content: 'Designing scalable cloud-native systems on AWS and Azure.', icon: 'Cloud', badge: 'Competent', tags: ['AWS', 'Azure', 'S3', 'IAM'], competencies: ['Serverless architecture', 'VPC networking', 'Cloud storage', 'IAM policies'] },
    { id: 'exp3', section_key: 'expertise_ml', title: 'Machine Learning', content: 'Training and fine-tuning models for production readiness.', icon: 'BrainCircuit', badge: 'Proficient', tags: ['PyTorch', 'Scikit-learn', 'MLflow'], competencies: ['Model training', 'Experiment tracking', 'Feature engineering'] },
    { id: 'exp4', section_key: 'expertise_data', title: 'Data Engineering', content: 'Building ETL pipelines with Python and SQL.', icon: 'Database', badge: 'Building', tags: ['Python', 'SQL', 'dbt', 'Airflow'], competencies: ['ETL pipelines', 'Data warehousing', 'dbt transforms'] },
    { id: 'exp5', section_key: 'expertise_k8s', title: 'Kubernetes', content: 'Orchestrating containerized workloads at scale.', icon: 'Box', badge: 'Building', tags: ['Kubernetes', 'Helm', 'Docker'], competencies: ['Cluster admin', 'Helm charts', 'Pod scaling'] },
    { id: 'exp6', section_key: 'expertise_llm', title: 'LLM Applications', content: 'Building AI apps with RAG and agentic patterns.', icon: 'Bot', badge: 'Building', tags: ['RAG', 'Python', 'OpenAI'], competencies: ['RAG implementation', 'Prompt engineering', 'Vector DBs'] },
    { id: 'exp7', section_key: 'expertise_fullstack', title: 'Full Stack', content: 'Responsive frontends and performant backends.', icon: 'Layers', badge: 'Competent', tags: ['React', 'Next.js', 'FastAPI', 'TypeScript'], competencies: ['Modern frontend', 'API design', 'Database modeling'] },
    { id: 'exp8', section_key: 'expertise_platform', title: 'Platform Engineering', content: 'Building self-service developer platforms.', icon: 'Cpu', badge: 'Foundational', tags: ['Kubernetes', 'Docker'], competencies: ['IDP concepts', 'Infrastructure automation'] },
    { id: 'exp9', section_key: 'expertise_sre', title: 'SRE & Reliability', content: 'Observability, incident management, and reliability.', icon: 'Activity', badge: 'Foundational', tags: ['Linux', 'Python', 'AWS'], competencies: ['Monitoring', 'Incident response', 'SLO/SLI'] },
    { id: 'exp10', section_key: 'expertise_security', title: 'Security', content: 'Secure coding and cloud security practices.', icon: 'Shield', badge: 'Foundational', tags: ['AWS', 'Azure', 'Linux'], competencies: ['OWASP', 'IAM', 'Secrets management'] },
    { id: 'exp11', section_key: 'expertise_api', title: 'API Development', content: 'RESTful and GraphQL API design.', icon: 'Terminal', badge: 'Competent', tags: ['FastAPI', 'TypeScript', 'PostgreSQL'], competencies: ['REST patterns', 'GraphQL', 'API versioning'] },
]

const formatDateRange = (start: string, end: string | null, isCurrent: boolean) => {
    const s = new Date(start).getFullYear(); const e = isCurrent ? 'Present' : (end ? new Date(end).getFullYear() : '')
    return `${s} — ${e}`
}
const formatDate = (dateString: string | null) => !dateString ? '' : new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function PortfolioIntegrationPage() {
    const [activeView, setActiveView] = useState<ViewState>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-activeView')
            if (saved && ['overview', 'portfolio', 'resume', 'blog', 'contact'].includes(saved)) {
                return saved as ViewState
            }
        }
        return 'overview'
    })
    const [loading, setLoading] = useState(true)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const [projects, setProjects] = useState<Project[]>([])
    const [skills, setSkills] = useState<Skill[]>([])
    const [experience, setExperience] = useState<Experience[]>([])
    const [education, setEducation] = useState<Education[]>([])
    const [aboutContent, setAboutContent] = useState<AboutContent[]>(FALLBACK_EXPERTISE)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [technologies, setTechnologies] = useState<Technology[]>([])
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [showScrollTop, setShowScrollTop] = useState(false)

    // AI Chat state
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 'welcome', role: 'assistant', content: "Hello! I'm your AI assistant. I can help you learn more about my skills and experience. How can I help you today?", timestamp: new Date() }
    ])
    const [chatInput, setChatInput] = useState('')
    const [chatLoading, setChatLoading] = useState(false)
    const chatMessagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll chat to bottom when messages change
    useEffect(() => {
        chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    // Chat keyboard shortcut (Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setIsChatOpen(prev => !prev)
            }
            if (e.key === 'Escape' && isChatOpen) {
                setIsChatOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isChatOpen])

    // Streaming chat function
    const streamChat = async (userMessage: string) => {
        const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: userMessage, timestamp: new Date() }
        setChatMessages(prev => [...prev, userMsg])
        setChatInput('')
        setChatLoading(true)

        const assistantId = `assistant-${Date.now()}`
        setChatMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }])

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/portfolio-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
                body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }], stream: true })
            })

            if (!response.ok) throw new Error('Chat request failed')

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let accumulated = ''

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    const chunk = decoder.decode(value, { stream: true })
                    const lines = chunk.split('\n').filter(l => l.startsWith('data:'))
                    for (const line of lines) {
                        const json = line.replace('data:', '').trim()
                        if (json && json !== '[DONE]') {
                            try {
                                const parsed = JSON.parse(json)
                                const content = parsed.choices?.[0]?.delta?.content || ''
                                accumulated += content
                                setChatMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m))
                            } catch { /* skip invalid json */ }
                        }
                    }
                }
            }

            if (!accumulated) {
                setChatMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: 'I apologize — I could not generate a response. Please try again.' } : m))
            }
        } catch (err) {
            console.error('Chat error', err)
            setChatMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: 'Sorry, I encountered an error. Please check your connection and try again.' } : m))
        } finally {
            setChatLoading(false)
        }
    }

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatInput.trim() || chatLoading) return
        streamChat(chatInput.trim())
    }

    // Save activeView to localStorage
    useEffect(() => {
        localStorage.setItem('test-activeView', activeView)
    }, [activeView])

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Theme effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true)
                const [{ data: dbProjects }, { data: dbSkills }, { data: dbExp }, { data: dbEdu }, { data: dbAbout }, { data: dbTestimonials }, { data: dbTech }, { data: dbBlog }, { data: dbPersonal }, { data: dbSocial }] = await Promise.all([
                    supabase.from('projects').select('*').order('display_order'),
                    supabase.from('skills').select('*').order('proficiency', { ascending: false }),
                    supabase.from('experience').select('*').order('start_date', { ascending: false }),
                    supabase.from('education').select('*').order('start_date', { ascending: false }),
                    supabase.from('about_content').select('*').eq('is_active', true).order('display_order'),
                    supabase.from('testimonials').select('*').eq('is_active', true).order('display_order'),
                    supabase.from('technologies').select('*').eq('is_active', true).order('display_order'),
                    supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }),
                    supabase.from('personal_info').select('*').single(),
                    supabase.from('social_links').select('*').eq('is_active', true).order('display_order')
                ])

                if (dbProjects) setProjects(dbProjects.map((p: any) => ({ id: p.id, title: p.title, description: p.description || '', status: p.status || 'Research', stack: p.stack || [], is_featured: p.is_featured, github_url: p.github_url, live_url: p.live_url })))
                if (dbSkills) setSkills(dbSkills.map((s: any) => ({ ...s, proficiency: s.proficiency ?? s.proficiency_level ?? 0 })))
                if (dbExp) setExperience(dbExp)
                if (dbEdu) setEducation(dbEdu)
                if (dbAbout && dbAbout.length > 0) { const exp = dbAbout.filter((i: any) => i.section_key.startsWith('expertise_')); if (exp.length > 0) setAboutContent(exp) }
                if (dbTestimonials) setTestimonials(dbTestimonials)
                if (dbTech) setTechnologies(dbTech)
                if (dbBlog) setBlogPosts(dbBlog)
                if (dbPersonal) setPersonalInfo(dbPersonal)
                if (dbSocial) setSocialLinks(dbSocial)
            } catch (err) { console.error("Init Error:", err) }
            finally { setLoading(false) }
        }
        initData()
    }, [])

    const NAV_ITEMS = [
        { id: 'overview', label: 'Dashboard' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'resume', label: 'Resume' },
        { id: 'blog', label: 'Blog' },
        { id: 'contact', label: 'Contact' }
    ]

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#EFECE6]">
            <div className="flex flex-col items-center gap-4"><Activity className="animate-spin text-slate-400" size={32} /><span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading...</span></div>
        </div>
    )

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-10 flex justify-center font-sans bg-[#EFECE6]">
            <div className={`w-full max-w-[1600px] bg-[${CREAM_BG}] ${BOARD_RADIUS} overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] p-6 md:p-10 relative ring-1 ring-black/5 min-h-[900px] flex flex-col`}>

                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-b from-[#FFF9E6] to-transparent rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

                {/* HEADER */}
                <header className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6 relative z-10">
                    <div onClick={() => setActiveView('overview')} className={`px-8 py-3 ${CARD_RADIUS} border border-white/40 bg-white/60 backdrop-blur-xl text-lg font-medium text-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-3`}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Crextio
                    </div>

                    <nav className="flex items-center bg-white/50 backdrop-blur-xl p-1.5 rounded-full border border-white/40 shadow-sm">
                        {NAV_ITEMS.map((item) => (
                            <button key={item.id} onClick={() => setActiveView(item.id as ViewState)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeView === item.id ? `bg-[${BLACK}] text-white shadow-lg` : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'}`}>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                            className="w-11 h-11 rounded-full bg-white/60 border border-white/40 flex items-center justify-center text-slate-500 hover:bg-white shadow-sm transition-all"
                            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <button className="w-11 h-11 rounded-full bg-white/60 border border-white/40 flex items-center justify-center text-slate-500 hover:bg-white shadow-sm transition-all">
                            <Settings size={18} />
                        </button>
                        <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                            <img src="/assets/images/profile-warm.png" className="w-full h-full object-cover" alt="" />
                        </div>
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex-grow flex flex-col relative z-10 animate-fade-in-up">
                    {activeView === 'overview' && <OverviewView projects={projects} skills={skills} expertise={aboutContent} testimonials={testimonials} technologies={technologies} personalInfo={personalInfo} socialLinks={socialLinks} />}
                    {activeView === 'portfolio' && <PortfolioView initialProjects={projects} />}
                    {activeView === 'resume' && <ResumeView experience={experience} education={education} skills={skills} />}
                    {activeView === 'blog' && <BlogView posts={blogPosts} />}
                    {activeView === 'contact' && <ContactView />}
                </main>

                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={`fixed bottom-8 right-24 w-12 h-12 ${CARD_RADIUS} bg-[${GOLD}] text-[${BLACK}] shadow-lg flex items-center justify-center hover:scale-110 transition-all z-50`}
                    >
                        <ArrowUp size={20} />
                    </button>
                )}

                {/* AI Chat FAB */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[${GOLD}] text-[${BLACK}] shadow-lg flex items-center justify-center hover:scale-110 transition-all z-50`}
                    title="AI Assistant (Ctrl+K)"
                >
                    <Bot size={24} />
                </button>

                {/* AI Chat Modal */}
                {isChatOpen && (
                    <div className={`fixed bottom-24 right-8 w-[380px] max-h-[500px] bg-[${CREAM_BG}] ${BOARD_RADIUS} shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden`}>
                        {/* Chat Header */}
                        <div className={`flex items-center justify-between p-4 bg-[${BLACK}] text-white`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-[${GOLD}] flex items-center justify-center text-[${BLACK}]`}>
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">AI Assistant</h3>
                                    <span className="text-[10px] text-white/60">Powered by LLM</span>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[320px] custom-scrollbar">
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? `bg-[${GOLD}] text-[${BLACK}]` : 'bg-slate-200 text-slate-600'}`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`max-w-[75%] p-3 text-sm leading-relaxed ${msg.role === 'user' ? `bg-[${BLACK}] text-white rounded-2xl rounded-tr-md` : 'bg-white border border-slate-100 rounded-2xl rounded-tl-md text-slate-700'}`}>
                                        {msg.content || <span className="inline-flex items-center gap-1 text-slate-400"><Loader2 size={12} className="animate-spin" /> Thinking...</span>}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatMessagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-100 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className={`flex-1 px-4 py-3 text-sm bg-white border border-slate-200 rounded-full outline-none focus:border-[${GOLD}] focus:ring-2 focus:ring-[${GOLD}]/20 transition-all`}
                                disabled={chatLoading}
                            />
                            <button
                                type="submit"
                                disabled={!chatInput.trim() || chatLoading}
                                className={`w-12 h-12 rounded-full bg-[${GOLD}] text-[${BLACK}] flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {chatLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <style jsx global>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 25s linear infinite; }
      `}</style>
        </div>
    )
}

// ============================================================================
// OVERVIEW VIEW (COMPLETE CREXTIO DASHBOARD REPLICA)
// ============================================================================
function OverviewView({ projects, skills, expertise, testimonials, technologies, personalInfo, socialLinks }: {
    projects: Project[], skills: Skill[], expertise: AboutContent[], testimonials: Testimonial[], technologies: Technology[], personalInfo: PersonalInfo | null, socialLinks: SocialLink[]
}) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [expandedSection, setExpandedSection] = useState<string | null>('devices')
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

    const completedProjects = projects.filter(p => p.status === 'Completed')
    const researchProjects = projects.filter(p => p.status === 'Research')

    const statsBar = [
        { label: 'Experience', value: '5+', highlight: 'black' },
        { label: 'Projects', value: projects.length.toString(), highlight: 'gold' },
        { label: 'Uptime', value: '99.9%', highlight: 'white' },
    ]

    const topMetrics = [
        { icon: Users, value: '15+', label: 'Models' },
        { icon: TrendingUp, value: '10x', label: 'Efficiency' },
        { icon: FolderGit2, value: projects.length.toString(), label: 'Projects' },
    ]

    const progressDays = ['S', 'M', 'T', 'W', 'T', 'F']
    const progressValues = [30, 60, 40, 90, 55, 25]

    const duplicatedTech = [...technologies, ...technologies]

    return (
        <div className="flex flex-col gap-5 h-full overflow-y-auto custom-scrollbar pr-2">

            {/* HERO */}
            <section className="mb-2">
                <h1 className="text-5xl lg:text-6xl font-light text-slate-800 mb-6">
                    Welcome in, <span className="font-medium">Nixtio</span>
                </h1>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-2 p-1.5 bg-white/40 border border-white/60 rounded-full backdrop-blur-md shadow-sm">
                        {statsBar.map((s, i) => (
                            <div key={i} className={`h-12 px-5 rounded-full text-sm font-medium flex items-center gap-2 ${s.highlight === 'black' ? `bg-[${BLACK}] text-white shadow-md` :
                                s.highlight === 'gold' ? `bg-[${GOLD}] text-[${BLACK}]` :
                                    'bg-white/80 text-slate-600 border border-slate-100'
                                }`}>
                                <span className="text-[10px] font-bold uppercase opacity-70">{s.label}</span>
                                <span className="text-base font-semibold">{s.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-8">
                        {topMetrics.map((m, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <m.icon size={18} className="text-slate-400" />
                                <div>
                                    <div className="text-4xl font-light text-slate-800 tracking-tight">{m.value}</div>
                                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{m.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MAIN 4-COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                {/* COL 1: Profile + Accordion */}
                <div className="col-span-1 flex flex-col gap-5">
                    {/* Profile Card */}
                    <div className={`relative h-[340px] ${BOARD_RADIUS} overflow-hidden group shadow-lg`}>
                        <div className={`absolute inset-0 bg-[${PURPLE}]`}>
                            <img src="/assets/images/profile-warm.png" alt="Profile" className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-7 left-7">
                            <h2 className="text-2xl font-medium text-white tracking-tight">{personalInfo?.full_name || 'Your Name'}</h2>
                            <p className="text-sm text-white/70 mt-0.5">{personalInfo?.title || 'Your Title'}</p>
                        </div>
                        {personalInfo?.location && (
                            <div className={`absolute bottom-7 right-7 px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 text-white text-xs font-medium shadow-sm flex items-center gap-1.5`}>
                                <MapPin size={12} />
                                {personalInfo.location}
                            </div>
                        )}
                    </div>

                    {/* Social Links & Contact */}
                    {(socialLinks.length > 0 || personalInfo) && (
                        <div className={`bg-white ${BOARD_RADIUS} p-5 shadow-sm border border-slate-100/50`}>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Connect</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {socialLinks.map(link => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:scale-110 transition-all"
                                        title={link.platform}
                                    >
                                        {link.platform.toLowerCase() === 'github' && <Github size={18} />}
                                        {link.platform.toLowerCase() === 'linkedin' && <Linkedin size={18} />}
                                        {link.platform.toLowerCase() === 'twitter' && <Zap size={18} />}
                                        {!['github', 'linkedin', 'twitter'].includes(link.platform.toLowerCase()) && <Globe size={18} />}
                                    </a>
                                ))}
                            </div>
                            {personalInfo?.email && (
                                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                                    <Mail size={14} />
                                    {personalInfo.email}
                                </a>
                            )}
                            {personalInfo?.phone && (
                                <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors mt-2">
                                    <Phone size={14} />
                                    {personalInfo.phone}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Accordion Sections */}
                    <div className={`bg-white ${BOARD_RADIUS} p-5 shadow-sm border border-slate-100/50`}>
                        {[
                            { id: 'pension', label: 'Pension contributions', icon: ChevronDown },
                            { id: 'devices', label: 'Devices', icon: ChevronUp },
                            { id: 'compensation', label: 'Compensation Summary', icon: ChevronDown },
                            { id: 'benefits', label: 'Employee Benefits', icon: ChevronDown },
                        ].map((item) => (
                            <div key={item.id} className="border-b border-slate-100 last:border-b-0">
                                <button
                                    onClick={() => setExpandedSection(expandedSection === item.id ? null : item.id)}
                                    className="w-full flex justify-between items-center py-3 text-sm font-medium text-slate-800 hover:text-slate-900"
                                >
                                    {item.label}
                                    {expandedSection === item.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </button>

                                {expandedSection === item.id && item.id === 'devices' && (
                                    <div className="pb-3">
                                        <div className="flex gap-3 items-center bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                                            <div className="w-10 h-8 bg-slate-200/70 rounded-lg flex items-center justify-center"><Laptop size={16} className="text-slate-500" /></div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-xs font-semibold text-slate-800">MacBook Air</div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">Version M1</div>
                                            </div>
                                            <MoreHorizontal size={14} className="text-slate-300" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* COL 2: Progress + Calendar */}
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-5">
                        {/* Progress Card */}
                        <div className={`bg-white ${BOARD_RADIUS} p-5 shadow-sm border border-slate-100/50 flex flex-col`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">Progress</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-4xl font-light text-slate-900 tracking-tighter">6.1</span>
                                        <span className="text-lg font-light text-slate-400">h</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Work Time this week</p>
                                </div>
                                <button className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Expand size={12} /></button>
                            </div>
                            <div className="flex items-end justify-between h-20 gap-2 mt-auto">
                                {progressDays.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col gap-1 h-full justify-end items-center">
                                        {i === 3 && <div className={`bg-[${GOLD}] text-[${BLACK}] text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm whitespace-nowrap`}>5h 23m</div>}
                                        <div className="w-1.5 bg-slate-100 rounded-full h-full relative overflow-hidden">
                                            <div className={`absolute bottom-0 w-full rounded-full bg-[${BLACK}]`} style={{ height: `${progressValues[i]}%` }}></div>
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-medium">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time Tracker */}
                        <div className={`bg-[${WARM_CREAM}] ${BOARD_RADIUS} p-5 shadow-sm border border-yellow-100/50 flex flex-col items-center`}>
                            <div className="flex justify-between items-start w-full mb-3">
                                <h3 className="text-sm font-bold text-slate-800">Time tracker</h3>
                                <button className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-slate-400"><Expand size={12} /></button>
                            </div>
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="56" cy="56" r="48" fill="none" stroke="#e5e5e5" strokeWidth="2" strokeDasharray="6 4" />
                                    <circle cx="56" cy="56" r="48" fill="none" stroke={GOLD} strokeWidth="5" strokeDashoffset="60" strokeLinecap="round" style={{ strokeDasharray: '300' }} />
                                </svg>
                                <div className="absolute text-center">
                                    <div className="text-2xl font-light text-slate-900 tracking-tight">02:35</div>
                                    <div className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">Work Time</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    {isPlaying ? <Pause size={12} className="text-slate-700" /> : <Play size={12} className="ml-0.5 text-slate-700" />}
                                </button>
                                <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm"><Clock size={12} className="text-slate-700" /></button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className={`bg-[${CREAM_BG}] ${BOARD_RADIUS} p-5 shadow-sm border border-slate-100/50 flex-1`}>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-sm text-slate-400 cursor-pointer">August</span>
                            <span className="text-base font-bold text-slate-800">September 2024</span>
                            <span className="text-sm text-slate-400 cursor-pointer">October</span>
                        </div>
                        <div className="grid grid-cols-6 gap-3 mb-4 text-center">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                <div key={day} className={`flex flex-col gap-0.5 ${i === 2 ? 'opacity-100' : 'opacity-40'}`}>
                                    <span className="text-[10px] font-medium text-slate-500">{day}</span>
                                    <span className={`text-base ${i === 2 ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{22 + i}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {completedProjects.slice(0, 2).map((p, i) => (
                                <div key={p.id} className="flex gap-3 items-center">
                                    <span className="text-[10px] font-medium text-slate-400 w-14">{8 + i}:00 am</span>
                                    <div className={`flex-grow p-3 ${i === 0 ? `bg-[${GOLD}]` : 'bg-emerald-100'} rounded-xl flex items-center justify-between`}>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800">{p.title}</div>
                                            <div className="text-[10px] text-slate-600 mt-0.5">{p.description.slice(0, 30)}...</div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(n => <div key={n} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white overflow-hidden"><img src={`https://i.pravatar.cc/40?img=${n + i * 10}`} className="w-full h-full object-cover" alt="" /></div>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COL 3: Onboarding + Dark Task List */}
                <div className="col-span-1 flex flex-col gap-5">
                    {/* Onboarding Status */}
                    <div className={`bg-white ${BOARD_RADIUS} p-5 shadow-sm border border-slate-100/50`}>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-sm font-bold text-slate-800">Onboarding</h3>
                            <span className="text-2xl font-light text-slate-800">18%</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                            {[{ pct: '30%', color: 'bg-slate-200' }, { pct: '25%', color: `bg-[${GOLD}]` }, { pct: '0%', color: 'bg-slate-100 border border-slate-200' }].map((item, i) => (
                                <div key={i} className="flex-1">
                                    <div className="text-[10px] text-slate-400 mb-1 text-center">{item.pct}</div>
                                    <div className={`h-7 rounded-lg ${item.color}`}></div>
                                </div>
                            ))}
                        </div>
                        <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider w-fit">Task</div>
                    </div>

                    {/* Onboarding Task (Dark Card - Expertise) */}
                    <div className={`bg-[${BLACK}] ${BOARD_RADIUS} p-5 flex flex-col text-white shadow-lg flex-1 relative overflow-hidden`}>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-sm font-medium text-white">Onboarding Task</h3>
                            </div>
                            <div className="text-2xl font-light text-white">
                                2<span className="text-white/30">/8</span>
                            </div>
                        </div>

                        <div className="space-y-2 overflow-y-auto custom-scrollbar flex-grow pr-1">
                            {expertise.slice(0, 5).map((exp, i) => {
                                const IconComponent = exp.icon && iconMap[exp.icon] ? iconMap[exp.icon] : Code
                                const isCompleted = i < 2
                                return (
                                    <div key={exp.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-default group">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCompleted ? `bg-[${GOLD}] text-[${BLACK}]` : 'bg-white/10 text-white/60'}`}>
                                            <IconComponent size={14} />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className={`text-xs font-medium ${isCompleted ? 'line-through text-white/50' : 'text-white'}`}>{exp.title}</div>
                                            <div className="text-[10px] text-white/40">Sep 13, {10 + i}:30</div>
                                        </div>
                                        <CheckCircle2 size={16} className={isCompleted ? 'text-emerald-400' : 'text-white/20'} />
                                    </div>
                                )
                            })}
                        </div>

                        <div className={`absolute -bottom-12 -right-12 w-40 h-40 bg-[${GOLD}] rounded-full blur-[60px] opacity-10`}></div>
                    </div>
                </div>
            </div>

            {/* EXPERTISE CARDS - FULL ABOUT.TSX STRUCTURE */}
            <section className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Areas of Expertise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expertise.map(area => {
                        const IconComponent = area.icon && iconMap[area.icon] ? iconMap[area.icon] : Code
                        return (
                            <div key={area.id} className="group relative">
                                {/* Glow layer */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-br from-[${GOLD}]/20 to-[${PURPLE}]/20 rounded-[24px] blur opacity-0 group-hover:opacity-100 transition duration-500`}></div>

                                {/* Card content */}
                                <div className={`relative bg-white ${CARD_RADIUS} p-5 border border-slate-100 hover:border-[${GOLD}]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col`}>
                                    {/* Header with icon and badge */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2.5 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-[${GOLD}]/10 group-hover:text-[${GOLD}] transition-colors`}>
                                            <IconComponent size={20} />
                                        </div>
                                        {area.badge && (
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[${GOLD}]/10 border border-[${GOLD}]/20`}>
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[${GOLD}]`}></span>
                                                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-[${GOLD}]`}></span>
                                                </span>
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">{area.badge}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title and description */}
                                    <h4 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-slate-900 transition-colors">{area.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-3">{area.content}</p>

                                    {/* Competencies */}
                                    {area.competencies && area.competencies.length > 0 && (
                                        <div className="space-y-1.5 mb-4">
                                            {area.competencies.slice(0, 3).map((comp, i) => (
                                                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-500">
                                                    <div className={`mt-1 w-1 h-1 rounded-full bg-[${GOLD}] shrink-0`}></div>
                                                    <span className="leading-tight">{comp}</span>
                                                </div>
                                            ))}
                                            {area.competencies.length > 3 && (
                                                <div className="text-[10px] text-slate-400 pl-3">+{area.competencies.length - 3} more</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tech stack with logos */}
                                    {area.tags && (
                                        <div className="mt-auto pt-3 border-t border-slate-100 group-hover:border-slate-200 transition-colors">
                                            <div className="flex flex-wrap gap-1.5">
                                                {area.tags.slice(0, 4).map(tag => (
                                                    <div key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                                        {LOGO_MAP[tag] && (
                                                            <img src={LOGO_MAP[tag]} alt={tag} className="w-3 h-3 object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                        <span className="text-[9px] font-medium text-slate-500">{tag}</span>
                                                    </div>
                                                ))}
                                                {area.tags.length > 4 && (
                                                    <span className="text-[9px] text-slate-400 self-center px-1">+{area.tags.length - 4}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* TECHNOLOGIES TICKER - Enhanced with grayscale */}
            {technologies.length > 0 && (
                <div className="mt-6 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                    <div className="flex gap-4 animate-scroll hover:[animation-play-state:paused]">
                        {duplicatedTech.map((tech, i) => (
                            <div key={`${tech.id}-${i}`} className="min-w-[100px] flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all group cursor-default">
                                <img src={tech.logo_url} alt={tech.name} className="w-12 h-12 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                                <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TESTIMONIALS */}
            {testimonials.length > 0 && (
                <div className={`bg-white ${BOARD_RADIUS} p-5 shadow-sm border border-slate-100/50 mt-2`}>
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Recommendations</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                        {testimonials.slice(0, 4).map(t => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTestimonial(t)}
                                className="min-w-[280px] flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                    <img src={t.avatar_url || 'https://i.pravatar.cc/40'} className="w-full h-full object-cover" alt={t.name} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{t.name}</div>
                                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">"{t.text}"</div>
                                    <div className="text-[10px] text-emerald-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Read more →</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TESTIMONIAL MODAL */}
            <Dialog.Root open={!!selectedTestimonial} onOpenChange={(open) => !open && setSelectedTestimonial(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white ${BOARD_RADIUS} p-8 max-w-lg w-full z-50 shadow-2xl`}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-slate-100">
                                <img src={selectedTestimonial?.avatar_url || 'https://i.pravatar.cc/80'} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <Dialog.Title className="text-xl font-bold text-slate-800">{selectedTestimonial?.name}</Dialog.Title>
                                <div className="text-sm text-slate-500 mt-1">{selectedTestimonial?.date && formatDate(selectedTestimonial.date)}</div>
                            </div>
                            <Dialog.Close className="ml-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
                                <X size={16} />
                            </Dialog.Close>
                        </div>
                        <p className="text-slate-600 leading-relaxed italic">"{selectedTestimonial?.text}"</p>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}

// ============================================================================
// PORTFOLIO VIEW (FULL PRODUCTION LOGIC)
// ============================================================================
function PortfolioView({ initialProjects }: { initialProjects: Project[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('All')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [readmeContent, setReadmeContent] = useState<string | null>(null)
    const [readmeLoading, setReadmeLoading] = useState(false)
    const [readmeError, setReadmeError] = useState<string | null>(null)
    const PROJECTS_PER_PAGE = 12

    // GitHub projects state
    const [projects, setProjects] = useState<Project[]>(initialProjects)
    const [loadingGitHub, setLoadingGitHub] = useState(false)
    const [source, setSource] = useState<'database' | 'github'>('database')

    // Fetch from GitHub API
    const fetchGitHubProjects = async () => {
        setLoadingGitHub(true)
        try {
            const githubService = new GitHubService()
            const repos = await githubService.getRepositories('ambooka', { maxRepos: 100, sortBy: 'updated' })
            const mapped: Project[] = repos.map(repo => ({
                id: repo.id,
                title: repo.name,
                description: repo.description || '',
                status: repo.homepage ? 'Completed' : 'Research',
                stack: repo.language ? [repo.language] : ['Other'],
                is_featured: (repo.stargazers_count >= 5) || !!repo.homepage,
                github_url: repo.html_url,
                live_url: repo.homepage || undefined,
                stars: repo.stargazers_count,
                language: repo.language || 'Other'
            }))
            setProjects(mapped)
            setSource('github')
        } catch (err) {
            console.error('GitHub fetch error:', err)
        } finally {
            setLoadingGitHub(false)
        }
    }

    const toggleSource = () => {
        if (source === 'database') {
            fetchGitHubProjects()
        } else {
            setProjects(initialProjects)
            setSource('database')
        }
    }

    const filtered = useMemo(() => projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === 'All' || p.stack.includes(filter)
        return matchesSearch && matchesFilter
    }), [projects, searchQuery, filter])

    // Pagination
    const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE)
    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
        return filtered.slice(startIndex, startIndex + PROJECTS_PER_PAGE)
    }, [filtered, currentPage])

    // Reset to page 1 when filters change
    useEffect(() => { setCurrentPage(1) }, [filter, searchQuery])

    const categories = ['All', ...Array.from(new Set(projects.flatMap(p => p.stack))).slice(0, 6)]

    // Fetch README when project is selected
    const openProject = async (project: Project) => {
        setSelectedProject(project)
        setReadmeContent(null)
        setReadmeError(null)

        if (project.github_url) {
            setReadmeLoading(true)
            try {
                const githubService = new GitHubService()
                // Extract owner/repo from URL
                const match = project.github_url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
                if (match) {
                    const readme = await githubService.getReadme(match[1], match[2])
                    setReadmeContent(readme)
                }
            } catch (err) {
                setReadmeError('Could not load README. You can view the repository on GitHub.')
            } finally {
                setReadmeLoading(false)
            }
        }
    }

    return (
        <div className="h-full flex flex-col gap-5 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-light text-slate-800 mb-1">Portfolio</h2>
                    <p className="text-slate-400 text-sm uppercase tracking-widest">Architected Solutions</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Source Toggle */}
                    <button
                        onClick={toggleSource}
                        disabled={loadingGitHub}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${source === 'github' ? `bg-[${BLACK}] text-white shadow-md` : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                        {loadingGitHub ? <Loader2 size={12} className="animate-spin" /> : <Github size={12} />}
                        {source === 'github' ? 'GitHub' : 'Database'}
                    </button>
                    <span className="text-sm text-slate-400">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
                    <div className="flex items-center gap-2 bg-white/60 p-1.5 rounded-full border border-white shadow-sm">
                        <div className="px-3 text-slate-400"><Search size={16} /></div>
                        <input type="text" placeholder="Search projects..." className="bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none w-48" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === cat ? `bg-[${BLACK}] text-white shadow-md` : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}>{cat}</button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto custom-scrollbar pr-2 pb-4 flex-grow">
                {paginatedProjects.map((p, index) => (
                    <div
                        key={p.id}
                        onClick={() => openProject(p)}
                        className={`bg-white ${BOARD_RADIUS} p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 flex flex-col h-[280px] group cursor-pointer transition-all hover:-translate-y-1`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2.5 bg-slate-50 rounded-xl group-hover:bg-[${GOLD}] transition-colors`}>
                                <GitBranch size={16} className="text-slate-600 group-hover:text-slate-900" />
                            </div>
                            {p.is_featured && (
                                <div className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[8px] font-bold uppercase rounded-full flex items-center gap-1 border border-yellow-100">
                                    <Sparkles size={8} />Featured
                                </div>
                            )}
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1 line-clamp-1">{p.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed font-light">{p.description}</p>
                        <div className="mt-auto">
                            <div className="flex flex-wrap gap-1 mb-3">
                                {p.stack.slice(0, 3).map(tech => (
                                    <span key={tech} className="text-[8px] px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500 font-bold uppercase">{tech}</span>
                                ))}
                                {p.stack.length > 3 && <span className="text-[8px] px-1.5 py-0.5 text-slate-400">+{p.stack.length - 3}</span>}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <Github size={10} />View Details
                                </span>
                                <div className="flex items-center gap-2">
                                    {p.stars !== undefined && p.stars > 0 && (
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                                            <Star size={10} className="fill-yellow-400 text-yellow-400" />{p.stars}
                                        </span>
                                    )}
                                    <div className={`w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[${BLACK}] group-hover:text-white transition-all`}>
                                        <ArrowUpRight size={10} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${currentPage === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page = i + 1
                        if (totalPages > 5 && currentPage > 3) {
                            page = Math.min(currentPage - 2 + i, totalPages - 4 + i)
                        }
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${currentPage === page ? `bg-[${BLACK}] text-white shadow-md` : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                {page}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${currentPage === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Project Detail Dialog with README */}
            <Dialog.Root open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white ${BOARD_RADIUS} p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto z-50 shadow-2xl`}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <Dialog.Title className="text-2xl font-bold text-slate-800">{selectedProject?.title}</Dialog.Title>
                                <div className="flex gap-2 mt-2">
                                    {selectedProject?.stack.slice(0, 4).map(t => (
                                        <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold uppercase">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <Dialog.Close className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
                                <X size={16} />
                            </Dialog.Close>
                        </div>

                        <p className="text-slate-600 mb-6 leading-relaxed">{selectedProject?.description}</p>

                        {/* README Section */}
                        <div className={`bg-slate-50 ${CARD_RADIUS} p-5 mb-6`}>
                            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <FileText size={14} />README
                            </h4>
                            {readmeLoading && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">Loading README...</span>
                                </div>
                            )}
                            {readmeError && (
                                <p className="text-sm text-slate-500 italic">{readmeError}</p>
                            )}
                            {readmeContent && (
                                <div className="prose prose-sm prose-slate max-w-none text-sm text-slate-600 max-h-60 overflow-y-auto custom-scrollbar">
                                    <pre className="whitespace-pre-wrap font-sans">{readmeContent}</pre>
                                </div>
                            )}
                            {!readmeLoading && !readmeError && !readmeContent && (
                                <p className="text-sm text-slate-400">No README available</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {selectedProject?.github_url && (
                                <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className={`px-5 py-2.5 rounded-full bg-[${BLACK}] text-white text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity`}>
                                    <Github size={16} />View on GitHub
                                </a>
                            )}
                            {selectedProject?.live_url && selectedProject.live_url !== '#' && (
                                <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2 hover:border-slate-300 transition-colors">
                                    <Globe size={16} />Live Demo
                                </a>
                            )}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}

// ============================================================================
// RESUME VIEW
// ============================================================================
function ResumeView({ experience, education, skills }: { experience: Experience[], education: Education[], skills: Skill[] }) {
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
    const [resumeHTML, setResumeHTML] = useState<string | null>(null)
    const [generatingResume, setGeneratingResume] = useState(false)

    // Generate Resume HTML
    const generateResumeHTML = () => {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - Professional CV</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; font-size: 11pt; line-height: 1.5; color: #1f2937; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 28px; color: #111827; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #6b7280; margin-bottom: 20px; font-weight: 500; }
        h3 { font-size: 13px; font-weight: 700; color: #111827; margin: 16px 0 8px; border-bottom: 2px solid #facc15; padding-bottom: 4px; }
        .section { margin-bottom: 20px; }
        .job { margin-bottom: 14px; }
        .job-title { font-weight: 700; color: #111827; }
        .job-company { color: #059669; font-weight: 500; }
        .job-date { color: #9ca3af; font-size: 10pt; float: right; }
        .job-desc { color: #4b5563; margin-top: 4px; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 10pt; color: #374151; }
        .edu-item { margin-bottom: 10px; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <h1>Professional Resume</h1>
    <h2>MLOps Engineer & Software Developer</h2>
    
    <div class="section">
        <h3>Experience</h3>
        ${experience.map(exp => `
            <div class="job">
                <span class="job-date">${new Date(exp.start_date).getFullYear()} - ${exp.is_current ? 'Present' : new Date(exp.end_date || '').getFullYear()}</span>
                <div class="job-title">${exp.position}</div>
                <div class="job-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                <div class="job-desc">${exp.description || ''}</div>
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h3>Education</h3>
        ${education.map(edu => `
            <div class="edu-item">
                <div class="job-title">${edu.degree || ''} ${edu.field_of_study ? `in ${edu.field_of_study}` : ''}</div>
                <div class="job-company">${edu.institution}</div>
                <div class="job-date">${new Date(edu.start_date).getFullYear()} - ${edu.is_current ? 'Present' : new Date(edu.end_date || '').getFullYear()}</div>
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h3>Skills</h3>
        <div class="skills-list">
            ${skills.slice(0, 20).map(s => `<span class="skill">${s.name}</span>`).join('')}
        </div>
    </div>
</body>
</html>
        `
        return html
    }

    // Open resume modal
    const openResumeModal = async () => {
        setGeneratingResume(true)
        setIsResumeModalOpen(true)
        try {
            const html = generateResumeHTML()
            setResumeHTML(html)
        } catch (err) {
            console.error('Error generating resume:', err)
        } finally {
            setGeneratingResume(false)
        }
    }

    // Print resume as PDF
    const printResume = () => {
        if (!resumeHTML) return
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(resumeHTML)
            printWindow.document.close()
            printWindow.focus()
            setTimeout(() => printWindow.print(), 500)
        }
    }

    // Download as HTML
    const downloadResume = () => {
        if (!resumeHTML) return
        const blob = new Blob([resumeHTML], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'resume.html'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="h-full flex flex-col gap-5 animate-fade-in-up overflow-y-auto custom-scrollbar pr-2">
            <div className="flex justify-between items-end">
                <div><h2 className="text-4xl font-light text-slate-800 mb-1">Resume</h2><p className="text-slate-400 text-sm uppercase tracking-widest">Career Trajectory</p></div>
                <button onClick={openResumeModal} className={`px-5 py-2.5 rounded-full bg-[${BLACK}] text-white text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all`}><FileText size={14} /> View & Download CV</button>
            </div>

            {/* Resume Preview Modal */}
            <Dialog.Root open={isResumeModalOpen} onOpenChange={setIsResumeModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white ${BOARD_RADIUS} w-[90vw] max-w-4xl max-h-[85vh] z-50 shadow-2xl flex flex-col overflow-hidden`}>
                        <div className={`flex items-center justify-between p-4 bg-[${BLACK}] text-white`}>
                            <Dialog.Title className="font-bold flex items-center gap-2"><FileText size={18} /> Resume Preview</Dialog.Title>
                            <div className="flex items-center gap-2">
                                <button onClick={printResume} disabled={!resumeHTML} className={`px-4 py-2 rounded-full bg-[${GOLD}] text-[${BLACK}] text-xs font-bold uppercase flex items-center gap-1.5 hover:scale-105 transition-all disabled:opacity-50`}>
                                    <ArrowUpRight size={12} /> Print / Save PDF
                                </button>
                                <button onClick={downloadResume} disabled={!resumeHTML} className="px-4 py-2 rounded-full bg-white/20 text-white text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-white/30 transition-all disabled:opacity-50">
                                    <ArrowUp size={12} className="rotate-180" /> Download HTML
                                </button>
                                <Dialog.Close className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
                                    <X size={18} />
                                </Dialog.Close>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-1 bg-slate-100">
                            {generatingResume ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="animate-spin text-slate-400" size={32} />
                                </div>
                            ) : resumeHTML ? (
                                <iframe srcDoc={resumeHTML} className="w-full h-full min-h-[500px] bg-white rounded-lg shadow-inner" title="Resume Preview" />
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">Error generating resume</div>
                            )}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <div className="mb-4"><CareerTimeline /></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4"><div className={`w-7 h-7 rounded-lg bg-[${BLACK}] flex items-center justify-center text-white`}><Briefcase size={12} /></div><h3 className="text-base font-bold text-slate-800">Experience</h3></div>
                    <div className="relative pl-6 border-l border-slate-200 ml-3 space-y-8">
                        {experience.map((exp, i) => (
                            <div key={exp.id} className="relative">
                                <div className={`absolute -left-[27px] top-0 w-4 h-4 rounded-full border-4 border-[${CREAM_BG}] ${i === 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                <div className={`bg-white ${CARD_RADIUS} p-5 border border-slate-100 shadow-sm`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div><h4 className="text-base font-bold text-slate-800">{exp.position}</h4><div className="text-sm font-medium text-emerald-600">{exp.company}{exp.location && ` • ${exp.location}`}</div></div>
                                        <span className="px-2.5 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase">{formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed font-light mb-3">{exp.description}</p>
                                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                                        <div className="mb-3">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Responsibilities</div>
                                            <ul className="space-y-1">
                                                {exp.responsibilities.slice(0, 3).map((r, idx) => (
                                                    <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0"></span>
                                                        {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <div className="mb-3">
                                            <div className="text-[10px] font-bold text-emerald-600 uppercase mb-2 flex items-center gap-1">⭐ Achievements</div>
                                            <ul className="space-y-1">
                                                {exp.achievements.slice(0, 2).map((a, idx) => (
                                                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                                                        {a}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {exp.technologies && <div className="flex flex-wrap gap-1 mt-3">{exp.technologies.slice(0, 4).map(t => <span key={t} className="text-[8px] px-1.5 py-0.5 border border-slate-100 rounded text-slate-400 font-bold uppercase">{t}</span>)}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 mb-4"><div className={`w-7 h-7 rounded-lg bg-[${GOLD}] flex items-center justify-center text-[${BLACK}]`}><Book size={12} /></div><h3 className="text-base font-bold text-slate-800">Education</h3></div>
                    <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id} className={`bg-white ${CARD_RADIUS} p-4 border border-slate-100 hover:border-slate-200 transition-colors`}>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</div>
                                <h4 className="text-sm font-bold text-slate-800">{edu.institution}</h4>
                                <div className="text-sm text-slate-500">{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</div>
                            </div>
                        ))}
                    </div>

                    {skills.length > 0 && (
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Top Skills</h4>
                            <div className="space-y-2">
                                {skills.slice(0, 5).map(s => (
                                    <div key={s.id}><div className="flex justify-between text-[10px] mb-0.5"><span className="font-bold text-slate-700">{s.name}</span><span className="text-slate-400">{s.proficiency}%</span></div><div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden"><div className={`bg-[${BLACK}] h-full rounded-full`} style={{ width: `${s.proficiency}%` }}></div></div></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ============================================================================
// BLOG VIEW
// ============================================================================
function BlogView({ posts }: { posts: BlogPost[] }) {
    if (posts.length === 0) return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in-up">
            <div className={`bg-white ${BOARD_RADIUS} p-16 text-center max-w-2xl border border-slate-100 shadow-xl`}>
                <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto mb-6 flex items-center justify-center text-slate-400"><FileText size={28} /></div>
                <h2 className="text-3xl font-light text-slate-900 mb-3">Blog Coming Soon</h2>
                <p className="text-slate-500 leading-relaxed font-light">Check back soon for new content!</p>
            </div>
        </div>
    )

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up overflow-y-auto custom-scrollbar pr-2">
            <div><h2 className="text-4xl font-light text-slate-800 mb-1">Blog</h2><p className="text-slate-400 text-sm uppercase tracking-widest">Thoughts & Insights</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map(post => (
                    <div key={post.id} className={`bg-white ${CARD_RADIUS} overflow-hidden border border-slate-100 shadow-sm hover:shadow-md group cursor-pointer transition-all`}>
                        <div className="h-40 bg-slate-100 overflow-hidden">{post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}</div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2 text-[10px]"><span className="px-2 py-0.5 bg-slate-50 rounded-full text-slate-600 font-bold uppercase">{post.category}</span><span className="text-slate-400">{formatDate(post.published_at)}</span></div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2">{post.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ============================================================================
// CONTACT VIEW (FULL PRODUCTION LOGIC)
// ============================================================================
function ContactView() {
    const [formData, setFormData] = useState({ fullname: '', email: '', message: '' })
    const [errors, setErrors] = useState({ fullname: '', email: '', message: '' })
    const [touched, setTouched] = useState({ fullname: false, email: false, message: false })
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [personalInfo, setPersonalInfo] = useState<{ email: string; phone: string | null; location: string | null } | null>(null)
    const [socialLinks, setSocialLinks] = useState<Array<{ id: string; platform: string; url: string }>>([])
    const [loading, setLoading] = useState(true)
    const MAX_MESSAGE_LENGTH = 500

    // Fetch contact data from DB
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pInfo }, { data: social }] = await Promise.all([
                    supabase.from('personal_info').select('email, phone, location').single(),
                    supabase.from('social_links').select('id, platform, url').eq('is_active', true).eq('show_in_contact', true).order('display_order')
                ])
                if (pInfo) setPersonalInfo(pInfo)
                if (social) setSocialLinks(social)
            } catch (err) { console.error(err) }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'fullname': return value.trim().length < 2 ? 'Name must be at least 2 characters' : ''
            case 'email': return !validateEmail(value) ? 'Please enter a valid email address' : ''
            case 'message': return value.trim().length < 10 ? 'Message must be at least 10 characters' : ''
            default: return ''
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return
        setFormData(prev => ({ ...prev, [name]: value }))
        if (touched[name as keyof typeof touched]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }

    const isFormValid = () => Object.values(formData).every(val => val.trim() !== '') && Object.values(errors).every(err => err === '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors = {
            fullname: validateField('fullname', formData.fullname),
            email: validateField('email', formData.email),
            message: validateField('message', formData.message)
        }
        setErrors(newErrors)
        setTouched({ fullname: true, email: true, message: true })
        if (Object.values(newErrors).some(err => err !== '')) return

        setSubmitStatus('loading')
        try {
            const { error } = await supabase.from('contact_messages').insert({ name: formData.fullname, email: formData.email, message: formData.message })
            if (error) throw error
            setSubmitStatus('success')
            setFormData({ fullname: '', email: '', message: '' })
            setTouched({ fullname: false, email: false, message: false })
            setTimeout(() => setSubmitStatus('idle'), 3000)
        } catch {
            setSubmitStatus('error')
            setTimeout(() => setSubmitStatus('idle'), 3000)
        }
    }

    const contactMethods = personalInfo ? [
        { icon: Mail, label: 'Email', value: personalInfo.email, link: `mailto:${personalInfo.email}`, color: 'bg-emerald-50 text-emerald-600' },
        ...(personalInfo.phone ? [{ icon: Phone, label: 'Phone', value: personalInfo.phone, link: `tel:${personalInfo.phone.replace(/\s/g, '')}`, color: 'bg-green-50 text-green-600' }] : []),
        ...(personalInfo.location ? [{ icon: MapPin, label: 'Location', value: personalInfo.location, link: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`, color: 'bg-blue-50 text-blue-600' }] : [])
    ] : [
        { icon: Mail, label: 'Email', value: 'hello@ambooka.dev', link: 'mailto:hello@ambooka.dev', color: 'bg-emerald-50 text-emerald-600' },
        { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', link: '#', color: 'bg-blue-50 text-blue-600' }
    ]

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
    )

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up overflow-y-auto custom-scrollbar pr-2">
            <div>
                <h2 className="text-4xl font-light text-slate-800 mb-1">Get In Touch</h2>
                <p className="text-slate-400 text-sm uppercase tracking-widest">Let's Build Something Amazing</p>
            </div>

            {/* Contact Method Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contactMethods.map((item, i) => (
                    <a
                        key={i}
                        href={item.link}
                        target={item.label === 'Location' ? '_blank' : undefined}
                        rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                        className={`bg-white ${CARD_RADIUS} p-4 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                            <item.icon size={20} />
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase">{item.label}</div>
                            <div className="text-sm font-bold text-slate-800">{item.value}</div>
                        </div>
                    </a>
                ))}
                {socialLinks.map((social) => (
                    <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-white ${CARD_RADIUS} p-4 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${social.platform.toLowerCase() === 'linkedin' ? 'bg-sky-50 text-sky-600' : 'bg-purple-50 text-purple-600'}`}>
                            {social.platform.toLowerCase() === 'linkedin' ? <Linkedin size={20} /> : <Github size={20} />}
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase">{social.platform}</div>
                            <div className="text-sm font-bold text-slate-800">Connect</div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Map */}
            {personalInfo?.location && (
                <div className={`${CARD_RADIUS} overflow-hidden border border-slate-100 shadow-sm`}>
                    <iframe
                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.3021629732!2d36.707307399999996!3d-1.3028617999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2s${encodeURIComponent(personalInfo.location)}!5e0!3m2!1sen!2ske!4v1647608789441!5m2!1sen!2ske`}
                        width="100%"
                        height="200"
                        loading="lazy"
                        className="border-0"
                    />
                </div>
            )}

            {/* Contact Form */}
            <div className={`bg-white ${BOARD_RADIUS} p-6 border border-slate-100 shadow-sm`}>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
                    <div>
                        <h3 className="text-xl font-medium text-slate-800 flex items-center gap-2">
                            <MessageSquare size={20} />Send a Message
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">Fill out the form below and I'll get back to you</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Input */}
                        <div className="relative">
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-colors ${touched.fullname ? (errors.fullname ? 'border-red-300 focus:border-red-400' : 'border-emerald-300 focus:border-emerald-400') : 'border-slate-200 focus:border-emerald-300'
                                    }`}
                            />
                            {touched.fullname && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {errors.fullname ? <AlertCircle size={18} className="text-red-400" /> : <CheckCircle2 size={18} className="text-emerald-500" />}
                                </div>
                            )}
                            {touched.fullname && errors.fullname && (
                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.fullname}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-colors ${touched.email ? (errors.email ? 'border-red-300 focus:border-red-400' : 'border-emerald-300 focus:border-emerald-400') : 'border-slate-200 focus:border-emerald-300'
                                    }`}
                            />
                            {touched.email && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {errors.email ? <AlertCircle size={18} className="text-red-400" /> : <CheckCircle2 size={18} className="text-emerald-500" />}
                                </div>
                            )}
                            {touched.email && errors.email && (
                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Message Textarea */}
                    <div className="relative">
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none resize-none transition-colors ${touched.message ? (errors.message ? 'border-red-300 focus:border-red-400' : 'border-emerald-300 focus:border-emerald-400') : 'border-slate-200 focus:border-emerald-300'
                                }`}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {touched.message && errors.message ? (
                                <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} />{errors.message}</p>
                            ) : <span />}
                            <span className={`text-xs ${formData.message.length >= MAX_MESSAGE_LENGTH ? 'text-red-400' : 'text-slate-400'}`}>
                                {formData.message.length}/{MAX_MESSAGE_LENGTH}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid() || submitStatus === 'loading'}
                        className={`px-6 py-3 rounded-full bg-[${BLACK}] text-white text-sm font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity`}
                    >
                        {submitStatus === 'loading' && <Loader2 className="animate-spin" size={14} />}
                        {submitStatus === 'success' && <CheckCircle2 size={14} />}
                        {submitStatus === 'error' && <AlertCircle size={14} />}
                        {submitStatus === 'idle' && <Send size={14} />}
                        <span>
                            {submitStatus === 'loading' && 'Sending...'}
                            {submitStatus === 'success' && 'Message Sent!'}
                            {submitStatus === 'error' && 'Failed to Send'}
                            {submitStatus === 'idle' && 'Send Message'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    )
}

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Printer, X, Loader2, ChevronDown } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { generateVariantResumeHTML, filterGitHubProjects, type ResumeData as ATSResumeData, type GitHubProject } from '@/lib/resume-generator'
import { ROLE_PROFILES, getRoleOptions, filterSkillsByRole, type RoleVariant } from '@/lib/resume-profiles'
import { GitHubService } from '@/services/github'
import { cn } from '@/lib/utils'

interface PersonalInfo {
  full_name: string; title: string; email: string; phone: string | null
  summary: string | null; location?: string | null; linkedin_url?: string | null
  github_url?: string | null; website_url?: string | null; portfolio_url?: string | null
  [key: string]: unknown
}
interface ProjectItem {
  id: string; title: string; description?: string | null; stack?: string[] | null
  github_url?: string | null; live_url?: string | null; is_featured?: boolean
  [key: string]: unknown
}
interface SkillItem { id: string; name: string; category: string; proficiency_level?: string; [key: string]: unknown }
interface ResumeData {
  personal_info: PersonalInfo
  education: Array<{ id: string; institution: string; degree: string | null; field_of_study: string | null; start_date: string; end_date: string | null; is_current: boolean; description: string | null; [key: string]: unknown }>
  experience: Array<{ id: string; company: string; position: string; start_date: string; end_date: string | null; is_current: boolean; description: string | null; responsibilities: string[] | null; [key: string]: unknown }>
  skills: SkillItem[]
  projects?: ProjectItem[]
}

interface ResumeBuilderPanelProps {
  resumeTrigger?: number
}

export default function ResumeBuilderPanel({ resumeTrigger = 0 }: ResumeBuilderPanelProps) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleVariant>('software-engineer')
  const [resumeHTML, setResumeHTML] = useState<string | null>(null)
  const [resumeBlobUrl, setResumeBlobUrl] = useState<string | null>(null)
  const resumeIframeRef = useRef<HTMLIFrameElement | null>(null)
  const roleOptions = getRoleOptions()

  useEffect(() => {
    if (resumeTrigger > 0) openResumeModal()
  }, [resumeTrigger])

  useEffect(() => {
    const handler = () => openResumeModal()
    window.addEventListener('open-resume-modal', handler)
    return () => window.removeEventListener('open-resume-modal', handler)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResumeModalOpen) setIsResumeModalOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isResumeModalOpen])

  const fetchAndGenerateResume = async (role: RoleVariant = selectedRole) => {
    const profile = ROLE_PROFILES[role]
    const [personal, edu, exp, skills, projects] = await Promise.all([
      supabase.from('personal_info').select('*').single(),
      supabase.from('education').select('*').order('start_date', { ascending: false }),
      supabase.from('experience').select('*').order('start_date', { ascending: false }),
      supabase.from('skills').select('*').order('proficiency_level', { ascending: false }),
      supabase.from('projects').select('*').eq('is_featured', true).order('display_order', { ascending: true })
    ])

    let filteredGitHubProjects: ProjectItem[] = []
    try {
      const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN
      const githubService = new GitHubService(GITHUB_TOKEN)
      const repos = await githubService.getRepositories('ambooka', { maxRepos: 30 })
      filteredGitHubProjects = filterGitHubProjects(repos as GitHubProject[], profile.languages, 4) as unknown as ProjectItem[]
    } catch { /* fallback to Supabase projects */ }

    if (personal.error) throw personal.error
    if (!personal.data) throw new Error('No personal information found.')

    let combinedProjects: ProjectItem[] = filteredGitHubProjects.length > 0
      ? filteredGitHubProjects
      : (projects.data || []).map(p => ({ id: p.id, title: p.title, description: p.description, stack: p.stack, github_url: p.github_url, live_url: p.live_url, is_featured: true as const }))

    if (role === 'it-assistant') {
      combinedProjects = [{ id: 'erp-system', title: 'ERP System Implementation & Support', description: 'Assisted in the successful rollout and ongoing support of a company-wide ERP system.', stack: ['SQL', 'Windows Server', 'Excel Reporting', 'System Administration'], is_featured: true }] as ProjectItem[]
    }

    const allSkills = (skills.data || []) as Array<{ id: string; name: string; category: string; proficiency_level?: string; [key: string]: unknown }>
    const roleFilteredSkills = filterSkillsByRole(allSkills, role)

    const resumeData: ResumeData = {
      personal_info: personal.data as unknown as ResumeData['personal_info'],
      education: edu.data || [],
      experience: exp.data || [],
      skills: roleFilteredSkills as SkillItem[],
      projects: combinedProjects
    }

    return generateVariantResumeHTML(resumeData as unknown as ATSResumeData, {
      roleTitle: profile.title,
      roleSummary: profile.professionalSummary,
      portfolioUrl: 'ambooka.dev',
    })
  }

  const openResumeModal = async () => {
    setIsResumeModalOpen(true)
    setResumeHTML(null)
    if (resumeBlobUrl) { URL.revokeObjectURL(resumeBlobUrl); setResumeBlobUrl(null) }
    try {
      const html = await fetchAndGenerateResume()
      setResumeHTML(html)
      const blob = new Blob([html], { type: 'text/html' })
      setResumeBlobUrl(URL.createObjectURL(blob))
    } catch {
      setResumeHTML('<div style="padding:20px;color:#ef4444;">Failed to load resume data. Please try again.</div>')
    }
  }

  const closeResumeModal = () => {
    setIsResumeModalOpen(false)
    if (resumeBlobUrl) { URL.revokeObjectURL(resumeBlobUrl); setResumeBlobUrl(null) }
    setResumeHTML(null)
  }

  const printResumeAsPDF = async () => {
    setIsDownloading(true)
    try {
      if (!resumeBlobUrl) { alert('Resume not loaded yet'); setIsDownloading(false); return }
      const printWindow = window.open(resumeBlobUrl, '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes')
      if (!printWindow) { alert('Please allow pop-ups to print your resume as PDF'); setIsDownloading(false); return }
      const interval = setInterval(() => {
        try {
          if (printWindow?.document?.readyState === 'complete') {
            clearInterval(interval)
            printWindow.focus(); printWindow.print()
            const closeChecker = setInterval(() => { if (printWindow.closed) { clearInterval(closeChecker); setIsDownloading(false) } }, 500)
          }
        } catch { /* ignore cross-origin errors */ }
      }, 200)
    } catch (err) {
      console.error('Print error', err)
      alert('Failed to open print dialog.')
      setIsDownloading(false)
    }
  }

  return (
    <>
      {/* Resume Button */}
      <div className="relative group">
        <button
          onClick={openResumeModal}
          aria-label="View and Print Resume"
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-full",
            "bg-transparent border-none text-[hsl(var(--muted-foreground))]",
            "hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--accent))]",
            "transition-all focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2"
          )}
        >
          <Printer size={20} />
        </button>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-md text-[11px] font-bold text-[hsl(var(--popover-foreground))] whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden md:block z-50">
          View and Print Resume
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[hsl(var(--popover))] border-r border-b border-[hsl(var(--border))] rotate-[-45deg]" />
        </div>
      </div>

      {/* Resume Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in duration-200" onClick={closeResumeModal}>
          <div
            className="bg-[hsl(var(--background))] rounded-2xl w-[95vw] max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-300 border border-[hsl(var(--border))]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Resume preview"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))/50]">
              <h3 className="text-xl font-bold m-0 text-[hsl(var(--foreground))]">My Resume</h3>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-transparent border-none text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] cursor-pointer transition-colors" onClick={closeResumeModal} aria-label="Close">
                <X size={24} />
              </button>
            </div>

            {/* Role Selector */}
            <div className="px-6 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] flex items-center gap-3">
              <label htmlFor="role-select" className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">Resume Focus:</label>
              <div className="relative">
                <select
                  id="role-select"
                  value={selectedRole}
                  onChange={async (e) => {
                    const newRole = e.target.value as RoleVariant
                    setSelectedRole(newRole)
                    setResumeHTML(null)
                    try {
                      const html = await fetchAndGenerateResume(newRole)
                      setResumeHTML(html)
                      if (resumeBlobUrl) URL.revokeObjectURL(resumeBlobUrl)
                      const blob = new Blob([html], { type: 'text/html' })
                      setResumeBlobUrl(URL.createObjectURL(blob))
                    } catch {
                      setResumeHTML('<div style="padding:20px;color:#ef4444;">Failed to generate resume.</div>')
                    }
                  }}
                  className="appearance-none bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm rounded-lg px-4 py-2 pr-10 cursor-pointer min-w-[220px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                >
                  {roleOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[hsl(var(--muted-foreground))]" />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden bg-[hsl(var(--muted))/20] relative">
              {resumeHTML ? (
                <iframe ref={resumeIframeRef} srcDoc={resumeHTML} title="Resume Preview" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" className="w-full h-full border-none bg-white" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))]">
                  <Loader2 size={32} className="animate-spin mb-4 text-[hsl(var(--accent))]" />
                  <p className="font-medium text-sm">Compiling ATS-Optimized Resume...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 px-6 py-5 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] disabled:opacity-60 disabled:cursor-not-allowed text-[hsl(var(--background))] shadow-[0_4px_14px_hsl(var(--accent)/0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_hsl(var(--accent)/0.3)] border-none cursor-pointer"
                style={isDownloading ? { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', boxShadow: 'none' } : { background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))' }}
                onClick={printResumeAsPDF}
                disabled={isDownloading || !resumeHTML}
              >
                {isDownloading ? (<><Loader2 size={18} className="animate-spin" />Preparing PDF...</>) : (<><Printer size={18} />Print / Save as PDF</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Book, BriefcaseBusiness, Download, FileText, Loader2 } from 'lucide-react'

interface ResumeProps {
  isActive?: boolean
}

interface PersonalInfo {
  full_name: string
  title: string
  email: string
  phone?: string
  summary?: string
}

interface Education {
  id: string
  institution: string
  degree?: string
  field_of_study?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  grade?: string
}

interface Experience {
  id: string
  company: string
  position: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  responsibilities?: string[]
  achievements?: string[]
  technologies?: string[]
}

interface Skill {
  id: string
  name: string
  category: string
  proficiency_level?: number
  is_featured: boolean
}

interface ResumeData {
  personal_info: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skill[]
}

export default function Resume({ isActive = false }: ResumeProps) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadLoading, setDownloadLoading] = useState(false)

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchResumeData()
  }, [])

  const fetchResumeData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch complete resume data using the stored procedure
      const { data, error: fetchError } = await supabase.rpc('get_complete_resume')

      if (fetchError) {
        throw new Error('Failed to fetch resume data')
      }

      if (!data) {
        throw new Error('No resume data available')
      }

      setResumeData(data)
    } catch (err) {
      console.error('Error fetching resume:', err)
      setError(err instanceof Error ? err.message : 'Failed to load resume')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | null, isCurrent: boolean): string => {
    if (isCurrent) return 'Present'
    if (!date) return ''
    return new Date(date).getFullYear().toString()
  }

  const formatDateRange = (startDate: string, endDate: string | null, isCurrent: boolean): string => {
    const start = formatDate(startDate, false)
    const end = formatDate(endDate, isCurrent)
    return `${start} — ${end}`
  }

  // Download ATS-friendly PDF using browser print
  const downloadAsPDF = () => {
    setDownloadLoading(true)

    // Open the resume in a new window for printing
    const printWindow = window.open(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-resume-pdf`,
      '_blank'
    )

    // Add event listener for when the window loads
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print()
          setDownloadLoading(false)
        }, 500)
      })
    } else {
      setDownloadLoading(false)
      alert('Please allow pop-ups to download the resume')
    }
  }

  // Alternative: Download as HTML that can be printed to PDF
  const downloadAsHTML = async () => {
    try {
      setDownloadLoading(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-resume-pdf`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to generate resume')

      const html = await response.text()
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData?.personal_info?.full_name.replace(/\s+/g, '_')}_Resume.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading resume:', err)
      alert('Failed to download resume. Please try again.')
    } finally {
      setDownloadLoading(false)
    }
  }

  // Group skills by category
  const groupSkillsByCategory = (skills: Skill[]) => {
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category || 'other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    }, {} as Record<string, Skill[]>)

    return grouped
  }

  if (loading) {
    return (
      <article className={`resume ${isActive ? 'active' : ''}`} data-page="resume">
        <header>
          <h2 className="h2 article-title">Resume</h2>
        </header>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--orange-yellow-crayola)' }} />
          <p>Loading resume...</p>
        </div>
      </article>
    )
  }

  if (error || !resumeData) {
    return (
      <article className={`resume ${isActive ? 'active' : ''}`} data-page="resume">
        <header>
          <h2 className="h2 article-title">Resume</h2>
        </header>
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: 'var(--light-gray)'
        }}>
          <p>{error || 'Failed to load resume data'}</p>
          <button
            onClick={fetchResumeData}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: 'var(--orange-yellow-crayola)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </article>
    )
  }

  const skillsGrouped = groupSkillsByCategory(resumeData.skills)

  return (
    <article className={`resume ${isActive ? 'active' : ''}`} data-page="resume">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 className="h2 article-title">Resume</h2>

        {/* Download Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={downloadAsPDF}
            disabled={downloadLoading}
            className="download-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--orange-yellow-crayola)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--smoky-black)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: downloadLoading ? 'not-allowed' : 'pointer',
              opacity: downloadLoading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {downloadLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Download PDF
          </button>

          <button
            onClick={downloadAsHTML}
            disabled={downloadLoading}
            className="download-btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'transparent',
              border: '2px solid var(--orange-yellow-crayola)',
              borderRadius: '8px',
              color: 'var(--orange-yellow-crayola)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: downloadLoading ? 'not-allowed' : 'pointer',
              opacity: downloadLoading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            <FileText size={16} />
            Save as HTML
          </button>
        </div>
      </header>

      {/* Education Section */}
      {resumeData.education && resumeData.education.length > 0 && (
        <section className="timeline">
          <div className="title-wrapper">
            <div className="icon-box">
              <Book />
            </div>
            <h3 className="h3">Education</h3>
          </div>

          <ol className="timeline-list">
            {resumeData.education.map((edu) => (
              <li key={edu.id} className="timeline-item">
                <h4 className="h4 timeline-item-title">{edu.institution}</h4>
                <span>{formatDateRange(edu.start_date, edu.end_date || null, edu.is_current)}</span>
                {(edu.degree || edu.field_of_study) && (
                  <p className="timeline-text" style={{ fontWeight: '600', marginTop: '8px' }}>
                    {edu.degree}{edu.degree && edu.field_of_study ? ' in ' : ''}{edu.field_of_study}
                    {edu.grade && ` - ${edu.grade}`}
                  </p>
                )}
                {edu.description && (
                  <p className="timeline-text">{edu.description}</p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Experience Section */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <section className="timeline">
          <div className="title-wrapper">
            <div className="icon-box">
              <BriefcaseBusiness />
            </div>
            <h3 className="h3">Experience</h3>
          </div>

          <ol className="timeline-list">
            {resumeData.experience.map((exp) => (
              <li key={exp.id} className="timeline-item">
                <h4 className="h4 timeline-item-title">{exp.position}</h4>
                <span>{formatDateRange(exp.start_date, exp.end_date || null, exp.is_current)}</span>
                <p className="timeline-text" style={{ fontWeight: '600', marginTop: '8px' }}>
                  {exp.company}{exp.location && ` - ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="timeline-text">{exp.description}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{resp}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Key Achievements:</strong>
                    <ul style={{ marginTop: '4px', marginLeft: '20px' }}>
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="timeline-text" style={{ marginTop: '8px', fontStyle: 'italic', fontSize: '14px' }}>
                    <strong>Technologies:</strong> {exp.technologies.join(', ')}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Skills Section */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <section className="skill">
          <h3 className="h3 skills-title">My Skills</h3>

          <ul className="skills-list content-card">
            {resumeData.skills
              .filter(skill => skill.is_featured)
              .map((skill) => (
                <li key={skill.id} className="skills-item">
                  <div className="title-wrapper">
                    <h5 className="h5">{skill.name}</h5>
                    {skill.proficiency_level && (
                      <data value={skill.proficiency_level}>{skill.proficiency_level}%</data>
                    )}
                  </div>
                  {skill.proficiency_level && (
                    <div className="skill-progress-bg">
                      <div
                        className="skill-progress-fill"
                        style={{ width: `${skill.proficiency_level}%` }}
                      ></div>
                    </div>
                  )}
                </li>
              ))}
          </ul>

          {/* All Skills by Category */}
          <div style={{ marginTop: '30px' }}>
            <h4 className="h4" style={{ marginBottom: '20px' }}>All Skills by Category</h4>
            {Object.entries(skillsGrouped).map(([category, skills]) => (
              <div key={category} style={{ marginBottom: '20px' }}>
                <h5
                  className="h5"
                  style={{
                    textTransform: 'capitalize',
                    marginBottom: '12px',
                    color: 'var(--orange-yellow-crayola)'
                  }}
                >
                  {category.replace('_', ' ')}
                </h5>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {skills.map(skill => (
                    <span
                      key={skill.id}
                      style={{
                        padding: '6px 12px',
                        background: 'var(--border-gradient-onyx)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        border: '1px solid var(--jet)'
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .download-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }

        .download-btn-secondary:hover:not(:disabled) {
          background: rgba(255, 193, 7, 0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 580px) {
          header {
            flex-direction: column;
            align-items: flex-start !important;
          }
          
          header > div {
            width: 100%;
          }
          
          .download-btn,
          .download-btn-secondary {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </article>
  )
}
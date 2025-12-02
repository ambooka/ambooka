import { useState, useEffect } from 'react'
import { Book, BriefcaseBusiness, Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface ResumeProps {
  isActive?: boolean
}

interface PersonalInfo {
  id: string
  category: string
  content: string
  title: string
  created_at: string
  updated_at: string
  tags?: string[] | null
  full_name?: string
  email?: string
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
  const [loading, setLoading] = useState(true)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResumeData()
  }, [])

  const fetchResumeData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all resume data in parallel
      const [personalInfoResult, educationResult, experienceResult, skillsResult] = await Promise.all([
        supabase.from('portfolio_content').select('*').single(),
        supabase.from('portfolio_content').select('*').eq('category', 'education').order('created_at', { ascending: false }),
        supabase.from('portfolio_content').select('*').eq('category', 'experience').order('created_at', { ascending: false }),
        supabase.from('portfolio_content').select('*').eq('category', 'skills').order('created_at', { ascending: false })
      ])

      if (personalInfoResult.error) throw personalInfoResult.error
      if (educationResult.error) throw educationResult.error
      if (experienceResult.error) throw experienceResult.error
      if (skillsResult.error) throw skillsResult.error

      setResumeData({
        personal_info: personalInfoResult.data as PersonalInfo,
        education: (educationResult.data || []) as unknown as Education[],
        experience: (experienceResult.data || []) as unknown as Experience[],
        skills: (skillsResult.data || []) as unknown as Skill[]
      })
    } catch (err: any) {
      console.error('Error fetching resume data:', err)
      setError(err.message || 'Failed to load resume data')
    } finally {
      setLoading(false)
    }
  }

  // Map skill names to their logo URLs
  const getSkillLogo = (skillName: string): string => {
    const logoMap: Record<string, string> = {
      // Languages
      'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
      'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',

      // Frontend
      'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',

      // Backend
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      '.NET Core': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
      'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
      'Django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
      'Flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',

      // AI/ML
      'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
      'Keras': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg',

      // Cloud
      'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
      'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
      'Google Cloud': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',

      // DevOps
      'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'GitLab': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
      'Jenkins': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',

      // Database
      'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',

      // Mobile
      'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
      'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',

      // Tools
      'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
      'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      'GraphQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
      'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
      'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
      'Bash': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
      'PowerShell': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg',
      'Ansible': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg',
      'Terraform': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
      'Nginx': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
      'Apache': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg',
      'Grafana': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg',
      'Prometheus': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg',
    }

    return logoMap[skillName] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg'
  }

  // const fetchResumeData = async () => { ... } (Removed)


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
      <header>
        <h2 className="h2 article-title">Resume</h2>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <h4 className="h4 timeline-item-title">{edu.institution}</h4>
                  <span>{formatDateRange(edu.start_date, edu.end_date || null, edu.is_current)}</span>
                </div>
                {(edu.degree || edu.field_of_study) && (
                  <p className="timeline-text" style={{ fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                    {edu.degree}{edu.degree && edu.field_of_study ? ' in ' : ''}{edu.field_of_study}
                  </p>
                )}
                {edu.grade && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    background: 'var(--border-gradient-onyx)',
                    borderRadius: '20px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    <span style={{ fontSize: '16px' }}>🎓</span>
                    {edu.grade}
                  </div>
                )}
                {edu.description && (
                  <p className="timeline-text" style={{ marginTop: '8px' }}>{edu.description}</p>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <h4 className="h4 timeline-item-title">{exp.position}</h4>
                  <span>{formatDateRange(exp.start_date, exp.end_date || null, exp.is_current)}</span>
                </div>
                <p className="timeline-text" style={{ fontWeight: '600', marginBottom: '12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>🏢</span>
                  {exp.company}{exp.location && ` • ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="timeline-text" style={{ marginBottom: '16px', fontStyle: 'italic' }}>{exp.description}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Key Responsibilities:</strong>
                    <ul style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="timeline-text" style={{ lineHeight: '1.6' }}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>⭐</span>
                      Key Achievements:
                    </strong>
                    <ul style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="timeline-text" style={{ lineHeight: '1.6' }}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {exp.technologies.map((tech, idx) => (
                      <span key={idx} style={{
                        padding: '4px 12px',
                        background: 'var(--border-gradient-onyx)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--accent-color)'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Skills Section */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <section className="skill">
          <h3 className="h3 skills-title">Technical Skills</h3>

          {/* Core Competencies - Logo Cards */}
          <div style={{ marginBottom: '40px' }}>
            <h4 className="h4" style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--text-primary)' }}>Core Competencies</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '16px'
            }}>
              {resumeData.skills
                .filter(skill => skill.is_featured)
                .map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '20px 16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-1)',
                      transition: 'all var(--transition-2)',
                      cursor: 'default',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-3)';
                      e.currentTarget.style.borderColor = 'var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-1)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: 'var(--text-gradient-primary)'
                    }}></div>
                    <img
                      src={getSkillLogo(skill.name)}
                      alt={skill.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'contain'
                      }}
                      loading="lazy"
                    />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      textAlign: 'center',
                      lineHeight: '1.3'
                    }}>
                      {skill.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* All Skills by Category - Logo Cards */}
          <div>
            <h4 className="h4" style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--text-primary)' }}>Skills by Category</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {Object.entries(skillsGrouped).map(([category, skills]) => (
                <div key={category} className="content-card" style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-1)',
                  transition: 'all var(--transition-2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'var(--text-gradient-primary)',
                    opacity: 0.8
                  }}></div>
                  <h5
                    className="h5"
                    style={{
                      textTransform: 'capitalize',
                      marginBottom: '20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent-color)',
                      display: 'inline-block'
                    }}></span>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '16px'
                  }}>
                    {skills.map(skill => (
                      <div
                        key={skill.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '16px 12px',
                          background: 'var(--border-gradient-onyx)',
                          borderRadius: '12px',
                          border: '1px solid transparent',
                          transition: 'all var(--transition-2)',
                          cursor: 'default',
                          minHeight: '110px',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-color)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <img
                          src={getSkillLogo(skill.name)}
                          alt={skill.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain'
                          }}
                          loading="lazy"
                        />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'var(--text-secondary)',
                          textAlign: 'center',
                          lineHeight: '1.3'
                        }}>
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
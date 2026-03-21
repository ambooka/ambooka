'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, BriefcaseBusiness, Loader2, Award, Download } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import AnimatedPage from '@/components/AnimatedPage'
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  staggerChildScale,
  scrollRevealTransition,
  defaultViewport,
} from '@/lib/motion'

interface ResumeProps {
  isActive?: boolean
  initialData?: ResumeData
}

interface PersonalInfo {
  id: string
  full_name: string
  title: string
  email: string
  phone: string | null
  location: string | null
  summary: string | null
  linkedin_url: string | null
  github_url: string | null
  website_url: string | null
  created_at: string
  updated_at: string
}

interface Education {
  id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  grade: string | null
  display_order: number | null
  created_at: string
  updated_at: string
}

interface Experience {
  id: string
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  responsibilities: string[] | null
  achievements: string[] | null
  technologies: string[] | null
  display_order: number | null
  created_at: string
  updated_at: string
}

interface Skill {
  id: string
  name: string
  category: string
  proficiency_level?: number | null
  proficiency?: number | null
  is_featured: boolean
  display_order: number | null
  created_at: string
  updated_at: string
}

interface ResumeData {
  personal_info: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skill[]
}

export default function Resume({ isActive = false, initialData }: ResumeProps) {
  const [loading, setLoading] = useState(!initialData)
  const [resumeData, setResumeData] = useState<ResumeData | null>(initialData || null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData) {
      fetchResumeData()
    }
  }, [initialData])

  const fetchResumeData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [personalInfoResult, educationResult, experienceResult, skillsResult] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('education').select('*').order('start_date', { ascending: false }),
        supabase.from('experience').select('*').order('start_date', { ascending: false }),
        supabase.from('skills').select('*').order('proficiency_level', { ascending: false })
      ])

      const pInfo = personalInfoResult.data || { id: 'mock', full_name: 'Abdulrahman Ambooka', title: 'MLOps Architect', email: 'hello@ambooka.dev', summary: 'MLOps Architect & AI Platform Specialist' } as PersonalInfo;

      setResumeData({
        personal_info: pInfo,
        education: educationResult.data || [],
        experience: experienceResult.data || [],
        skills: skillsResult.data || []
      })
    } catch (err: unknown) {
      console.error('Error fetching resume data:', err)
      setResumeData({
        personal_info: {} as PersonalInfo,
        education: [],
        experience: [],
        skills: []
      })
    } finally {
      setLoading(false)
    }
  }

  const getSkillLogo = (skillName: string): string => {
    const logoMap: Record<string, string> = {
      'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
      'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      '.NET Core': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
      'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
      'Django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
      'Flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
      'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
      'Keras': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg',
      'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
      'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
      'Google Cloud': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
      'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'GitLab': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
      'Jenkins': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
      'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
      'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
      'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
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

  if (loading) {
    return (
      <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="resume">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
            Resume
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 size={40} className="animate-spin text-[hsl(var(--accent))]" />
          <p className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px]">Loading resume...</p>
        </div>
      </article>
    )
  }

  if (error || !resumeData) {
    return (
      <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="resume">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
            Resume
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
        </header>
        <div className="p-8 text-center text-[hsl(var(--muted-foreground))] flex flex-col items-center justify-center border border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--muted))]">
          <p className="mb-4">{error || 'Failed to load resume data'}</p>
          <button
            onClick={fetchResumeData}
            className="px-6 py-2.5 bg-[hsl(var(--accent))] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </article>
    )
  }

  return (
    <AnimatedPage>
    <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="resume">
      <motion.header
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={scrollRevealTransition}
      >
        <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3 w-fit">
          Resume
          <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
        </h2>
      </motion.header>

      {/* Education Section */}
      {resumeData.education && resumeData.education.length > 0 && (
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 flex items-center justify-center bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] rounded-xl border border-[hsl(var(--accent))/0.2] shadow-sm">
              <Book size={24} />
            </div>
            <h3 className="text-xl font-black text-[hsl(var(--foreground))] uppercase tracking-tight">Education</h3>
          </div>

          <div className="relative border-l-2 border-[hsl(var(--border))] ml-6 pb-2 space-y-10 pl-8">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[hsl(var(--accent))] border-4 border-[hsl(var(--card))] shadow-sm transition-transform duration-300 group-hover:scale-125" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-lg font-bold text-[hsl(var(--foreground))]">{edu.institution}</h4>
                  <span className="shrink-0 inline-flex items-center text-[hsl(var(--accent))] font-black text-[11px] uppercase tracking-widest bg-[hsl(var(--accent))/0.1] px-3 py-1 rounded-full border border-[hsl(var(--accent))/0.2]">
                    {formatDateRange(edu.start_date, edu.end_date || null, edu.is_current)}
                  </span>
                </div>
                
                {(edu.degree || edu.field_of_study) && (
                  <p className="text-[15px] font-semibold text-[hsl(var(--foreground))] mb-3">
                    {edu.degree}{edu.degree && edu.field_of_study ? ' in ' : ''}{edu.field_of_study}
                  </p>
                )}
                
                {edu.grade && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-full mb-4 text-[13px] font-medium text-[hsl(var(--muted-foreground))]">
                    <span className="text-base">🎓</span>
                    {edu.grade}
                  </div>
                )}
                
                {edu.description && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Experience Section */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 flex items-center justify-center bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] rounded-xl border border-[hsl(var(--accent))/0.2] shadow-sm">
              <BriefcaseBusiness size={24} />
            </div>
            <h3 className="text-xl font-black text-[hsl(var(--foreground))] uppercase tracking-tight">Experience</h3>
          </div>

          <div className="relative border-l-2 border-[hsl(var(--border))] ml-6 pb-2 space-y-12 pl-8">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[hsl(var(--accent))] border-4 border-[hsl(var(--card))] shadow-sm transition-transform duration-300 group-hover:scale-125" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-lg font-bold text-[hsl(var(--foreground))]">{exp.position}</h4>
                  <span className="shrink-0 inline-flex items-center text-[hsl(var(--accent))] font-black text-[11px] uppercase tracking-widest bg-[hsl(var(--accent))/0.1] px-3 py-1 rounded-full border border-[hsl(var(--accent))/0.2]">
                    {formatDateRange(exp.start_date, exp.end_date || null, exp.is_current)}
                  </span>
                </div>
                
                <p className="text-[15px] font-semibold text-[hsl(var(--muted-foreground))] mb-4 flex items-center gap-2">
                  <span className="text-lg">🏢</span>
                  {exp.company}{exp.location && ` • ${exp.location}`}
                </p>
                
                {exp.description && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-5 italic border-l-2 border-[hsl(var(--muted))] pl-4 py-1">
                    {exp.description}
                  </p>
                )}
                
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-5">
                    <strong className="text-sm text-[hsl(var(--foreground))] mb-3 block">Key Responsibilities:</strong>
                    <ul className="list-disc ml-5 space-y-2 text-sm text-[hsl(var(--muted-foreground))] marker:text-[hsl(var(--muted-foreground))/50]">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="line-clamp-none pl-1">{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-5">
                    <strong className="text-sm text-[hsl(var(--foreground))] mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      Key Achievements:
                    </strong>
                    <ul className="list-none space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-[hsl(var(--accent))] before:rounded-sm">
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg text-xs font-semibold text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))/0.5]">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Skills Section */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <motion.section
          className="mt-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl font-black text-[hsl(var(--foreground))] uppercase tracking-tight">Technical Skills</h3>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-6">Core Competencies</h4>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-4">
              {resumeData.skills
                .filter(skill => skill.is_featured)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative flex flex-col items-center gap-3 p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-[hsl(var(--accent))/0.5] overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-12 h-12 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={getSkillLogo(skill.name)}
                        alt={skill.name}
                        fill
                        className="object-contain"
                        loading="lazy"
                        unoptimized
                      />
                    </div>
                    
                    <span className="text-[13px] font-bold text-[hsl(var(--foreground))] text-center leading-tight">
                      {skill.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </motion.section>
      )}
    </article>
    </AnimatedPage>
  )
}

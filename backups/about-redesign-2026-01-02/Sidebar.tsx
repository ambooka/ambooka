'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Download, Github, Linkedin, Twitter, Loader2, FileText } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'

interface PersonalInfo {
  full_name: string
  title: string
  email: string
  phone: string | null
  location: string | null
  bio?: string | null
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_url: string | null
  display_order: number
}

const FALLBACK_INFO: PersonalInfo = {
  full_name: 'Ambooka Msah',
  title: 'MLOps Engineer',
  email: 'abdulrahmanambooka@gmail.com',
  phone: '+254111384390',
  location: 'Nairobi, Kenya',
  bio: 'Building production-ready ML systems and cloud-native applications with modern technologies.'
}

const FALLBACK_SOCIAL: SocialLink[] = [
  { id: 'github', platform: 'GitHub', url: 'https://github.com/ambooka', icon_url: null, display_order: 1 },
  { id: 'linkedin', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/abdulrahman-ambooka/', icon_url: null, display_order: 2 },
  { id: 'twitter', platform: 'Twitter', url: 'https://twitter.com/ambooka', icon_url: null, display_order: 3 }
]

// Fallback tech stack if DB is empty
const FALLBACK_TECH = [
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' }
]

// Fallback stats
const FALLBACK_STATS = [
  { value: '3+', label: 'Years' },
  { value: '25+', label: 'Projects' },
  { value: '40+', label: 'Tech' }
]

interface Technology {
  name: string
  logo_url: string
}

interface Stat {
  value: string
  label: string
}

export default function Sidebar() {
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState<PersonalInfo>(FALLBACK_INFO)
  const [social, setSocial] = useState<SocialLink[]>(FALLBACK_SOCIAL)
  const [techStack, setTechStack] = useState<{ name: string, logo: string }[]>(FALLBACK_TECH)
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS)

  useEffect(() => {
    (async () => {
      try {
        // Fetch from consolidated schema: personal_info has JSONB fields for social_links and about_text
        // Skills table now includes icon_url for tech stack display
        const [personalResult, skillsResult, projectsResult] = await Promise.all([
          supabase.from('personal_info').select('*').single(),
          supabase.from('skills').select('name, icon_url, is_featured').eq('is_featured', true).order('display_order').limit(5),
          supabase.from('projects').select('id', { count: 'exact', head: true })
        ])

        // Parse personal info with JSONB fields
        if (personalResult.data) {
          const data = personalResult.data

          // Set basic info
          setInfo({
            ...FALLBACK_INFO,
            ...data,
            bio: data.about_text || FALLBACK_INFO.bio
          })

          // Parse social links from JSONB
          if (data.social_links && Array.isArray(data.social_links)) {
            setSocial(data.social_links as unknown as SocialLink[])
          }
        }

        // Set tech stack from featured skills (with icon_url)
        if (skillsResult.data?.length) {
          setTechStack(skillsResult.data.map((s: { name: string; icon_url: string | null }) => ({
            name: s.name,
            logo: s.icon_url || `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s.name.toLowerCase()}/${s.name.toLowerCase()}-original.svg`
          })))
        }

        // Calculate stats from DB counts
        const projectCount = projectsResult.count ?? 0
        const skillCount = skillsResult.data?.length ?? 0

        // Phase-based label instead of years
        setStats([
          { value: '2/9', label: 'Phase' },
          { value: projectCount > 0 ? `${projectCount}+` : '18', label: 'Projects' },
          { value: `${skillCount}+`, label: 'Skills' }
        ])

      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    })()
  }, [])

  const getIcon = (p: string) => {
    const size = 14
    switch (p.toLowerCase()) {
      case 'github': return <Github size={size} />
      case 'linkedin': return <Linkedin size={size} />
      case 'twitter': return <Twitter size={size} />
      default: return <Mail size={size} />
    }
  }

  if (loading) {
    return (
      <aside className="profile-card">
        <Loader2 className="spin" size={24} />
        <style jsx>{`
          .profile-card { background: #E8DDD4; border-radius: 24px; min-height: 450px; display: flex; align-items: center; justify-content: center; max-width: 300px; }
          .spin { animation: s 1s linear infinite; color: var(--accent-primary); }
          @keyframes s { to { transform: rotate(360deg); } }
        `}</style>
      </aside>
    )
  }

  return (
    <aside className="sidebar-card">
      {/* Hero Photo - Full width, fades into content */}
      <div className="hero">
        <Image
          src="/assets/images/my-avatar.jpg"
          alt={info.full_name}
          fill
          className="hero-img"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
        <div className="hero-overlay" />

        <div className="identity">
          <h1 className="name">{info.full_name}</h1>
          <span className="job-title">{info.title}</span>
        </div>
      </div>

      {/* Content section */}
      <div className="content">
        {/* Tech Stack */}
        <div className="tech-row">
          {techStack.map((tech, i) => (
            <div key={i} className="tech-badge" title={tech.name}>
              <img src={tech.logo} alt={tech.name} />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>



        {/* Stats */}
        <div className="stats">
          {stats.map((s, i) => (
            <div key={i} className="stat">
              <span className="stat-val">{s.value}</span>
              <span className="stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="contact">
          <a href={`mailto:${info.email}`}><Mail size={12} />{info.email}</a>
          {info.phone && <a href={`tel:${info.phone}`}><Phone size={12} />{info.phone}</a>}
          {info.location && <span><MapPin size={12} />{info.location}</span>}
        </div>

        {/* Actions */}
        <div className="actions">
          {social.map(s => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="social-btn">
              {s.icon_url ? <img src={s.icon_url} alt="" /> : getIcon(s.platform)}
            </a>
          ))}
          <a href="/resume.pdf" download className="resume-btn">
            <FileText size={14} />
            <span>Resume</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .sidebar-card {
          background: #E8DDD4;
          border-radius: 24px;
          overflow: hidden;
          position: sticky;
          top: 20px;
          align-self: flex-start;
          width: 100%;
          max-width: 280px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
        }

        /* Hero section with photo - Top ~30% */
        .hero {
          position: relative;
          width: 100%;
          height: 240px; /* Reduced from 450px to represent top portion */
          flex-shrink: 0;
        }

        .hero-img {
          /* Style handled by Next.js Image style prop */
        }

        .hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to top, #E8DDD4 20%, rgba(232, 221, 212, 0.6) 50%, rgba(232, 221, 212, 0) 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* Identity overlaid on hero but pushing into content */
        .identity {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0 20px 10px;
          text-align: center;
          z-index: 2;
        }

        .name {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .job-title {
          font-size: 0.85rem;
          color: #555;
          font-weight: 500;
          opacity: 0.9;
        }

        /* Content */
        .content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 10px 20px 24px;
          background: #E8DDD4;
        }

        /* Tech Stack badges - Match About.tsx style exactly */
        .tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
          margin-bottom: 8px;
        }

        .tech-badge {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(250, 248, 245, 0.5); /* var(--bg-primary)/50 */
          border: 1px solid rgba(142, 14, 40, 0.1); 
          border-radius: 12px;
          font-size: 9px;
          color: #6B5847; /* var(--text-tertiary) */
          font-weight: 500;
          transition: all 0.2s ease;
          min-width: auto;
          box-shadow: none;
          cursor: default;
        }

        .tech-badge:hover {
          background: rgba(250, 248, 245, 1);
          border-color: rgba(142, 14, 40, 0.3);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          color: #2A1810; /* var(--text-primary) */
        }

        .tech-badge img {
          width: 12px;
          height: 12px;
          object-fit: contain;
          opacity: 0.6;
          filter: grayscale(100%);
          transition: all 0.3s ease;
        }

        .tech-badge:hover img {
          opacity: 1;
          filter: grayscale(0%);
        }



        /* Stats */
        .stats {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-val {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--accent-primary, #8E0E28);
          background: rgba(142, 14, 40, 0.1);
          padding: 3px 10px;
          border-radius: 10px;
        }

        .stat-lbl {
          font-size: 0.5rem;
          color: #777;
          margin-top: 2px;
        }

        /* Contact */
        .contact {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px;
          background: rgba(255,255,255,0.4);
          border-radius: 12px;
        }

        .contact a, .contact span {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          color: #444;
          text-decoration: none;
          font-weight: 500;
        }

        .contact a:hover { color: var(--accent-primary, #8E0E28); }

        .contact svg { 
          color: #8E0E28; /* Accent color for icons */
          flex-shrink: 0; 
          opacity: 0.8;
          width: 14px;
          height: 14px;
        }

        /* Actions */
        .actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }

        .social-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.6);
          border-radius: 10px;
          color: #555;
          transition: all 0.2s;
        }

        .social-btn:hover {
          background: var(--accent-primary, #8E0E28);
          color: white;
          transform: translateY(-2px);
        }

        .social-btn img { width: 16px; height: 16px; }

        .resume-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #4A4A4A, #2D2D2D);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 8px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .resume-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        /* Responsive */
        @media (max-height: 700px) {
          .hero { height: 200px; }
          .content { gap: 10px; padding: 10px 16px 16px; }
          .name { font-size: 1.2rem; }
        }
      `}</style>
    </aside>
  )
}

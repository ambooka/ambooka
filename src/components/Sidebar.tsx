'use client'

import { useState, useEffect } from 'react'
import { Loader2, Mail, Download, MapPin, X, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/integrations/supabase/client'

interface SocialLink {
  id?: string
  platform: string
  url: string
  icon_url: string | null
  is_active?: boolean
}

interface PersonalInfo {
  full_name: string
  title: string
  avatar_url: string | null
  about_text: string | null
  email?: string
  phone?: string
  location?: string
  social_links?: SocialLink[] | null
}

const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  full_name: 'Abdulrahman Ambooka',
  title: 'MLOps Architect & Software Engineer',
  avatar_url: null,
  about_text: 'Building production-ready ML systems. Focused on bridging the gap between data science and reliable infrastructure.',
  email: 'hello@ambooka.dev',
  phone: undefined,
  location: 'Nairobi, Kenya',
  social_links: []
}

interface ObtainedCert {
  id: string
  name: string
  icon_url: string | null
  phase_number: number | null
}

interface SidebarProps {
  isModal?: boolean
  isOpen?: boolean
  onClose?: () => void
  onOpenResume?: () => void
}

export default function Sidebar({ isModal = false, isOpen = false, onClose, onOpenResume }: SidebarProps) {
  const [loading, setLoading] = useState(true)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [obtainedCerts, setObtainedCerts] = useState<ObtainedCert[]>([])
  const profile = personalInfo ?? DEFAULT_PERSONAL_INFO

  useEffect(() => { fetchSidebarData() }, [])

  const fetchSidebarData = async () => {
    try {
      const [infoRes, certsRes] = await Promise.all([
        supabase.from('personal_info').select('*').limit(1).maybeSingle(),
        supabase.from('certifications')
          .select('id, name, icon_url, phase_number')
          .eq('is_obtained', true)
          .order('phase_number'),
      ])

      if (infoRes.error) {
        console.error('Sidebar personal info fetch error:', infoRes.error)
      }

      if (certsRes.error) {
        console.error('Sidebar certifications fetch error:', certsRes.error)
      }

      if (infoRes.data) {
        const info = infoRes.data as unknown as PersonalInfo
        setPersonalInfo(info)
        if (info.social_links && Array.isArray(info.social_links)) {
          setSocialLinks(info.social_links.filter(l => l.is_active !== false))
        }
      }
      if (certsRes.data) setObtainedCerts(certsRes.data as unknown as ObtainedCert[])
    } catch (e) {
      console.error('Sidebar fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  const shortCertName = (name: string): string => {
    const map: Record<string, string> = {
      'B.Sc. Computer Science \u2014 Maseno University': 'BSc Computer Science',
      'Bachelor of Science in Computer Science': 'BSc Computer Science',
    }
    const n = map[name] ?? name
    return n.length > 30 ? n.slice(0, 28) + '\u2026' : n
  }

  const certBadgeFallback = (name: string): string => {
    const n = name.toLowerCase()
    if (n.includes('aws')) return 'https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png'
    if (n.includes('terraform')) return 'https://images.credly.com/size/340x340/images/99289602-861e-4929-8277-773e63a2fa6f/image.png'
    if (n.includes('kubernetes') || n.includes('cka')) return 'https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png'
    return '/assets/badges/maseno-university.png'
  }

  const getIconUrl = (platform: string): string => {
    // Direct SVG data URLs for reliable display - Modified to use currentColor for flexibility
    const iconSvgs: Record<string, string> = {
      'linkedin': 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'),
      'github': 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'),
      'twitter': 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'),
      'x': 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'),
      'instagram': 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'),
      'youtube': 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'),
    }

    const key = platform.toLowerCase()
    if (iconSvgs[key]) {
      return iconSvgs[key]
    }

    // Fallback to Simple Icons CDN
    const platformMap: Record<string, string> = {
      'facebook': 'facebook',
      'tiktok': 'tiktok',
      'dribbble': 'dribbble',
      'behance': 'behance',
      'medium': 'medium',
      'dev': 'devdotto',
      'stackoverflow': 'stackoverflow',
      'codepen': 'codepen',
      'discord': 'discord',
      'slack': 'slack',
      'telegram': 'telegram',
      'whatsapp': 'whatsapp',
    }
    const slug = platformMap[key] || key

    // Use 'default' color for simple icons which is usually black/brand color, or handle theme
    return `https://cdn.simpleicons.org/${slug}`
  }

  if (loading) {
    return (
      <div className={isModal ? `profile-modal-container ${isOpen ? 'active' : ''}` : 'sidebar-standard'}>
        {isModal && <div className="modal-overlay" onClick={onClose} />}

        <div className={`profile-card ${isModal ? 'modal-view' : ''} ${isModal && !isOpen ? 'closed' : ''}`}>
          {isModal && <div className="sheet-grabber" />}

          <div className="profile-card-loading">
            <Loader2 size={28} className="animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={isModal ? `profile-modal-container ${isOpen ? 'active' : ''}` : 'sidebar-standard'}>
      {isModal && <div className="modal-overlay" onClick={onClose} />}

      <div className={`profile-card ${isModal ? 'modal-view' : ''} ${isModal && !isOpen ? 'closed' : ''}`}>
        {/* Grabber for mobile sheet */}
        {isModal && <div className="sheet-grabber" />}

        {/* Close Button - Only for modal */}
        {isModal && (
          <button className="modal-close-btn" onClick={onClose} aria-label="Close Profile">
            <X size={20} />
          </button>
        )}

        {/* 1. Hero Section - Profile Image */}
        <div className="profile-hero">
          <Image
            src={profile.avatar_url || '/assets/images/my-avatar.jpg'}
            alt={profile.full_name}
            fill
            className="profile-avatar-img"
            priority
          />
          <div className="profile-fade" />

          {/* 2. Identity - Name & Title overlaid */}
          <div className="profile-identity">
            <h2 className="profile-name">{profile.full_name}</h2>
            <p className="profile-title">{profile.title}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="profile-content">
          {/* 3. Social Links - High visibility placement */}
          {socialLinks.length > 0 && (
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={social.id || index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  title={social.platform}
                >
                  <Image
                    src={social.icon_url || getIconUrl(social.platform)}
                    alt={social.platform}
                    width={20}
                    height={20}
                    className="social-icon"
                  />
                </a>
              ))}
            </div>
          )}

          {/* 5. Bio / Intro Statement */}
          <p className="intro-text">
            {profile.about_text ||
              "Building production-ready ML systems. Focused on bridging the gap between data science and reliable infrastructure."}
          </p>

          {/* 6. Location (optional - visible context) */}
          {profile.location && (
            <div className="location-badge">
              <MapPin size={14} />
              <span>{profile.location}</span>
            </div>
          )}


          {/* 8. Obtained Credentials */}
          {obtainedCerts.length > 0 && (
            <div className="sidebar-certs">
              <div className="sidebar-certs-header">
                <CheckCircle2 size={12} className="sidebar-certs-icon" />
                <span>Credentials</span>
              </div>
              <div className="sidebar-certs-list">
                {obtainedCerts.map(cert => (
                  <div key={cert.id} className="sidebar-cert-item">
                    <Image
                      src={cert.icon_url || certBadgeFallback(cert.name)}
                      alt={cert.name}
                      width={24}
                      height={24}
                      className="sidebar-cert-badge"
                      unoptimized
                    />
                    <span className="sidebar-cert-name">{shortCertName(cert.name)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. CTA Buttons - Primary actions at bottom */}
          <div className="action-buttons">
            <a
              href={`mailto:${profile.email || 'contact@example.com'}`}
              className="btn btn-primary"
            >
              <Mail size={18} />
              <span>Contact Me</span>
            </a>
            <button
              onClick={() => {
                if (onOpenResume) {
                  onOpenResume()
                  if (onClose) onClose() // Close profile modal if open
                } else {
                  // Dispatch custom event to open resume modal
                  window.dispatchEvent(new CustomEvent('open-resume-modal'))
                  if (onClose) onClose()
                }
              }}
              className="btn btn-secondary"
            >
              <Download size={18} />
              <span>Download Resume</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-modal-container {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: flex-end; /* Align to bottom for sheet effect */
          justify-content: center;
          padding: 0;
          pointer-events: none;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .profile-modal-container.active {
          opacity: 1;
          pointer-events: auto;
        }

        .modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }

        :global([data-theme="premium-light"]) .modal-overlay {
          background: rgba(30, 58, 66, 0.15);
        }

        .profile-card {
          position: relative;
          z-index: 10;
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 400px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Bottom Sheet Style */
        .profile-card.modal-view {
          transform: translateY(100%);
          max-height: 85vh;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom: none;
        }

        .active .profile-card.modal-view {
          transform: translateY(0);
        }

        .sheet-grabber {
          width: 40px;
          height: 4px;
          background: var(--border-medium, rgba(30, 58, 66, 0.1));
          border-radius: 2px;
          margin: 12px auto 0;
          z-index: 25;
          position: relative;
        }

        .profile-card.modal-view .profile-hero {
          height: 160px; /* Slimmer hero in modal */
        }

        .profile-card.modal-view .profile-identity {
          padding: 12px 20px;
        }

        .profile-card.modal-view .profile-content {
          padding-top: 8px;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 20;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        [data-theme="dark"] .profile-card,
        [data-theme="premium-dark"] .profile-card {
          background: rgba(26, 47, 54, 0.95);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .profile-card-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 350px;
          color: var(--accent-primary, #14B8A6);
        }

        /* Hero with seamless fade */
        .profile-hero {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .profile-avatar-img {
          object-fit: cover;
          object-position: center 20%;
        }

        .profile-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom,
            transparent 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.4) 70%,
            rgba(255, 255, 255, 0.85) 90%,
            var(--bg-secondary, #FFFFFF) 100%);
          pointer-events: none;
        }

        [data-theme="dark"] .profile-fade,
        [data-theme="premium-dark"] .profile-fade {
          background: linear-gradient(to bottom,
            transparent 0%,
            transparent 50%,
            rgba(26, 47, 54, 0.4) 70%,
            rgba(26, 47, 54, 0.85) 90%,
            rgba(26, 47, 54, 0.9) 100%);
        }

        .profile-identity {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px;
          text-align: center;
          z-index: 2;
        }

        .profile-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary, #1E3A42);
          margin-bottom: 2px;
        }

        .profile-title {
          font-size: 0.8rem;
          color: var(--text-secondary, #546E7A);
          font-weight: 500;
        }

        .profile-content {
          padding: 16px 20px 20px;
          margin-bottom: 12px;
        }

        @media (max-width: 640px) {
          .profile-content {
            padding: 12px 15px 15px;
            margin-bottom: 8px;
          }
        }

        .availability-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: rgba(16, 185, 129, 0.9);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 600;
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          position: relative;
        }

        .ripple {
          position: absolute;
          top: 50%;
          left: 17px;
          width: 20px;
          height: 20px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          animation: ripple 2s ease-out infinite;
          pointer-events: none;
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .location-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-tertiary, #90A4AE);
          margin-bottom: 16px;
        }

        .intro-text {
          font-size: 0.8rem;
          line-height: 1.6;
          color: var(--text-secondary, #546E7A);
          margin: 0 0 16px;
          text-align: center;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .social-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: var(--transition-base);
          background: var(--bg-primary); /* Clay Base */
          box-shadow: var(--shadow-sm); /* Clay Shadow */
        }

        .social-btn:hover {
          color: var(--accent-primary);
          background: var(--bg-secondary);
          transform: translateY(-4px) scale(1.1); /* Bouncy Lift */
          box-shadow: var(--shadow-md);
          border-color: var(--accent-secondary);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          border-radius: var(--radius-lg);
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition-base);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: var(--accent-primary);
          color: #1F2937; /* Dark text for contrast on yellow */
          border: none;
          box-shadow: var(--shadow-card);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-card-hover);
          background: var(--accent-secondary); /* Darker Yellow on Hover */
        }

        .btn-primary:active {
           transform: translateY(0);
           box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: none; /* No border for clay */
          box-shadow: var(--shadow-sm);
        }

        .btn-secondary:hover {
          background: var(--bg-tertiary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          color: var(--accent-primary);
        }

        .btn-secondary:active {
           transform: translateY(0);
           box-shadow: inset 2px 2px 4px rgba(0,0,0,0.1);
        }


        .sidebar-certs {
          margin-bottom: 16px;
          padding: 12px 14px;
          background: var(--bg-primary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .sidebar-certs-header {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
          margin-bottom: 10px;
        }

        .sidebar-certs-icon {
          color: #16a34a;
        }

        .sidebar-certs-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .sidebar-cert-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 8px;
          background: var(--bg-secondary);
          border-radius: 8px;
          border: 1px solid var(--border-light);
          transition: border-color 0.2s ease;
        }

        .sidebar-cert-item:hover {
          border-color: #16a34a;
        }

        .sidebar-cert-badge {
          object-fit: contain;
          flex-shrink: 0;
          border-radius: 4px;
        }

        .sidebar-cert-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }

      `}</style>
    </div>
  )
}

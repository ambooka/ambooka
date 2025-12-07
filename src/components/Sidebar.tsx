'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, Calendar, Mail, Phone, MapPin, Linkedin, Loader2 } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'

interface PersonalInfo {
  full_name: string
  title: string
  email: string
  phone: string | null
  location: string | null
  birthday?: string | null
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_url: string | null
  display_order: number
}

export default function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    fetchSidebarData()
  }, [])

  const fetchSidebarData = async () => {
    try {
      const [personalResult, socialResult] = await Promise.all([
        supabase.from('personal_info').select('*').single(),
        supabase.from('social_links').select('*').eq('is_active', true).eq('show_in_sidebar', true).order('display_order')
      ])

      if (personalResult.data) {
        setPersonalInfo(personalResult.data)
      }

      if (socialResult.data) {
        setSocialLinks(socialResult.data)
      }
    } catch (error) {
      console.error('Error fetching sidebar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatBirthday = (dateString: string | null | undefined) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <aside className="sidebar" data-sidebar>
        <div className="sidebar-info" style={{ justifyContent: 'center', minHeight: '200px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--orange-yellow-crayola)' }} />
        </div>
        <style jsx>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </aside>
    )
  }

  if (!personalInfo) {
    return (
      <aside className="sidebar" data-sidebar>
        <div className="sidebar-info">
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            No profile data found
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`sidebar ${isSidebarVisible ? 'active' : ''}`} data-sidebar>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <Image
            src="/assets/images/my-avatar.png"
            alt={personalInfo.full_name}
            width={80}
            height={80}
            className="avatar-img"
            priority
          />
        </figure>

        <div className="info-content">
          <h1 className="name" title={personalInfo.full_name}>{personalInfo.full_name}</h1>
          <p className="title">{personalInfo.title}</p>
        </div>

        <button
          className="info_more-btn"
          data-sidebar-btn
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <span>{isSidebarVisible ? 'Hide Contacts' : 'Show Contacts'}</span>
          <ChevronDown className="btn-icon" size={18} />
        </button>
      </div>

      <div className="sidebar-info_more">
        <div className="separator"></div>

        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <Mail />
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href={`mailto:${personalInfo.email}`} className="contact-link">{personalInfo.email}</a>
            </div>
          </li>

          {personalInfo.phone && (
            <li className="contact-item">
              <div className="icon-box">
                <Phone />
              </div>
              <div className="contact-info">
                <p className="contact-title">Phone</p>
                <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`} className="contact-link">{personalInfo.phone}</a>
              </div>
            </li>
          )}

          {personalInfo.birthday && (
            <li className="contact-item">
              <div className="icon-box">
                <Calendar />
              </div>
              <div className="contact-info">
                <p className="contact-title">Birthday</p>
                <time dateTime={personalInfo.birthday}>{formatBirthday(personalInfo.birthday)}</time>
              </div>
            </li>
          )}

          {personalInfo.location && (
            <li className="contact-item">
              <div className="icon-box">
                <MapPin />
              </div>
              <div className="contact-info">
                <p className="contact-title">Location</p>
                <address>{personalInfo.location}</address>
              </div>
            </li>
          )}
        </ul>

        <div className="separator"></div>

        {socialLinks.length > 0 && (
          <ul className="social-list">
            {socialLinks.map((social) => (
              <li key={social.id} className="social-item">
                <a
                  href={social.url}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  title={social.platform}
                >
                  {social.icon_url ? (
                    <img
                      src={social.icon_url}
                      alt={social.platform}
                      width="18"
                      height="18"
                      loading="lazy"
                    />
                  ) : (
                    <Linkedin className="w-[18px] h-[18px]" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .social-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-top: 15px;
          padding: 0 10px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--border-gradient-onyx);
          transition: all 0.3s ease;
          position: relative;
        }

        .social-link::before {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: var(--onyx);
          color: var(--white-2);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .social-link:hover::before {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }

        .social-link:hover {
          background: var(--bg-gradient-primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow-2);
        }

        .social-link img {
          transition: transform 0.3s ease;
        }

        .social-link:hover img {
          transform: scale(1.15);
        }
      `}</style>
    </aside>
  )
}
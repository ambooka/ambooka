'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Brain, Code, Bot, Cloud, Loader2 } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'

interface AboutProps {
  isActive?: boolean
}

interface AboutContent {
  id: string
  section_key: string
  title: string | null
  content: string
  icon: string | null
  badge: string | null
  display_order: number
  is_active: boolean
}

interface Testimonial {
  id: string
  name: string
  avatar_url: string | null
  text: string
  date: string
  is_featured: boolean
  display_order: number
}

interface Technology {
  id: string
  name: string
  logo_url: string
  category: string
  display_order: number
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Code,
  Bot,
  Cloud
}

export default function About({ isActive = false }: AboutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const scrollTrackRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [aboutText, setAboutText] = useState('')
  const [expertiseAreas, setExpertiseAreas] = useState<AboutContent[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [aboutResult, testimonialsResult, technologiesResult] = await Promise.all([
        supabase.from('about_content').select('*').eq('is_active', true).order('display_order'),
        supabase.from('testimonials').select('*').eq('is_active', true).order('display_order'),
        supabase.from('technologies').select('*').eq('is_active', true).order('display_order')
      ])

      if (aboutResult.data) {
        const aboutTextItem = aboutResult.data.find(item => item.section_key === 'about_text')
        if (aboutTextItem) {
          setAboutText(aboutTextItem.content)
        }
        const expertise = aboutResult.data.filter(item => item.section_key.startsWith('expertise_'))
        setExpertiseAreas(expertise)
      }

      if (testimonialsResult.data) {
        setTestimonials(testimonialsResult.data)
      }

      if (technologiesResult.data) {
        setTechnologies(technologiesResult.data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Duplicate technologies for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies]

  const openTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
  }

  const closeTestimonialModal = () => {
    setIsModalOpen(false)
    setSelectedTestimonial(null)
  }

  if (loading) {
    return (
      <article className={`about ${isActive ? 'active' : ''}`} data-page="about">
        <header>
          <h2 className="h2 article-title">About me</h2>
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
          <p>Loading...</p>
        </div>
      </article>
    )
  }

  return (
    <article className={`about ${isActive ? 'active' : ''}`} data-page="about">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text">
        <p>{aboutText || "No about text configured. Please add content via the admin dashboard."}</p>
      </section>

      {expertiseAreas.length > 0 && (
        <section className="service">
          <h3 className="h3 service-title">Areas of Expertise</h3>

          <ul className="service-list">
            {expertiseAreas.map((area) => {
              const IconComponent = area.icon ? iconMap[area.icon] : Code
              return (
                <li key={area.id} className="service-item">
                  <div className="service-icon-box">
                    {IconComponent && <IconComponent className="w-10 h-10 text-[var(--accent-color)]" />}
                  </div>
                  <div className="service-content-box">
                    <h4 className="h4 service-item-title">
                      {area.title}
                      {area.badge && (
                        <span className={`badge ${area.badge}`}>
                          {area.badge.charAt(0).toUpperCase() + area.badge.slice(1)}
                        </span>
                      )}
                    </h4>
                    <p className="service-item-text">{area.content}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="testimonials">
          <h3 className="h3 testimonials-title">Recommendations</h3>

          <ul className="testimonials-list has-scrollbar">
            {testimonials.map(testimonial => (
              <li key={testimonial.id} className="testimonials-item">
                <div
                  className="content-card"
                  onClick={() => openTestimonialModal(testimonial)}
                  style={{ cursor: 'pointer' }}
                >
                  <figure className="testimonials-avatar-box">
                    <img
                      src={testimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                      alt={testimonial.name}
                      width="60"
                    />
                  </figure>
                  <h4 className="h4 testimonials-item-title">{testimonial.name}</h4>
                  <div className="testimonials-text">
                    <p>{testimonial.text.slice(0, 150)}...</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isModalOpen && selectedTestimonial && (
        <div className="modal-container active">
          <div className="overlay active" onClick={closeTestimonialModal}></div>
          <section className="testimonials-modal">
            <button className="modal-close-btn" onClick={closeTestimonialModal}>
              <X className="w-5 h-5" />
            </button>
            <div className="modal-img-wrapper">
              <figure className="modal-avatar-box">
                <img
                  src={selectedTestimonial.avatar_url || '/assets/images/avatar-placeholder.png'}
                  alt={selectedTestimonial.name}
                  width="80"
                />
              </figure>
              <img src="/assets/images/icon-quote.svg" alt="quote icon" />
            </div>
            <div className="modal-content">
              <h4 className="h3 modal-title">{selectedTestimonial.name}</h4>
              <time dateTime={selectedTestimonial.date}>
                {new Date(selectedTestimonial.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <div>
                <p>{selectedTestimonial.text}</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {technologies.length > 0 && (
        <section>
          <h3 className="h3 clients-title">Technologies I Work With</h3>
          <div className="infinite-scroll-wrapper">
            <div className="infinite-scroll-container">
              <div className="infinite-scroll-track" ref={scrollTrackRef}>
                {duplicatedTechnologies.map((tech, index) => (
                  <div key={`${tech.id}-${index}`} className="tech-item">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <img
                        src={tech.logo_url}
                        alt={`${tech.name} logo`}
                        loading="lazy"
                        decoding="async"
                        width="60"
                        height="60"
                      />
                      <span className="tech-name">{tech.name}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .infinite-scroll-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin: 20px 0;
          padding: 15px 0;
        }
        
        .infinite-scroll-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
        
        .infinite-scroll-track {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        
        .infinite-scroll-container:hover .infinite-scroll-track {
          animation-play-state: paused;
        }
        
        .tech-item {
          flex: 0 0 auto;
          width: 100px;
          margin: 0 15px;
          text-align: center;
          transition: transform 0.3s ease;
        }
        
        .tech-item:hover {
          transform: translateY(-5px);
        }
        
        .tech-item img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin: 0 auto 8px;
          filter: grayscale(100%);
          opacity: 0.7;
          transition: all 0.3s ease;
          will-change: transform, filter, opacity;
          backface-visibility: hidden;
        }
        
        .tech-item:hover img {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.1);
        }
        
        .tech-name {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 5px;
          font-weight: 500;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .testimonials-list.has-scrollbar {
          scrollbar-width: none;
        }
        
        .testimonials-list.has-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 580px) {
          .tech-item {
            width: 80px;
            margin: 0 10px;
          }
          
          .tech-item img {
            width: 50px;
            height: 50px;
          }
          
          .tech-name {
            font-size: 11px;
          }
          
          .infinite-scroll-track {
            animation: scroll 25s linear infinite;
          }
        }
        
        @media (max-width: 449px) {
          .tech-item {
            width: 70px;
            margin: 0 8px;
          }
          
          .tech-item img {
            width: 45px;
            height: 45px;
          }
          
          .tech-name {
            font-size: 10px;
          }
        }
      `}</style>
    </article>
  )
}
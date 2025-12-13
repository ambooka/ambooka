'use client'

import { useState, useEffect } from 'react'
import { Send, Mail, Phone, MapPin, Linkedin, Github, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'

interface ContactProps {
  isActive?: boolean
}

interface PersonalInfo {
  email: string
  phone: string | null
  location: string | null
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_url: string | null
  display_order: number
  show_in_contact: boolean
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export default function Contact({ isActive = false }: ContactProps) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({
    fullname: '',
    email: '',
    message: ''
  })
  const [touched, setTouched] = useState({
    fullname: false,
    email: false,
    message: false
  })
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  const MAX_MESSAGE_LENGTH = 500

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      setLoading(true)
      const [personalResult, socialResult] = await Promise.all([
        supabase.from('personal_info').select('email, phone, location').single(),
        supabase.from('social_links').select('*').eq('is_active', true).eq('show_in_contact', true).order('display_order')
      ])

      if (personalResult.data) {
        setPersonalInfo(personalResult.data)
      }

      if (socialResult.data) {
        setSocialLinks(socialResult.data)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'fullname':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !validateEmail(value) ? 'Please enter a valid email address' : ''
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : ''
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return
    }

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

  const isFormValid = () => {
    return Object.values(formData).every(val => val.trim() !== '') &&
      Object.values(errors).every(err => err === '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      fullname: validateField('fullname', formData.fullname),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message)
    }

    setErrors(newErrors)
    setTouched({ fullname: true, email: true, message: true })

    if (Object.values(newErrors).some(err => err !== '')) {
      return
    }

    setSubmitStatus('loading')

    try {
      // Save to database
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.fullname,
        email: formData.email,
        message: formData.message
      })

      if (error) throw error

      setSubmitStatus('success')
      setFormData({ fullname: '', email: '', message: '' })
      setTouched({ fullname: false, email: false, message: false })

      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin size={20} />
      case 'github':
        return <Github size={20} />
      default:
        return null
    }
  }

  const contactMethods = personalInfo ? [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      link: `mailto:${personalInfo.email}`,
      color: '#EA4335'
    },
    ...(personalInfo.phone ? [{
      icon: Phone,
      label: 'Phone',
      value: personalInfo.phone,
      link: `tel:${personalInfo.phone.replace(/\s/g, '')}`,
      color: '#34A853'
    }] : []),
    ...(personalInfo.location ? [{
      icon: MapPin,
      label: 'Location',
      value: personalInfo.location,
      link: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`,
      color: '#4285F4'
    }] : [])
  ] : []

  if (loading) {
    return (
      <article className={`contact portfolio-tab ${isActive ? 'active' : ''}`} data-page="contact">
        <header>
          <h2 className="h2 article-title">Get In Touch</h2>
        </header>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px'
        }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--orange-yellow-crayola)' }} />
        </div>
        <style jsx>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </article>
    )
  }

  return (
    <article className={`contact portfolio-tab ${isActive ? 'active' : ''}`} data-page="contact">
      <header>
        <h2 className="h2 article-title">Get In Touch</h2>
        <p style={{
          color: 'var(--text-secondary)',
          marginTop: '12px',
          fontSize: '15px',
          lineHeight: '1.6'
        }}>
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
      </header>

      {/* Contact Methods Cards */}
      <section style={{ marginTop: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <a
                key={index}
                href={method.link}
                target={method.label === 'Location' ? '_blank' : undefined}
                rel={method.label === 'Location' ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'all var(--transition-2)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'var(--accent-color)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'var(--border-color)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${method.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon style={{ width: '24px', height: '24px', color: method.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                    fontWeight: 500
                  }}>
                    {method.label}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {method.value}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      {/* Map Section */}
      {personalInfo?.location && (
        <section className="mapbox" data-mapbox style={{
          marginBottom: '40px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <figure style={{ margin: 0 }}>
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.3021629732!2d36.707307399999996!3d-1.3028617999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2s${encodeURIComponent(personalInfo.location)}!5e0!3m2!1sen!2ske!4v1647608789441!5m2!1sen!2ske`}
              width="100%"
              height="320"
              loading="lazy"
              style={{ border: 0, display: 'block' }}
            />
          </figure>
        </section>
      )}

      {/* Contact Form */}
      <section className="contact-form">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 className="h3 form-title" style={{ marginBottom: '8px' }}>
              <MessageSquare style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Send a Message
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Fill out the form below and I'll get back to you as soon as possible
            </p>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-2)',
                  textDecoration: 'none'
                }}
                title={social.platform}
              >
                {social.icon_url ? (
                  <img src={social.icon_url} alt={social.platform} width="20" height="20" />
                ) : (
                  getIconForPlatform(social.platform)
                )}
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form" data-form>
          <div className="input-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {/* Full Name Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="fullname"
                className="form-input"
                placeholder="Full name"
                required
                value={formData.fullname}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor: touched.fullname ? (errors.fullname ? '#ef4444' : '#10b981') : 'var(--border-color)',
                  paddingRight: touched.fullname ? '40px' : '16px'
                }}
              />
              {touched.fullname && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  {errors.fullname ? (
                    <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                  ) : (
                    <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981' }} />
                  )}
                </div>
              )}
              {touched.fullname && errors.fullname && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.fullname}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor: touched.email ? (errors.email ? '#ef4444' : '#10b981') : 'var(--border-color)',
                  paddingRight: touched.email ? '40px' : '16px'
                }}
              />
              {touched.email && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  {errors.email ? (
                    <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                  ) : (
                    <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981' }} />
                  )}
                </div>
              )}
              {touched.email && errors.email && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div style={{ position: 'relative', marginTop: '16px' }}>
            <textarea
              name="message"
              className="form-input"
              placeholder="Your Message"
              required
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor: touched.message ? (errors.message ? '#ef4444' : '#10b981') : 'var(--border-color)',
                resize: 'vertical'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <div>
                {touched.message && errors.message && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <AlertCircle style={{ width: '14px', height: '14px' }} />
                    {errors.message}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: '12px',
                color: formData.message.length >= MAX_MESSAGE_LENGTH ? '#ef4444' : 'var(--text-secondary)'
              }}>
                {formData.message.length}/{MAX_MESSAGE_LENGTH}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="form-btn"
            type="submit"
            disabled={!isFormValid() || submitStatus === 'loading'}
            style={{
              marginTop: '24px',
              opacity: (!isFormValid() || submitStatus === 'loading') ? 0.6 : 1,
              cursor: (!isFormValid() || submitStatus === 'loading') ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {submitStatus === 'loading' && (
              <Loader2 className="w-5 h-5 animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            )}
            {submitStatus === 'success' && (
              <CheckCircle2 className="w-5 h-5" />
            )}
            {submitStatus === 'error' && (
              <AlertCircle className="w-5 h-5" />
            )}
            {submitStatus === 'idle' && (
              <Send className="w-5 h-5" />
            )}
            <span>
              {submitStatus === 'loading' && 'Sending...'}
              {submitStatus === 'success' && 'Message Sent!'}
              {submitStatus === 'error' && 'Failed to Send'}
              {submitStatus === 'idle' && 'Send Message'}
            </span>
          </button>
        </form>
      </section>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 580px) {
          .contact-form .input-wrapper {
            grid-template-columns: 1fr !important;
          }
          
          .mapbox {
            height: 250px;
            margin-bottom: 30px;
          }
          
          .form-title {
            font-size: var(--fs-4);
          }
          
          .contact .article-title {
            font-size: var(--fs-2);
          }
        }
        
        @media (max-width: 450px) {
          .mapbox {
            height: 220px;
          }
        }
      `}</style>
    </article>
  )
}
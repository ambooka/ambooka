'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Github, MessageSquare, Loader2 } from "lucide-react"
import { supabase } from '@/integrations/supabase/client'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import ContactForm from '@/components/widgets/ContactForm'
import AnimatedPage from '@/components/AnimatedPage'
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  scrollRevealTransition,
  defaultViewport,
} from '@/lib/motion'

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

export default function Contact({ isActive = false }: ContactProps) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('personal_info')
        .select('email, phone, location, social_links')
        .single()

      if (error) console.error('Error fetching contact data:', error)

      if (data) {
        setPersonalInfo({ email: data.email, phone: data.phone, location: data.location })
        if (data.social_links && Array.isArray(data.social_links)) {
          const links = (data.social_links as unknown as SocialLink[])
            .filter(link => link.show_in_contact)
            .sort((a, b) => a.display_order - b.display_order)
          setSocialLinks(links)
        }
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin size={20} />
      case 'github': return <Github size={20} />
      default: return null
    }
  }

  const contactMethods = personalInfo ? [
    { icon: Mail, label: 'Email', value: personalInfo.email, link: `mailto:${personalInfo.email}`, colorClass: 'text-red-500 bg-red-500/10' },
    ...(personalInfo.phone ? [{ icon: Phone, label: 'Phone', value: personalInfo.phone, link: `tel:${personalInfo.phone.replace(/\s/g, '')}`, colorClass: 'text-green-500 bg-green-500/10' }] : []),
    ...(personalInfo.location ? [{ icon: MapPin, label: 'Location', value: personalInfo.location, link: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`, colorClass: 'text-blue-500 bg-blue-500/10' }] : [])
  ] : []

  if (loading) {
    return (
      <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="contact">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
            Get In Touch
            <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
          </h2>
          <p className="mt-4 text-[0.94rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
            Let&apos;s build something extraordinary together.
          </p>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 size={40} className="animate-spin text-[hsl(var(--accent))]" />
          <p className="text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest text-[10px]">Establishing Secure Connection...</p>
        </div>
      </article>
    )
  }

  return (
    <AnimatedPage>
    <article className={cn("w-full max-w-full m-0 p-0", isActive ? "block" : "hidden")} data-page="contact">
      <motion.header
        className="mb-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={scrollRevealTransition}
      >
        <h2 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-[-0.03em] capitalize relative inline-block pb-3">
          Get In Touch
          <div className="absolute bottom-0 left-0 w-10 h-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))]" />
        </h2>
        <p className="mt-4 text-[0.94rem] leading-relaxed text-[hsl(var(--muted-foreground))] max-w-[600px]">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
      </motion.header>

      {/* Contact Methods */}
      <motion.section
        className="mt-10 mb-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.a
                key={index}
                variants={staggerChild}
                href={method.link}
                target={method.label === 'Location' ? '_blank' : undefined}
                rel={method.label === 'Location' ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent))/0.5] hover:shadow-md"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors", method.colorClass)}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.75rem] font-semibold text-[hsl(var(--muted-foreground))] mb-1 uppercase tracking-wider">{method.label}</div>
                  <div className="text-[0.875rem] font-bold text-[hsl(var(--foreground))] truncate leading-tight group-hover:text-[hsl(var(--accent))] transition-colors">{method.value}</div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </motion.section>

      {/* Map */}
      {personalInfo?.location && (
        <motion.section
          className="mb-10 rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-sm"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={scrollRevealTransition}
        >
          <figure className="m-0 bg-[hsl(var(--muted))]">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.3021629732!2d36.707307399999996!3d-1.3028617999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2s${encodeURIComponent(personalInfo.location)}!5e0!3m2!1sen!2ske!4v1647608789441!5m2!1sen!2ske`}
              width="100%"
              height="320"
              loading="lazy"
              className="border-0 block w-full max-sm:h-[250px]"
              title="Location Map"
            />
          </figure>
        </motion.section>
      )}

      {/* Contact Form Section */}
      <motion.section
        className="p-6 md:p-8 rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/30 shadow-sm"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={scrollRevealTransition}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-[hsl(var(--foreground))]">
              <MessageSquare className="w-6 h-6 text-[hsl(var(--accent))]" />
              Send a Message
            </h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Fill out the form below and I&apos;ll get back to you as soon as possible
            </p>
          </div>
          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))/0.5] hover:-translate-y-1 hover:shadow-sm"
                title={social.platform}
              >
                {social.icon_url ? (
                  <Image src={social.icon_url} alt={social.platform} width={20} height={20} className="object-contain" />
                ) : (
                  getIconForPlatform(social.platform)
                )}
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
      </motion.section>
    </article>
    </AnimatedPage>
  )
}

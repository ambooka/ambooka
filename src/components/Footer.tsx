'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, scrollRevealTransition, defaultViewport, buttonTap } from '@/lib/motion'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Resume', href: '/resume' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/ambooka', icon: <Github size={18} /> },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ambooka', icon: <Linkedin size={18} /> },
  { label: 'Email', href: 'mailto:hello@ambooka.dev', icon: <Mail size={18} /> },
] as const

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className={cn(
        "hidden md:block w-full border-t border-[hsl(var(--border))]",
        "bg-[hsl(var(--card)/0.5)] backdrop-blur-md"
      )}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={scrollRevealTransition}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 mb-8">
          {/* Brand column */}
          <div className="space-y-3">
            <Link
              href="/"
              className={cn(
                "inline-block text-xl font-extrabold tracking-tighter",
                "text-[hsl(var(--foreground))]"
              )}
            >
              ambooka
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-[32ch]">
              Software Engineer & MLOps Architect building production-ready ML systems and beautiful web experiences.
            </p>
            {/* Social row */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -2 }}
                  whileTap={buttonTap}
                  className={cn(
                    "inline-flex items-center justify-center w-9 h-9 rounded-xl",
                    "border border-[hsl(var(--border))] bg-[hsl(var(--foreground)/0.04)]",
                    "text-[hsl(var(--muted-foreground))]",
                    "hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.08)] hover:border-[hsl(var(--accent)/0.16)]",
                    "transition-colors duration-200"
                  )}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium",
                      "text-[hsl(var(--foreground)/0.8)]",
                      "hover:text-[hsl(var(--accent))] transition-colors duration-200"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
              Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_0_0.2rem_hsl(var(--accent)/0.15)]" />
                <span className="text-sm font-medium text-[hsl(var(--foreground)/0.8)]">Available for Hire</span>
              </div>
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-semibold",
                  "text-[hsl(var(--accent))] hover:underline transition-colors"
                )}
              >
                Get in touch <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider + bottom row */}
        <div className="h-px w-full bg-[hsl(var(--border))] mb-5" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <span>&copy; {currentYear} Abdulrahman Ambooka. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with
            <span className="font-semibold text-[hsl(var(--foreground)/0.7)]">Next.js</span>
            &
            <span className="font-semibold text-[hsl(var(--foreground)/0.7)]">Framer Motion</span>
          </span>
        </div>
      </div>
    </motion.footer>
  )
}

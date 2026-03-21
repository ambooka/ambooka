'use client'

import React, { useEffect, useState, useRef } from 'react'
import { CheckCircle2, Clock, Shield, GraduationCap } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import Image from 'next/image'
<<<<<<< HEAD
import { cn } from '@/lib/utils'
=======
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

interface Certification {
    id: string
    name: string
    issuer: string
    issue_date: string | null
    expiry_date: string | null
    credential_id: string | null
    credential_url: string | null
    status: 'Obtained' | 'Pursuit'
    category: string | null
    badge_image?: string
}

<<<<<<< HEAD
const CERT_STYLE_MAP: Record<string, { gradient: string, glow: string, badge_bg: string }> = {
    'AWS': {
        gradient: 'from-[#FF9900]/20 to-[#FF9900]/5',
        glow: 'group-hover:shadow-[0_4px_24px_rgba(255,153,0,0.2)] hover:border-[#FF9900]/30',
=======
// Map certifications to colors for the "Disney-style" look
const CERT_STYLE_MAP: Record<string, { gradient: string, glow: string, badge_bg: string }> = {
    'AWS': {
        gradient: 'from-[#FF9900]/20 to-[#FF9900]/5',
        glow: 'group-hover:shadow-[#FF9900]/20',
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        badge_bg: 'bg-[#FF9900]/10'
    },
    'Azure': {
        gradient: 'from-[#008AD7]/20 to-[#008AD7]/5',
<<<<<<< HEAD
        glow: 'group-hover:shadow-[0_4px_24px_rgba(0,138,215,0.2)] hover:border-[#008AD7]/30',
=======
        glow: 'group-hover:shadow-[#008AD7]/20',
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        badge_bg: 'bg-[#008AD7]/10'
    },
    'GCP': {
        gradient: 'from-[#4285F4]/20 to-[#4285F4]/5',
<<<<<<< HEAD
        glow: 'group-hover:shadow-[0_4px_24px_rgba(66,133,244,0.2)] hover:border-[#4285F4]/30',
=======
        glow: 'group-hover:shadow-[#4285F4]/20',
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        badge_bg: 'bg-[#4285F4]/10'
    },
    'Kubernetes': {
        gradient: 'from-[#326CE5]/20 to-[#326CE5]/5',
<<<<<<< HEAD
        glow: 'group-hover:shadow-[0_4px_24px_rgba(50,108,229,0.2)] hover:border-[#326CE5]/30',
=======
        glow: 'group-hover:shadow-[#326CE5]/20',
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        badge_bg: 'bg-[#326CE5]/10'
    },
    'Terraform': {
        gradient: 'from-[#844FBA]/20 to-[#844FBA]/5',
<<<<<<< HEAD
        glow: 'group-hover:shadow-[0_4px_24px_rgba(132,79,186,0.2)] hover:border-[#844FBA]/30',
=======
        glow: 'group-hover:shadow-[#844FBA]/20',
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        badge_bg: 'bg-[#844FBA]/10'
    },
    'Databricks': {
        gradient: 'from-[#FF3621]/20 to-[#FF3621]/5',
<<<<<<< HEAD
        glow: 'group-hover:shadow-[0_4px_24px_rgba(255,54,33,0.2)] hover:border-[#FF3621]/30',
=======
        glow: 'group-hover:shadow-[#FF3621]/20',
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        badge_bg: 'bg-[#FF3621]/10'
    },
    'Computer Science': {
        gradient: 'from-[#8E0E28]/20 to-[#8E0E28]/5',
<<<<<<< HEAD
        glow: 'group-hover:shadow-[0_4px_24px_rgba(142,14,40,0.2)] hover:border-[#8E0E28]/30',
        badge_bg: 'bg-[#8E0E28]/10'
    },
    'Default': {
        gradient: 'from-[hsl(var(--accent))]/20 to-[hsl(var(--accent))]/5',
        glow: 'group-hover:shadow-[0_4px_24px_hsl(var(--accent)/0.2)] hover:border-[hsl(var(--accent))]/30',
        badge_bg: 'bg-[hsl(var(--accent))]/10'
=======
        glow: 'group-hover:shadow-[#8E0E28]/20',
        badge_bg: 'bg-[#8E0E28]/10'
    },
    'Default': {
        gradient: 'from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5',
        glow: 'group-hover:shadow-[var(--accent-primary)]/20',
        badge_bg: 'bg-[var(--accent-primary)]/10'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
    }
}

const getStyle = (name: string) => {
    if (name.includes('AWS')) return CERT_STYLE_MAP['AWS']
    if (name.includes('Azure')) return CERT_STYLE_MAP['Azure']
    if (name.includes('GCP') || name.includes('Google')) return CERT_STYLE_MAP['GCP']
    if (name.includes('Kubernetes') || name.includes('CKA') || name.includes('CKAD')) return CERT_STYLE_MAP['Kubernetes']
    if (name.includes('Terraform')) return CERT_STYLE_MAP['Terraform']
    if (name.includes('Databricks')) return CERT_STYLE_MAP['Databricks']
    if (name.includes('Computer Science') || name.includes('Degree')) return CERT_STYLE_MAP['Computer Science']
    return CERT_STYLE_MAP['Default']
}

<<<<<<< HEAD
const MOCK_CERTS: Certification[] = [
    {
        id: '1', name: 'AWS Solutions Architect - Associate', issuer: 'Amazon Web Services', issue_date: 'Oct 2023', expiry_date: null, credential_id: 'AWS-SAA-C03', credential_url: '#', status: 'Obtained', category: 'Cloud', badge_image: '/assets/badges/aws-saa.png'
    },
    {
        id: '2', name: 'AWS Machine Learning - Specialty', issuer: 'Amazon Web Services', issue_date: null, expiry_date: null, credential_id: null, credential_url: '#', status: 'Pursuit', category: 'ML', badge_image: '/assets/badges/aws-mls.png'
    },
    {
        id: '3', name: 'Certified Kubernetes Administrator', issuer: 'Cloud Native Computing Foundation', issue_date: 'Dec 2023', expiry_date: null, credential_id: 'CKA-2300', credential_url: '#', status: 'Obtained', category: 'DevOps', badge_image: '/assets/badges/cka.png'
    },
    {
        id: '4', name: 'Certified Kubernetes Application Developer', issuer: 'Cloud Native Computing Foundation', issue_date: null, expiry_date: null, credential_id: null, credential_url: '#', status: 'Pursuit', category: 'DevOps', badge_image: '/assets/badges/ckad.png'
    },
    {
        id: '5', name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', issue_date: null, expiry_date: null, credential_id: null, credential_url: '#', status: 'Pursuit', category: 'Infrastructure', badge_image: '/assets/badges/terraform-associate.png'
    },
    {
        id: '6', name: 'Databricks Certified Data Engineer', issuer: 'Databricks', issue_date: null, expiry_date: null, credential_id: null, credential_url: '#', status: 'Pursuit', category: 'Data', badge_image: '/assets/badges/databricks.png'
    },
    {
        id: '7', name: 'Google Cloud Professional ML Engineer', issuer: 'Google Cloud', issue_date: null, expiry_date: null, credential_id: null, credential_url: '#', status: 'Pursuit', category: 'ML', badge_image: '/assets/badges/gcp-ml.png'
    },
    {
        id: '8', name: 'BSc Computer Science', issuer: 'Maseno University', issue_date: 'Dec 2022', expiry_date: null, credential_id: 'GRAD-2022', credential_url: '#', status: 'Obtained', category: 'Education', badge_image: '/assets/badges/maseno-university.png'
    }
]

const getCertBadgeUrl = (name: string): string => {
    const n = name.toLowerCase()
    if (n.includes('machine learning') && n.includes('aws')) return '/assets/badges/aws-mls.png'
    if (n.includes('aws') || n.includes('amazon') || n.includes('solutions architect')) return '/assets/badges/aws-saa.png'
    if (n.includes('ckad')) return '/assets/badges/ckad.png'
    if (n.includes('kubernetes') || n.includes('cka')) return '/assets/badges/cka.png'
    if (n.includes('terraform')) return '/assets/badges/terraform-associate.png'
    if (n.includes('databricks')) return '/assets/badges/databricks.png'
    if (n.includes('gcp') || n.includes('google')) return '/assets/badges/gcp-ml.png'
    if (n.includes('computer science') || n.includes('degree') || n.includes('university') || n.includes('maseno')) return '/assets/badges/maseno-university.png'
=======
// Local mock data as fallback
const MOCK_CERTS: Certification[] = [
    {
        id: '1',
        name: 'AWS Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        issue_date: 'Oct 2023',
        expiry_date: null,
        credential_id: 'AWS-SAA-C03',
        credential_url: '#',
        status: 'Obtained',
        category: 'Cloud',
        badge_image: '/assets/badges/aws-saa.png'
    },
    {
        id: '2',
        name: 'AWS Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        issue_date: null,
        expiry_date: null,
        credential_id: null,
        credential_url: '#',
        status: 'Pursuit',
        category: 'ML',
        badge_image: '/assets/badges/aws-mls.png'
    },
    {
        id: '3',
        name: 'Certified Kubernetes Administrator',
        issuer: 'Cloud Native Computing Foundation',
        issue_date: 'Dec 2023',
        expiry_date: null,
        credential_id: 'CKA-2300',
        credential_url: '#',
        status: 'Obtained',
        category: 'DevOps',
        badge_image: '/assets/badges/cka.png'
    },
    {
        id: '4',
        name: 'Certified Kubernetes Application Developer',
        issuer: 'Cloud Native Computing Foundation',
        issue_date: null,
        expiry_date: null,
        credential_id: null,
        credential_url: '#',
        status: 'Pursuit',
        category: 'DevOps',
        badge_image: '/assets/badges/ckad.png'
    },
    {
        id: '5',
        name: 'HashiCorp Terraform Associate',
        issuer: 'HashiCorp',
        issue_date: null,
        expiry_date: null,
        credential_id: null,
        credential_url: '#',
        status: 'Pursuit',
        category: 'Infrastructure',
        badge_image: '/assets/badges/terraform-associate.png'
    },
    {
        id: '6',
        name: 'Databricks Certified Data Engineer',
        issuer: 'Databricks',
        issue_date: null,
        expiry_date: null,
        credential_id: null,
        credential_url: '#',
        status: 'Pursuit',
        category: 'Data',
        badge_image: '/assets/badges/databricks.png'
    },
    {
        id: '7',
        name: 'Google Cloud Professional ML Engineer',
        issuer: 'Google Cloud',
        issue_date: null,
        expiry_date: null,
        credential_id: null,
        credential_url: '#',
        status: 'Pursuit',
        category: 'ML',
        badge_image: '/assets/badges/gcp-ml.png'
    },
    {
        id: '8',
        name: 'BSc Computer Science',
        issuer: 'Maseno University',
        issue_date: 'Dec 2022',
        expiry_date: null,
        credential_id: 'GRAD-2022',
        credential_url: '#',
        status: 'Obtained',
        category: 'Education',
        badge_image: '/assets/badges/maseno-university.png'
    }
]

// Helper to generate badge URL from certification name - uses local assets
const getCertBadgeUrl = (name: string): string => {
    const n = name.toLowerCase()
    if (n.includes('machine learning') && n.includes('aws')) {
        return '/assets/badges/aws-mls.png'
    }
    if (n.includes('aws') || n.includes('amazon') || n.includes('solutions architect')) {
        return '/assets/badges/aws-saa.png'
    }
    if (n.includes('ckad')) {
        return '/assets/badges/ckad.png'
    }
    if (n.includes('kubernetes') || n.includes('cka')) {
        return '/assets/badges/cka.png'
    }
    if (n.includes('terraform')) {
        return '/assets/badges/terraform-associate.png'
    }
    if (n.includes('databricks')) {
        return '/assets/badges/databricks.png'
    }
    if (n.includes('gcp') || n.includes('google')) {
        return '/assets/badges/gcp-ml.png'
    }
    if (n.includes('computer science') || n.includes('degree') || n.includes('university') || n.includes('maseno')) {
        return '/assets/badges/maseno-university.png'
    }
    // Default - use AWS SAA as placeholder
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
    return '/assets/badges/aws-saa.png'
}

const CertificationShowcase = () => {
    const [certs, setCerts] = useState<Certification[]>([])
    const [loading, setLoading] = useState(true)
    const marqueeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchCerts = async () => {
            try {
<<<<<<< HEAD
=======
                // Fetch from correct 'certifications' table as per error hint
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                const { data, error } = await (supabase as unknown as { from: (t: string) => { select: (c: string) => Promise<{ data: { id: string; name: string; is_obtained: boolean; icon_url: string | null }[] | null; error: Error | null }> } })
                    .from('certifications')
                    .select('*')

                if (error) throw error

<<<<<<< HEAD
=======
                // If no data in DB, use mock
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                if (!data || data.length === 0) {
                    setCerts(MOCK_CERTS)
                } else {
                    setCerts(data.map((c) => ({
                        id: c.id,
                        name: c.name,
<<<<<<< HEAD
                        issuer: '',
=======
                        issuer: '', // Not in DB schema, leave empty
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                        issue_date: null,
                        expiry_date: null,
                        credential_id: null,
                        credential_url: null,
                        status: c.is_obtained ? 'Obtained' : 'Pursuit',
                        category: null,
                        badge_image: c.icon_url || getCertBadgeUrl(c.name || '')
                    })))
                }
            } catch (err) {
                console.error('Error fetching certs:', err)
                setCerts(MOCK_CERTS)
            } finally {
                setLoading(false)
            }
        }

        fetchCerts()
    }, [])

    if (loading) return null

<<<<<<< HEAD
    const displayCerts = [...certs, ...certs, ...certs]

    return (
        <div className="w-full relative py-4 md:py-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex items-center gap-2 mb-2 md:mb-4 px-1">
                <Shield size={16} className="text-[hsl(var(--accent))]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Credentials & Certifications</h3>
=======
    // Duplicate items for seamless loop
    const displayCerts = [...certs, ...certs, ...certs]

    return (
        <div className="certification-marquee-container relative py-4 md:py-8">
            <div className="flex items-center gap-2 mb-2 md:mb-4 px-1">
                <Shield size={16} className="text-[var(--accent-primary)]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Credentials & Certifications</h3>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
            </div>

            <div className="relative group overflow-hidden">
                {/* Edge masks for professional fade */}
<<<<<<< HEAD
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[hsl(var(--background))] via-[hsl(var(--background))]/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[hsl(var(--background))] via-[hsl(var(--background))]/50 to-transparent z-10 pointer-events-none" />

                <div className="flex w-fit gap-2 md:gap-4 animate-marquee-scroll hover:[animation-play-state:paused]" ref={marqueeRef}>
=======
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent z-10 pointer-events-none"></div>

                <div className="marquee-track flex gap-2 md:gap-4 hover:[animation-play-state:paused]" ref={marqueeRef}>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                    {displayCerts.map((cert, idx) => {
                        const style = getStyle(cert.name)
                        const isPursuit = cert.status === 'Pursuit'

                        return (
                            <div
                                key={`${cert.id}-${idx}`}
<<<<<<< HEAD
                                className={cn(
                                    "group relative flex flex-col shrink-0 w-[180px] h-[220px] rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))] overflow-hidden transition-all duration-500",
                                    "hover:-translate-y-1",
                                    style.glow
                                )}
                            >
                                {/* Top Image Section */}
                                <div className={cn(
                                    "relative h-28 flex items-center justify-center p-4 bg-gradient-to-br",
                                    style.gradient
                                )}>
=======
                                className={`certification-card-fixed group relative flex flex-col shrink-0 w-[180px] h-[220px] rounded-2xl border border-[var(--border-primary)]/50 bg-[var(--bg-secondary)] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent-primary)]/30 ${style.glow}`}
                            >
                                {/* Top Image Section */}
                                <div className={`relative h-28 flex items-center justify-center p-4 bg-gradient-to-br ${style.gradient}`}>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                    <Image
                                        src={cert.badge_image || '/assets/badges/aws-saa.png'}
                                        alt={cert.name}
                                        width={64}
                                        height={64}
<<<<<<< HEAD
                                        className={cn(
                                            "object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md",
                                            isPursuit && "grayscale opacity-70"
                                        )}
                                        unoptimized
                                    />
                                    {/* Background floating icons */}
                                    <GraduationCap className="absolute top-2 right-2 w-4 h-4 text-black/10 dark:text-white/10" />
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-3 flex flex-col min-h-0">
                                    <h4 className="font-bold text-[12px] text-[hsl(var(--foreground))] leading-tight mb-0.5 line-clamp-2 shrink-0">
                                        {cert.name}
                                    </h4>
                                    <p className="text-[8px] text-[hsl(var(--muted-foreground))] truncate shrink-0">
                                        {cert.issuer}
                                    </p>

                                    <div className="mt-auto pt-2 border-t border-[hsl(var(--border))]/30 flex items-center justify-between shrink-0">
=======
                                        className={`object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-lg ${isPursuit ? 'grayscale opacity-70' : ''}`}
                                        unoptimized
                                    />
                                    {/* Background floating icons */}
                                    <GraduationCap className="absolute top-2 right-2 w-4 h-4 text-white/10" />
                                </div>

                                {/* Content Section - Fixed height with ellipsis */}
                                <div className="flex-1 p-3 flex flex-col min-h-0">
                                    <h4
                                        className="font-bold text-[var(--text-primary)] leading-tight mb-0.5 line-clamp-2 flex-shrink-0"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {cert.name}
                                    </h4>
                                    <p className="text-[8px] text-[var(--text-tertiary)] truncate flex-shrink-0">{cert.issuer}</p>

                                    <div className="mt-auto pt-2 border-t border-[var(--border-primary)]/30 flex items-center justify-between flex-shrink-0">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                        <div className="flex items-center gap-1">
                                            {isPursuit ? (
                                                <Clock size={10} className="text-[#fbbf24]" />
                                            ) : (
<<<<<<< HEAD
                                                <CheckCircle2 size={10} className="text-[hsl(var(--accent))]" />
                                            )}
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-wider",
                                                isPursuit ? "text-[#f59e0b]" : "text-[hsl(var(--accent))]"
                                            )}>
=======
                                                <CheckCircle2 size={10} className="text-[var(--accent-primary)]" />
                                            )}
                                            <span className={`text-[8px] font-black uppercase tracking-wider ${isPursuit ? 'text-[#f59e0b]' : 'text-[var(--accent-primary)]'}`}>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                                {cert.status}
                                            </span>
                                        </div>
                                        {cert.issue_date && (
<<<<<<< HEAD
                                            <span className="text-[8px] text-[hsl(var(--muted-foreground))] font-medium">
=======
                                            <span className="text-[8px] text-[var(--text-tertiary)] font-medium">
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                                                {cert.issue_date}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Shine Effect */}
<<<<<<< HEAD
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-opacity duration-700" />
=======
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-opacity duration-700"></div>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
                            </div>
                        )
                    })}
                </div>
            </div>
<<<<<<< HEAD
=======

            <style jsx>{`
        .marquee-track {
          display: flex;
          width: fit-content;
          animation: marquee-scroll 40s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-33.33% - 16px));
          }
        }

        .certification-marquee-container {
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e
        </div>
    )
}

export default CertificationShowcase

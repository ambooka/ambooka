'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Trash2, Star, MessageSquare, CheckCircle2 } from 'lucide-react'

// CoachPro Design Tokens
const CARD_RADIUS = 20
const CARD_PADDING = 24
const GAP = 16

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    borderRadius: CARD_RADIUS,
    boxShadow: '8px 8px 16px rgba(166, 180, 200, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.9)'
}

interface Testimonial {
    id: string
    name: string
    avatar_url: string | null
    text: string
    date: string
    is_featured: boolean
    is_active: boolean
}

export default function AdminTestimonialsPage() {
    const [loading, setLoading] = useState(true)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        setLoading(true)
        const { data } = await supabase.from('testimonials').select('*').order('display_order')
        if (data) setTestimonials(data)
        setLoading(false)
    }

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return
        await supabase.from('testimonials').delete().eq('id', id)
        fetchTestimonials()
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from('testimonials').update({ is_active: !current }).eq('id', id)
        fetchTestimonials()
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <div style={{ width: 40, height: 40, border: '4px solid #0d9488', borderTopColor: 'transparent', borderRadius: '50%', animation: 'ad-spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div>
            {/* Success Toast */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 100,
                    padding: '12px 20px', borderRadius: 12,
                    background: '#f0fdf4', border: '1px solid #22c55e',
                    display: 'flex', alignItems: 'center', gap: 8
                }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                    <span style={{ color: '#16a34a', fontWeight: 500, fontSize: 14 }}>Done!</span>
                </div>
            )}

            {/* Title Row */}
            <div style={{ marginBottom: GAP + 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>Testimonials</h1>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage recommendations ({testimonials.length})</p>
            </div>

            {/* Testimonials Grid */}
            {testimonials.length === 0 ? (
                <div style={{ ...cardStyle, padding: 60, textAlign: 'center' }}>
                    <MessageSquare size={48} style={{ color: '#94a3b8', marginBottom: 16, opacity: 0.3 }} />
                    <p style={{ color: '#64748b' }}>No testimonials yet</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: GAP }}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} style={{ ...cardStyle, padding: CARD_PADDING, opacity: testimonial.is_active ? 1 : 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'start', gap: 12, marginBottom: 12 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: '#f1f5f9', overflow: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {testimonial.avatar_url ? (
                                        <img src={testimonial.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>{testimonial.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <h3 style={{ fontWeight: 600, color: '#1e293b', fontSize: 15 }}>{testimonial.name}</h3>
                                        {testimonial.is_featured && <Star size={14} fill="#f59e0b" style={{ color: '#f59e0b' }} />}
                                    </div>
                                    <p style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(testimonial.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
                                &quot;{testimonial.text}&quot;
                            </p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                                    style={{
                                        flex: 1, padding: 10, borderRadius: 10,
                                        background: testimonial.is_active ? 'rgba(241, 245, 249, 0.8)' : '#f0fdf4',
                                        color: testimonial.is_active ? '#64748b' : '#16a34a',
                                        border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500
                                    }}
                                >
                                    {testimonial.is_active ? 'Hide' : 'Show'}
                                </button>
                                <button
                                    onClick={() => deleteTestimonial(testimonial.id)}
                                    style={{
                                        padding: 10, borderRadius: 10,
                                        background: 'rgba(254, 242, 242, 0.8)', color: '#ef4444',
                                        border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

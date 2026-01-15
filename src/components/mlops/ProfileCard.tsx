'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'

type PersonalInfo = Database['public']['Tables']['personal_info']['Row']

export const ProfileCard = () => {
    const [_profile, setProfile] = useState<PersonalInfo | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase.from('personal_info').select('*').limit(1).maybeSingle()
            if (error) {
                console.error('Error fetching profile:', error)
            }
            if (data) {
                setProfile(data)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [])

    if (loading) return <div className="h-64 rounded-3xl bg-gray-200 animate-pulse"></div>

    return (
        <div className="relative h-full w-full rounded-[24px] overflow-hidden group">
            <Image
                src="/assets/images/profile-warm.png"
                alt="Profile"
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                <div className="text-white">
                    <h2 className="text-xl font-medium tracking-wide">Ambooka</h2>
                    <p className="text-xs text-white/80 font-light mt-0.5 flex items-center gap-1.5">
                        <span className="bg-[#f4c542] text-black px-1.5 rounded text-[10px] font-bold">TARGET</span>
                        MLOps Architect
                    </p>
                </div>
                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    $350k+
                </div>
            </div>
        </div>
    )
}

import Contact from '@/components/Contact'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact | Msah Ambooka',
    description: 'Get in touch with Msah Ambooka for MLOps, AI Engineering, or Software Development collaborations.',
}

export default function ContactPage() {
    return <Contact isActive={true} />
}

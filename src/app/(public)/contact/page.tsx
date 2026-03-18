import Contact from '@/components/Contact'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact | Abdulrahman Ambooka',
    description: 'Get in touch with Abdulrahman Ambooka for MLOps, AI Engineering, or Software Development collaborations.',
}

export default function ContactPage() {
    return <Contact isActive={true} />
}

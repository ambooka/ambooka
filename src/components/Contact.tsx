// app/components/Contact.tsx
'use client'

import { useState } from 'react'
import { Send } from "lucide-react";

interface ContactProps {
  isActive?: boolean
}
export default function Contact({ isActive = false }: ContactProps) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  })
  const [isFormValid, setIsFormValid] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedFormData = { ...formData, [name]: value }

    setFormData(updatedFormData)

    // Check if all fields are filled
    const isValid = Object.values(updatedFormData).every(val => val.trim() !== '')
    setIsFormValid(isValid)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      // Handle form submission here
      console.log('Form submitted:', formData)
      alert('Message sent successfully!')
      setFormData({ fullname: '', email: '', message: '' })
      setIsFormValid(false)
    }
  }

  return (
    <article className={`contact ${isActive ? 'active' : ''}`} data-page="contact">
      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>

      <section className="mapbox" data-mapbox>
        <figure>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.3021629732!2d36.707307399999996!3d-1.3028617999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1647608789441!5m2!1sen!2ske"
            width="400" height="300" loading="lazy" style={{ border: 0 }}></iframe>
        </figure>
      </section>

      <section className="contact-form">
        <h3 className="h3 form-title">Contact Form</h3>

        <form onSubmit={handleSubmit} className="form" data-form>
          <div className="input-wrapper">
            <input
              type="text"
              name="fullname"
              className="form-input"
              placeholder="Full name"
              required
              value={formData.fullname}
              onChange={handleInputChange}
            />

            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <textarea
            name="message"
            className="form-input"
            placeholder="Your Message"
            required
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>

          <button
            className="form-btn"
            type="submit"
            disabled={!isFormValid}
          >
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </button>
        </form>
      </section>
    </article>
  )
}
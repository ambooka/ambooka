// app/components/Sidebar.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Calendar, Mail, Phone, PhoneIcon, MapPin, Linkedin } from "lucide-react";

export default function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  return (
    <aside className={`sidebar ${isSidebarVisible ? 'active' : ''}`} data-sidebar>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <Image
            src="/assets/images/my-avatar.png"
            alt="Msah Ambooka"
            width={80}
            height={80}
          />
        </figure>

        <div className="info-content">
          <h1 className="name" title="Msah Ambooka">Msah Ambooka</h1>
          <p className="title">Software | AI Engineer</p>
        </div>

        <button
          className="info_more-btn"
          data-sidebar-btn
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <span>{isSidebarVisible ? 'Hide Contacts' : 'Show Contacts'}</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="sidebar-info_more">
        <div className="separator"></div>

        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <Mail />
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href="mailto:abdulrahmanambooka@gmail.com" className="contact-link">abdulrahmanambooka@gmail.com</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <PhoneIcon />
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href="tel:+254111384390" className="contact-link">+254 111 384 390</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <Calendar />
            </div>
            <div className="contact-info">
              <p className="contact-title">Birthday</p>
              <time dateTime="2000-10-30">Oct 30th, 2000</time>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <MapPin />
            </div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>Nairobi, Kenya</address>
            </div>
          </li>
        </ul>

        <div className="separator"></div>

        <ul className="social-list">
          <li className="social-item">
            <a
              href="https://github.com/ambooka"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <img
                src="https://cdn.simpleicons.org/github/white"
                alt="GitHub"
                width="18"
                height="18"
                loading="lazy"
              />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://www.linkedin.com/in/abdulrahman-ambooka/"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="w-[18px] h-[18px]" />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://twitter.com/ambooka"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              title="Twitter/X"
            >
              <img
                src="https://cdn.simpleicons.org/x/white"
                alt="Twitter/X"
                width="18"
                height="18"
                loading="lazy"
              />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://stackoverflow.com/users/your-id"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Stack Overflow"
              title="Stack Overflow"
            >
              <img
                src="https://cdn.simpleicons.org/stackoverflow/white"
                alt="Stack Overflow"
                width="18"
                height="18"
                loading="lazy"
              />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://medium.com/@ambooka"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Medium"
              title="Medium Blog"
            >
              <img
                src="https://cdn.simpleicons.org/medium/white"
                alt="Medium"
                width="18"
                height="18"
                loading="lazy"
              />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://wa.me/254111384390"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <img
                src="https://cdn.simpleicons.org/whatsapp/25D366"
                alt="WhatsApp"
                width="18"
                height="18"
                loading="lazy"
              />
            </a>
          </li>
          <li className="social-item">
            <a
              href="mailto:abdulrahmanambooka@gmail.com"
              className="social-link"
              aria-label="Email"
              title="Email"
            >
              <img
                src="https://cdn.simpleicons.org/gmail/EA4335"
                alt="Email"
                width="18"
                height="18"
                loading="lazy"
              />
            </a>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .social-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-top: 15px;
          padding: 0 10px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--border-gradient-onyx);
          transition: all 0.3s ease;
          position: relative;
        }

        .social-link::before {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: var(--onyx);
          color: var(--white-2);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .social-link:hover::before {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }

        .social-link:hover {
          background: var(--bg-gradient-primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow-2);
        }

        .social-link img {
          transition: transform 0.3s ease;
        }

        .social-link:hover img {
          transform: scale(1.15);
        }
      `}</style>
    </aside>
  )
}
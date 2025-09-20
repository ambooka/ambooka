// app/components/Sidebar.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
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
          <p className="title">Web developer</p>
        </div>

        <button 
          className="info_more-btn" 
          data-sidebar-btn
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <span>{isSidebarVisible ? 'Hide Contacts' : 'Show Contacts'}</span>
          <ion-icon name="chevron-down"></ion-icon>
        </button>
      </div>

      <div className="sidebar-info_more">
        <div className="separator"></div>

        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="mail-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href="mailto:abdulrahmanambooka@gmail.com" className="contact-link">abdulrahmanambooka@gmail.com</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="phone-portrait-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href="tel:+254111384390" className="contact-link">+254 111 384 390</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="calendar-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Birthday</p>
              <time dateTime="2000-10-30">Oct 30th, 2000</time>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="location-outline"></ion-icon>
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
            <a href="#" className="social-link">
              <ion-icon name="logo-facebook"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link">
              <ion-icon name="logo-twitter"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link">
              <ion-icon name="logo-instagram"></ion-icon>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}
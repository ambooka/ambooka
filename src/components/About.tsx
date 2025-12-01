'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Brain, Code, Bot, Cloud } from "lucide-react";

interface AboutProps {
  isActive?: boolean
}

export default function About({ isActive = false }: AboutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null)
  const scrollTrackRef = useRef<HTMLDivElement>(null)

  // Technologies data with actual CDN logos (optimized for fast loading)
  const technologies = [
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'TensorFlow', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: '.NET Core', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
    { name: 'Azure', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
    { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Flutter', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'Spring Boot', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'C#', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: 'C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Redis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
    { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
    { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Tailwind CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
    { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' }
  ]

  // Duplicate technologies for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies]

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Calvins',
      avatar: '/assets/images/avatar-1.png',
      text: 'I had the pleasure of supervising this talented software engineer on an advanced AI research project during their final year. Their innovative approach to machine learning problems and exceptional programming skills resulted in a publication-worthy project. They demonstrate rare talent in both theoretical concepts and practical implementation, with a deep understanding of cutting-edge AI techniques.',
      date: '2025-05-15'
    },
    {
      id: 2,
      name: 'Mr. Haroon Msah',
      avatar: '/assets/images/avatar-2.png',
      text: 'Collaborating with this engineer on our advanced robotics project was exceptional. They designed and implemented the navigation algorithm that significantly improved our robot\'s efficiency by 40%. Their software architecture skills and deep understanding of AI integration in physical systems demonstrate the capabilities of a seasoned professional.',
      date: '2024-11-10'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      avatar: '/assets/images/avatar-3.png',
      text: 'This engineer built our company\'s AI-powered analytics dashboard from the ground up. The system processes millions of real-time data points and provides actionable insights through an intuitive interface. Their full-stack development expertise and machine learning capabilities delivered exceptional value, significantly improving our decision-making process.',
      date: '2024-08-20'
    },
    {
      id: 4,
      name: 'Prof. Robert Kim',
      avatar: '/assets/images/avatar-4.png',
      text: 'In my advanced algorithms course, this student consistently demonstrated exceptional problem-solving abilities and innovative thinking. Their final project on neural network optimization showed mastery of both computer science fundamentals and cutting-edge AI techniques, earning the highest marks in the class.',
      date: '2024-06-05'
    }
  ]

  const openTestimonialModal = (testimonial: any) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
  }

  const closeTestimonialModal = () => {
    setIsModalOpen(false)
    setSelectedTestimonial(null)
  }

  return (
    <article className={`about ${isActive ? 'active' : ''}`} data-page="about">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text">
        <p>

          I'm an experienced software engineer specializing in Artificial Intelligence, full-stack development, and network infrastructure. With a strong foundation in Computer Science from Maseno University, I build intelligent, scalable systems that transform complex challenges into elegant, efficient solutions. My expertise spans machine learning, cloud architecture, and enterprise software development.

        </p>

      </section>

      <section className="service">
        <h3 className="h3 service-title">Areas of Expertise</h3>

        <ul className="service-list">


          <li className="service-item">
            <div className="service-icon-box">
              <Brain className="w-10 h-10 text-[var(--accent-color)]" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">
                AI & Machine Learning
                <span className="badge expert">Expert</span>
              </h4>
              <p className="service-item-text">
                Developing intelligent systems using neural networks, computer vision, and natural language processing.
              </p>
            </div>
          </li>

          <li className="service-item">
            <div className="service-icon-box">
              <Code className="w-10 h-10 text-[var(--accent-color)]" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">
                Software Engineering
                <span className="badge expert">Expert</span>
              </h4>
              <p className="service-item-text">
                Building scalable applications with modern frameworks, clean architecture, and best practices.
              </p>
            </div>
          </li>

          <li className="service-item">
            <div className="service-icon-box">
              <Bot className="w-10 h-10 text-[var(--accent-color)]" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">
                Robotics & Automation
                <span className="badge advanced">Advanced</span>
              </h4>
              <p className="service-item-text">
                Programming autonomous systems, sensor integration, and motion planning algorithms.
              </p>
            </div>
          </li>

          <li className="service-item">
            <div className="service-icon-box">
              <Cloud className="w-10 h-10 text-[var(--accent-color)]" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">
                Cloud Computing & DevOps
                <span className="badge advanced">Advanced</span>
              </h4>
              <p className="service-item-text">
                Building and automating scalable cloud environments to streamline deployment, improve reliability, and optimize performance.
              </p>
            </div>
          </li>

        </ul>

      </section>

      <section className="testimonials">
        <h3 className="h3 testimonials-title">Recommendations</h3>

        <ul className="testimonials-list has-scrollbar">
          {testimonials.map(testimonial => (
            <li key={testimonial.id} className="testimonials-item">
              <div
                className="content-card"
                onClick={() => openTestimonialModal(testimonial)}
                style={{ cursor: 'pointer' }}
              >
                <figure className="testimonials-avatar-box">
                  <img src={testimonial.avatar} alt={testimonial.name} width="60" />
                </figure>
                <h4 className="h4 testimonials-item-title">{testimonial.name}</h4>
                <div className="testimonials-text">
                  <p>{testimonial.text.slice(0, 150)}...</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {
        isModalOpen && selectedTestimonial && (
          <div className="modal-container active">
            <div className="overlay active" onClick={closeTestimonialModal}></div>
            <section className="testimonials-modal">
              <button className="modal-close-btn" onClick={closeTestimonialModal}>
                <X className="w-5 h-5" />
              </button>
              <div className="modal-img-wrapper">
                <figure className="modal-avatar-box">
                  <img src={selectedTestimonial.avatar} alt={selectedTestimonial.name} width="80" />
                </figure>
                <img src="/assets/images/icon-quote.svg" alt="quote icon" />
              </div>
              <div className="modal-content">
                <h4 className="h3 modal-title">{selectedTestimonial.name}</h4>
                <time dateTime={selectedTestimonial.date}>
                  {new Date(selectedTestimonial.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <div>
                  <p>{selectedTestimonial.text}</p>
                </div>
              </div>
            </section>
          </div>
        )
      }

      <section >
        <h3 className="h3 clients-title">Technologies I Work With</h3>
        <div className="infinite-scroll-wrapper">
          <div className="infinite-scroll-container">
            <div className="infinite-scroll-track" ref={scrollTrackRef}>
              {duplicatedTechnologies.map((tech, index) => (
                <div key={`${tech.name}-${index}`} className="tech-item">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <img
                      src={tech.logo}
                      alt={`${tech.name} logo`}
                      loading="lazy"
                      decoding="async"
                      width="60"
                      height="60"
                    />
                    <span className="tech-name">{tech.name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .infinite-scroll-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin: 20px 0;
          padding: 15px 0;
        }
        
        .infinite-scroll-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
        
        .infinite-scroll-track {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        
        .infinite-scroll-container:hover .infinite-scroll-track {
          animation-play-state: paused;
        }
        
        .tech-item {
          flex: 0 0 auto;
          width: 100px;
          margin: 0 15px;
          text-align: center;
          transition: transform 0.3s ease;
        }
        
        .tech-item:hover {
          transform: translateY(-5px);
        }
        
        .tech-item img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin: 0 auto 8px;
          filter: grayscale(100%);
          opacity: 0.7;
          transition: all 0.3s ease;
          will-change: transform, filter, opacity;
          backface-visibility: hidden;
        }
        
        .tech-item:hover img {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.1);
        }
        
        .tech-name {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 5px;
          font-weight: 500;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        /* Hide scrollbar for the testimonials */
        .testimonials-list.has-scrollbar {
          scrollbar-width: none;
        }
        
        .testimonials-list.has-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </article >
  )
}
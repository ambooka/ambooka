'use client'

import { useState, useEffect, useRef } from 'react'

interface AboutProps {
  isActive?: boolean
}

export default function About({ isActive = false }: AboutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null)
  const scrollTrackRef = useRef<HTMLDivElement>(null)

  // Technologies data with industry-standard entries
  const technologies = [
    { name: 'Python', logo: '/assets/images/logo-python.svg' },
    { name: 'TensorFlow', logo: '/assets/images/logo-tensorflow.svg' },
    { name: 'React', logo: '/assets/images/logo-react.svg' },
    { name: 'ROS', logo: '/assets/images/logo-ros.svg' },
    { name: 'AWS', logo: '/assets/images/logo-aws.svg' },
    { name: 'Docker', logo: '/assets/images/logo-docker.svg' },
    { name: 'Android Studio', logo: '/assets/images/logo-android-studio.svg' },
    { name: 'KiCad', logo: '/assets/images/logo-kicad.svg' },
    { name: 'SolidWorks', logo: '/assets/images/logo-solidworks.svg' },
    { name: 'JavaScript', logo: '/assets/images/logo-javascript.svg' },
    { name: 'TypeScript', logo: '/assets/images/logo-typescript.svg' },
    { name: 'Node.js', logo: '/assets/images/logo-nodejs.svg' },
    { name: 'Java', logo: '/assets/images/logo-java.svg' },
    { name: 'C++', logo: '/assets/images/logo-cpp.svg' },
    { name: 'Git', logo: '/assets/images/logo-git.svg' },
    { name: 'Linux', logo: '/assets/images/logo-linux.svg' },
    { name: 'MATLAB', logo: '/assets/images/logo-matlab.svg' },
    { name: 'Arduino', logo: '/assets/images/logo-arduino.svg' },
    { name: 'Raspberry Pi', logo: '/assets/images/logo-raspberry-pi.svg' },
    { name: 'Kubernetes', logo: '/assets/images/logo-kubernetes.svg' },
    { name: 'PostgreSQL', logo: '/assets/images/logo-postgresql.svg' },
    { name: 'MongoDB', logo: '/assets/images/logo-mongodb.svg' },
    { name: 'Firebase', logo: '/assets/images/logo-firebase.svg' },
    { name: 'Figma', logo: '/assets/images/logo-figma.svg' },
    { name: 'Adobe XD', logo: '/assets/images/logo-adobe-xd.svg' }
  ]

  // Duplicate technologies for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies]

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Emily Chen',
      avatar: '/assets/images/avatar-1.png',
      text: 'I had the pleasure of supervising this talented computer science graduate on an AI research project. Their innovative approach to machine learning problems and strong programming skills resulted in a publication-worthy project. They demonstrate exceptional talent in both theoretical concepts and practical implementation.',
      date: '2023-05-15'
    },
    {
      id: 2,
      name: 'Mark Johnson',
      avatar: '/assets/images/avatar-2.png',
      text: 'Working alongside this developer on our robotics project was impressive. They designed the navigation algorithm that significantly improved our robot\'s efficiency. Their software architecture skills and understanding of AI integration in physical systems exceeded expectations for someone at their career stage.',
      date: '2023-02-10'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      avatar: '/assets/images/avatar-3.png',
      text: 'This developer built our company\'s AI-powered analytics dashboard from scratch. The system processes real-time data and provides actionable insights through an intuitive interface. Their full-stack development skills and machine learning expertise delivered exceptional value to our organization.',
      date: '2022-11-20'
    },
    {
      id: 4,
      name: 'Prof. Robert Kim',
      avatar: '/assets/images/avatar-4.png',
      text: 'In my advanced algorithms course, this student stood out with their exceptional problem-solving abilities and innovative thinking. Their final project on neural network optimization demonstrated deep understanding of both computer science fundamentals and cutting-edge AI techniques.',
      date: '2022-08-05'
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
          I'm a Computer Science graduate with a passion for Artificial Intelligence, Software Engineering, and Robotics. 
          My academic journey has equipped me with strong foundations in algorithms, data structures, and machine learning, 
          while my projects have allowed me to apply these concepts to build intelligent systems and solutions.
        </p>

        <p>
          I thrive on transforming complex problems into elegant software solutions, whether it's developing AI models, 
          designing robust software architecture, or programming autonomous systems. My approach combines theoretical knowledge 
          with practical implementation, always focusing on creating efficient, scalable, and innovative solutions that push 
          technological boundaries.
        </p>
      </section>

      <section className="service">
        <h3 className="h3 service-title">Areas of Expertise</h3>

        <ul className="service-list">
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-ai.svg" alt="AI icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">AI & Machine Learning</h4>
              <p className="service-item-text">
                Developing intelligent systems using neural networks, computer vision, and natural language processing.
              </p>
            </div>
          </li>

          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-dev.svg" alt="Software development icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Software Engineering</h4>
              <p className="service-item-text">
                Building scalable applications with modern frameworks, clean architecture, and best practices.
              </p>
            </div>
          </li>

          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-robot.svg" alt="Robotics icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Robotics</h4>
              <p className="service-item-text">
                Programming autonomous systems, sensor integration, and motion planning algorithms.
              </p>
            </div>
          </li>

          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-data.svg" alt="Data science icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Data Science</h4>
              <p className="service-item-text">
                Extracting insights from complex datasets and building predictive models for decision making.
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

      {isModalOpen && selectedTestimonial && (
        <div className="modal-container active">
          <div className="overlay active" onClick={closeTestimonialModal}></div>
          <section className="testimonials-modal">
            <button className="modal-close-btn" onClick={closeTestimonialModal}>
              <ion-icon name="close-outline"></ion-icon>
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
      )}

      <section >
        <h3 className="h3 clients-title">Technologies I Work With</h3>
        <div className="infinite-scroll-wrapper">
          <div className="infinite-scroll-container">
            <div className="infinite-scroll-track" ref={scrollTrackRef}>
              {duplicatedTechnologies.map((tech, index) => (
                <div key={`${tech.name}-${index}`} className="tech-item">
                  <a href="#">
                    <img src={tech.logo} alt={`${tech.name} logo`} />
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
    </article>
  )
}
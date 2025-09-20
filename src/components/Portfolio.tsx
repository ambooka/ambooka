'use client'

import { useState } from 'react'

interface PortfolioProps {
  isActive?: boolean
}

export default function Portfolio({ isActive = false }: PortfolioProps) {
  const [filter, setFilter] = useState('all')
  const [selectValue, setSelectValue] = useState('Select category')
  const [showSelectList, setShowSelectList] = useState(false)

  const projects = [
    { id: 1, category: 'web development', title: 'Finance', image: '/assets/images/project-1.jpg' },
    { id: 2, category: 'web development', title: 'Orizon', image: '/assets/images/project-2.png' },
    { id: 3, category: 'web design', title: 'Fundo', image: '/assets/images/project-3.jpg' },
    { id: 4, category: 'applications', title: 'Brawlhalla', image: '/assets/images/project-4.png' },
    { id: 5, category: 'web design', title: 'DSM.', image: '/assets/images/project-5.png' },
    { id: 6, category: 'web design', title: 'MetaSpark', image: '/assets/images/project-6.png' },
    { id: 7, category: 'web development', title: 'Summary', image: '/assets/images/project-7.png' },
    { id: 8, category: 'applications', title: 'Task Manager', image: '/assets/images/project-8.jpg' },
    { id: 9, category: 'web development', title: 'Arrival', image: '/assets/images/project-9.png' },
  ]

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter)

  const handleFilter = (newFilter: string, displayName: string) => {
    setFilter(newFilter)
    setSelectValue(displayName)
    setShowSelectList(false)
  }

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'web design', label: 'Web design' },
    { value: 'applications', label: 'Applications' },
    { value: 'web development', label: 'Web development' }
  ]

  return (
    <article className={`portfolio ${isActive ? 'active' : ''}`}data-page="portfolio">
      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      <section className="projects">
        <ul className="filter-list">
          {filterOptions.map(option => (
            <li key={option.value} className="filter-item">
              <button 
                className={filter === option.value ? 'active' : ''} 
                onClick={() => handleFilter(option.value, option.label)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="filter-select-box">
          <button 
            className="filter-select" 
            onClick={() => setShowSelectList(!showSelectList)}
          >
            <div className="select-value">{selectValue}</div>
            <div className="select-icon">
              <ion-icon name="chevron-down"></ion-icon>
            </div>
          </button>

          {showSelectList && (
            <ul className="select-list">
              {filterOptions.map(option => (
                <li key={option.value} className="select-item">
                  <button onClick={() => handleFilter(option.value, option.label)}>
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ul className="project-list">
          {filteredProjects.map(project => (
            <li 
              key={project.id} 
              className="project-item active" 
              data-category={project.category}
            >
              <a href="#">
                <figure className="project-img">
                  <div className="project-item-icon-box">
                    <ion-icon name="eye-outline"></ion-icon>
                  </div>
                  <img src={project.image} alt={project.title} loading="lazy" />
                </figure>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
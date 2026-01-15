/**
 * ATS-Optimized Resume Generator
 * 
 * Generates professional, recruiter-friendly resumes following best practices:
 * - ATS-compliant single-column layout
 * - Standard fonts (Arial, Helvetica)
 * - Proper section ordering: Header → Summary → Skills → Experience → Education
 * - STAR-impact bullet formatting
 * - Print-optimized CSS
 */

import { getProjectDescription } from './resume-profiles'

// Types
export interface PersonalInfo {
  full_name: string
  title: string
  email: string
  phone?: string | null
  location?: string | null
  summary?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  website_url?: string | null
  [key: string]: unknown
}

export interface Experience {
  id: string
  company: string
  position: string
  location?: string | null
  start_date: string
  end_date?: string | null
  is_current: boolean
  description?: string | null
  responsibilities?: string[] | null
  achievements?: string[] | null
  technologies?: string[] | null
  [key: string]: unknown
}

export interface Education {
  id: string
  institution: string
  degree?: string | null
  field_of_study?: string | null
  start_date: string
  end_date?: string | null
  description?: string | null
  grade?: string | null
  [key: string]: unknown
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency_level?: number | null
  [key: string]: unknown
}

export interface Project {
  id: string
  title: string
  description?: string | null
  stack?: string[] | null
  github_url?: string | null
  live_url?: string | null
  is_featured?: boolean
  [key: string]: unknown
}

export interface ResumeData {
  personal_info: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects?: Project[]
}

// Skill category priority order for ATS (most impactful first)
const SKILL_CATEGORY_ORDER = [
  'Languages',
  'IT Support',
  'Frontend',
  'Backend',
  'Databases',
  'Cloud',
  'DevOps',
  'Tools',
  'ML',
  'Frameworks',
  'Other'
]

/**
 * Format date for ATS compatibility (MM/YYYY format)
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${year}`
}

/**
 * Format date range for experience/education
 */
const formatDateRange = (startDate: string, endDate: string | null, isCurrent: boolean): string => {
  const start = formatDate(startDate)
  const end = isCurrent ? 'Present' : (endDate ? formatDate(endDate) : 'Present')
  return `${start} - ${end}`
}

/**
 * Group skills by category and sort by priority
 */
const groupAndSortSkills = (skills: Skill[]): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {}

  skills.forEach(skill => {
    const category = skill.category || 'Other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(skill.name)
  })

  // Sort categories by priority order
  const sorted: Record<string, string[]> = {}
  SKILL_CATEGORY_ORDER.forEach(cat => {
    if (grouped[cat]) {
      sorted[cat] = grouped[cat]
      delete grouped[cat]
    }
  })

  // Add remaining categories
  Object.entries(grouped).forEach(([cat, skills]) => {
    sorted[cat] = skills
  })

  return sorted
}

/**
 * Generate ATS-optimized resume HTML
 */
export function generateATSResumeHTML(data: ResumeData): string {
  const { personal_info, experience, education, skills, projects } = data
  const skillsByCategory = groupAndSortSkills(skills)
  const featuredProjects = (projects || []).filter(p => p.is_featured).slice(0, 4)

  // Build contact line
  const contactParts: string[] = []
  if (personal_info.email) contactParts.push(personal_info.email)
  if (personal_info.phone) contactParts.push(personal_info.phone)
  if (personal_info.location) contactParts.push(personal_info.location)
  if (personal_info.linkedin_url) {
    const linkedinHandle = personal_info.linkedin_url.replace(/.*linkedin\.com\/in\//, '').replace(/\/$/, '')
    contactParts.push(`linkedin.com/in/${linkedinHandle}`)
  }
  if (personal_info.github_url) {
    const githubHandle = personal_info.github_url.replace(/.*github\.com\//, '').replace(/\/$/, '')
    contactParts.push(`github.com/${githubHandle}`)
  }
  if (personal_info.website_url) {
    const website = personal_info.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    contactParts.push(website)
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personal_info.full_name} - Resume</title>
  <style>
    /* ATS-Optimized Resume Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.6in 0.75in;
      background: #fff;
    }
    
    /* Header */
    .header {
      text-align: center;
      margin-bottom: 16px;
      border-bottom: 2px solid #000;
      padding-bottom: 12px;
    }
    
    .name {
      font-size: 20pt;
      font-weight: bold;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    
    .title {
      font-size: 12pt;
      font-weight: normal;
      color: #333;
      margin-bottom: 6px;
    }
    
    .contact-line {
      font-size: 10pt;
      color: #333;
    }
    
    .contact-line span {
      display: inline;
    }
    
    .contact-line span:not(:last-child)::after {
      content: " | ";
      color: #666;
    }
    
    /* Sections */
    .section {
      margin-bottom: 14px;
    }
    
    .section-header {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
      margin-bottom: 10px;
    }
    
    /* Professional Summary */
    .summary {
      font-size: 10.5pt;
      line-height: 1.5;
      text-align: justify;
    }
    
    /* Technical Skills */
    .skills-row {
      margin-bottom: 4px;
      font-size: 10.5pt;
    }
    
    .skill-category {
      font-weight: bold;
    }
    
    .skill-items {
      font-weight: normal;
    }
    
    /* Experience */
    .experience-item {
      margin-bottom: 12px;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      margin-bottom: 2px;
    }
    
    .experience-title {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .experience-date {
      font-size: 10pt;
      font-style: italic;
      color: #333;
    }
    
    .experience-company {
      font-size: 10.5pt;
      color: #333;
      margin-bottom: 4px;
    }
    
    .experience-bullets {
      margin-left: 18px;
      margin-top: 4px;
    }
    
    .experience-bullets li {
      margin-bottom: 3px;
      font-size: 10.5pt;
      line-height: 1.4;
    }
    
    /* Education */
    .education-item {
      margin-bottom: 8px;
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
    }
    
    .education-school {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .education-date {
      font-size: 10pt;
      font-style: italic;
      color: #333;
    }
    
    .education-degree {
      font-size: 10.5pt;
      color: #333;
    }
    
    /* Projects */
    .project-item {
      margin-bottom: 10px;
    }
    
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      margin-bottom: 2px;
    }
    
    .project-title {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .project-links {
      font-size: 10pt;
      color: #333;
    }
    
    .project-desc {
      font-size: 10.5pt;
      color: #333;
      margin-bottom: 3px;
    }
    
    .project-stack {
      font-size: 10pt;
      color: #444;
    }
    
    /* Print Optimization */
    @media print {
      body {
        padding: 0;
        max-width: none;
      }
      
      .header {
        page-break-after: avoid;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .experience-item {
        page-break-inside: avoid;
      }
    }
    
    @page {
      margin: 0.5in 0.6in;
      size: letter;
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <header class="header">
    <div class="name">${personal_info.full_name}</div>
    <div class="title">${personal_info.title}</div>
    <div class="contact-line">
      ${contactParts.map(part => `<span>${part}</span>`).join('')}
    </div>
  </header>

  ${personal_info.summary ? `
  <!-- PROFESSIONAL SUMMARY -->
  <section class="section">
    <h2 class="section-header">Professional Summary</h2>
    <p class="summary">${personal_info.summary}</p>
  </section>
  ` : ''}

  ${Object.keys(skillsByCategory).length > 0 ? `
  <!-- TECHNICAL SKILLS -->
  <section class="section">
    <h2 class="section-header">Technical Skills</h2>
    ${Object.entries(skillsByCategory).map(([category, skillList]) => `
    <div class="skills-row">
      <span class="skill-category">${category}:</span>
      <span class="skill-items">${skillList.join(', ')}</span>
    </div>
    `).join('')}
  </section>
  ` : ''}

  ${experience.length > 0 ? `
  <!-- PROFESSIONAL EXPERIENCE -->
  <section class="section">
    <h2 class="section-header">Professional Experience</h2>
    ${experience.map(job => {
    // Combine responsibilities and achievements into bullet points
    const bullets: string[] = []
    if (job.responsibilities) bullets.push(...job.responsibilities)
    if (job.achievements) bullets.push(...job.achievements)

    // Build location string
    const locationPart = job.location ? ` | ${job.location}` : ''

    return `
    <div class="experience-item">
      <div class="experience-header">
        <span class="experience-title">${job.position}</span>
        <span class="experience-date">${formatDateRange(job.start_date, job.end_date || null, job.is_current)}</span>
      </div>
      <div class="experience-company">${job.company}${locationPart}</div>
      ${job.description ? `<div style="font-size: 10.5pt; margin-bottom: 4px; font-style: italic;">${job.description}</div>` : ''}
      ${bullets.length > 0 ? `
      <ul class="experience-bullets">
        ${bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
      ` : ''}
      ${job.technologies && job.technologies.length > 0 ? `
      <div style="font-size: 10pt; margin-top: 4px; color: #444;"><strong>Technologies:</strong> ${job.technologies.join(', ')}</div>
      ` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}

  ${featuredProjects.length > 0 ? `
  <!-- PROJECTS -->
  <section class="section">
    <h2 class="section-header">Featured Projects</h2>
    ${featuredProjects.map(project => {
      const links: string[] = []
      if (project.live_url) links.push(project.live_url.replace(/^https?:\/\//, '').replace(/\/$/, ''))
      if (project.github_url) links.push('GitHub')

      return `
    <div class="project-item">
      <div class="project-header">
        <span class="project-title">${project.title}</span>
        ${links.length > 0 ? `<span class="project-links">${links.join(' | ')}</span>` : ''}
      </div>
      ${project.description ? `<div class="project-desc">${project.description}</div>` : ''}
      ${project.stack && project.stack.length > 0 ? `<div class="project-stack"><strong>Stack:</strong> ${project.stack.join(', ')}</div>` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}

  ${education.length > 0 ? `
  <!-- EDUCATION -->
  <section class="section">
    <h2 class="section-header">Education</h2>
    ${education.map(edu => {
        const degreeParts: string[] = []
        if (edu.degree) degreeParts.push(edu.degree)
        if (edu.field_of_study) degreeParts.push(`in ${edu.field_of_study}`)
        const degreeString = degreeParts.join(' ')

        // Education date: only show graduation year for completed, or range for ongoing
        const endYear = edu.end_date ? new Date(edu.end_date).getFullYear().toString() : 'Present'

        return `
    <div class="education-item">
      <div class="education-header">
        <span class="education-school">${edu.institution}</span>
        <span class="education-date">${endYear}</span>
      </div>
      ${degreeString ? `<div class="education-degree">${degreeString}${edu.grade ? ` | GPA: ${edu.grade}` : ''}</div>` : ''}
      ${edu.description ? `<div style="font-size: 10pt; color: #444; margin-top: 2px;">${edu.description}</div>` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}
</body>
</html>`
}

/**
 * GitHub Repo interface for project filtering
 */
export interface GitHubProject {
  name: string
  description?: string | null
  language?: string | null
  html_url: string
  homepage?: string | null
  stargazers_count?: number
  [key: string]: unknown
}

/**
 * Resume generation options with role variant
 */
export interface ResumeGenerationOptions {
  roleTitle?: string
  roleSummary?: string
  portfolioUrl?: string
  filterLanguages?: string[]
}

/**
 * Filter GitHub projects by language preferences
 */
export function filterGitHubProjects(
  repos: GitHubProject[],
  languages: string[],
  maxProjects: number = 4
): Project[] {
  const languagesLower = languages.map(l => l.toLowerCase())

  return repos
    .filter(repo => {
      if (!repo.language) return false
      return languagesLower.some(lang =>
        repo.language!.toLowerCase().includes(lang)
      )
    })
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, maxProjects)
    .map(repo => ({
      id: repo.name,
      title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
      description: getProjectDescription(repo.name, repo.description),
      stack: repo.language ? [repo.language] : [],
      github_url: repo.html_url,
      live_url: repo.homepage,
      is_featured: true,
    }))
}

/**
 * Generate role-variant resume HTML
 */
export function generateVariantResumeHTML(
  data: ResumeData,
  options: ResumeGenerationOptions = {}
): string {
  const { personal_info, experience, education, skills, projects } = data
  const skillsByCategory = groupAndSortSkills(skills)

  // Filter education to exclude only primary school (keep university and high school)
  const filteredEducation = education.filter(edu => {
    const fieldStudy = (edu.field_of_study || '').toLowerCase()
    const institution = (edu.institution || '').toLowerCase()

    // Exclude only primary school
    const isPrimarySchool = institution.includes('primary') ||
      fieldStudy.includes('primary') ||
      fieldStudy.includes('kcpe')

    return !isPrimarySchool
  })

  // Use provided projects or filter featured
  const featuredProjects = (projects || []).filter(p => p.is_featured).slice(0, 4)

  // Sort experience by role relevance (Developer/Engineer roles first)
  const DEVELOPER_KEYWORDS = ['developer', 'engineer', 'architect', 'full-stack', 'frontend', 'backend', 'software']
  const sortedExperience = [...experience].sort((a, b) => {
    const aIsDev = DEVELOPER_KEYWORDS.some(kw =>
      (a.position || '').toLowerCase().includes(kw) ||
      (a.company || '').toLowerCase().includes(kw)
    )
    const bIsDev = DEVELOPER_KEYWORDS.some(kw =>
      (b.position || '').toLowerCase().includes(kw) ||
      (b.company || '').toLowerCase().includes(kw)
    )

    // Prioritize developer roles
    if (aIsDev && !bIsDev) return -1
    if (!aIsDev && bIsDev) return 1

    // Then sort by date (most recent first)
    const aDate = new Date(a.start_date || 0).getTime()
    const bDate = new Date(b.start_date || 0).getTime()
    return bDate - aDate
  })

  // Build contact line with website next to GitHub
  const contactParts: string[] = []
  if (personal_info.email) contactParts.push(personal_info.email)
  if (personal_info.phone) contactParts.push(personal_info.phone)
  if (personal_info.location) contactParts.push(personal_info.location)
  if (personal_info.linkedin_url) {
    const linkedinHandle = personal_info.linkedin_url.replace(/.*linkedin\.com\/in\//, '').replace(/\/$/, '')
    contactParts.push(`www.linkedin.com/in/${linkedinHandle}`)
  }
  if (personal_info.github_url) {
    const githubHandle = personal_info.github_url.replace(/.*github\.com\//, '').replace(/\/$/, '')
    contactParts.push(`github.com/${githubHandle}`)
  }
  // Website link included in contact line next to GitHub
  const portfolioUrl = options.portfolioUrl ||
    personal_info.website_url?.replace(/^https?:\/\//, '').replace(/\/$/, '') ||
    'ambooka.dev'
  contactParts.push(portfolioUrl)

  // Use custom role title or personal_info title
  const displayTitle = options.roleTitle || personal_info.title

  // Use role-specific summary or fallback to database summary
  const displaySummary = options.roleSummary || personal_info.summary

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personal_info.full_name} - Resume</title>
  <style>
    /* ATS-Optimized Resume Styles */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.6in 0.75in;
      background: #fff;
    }
    .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #000; padding-bottom: 12px; }
    .name { font-size: 20pt; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 2px; }
    .title { font-size: 12pt; color: #333; margin-bottom: 6px; }
    .contact-line { font-size: 10pt; color: #333; margin-bottom: 4px; }
    .contact-line span:not(:last-child)::after { content: " | "; color: #666; }
    .portfolio-line { font-size: 10pt; color: #0066cc; font-weight: 500; }
    .section { margin-bottom: 14px; }
    .section-header { font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px; }
    .summary { font-size: 10.5pt; line-height: 1.5; text-align: justify; }
    .skills-row { margin-bottom: 4px; font-size: 10.5pt; }
    .skill-category { font-weight: bold; }
    .experience-item { margin-bottom: 12px; }
    .experience-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; margin-bottom: 2px; }
    .experience-title { font-weight: bold; font-size: 11pt; }
    .experience-date { font-size: 10pt; font-style: italic; color: #333; }
    .experience-company { font-size: 10.5pt; color: #333; margin-bottom: 4px; }
    .experience-bullets { margin-left: 18px; margin-top: 4px; }
    .experience-bullets li { margin-bottom: 3px; font-size: 10.5pt; line-height: 1.4; }
    .project-item { margin-bottom: 10px; }
    .project-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; margin-bottom: 2px; }
    .project-title { font-weight: bold; font-size: 11pt; }
    .project-links { font-size: 9pt; color: #0066cc; }
    .project-desc { font-size: 10.5pt; color: #333; margin-bottom: 3px; }
    .project-stack { font-size: 10pt; color: #444; }
    .education-item { margin-bottom: 8px; }
    .education-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; }
    .education-school { font-weight: bold; font-size: 11pt; }
    .education-date { font-size: 10pt; font-style: italic; color: #333; }
    .education-degree { font-size: 10.5pt; color: #333; }
    @media print { 
      body { padding: 0; max-width: none; } 
      .experience-item, .education-item, .project-item { page-break-inside: avoid; } 
      .section-header { page-break-after: avoid; }
    }
    @page { margin: 0.5in 0.6in; size: letter; }
  </style>
</head>
<body>
  <header class="header">
    <div class="name">${personal_info.full_name}</div>
    <div class="title">${displayTitle}</div>
    <div class="contact-line">${contactParts.map(part => `<span>${part}</span>`).join('')}</div>
  </header>

  ${displaySummary ? `
  <section class="section">
    <h2 class="section-header">Professional Summary</h2>
    <p class="summary">${displaySummary}</p>
  </section>
  ` : ''}

  ${Object.keys(skillsByCategory).length > 0 ? `
  <section class="section">
    <h2 class="section-header">Technical Skills</h2>
    ${Object.entries(skillsByCategory).map(([category, skillList]) => `
    <div class="skills-row">
      <span class="skill-category">${category}:</span>
      <span>${skillList.join(', ')}</span>
    </div>
    `).join('')}
  </section>
  ` : ''}

  ${sortedExperience.length > 0 ? `
  <section class="section">
    <h2 class="section-header">Professional Experience</h2>
    ${sortedExperience.map(job => {
    const bullets: string[] = []
    if (job.responsibilities) bullets.push(...job.responsibilities)
    if (job.achievements) bullets.push(...job.achievements)
    const locationPart = job.location ? ` | ${job.location}` : ''
    return `
    <div class="experience-item">
      <div class="experience-header">
        <span class="experience-title">${job.position}</span>
        <span class="experience-date">${formatDateRange(job.start_date, job.end_date || null, job.is_current)}</span>
      </div>
      <div class="experience-company">${job.company}${locationPart}</div>
      ${bullets.length > 0 ? `
      <ul class="experience-bullets">
        ${bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
      ` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}

  ${featuredProjects.length > 0 ? `
  <section class="section">
    <h2 class="section-header">Featured Projects</h2>
    ${featuredProjects.map(project => {
      const links: string[] = []
      if (project.github_url) links.push(`<a href="${project.github_url}" style="color:#0066cc;text-decoration:none;">GitHub</a>`)
      if (project.live_url) links.push(`<a href="${project.live_url}" style="color:#0066cc;text-decoration:none;">Live</a>`)
      return `
    <div class="project-item">
      <div class="project-header">
        <span class="project-title">${project.title}</span>
        ${links.length > 0 ? `<span class="project-links">${links.join(' | ')}</span>` : ''}
      </div>
      ${project.description ? `<div class="project-desc">${project.description}</div>` : ''}
      ${project.stack && project.stack.length > 0 ? `<div class="project-stack"><strong>Stack:</strong> ${project.stack.join(', ')}</div>` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}

  ${filteredEducation.length > 0 ? `
  <section class="section">
    <h2 class="section-header">Education</h2>
    ${filteredEducation.map(edu => {
        const degreeParts: string[] = []
        if (edu.degree) degreeParts.push(edu.degree)
        if (edu.field_of_study) degreeParts.push(`in ${edu.field_of_study}`)
        const degreeString = degreeParts.join(' ')
        const endYear = edu.end_date ? new Date(edu.end_date).getFullYear().toString() : 'Present'
        return `
    <div class="education-item">
      <div class="education-header">
        <span class="education-school">${edu.institution}</span>
        <span class="education-date">${endYear}</span>
      </div>
      ${degreeString ? `<div class="education-degree">${degreeString}${edu.grade ? ` | GPA: ${edu.grade}` : ''}</div>` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}
</body>
</html>`
}

export default generateATSResumeHTML


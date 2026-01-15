/**
 * Resume Format Generators
 * 
 * Generates resume output in multiple formats:
 * - HTML: For web display and PDF generation
 * - Markdown: For portfolio display
 * - Plain Text: ATS-optimized copy-paste version
 */

import {
    ResumeGenerationInput,
    FormattedResume,
    SKILL_CATEGORY_ORDER,
} from './resume-types';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date for ATS compatibility (MM/YYYY format)
 */
function formatDate(dateStr: string): string {
    if (dateStr.toLowerCase() === 'present') return 'Present';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
}

/**
 * Format date range
 */
function formatDateRange(
    startDate: string,
    endDate: string | undefined,
    isCurrent?: boolean
): string {
    const start = formatDate(startDate);
    const end = isCurrent || !endDate ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
}

/**
 * Build contact line from personal info
 */
function buildContactLine(input: ResumeGenerationInput): string[] {
    const parts: string[] = [];
    const { personalInfo } = input;

    if (personalInfo.email) parts.push(personalInfo.email);
    if (personalInfo.phone) parts.push(personalInfo.phone);
    if (personalInfo.location) {
        const loc = personalInfo.location;
        parts.push([loc.city, loc.state, loc.country].filter(Boolean).join(', '));
    }
    if (personalInfo.links?.linkedin) {
        const handle = personalInfo.links.linkedin.replace(/.*linkedin\.com\/in\//, '').replace(/\/$/, '');
        parts.push(`linkedin.com/in/${handle}`);
    }
    if (personalInfo.links?.github) {
        const handle = personalInfo.links.github.replace(/.*github\.com\//, '').replace(/\/$/, '');
        parts.push(`github.com/${handle}`);
    }
    if (personalInfo.links?.website) {
        parts.push(personalInfo.links.website.replace(/^https?:\/\//, '').replace(/\/$/, ''));
    }

    return parts;
}

/**
 * Organize skills by category
 */
function organizeSkills(input: ResumeGenerationInput): Record<string, string[]> {
    const organized: Record<string, string[]> = {};
    const { skills } = input;

    const categoryMap: Record<string, keyof typeof skills> = {
        'Languages': 'languages',
        'Frontend': 'frontend',
        'Backend': 'backend',
        'Databases': 'databases',
        'Cloud': 'cloud',
        'DevOps': 'devops',
        'Tools': 'tools',
        'IT Support': 'it_support',
        'Methodologies': 'concepts',
    };

    // Add skills in priority order
    SKILL_CATEGORY_ORDER.forEach(category => {
        const key = categoryMap[category];
        if (key && skills[key] && (skills[key] as string[]).length > 0) {
            organized[category] = skills[key] as string[];
        }
    });

    return organized;
}

// ============================================================================
// HTML GENERATOR (Enhanced)
// ============================================================================

/**
 * Generate ATS-optimized HTML resume
 */
export function generateHTML(input: ResumeGenerationInput): string {
    const contactParts = buildContactLine(input);
    const skillsByCategory = organizeSkills(input);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${input.personalInfo.fullName} - Resume</title>
  <style>
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
    .header {
      text-align: center;
      margin-bottom: 16px;
      border-bottom: 2px solid #000;
      padding-bottom: 12px;
    }
    .name { font-size: 20pt; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 2px; }
    .title { font-size: 12pt; color: #333; margin-bottom: 6px; }
    .contact-line { font-size: 10pt; color: #333; }
    .contact-line span:not(:last-child)::after { content: " | "; color: #666; }
    .section { margin-bottom: 14px; }
    .section-header {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
      margin-bottom: 10px;
    }
    .summary { font-size: 10.5pt; line-height: 1.5; text-align: justify; }
    .skills-row { margin-bottom: 4px; font-size: 10.5pt; }
    .skill-category { font-weight: bold; }
    .experience-item { margin-bottom: 12px; }
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      margin-bottom: 2px;
    }
    .experience-title { font-weight: bold; font-size: 11pt; }
    .experience-date { font-size: 10pt; font-style: italic; color: #333; }
    .experience-company { font-size: 10.5pt; color: #333; margin-bottom: 4px; }
    .experience-bullets { margin-left: 18px; margin-top: 4px; }
    .experience-bullets li { margin-bottom: 3px; font-size: 10.5pt; line-height: 1.4; }
    .education-item { margin-bottom: 8px; }
    .education-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; }
    .education-school { font-weight: bold; font-size: 11pt; }
    .education-date { font-size: 10pt; font-style: italic; color: #333; }
    .education-degree { font-size: 10.5pt; color: #333; }
    .cert-item { margin-bottom: 4px; font-size: 10.5pt; }
    @media print {
      body { padding: 0; max-width: none; }
      .header { page-break-after: avoid; }
      .section-header { page-break-after: avoid; }
      .experience-item, .education-item, .project-item { page-break-inside: avoid; }
    }
    @page { margin: 0.5in 0.6in; size: letter; }
  </style>
</head>
<body>
  <header class="header">
    <div class="name">${input.personalInfo.fullName}</div>
    ${input.personalInfo.title ? `<div class="title">${input.personalInfo.title}</div>` : ''}
    <div class="contact-line">${contactParts.map(p => `<span>${p}</span>`).join('')}</div>
  </header>

  ${input.personalInfo.summary ? `
  <section class="section">
    <h2 class="section-header">Professional Summary</h2>
    <p class="summary">${input.personalInfo.summary}</p>
  </section>
  ` : ''}

  ${Object.keys(skillsByCategory).length > 0 ? `
  <section class="section">
    <h2 class="section-header">Technical Skills</h2>
    ${Object.entries(skillsByCategory).map(([cat, skills]) => `
    <div class="skills-row">
      <span class="skill-category">${cat}:</span>
      <span>${skills.join(', ')}</span>
    </div>
    `).join('')}
  </section>
  ` : ''}

  ${input.experience.length > 0 ? `
  <section class="section">
    <h2 class="section-header">Professional Experience</h2>
    ${input.experience.map(exp => {
        const bullets = [...(exp.responsibilities || []), ...(exp.achievements || [])];
        const location = exp.location ? ` | ${exp.location}` : '';
        return `
    <div class="experience-item">
      <div class="experience-header">
        <span class="experience-title">${exp.title}</span>
        <span class="experience-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
      </div>
      <div class="experience-company">${exp.company}${location}</div>
      ${bullets.length > 0 ? `
      <ul class="experience-bullets">
        ${bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
      ` : ''}
      ${exp.technologies?.length ? `<div style="font-size:10pt;margin-top:4px;color:#444;"><strong>Technologies:</strong> ${exp.technologies.join(', ')}</div>` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}

  ${input.education.length > 0 ? `
  <section class="section">
    <h2 class="section-header">Education</h2>
    ${input.education.map(edu => {
            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(' in ');
            const gradYear = edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : '';
            return `
    <div class="education-item">
      <div class="education-header">
        <span class="education-school">${edu.institution}</span>
        <span class="education-date">${gradYear}</span>
      </div>
      ${degreeStr ? `<div class="education-degree">${degreeStr}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>` : ''}
    </div>
    `}).join('')}
  </section>
  ` : ''}

  ${input.certifications && input.certifications.length > 0 ? `
  <section class="section">
    <h2 class="section-header">Certifications</h2>
    ${input.certifications.map(cert => `
    <div class="cert-item">• ${cert.name} - ${cert.issuer} (${new Date(cert.dateEarned).getFullYear()})</div>
    `).join('')}
  </section>
  ` : ''}
</body>
</html>`;
}

// ============================================================================
// MARKDOWN GENERATOR
// ============================================================================

/**
 * Generate Markdown resume
 */
export function generateMarkdown(input: ResumeGenerationInput): string {
    const contactParts = buildContactLine(input);
    const skillsByCategory = organizeSkills(input);

    let md = '';

    // Header
    md += `# ${input.personalInfo.fullName}\n`;
    if (input.personalInfo.title) md += `**${input.personalInfo.title}**\n\n`;
    md += contactParts.join(' • ') + '\n\n';
    md += '---\n\n';

    // Summary
    if (input.personalInfo.summary) {
        md += `## Professional Summary\n\n${input.personalInfo.summary}\n\n---\n\n`;
    }

    // Skills
    if (Object.keys(skillsByCategory).length > 0) {
        md += `## Technical Skills\n\n`;
        Object.entries(skillsByCategory).forEach(([cat, skills]) => {
            md += `**${cat}:** ${skills.join(', ')}\n\n`;
        });
        md += '---\n\n';
    }

    // Experience
    if (input.experience.length > 0) {
        md += `## Professional Experience\n\n`;
        input.experience.forEach(exp => {
            const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
            md += `### ${exp.title} | **${exp.company}** | *${dateRange}*\n\n`;

            const bullets = [...(exp.responsibilities || []), ...(exp.achievements || [])];
            bullets.forEach(b => {
                md += `- ${b}\n`;
            });

            if (exp.technologies?.length) {
                md += `\n*Technologies: ${exp.technologies.join(', ')}*\n`;
            }
            md += '\n';
        });
        md += '---\n\n';
    }

    // Projects
    if (input.projects && input.projects.length > 0) {
        md += `## Projects\n\n`;
        input.projects.forEach(proj => {
            md += `### ${proj.name} | *${proj.role}*\n\n`;
            if (proj.url || proj.github) {
                const links = [proj.url, proj.github].filter(Boolean).join(' | ');
                md += `[${links}](${proj.url || proj.github})\n\n`;
            }
            proj.highlights.forEach(h => {
                md += `- ${h}\n`;
            });
            md += `\n*Stack: ${proj.technologies.join(', ')}*\n\n`;
        });
        md += '---\n\n';
    }

    // Education
    if (input.education.length > 0) {
        md += `## Education\n\n`;
        input.education.forEach(edu => {
            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(' in ');
            const gradYear = edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : '';
            md += `**${degreeStr}** | ${edu.institution} | ${gradYear}\n`;
            if (edu.gpa) md += `GPA: ${edu.gpa}\n`;
            md += '\n';
        });
        md += '---\n\n';
    }

    // Certifications
    if (input.certifications && input.certifications.length > 0) {
        md += `## Certifications\n\n`;
        input.certifications.forEach(cert => {
            md += `- **${cert.name}** - ${cert.issuer} (${new Date(cert.dateEarned).getFullYear()})\n`;
        });
    }

    return md;
}

// ============================================================================
// PLAIN TEXT GENERATOR (ATS-Optimized)
// ============================================================================

/**
 * Generate plain text resume for ATS copy-paste
 */
export function generatePlainText(input: ResumeGenerationInput): string {
    const contactParts = buildContactLine(input);
    const skillsByCategory = organizeSkills(input);

    let text = '';

    // Header
    text += input.personalInfo.fullName.toUpperCase() + '\n';
    if (input.personalInfo.title) text += input.personalInfo.title + '\n';
    text += contactParts.join(' | ') + '\n\n';

    // Summary
    if (input.personalInfo.summary) {
        text += 'PROFESSIONAL SUMMARY\n';
        text += '='.repeat(50) + '\n';
        text += input.personalInfo.summary + '\n\n';
    }

    // Skills
    if (Object.keys(skillsByCategory).length > 0) {
        text += 'TECHNICAL SKILLS\n';
        text += '='.repeat(50) + '\n';
        Object.entries(skillsByCategory).forEach(([cat, skills]) => {
            text += `${cat}: ${skills.join(', ')}\n`;
        });
        text += '\n';
    }

    // Experience
    if (input.experience.length > 0) {
        text += 'PROFESSIONAL EXPERIENCE\n';
        text += '='.repeat(50) + '\n\n';
        input.experience.forEach(exp => {
            const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
            text += `${exp.title} | ${exp.company} | ${dateRange}\n`;
            if (exp.location) text += `${exp.location}\n`;
            text += '\n';

            const bullets = [...(exp.responsibilities || []), ...(exp.achievements || [])];
            bullets.forEach(b => {
                text += `* ${b}\n`;
            });

            if (exp.technologies?.length) {
                text += `\nTechnologies: ${exp.technologies.join(', ')}\n`;
            }
            text += '\n';
        });
    }

    // Education
    if (input.education.length > 0) {
        text += 'EDUCATION\n';
        text += '='.repeat(50) + '\n';
        input.education.forEach(edu => {
            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(' in ');
            const gradYear = edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : '';
            text += `${degreeStr} | ${edu.institution} | ${gradYear}\n`;
            if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        });
        text += '\n';
    }

    // Certifications
    if (input.certifications && input.certifications.length > 0) {
        text += 'CERTIFICATIONS\n';
        text += '='.repeat(50) + '\n';
        input.certifications.forEach(cert => {
            text += `* ${cert.name} - ${cert.issuer} (${new Date(cert.dateEarned).getFullYear()})\n`;
        });
    }

    return text;
}

// ============================================================================
// MAIN FORMAT GENERATOR
// ============================================================================

/**
 * Generate resume in all formats
 */
export function generateAllFormats(input: ResumeGenerationInput): FormattedResume {
    return {
        html: generateHTML(input),
        markdown: generateMarkdown(input),
        plainText: generatePlainText(input),
    };
}

export default generateAllFormats;

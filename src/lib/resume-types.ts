/**
 * Advanced Resume Generation System - Type Definitions
 * 
 * Comprehensive types for enterprise-grade ATS-optimized resume generation
 * following industry best practices for recruiter screening and ATS parsing.
 */

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * Personal/Contact Information
 */
export interface PersonalInfo {
    fullName: string;
    email: string;
    phone?: string;
    location?: {
        city: string;
        state?: string;
        country: string;
    };
    links?: {
        linkedin?: string;
        github?: string;
        portfolio?: string;
        website?: string;
        other?: string[];
    };
    title?: string;
    summary?: string;
}

/**
 * Target Role Context for Job-Tailored Resume
 */
export interface TargetRole {
    jobTitle?: string;
    jobDescription?: string;
    targetLevel?: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
    targetCompany?: string;
    keywords?: string[];
}

/**
 * Work Experience Entry
 */
export interface ExperienceEntry {
    id?: string;
    company: string;
    title: string;
    location?: string;
    startDate: string;
    endDate?: string | 'present';
    isCurrent?: boolean;
    description?: string;
    responsibilities?: string[];
    achievements?: string[];
    technologies?: string[];
    teamSize?: number;
    impact?: {
        metrics?: Array<{
            metric: string;
            improvement: string;
            before?: string;
            after?: string;
        }>;
        businessOutcomes?: string[];
        technicalOutcomes?: string[];
    };
}

/**
 * Project Entry (Personal, Freelance, Open Source)
 */
export interface ProjectEntry {
    name: string;
    description: string;
    role: string;
    technologies: string[];
    url?: string;
    github?: string;
    highlights: string[];
    metrics?: Array<{
        metric: string;
        value: string;
    }>;
    startDate?: string;
    endDate?: string;
    status?: 'completed' | 'ongoing' | 'archived';
}

/**
 * Technical Skills Input
 */
export interface SkillsInput {
    languages?: string[];
    frontend?: string[];
    backend?: string[];
    databases?: string[];
    cloud?: string[];
    devops?: string[];
    tools?: string[];
    it_support?: string[];
    concepts?: string[];
    proficiencyLevels?: Record<string, 'expert' | 'advanced' | 'intermediate' | 'basic'>;
}

/**
 * Education Entry
 */
export interface EducationEntry {
    id?: string;
    degree: string;
    field: string;
    institution: string;
    location?: string;
    graduationDate: string;
    gpa?: number;
    honors?: string[];
    relevantCoursework?: string[];
}

/**
 * Certification Entry
 */
export interface CertificationEntry {
    name: string;
    issuer: string;
    dateEarned: string;
    expirationDate?: string;
    credentialId?: string;
    url?: string;
}

/**
 * Publication/Speaking Entry
 */
export interface PublicationEntry {
    title: string;
    type: 'article' | 'paper' | 'talk' | 'podcast' | 'video';
    publisher: string;
    date: string;
    url?: string;
}

/**
 * Resume Generation Preferences
 */
export interface ResumePreferences {
    includePhoto?: boolean;
    includeSummary?: boolean;
    preferredLength?: 1 | 2;
    tone?: 'technical' | 'business' | 'balanced';
    emphasize?: 'leadership' | 'technical-depth' | 'impact' | 'breadth';
    industryFocus?: string[];
}

/**
 * Complete Resume Generation Input
 */
export interface ResumeGenerationInput {
    personalInfo: PersonalInfo;
    targetRole?: TargetRole;
    experience: ExperienceEntry[];
    projects?: ProjectEntry[];
    skills: SkillsInput;
    education: EducationEntry[];
    certifications?: CertificationEntry[];
    publications?: PublicationEntry[];
    preferences?: ResumePreferences;
}

// ============================================================================
// OUTPUT TYPES
// ============================================================================

/**
 * Formatted Resume Output
 */
export interface FormattedResume {
    html: string;
    markdown: string;
    plainText: string;
}

/**
 * Quality Report Scores
 */
export interface QualityReport {
    atsCompatibilityScore: number; // 0-100
    keywordMatchScore: number; // 0-100
    impactDensityScore: number; // 0-100
    readabilityScore: number; // 0-100
    overallScore: number; // 0-100
}

/**
 * Keyword Analysis Results
 */
export interface KeywordAnalysis {
    requiredKeywordsFound: string[];
    requiredKeywordsMissing: string[];
    optionalKeywordsFound: string[];
    keywordFrequency: Record<string, number>;
}

/**
 * Improvement Suggestion
 */
export interface Suggestion {
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'ats' | 'content' | 'formatting' | 'keywords' | 'impact';
    issue: string;
    recommendation: string;
    location?: string;
}

/**
 * ATS Compatibility Report
 */
export interface ATSReport {
    parsingIssues: string[];
    formattingWarnings: string[];
    sectionRecognition: Record<string, 'recognized' | 'not-recognized' | 'ambiguous'>;
    estimatedParsingSuccess: number;
}

/**
 * Role Alignment Analysis
 */
export interface RoleAlignment {
    levelMatch: 'below' | 'matched' | 'above' | 'unclear';
    skillsMatch: number;
    experienceMatch: number;
    missingCriticalSkills: string[];
    strengthAreas: string[];
    weaknessAreas: string[];
}

/**
 * Resume Generation Metadata
 */
export interface ResumeMetadata {
    generatedAt: string;
    version: string;
    targetRole?: string;
    resumeLength: number;
    wordCount: number;
    bulletCount: number;
}

/**
 * Complete Resume Generation Output
 */
export interface ResumeOutput {
    formattedResume: FormattedResume;
    qualityReport: QualityReport;
    keywordAnalysis?: KeywordAnalysis;
    suggestions: Suggestion[];
    atsReport: ATSReport;
    roleAlignment?: RoleAlignment;
    metadata: ResumeMetadata;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Skill category priority order for ATS optimization
 */
export const SKILL_CATEGORY_ORDER = [
    'Languages',
    'Frontend',
    'Backend',
    'Databases',
    'Cloud',
    'DevOps',
    'Tools',
    'ML',
    'Frameworks',
    'Methodologies',
    'Other'
] as const;

/**
 * ATS-recognized section headers
 */
export const ATS_SECTION_HEADERS = {
    summary: ['PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE', 'OBJECTIVE'],
    skills: ['TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'TECHNOLOGIES'],
    experience: ['PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT HISTORY'],
    education: ['EDUCATION', 'ACADEMIC BACKGROUND'],
    certifications: ['CERTIFICATIONS', 'LICENSES', 'CREDENTIALS'],
    projects: ['PROJECTS', 'PERSONAL PROJECTS', 'SIDE PROJECTS'],
    publications: ['PUBLICATIONS', 'PUBLICATIONS & SPEAKING', 'SPEAKING'],
} as const;

/**
 * Strong action verbs for bullet points (categorized)
 */
export const ACTION_VERBS = {
    leadership: ['Led', 'Directed', 'Managed', 'Headed', 'Orchestrated', 'Spearheaded'],
    technical: ['Architected', 'Engineered', 'Developed', 'Implemented', 'Built', 'Designed'],
    optimization: ['Optimized', 'Improved', 'Enhanced', 'Streamlined', 'Accelerated', 'Reduced'],
    collaboration: ['Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Mentored'],
    innovation: ['Pioneered', 'Introduced', 'Established', 'Launched', 'Created', 'Innovated'],
    analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Diagnosed', 'Investigated', 'Researched'],
} as const;

/**
 * Weak phrases to avoid in bullets
 */
export const WEAK_PHRASES = [
    'Responsible for',
    'Helped with',
    'Worked on',
    'Assisted in',
    'Participated in',
    'Was involved in',
    'Duties included',
] as const;

export type SkillCategory = typeof SKILL_CATEGORY_ORDER[number];
export type ActionVerbCategory = keyof typeof ACTION_VERBS;

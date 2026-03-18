/**
 * Resume Quality Analyzer
 * 
 * Analyzes resumes for:
 * - ATS compatibility scoring
 * - Keyword matching against job descriptions
 * - Impact density in bullet points
 * - Improvement suggestions
 */

import {
    ResumeGenerationInput,
    QualityReport,
    KeywordAnalysis,
    Suggestion,
    ATSReport,
    ExperienceEntry,
    WEAK_PHRASES,
    ATS_SECTION_HEADERS,
} from './resume-types';

// ============================================================================
// KEYWORD EXTRACTION
// ============================================================================

/**
 * Extract technical keywords from job description
 */
export function extractKeywordsFromJD(jobDescription: string): {
    required: string[];
    preferred: string[];
    technical: string[];
} {
    const text = jobDescription.toLowerCase();

    // Common tech keywords to look for
    const techPatterns = [
        // Languages
        /\b(javascript|typescript|python|java|go|golang|rust|c\+\+|c#|php|ruby|swift|kotlin)\b/gi,
        // Frontend
        /\b(react|vue|angular|next\.?js|svelte|html|css|tailwind|sass|scss)\b/gi,
        // Backend
        /\b(node\.?js|express|fastapi|django|flask|spring|rails|laravel|graphql|rest|api)\b/gi,
        // Databases
        /\b(postgresql|postgres|mysql|mongodb|redis|elasticsearch|dynamodb|supabase|firebase)\b/gi,
        // Cloud
        /\b(aws|azure|gcp|google cloud|ec2|s3|lambda|kubernetes|k8s|docker|terraform)\b/gi,
        // DevOps
        /\b(ci\/cd|jenkins|github actions|gitlab|circleci|ansible|prometheus|grafana)\b/gi,
    ];

    const foundKeywords = new Set<string>();
    techPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(m => foundKeywords.add(m.toLowerCase()));
        }
    });

    // Identify required vs preferred based on context
    const required: string[] = [];
    const preferred: string[] = [];

    // Look for "required" section keywords
    const requiredSection = text.match(/required[:\s]*([\s\S]*?)(?:preferred|nice to have|bonus|$)/i);
    const preferredSection = text.match(/(?:preferred|nice to have|bonus)[:\s]*([\s\S]*?)(?:required|$)/i);

    foundKeywords.forEach(keyword => {
        if (requiredSection && requiredSection[1].includes(keyword)) {
            required.push(keyword);
        } else if (preferredSection && preferredSection[1].includes(keyword)) {
            preferred.push(keyword);
        } else {
            // Default to required if mentioned multiple times
            const count = (text.match(new RegExp(keyword, 'gi')) || []).length;
            if (count >= 2) {
                required.push(keyword);
            } else {
                preferred.push(keyword);
            }
        }
    });

    return {
        required: [...new Set(required)],
        preferred: [...new Set(preferred)],
        technical: Array.from(foundKeywords),
    };
}

// ============================================================================
// ATS COMPATIBILITY SCORING
// ============================================================================

/**
 * Calculate ATS compatibility score (0-100)
 */
export function calculateATSScore(input: ResumeGenerationInput): { score: number; issues: string[] } {
    let score = 100;
    const issues: string[] = [];

    // Check personal info completeness
    if (!input.personalInfo.email) {
        score -= 10;
        issues.push('Missing email address');
    }
    if (!input.personalInfo.phone) {
        score -= 5;
        issues.push('Missing phone number');
    }
    if (!input.personalInfo.location?.city) {
        score -= 3;
        issues.push('Missing location');
    }
    if (!input.personalInfo.links?.linkedin) {
        score -= 3;
        issues.push('Missing LinkedIn URL');
    }

    // Check experience entries
    input.experience.forEach((exp, idx) => {
        if (!exp.startDate) {
            score -= 5;
            issues.push(`Experience ${idx + 1}: Missing start date`);
        }
        if (!exp.isCurrent && !exp.endDate) {
            score -= 3;
            issues.push(`Experience ${idx + 1}: Missing end date`);
        }
        const bullets = [...(exp.responsibilities || []), ...(exp.achievements || [])];
        if (bullets.length < 2) {
            score -= 5;
            issues.push(`Experience ${idx + 1}: Too few bullet points (minimum 2)`);
        }
    });

    // Check skills organization
    const skillCategories = Object.keys(input.skills).filter(k =>
        k !== 'proficiencyLevels' &&
        Array.isArray(input.skills[k as keyof typeof input.skills]) &&
        (input.skills[k as keyof typeof input.skills] as string[]).length > 0
    );
    if (skillCategories.length < 2) {
        score -= 5;
        issues.push('Skills not well-organized into categories');
    }

    // Check education
    if (input.education.length === 0) {
        score -= 5;
        issues.push('Missing education section');
    }

    return { score: Math.max(0, score), issues };
}

// ============================================================================
// KEYWORD MATCH SCORING
// ============================================================================

/**
 * Calculate keyword match score against job description
 */
export function calculateKeywordMatch(
    input: ResumeGenerationInput,
    jobKeywords?: { required: string[]; preferred: string[] }
): KeywordAnalysis {
    if (!jobKeywords) {
        return {
            requiredKeywordsFound: [],
            requiredKeywordsMissing: [],
            optionalKeywordsFound: [],
            keywordFrequency: {},
        };
    }

    // Collect all text from resume
    const resumeText = [
        input.personalInfo.summary || '',
        input.personalInfo.title || '',
        ...Object.values(input.skills).flat().filter(s => typeof s === 'string'),
        ...input.experience.flatMap(e => [
            e.title,
            e.description || '',
            ...(e.responsibilities || []),
            ...(e.achievements || []),
            ...(e.technologies || []),
        ]),
        ...input.education.map(e => `${e.degree} ${e.field}`),
        ...(input.certifications?.map(c => c.name) || []),
    ].join(' ').toLowerCase();

    const keywordFrequency: Record<string, number> = {};
    const requiredKeywordsFound: string[] = [];
    const requiredKeywordsMissing: string[] = [];
    const optionalKeywordsFound: string[] = [];

    // Check required keywords
    jobKeywords.required.forEach(keyword => {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const matches = resumeText.match(regex);
        const count = matches ? matches.length : 0;
        keywordFrequency[keyword] = count;

        if (count > 0) {
            requiredKeywordsFound.push(keyword);
        } else {
            requiredKeywordsMissing.push(keyword);
        }
    });

    // Check preferred keywords
    jobKeywords.preferred.forEach(keyword => {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const matches = resumeText.match(regex);
        const count = matches ? matches.length : 0;
        keywordFrequency[keyword] = count;

        if (count > 0) {
            optionalKeywordsFound.push(keyword);
        }
    });

    return {
        requiredKeywordsFound,
        requiredKeywordsMissing,
        optionalKeywordsFound,
        keywordFrequency,
    };
}

// ============================================================================
// IMPACT DENSITY SCORING
// ============================================================================

/**
 * Check if a bullet point contains quantification
 */
function hasQuantification(bullet: string): boolean {
    // Look for numbers, percentages, dollar amounts
    const quantPatterns = [
        /\d+%/,           // Percentages
        /\$[\d,.]+[kmb]?/i, // Dollar amounts
        /\d+x/i,          // Multipliers
        /\d+\+?/,         // Numbers
        /\b(million|thousand|hundred|billion)\b/i,
    ];
    return quantPatterns.some(p => p.test(bullet));
}

/**
 * Check if a bullet starts with a strong action verb
 */
function hasStrongActionVerb(bullet: string): boolean {
    const strongVerbs = [
        'Architected', 'Engineered', 'Developed', 'Implemented', 'Built', 'Designed',
        'Optimized', 'Improved', 'Enhanced', 'Streamlined', 'Accelerated', 'Reduced',
        'Led', 'Directed', 'Managed', 'Headed', 'Orchestrated', 'Spearheaded',
        'Pioneered', 'Introduced', 'Established', 'Launched', 'Created', 'Innovated',
        'Migrated', 'Automated', 'Refactored', 'Consolidated', 'Integrated',
    ];
    const firstWord = bullet.trim().split(/\s+/)[0];
    return strongVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase());
}

/**
 * Check for weak phrases to avoid
 */
function hasWeakPhrase(bullet: string): boolean {
    return WEAK_PHRASES.some(phrase =>
        bullet.toLowerCase().includes(phrase.toLowerCase())
    );
}

/**
 * Calculate impact density score for experience bullets
 */
export function calculateImpactDensity(experience: ExperienceEntry[]): {
    score: number;
    weakBullets: Array<{ bullet: string; issues: string[] }>;
} {
    const allBullets: string[] = [];
    experience.forEach(exp => {
        if (exp.responsibilities) allBullets.push(...exp.responsibilities);
        if (exp.achievements) allBullets.push(...exp.achievements);
    });

    if (allBullets.length === 0) {
        return { score: 0, weakBullets: [] };
    }

    let totalScore = 0;
    const weakBullets: Array<{ bullet: string; issues: string[] }> = [];

    allBullets.forEach(bullet => {
        let bulletScore = 50; // Base score
        const issues: string[] = [];

        if (hasQuantification(bullet)) {
            bulletScore += 25;
        } else {
            issues.push('Missing quantification (add metrics, percentages, or numbers)');
        }

        if (hasStrongActionVerb(bullet)) {
            bulletScore += 15;
        } else {
            issues.push('Start with a strong action verb');
        }

        if (hasWeakPhrase(bullet)) {
            bulletScore -= 20;
            issues.push('Contains weak phrase - rewrite to show impact');
        }

        // Length check (too short or too long)
        if (bullet.length < 50) {
            bulletScore -= 10;
            issues.push('Too short - add more detail and impact');
        } else if (bullet.length > 300) {
            bulletScore -= 5;
            issues.push('Too long - consider splitting into multiple bullets');
        }

        totalScore += bulletScore;

        if (issues.length > 0) {
            weakBullets.push({ bullet, issues });
        }
    });

    return {
        score: Math.min(100, Math.max(0, Math.round(totalScore / allBullets.length))),
        weakBullets: weakBullets.slice(0, 5), // Top 5 issues
    };
}

// ============================================================================
// READABILITY SCORING
// ============================================================================

/**
 * Calculate readability score
 */
export function calculateReadabilityScore(input: ResumeGenerationInput): number {
    let score = 100;

    // Check summary length
    if (input.personalInfo.summary) {
        const summaryWords = input.personalInfo.summary.split(/\s+/).length;
        if (summaryWords < 30) score -= 5; // Too short
        if (summaryWords > 100) score -= 10; // Too long
    }

    // Check bullet point count per experience
    input.experience.forEach(exp => {
        const bullets = [...(exp.responsibilities || []), ...(exp.achievements || [])];
        if (bullets.length > 6) score -= 5; // Too many bullets
    });

    // Check total experience entries
    if (input.experience.length > 5) score -= 5; // Too many entries

    return Math.max(0, score);
}

// ============================================================================
// SUGGESTIONS GENERATOR
// ============================================================================

/**
 * Generate improvement suggestions
 */
export function generateSuggestions(
    input: ResumeGenerationInput,
    atsResult: { score: number; issues: string[] },
    impactResult: { weakBullets: Array<{ bullet: string; issues: string[] }> },
    keywordAnalysis?: KeywordAnalysis
): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // ATS issues
    atsResult.issues.forEach(issue => {
        suggestions.push({
            priority: issue.includes('email') ? 'critical' : 'high',
            category: 'ats',
            issue,
            recommendation: `Fix: ${issue}`,
        });
    });

    // Missing keywords
    if (keywordAnalysis?.requiredKeywordsMissing.length) {
        keywordAnalysis.requiredKeywordsMissing.forEach(keyword => {
            suggestions.push({
                priority: 'high',
                category: 'keywords',
                issue: `Missing required keyword: ${keyword}`,
                recommendation: `Add "${keyword}" to skills or experience if you have this expertise`,
            });
        });
    }

    // Weak bullets
    impactResult.weakBullets.forEach(({ bullet, issues }) => {
        suggestions.push({
            priority: 'medium',
            category: 'impact',
            issue: `Weak bullet: "${bullet.substring(0, 50)}..."`,
            recommendation: issues.join('; '),
            location: 'Professional Experience',
        });
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions.slice(0, 10); // Top 10 suggestions
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

/**
 * Analyze resume and generate comprehensive quality report
 */
export function analyzeResume(
    input: ResumeGenerationInput,
    jobDescription?: string
): {
    qualityReport: QualityReport;
    keywordAnalysis?: KeywordAnalysis;
    suggestions: Suggestion[];
    atsReport: ATSReport;
} {
    // Extract keywords from JD if provided
    const jobKeywords = jobDescription ? extractKeywordsFromJD(jobDescription) : undefined;

    // Calculate individual scores
    const atsResult = calculateATSScore(input);
    const keywordAnalysis = calculateKeywordMatch(input, jobKeywords);
    const impactResult = calculateImpactDensity(input.experience);
    const readabilityScore = calculateReadabilityScore(input);

    // Calculate keyword match percentage
    let keywordMatchScore = 100;
    if (jobKeywords && jobKeywords.required.length > 0) {
        const matchedPercent = (keywordAnalysis.requiredKeywordsFound.length / jobKeywords.required.length) * 100;
        keywordMatchScore = Math.round(matchedPercent);
    }

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
        atsResult.score * 0.25 +
        keywordMatchScore * 0.25 +
        impactResult.score * 0.30 +
        readabilityScore * 0.20
    );

    // Generate suggestions
    const suggestions = generateSuggestions(input, atsResult, impactResult, keywordAnalysis);

    // Build ATS report
    const atsReport: ATSReport = {
        parsingIssues: atsResult.issues.filter(i => i.includes('Missing')),
        formattingWarnings: [],
        sectionRecognition: {
            summary: input.personalInfo.summary ? 'recognized' : 'not-recognized',
            skills: Object.keys(input.skills).length > 0 ? 'recognized' : 'not-recognized',
            experience: input.experience.length > 0 ? 'recognized' : 'not-recognized',
            education: input.education.length > 0 ? 'recognized' : 'not-recognized',
            certifications: (input.certifications?.length ?? 0) > 0 ? 'recognized' : 'not-recognized',
        },
        estimatedParsingSuccess: atsResult.score,
    };

    return {
        qualityReport: {
            atsCompatibilityScore: atsResult.score,
            keywordMatchScore,
            impactDensityScore: impactResult.score,
            readabilityScore,
            overallScore,
        },
        keywordAnalysis: jobKeywords ? keywordAnalysis : undefined,
        suggestions,
        atsReport,
    };
}

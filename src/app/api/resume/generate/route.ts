/**
 * Resume Generation API Endpoint
 * 
 * POST /api/resume/generate
 * 
 * Generates ATS-optimized resume with quality analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import {
    ResumeGenerationInput,
    ResumeOutput,
    ResumeMetadata,
} from '@/lib/resume-types';
import { analyzeResume } from '@/lib/resume-analyzer';
import { generateAllFormats } from '@/lib/resume-formats';

/**
 * Transform Supabase data to ResumeGenerationInput format
 */
function transformSupabaseData(data: {
    personalInfo: Record<string, unknown>;
    experience: Record<string, unknown>[];
    education: Record<string, unknown>[];
    skills: Record<string, unknown>[];
}): ResumeGenerationInput {
    const { personalInfo, experience, education, skills } = data;

    // Transform personal info
    const pi = personalInfo;
    const transformedPersonalInfo = {
        fullName: (pi.full_name as string) || '',
        email: (pi.email as string) || '',
        phone: pi.phone as string | undefined,
        title: pi.title as string | undefined,
        summary: pi.summary as string | undefined,
        location: pi.location ? {
            city: (pi.location as string),
            country: ''
        } : undefined,
        links: {
            linkedin: pi.linkedin_url as string | undefined,
            github: pi.github_url as string | undefined,
            website: pi.website_url as string | undefined,
        },
    };

    // Transform experience
    const transformedExperience = experience.map(exp => ({
        id: exp.id as string,
        company: (exp.company as string) || '',
        title: (exp.position as string) || '',
        location: exp.location as string | undefined,
        startDate: (exp.start_date as string) || '',
        endDate: exp.end_date as string | undefined,
        isCurrent: Boolean(exp.is_current),
        description: exp.description as string | undefined,
        responsibilities: exp.responsibilities as string[] | undefined,
        achievements: exp.achievements as string[] | undefined,
        technologies: exp.technologies as string[] | undefined,
    }));

    // Transform education
    const transformedEducation = education.map(edu => ({
        id: edu.id as string,
        degree: (edu.degree as string) || '',
        field: (edu.field_of_study as string) || '',
        institution: (edu.institution as string) || '',
        graduationDate: (edu.end_date as string) || '',
        gpa: edu.grade ? parseFloat(edu.grade as string) : undefined,
    }));

    // Transform skills into categorized structure
    const skillsByCategory: Record<string, string[]> = {};
    skills.forEach(skill => {
        const category = (skill.category as string) || 'Other';
        if (!skillsByCategory[category]) {
            skillsByCategory[category] = [];
        }
        skillsByCategory[category].push(skill.name as string);
    });

    const transformedSkills = {
        languages: skillsByCategory['Languages'] || [],
        frontend: skillsByCategory['Frontend'] || [],
        backend: skillsByCategory['Backend'] || [],
        databases: skillsByCategory['Databases'] || [],
        cloud: skillsByCategory['Cloud'] || [],
        devops: skillsByCategory['DevOps'] || [],
        tools: skillsByCategory['Tools'] || [],
        concepts: skillsByCategory['ML'] || skillsByCategory['Frameworks'] || [],
    };

    return {
        personalInfo: transformedPersonalInfo,
        experience: transformedExperience,
        education: transformedEducation,
        skills: transformedSkills,
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            targetJobDescription,
            format = 'html',
            customData,
        } = body as {
            targetJobDescription?: string;
            format?: 'html' | 'markdown' | 'text' | 'all';
            customData?: ResumeGenerationInput;
        };

        let inputData: ResumeGenerationInput;

        // Use custom data if provided, otherwise fetch from Supabase
        if (customData) {
            inputData = customData;
        } else {
            // Fetch data from Supabase
            const [personalInfoResult, experienceResult, educationResult, skillsResult] = await Promise.all([
                supabase.from('personal_info').select('*').single(),
                supabase.from('experience').select('*').order('start_date', { ascending: false }),
                supabase.from('education').select('*').order('end_date', { ascending: false }),
                supabase.from('skills').select('*').order('proficiency_level', { ascending: false }),
            ]);

            if (personalInfoResult.error) {
                return NextResponse.json({ error: 'Failed to fetch personal info' }, { status: 500 });
            }

            inputData = transformSupabaseData({
                personalInfo: personalInfoResult.data || {},
                experience: experienceResult.data || [],
                education: educationResult.data || [],
                skills: skillsResult.data || [],
            });
        }

        // Generate formatted resume
        const formattedResume = generateAllFormats(inputData);

        // [RESUME ENHANCEMENT]: Force-inject hardcoded IT skills from Hebatullah experience & JD
        // The user specifically requested hardcoded technical skills for this role.
        const isITRole = (inputData.personalInfo.title || '').toLowerCase().includes('it assistant') ||
            (targetJobDescription || '').toLowerCase().includes('it assistant') ||
            (customData?.personalInfo?.title || '').toLowerCase().includes('it assistant');

        if (isITRole) {
            // Clear other categories to avoid clutter (as requested: "hard code skills")
            inputData.skills.languages = [];
            inputData.skills.frontend = [];
            inputData.skills.backend = [];
            inputData.skills.devops = [];
            inputData.skills.tools = [];
            inputData.skills.databases = [];
            inputData.skills.cloud = [];
            inputData.skills.concepts = [];

            // Hardcoded skills from Hebatullah Experience + Job Description
            inputData.skills.it_support = [
                // From Hebatullah Experience
                'Windows Server',
                'Active Directory',
                'Network Administration',
                'Cybersecurity',
                'Microsoft 365',
                'Hardware Troubleshooting',
                'IT Support',

                // From Job Description / Standard IT Assistant
                'Office 365 Administration',
                'Remote Desktop Support',
                'Printer Management',
                'System Maintenance',
                'User Training',
                'Ticketing Systems'
            ];

            // Re-generate formats with these hardcoded skills
            const updatedFormats = generateAllFormats(inputData);
            formattedResume.html = updatedFormats.html;
            formattedResume.markdown = updatedFormats.markdown;
            formattedResume.plainText = updatedFormats.plainText;
        }

        // Analyze resume quality
        const analysis = analyzeResume(inputData, targetJobDescription);

        // Count bullets
        let bulletCount = 0;
        inputData.experience.forEach(exp => {
            bulletCount += (exp.responsibilities?.length || 0) + (exp.achievements?.length || 0);
        });

        // Count words in plain text
        const wordCount = formattedResume.plainText.split(/\s+/).length;

        // Build metadata
        const metadata: ResumeMetadata = {
            generatedAt: new Date().toISOString(),
            version: '2.0.0',
            targetRole: targetJobDescription ? 'Custom' : undefined,
            resumeLength: formattedResume.plainText.length > 3000 ? 2 : 1,
            wordCount,
            bulletCount,
        };

        // Build response based on requested format
        const output: ResumeOutput = {
            formattedResume: format === 'all'
                ? formattedResume
                : {
                    html: format === 'html' ? formattedResume.html : '',
                    markdown: format === 'markdown' ? formattedResume.markdown : '',
                    plainText: format === 'text' ? formattedResume.plainText : '',
                },
            qualityReport: analysis.qualityReport,
            keywordAnalysis: analysis.keywordAnalysis,
            suggestions: analysis.suggestions,
            atsReport: analysis.atsReport,
            metadata,
        };

        return NextResponse.json(output);

    } catch (error) {
        console.error('Resume generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate resume' },
            { status: 500 }
        );
    }
}

/**
 * GET handler for testing
 */
export async function GET() {
    return NextResponse.json({
        message: 'Resume Generation API',
        version: '2.0.0',
        endpoints: {
            POST: {
                description: 'Generate ATS-optimized resume',
                body: {
                    targetJobDescription: 'Optional: Job description for tailored resume',
                    format: 'html | markdown | text | all',
                    customData: 'Optional: Custom ResumeGenerationInput data',
                },
            },
        },
    });
}

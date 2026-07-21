import Resume from "@/components/Resume";
import { supabase } from "@/integrations/supabase/client";
import {
  PROFESSIONAL_SUMMARY,
  PROFESSIONAL_TITLE,
} from "@/data/professional-profile";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Person, WithContext } from "schema-dts";

interface PersonalInfoMock {
  id: string;
  full_name: string;
  title: string;
  email: string;
  summary: string;
  phone: string | null;
  location: string | null;
  about_text: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  twitter_url: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

// ISR: Revalidate every hour
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Résumé of Abdulrahman Ambooka Msah: software delivery, payment integrations, IT infrastructure, ERP implementation, and applied computer vision.",
};

export default async function ResumePage() {
  const [personalInfoResult, educationResult, experienceResult, skillsResult, projectsResult] =
    await Promise.all([
      supabase.from("personal_info").select("*").single(),
      supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false }),
      supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false }),
      supabase
        .from("skills")
        .select("*")
        .order("proficiency_level", { ascending: false }),
      supabase
        .from("projects")
        .select("id, title, description, stack, status")
        .eq("is_featured", true)
        .eq("status", "completed")
        .order("display_order", { ascending: true }),
    ]);

  const personalInfo = personalInfoResult.data;
  const skills = skillsResult.data || [];
  const initialData = {
    personal_info:
      personalInfo ||
      ({
        id: "mock",
        full_name: "Abdulrahman Ambooka Msah",
        title: PROFESSIONAL_TITLE,
        email: "abdulrahmanambooka@gmail.com",
        summary: PROFESSIONAL_SUMMARY,
        phone: null,
        location: "Nairobi, Kenya",
        about_text: null,
        linkedin_url: null,
        github_url: "https://github.com/ambooka",
        website_url: "https://ambooka.dev",
        twitter_url: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as PersonalInfoMock),
    education: educationResult.data || [],
    experience: experienceResult.data || [],
    skills: skills,
    projects: projectsResult.data || [],
  };

  // JSON-LD Person schema for SEO/LLM discoverability
  const personSchema: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo?.full_name || "Abdulrahman Ambooka Msah",
    jobTitle: PROFESSIONAL_TITLE,
    url: "https://ambooka.dev",
    sameAs: [
      "https://github.com/ambooka",
      "https://www.linkedin.com/in/abdulrahman-ambooka/",
      "https://twitter.com/ambooka",
    ],
    knowsAbout: skills.slice(0, 10).map((s) => s.name),
    worksFor: {
      "@type": "Organization",
      name: "Bayina Academy",
    },
  };

  return (
    <>
      <JsonLd schema={personSchema} />
      <Resume isActive={true} initialData={initialData} />
    </>
  );
}

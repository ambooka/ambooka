"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  GraduationCap,
  MapPin,
  Rocket,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  Download,
  Globe,
  BriefcaseBusiness,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  PROFESSIONAL_SUMMARY,
  PROFESSIONAL_TITLE,
} from "@/data/professional-profile";

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  icon_url: string | null;
  is_active?: boolean;
}

export interface PersonalInfo {
  full_name: string;
  title: string;
  avatar_url: string | null;
  about_text: string | null;
  email?: string;
  phone?: string;
  location?: string;
  social_links?: SocialLink[] | null;
}

export interface ProfileWidgetProps {
  personalInfo?: PersonalInfo | null;
  onOpenResume?: () => void;
}

const PROFILE_FACTS = [{ label: "Base", value: "Nairobi, Kenya" }];

const CURRENT_FOCUS = [
  "Software Engineering",
  "Backend Systems",
  "ERP & Infrastructure",
];

const EDUCATION = [
  {
    degree: "BSc Computer Science",
    school: "Maseno University",
    year: "2020 - 2024",
    logo: "/assets/badges/maseno-university.png",
  },
  {
    degree: "KCSE",
    school: "Starehe Boys' Centre",
    year: "2016 - 2019",
    logo: "/images/starehe-logo.png",
  },
];

const LANGUAGES = [
  { name: "English", flag: "🇬🇧" },
  { name: "Swahili", flag: "🇰🇪" },
];


export default function ProfileWidget({
  personalInfo,
  onOpenResume,
}: ProfileWidgetProps = {}) {
  const profile =
    personalInfo ||
    ({
      full_name: "Abdulrahman Ambooka Msah",
      title: PROFESSIONAL_TITLE,
      avatar_url: "/assets/images/my-avatar.jpg",
      about_text: PROFESSIONAL_SUMMARY,
      location: "Nairobi, Kenya",
      social_links: [],
    } as PersonalInfo);

  const [experiences, setExperiences] = useState<
    {
      company: string;
      position: string;
      start_date: string;
      end_date: string | null;
      is_current: boolean;
    }[]
  >([]);
  const displayTitle = profile.title || PROFESSIONAL_TITLE;

  useEffect(() => {
    const fetchExperience = async () => {
      const { data } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false })
        .limit(3);
      if (data) setExperiences(data);
    };
    fetchExperience();
  }, []);

  const socialLinks = (profile.social_links || []).filter(
    (link) => link.is_active !== false,
  );

  const renderSocialIcon = (social: SocialLink) => {
    const key = social.platform.toLowerCase();
    const commonProps = { size: 16, strokeWidth: 2 };
    switch (key) {
      case "github":
        return <Github {...commonProps} />;
      case "linkedin":
        return <Linkedin {...commonProps} />;
      case "twitter":
      case "x":
        return <Twitter {...commonProps} />;
      case "instagram":
        return <Instagram {...commonProps} />;
      case "youtube":
        return <Youtube {...commonProps} />;
      case "telegram":
      case "whatsapp":
        return <MessageCircle {...commonProps} />;
      default:
        if (social.icon_url) {
          return (
            <Image
              src={social.icon_url}
              alt={social.platform}
              width={16}
              height={16}
              className="object-contain"
              unoptimized
            />
          );
        }
        return <Globe {...commonProps} />;
    }
  };

  return (
    <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.8] p-4 shadow-md backdrop-blur-xl transition-all hover:border-[hsl(var(--border))] hover:shadow-lg sm:p-5">
      <div className="flex items-center gap-3 mb-3.5 text-xs font-extrabold tracking-widest uppercase text-[hsl(var(--foreground))]">
        <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[hsl(var(--accent))/0.12] text-[hsl(var(--accent))] shrink-0">
          <Rocket size={16} />
        </div>
        <span>Build Profile & Education</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 flex-col">
          <div className="flex min-w-0 items-start gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] overflow-hidden shrink-0 border border-[hsl(var(--border))] shadow-md bg-[hsl(var(--card))]">
              <Image
                src={profile.avatar_url || "/assets/images/my-avatar.jpg"}
                alt={profile.full_name || "Avatar"}
                width={64}
                height={64}
                className="w-full h-full object-cover object-[center_22%]"
                priority
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0 pt-0.5">
              <div className="flex min-w-0 flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[hsl(var(--accent))/0.1] text-[hsl(var(--accent))] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  Computer Science Graduate
                </span>
              </div>
              <h3 className="m-0 text-[1.1rem] sm:text-xl font-extrabold leading-tight tracking-tight text-[hsl(var(--foreground))] truncate">
                {profile.full_name || "Abdulrahman Ambooka Msah"}
              </h3>
              <div className="text-[0.78rem] sm:text-[0.85rem] text-[hsl(var(--muted-foreground))] font-medium mt-0.5 truncate">
                {displayTitle}
              </div>
            </div>
          </div>

          <p className="m-0 text-[0.84rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
            {profile.about_text || PROFESSIONAL_SUMMARY}
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {onOpenResume && (
              <button
                onClick={onOpenResume}
                className="inline-flex min-h-10 items-center gap-1.5 px-3 rounded-[8px] bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.9)] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Download size={14} /> Resume
              </button>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-10 items-center gap-1.5 px-3 rounded-[8px] bg-[hsl(var(--accent))/0.1] hover:bg-[hsl(var(--accent))/0.18] text-[hsl(var(--accent))] border border-[hsl(var(--accent))/0.2] text-xs font-bold transition-colors"
              >
                <Mail size={14} /> Email Me
              </a>
            )}
            {socialLinks.slice(0, 4).map((social, i) => (
              <a
                key={social.id || i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-[8px] border border-[hsl(var(--border))] bg-white/40 dark:bg-black/20 text-[hsl(var(--muted-foreground))] shadow-sm hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--muted-foreground))/0.5] transition-all"
                title={social.platform}
              >
                {renderSocialIcon(social)}
              </a>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {PROFILE_FACTS.map((fact) => (
              <span
                key={fact.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] text-xs font-semibold shadow-sm"
              >
                {fact.label === "Base" && <MapPin size={14} />}
                <strong className="text-[hsl(var(--foreground))] mr-0.5">
                  {fact.label}:
                </strong>{" "}
                {fact.value}
              </span>
            ))}
            {LANGUAGES.map((lang) => (
              <span
                key={lang.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] text-xs font-semibold shadow-sm transition-colors hover:bg-[hsl(var(--accent))/0.1] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))/0.2] cursor-default"
              >
                  <span className="text-sm leading-none drop-shadow-sm">
                    {lang.flag}
                  </span>
                  <span className="text-[hsl(var(--foreground))]">
                    {lang.name}
                  </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid min-w-0 gap-4 border-t border-[hsl(var(--border))] pt-4 sm:grid-cols-2">
          <aside className="flex min-w-0 flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 ml-1">
              <GraduationCap size={14} /> Education
            </span>
            <div className="flex flex-col gap-1.5">
              {EDUCATION.map((item) => (
                <div
                  key={item.school}
                  className="flex min-w-0 items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-white/40 p-2 shadow-sm transition-colors hover:bg-white/60 dark:bg-black/20 dark:hover:bg-black/40"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[hsl(var(--border))] bg-white p-1 dark:bg-white/5">
                    <Image
                      src={item.logo}
                      alt=""
                      width={24}
                      height={24}
                      className="w-full h-full object-contain drop-shadow-sm"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <strong className="truncate text-xs font-extrabold leading-tight text-[hsl(var(--foreground))]">
                      {item.degree}
                    </strong>
                    <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
                      <span className="truncate">
                        {item.school}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="shrink-0">{item.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {experiences.length > 0 && (
            <aside className="flex min-w-0 flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 ml-1">
                <BriefcaseBusiness size={14} /> Work Experience
              </span>
            <div className="flex min-w-0 flex-col gap-1.5">
                {experiences.map((exp) => {
                  const startYear = new Date(exp.start_date).getFullYear();
                  const endYear = exp.is_current
                    ? "Present"
                    : exp.end_date
                      ? new Date(exp.end_date).getFullYear()
                      : "";

                  return (
                    <div
                      key={exp.company + exp.position}
                      className="group flex min-w-0 items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-white/40 p-2 shadow-sm transition-colors hover:border-[hsl(var(--accent))/0.35] dark:bg-black/20"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-xs font-black text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                        {exp.company.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <span className="truncate text-xs font-bold leading-tight text-[hsl(var(--foreground))]">
                          {exp.position}
                        </span>
                        <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                          <span className="truncate text-[hsl(var(--accent))]">
                            {exp.company}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="shrink-0">
                            {startYear}–{endYear}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          <aside className="flex min-w-0 flex-col gap-2 sm:col-span-2">
            <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              Current Focus
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CURRENT_FOCUS.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-slate-900/5 px-2.5 py-1.5 text-[11px] font-semibold text-[hsl(var(--muted-foreground))] dark:bg-white/5"
                >
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

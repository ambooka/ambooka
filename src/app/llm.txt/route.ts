import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";
import {
  PROFESSIONAL_SCOPE,
  PROFESSIONAL_TITLE,
} from "@/data/professional-profile";

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function GET() {
  // Fetch dynamic content from Supabase
  const [personalInfoResult, blogPostsResult, skillsResult] = await Promise.all(
    [
      supabase
        .from("personal_info")
        .select("full_name, title, summary")
        .single(),
      supabase
        .from("blog_posts")
        .select("title, slug")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(5),
      supabase
        .from("skills")
        .select("name, category")
        .order("proficiency_level", { ascending: false })
        .limit(15),
    ],
  );

  const personalInfo = personalInfoResult.data;
  const blogPosts = blogPostsResult.data || [];
  const skills = skillsResult.data || [];
  const title = PROFESSIONAL_TITLE;

  // Group skills by category
  const skillsByCategory: Record<string, string[]> = {};
  skills.forEach((skill) => {
    const cat = skill.category || "Other";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(skill.name);
  });

  const skillsSection = Object.entries(skillsByCategory)
    .map(
      ([category, skillNames]) => `- **${category}**: ${skillNames.join(", ")}`,
    )
    .join("\n");

  const blogSection =
    blogPosts.length > 0
      ? blogPosts
          .map(
            (post) =>
              `- [${post.title}](https://ambooka.dev/blog/${post.slug})`,
          )
          .join("\n")
      : "*(No published posts yet)*";

  const content = `
# ${personalInfo?.full_name || "Abdulrahman Ambooka Msah"} - ${title}

## Identity & Core Focus
${personalInfo?.summary || PROFESSIONAL_SCOPE}

- **Role**: ${title}
- **Location**: Nairobi, Kenya
- **Website**: https://ambooka.dev
- **GitHub**: https://github.com/ambooka
- **LinkedIn**: https://www.linkedin.com/in/abdulrahman-ambooka/

## Technical Expertise

${
  skillsSection ||
  `
- **Languages**: Python, TypeScript, JavaScript, SQL, Bash.
- **Frontend**: React, Next.js, Tailwind CSS.
- **Backend**: FastAPI, Node.js, PostgreSQL, Redis, Supabase.
    - **Infrastructure**: Docker, Linux, Nginx, GitHub Actions, Windows Server, Active Directory, TCP/IP networking.
`
}

## Recent Blog Posts

${blogSection}

## Professional Focus
- **Focus**: Backend and full-stack software, payment integrations, ERP implementation, and IT infrastructure.
- **Production Base**: TypeScript, Python, Node.js, PostgreSQL, Redis, Docker, Linux, Nginx, and GitHub Actions.
- **Evidence Policy**: Portfolio claims are limited to completed, résumé-backed work and public project evidence.

## Contact
- **Email**: abdulrahmanambooka@gmail.com
- **Twitter**: @ambooka

## Hiring & Collaboration
- **Keywords**: Hire Software Engineer Kenya, Backend Developer Nairobi, Full-Stack Engineer, IT Systems Administrator, Payment Integration Developer.

---
*This file is auto-generated from the Ambooka.dev database. Last updated: ${new Date().toISOString()}*
`.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}

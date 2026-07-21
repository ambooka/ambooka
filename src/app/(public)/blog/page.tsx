import Blog from "@/components/Blog";
import { supabase } from "@/integrations/supabase/client";
import { Metadata } from "next";

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { data: latestPost } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const title = "Blog";
  const description = latestPost
    ? `Latest note: ${latestPost.title}. ${latestPost.excerpt || "Read practical engineering notes on software systems and platform/MLOps engineering."}`
    : "Practical engineering notes on software systems, business automation, infrastructure, and platform/MLOps engineering by Msah Ambooka.";

  return {
    title,
    description,
    keywords: [
      "Software Engineering Blog",
      "Platform & MLOps",
      "Business Systems",
      "Payment Integrations",
      "Full Stack Engineering",
      "Nairobi Software Engineer",
    ],
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: "Blog | Msah Ambooka",
      description,
      type: "website",
      url: "https://ambooka.dev/blog",
      images: [{ url: "/og-image.png", alt: "Msah Ambooka Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Msah Ambooka",
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function BlogListPage() {
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return <Blog isActive={true} initialPosts={blogPosts || []} />;
}

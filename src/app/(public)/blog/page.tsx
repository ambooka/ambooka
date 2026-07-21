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
    ? `Latest note: ${latestPost.title}. ${latestPost.excerpt || "Read practical notes on software, backend APIs, payments, infrastructure, and computer vision."}`
    : "Practical engineering notes on software delivery, payment integrations, ERP systems, IT infrastructure, and computer vision by Abdulrahman Ambooka Msah.";

  return {
    title,
    description,
    keywords: [
      "Software Engineering Blog",
      "Backend Engineering",
      "IT Infrastructure",
      "ERP Implementation",
      "Payment Integrations",
      "Computer Vision",
      "Nairobi Software Engineer",
    ],
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: "Blog | Abdulrahman Ambooka Msah",
      description,
      type: "website",
      url: "https://ambooka.dev/blog",
      images: [{ url: "/og-image.png", alt: "Abdulrahman Ambooka Msah Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Abdulrahman Ambooka Msah",
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

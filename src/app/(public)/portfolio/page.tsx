import Portfolio from "@/components/Portfolio";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ItemList, WithContext } from "schema-dts";
import { projects as proofProjects } from "@/data/professional-projects";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Completed software, payment-integration, ERP, infrastructure, and computer-vision projects by Abdulrahman Ambooka Msah.",
  openGraph: {
    title: "Portfolio | Abdulrahman Ambooka Msah",
    description:
      "Recruiter-focused evidence from completed software, backend, business-systems, and infrastructure work.",
    images: ["/og-image.png"],
  },
};

export default function PortfolioPage() {
  const featuredProjects = proofProjects
    .filter((project) => project.featured && project.status === "completed")
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featuredProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.oneLine,
        url: `https://ambooka.dev${project.proof.caseStudy || "/portfolio"}`,
      },
    })),
  } as unknown as WithContext<ItemList>;

  return (
    <>
      <JsonLd schema={itemListSchema} />
      <Portfolio
        isActive
        initialProjects={[]}
        featuredProjects={featuredProjects}
      />
    </>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./widgets.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import { JsonLd } from "@/components/seo/JsonLd";
import { Person, WithContext } from "schema-dts";

const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Abdulrahman Ambooka",
  "url": "https://ambooka.dev",
  "image": "https://ambooka.dev/og-image.png",
  "sameAs": [
    "https://github.com/ambooka",
    "https://www.linkedin.com/in/abdulrahman-ambooka/",
    "https://twitter.com/ambooka"
  ],
  "jobTitle": "MLOps Architect & Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance / Open to Work"
  },
  "description": "Full-stack software engineer and MLOps Architect building scalable AI platforms and cloud-native solutions.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nairobi",
    "addressCountry": "Kenya"
  },
  "knowsAbout": ["Machine Learning", "MLOps", "Software Engineering", "Cloud Computing", "Kubernetes", "React", "Python"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e1e1f" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e1e1f" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.github.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased no-scrollbar-buttons`}
      >
        <JsonLd schema={personSchema} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

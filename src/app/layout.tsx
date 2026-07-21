import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
import {
  PROFESSIONAL_SUMMARY,
  PROFESSIONAL_TITLE,
} from "@/data/professional-profile";

const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdulrahman Ambooka Msah",
  url: "https://ambooka.dev",
  image: "https://ambooka.dev/og-image.png",
  sameAs: [
    "https://github.com/ambooka",
    "https://www.linkedin.com/in/abdulrahman-ambooka/",
    "https://twitter.com/ambooka",
  ],
  jobTitle: PROFESSIONAL_TITLE,
  worksFor: {
    "@type": "Organization",
    name: "Bayina Academy",
  },
  description: PROFESSIONAL_SUMMARY,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "Kenya",
  },
  knowsAbout: [
    "Software Engineering",
    "Backend Engineering",
    "Payment Integrations",
    "ERPNext",
    "Windows Server",
    "Active Directory",
    "IT Infrastructure",
    "Computer Vision",
    "Python",
    "TypeScript",
    "React",
    "PostgreSQL",
  ],
};

export const metadata: Metadata = {
  title: {
    default: `Abdulrahman Ambooka Msah | ${PROFESSIONAL_TITLE}`,
    template: "%s | Abdulrahman Ambooka Msah",
  },
  description: PROFESSIONAL_SUMMARY,
  keywords: [
    "Abdulrahman Ambooka Msah",
    "Ambooka",
    "Abdulrahman",
    "Software Engineer",
    "Backend Developer",
    "Full-Stack Engineer",
    "IT Systems Administrator",
    "Infrastructure Engineer",
    "Payment Integrations",
    "M-Pesa Daraja API",
    "ERPNext Implementation",
    "Windows Server",
    "Active Directory",
    "IT Infrastructure",
    "Computer Vision",
    "Python",
    "TypeScript",
    "React",
    "Next.js",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "Nairobi",
    "Kenya",
  ],
  authors: [{ name: "Abdulrahman Ambooka Msah", url: "https://github.com/ambooka" }],
  creator: "Abdulrahman Ambooka Msah",
  metadataBase: new URL("https://ambooka.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ambooka.dev",
    title: `Abdulrahman Ambooka Msah | ${PROFESSIONAL_TITLE}`,
    description: PROFESSIONAL_SUMMARY,
    siteName: "Abdulrahman Ambooka Msah Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abdulrahman Ambooka Msah - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Abdulrahman Ambooka Msah | ${PROFESSIONAL_TITLE}`,
    description: PROFESSIONAL_SUMMARY,
    creator: "@ambooka",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta
          name="theme-color"
          content="#1e1e1f"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1e1e1f"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://api.github.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased no-scrollbar-buttons`}
      >
        <JsonLd schema={personSchema} />
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[hsl(var(--accent))] focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

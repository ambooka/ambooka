import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Abdulrahman Ambooka | AI & Software Engineer",
    template: "%s | Abdulrahman Ambooka"
  },
  description: "Full-stack software engineer specializing in AI/MLOps, cloud-native development, and scalable applications. Expertise in Python, .NET Core, TypeScript, Flutter, and Azure cloud services.",
  keywords: [
    "Abdulrahman Ambooka",
    "Software Engineer",
    "AI Engineer",
    "MLOps",
    "Full Stack Developer",
    "Cloud Native",
    "Azure",
    "Python",
    ".NET Core",
    "TypeScript",
    "React",
    "Flutter",
    "Machine Learning",
    "Nairobi Developer",
    "Kenya Tech"
  ],
  authors: [{ name: "Abdulrahman Ambooka", url: "https://github.com/ambooka" }],
  creator: "Abdulrahman Ambooka",
  metadataBase: new URL('https://ambooka.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ambooka.dev',
    title: 'Abdulrahman Ambooka | AI & Software Engineer',
    description: 'Full-stack software engineer specializing in AI/MLOps, cloud-native development, and scalable applications. Expertise in Python, .NET Core, TypeScript, Flutter, and Azure.',
    siteName: 'Abdulrahman Ambooka Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Abdulrahman Ambooka - AI & Software Engineer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdulrahman Ambooka | AI & Software Engineer',
    description: 'Full-stack software engineer specializing in AI/MLOps, cloud-native development, and scalable applications.',
    creator: '@ambooka',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
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
        <meta name="theme-color" content="#4299e1" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#2d3748" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.github.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased no-scrollbar-buttons`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

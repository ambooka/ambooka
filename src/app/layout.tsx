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

const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Msah Ambooka",
  "url": "https://ambooka.dev",
  "image": "https://ambooka.dev/og-image.png",
  "sameAs": [
    "https://github.com/ambooka",
    "https://www.linkedin.com/in/abdulrahman-ambooka/",
    "https://twitter.com/ambooka"
  ],
  "jobTitle": "Software Engineer | Full-Stack Developer | IT Systems | AI/ML Engineering",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance / Open to Work"
  },
  "description": "Computer Science graduate with hands-on experience across full-stack software, IT systems, ERP implementation, payment integrations, and applied AI/ML.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nairobi",
    "addressCountry": "Kenya"
  },
  "knowsAbout": ["Software Engineering", "Full-Stack Development", "IT Systems", "ERPNext", "Payment Integrations", "Computer Vision", "Python", "TypeScript", "React", "PostgreSQL"]
};

export const metadata: Metadata = {
  title: {
    default: "Msah Ambooka | Software Engineer & Full-Stack Developer",
    template: "%s | Msah Ambooka"
  },
  description: "Computer Science graduate with hands-on experience across full-stack software, IT infrastructure, ERP implementation, payment integrations, and applied AI/ML.",
  keywords: [
    // --- IDENTITY ---
    "Msah Ambooka", "Ambooka", "Abdulrahman",
    "Software Engineer", "Full Stack Developer", "Backend Engineer", "Frontend Developer",
    "AI/ML Engineering", "IT Systems", "ERP Implementation", "Backend Engineer",
    "DevOps Engineer", "Data Engineer",
    "Tech Lead", "Senior Developer", "Freelance Developer", "Remote Engineer",

    // --- AI & MLOPS STACK ---
    "Machine Learning", "Artificial Intelligence", "Deep Learning", "Generative AI",
    "LLMs", "Large Language Models", "RAG", "Retrieval Augmented Generation",
    "Computer Vision", "NLP", "Natural Language Processing", "Transformers",
    "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "Pandas", "NumPy",
    "MLflow", "Kubeflow", "TFX", "Weights & Biases", "DVC", "Feature Store",
    "Model Serving", "Model Monitoring", "Model Registry", "Prompt Engineering",
    "LangChain", "LlamaIndex", "HuggingFace", "OpenAI API", "Anthropic", "Mistral",
    "Vector Databases", "Pinecone", "Milvus", "ChromaDB", "Weaviate", "Qdrant",

    // --- CLOUD & INFRASTRUCTURE ---
    "Cloud Native", "Kubernetes", "K8s", "Docker", "Containerization", "Microservices",
    "AWS", "Amazon Web Services", "EC2", "S3", "Lambda", "EKS", "SageMaker",
    "Azure", "Microsoft Azure", "AKS", "Azure ML", "GCP", "Google Cloud Platform", "GKE",
    "Terraform", "Infrastructure as Code", "IaC", "Ansible", "Pulumi",
    "CI/CD", "GitHub Actions", "GitLab CI", "Jenkins", "ArgoCD", "Flux",
    "Linux", "Bash", "Shell Scripting", "Git", "Version Control", "Networking",

    // --- WEB & APP DEVELOPMENT ---
    "React", "React.js", "Next.js", "Vue.js", "Angular", "Svelte",
    "TypeScript", "JavaScript", "ES6+", "HTML5", "CSS3", "Tailwind CSS",
    "Node.js", "Express.js", "NestJS", "FastAPI", "Flask", "Django",
    "Python", "Golang", "Go", "C#", ".NET", ".NET Core", "Java", "Spring Boot",
    "Flutter", "Dart", "Mobile App Development", "Cross-platform Development",
    "GraphQL", "REST API", "gRPC", "WebSockets", "Serverless",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Supabase", "Firebase",

    // --- KENYA & AFRICA CONTEXT ---
    "Nairobi Tech", "Silicon Savannah", "Kenya Tech Ecosystem",
    "Software Jobs Kenya", "Tech Jobs Nairobi", "Developer Jobs Kenya",
    "Best Software Engineers Kenya", "Top Developers Nairobi",
    "Web Design Kenya", "Mobile App Developers Kenya",
    "Remote Jobs Africa", "African Tech Talent", "Andela",
    "Nairobi", "Mombasa", "Kisumu", "Eldoret", "Kenya", "East Africa",

    // --- INTENT & HIRING ---
    "Hire AI Engineer", "Hire MLOps Engineer", "Hire Full Stack Developer",
    "Remote MLOps Jobs", "Remote AI Jobs", "Freelance Software Engineer",
    "Contract Developer", "Consultant", "Technical Co-founder",
    "Build AI App", "Deploy ML Models", "Scale Web Apps", "MVP Development"
  ],
  authors: [{ name: "Msah Ambooka", url: "https://github.com/ambooka" }],
  creator: "Msah Ambooka",
  metadataBase: new URL('https://ambooka.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ambooka.dev',
    title: 'Msah Ambooka | Software Engineer & Full-Stack Developer',
    description: 'Computer Science graduate building full-stack software, IT systems, business automation, and applied AI/ML solutions.',
    siteName: 'Msah Ambooka Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Msah Ambooka - Software Engineer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Msah Ambooka | Software Engineer & Full-Stack Developer',
    description: 'Building full-stack software, IT systems, business automation, and applied AI/ML solutions.',
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
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
        <meta name="theme-color" content="#1e1e1f" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e1e1f" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
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

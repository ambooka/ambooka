# Abdulrahman Ambooka - Portfolio Website

> A modern, professional portfolio website showcasing my work as an AI & Software Engineer

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- ✨ **Modern UI/UX** - Clean, professional design with smooth animations and transitions
- 🎨 **Multi-Theme Support** - Dark mode, light mode, and custom themes
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- 🚀 **Performance Optimized** - Fast loading times with Next.js optimizations
- ♿ **Accessible** - WCAG AA compliant with proper ARIA labels and keyboard navigation
- 🔍 **SEO Optimized** - Comprehensive meta tags, Open Graph, and structured data
- 🤖 **AI Assistant** - Interactive AI chatbot for visitor engagement
- 📊 **GitHub Integration** - Automatically displays projects from GitHub
- 📄 **Resume Management** - Dynamic resume with PDF download functionality
- 💾 **Supabase Backend** - Scalable backend for data management

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5 with React 19
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0 + Custom CSS
- **UI Components:** Radix UI, Framer Motion, Lucide Icons
- **State Management:** React Hooks

### Backend & Services
- **Database:** Supabase (PostgreSQL)
- **API Integration:** GitHub REST API, Octokit
- **Authentication:** Supabase Auth

### Development Tools
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Build Tool:** Turbopack

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- pnpm (recommended) or npm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ambooka/ambooka.git
   cd ambooka
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # GitHub Integration (Optional)
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://ambooka.dev
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Build & Deployment

### Local Production Build
```bash
pnpm build
pnpm start
```

### Deploy to Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ambooka/ambooka)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Other Deployment Options
- **Netlify:** Compatible with static export
- **AWS:** Deploy to S3 + CloudFront or Amplify
- **Azure:** App Service or Static Web Apps
- **Docker:** Dockerfile included for containerized deployment

## 📁 Project Structure

```
ambooka/
├── public/              # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.json
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── layout.tsx  # Root layout with metadata
│   │   ├── page.tsx    # Home page
│   │   └── globals.css # Global styles
│   ├── components/     # React components
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Resume.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── UtilityBar.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── ScrollToTop.tsx
│   ├── services/       # API services
│   │   └── github.ts
│   ├── lib/           # Utilities
│   │   └── seo.ts
│   └── integrations/  # Third-party integrations
│       └── supabase/
├── .env.local         # Environment variables (create this)
├── next.config.ts     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Dependencies and scripts
```

## 🎯 Key Components

### About
Professional introduction with skills, experience, and testimonials

### Portfolio
Dynamically fetched GitHub projects with filtering and search

### Resume
Interactive resume with timeline view and PDF download

### Blog
Blog posts section (configurable with CMS integration)

### Contact
Contact form with validation and email integration

### Utility Bar
Fixed utility bar with theme toggle, AI assistant, and quick actions

## 🔧 Configuration

### Customization

1. **Personal Information**
   - Update metadata in `src/app/layout.tsx`
   - Modify content in component files

2. **Themes**
   - Edit CSS variables in `src/app/globals.css`
   - Add new themes in the theme configuration

3. **GitHub Integration**
   - Set `NEXT_PUBLIC_GITHUB_TOKEN` for private repos
   - Configure in `src/app/page.tsx`

4. **SEO**
   - Update Open Graph images in `/public`
   - Modify sitemap.xml for additional pages

## 📊 Performance

- ✅ Lighthouse Performance Score: 95+
- ✅ Lighthouse Accessibility Score: 95+
- ✅ Lighthouse Best Practices: 95+
- ✅ Lighthouse SEO Score: 100

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Abdulrahman Ambooka**

- Website: [ambooka.dev](https://ambooka.dev)
- GitHub: [@ambooka](https://github.com/ambooka)
- LinkedIn: [@abdulrahman-ambooka](https://www.linkedin.com/in/abdulrahman-ambooka/)
- Email: abdulrahmanambooka@gmail.com

## 🙏 Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev/)
- UI Components by [Radix UI](https://www.radix-ui.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Backend by [Supabase](https://supabase.com/)

---

<div align="center">
Made with ❤️ by Abdulrahman Ambooka
</div>

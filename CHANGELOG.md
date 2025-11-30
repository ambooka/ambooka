# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Supabase keep-alive system to prevent project pausing
  - API endpoint at `/api/keep-alive`
  - GitHub Actions workflow for automated pinging
  - Alternative external cron service options documented

## [1.1.0] - 2025-11-28

### Added
- Professional SEO metadata with Open Graph and Twitter Cards
- JSON-LD structured data for Person schema
- Comprehensive robots.txt and sitemap.xml
- PWA manifest.json for app-like experience
- ErrorBoundary component for graceful error handling
- SkeletonLoader components for improved loading states
- ScrollToTop button for better navigation UX
- SEO utility library (`lib/seo.ts`)
- Professional README with complete setup instructions
- Proper TypeScript types (PageId, Theme)

### Changed
- Updated page title from generic to "Abdulrahman Ambooka | AI & Software Engineer"
- Enhanced viewport configuration for better mobile display
- Improved component type safety across Navbar and UtilityBar

### Fixed
- TypeScript compilation errors in component props
- Duplicate Button.tsx file (casing conflict)
- Console.log debug statements removed from production code

### Removed
- Generic "Create Next App" branding
- Duplicate `src/components/ui/Button.tsx` file

## [1.0.0] - 2025-11-XX

### Added
- Initial portfolio website with Next.js 15.5
- About, Resume, Portfolio, Blog, and Contact sections
- GitHub integration for automatic project display
- Supabase backend integration
- AI Assistant chatbot
- Theme toggle (Dark/Light modes)
- Responsive mobile design
- Dynamic resume with PDF download

[Unreleased]: https://github.com/ambooka/ambooka/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ambooka/ambooka/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ambooka/ambooka/releases/tag/v1.0.0

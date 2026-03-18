# ambooka.dev Design System

## Core Principles
1. **8-Point Grid System**: All spacing (margins, padding, gaps) strictly follows an 8-pt scale (`2px, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px`).
2. **60-30-10 Color Rule**: 
   - 60% Surface colors (neutral/tinted blacks and whites)
   - 30% Secondary branding (Teal / Cyan)
   - 10% Accent elements (Violet)
3. **WCAG AA Compliance**: All text and background combinations must pass the 4.5:1 contrast ratio for both light and dark modes.

## Typography
- **Font Stack**: Headings (`Geist Sans`), Code (`Geist Mono`).
- **Scale**: Headings only use `clamp()` for fluid typography down to mobile. Standard text sizes (`text-sm, text-base, text-lg, text-xl`).
- **Weights**: Regular (400) for body, Semibold (600) for active UI elements and headings.

## Color Palette (Theme Tokens)
Colors are represented internally as HSL channels to support alpha compositing (`bg-[hsl(var(--background))/50]`).

### Light Theme
- `--background`: `hsl(160 18% 93%)` 
- `--foreground`: `hsl(195 37% 19%)`
- `--accent`: `hsl(168 76% 40%)` (Brand Teal)
- `--secondary`: `hsl(263 70% 52%)` (Brand Violet)

### Dark Theme (`[data-theme="premium-dark"]`)
- `--background`: `hsl(195 37% 10%)`
- `--foreground`: `hsl(168 22% 93%)`
- `--accent`: `hsl(168 76% 40%)`
- `--secondary`: `hsl(263 70% 52%)`

## Border Radius
- `--radius-sm`: `6px` (badges, small inputs)
- `--radius-md`: `10px` (buttons, small cards)
- `--radius-lg`: `16px` (standard cards, modals)
- `--radius-xl`: `24px` (large structural panels)
- `--radius-full`: `9999px` (avatars, rounded buttons)

## Components (`/src/components/ui/`)
This project leverages `shadcn/ui` configured with the "New York" style.
- **Button**: Custom CVAs built with the brand gradients. Use `variant="default"` for standard actions.
- **Input / Textarea**: Standardized forms using `react-hook-form` and `zod`. Error handling via `role="alert"`.
- **Modals**: Extracted into composite widgets (e.g., `AiChatPanel.tsx`, `ResumeBuilderPanel.tsx`) using Radix dialog paradigms.

## Adding New Components
1. Use `npx shadcn@latest add <component>` to scaffold new components.
2. Edit the component to align with the core variables (verify `border-[hsl(var(--border))]`).
3. If extracting composite data-aware components, place them in `src/components/widgets/`.

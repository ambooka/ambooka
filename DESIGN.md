---
name: Ambooka Portfolio
description: The implemented cream, olive and bronze public portfolio system.
colors:
  primary: "hsl(98 17% 34%)"
  accent: "hsl(27 42% 54%)"
  secondary: "hsl(35 33% 77%)"
  background: "hsl(40 28% 95%)"
  foreground: "hsl(92 10% 14%)"
  card: "hsl(40 24% 97%)"
  muted: "hsl(42 24% 90%)"
  muted-foreground: "hsl(92 10% 28%)"
  border: "hsl(42 22% 82%)"
  input: "hsl(42 22% 85%)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    lineHeight: 1.6
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
rounded:
  sm: "6px"
  md: "10px"
  preview: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  '2': "0.5rem"
  '4': "1rem"
  '6': "1.5rem"
  '8': "2rem"
  '12': "3rem"
components:
  showcase-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  showcase-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  input:
    backgroundColor: "transparent"
    padding: "8px 12px"
    height: "40px"
  featured-preview:
    rounded: "{rounded.preview}"
    backgroundColor: "white"
  supporting-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Ambooka Portfolio

## Overview

**Creative North Star: "Inspectable work in the incumbent portfolio"**

The public portfolio retains its established warm cream surfaces, olive actions, bronze accents and Geist typography. Rounded panels and translucent navigation frame the work with a personal, approachable identity. This documents the incumbent system and its approved extension; it does not introduce a replacement visual world.

The homepage preserves its original gradient-heading banner and dashboard row: Build Profile & Education on the left and Featured projects on the right, replacing the article panel. Independent Sufrone work appears in the profile experience list. Rounded cards, tinted backgrounds, shadows and animated reveals remain part of that dashboard. The standalone Education showcase on Work and the Education case study uses the same palette in a flatter, image-led presentation with dividers and compact sentence-case actions.

**Key Characteristics:**

- Warm cream, olive and bronze with theme-aware semantic colors.
- Geist hierarchy, the incumbent gradient banner heading and scoped project typography.
- Restored homepage dashboard panels; flatter screenshot-led Work and case-study showcase.
- Real work imagery with explicit captions and responsive ordering.

## Colors

The primary palette combines warm neutral surfaces with earthy olive and bronze; the frontmatter records representative light-theme values in the source's HSL format.

### Primary

- **Olive** (`primary`): filled actions, focus rings and positive semantic emphasis.

### Secondary

- **Bronze** (`accent`): navigation emphasis, selected text, small highlights and decorative accents.
- **Warm sand** (`secondary`): supporting tints and gradient endpoints.

### Neutral

- **Cream** (`background`) and **light cream** (`card`): page and panel surfaces.
- **Deep olive charcoal** (`foreground`): headings and primary text.
- **Muted cream** (`muted`) and **muted olive text** (`muted-foreground`): secondary surfaces and explanatory copy.
- **Warm boundary** (`border`, `input`): subtle panel edges and field strokes.

Light and dark themes use HSL channel custom properties in `src/app/globals.css`; components wrap them with `hsl(var(--…))`. Dark mode changes background, foreground, card, muted, border and input variables while retaining the core olive/bronze accents. The frontmatter is a representative light-theme extraction, not a replacement for those runtime selectors. Body gradients, legacy compatibility aliases and some teal/cyan decorative details also remain in source; outdated teal/violet comments are not the palette authority.

**The Semantic Theme Rule.** Use the source's semantic variables for theme-aware surfaces and text rather than hard-coding the light-theme extraction.

## Typography

**Display and Body Font:** Geist, with UI sans-serif and system fallbacks.

**Mono Font:** Geist Mono, with UI monospace fallback, used for code-oriented content.

Headings are compact, with negative tracking on the largest levels. Shared global headings use semibold weight; supporting widgets often apply bold or extra-bold utility overrides. This is the implemented hierarchy, not a strict two-weight system.

- **Display:** the global heading role in the frontmatter; route-level utilities can override it.
- **Headline:** the global second-level heading role.
- **Title:** global third-level headings use `clamp(1.375rem, 2.75vw, 1.75rem)`, weight 600 and line height 1.4.
- **Body:** the base line height is 1.6; reading and project copy use longer leading where appropriate.
- **Labels:** shared buttons use 0.875rem and weight 500; desktop navigation uses 0.8rem and weight 600. Small supporting labels vary by component.

The restored homepage banner uses extra-bold Geist at 1.75rem on phone, 1.875rem from 640px and 2.25rem from 1024px, with tight tracking and a bronze-to-sand gradient clipped to the heading text. Preserve this user-pinned treatment. Featured projects uses a 1.5rem, weight-700 panel heading, reduced to 1.3rem at 640px and below; the featured project title is 1.25rem with line height 1.3. The old compact-introduction CSS remains in source but is unused on the homepage and is not an active typography role here.

On Work and the Education case study, the Education heading uses `clamp(1.7rem, 3vw, 2.6rem)` with line height 1.1; its explanatory copy is 0.94rem with line height 1.75 and a 62ch measure. These measurements belong to the showcase, not to every screen. The separately loaded Playfair stylesheet is not the public shell's body or showcase font.

## Layout

The public shell centers content within 1440px. Horizontal page padding grows from 12px to 16px, 24px and 32px across the responsive utilities. The sticky header has its own 1560px maximum width. Main content reserves `calc(5rem + env(safe-area-inset-bottom))` below phone content; desktop uses 48px bottom padding.

The source spacing scale includes 2px, 4px and 12px steps as well as the representative 8/16/24/32/48px values above. Its comment calls this an eight-point grid, but the implementation also uses intermediate and component-specific measurements.

The standalone Education showcase on Work and the Education case study uses a two-column comparison with 0.9fr/1.1fr proportions, a 40px gap and a divider below. At 800px and below it becomes one column with a 16px gap: title and status precede the screenshot figure, then the remaining project explanation and actions. The parent and staff screenshots overlap the desktop ERP image; the overlap decreases on phone.

The homepage starts with the restored banner, then its original top dashboard row. At 1024px and above, Build Profile & Education is left and Featured projects is right in equal columns with a 16px gap and stretched panel heights. Below 1024px, the profile comes first and Featured projects follows. The engineering bento, What I Build, opportunity actions and GitHub content follow this row. Sufrone solo development is represented within the profile experience list, alongside employed roles; there is no standalone homepage Education/practice sequence. Keep this route composition in `.impeccable/surfaces/src-app-public-page-tsx.md`, rather than making it a universal route rule.

The Featured projects panel uses 24px padding, reducing to 20px at 640px and below. Its ERP image has a 2.2 aspect ratio with top-aligned cover cropping. A single Education preview leads into contribution and status copy, case-study/demo actions, then Hebatullah and M-Pesa supporting rows separated by rules.

## Elevation & Depth

The incumbent system combines tonal layering, borders, translucent cream surfaces, blur and soft shadows. Shared panels use small or medium shadows; desktop navigation has a raised active pill. Mobile navigation has a stronger floating shadow. The homepage banner and profile use medium elevation; Featured projects uses a small shadow on a translucent cream panel. The standalone Education text section on Work/case study is flat and divided by a rule; its phone screenshots receive a soft image shadow.

Representative shadows are preserved in the sidecar: shared small/medium elevation, mobile navigation and screenshot depth. Global mesh, grid and body gradients remain implemented. Motion includes page/scroll reveals, short hover transitions and spring navigation indicators; the showcase actions only darken with a brightness filter on hover. CSS reduced-motion rules shorten animation/transition duration, while JavaScript motion behavior remains owned by the motion components.

## Shapes

Shared named radii range from gently rounded controls to broad panels and full pills. Tailwind utilities also use intermediate radii: shared buttons and inputs use an 8px `rounded-lg`, and shared Card uses a 12px `rounded-xl`; these do not equal the named `--radius-lg` and `--radius-xl` values extracted above. Preserve the distinction rather than mechanically substituting named tokens.

Showcase actions use 10px corners, status uses 6px, ERP imagery uses 12px and phone images use 14px. The scoped `preview` radius records the implemented 12px image crop; it is not a new global CSS variable. Featured projects uses 24px outer corners and 12px image corners, while the profile and banner retain 16px panels. Existing supporting sections commonly use 16px panels. Desktop navigation is pill-shaped; mobile navigation has 24px outer corners.

## Components

- **Shared button:** olive default, outlined, muted secondary, ghost, accent link and destructive variants. Default height is 40px, with 32px small and 48px large options. Focus uses a two-pixel ring with a two-pixel offset; disabled controls reduce opacity and stop pointer interaction.
- **Showcase actions:** sentence-case links with 44px minimum height, compact padding, 0.85rem type and weight 650. Primary is olive; secondary has a cream fill and subtle border. Hover brightness is 0.95; keyboard focus is a two-pixel foreground outline offset by four pixels. Phone actions grow to share available width.
- **Fields:** shared transparent 40px inputs with 8px corners, input-colored border, muted placeholder and explicit focus ring; textareas start at 80px and resize vertically. No separate error treatment is defined in the shared field primitive.
- **Cards and tags:** shared Card has a subtle border, cream fill, small shadow and 24px header/content padding. The Badge primitive is a full pill; Education's hosted-demo status is a separate compact rectangular tag. Supporting work widgets retain their own tinted-card hover treatments.
- **Navigation:** the active public shell uses `TopHeader`, not the legacy `Navbar` labels. Desktop shows Overview, CV, Work, Writing and Contact in pills. Below 768px, a fixed five-column bottom navigation uses icons and short labels, a bronze active treatment and safe-area padding. Profile and social controls vary by screen size.
- **Homepage banner and profile:** preserve the incumbent bronze-to-sand heading gradient, focus tags and counter tiles. Build Profile & Education retains its avatar, wrapping name/title, contact controls, education and work-experience lists. Sufrone solo development belongs in that experience list, with Ongoing when no start date is established.
- **Featured projects widget:** a translucent cream panel replaces the homepage article panel. Education leads with an actual ERP screenshot, project title, hosted-demo status, contribution, explicit fictional/private/active-development notes and 44px-minimum-height actions. Hebatullah and M-Pesa appear as compact supporting rows. Links have a two-pixel foreground focus outline offset by four pixels.
- **Education showcase on Work/case study:** actual ERP, parent and staff screenshots form a single captioned figure. Title/status lead on phone. Contribution facts use a definition list; project status, source/privacy notes and external-link behavior remain explicit in the component contract in `src/components/SufroneShowcase.tsx`.

The sidecar contains representative framework-free previews of these implemented primitives. Navigation previews are static CSS representations of the active/inactive appearance; they do not recreate the React router or spring animation. Global `:focus-visible` currently specifies a zero-width outline, so visible keyboard focus must come from each interactive component's explicit treatment rather than an assumed global ring.

## Do's and Don'ts

### Do:

- Do reuse the semantic HSL variables so surfaces follow the selected theme.
- Do preserve Geist, the cream/olive/bronze identity and the user-pinned homepage gradient heading.
- Do use actual work screenshots and descriptive captions on project showcases.
- Do keep scoped showcase measurements distinct from the shared component defaults.
- Do reserve bottom-navigation safe-area space on phone layouts.
- Do preserve the homepage banner and profile-first dashboard row; use Featured projects in the right panel on desktop.

### Don't:

- Don't replace the approved visual world with a new palette or font pairing.
- Don't turn the standalone Education showcase composition into a mandatory template for every route or move it ahead of the homepage profile row.
- Don't assume global focus styling provides a visible ring; reuse the explicit component focus treatments.
- Don't describe all supporting components as flat or motionless; their existing shadows and reveals remain implemented.

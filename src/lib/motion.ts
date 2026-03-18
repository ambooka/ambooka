import type { Variants, Transition } from 'framer-motion'

// ─── Custom Easings ──────────────────────────────────────────────
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1]

// ─── Spring Configs ──────────────────────────────────────────────
export const springDefault: Transition = { type: 'spring', stiffness: 260, damping: 25 }
export const springSnappy: Transition = { type: 'spring', stiffness: 400, damping: 30 }
export const springGentle: Transition = { type: 'spring', stiffness: 120, damping: 20 }

// ─── Reduced Motion Fallback ─────────────────────────────────────
export const instantTransition: Transition = { duration: 0 }

// ─── Page Transitions ────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

export const pageDramaticVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
}

export const pageTransition: Transition = {
  duration: 0.5,
  ease: easeOutExpo,
}

export const pageDramaticTransition: Transition = {
  duration: 0.65,
  ease: easeOutExpo,
}

// ─── Scroll-Triggered Reveals ────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}

export const widthExpand: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, originX: 0 },
}

export const scrollRevealTransition: Transition = {
  duration: 0.6,
  ease: easeOutQuart,
}

// ─── Stagger Containers ──────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutQuart },
  },
}

export const staggerChildScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: easeOutQuart },
  },
}

// ─── Card Hover ──────────────────────────────────────────────────
export const cardHover = {
  whileHover: { y: -6, scale: 1.02 },
  transition: springDefault,
}

export const cardHoverSubtle = {
  whileHover: { y: -4, scale: 1.01 },
  transition: springDefault,
}

// ─── Button Interactions ─────────────────────────────────────────
export const buttonTap = { scale: 0.96 }
export const buttonHover = { scale: 1.03 }

// ─── Modal / Overlay ─────────────────────────────────────────────
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const modalPanelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
}

export const modalTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
}

// ─── Sidebar Slide ───────────────────────────────────────────────
export const sidebarSlideUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
}

export const sidebarTransition: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
}

// ─── Nav Indicator ───────────────────────────────────────────────
export const navIndicatorTransition: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
}

// ─── Viewport Config ─────────────────────────────────────────────
export const defaultViewport = { once: true, margin: '-80px' as const }
export const heroViewport = { once: true, margin: '-40px' as const }

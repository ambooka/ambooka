'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  pageVariants,
  pageDramaticVariants,
  pageTransition,
  pageDramaticTransition,
  instantTransition,
} from '@/lib/motion'

interface AnimatedPageProps {
  children: React.ReactNode
  variant?: 'default' | 'dramatic'
  className?: string
}

export default function AnimatedPage({
  children,
  variant = 'default',
  className,
}: AnimatedPageProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants = variant === 'dramatic' ? pageDramaticVariants : pageVariants
  const transition = shouldReduceMotion
    ? instantTransition
    : variant === 'dramatic'
      ? pageDramaticTransition
      : pageTransition

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

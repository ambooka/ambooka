<<<<<<< HEAD
// UI Primitives — barrel export
export { Button, ButtonLink, buttonVariants } from "./Button"
export type { ButtonProps, ButtonLinkProps } from "./Button"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./Card"

export { Badge, badgeVariants } from "./Badge"
export type { BadgeProps } from "./Badge"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./Dialog"

export { Input, Textarea } from "./input"

export { Separator } from "./separator"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table"
=======
/**
 * UI Components Index
 * Central export for all UI primitives
 */

// Core Components
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card'
export type { CardVariant } from './Card'

export { Button, ButtonLink } from './Button'
export type { ButtonVariant, ButtonSize } from './Button'

export { Input } from './input'

// Dialog (default export)
export { default as Dialog } from './Dialog'

// Badge (default export)
export { default as Badge } from './Badge'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

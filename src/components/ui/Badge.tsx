<<<<<<< HEAD
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
        secondary:
          "border-transparent bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]",
        destructive:
          "border-transparent bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]",
        outline:
          "border-[hsl(var(--border))] text-[hsl(var(--foreground))]",
        accent:
          "border-transparent bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
=======
import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children }) => {
  const baseStyles = 'inline-flex items-center px-2 py-1 text-xs font-medium rounded';
  const variantStyles = variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white';

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

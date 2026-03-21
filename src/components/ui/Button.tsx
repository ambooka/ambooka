<<<<<<< HEAD
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary))]/90",
        destructive:
          "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] shadow-sm hover:bg-[hsl(var(--destructive))]/90",
        outline:
          "border border-[hsl(var(--border))] bg-transparent shadow-sm hover:bg-[hsl(var(--accent))]/10 hover:text-[hsl(var(--accent))]",
        secondary:
          "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--muted))]/80",
        ghost:
          "hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
        link: "text-[hsl(var(--accent))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

/* ===== ButtonLink — Next.js Link styled as a button ===== */
export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    VariantProps<typeof buttonVariants> {
  href: string
  external?: boolean
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, href, external = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    if (external) {
      return (
        <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
          {children}
        </a>
      )
    }

    return (
      <Link ref={ref} href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }
)
ButtonLink.displayName = "ButtonLink"

export { Button, ButtonLink, buttonVariants }
=======
'use client'

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 shadow-sm',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]',
    outline: 'bg-transparent border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10',
    ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
    danger: 'bg-red-500 text-white hover:bg-red-600'
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
}

interface ButtonBaseProps {
    variant?: ButtonVariant
    size?: ButtonSize
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

interface ButtonProps extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            children,
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={clsx(
                    'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        )
    }
)
Button.displayName = 'Button'

interface ButtonLinkProps extends ButtonBaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
    href: string
    external?: boolean
    children: ReactNode
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            children,
            href,
            external = false,
            leftIcon,
            rightIcon,
            ...props
        },
        ref
    ) => {
        const classes = clsx(
            'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
            variantStyles[variant],
            sizeStyles[size],
            className
        )

        if (external) {
            return (
                <a
                    ref={ref}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes}
                    {...props}
                >
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </a>
            )
        }

        return (
            <Link ref={ref} href={href} className={classes} {...props}>
                {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </Link>
        )
    }
)
ButtonLink.displayName = 'ButtonLink'
>>>>>>> b754ef8ef81ee05ffa20e4e0ac5049621c5b0e0e

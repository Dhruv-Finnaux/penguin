"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background outline-none focus-visible:ring-2 ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] duration-150 gap-1.5 disabled:scale-100 [&>svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary disabled:hover:bg-primary text-primary-foreground hover:bg-primary/90 dark:shadow-[inset_0px_2px_2px_rgba(255,255,255,0.28),0px_2px_6px_rgba(0,0,0,0.06)]",
        destructive:
          "bg-destructive disabled:hover:bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:shadow-[inset_0px_2px_2px_rgba(255,255,255,0.18),0px_2px_6px_rgba(0,0,0,0.06)]",
        outline:
          "border disabled:hover:bg-background/30 border-border bg-background/30 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:shadow-[inset_0px_2px_2px_rgba(255,255,255,0.28),0px_2px_6px_rgba(0,0,0,0.06)]",
        ghost: "hover:bg-accent disabled:hover:bg-transparent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline disabled:hover:no-underline",
      },
      size: {
        xs: "h-7 rounded-md px-2.5 text-xs",
        sm: "h-8 rounded-md px-3",
        default: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
      },
      isIcon: {
        false: null,
        true: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "link",
        className: "h-max px-0 py-0",
      },
      // Icon compound variants
      {
        isIcon: true,
        size: "xs",
        className: "size-7",
      },
      {
        isIcon: true,
        size: "sm",
        className: "size-8",
      },
      {
        isIcon: true,
        size: "default",
        className: "size-9",
      },
      {
        isIcon: true,
        size: "lg",
        className: "size-10",
      },
      // Special cases for icon buttons
      {
        isIcon: true,
        variant: "ghost",
        className: "hover:bg-accent/50",
      },
      {
        isIcon: true,
        variant: "outline",
        className: "border-border",
      },
    ],
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading, disabled, children, isIcon, ...props },
    ref,
  ) => {
    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<any>
      return (
        <Slot ref={ref} {...props}>
          {React.cloneElement(
            child,
            {
              ...child.props,
              className: cn(buttonVariants({ variant, size, isIcon }), className),
            },
            <>
              {loading && <Spinner size={"sm"} className="ml-1.5" />}
              {child.props.children}
            </>,
          )}
        </Slot>
      )
    }

    return (
      <button
        type="button"
        className={cn(buttonVariants({ variant, size, isIcon, className }))}
        disabled={loading || disabled}
        ref={ref}
        {...props}>
        <>
          {children}
          {loading && <Spinner size={"sm"} className="ml-1.5" />}
        </>
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

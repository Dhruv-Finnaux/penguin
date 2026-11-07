"use client"

import { cn } from "@/lib/utils"
import { Loader2, RotateCw, type LucideProps } from "lucide-react"
import * as React from "react"

interface AnimatedRefreshIconProps extends LucideProps {
  loading?: boolean
}

/**
 * A custom icon component that smoothly transitions between a RotateCw icon
 * and a rotating Loader2 icon based on the loading state.
 */
const AnimatedRefreshIcon = React.forwardRef<HTMLDivElement, AnimatedRefreshIconProps>(
  ({ loading, className, size = 18, strokeWidth = 2, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
            loading
              ? "pointer-events-none rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-100",
          )}>
          <RotateCw size={size} strokeWidth={strokeWidth} {...props} />
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
            loading
              ? "rotate-0 scale-100 opacity-100"
              : "pointer-events-none -rotate-90 scale-50 opacity-0",
          )}>
          <Loader2 size={size} strokeWidth={strokeWidth} className="animate-spin" {...props} />
        </div>
      </div>
    )
  },
)

AnimatedRefreshIcon.displayName = "AnimatedRefreshIcon"

export { AnimatedRefreshIcon }

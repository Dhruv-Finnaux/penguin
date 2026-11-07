import { cn } from "@/lib/utils"
import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  error?: boolean
}

export const inputStyles =
  "flex h-9 w-full rounded-md border bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-65 transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-ring/20"

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, error, value, suffixIcon, prefixIcon, ...props }, ref) => {
    return (
      <div className="relative [&>svg]:size-4">
        {prefixIcon && (
          <div className="absolute left-2.5 top-0 flex h-full items-center text-muted-foreground [&>svg]:size-4">
            {prefixIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          className={cn(
            inputStyles,
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            props.readOnly && "cursor-not-allowed bg-accent/30",
            error && "focus-visible:border-destructive focus-visible:ring-destructive/20",
            prefixIcon && "pl-8",
            suffixIcon && "pr-8",
            className,
          )}
          tabIndex={props.readOnly ? -1 : undefined}
          value={value}
          {...props}
        />
        {suffixIcon && (
          <div className="absolute right-2.5 top-0 flex h-full items-center text-muted-foreground [&>svg]:size-4">
            {suffixIcon}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }

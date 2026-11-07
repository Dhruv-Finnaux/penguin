import * as React from "react"

import { composeRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  autoGrow?: boolean
  maxRows?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, value, autoGrow, maxRows, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleInput = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      textarea.style.height = "auto"

      const style = window.getComputedStyle(textarea)
      const borderHeight = parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth)
      const paddingHeight = parseInt(style.paddingTop) + parseInt(style.paddingBottom)

      const lineHeight = parseInt(style.lineHeight)
      const maxHeight = maxRows ? lineHeight * maxRows + borderHeight + paddingHeight : Infinity

      const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight)

      textarea.style.height = `${newHeight + 2}px`
    }, [maxRows])

    React.useEffect(() => {
      if (autoGrow && textareaRef.current) {
        textareaRef.current.style.height = "auto"
        handleInput()
      }
    }, [autoGrow, handleInput])
    return (
      <textarea
        rows={4}
        className={cn(
          "flex min-h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground hover:bg-accent/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:bg-background",
          props.readOnly && "cursor-not-allowed bg-accent/30",
          error && "focus-visible:border-destructive focus-visible:ring-destructive/20",
          className,
        )}
        tabIndex={props.readOnly ? -1 : undefined}
        ref={composeRefs(ref, textareaRef)}
        value={value ?? ""}
        onInput={autoGrow ? handleInput : undefined}
        {...props}
      />
    )
  },
)
Textarea.displayName = "Textarea"

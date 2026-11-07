"use client"

import { cn } from "@/lib/utils"
import { CopyIcon } from "lucide-react"
import type { ReactNode } from "react"
import { toast } from "sonner"

// A file name with a copy button that shows on hover. A span, not a button, so it can sit inside
// the clickable rows that open a file.
export function CopyPath({
  path,
  children,
  className,
}: {
  path: string
  children: ReactNode
  className?: string
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(path)
      toast.success("Copied file name")
    } catch {
      toast.error("Could not copy the file name")
    }
  }

  return (
    <span className={cn("group/path inline-flex min-w-0 items-start gap-1.5", className)}>
      <code className="min-w-0 break-all text-xs">{children}</code>
      <span
        role="button"
        tabIndex={0}
        title="Copy file name"
        aria-label="Copy file name"
        className="mt-px flex size-4 shrink-0 cursor-pointer items-center justify-center rounded text-black/40 opacity-0 transition-opacity hover:text-black focus-visible:opacity-100 group-hover/path:opacity-100 dark:text-white/40 dark:hover:text-white"
        onClick={(event) => {
          event.stopPropagation()
          void copy()
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            event.stopPropagation()
            void copy()
          }
        }}>
        <CopyIcon className="size-3" />
      </span>
    </span>
  )
}

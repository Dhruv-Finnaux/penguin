"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { toast } from "sonner"

export function CopyHash({
  hash,
  label,
  className,
}: {
  hash: string
  label?: ReactNode
  className?: string
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash)
      toast.success(`Copied ${hash.slice(0, 7)}`)
    } catch {
      toast.error("Could not copy the hash")
    }
  }

  return (
    <code
      role="button"
      tabIndex={0}
      title="Click to copy the hash"
      className={cn("cursor-pointer transition-opacity hover:opacity-70", className)}
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
      {label ?? hash.slice(0, 7)}
    </code>
  )
}

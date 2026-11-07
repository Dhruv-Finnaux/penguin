"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

export function Collapse({
  open,
  children,
  className,
}: {
  open: boolean
  children: React.ReactNode
  className?: string
}) {
  const [hasOpened, setHasOpened] = useState(open)
  if (open && !hasOpened) setHasOpened(true)

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}>
      <div className="min-h-0 overflow-hidden">{hasOpened ? children : null}</div>
    </div>
  )
}

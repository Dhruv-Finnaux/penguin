"use client"

import { cn } from "@/lib/utils"
import { HashIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

// "# Hash" chip. Clicking it copies the commit hash, shows a toast, and swaps the label to the hash for
// a couple of seconds before it goes back to "# Hash".
export function HashButton({ hash, className }: { hash: string; className?: string }) {
  const [revealed, setRevealed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash)
      toast.success(`Copied ${hash.slice(0, 7)}`)
    } catch {
      toast.error("Could not copy the hash")
    }
    setRevealed(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setRevealed(false), 2500)
  }

  return (
    <code
      role="button"
      tabIndex={0}
      title="Click to copy the commit hash"
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1 rounded-md bg-blue-600/10 p-1 text-xs font-medium text-blue-600 transition-opacity hover:opacity-70 dark:bg-blue-400/15 dark:text-blue-400",
        className,
      )}
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
      }}
    >
      {revealed ? (
        hash.slice(0, 7)
      ) : (
        <>
          <HashIcon className="size-3.5" />
        </>
      )}
    </code>
  )
}

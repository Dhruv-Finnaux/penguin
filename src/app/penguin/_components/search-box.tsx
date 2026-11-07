"use client"

import { Input } from "@/components/ui/input"
import { XIcon } from "lucide-react"

export function SearchBox({
  value,
  onChange,
  placeholder = "Search by hash, message, author or file",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-black/25/25 rounded-xl border-dashed bg-transparent p-5 ring-0 focus-within:border-black/25 focus-within:bg-card focus-within:outline-none focus-within:ring-0 hover:bg-transparent focus-within:hover:bg-card focus:border-black/25 focus:outline-none focus:ring-0 focus-visible:border-black/25 focus-visible:outline-none focus-visible:ring-0 active:border-black/25 active:ring-0 dark:border-white/25 dark:focus-within:border-white/25 dark:focus:border-white/25 dark:focus-visible:border-white/25 dark:active:border-white/25"
        placeholder={placeholder}
      />
      {value.length > 1 && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute right-2.5 top-2.5 size-5 cursor-pointer text-black/50 hover:text-black dark:text-white/50"
          onClick={() => onChange("")}>
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  )
}

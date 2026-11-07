"use client"

import { cn } from "@/lib/utils"
import { Highlight } from "./highlight"

// Hash chips are blue, so authors get every other colour. Full class names, so Tailwind keeps them.
const AUTHOR_COLORS = [
  "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  "bg-violet-600/10 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  "bg-orange-600/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
  "bg-pink-600/10 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300",
  "bg-teal-600/10 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
  "bg-fuchsia-600/10 text-fuchsia-700 dark:bg-fuchsia-400/15 dark:text-fuchsia-300",
  "bg-lime-600/10 text-lime-700 dark:bg-lime-400/15 dark:text-lime-300",
  "bg-rose-600/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
  "bg-amber-600/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  "bg-cyan-600/10 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-300",
]

// Each name starts from a colour picked from its letters, so it mostly stays the same between
// loads. When another author already holds that colour, it takes the next free one, so different
// authors never share a colour until all of them are used.
const assigned = new Map<string, number>()

function colorFor(name: string) {
  const key = name.trim().toLowerCase()
  let slot = assigned.get(key)
  if (slot === undefined) {
    let hash = 0
    for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
    const taken = new Set(assigned.values())
    slot = hash % AUTHOR_COLORS.length
    for (let i = 0; i < AUTHOR_COLORS.length && taken.has(slot); i++) {
      slot = (slot + 1) % AUTHOR_COLORS.length
    }
    assigned.set(key, slot)
  }
  return AUTHOR_COLORS[slot]
}

// Older entries can have no author, so a missing name renders nothing.
export function AuthorTag({ name, className }: { name?: string | null; className?: string }) {
  if (!name?.trim()) return null
  return (
    <code
      title={`Author: ${name}`}
      className={cn("shrink-0 rounded-md px-2 py-1 text-xs font-medium", colorFor(name), className)}>
      <Highlight text={name} />
    </code>
  )
}

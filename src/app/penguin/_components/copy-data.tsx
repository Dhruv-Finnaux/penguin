"use client"

import { CopyIcon, FileTextIcon } from "lucide-react"
import { toast } from "sonner"

// Two small buttons that copy one table or list, as Markdown or as plain text.
export function CopyData({ markdown, text }: { markdown: string; text: string }) {
  const copy = async (value: string, what: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`Copied as ${what}`)
    } catch {
      toast.error("Could not copy")
    }
  }
  const button =
    "flex size-6 cursor-pointer items-center justify-center rounded text-black/40 hover:bg-accent hover:text-black dark:text-white/40 dark:hover:text-white"
  return (
    <span className="flex shrink-0 gap-0.5">
      <button type="button" title="Copy as Markdown" aria-label="Copy as Markdown" className={button} onClick={() => void copy(markdown, "Markdown")}>
        <CopyIcon className="size-3.5" />
      </button>
      <button type="button" title="Copy as text" aria-label="Copy as text" className={button} onClick={() => void copy(text, "text")}>
        <FileTextIcon className="size-3.5" />
      </button>
    </span>
  )
}

const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ")

export function tableMarkdown(head: string[], rows: string[][]) {
  return [
    `| ${head.join(" | ")} |`,
    `|${head.map(() => "---").join("|")}|`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ].join("\n")
}

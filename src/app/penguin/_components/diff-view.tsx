"use client"

import { cn } from "@/lib/utils"
import { ChevronRightIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { Collapse } from "./collapse"

interface Cell {
  line: number | null
  text: string
  kind: "context" | "removed" | "added" | "empty"
}

interface Pair {
  left: Cell
  right: Cell
}

interface Hunk {
  label: string
  newStart: number
  newEnd: number
  added: number
  removed: number
  pairs: Pair[]
}

const EMPTY: Cell = { line: null, text: "", kind: "empty" }

function parsePatch(patch: string): Hunk[] {
  const hunks: Hunk[] = []
  let current: Hunk | null = null
  let oldLine = 0
  let newLine = 0
  let removed: Cell[] = []
  let added: Cell[] = []

  const flush = () => {
    if (!current) return
    const count = Math.max(removed.length, added.length)
    for (let i = 0; i < count; i++) {
      current.pairs.push({ left: removed[i] ?? EMPTY, right: added[i] ?? EMPTY })
    }
    current.removed += removed.length
    current.added += added.length
    removed = []
    added = []
  }

  for (const line of patch.split("\n")) {
    const header = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,(\d+))? @@(.*)$/)
    if (header) {
      flush()
      oldLine = Number(header[1])
      newLine = Number(header[2])
      const length = header[3] === undefined ? 1 : Number(header[3])
      current = {
        label: header[4].trim(),
        newStart: newLine,
        newEnd: newLine + Math.max(length - 1, 0),
        added: 0,
        removed: 0,
        pairs: [],
      }
      hunks.push(current)
      continue
    }
    if (!current || line.startsWith("\\")) continue
    if (line.startsWith("-")) {
      removed.push({ line: oldLine++, text: line.slice(1), kind: "removed" })
    } else if (line.startsWith("+")) {
      added.push({ line: newLine++, text: line.slice(1), kind: "added" })
    } else if (line.startsWith(" ")) {
      flush()
      const text = line.slice(1)
      current.pairs.push({
        left: { line: oldLine++, text, kind: "context" },
        right: { line: newLine++, text, kind: "context" },
      })
    }
  }
  flush()
  return hunks
}

function CellView({ cell }: { cell: Cell }) {
  return (
    <div
      className={cn(
        "flex min-w-0",
        cell.kind === "removed" && "bg-destructive/10",
        cell.kind === "added" && "bg-success/10",
        cell.kind === "empty" && "bg-accent/30",
      )}>
      <span className="w-10 shrink-0 select-none px-2 text-right text-muted-foreground">
        {cell.line ?? ""}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 whitespace-pre-wrap break-all px-2",
          cell.kind === "removed" && "text-destructive",
          cell.kind === "added" && "text-success",
        )}>
        {cell.text}
      </span>
    </div>
  )
}

function HunkItem({ hunk }: { hunk: Hunk }) {
  const [open, setOpen] = useState(false)
  const range =
    hunk.newEnd > hunk.newStart ? `Lines ${hunk.newStart}–${hunk.newEnd}` : `Line ${hunk.newStart}`

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent/30"
        onClick={() => setOpen((value) => !value)}>
        <ChevronRightIcon
          className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")}
        />
        <span className="shrink-0 text-xs font-medium">{range}</span>
        {hunk.label && (
          <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{hunk.label}</code>
        )}
        <span className="ml-auto flex shrink-0 gap-2 text-xs">
          <span className="text-success">+{hunk.added}</span>
          <span className="text-destructive">-{hunk.removed}</span>
        </span>
      </button>

      <Collapse open={open}>
        <div className="overflow-x-auto border-t">
          <div className="grid min-w-[40rem] grid-cols-2 text-xs font-semibold">
            <div className="px-3 py-1.5 text-destructive">Removed</div>
            <div className="border-l px-3 py-1.5 text-success">Added</div>
          </div>
          <div className="min-w-[40rem] font-mono text-xs leading-5">
            {hunk.pairs.map((pair, i) => (
              <div key={i} className="grid grid-cols-2">
                <CellView cell={pair.left} />
                <div className="border-l">
                  <CellView cell={pair.right} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export function DiffView({ patch, truncated }: { patch: string; truncated: boolean }) {
  const hunks = useMemo(() => parsePatch(patch), [patch])

  if (hunks.length === 0) {
    return <p className="p-3 text-xs text-muted-foreground">No text changes (binary or mode change).</p>
  }

  return (
    <div className="ml-4 space-y-2 border-l border-dashed pl-3">
      {hunks.map((hunk, i) => (
        <HunkItem key={i} hunk={hunk} />
      ))}
      {truncated && (
        <p className="text-xs text-warning">Diff truncated. Open the commit in git for the rest.</p>
      )}
    </div>
  )
}

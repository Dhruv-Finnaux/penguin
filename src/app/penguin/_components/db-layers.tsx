"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { DbBackupFile, DbBackupRun } from "../_lib/types"
import { Collapse } from "./collapse"

// Colours come from the heatmap's author palette (activity-heatmap.tsx `hueFor`), at its saturation.
const hueFor = (index: number) => 205 + ((index * 37) % 125)
const solid = (index: number) => `hsl(${hueFor(index)} 80% 42%)`

// The five states that hold a backup take the five colours of the palette template, from the top down.
// From light green down to red, one step per backup state.
const PALETTE = ["#A8E0A0", "#5DBB63", "#E8B33A", "#E0662C", "#DA4F3F"]
const KEY_COLOR: Record<string, string> = {
  migrated: PALETTE[0],
  seeded: PALETTE[1],
  f20: PALETTE[2],
  baseline: PALETTE[3],
  "after-tests": PALETTE[4],
}
// Text on the solid backup chips in the lists is black, so it reads on every colour.
const CHIP_INK = "#111827"

// The colour at a given opacity: hex gets an alpha byte, hsl gets a slash alpha.
function tintOf(color: string, alpha: number) {
  if (color.startsWith("#"))
    return (
      color +
      Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")
    )
  return color.replace(/\)$/, ` / ${alpha})`)
}
// The empty database is not a backup, so it stays grey.
const EMPTY = "#00000020"

// The backup name is the copy button: click it to copy `db restore <name>`.
export function CopyNameButton({
  name,
  className,
  color,
  ink,
}: {
  name: string
  className?: string
  color?: string
  ink?: string
}) {
  const [copied, setCopied] = useState(false)
  const text = `db restore ${name}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Could not copy")
    }
  }
  return (
    <button
      type="button"
      title={`Copy: ${text}`}
      aria-label={`Copy load command for ${name}`}
      onClick={() => void copy()}
      style={color ? { background: color, color: ink } : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium hover:opacity-90",
        className,
      )}
    >
      {copied && <CheckIcon className="size-3.5" />}
      {copied ? "Copied" : name}
    </button>
  )
}

const base = (name: string) => name.replace(/\.dump$/, "")

interface Known {
  key: string
  title: string
  adds: string
  file?: string
  taken?: string
  dashed?: boolean
}

// The fixed states, from the empty database down to the database after testing.
// Each one is a subset of the one before it. Backups that are not listed here are added after them.
const KNOWN: Known[] = [
  {
    key: "empty",
    title: "Empty database",
    adds: "Nothing yet. Every later state lives inside this one.",
    dashed: true,
  },
  { key: "migrated", title: "Migrated", adds: "The schema, with no rows." },
  {
    key: "seeded",
    title: "Seeded",
    adds: "Reference and seed rows on top of the schema.",
    file: "finnaux_dev_fresh_seeded.dump",
    taken: "23 Nov",
  },
  {
    key: "f20",
    title: "F20 data copied",
    adds: "The f20 data copied in. Adam and Eve are not there yet.",
    file: "finnaux_dev_after_f20_copy.dump",
    taken: "25 Nov, 12:26",
  },
  {
    key: "baseline",
    title: "Adam and Eve added",
    adds: "The two test users, before any testing. This is the clean baseline.",
    file: "finnaux_dev_clean_before_tests.dump",
    taken: "25 Nov, 12:27",
  },
  {
    key: "after-tests",
    title: "After all the tests",
    adds: "Everything the test runs changed. This is the current dev database.",
    file: "finnaux_dev_after_tests.dump",
    taken: "25 Nov, 17:18",
  },
]

export interface Nest {
  key: string
  title: string
  adds: string
  file?: string
  taken?: string
  dashed?: boolean
  color: string
  /** Box background: the colour at 10%. */
  tint: string
  /** Box border and the chips on it, text in a dark shade. */
  edge: string
  chip: string
  ink: string
}

// Builds the nests from what is on disk: the fixed states first, then any other backup, oldest first.
// finnaux_dev.dump is the rolling copy of the last state, so it is not a nest of its own.
export function buildNests(files: DbBackupFile[], runs: DbBackupRun[]): Nest[] {
  const latest = [...runs]
    .filter((run) => run.tables !== null)
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0]
  const schema =
    latest && latest.migrations !== null
      ? `The schema: ${latest.tables} tables from ${latest.migrations} migrations, with no rows.`
      : "The schema, with no rows."
  const fixedFiles = new Set(KNOWN.flatMap((k) => (k.file ? [base(k.file)] : [])))
  const extra = files
    .filter((file) => file.name !== "finnaux_dev" && !fixedFiles.has(file.name))
    .sort((a, b) => a.modifiedAt.localeCompare(b.modifiedAt))
    .map((file) => ({
      key: file.name,
      title: "New backup",
      adds: "Taken after the boxes above.",
      file: `${file.name}.dump`,
      taken: format(new Date(file.modifiedAt), "dd MMM, HH:mm"),
    }))
  return [...KNOWN, ...extra].map((item, index) => {
    const color = KEY_COLOR[item.key] ?? (item.key === "empty" ? EMPTY : solid(index))
    // Text takes the solid colour; only the chips and boxes carry the tint.
    return {
      ...item,
      adds: item.key === "migrated" ? schema : item.adds,
      color,
      tint: tintOf(color, 0.1),
      edge: tintOf(color, 0.4),
      chip: tintOf(color, 0.2),
      ink: color,
    }
  })
}

// The colour of the nest a backup belongs to, so its name matches its box.
export function colorForBackup(name: string, nests: Nest[]): string | undefined {
  const key = base(name)
  const nest =
    nests.find((n) => n.file && base(n.file) === key) ??
    (key === "finnaux_dev" ? nests.find((n) => n.key === "after-tests") : undefined)
  return nest?.color
}

export function inkForBackup(name: string, nests: Nest[]): string | undefined {
  return colorForBackup(name, nests) ? CHIP_INK : undefined
}

function size(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

// One row per state, each indented one step deeper than the row above it.
function Ladder({ nests, files }: { nests: Nest[]; files: DbBackupFile[] }) {
  return (
    <ol className="space-y-1">
      {nests.map((nest, index) => {
        const file = nest.file ? files.find((f) => `${f.name}.dump` === nest.file) : undefined
        return (
          <li key={nest.key} className="flex gap-3 py-2 text-sm" style={{ paddingLeft: index * 24 }}>
            <span className="w-1 shrink-0 self-stretch" style={{ background: nest.color }} aria-hidden />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[11px] font-semibold uppercase text-muted-foreground">{index + 1}</span>
                <span className="font-medium">{nest.title}</span>
                {nest.file ? (
                  <CopyNameButton name={base(nest.file)} color={nest.chip} ink={nest.color} />
                ) : (
                  <span className="text-xs text-muted-foreground">no backup file</span>
                )}
                {file && <span className="text-xs text-muted-foreground">{size(file.sizeBytes)}</span>}
                {nest.taken && <span className="text-xs text-muted-foreground">{nest.taken}</span>}
              </div>
              <p className="text-xs text-muted-foreground">{nest.adds}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function DbLayers({ nests, files }: { nests: Nest[]; files: DbBackupFile[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent/30"
      >
        <ChevronRightIcon className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")} />
        <span className="text-xs font-semibold uppercase text-black dark:text-white">
          What each backup contains ({nests.length})
        </span>
      </button>
      <Collapse open={open}>
        <div className="border-t">
          <p className="border-b px-4 py-2 text-xs text-muted-foreground">
            Each state is a subset of the one above it: the empty database is the whole set, and each step down adds to
            what came before, down to the newest backup.
          </p>
          <div className="p-4">
            <Ladder nests={nests} files={files} />
          </div>
          <p className="border-t px-4 py-2 text-xs text-muted-foreground">
            <code className="rounded bg-accent px-1 py-0.5">finnaux_dev.dump</code> is the rolling copy of the last box;{" "}
            <code className="rounded bg-accent px-1 py-0.5">db restore</code> with no name and the backups tab use it.{" "}
            <code className="rounded bg-accent px-1 py-0.5">finnaux_dev_test-users.counts</code> is used by{" "}
            <code className="rounded bg-accent px-1 py-0.5">db test-users remove</code> to check the removal was clean.
          </p>
        </div>
      </Collapse>
    </div>
  )
}

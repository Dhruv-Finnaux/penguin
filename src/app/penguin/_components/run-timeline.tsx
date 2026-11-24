"use client"

import { cn } from "@/lib/utils"
import { dayLabel } from "../_lib/day-label"
import { CheckIcon, ChevronRightIcon, CopyIcon } from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { Collapse } from "./collapse"

export function CopyTextButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)

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
      title={label}
      aria-label={label}
      className="inline-flex h-7 shrink-0 items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => void copy()}>
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      {copied ? "Copied" : label}
    </button>
  )
}

export function RunCard({
  summary,
  actions,
  children,
}: {
  summary: ReactNode
  actions?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center hover:bg-accent/30">
        <button
          type="button"
          aria-expanded={open}
          className="flex max-w-30 flex-1 flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 pl-3 text-left"
          onClick={() => setOpen((value) => !value)}>
          <ChevronRightIcon
            className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")}
          />
          {summary}
        </button>
        {actions && <div className="flex shrink-0 items-center self-center pr-3">{actions}</div>}
      </div>
      <Collapse open={open}>
        <div className="space-y-4 border-t p-4">{children}</div>
      </Collapse>
    </div>
  )
}

export function RunTimeline<T extends { fileName: string; generatedAt: string }>({
  runs,
  noun,
  empty,
  renderRun,
}: {
  runs: T[]
  noun: string
  empty: ReactNode
  renderRun: (run: T) => ReactNode
}) {
  const days = useMemo(() => {
    const byDay = new Map<string, T[]>()
    for (const run of runs) {
      const day = dayLabel(run.generatedAt)
      byDay.set(day, [...(byDay.get(day) ?? []), run])
    }
    return [...byDay.entries()].map(([day, items]) => ({ day, runs: items }))
  }, [runs])

  if (runs.length === 0) {
    return <div className="p-20 text-center text-sm text-muted-foreground">{empty}</div>
  }

  return (
    <ol>
      {days.map((day, dayIndex) => (
        <li key={day.day} className={cn(
          "relative grid gap-x-4 md:grid-cols-[9rem_1fr]",
          dayIndex > 0 &&
          "before:absolute before:inset-x-0 before:-top-3 before:border-t before:border-dashed before:border-border dark:before:border-white/50",
        )}>
          <div className="pb-2 md:sticky md:top-2 md:self-start md:pb-0 md:pt-2.5 md:text-right">
            <h2 className="text-xs font-semibold text-black/50 dark:text-white/50">{day.day}</h2>
            <p className="text-xs text-muted-foreground">
              {day.runs.length} {day.runs.length === 1 ? noun : `${noun}`}
            </p>
          </div>
          <div className="relative pb-6">
            <ol className="space-y-3">
              {day.runs.map((run, runIndex) => {
                const isFirst = dayIndex === 0 && runIndex === 0
                const isLast = dayIndex === days.length - 1 && runIndex === day.runs.length - 1
                const endsDay = runIndex === day.runs.length - 1

                return (
                  <li key={run.fileName} className="relative pl-8">
                    {!(isFirst && isLast) && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-3 border-l border-dashed border-border dark:border-white/50",
                          isLast
                            ? "top-0 h-5"
                            : cn(isFirst ? "top-5" : "top-0", endsDay ? "-bottom-6" : "-bottom-3"),
                        )}
                      />
                    )}
                    <span className="absolute left-[6.75px] top-4 size-2.5 rounded-full border border-white bg-blue-600 p-1 dark:border-background" />
                    {renderRun(run)}
                  </li>
                )
              })}
            </ol>
          </div>
        </li>
      ))}
    </ol>
  )
}

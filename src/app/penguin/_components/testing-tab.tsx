"use client"

import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { useQuery } from "@tanstack/react-query"
import { ChevronRightIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Collapse } from "./collapse"
import type { Review } from "../_lib/types"
import { ScoreBadge, scoreStatus, STATUS_SURFACE } from "./status"
import { TimeLabel } from "./time-label"
import { dayLabel } from "../_lib/day-label"
import {
  countAttention,
  countByPriority,
  countFuture,
  countResolved,
  timelineDot,
  FindingsTable,
  PriorityCounts,
  sortFindings,
} from "./findings"

type Files = Record<"screenshots" | "responses" | "data", { name: string; size: number }[]>

const fileUrl = (folder: string, name: string) =>
  `/penguin/api/testing/file?folder=${folder}&name=${encodeURIComponent(name)}`
const label = (name: string) => name.replace(/\.[^.]+$/, "")
const kb = (size: number) => `${Math.max(1, Math.round(size / 1024))} KB`

function FileLinks({
  folder,
  title,
  available,
  names,
}: {
  folder: "responses" | "data"
  title: string
  available: { name: string; size: number }[]
  names: string[]
}) {
  const files = available.filter((file) => names.includes(label(file.name)))
  if (files.length === 0) return null
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground">
        {title} ({files.length})
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <li key={file.name}>
            <a
              href={fileUrl(folder, file.name)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-muted-foreground">{kb(file.size)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TestRunCard({ run, screenshots, files }: { run: Review; screenshots: string[]; files: Files | undefined }) {
  const [open, setOpen] = useState(false)
  // A run owns the screenshots its report mentions by name.
  const photos = useMemo(() => {
    const text = JSON.stringify(run)
    return screenshots.filter((name) => run.screenshots.includes(name) || text.includes(name))
  }, [run, screenshots])
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 pl-3 text-left hover:bg-accent/30"
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronRightIcon className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")} />
        <code className="shrink-0 text-xs font-medium">
          <TimeLabel iso={run.generatedAt} />
        </code>
        <code className="min-w-72 flex-1 truncate text-xs">{run.target.title ?? "Test run"}</code>
        <ScoreBadge score={run.score} quality={run.quality} verdict={run.verdict} />
        <PriorityCounts
          counts={countByPriority(run.findings)}
          resolved={countResolved(run.findings)}
          future={countFuture(run.findings)}
          attention={countAttention(run.findings)}
        />
      </button>
      <Collapse open={open}>
        <div className="flex flex-col gap-4 border-t p-4 md:flex-row">
          <div
            className={cn(
              "flex items-center justify-center self-start rounded-xl p-4",
              STATUS_SURFACE[scoreStatus(run.score)],
            )}
          >
            <ScoreBadge score={run.score} quality={run.quality} verdict={run.verdict} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            {photos.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed p-4 text-xs text-muted-foreground">
                No screenshots mention this run.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((name) => (
                  <a
                    key={name}
                    href={fileUrl("screenshots", `${name}.png`)}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-lg border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fileUrl("screenshots", `${name}.png`)}
                      alt={name}
                      loading="lazy"
                      className="aspect-video w-full border-b object-cover object-top"
                    />
                    <div className="truncate px-2 py-1 text-xs">{name}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        {files && (run.responses.length > 0 || run.data.length > 0) && (
          <div className="space-y-3 border-t p-4">
            <FileLinks folder="responses" title="API responses" available={files.responses} names={run.responses} />
            <FileLinks folder="data" title="Run data" available={files.data} names={run.data} />
          </div>
        )}
        <div className="border-t">
          <FindingsTable findings={sortFindings(run.findings)} reviewFile={run.fileName} startIndex={1} />
        </div>
      </Collapse>
    </div>
  )
}

export function TestingTab({ reviews }: { reviews: Review[] }) {
  const runs = useMemo(
    () =>
      reviews
        .filter((review) => review.target.kind === "test-run")
        .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()),
    [reviews],
  )
  const { data, isLoading } = useQuery<Files>({
    queryKey: ["penguin-testing"],
    queryFn: async () => {
      const response = await fetch("/penguin/api/testing")
      if (!response.ok) throw new Error("Could not read the test evidence")
      return response.json()
    },
  })
  const screenshots = useMemo(() => (data?.screenshots ?? []).map((file) => file.name.replace(/\.[^.]+$/, "")), [data])
  // Screenshots a run already shows in its own card are not repeated below.
  const unlinked = useMemo(() => {
    const text = runs.map((run) => JSON.stringify(run)).join("\n") // includes each run's screenshots list
    return (data?.screenshots ?? []).filter((file) => !text.includes(file.name.replace(/\.[^.]+$/, "")))
  }, [runs, data])
  const linkedNames = (folder: "responses" | "data") => new Set(runs.flatMap((run) => run[folder]))
  const unlinkedFiles = (folder: "responses" | "data") =>
    (data?.[folder] ?? []).filter((file) => !linkedNames(folder).has(label(file.name)))
  const days = useMemo(() => {
    const byDay = new Map<string, Review[]>()
    for (const run of runs) byDay.set(dayLabel(run.generatedAt), [...(byDay.get(dayLabel(run.generatedAt)) ?? []), run])
    return [...byDay.entries()].map(([day, items]) => ({ day, runs: items }))
  }, [runs])
  const average = runs.length ? Math.round(runs.reduce((sum, run) => sum + run.score, 0) / runs.length) : null

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">
          Test runs ({runs.length})
          {average !== null && <span className="ml-2 font-normal text-muted-foreground">average score {average}</span>}
        </h2>
        {runs.length === 0 ? (
          <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">No test runs yet.</div>
        ) : (
          <ol>
            {days.map((day, dayIndex) => (
              <li
                key={day.day}
                className={cn(
                  "relative grid gap-x-4 md:grid-cols-[9rem_1fr]",
                  dayIndex > 0 &&
                    "before:absolute before:inset-x-0 before:-top-3 before:border-t before:border-dashed before:border-border dark:before:border-white/50",
                )}
              >
                <div className="pb-2 md:sticky md:top-2 md:self-start md:pb-0 md:pt-2.5 md:text-right">
                  <h3 className="text-xs font-semibold text-black/50 dark:text-white/50">{day.day}</h3>
                  <p className="text-xs text-muted-foreground">
                    {day.runs.length} {day.runs.length === 1 ? "review" : "reviews"}
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
                          <span
                            className={cn(
                              "absolute left-[6.75px] top-4 size-2.5 rounded-full border border-white p-1 dark:border-background",
                              timelineDot(run.findings),
                            )}
                          />
                          <TestRunCard run={run} screenshots={screenshots} files={data} />
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {isLoading || !data ? (
        <LoadingIndicatorView />
      ) : (
        <>
          <section className={cn("space-y-3", unlinked.length === 0 && "hidden")}>
            <h2 className="text-sm font-semibold">Other screenshots ({unlinked.length})</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {unlinked.map((file) => (
                <a
                  key={file.name}
                  href={fileUrl("screenshots", file.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-xl border bg-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl("screenshots", file.name)}
                    alt={label(file.name)}
                    loading="lazy"
                    className="aspect-video w-full border-b object-cover object-top"
                  />
                  <div className="truncate px-3 py-2 text-xs">{label(file.name)}</div>
                </a>
              ))}
            </div>
          </section>

          {(["responses", "data"] as const).map((folder) => {
            const files = unlinkedFiles(folder)
            if (files.length === 0) return null
            return (
              <section key={folder} className="space-y-3">
                <h2 className="text-sm font-semibold">
                  {folder === "responses" ? "Other API responses" : "Other run data"} ({files.length})
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {files.map((file) => (
                    <li key={file.name}>
                      <a
                        href={fileUrl(folder, file.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2 text-xs"
                      >
                        <span className="truncate">{file.name}</span>
                        <span className="shrink-0 text-muted-foreground">{kb(file.size)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}

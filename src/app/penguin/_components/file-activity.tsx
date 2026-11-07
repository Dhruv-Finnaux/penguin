"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useMemo, useState } from "react"
import { matchesQuery } from "../_lib/fuzzy"
import type { FileActivity, FileChange, RepoKey } from "../_lib/types"
import { Highlight } from "./highlight"
import { NextTabs } from "./penguin-tabs"

type View = "names" | "count"

const CHANGE: Record<FileChange, { letter: string; className: string; label: string }> = {
  added: { letter: "A", className: "bg-green-600/10 text-green-600", label: "Added" },
  modified: { letter: "M", className: "bg-amber-500/10 text-amber-600", label: "Modified" },
  deleted: { letter: "D", className: "bg-red-600/10 text-red-600", label: "Deleted" },
}

const DATE_INPUT =
  "h-8 rounded-md border border-black/20 bg-white px-2 text-xs text-foreground dark:border-white/20 dark:bg-card"

const dayTitle = (date: string) => format(new Date(`${date}T00:00:00`), "EEE, dd MMM yyyy")

export function FileActivityPanel({
  repo,
  branch,
  authors,
  keyword,
}: {
  repo: RepoKey
  branch: string
  authors: string[]
  keyword: string
}) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [view, setView] = useState<View>("names")

  const query = useQuery({
    queryKey: ["penguin", "files", repo, branch, authors, from, to],
    queryFn: async (): Promise<FileActivity> => {
      const params = new URLSearchParams({ repo, branch, from, to })
      for (const name of authors) params.append("author", name)
      const res = await fetch(`/penguin/api/git/files?${params}`)
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.message ?? "Could not read the files")
      return body
    },
  })

  const days = useMemo(() => {
    const words = keyword.trim()
    return (query.data?.days ?? [])
      .map((day) => ({ ...day, files: words ? day.files.filter((f) => matchesQuery(words, [f.path])) : day.files }))
      .filter((day) => day.files.length > 0)
  }, [query.data, keyword])

  const total = days.reduce((sum, day) => sum + day.files.length, 0)
  const invalid = !!from && !!to && from > to

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <label className="flex items-center gap-2">
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className={DATE_INPUT}
          />
        </label>
        <label className="flex items-center gap-2">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            className={DATE_INPUT}
          />
        </label>
        {(from || to) && (
          <button
            type="button"
            className="cursor-pointer underline-offset-2 hover:underline"
            onClick={() => {
              setFrom("")
              setTo("")
            }}
          >
            Clear dates
          </button>
        )}
        <NextTabs
          value={view}
          onValueChange={(next) => setView(next as View)}
          shouldPersist={false}
          delayTabs={false}
          tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
          tabs={[
            { value: "names", label: "Verbose", component: null },
            { value: "count", label: "Data", component: null },
          ]}
        />
        <span>
          {total} {total === 1 ? "file" : "files"} across {days.length} {days.length === 1 ? "day" : "days"}
        </span>
        {query.data?.truncated && <span>Showing the latest 5000 commits.</span>}
      </div>

      {invalid ? (
        <div className="p-20 text-center text-sm text-muted-foreground">The start date is after the end date.</div>
      ) : query.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : query.isError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {query.error.message}
        </div>
      ) : days.length === 0 ? (
        <div className="p-20 text-center text-sm text-muted-foreground">No files changed for these filters.</div>
      ) : (
        <ol>
          {days.map((day, i) => (
            <li
              key={day.date}
              className={cn(
                "relative grid gap-x-4 md:grid-cols-[9rem_minmax(0,1fr)]",
                i > 0 &&
                  "before:absolute before:inset-x-0 before:-top-3 before:border-t before:border-dashed before:border-border dark:before:border-white/50",
              )}
            >
              <div className="pb-2 md:sticky md:top-2 md:self-start md:pb-0 md:pt-2.5 md:text-right">
                <h3 className="text-xs font-semibold text-black/50 dark:text-white/50">{dayTitle(day.date)}</h3>
                <p className="text-xs text-muted-foreground">
                  {day.commits} {day.commits === 1 ? "commit" : "commits"}
                </p>
              </div>
              <div className="relative min-w-0 pb-6">
                <div className="overflow-hidden rounded-xl border bg-card">
                  <div className="flex items-center gap-2 px-4 py-2 text-xs">
                    <span className="font-medium">{day.files.length}</span>
                    <span className="text-muted-foreground">
                      {day.files.length === 1 ? "file changed" : "files changed"}
                    </span>
                  </div>
                  {view === "names" && (
                    <ul className="divide-y border-t">
                      {day.files.map((file) => (
                        <li key={file.path} className="flex items-center gap-2 px-4 py-1.5 text-xs">
                          <span
                            title={CHANGE[file.change].label}
                            className={cn("rounded-sm px-1.5 py-0.5 font-mono", CHANGE[file.change].className)}
                          >
                            {CHANGE[file.change].letter}
                          </span>
                          <code className="min-w-0 flex-1 truncate font-mono">
                            <Highlight text={file.path} />
                          </code>
                          {file.commits > 1 && (
                            <span className="shrink-0 text-muted-foreground">{file.commits} commits</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

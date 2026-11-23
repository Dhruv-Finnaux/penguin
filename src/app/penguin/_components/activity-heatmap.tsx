"use client"

import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { matchesQuery } from "../_lib/fuzzy"
import type { ActivityAuthor, ActivityData, RepoKey } from "../_lib/types"
import { Highlight } from "./highlight"
import { NextTabs } from "./penguin-tabs"

type Metric = "lines" | "files"
type Size = "small" | "large"

const columnsFor = (_size: Size, count: number) => `repeat(${count}, minmax(0, 1fr))`

const hueFor = (index: number) => 205 + ((index * 37) % 125)
const WEEKS = 52
const PAGE = 6
const DAY_MS = 86_400_000

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function value(day: ActivityAuthor["days"][string] | undefined, metric: Metric) {
  if (!day) return 0
  return metric === "lines" ? day.insertions + day.deletions : day.files
}

function Cell({
  hue,
  amount,
  label,
  muted,
  size,
}: {
  hue: number
  amount: number
  size: Size
  label: string
  muted?: boolean
}) {
  const style = amount > 0 ? { background: `hsl(${hue} 80% ${60 - amount * 32}% / ${0.4 + amount * 0.6})` } : undefined
  return (
    <div
      title={label}
      style={style}
      className={cn(
        "aspect-square w-full transition-colors duration-500 ease-out",
        size === "small" ? "rounded-[1px]" : "rounded-[3px]",
        amount === 0 && "bg-black/[0.07] dark:bg-white/[0.05]",
        muted && "opacity-0",
      )}
    />
  )
}

function AuthorHeatmap({
  author,
  hue,
  metric,
  weeks,
  months,
  max,
  index,
  size,
}: {
  size: Size
  months: string[]
  author: ActivityAuthor
  hue: number
  metric: Metric
  weeks: Date[]
  max: number
  index: number
}) {
  const todayKey = dayKey(new Date())

  return (
    <div
      style={{
        animation: `heat-card-in 450ms ${Math.min(index, 6) * 80}ms ease-out both`,
        contentVisibility: "auto",
        containIntrinsicSize: "auto 170px",
      }}
      className={cn("max-w-full space-y-2 rounded-xl border border-dashed bg-card", size === "small" ? "p-2.5" : "p-4")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="min-w-0 truncate text-sm font-semibold">
          <Highlight text={author.name} />
        </h3>
        <div className="ml-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{author.commits} {author.commits === 1 ? "commit" : "commits"}</span>
          <span className="rounded-sm bg-green-600/10 px-1 py-0.5 text-green-600">+{author.insertions}</span>
          <span className="rounded-sm bg-red-600/10 px-1 py-0.5 text-red-600">-{author.deletions}</span>
        </div>
      </div>

      <div
        className={cn("grid text-muted-foreground", size === "small" ? "text-[7px]" : "text-[10px]", size === "small" ? "gap-px" : "gap-[3px]")}
        style={{ gridTemplateColumns: columnsFor(size, weeks.length) }}>
        {months.map((label, w) => (
          <span key={w} className="overflow-visible whitespace-nowrap">
            {label}
          </span>
        ))}
      </div>

      <div
        className={cn("grid grid-flow-col", size === "small" ? "gap-px" : "gap-[3px]")}
        style={{ gridTemplateColumns: columnsFor(size, weeks.length), gridTemplateRows: "repeat(7, auto)" }}>
        {weeks.flatMap((week) =>
          Array.from({ length: 7 }, (_, d) => {
            const date = new Date(week.getTime() + d * DAY_MS)
            const key = dayKey(date)
            const day = author.days[key]
            const amount = value(day, metric)
            const scaled = amount > 0 && max > 0 ? Math.sqrt(amount / max) : 0
            return (
              <Cell
                key={key}
                hue={hue}
                size={size}
                amount={scaled}
                muted={key > todayKey}
                label={
                  day
                    ? `${key}: ${day.commits} commits, ${day.files} files, +${day.insertions} -${day.deletions}`
                    : `${key}: no changes`
                }
              />
            )
          }),
        )}
      </div>
    </div>
  )
}

async function fetchActivity(repo: RepoKey, branch: string): Promise<ActivityData> {
  const res = await fetch(`/penguin/api/git/activity?repo=${repo}&branch=${encodeURIComponent(branch)}`)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.message ?? "Could not load the activity")
  return body as ActivityData
}

export function ActivityHeatmap({
  repo,
  branch,
  keyword,
  authors: picked = [],
}: {
  repo: RepoKey
  branch: string
  keyword: string
  authors?: string[]
}) {
  const metric: Metric = "lines"
  const [size, setSize] = useState<Size>("small")
  const [shown, setShown] = useState(PAGE)
  const query = useQuery({
    queryKey: ["penguin", "activity", repo, branch],
    queryFn: () => fetchActivity(repo, branch),
  })

  // Weeks start on Sunday and run up to the current one.
  const weeks = useMemo(() => {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const start = new Date(today.getTime() - today.getDay() * DAY_MS - (WEEKS - 1) * 7 * DAY_MS)
    return Array.from({ length: WEEKS }, (_, w) => new Date(start.getTime() + w * 7 * DAY_MS))
  }, [])

  const months = useMemo(
    () =>
      weeks.map((week, w) => {
        const month = week.getMonth()
        return w === 0 || weeks[w - 1].getMonth() !== month ? MONTHS[month] : ""
      }),
    [weeks],
  )

  const authors = useMemo(
    () => {
      const first = dayKey(weeks[0])
      const recent = (a: ActivityAuthor) =>
        Object.entries(a.days).reduce((sum, [key, day]) => (key >= first ? sum + value(day, metric) : sum), 0)
      return (query.data?.authors ?? [])
        .filter((a) => (picked.length === 0 || picked.includes(a.name)) && matchesQuery(keyword, [a.name]))
        .sort((a, b) => recent(b) - recent(a))
    },
    [query.data, keyword, picked, weeks, metric],
  )

  // One scale per metric across everyone, so heat maps can be compared with each other.
  const max = useMemo(() => {
    let top = 0
    for (const author of query.data?.authors ?? []) {
      for (const day of Object.values(author.days)) top = Math.max(top, value(day, metric))
    }
    return top
  }, [query.data, metric])

  if (query.isLoading) return <LoadingIndicatorView className="min-h-[60vh]" />
  if (query.isError) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
        {query.error.message}
      </div>
    )
  }
  if (!query.data || query.data.authors.length === 0) {
    return <div className="p-20 text-center text-sm text-muted-foreground">No commits on this branch.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <NextTabs
          value={size}
          onValueChange={(next) => setSize(next as Size)}
          shouldPersist={false}
          delayTabs={false}
          tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
          tabs={[
            { value: "small", label: "Small", component: null },
            { value: "large", label: "Large", component: null },
          ]}
        />
        <span>Last {WEEKS} weeks, each square is a day. Darker means more.</span>
        {query.data.truncated && <span>Showing the latest 5000 commits.</span>}
      </div>

      {authors.length === 0 && (
        <div className="p-20 text-center text-sm text-muted-foreground">No contributors match.</div>
      )}
      <div className={cn("gap-3", size === "small" ? "grid grid-cols-3 items-start" : "flex flex-col")}>
        {authors.slice(0, shown).map((author, i) => (
          <div key={author.name} className="min-w-0">
            <AuthorHeatmap
              author={author}
              hue={hueFor(query.data.authors.findIndex((a) => a.name === author.name))}
              metric={metric}
              weeks={weeks}
              months={months}
              max={max}
              size={size}
              index={i}
            />
          </div>
        ))}
      </div>
      {authors.length > shown && (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE)}
          className="w-full cursor-pointer rounded-xl border border-dashed py-2 text-xs text-muted-foreground hover:bg-accent/30">
          Show more contributors ({authors.length - shown} left)
        </button>
      )}
    </div>
  )
}

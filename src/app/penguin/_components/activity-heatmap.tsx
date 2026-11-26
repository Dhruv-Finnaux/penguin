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
type View = "heatmap" | "graph"

const columnsFor = (count: number) => `repeat(${count}, minmax(0, 1fr))`

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

function Cell({ hue, amount, label, muted }: { hue: number; amount: number; label: string; muted?: boolean }) {
  const style = amount > 0 ? { background: `hsl(${hue} 80% ${60 - amount * 32}% / ${0.4 + amount * 0.6})` } : undefined
  return (
    <div
      title={label}
      style={style}
      className={cn(
        "aspect-square w-full rounded-[1px] transition-colors duration-500 ease-out",
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
}: {
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
      className="max-w-full space-y-2 rounded-xl border border-dashed bg-card p-2.5"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="min-w-0 truncate text-sm font-semibold">
          <Highlight text={author.name} />
        </h3>
        <div className="ml-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            {author.commits} {author.commits === 1 ? "commit" : "commits"}
          </span>
          <span className="rounded-sm bg-green-600/10 px-1 py-0.5 text-green-600">+{author.insertions}</span>
          <span className="rounded-sm bg-red-600/10 px-1 py-0.5 text-red-600">-{author.deletions}</span>
        </div>
      </div>

      <div
        className="grid gap-px text-[7px] text-muted-foreground"
        style={{ gridTemplateColumns: columnsFor(weeks.length) }}
      >
        {months.map((label, w) => (
          <span key={w} className="overflow-visible whitespace-nowrap">
            {label}
          </span>
        ))}
      </div>

      <div
        className="grid grid-flow-col gap-px"
        style={{ gridTemplateColumns: columnsFor(weeks.length), gridTemplateRows: "repeat(7, auto)" }}
      >
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

// Monotone cubic interpolation: a smooth line that never dips below a point or overshoots a peak.
function smoothPath(points: [number, number][]) {
  const n = points.length
  if (n < 2) return ""
  const dx = points.slice(1).map((p, i) => p[0] - points[i][0])
  const slope = points.slice(1).map((p, i) => (p[1] - points[i][1]) / dx[i])
  const tangent = points.map((_, i) => {
    if (i === 0) return slope[0]
    if (i === n - 1) return slope[n - 2]
    return slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2
  })
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0
      tangent[i + 1] = 0
      continue
    }
    const a = tangent[i] / slope[i]
    const b = tangent[i + 1] / slope[i]
    const h = Math.hypot(a, b)
    if (h > 3) {
      tangent[i] = (3 * a * slope[i]) / h
      tangent[i + 1] = (3 * b * slope[i]) / h
    }
  }
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < n - 1; i++) {
    const w = dx[i] / 3
    d += ` C${points[i][0] + w},${points[i][1] + tangent[i] * w} ${points[i + 1][0] - w},${points[i + 1][1] - tangent[i + 1] * w} ${points[i + 1][0]},${points[i + 1][1]}`
  }
  return d
}

const W = 1000
const H = 260
const PAD = { left: 34, right: 12, top: 14, bottom: 26 }

function CommitGraph({ authors, weeks }: { authors: ActivityAuthor[]; weeks: Date[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const today = dayKey(new Date())

  // Starts a few days before the first commit, so a young branch is not a flat line.
  const series = useMemo(() => {
    const days: { key: string; commits: number }[] = []
    for (let i = 0; i < weeks.length * 7; i++) {
      const key = dayKey(new Date(weeks[0].getTime() + i * DAY_MS))
      if (key > today) break
      days.push({ key, commits: authors.reduce((sum, a) => sum + (a.days[key]?.commits ?? 0), 0) })
    }
    const first = days.findIndex((d) => d.commits > 0)
    return first < 0 ? days : days.slice(Math.max(0, first - 3))
  }, [authors, weeks, today])

  const top = Math.max(4, ...series.map((d) => d.commits))
  const step = top <= 8 ? 2 : Math.ceil(top / 4 / 5) * 5
  const yMax = Math.ceil(top / step) * step
  const x = (i: number) => PAD.left + (i / Math.max(1, series.length - 1)) * (W - PAD.left - PAD.right)
  const y = (v: number) => H - PAD.bottom - (v / yMax) * (H - PAD.top - PAD.bottom)
  const points = series.map((d, i) => [x(i), y(d.commits)] as [number, number])
  const line = smoothPath(points)
  const area = `${line} L${x(series.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  const total = series.reduce((sum, d) => sum + d.commits, 0)
  const active = series.filter((d) => d.commits > 0).length
  const hovered = hover === null ? null : series[hover]

  return (
    <div className="space-y-2 rounded-xl border border-dashed bg-card p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          <b className="text-foreground">{total}</b> commits
        </span>
        <span>
          <b className="text-foreground">{active}</b> active days
        </span>
        <span>
          peak <b className="text-foreground">{Math.max(0, ...series.map((d) => d.commits))}</b> in a day
        </span>
        <span className="ml-auto">
          {hovered ? (
            <>
              {hovered.key}: <b className="text-foreground">{hovered.commits}</b>{" "}
              {hovered.commits === 1 ? "commit" : "commits"}
            </>
          ) : (
            "Hover the graph for a day"
          )}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full text-blue-600 dark:text-blue-400"
        onPointerLeave={() => setHover(null)}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - box.left) / box.width) * W
          const i = Math.round(((px - PAD.left) / (W - PAD.left - PAD.right)) * (series.length - 1))
          setHover(Math.max(0, Math.min(series.length - 1, i)))
        }}
      >
        <defs>
          <linearGradient id="commit-graph-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: yMax / step + 1 }, (_, i) => i * step).map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              className="stroke-black/10 dark:stroke-white/10"
            />
            <text x={PAD.left - 6} y={y(v) + 3} textAnchor="end" className="fill-muted-foreground text-[10px]">
              {v}
            </text>
          </g>
        ))}
        {series.map((d, i) =>
          (i === 0 || d.key.slice(5, 7) !== series[i - 1].key.slice(5, 7)) && (i === 0 || x(i) - x(0) > 40) ? (
            <text key={d.key} x={x(i)} y={H - 8} className="fill-muted-foreground text-[10px]">
              {MONTHS[Number(d.key.slice(5, 7)) - 1]}
            </text>
          ) : null,
        )}
        <path d={area} fill="url(#commit-graph-fill)" />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={y(0)} className="stroke-black/20 dark:stroke-white/20" />
            <circle
              cx={x(hover)}
              cy={y(series[hover].commits)}
              r="4"
              fill="currentColor"
              className="stroke-background"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    </div>
  )
}

async function fetchActivity(repo: RepoKey, branch: string, remote: boolean): Promise<ActivityData> {
  const res = await fetch(
    `/penguin/api/git/activity?repo=${repo}&branch=${encodeURIComponent(branch)}&remote=${remote ? 1 : 0}`,
  )
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.message ?? "Could not load the activity")
  return body as ActivityData
}

export function ActivityHeatmap({
  repo,
  branch,
  keyword,
  authors: picked = [],
  showRemote = true,
}: {
  repo: RepoKey
  branch: string
  keyword: string
  authors?: string[]
  showRemote?: boolean
}) {
  const metric: Metric = "lines"
  const [view, setView] = useState<View>("heatmap")
  const [shown, setShown] = useState(PAGE)
  const query = useQuery({
    queryKey: ["penguin", "activity", repo, branch, showRemote],
    queryFn: () => fetchActivity(repo, branch, showRemote),
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

  const authors = useMemo(() => {
    const first = dayKey(weeks[0])
    const recent = (a: ActivityAuthor) =>
      Object.entries(a.days).reduce((sum, [key, day]) => (key >= first ? sum + value(day, metric) : sum), 0)
    return (query.data?.authors ?? [])
      .filter((a) => (picked.length === 0 || picked.includes(a.name)) && matchesQuery(keyword, [a.name]))
      .sort((a, b) => recent(b) - recent(a))
  }, [query.data, keyword, picked, weeks, metric])

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
          value={view}
          onValueChange={(next) => setView(next as View)}
          shouldPersist={false}
          delayTabs={false}
          tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
          tabs={[
            { value: "heatmap", label: "Heatmap", component: null },
            { value: "graph", label: "Graph", component: null },
          ]}
        />
        <span>
          {view === "heatmap"
            ? `Last ${WEEKS} weeks, each square is a day. Darker means more.`
            : `Commits per day, from the first commit in the last ${WEEKS} weeks.`}
        </span>
        {query.data.truncated && <span>Showing the latest 5000 commits.</span>}
      </div>

      {authors.length === 0 && (
        <div className="p-20 text-center text-sm text-muted-foreground">No contributors match.</div>
      )}
      {view === "graph" ? (
        authors.length > 0 && <CommitGraph authors={authors} weeks={weeks} />
      ) : (
        <div className="grid grid-cols-3 items-start gap-3">
          {authors.slice(0, shown).map((author, i) => (
            <div key={author.name} className="min-w-0">
              <AuthorHeatmap
                author={author}
                hue={hueFor(query.data.authors.findIndex((a) => a.name === author.name))}
                metric={metric}
                weeks={weeks}
                months={months}
                max={max}
                index={i}
              />
            </div>
          ))}
        </div>
      )}
      {view === "heatmap" && authors.length > shown && (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE)}
          className="w-full cursor-pointer rounded-xl border border-dashed py-2 text-xs text-muted-foreground hover:bg-accent/30"
        >
          Show more contributors ({authors.length - shown} left)
        </button>
      )}
    </div>
  )
}

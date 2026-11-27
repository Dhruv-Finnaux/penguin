"use client"

import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { XIcon } from "lucide-react"
import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { matchesQuery } from "../_lib/fuzzy"
import {
  branchColorName,
  branchKey,
  colorForBranch,
  layoutGraph,
  type GraphEdge,
  type GraphLayout,
  type GraphRow,
} from "../_lib/graph-layout"
import type { CommitInfo, CommitPage, Contributor, GraphData, RepoInfo, RepoKey, Review } from "../_lib/types"
import { CommitTimeline } from "./commits-tab"
import { CopyHash } from "./copy-hash"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { ActivityHeatmap } from "./activity-heatmap"
import { FileActivityPanel } from "./file-activity"
import { SearchBox } from "./search-box"
import { NextTabs } from "./penguin-tabs"

const ALL_BRANCHES = "__all__"
const PAGE_SIZE = 50
const FLOW_STEP = 300
const ROW_H = 40
const COL_W = 24
const DATE_W = 92

type Mode = "verbose" | "flow" | "data" | "files" | "options"

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.message ?? "Could not load the history")
  return body as T
}

const branchLabel = (branch: string) => (branch === ALL_BRANCHES ? "All branches" : branch)

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
      <span>{message}</span>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

// A switch whose thumb slides between the two ends.
function Switch({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex h-8 items-center gap-2 rounded-lg border border-dashed bg-card px-2.5 text-xs font-medium"
    >
      {label && <span className="text-foreground/80">{label}</span>}
      <span
        className={cn(
          "relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors duration-300 ease-out",
          checked ? "bg-emerald-600" : "bg-foreground/20",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out",
            checked && "translate-x-3",
          )}
        />
      </span>
    </button>
  )
}

// The view options: each one is a switch, and they all stay open while you flip them.
function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <NextTabs
      value={value}
      onValueChange={(next) => onChange(next as T)}
      shouldPersist={false}
      delayTabs={false}
      tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
      tabs={options.map((option) => ({ ...option, component: null }))}
    />
  )
}

function VerboseHistory({
  repo,
  branch,
  reviews,
  keyword,
  authors,
  showRemote,
  onlyBranches,
}: {
  repo: RepoKey
  branch: string
  reviews: Review[]
  keyword: string
  authors: string[]
  showRemote: boolean
  /** The branches switched on in the Options tab. */
  onlyBranches: string[]
}) {
  const [openHash, setOpenHash] = useState<string | null>(null)

  const query = useInfiniteQuery({
    queryKey: ["penguin", "log", repo, branch, authors, showRemote, onlyBranches],
    queryFn: ({ pageParam }) =>
      getJson<CommitPage>(
        `/penguin/api/git/log?repo=${repo}&branch=${encodeURIComponent(branch)}&remote=${showRemote ? 1 : 0}&shown=${encodeURIComponent(onlyBranches.join(","))}&skip=${pageParam}&limit=${PAGE_SIZE}${authors
          .map((name) => `&author=${encodeURIComponent(name)}`)
          .join("")}`,
      ),
    initialPageParam: 0,
    getNextPageParam: (last, pages) =>
      last.hasMore ? pages.reduce((sum, page) => sum + page.commits.length, 0) : undefined,
  })

  // Reviews come from the page props so a new /howismycommit run shows up on refresh.
  const reviewByHash = useMemo(() => {
    const map = new Map<string, Review>()
    for (const review of reviews) {
      const hash = review.target.commit
      if (review.repo === repo && hash && !map.has(hash)) map.set(hash, review)
    }
    return map
  }, [reviews, repo])

  const commits = useMemo<CommitInfo[]>(
    () =>
      (query.data?.pages.flatMap((page) => page.commits) ?? []).map((commit) => ({
        ...commit,
        branches: showRemote ? commit.branches : commit.branches?.filter((name) => !name.startsWith("origin/")),
        review: reviewByHash.get(commit.hash) ?? null,
      })),
    [query.data, reviewByHash, showRemote],
  )

  const matching = useMemo(() => {
    if (!keyword.trim()) return commits
    return commits.filter((commit) =>
      matchesQuery(keyword, [commit.hash, commit.subject, commit.author, ...commit.files.map((f) => f.path)]),
    )
  }, [commits, keyword])

  if (query.isLoading) {
    return <LoadingIndicatorView className="min-h-[60vh]" />
  }
  if (query.isError) return <ErrorBox message={query.error.message} onRetry={() => query.refetch()} />

  return (
    <div className="space-y-4">
      {commits.length === 0 ? (
        <Card className="border-0 p-20 text-center text-sm text-muted-foreground">
          No commits{authors.length > 0 ? ` by ${authors.join(", ")}` : ""} on {branchLabel(branch)}.
        </Card>
      ) : (
        <CommitTimeline
          commits={matching}
          openHash={openHash}
          onToggle={(hash) => setOpenHash((current) => (current === hash ? null : hash))}
        />
      )}
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span>
          {keyword.trim() ? `${matching.length} of ` : ""}
          {commits.length} commits loaded
          {authors.length > 0 && ` · ${authors.length === 1 ? authors[0] : `${authors.length} contributors`}`}
        </span>
        {query.hasNextPage && (
          <Button
            size="sm"
            variant="outline"
            loading={query.isFetchingNextPage}
            disabled={query.isFetchingNextPage}
            onClick={() => query.fetchNextPage()}
          >
            Load {PAGE_SIZE} more
          </Button>
        )}
      </div>
    </div>
  )
}

// Horizontal flow: commits run left to right, lanes run top to bottom.
const HCOL_W = 124
const HLANE_H = 104
const HTOP = 36
const HDOT = 14

function edgePath(fromRow: number, fromCol: number, toRow: number, toCol: number, kind: string, horizontal = false) {
  // Work in lane (L) and row (R) coordinates, then map back to x and y.
  const rowSpan = horizontal ? HCOL_W : ROW_H
  const at = (row: number, col: number): [number, number] =>
    horizontal
      ? [row * HCOL_W + HCOL_W / 2, HTOP + col * HLANE_H + HDOT]
      : [col * COL_W + COL_W / 2, row * ROW_H + ROW_H / 2]
  const [x1, y1] = at(fromRow, fromCol)
  const [x2, y2] = at(toRow, toCol)
  const [L1, R1] = horizontal ? [y1, x1] : [x1, y1]
  const [L2, R2] = horizontal ? [y2, x2] : [x2, y2]
  const P = (l: number, r: number) => (horizontal ? `${r},${l}` : `${l},${r}`)
  if (kind === "straight" || kind === "open" || L1 === L2) return `M${P(L1, R1)}L${P(L2, R2)}`
  if (kind === "fork") {
    // Along its own lane, then bend into the commit it branched from.
    const bend = R2 - rowSpan
    return `M${P(L1, R1)}L${P(L1, bend)}C${P(L1, bend + rowSpan / 2)} ${P(L2, bend + rowSpan / 2)} ${P(L2, R2)}`
  }
  // Merge: bend into the merged lane right away, then run along it to its commit.
  const bend = R1 + rowSpan
  return `M${P(L1, R1)}C${P(L1, R1 + rowSpan / 2)} ${P(L2, R1 + rowSpan / 2)} ${P(L2, bend)}L${P(L2, R2)}`
}
const BRANCH_CATEGORY_ORDER = ["main", "dev", "feat", "fix", "refactor", "hotfix"] as const
const OTHER_CATEGORY_RANK = BRANCH_CATEGORY_ORDER.length

type BranchCategoryRank = 0 | 1 | 2 | 3 | 4 | 5 | typeof OTHER_CATEGORY_RANK

function getBranchCategoryRank(branchName: string): BranchCategoryRank {
  const normalized = branchName.trim().toLowerCase()

  if (normalized === "main") return 0
  if (normalized === "dev" || normalized === "develop") return 1

  const prefix = normalized.split("/")[0]
  if (prefix === "feat" || prefix === "feature") return 2
  if (prefix === "fix" || prefix === "bugfix") return 3
  if (prefix === "refactor") return 4
  if (prefix === "hotfix") return 5

  return OTHER_CATEGORY_RANK
}

function getCategoryLabel(rank: BranchCategoryRank): string | null {
  return rank < OTHER_CATEGORY_RANK ? ((BRANCH_CATEGORY_ORDER as readonly string[])[rank] ?? null) : "other"
}

function sortBranchEntries(entries: [string, string][]): [string, string][] {
  return [...entries].sort(([nameA], [nameB]) => {
    const rankDiff = getBranchCategoryRank(nameA) - getBranchCategoryRank(nameB)
    if (rankDiff !== 0) return rankDiff
    return nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
  })
}

function groupBranchesByCategory(entries: [string, string][]): {
  rank: BranchCategoryRank
  label: string | null
  items: [string, string][]
}[] {
  const buckets = new Map<BranchCategoryRank, [string, string][]>()

  for (const [name, color] of sortBranchEntries(entries)) {
    const rank = getBranchCategoryRank(name)
    const bucket = buckets.get(rank) ?? []
    bucket.push([name, color])
    buckets.set(rank, bucket)
  }

  return Array.from(buckets.entries())
    .sort(([rankA], [rankB]) => rankA - rankB)
    .map(([rank, items]) => ({
      rank,
      label: getCategoryLabel(rank),
      items,
    }))
}

// The layout without the hidden branches: their rows and the lines that touch them are dropped.
function hideBranches(layout: GraphLayout, hidden: Set<string>): GraphLayout {
  if (hidden.size === 0) return layout
  const kept = new Map<number, number>()
  const rows: GraphRow[] = []
  layout.rows.forEach((row, index) => {
    if (row.lane && hidden.has(row.lane)) return
    kept.set(index, rows.length)
    rows.push(row)
  })
  const edges: GraphEdge[] = []
  for (const edge of layout.edges) {
    const from = kept.get(edge.fromRow)
    if (from === undefined) continue
    // A line still open at the bottom of the history stays open.
    if (edge.toRow >= layout.rows.length) {
      edges.push({ ...edge, fromRow: from, toRow: rows.length })
      continue
    }
    const to = kept.get(edge.toRow)
    if (to === undefined) continue
    edges.push({ ...edge, fromRow: from, toRow: to })
  }
  return { ...layout, rows, edges }
}

// Authors always use the same green as main, so the legend reads the same on every repo and tab.
function authorColor() {
  return colorForBranch("main")
}

// One toggle in the legend: the name is plain text, the track takes the colour when it is on.
// The entries that are on come first; the rest keep their order.
function onFirst<T>(items: T[], isOn: (item: T) => boolean) {
  return [...items].sort((a, b) => Number(isOn(b)) - Number(isOn(a)))
}

// A list of legend toggles that scrolls past five rows. Entries that change place glide to their new spot,
// and a fade with a count at the bottom says how many entries are still out of sight.
function ListColumn({
  children,
  className,
  innerClassName = "flex flex-col gap-1",
  innerStyle,
}: {
  children: ReactNode
  className?: string
  innerClassName?: string
  innerStyle?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const tops = useRef(new Map<string, number>())
  const [more, setMore] = useState(0)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const edge = el.scrollTop + el.clientHeight
    let hiddenBelow = 0
    el.querySelectorAll<HTMLElement>("[data-flip]").forEach((node) => {
      if (node.offsetTop + node.offsetHeight / 2 > edge) hiddenBelow++
    })
    setMore(hiddenBelow)
  }, [])

  // FLIP: remember where each entry was, and after a reorder slide it from there to where it is now.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const next = new Map<string, number>()
    el.querySelectorAll<HTMLElement>("[data-flip]").forEach((node) => {
      const key = node.dataset.flip ?? ""
      next.set(key, node.offsetTop)
      const before = tops.current.get(key)
      if (before === undefined || before === node.offsetTop) return
      node.style.transition = "none"
      node.style.transform = `translateY(${before - node.offsetTop}px)`
      // Reading offsetHeight forces the start position to be painted before the transition starts.
      void node.offsetHeight
      node.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)"
      node.style.transform = ""
    })
    tops.current = next
    measure()
  })

  return (
    <div className={cn("relative min-w-0", className)}>
      <div
        ref={ref}
        onScroll={measure}
        className={cn("relative max-h-[11rem] overflow-y-auto", innerClassName)}
        style={innerStyle}
      >
        {children}
      </div>
      {more > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-9 items-end justify-center bg-gradient-to-t from-background via-background/80 to-transparent pb-0.5">
          <span className="rounded-full border border-dashed bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            ↓ {more} more
          </span>
        </div>
      )}
    </div>
  )
}

function LegendToggle({
  name,
  on,
  color,
  title,
  onClick,
}: {
  name: string
  on: boolean
  color: string
  title: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-flip={name}
      title={title}
      onClick={onClick}
      className="inline-flex h-8 shrink-0 w-full items-center justify-between gap-2 rounded-lg border border-dashed bg-card px-2.5 text-xs font-medium"
    >
      <span className={cn("truncate", on ? "text-foreground/80" : "text-foreground/50")}>{name}</span>
      <span
        className="relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors duration-300 ease-out"
        style={{
          background: on ? color : "hsl(var(--muted-foreground) / 0.35)",
        }}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out",
            on && "translate-x-3",
          )}
        />
      </span>
    </button>
  )
}

// The legend of the Options tab. Its switches (remote branches, horizontal flow) live here only, and it lists
// the branches and the authors as toggles: a branch that is off is hidden from the flow, an author that is
// off is dimmed out of it. Nothing is sticky, so it scrolls away with the page.
function FlowLegend({
  entries,
  hidden,
  onToggle,
  onShowAll,
  onResetBranches,
  contributors,
  authors,
  onAuthors,
  showRemote,
  onShowRemote,
  horizontal,
  onHorizontal,
}: {
  entries: [string, string][]
  hidden: Set<string>
  onToggle: (name: string) => void
  onShowAll: () => void
  onResetBranches: () => void
  contributors: Contributor[]
  authors: string[]
  onAuthors: (next: string[] | null) => void
  showRemote: boolean
  onShowRemote: (next: boolean) => void
  horizontal: boolean
  onHorizontal: (next: boolean) => void
}) {
  const columns = groupBranchesByCategory(entries)
  const names = contributors.map((c) => c.name)
  // An empty selection means everyone, so every author reads as on until one is switched off.
  const isOn = (name: string) => authors.length === 0 || authors.includes(name)
  const toggleAuthor = (name: string) => {
    const base = authors.length === 0 ? names : authors
    onAuthors(base.includes(name) ? base.filter((n) => n !== name) : [...base, name])
  }
  const columnCount = columns.length

  return (
    <div className="space-y-2 rounded-xl border border-dashed px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <Switch checked={showRemote} onChange={onShowRemote} label="Remote branches" />
        <Switch checked={horizontal} onChange={onHorizontal} label="Horizontal flow" />
        {entries.length > 0 && (
          <Switch
            checked={hidden.size === 0}
            onChange={(on) => (on ? onShowAll() : onResetBranches())}
            label="Show all"
          />
        )}
      </div>
      {columnCount > 0 && (
        <div className="border-t border-dashed pt-2">
          <div
            className="grid gap-2 overflow-x-auto"
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(7.5rem, 1fr))` }}
          >
            {columns.map(({ rank, items }) => (
              <ListColumn key={rank}>
                {onFirst(items, (entry) => !hidden.has(entry[0])).map(([name]) => {
                  const on = !hidden.has(name)
                  return (
                    <LegendToggle
                      key={name}
                      name={name}
                      on={on}
                      color={colorForBranch(name)}
                      title={on ? `Hide ${name}` : `Show ${name}`}
                      onClick={() => onToggle(name)}
                    />
                  )
                })}
              </ListColumn>
            ))}
          </div>
        </div>
      )}
      {names.length > 0 && (
        <div className="border-t border-dashed pt-2">
          <ListColumn
            innerClassName="grid gap-1"
            innerStyle={{ gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))" }}
          >
            {onFirst(names, isOn).map((name) => {
              const on = isOn(name)
              return (
                <LegendToggle
                  key={name}
                  name={name}
                  on={on}
                  color={authorColor()}
                  title={on ? `Dim ${name}` : `Show ${name}`}
                  onClick={() => toggleAuthor(name)}
                />
              )
            })}
          </ListColumn>
        </div>
      )}
    </div>
  )
}

function FlowHorizontal({
  rows,
  edges,
  columns,
  total,
  truncated,
  matches,
  selected,
  onMore,
}: {
  rows: GraphRow[]
  edges: GraphEdge[]
  columns: number
  total: number
  truncated: boolean
  matches: Set<number> | null
  selected: string | null
  onMore: () => void
}) {
  const width = rows.length * HCOL_W
  const height = HTOP + columns * HLANE_H + 40
  const [openHash, setOpenHash] = useState<string | null>(null)
  const shownEdges = edges.filter((edge) => edge.fromRow < rows.length)
  const dim = (color: string) => selected !== null && selected !== color
  const delay = (row: number) => Math.min(row, 40) * 14
  const remaining = total - rows.length

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border bg-card p-3">
        <div className="relative" style={{ width, height }}>
          <svg width={width} height={height} className="absolute left-0 top-0 overflow-visible" aria-hidden>
            {shownEdges.map((edge, i) => (
              <path
                key={i}
                d={edgePath(edge.fromRow, edge.fromCol, edge.toRow, edge.toCol, edge.kind, true)}
                stroke={edge.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={edge.kind === "open" ? undefined : 1}
                strokeDasharray={edge.kind === "open" ? "3 5" : 1}
                fill="none"
                className="transition-opacity duration-300"
                style={{
                  opacity: dim(edge.color) ? 0.12 : edge.kind === "open" ? 0.35 : 0.9,
                  animation:
                    edge.kind === "open" ? undefined : `flow-draw 700ms ${delay(edge.fromRow)}ms ease-out both`,
                }}
              />
            ))}
            {rows.map((row, i) => {
              const cx = i * HCOL_W + HCOL_W / 2
              const cy = HTOP + row.col * HLANE_H + HDOT
              const faded = (matches && !matches.has(i)) || dim(row.color)
              return (
                <g
                  key={row.commit.hash}
                  className="transition-opacity duration-300"
                  style={{
                    opacity: faded ? 0.2 : 1,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animation: `heat-in 450ms ${delay(i)}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                  }}
                >
                  {row.tips.length > 0 && <circle cx={cx} cy={cy} r={10} fill={row.color} opacity={0.18} />}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={row.tips.length > 0 ? 6 : 4.5}
                    fill={row.tips.length > 0 ? row.color : "hsl(var(--card))"}
                    stroke={row.color}
                    strokeWidth={row.tips.length > 0 ? 2 : 2.5}
                  />
                </g>
              )
            })}
          </svg>
          {rows.map((row, i) => {
            const date = new Date(row.commit.date)
            const faded = (matches && !matches.has(i)) || dim(row.color)
            const open = openHash === row.commit.hash
            return (
              <div
                key={row.commit.hash}
                onClick={() => setOpenHash(open ? null : row.commit.hash)}
                className={cn(
                  "absolute cursor-pointer space-y-0.5 rounded-md transition-opacity duration-300",
                  faded && "opacity-25",
                  open && "z-10",
                )}
                style={{
                  left: i * HCOL_W + 4,
                  top: HTOP + row.col * HLANE_H + HDOT + 12,
                  width: HCOL_W - 10,
                }}
              >
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-muted-foreground">{format(date, "HH:mm")}</span>
                  <span className="font-semibold" style={{ color: row.color }}>
                    <Highlight text={row.commit.hash.slice(0, 7)} />
                  </span>
                </div>
                {row.tips.map((tip) => (
                  <span
                    key={tip.name}
                    className="block truncate rounded-full px-1.5 text-[10px] font-medium"
                    style={{
                      color: colorForBranch(branchColorName(tip)),
                      background: `${colorForBranch(branchColorName(tip))}1f`,
                    }}
                  >
                    <Highlight text={tip.name} />
                  </span>
                ))}
                {open && (
                  <div
                    className="absolute left-0 top-full mt-2 w-60 space-y-1.5 rounded-lg border bg-card p-3 text-xs shadow-lg"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <CopyHash
                        hash={row.commit.hash}
                        className="rounded px-1 font-semibold"
                        label={<span style={{ color: row.color }}>{row.commit.hash.slice(0, 7)}</span>}
                      />
                      <button
                        type="button"
                        aria-label="Close"
                        onClick={() => setOpenHash(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </div>
                    <p className="font-medium leading-snug">{row.commit.subject}</p>
                    <p className="text-muted-foreground">
                      {row.commit.author} · {format(date, "dd MMM yyyy HH:mm")}
                    </p>
                    {(row.tips.length > 0 || row.lane) && (
                      <p>
                        Branch:{" "}
                        <span style={{ color: row.color }}>{row.tips.map((t) => t.name).join(", ") || row.lane}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span>
          {matches && `${matches.size} matching · `}
          {rows.length} of {total}
          {truncated ? "+" : ""} commits
        </span>
        {remaining > 0 && (
          <Button size="sm" variant="outline" onClick={onMore}>
            Show {Math.min(FLOW_STEP, remaining)} more
          </Button>
        )}
      </div>
    </div>
  )
}

// Branches that start shown in the flow: the checked-out one, dev and main.
const DEFAULT_SHOWN = ["main", "dev"]

// The graph of a repo and which of its branches are hidden. The Options tab and the flow both read it, so they agree.
function useFlowGraph(
  repo: RepoKey,
  branch: string,
  showRemote: boolean,
  currentBranch: string | null,
  hiddenBranches: string[] | null,
  onHiddenBranches: (next: string[]) => void,
) {
  const query = useQuery({
    queryKey: ["penguin", "graph", repo, branch, showRemote],
    queryFn: () =>
      getJson<GraphData>(
        `/penguin/api/git/graph?repo=${repo}&branch=${encodeURIComponent(branch)}&remote=${showRemote ? 1 : 0}`,
      ),
  })
  const layout = useMemo(
    () =>
      query.data
        ? layoutGraph(
            query.data.commits,
            showRemote ? query.data.branches : query.data.branches.filter((b) => !b.remote),
          )
        : null,
    [query.data, showRemote],
  )
  // One entry per branch lane in the flow, in the colour the lane is drawn with.
  const legendEntries = useMemo<[string, string][]>(() => {
    if (!layout) return []
    const seen = new Map<string, string>()
    for (const row of layout.rows) if (row.lane && !seen.has(row.lane)) seen.set(row.lane, row.color)
    return [...seen]
  }, [layout])
  // Until the user changes it, everything except the checked-out branch, dev and main is hidden.
  const defaultHidden = useMemo(() => {
    const shown = new Set([...DEFAULT_SHOWN, ...(currentBranch ? [currentBranch] : [])])
    return legendEntries.map(([name]) => name).filter((name) => !shown.has(name))
  }, [currentBranch, legendEntries])
  const hidden = useMemo(
    () => (hiddenBranches ? new Set(hiddenBranches) : new Set(defaultHidden)),
    [hiddenBranches, defaultHidden],
  )
  const toggleBranch = (name: string) => {
    const next = new Set(hidden)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    onHiddenBranches([...next])
  }
  return { query, layout, legendEntries, defaultHidden, hidden, toggleBranch }
}

// The Options tab: every switch and toggle that shapes the views, kept in one place.
function OptionsPanel({
  repo,
  branch,
  authors,
  onAuthors,
  contributors,
  showRemote,
  onShowRemote,
  horizontal,
  onHorizontal,
  currentBranch,
  hiddenBranches,
  onHiddenBranches,
}: {
  repo: RepoKey
  branch: string
  authors: string[]
  onAuthors: (next: string[] | null) => void
  contributors: Contributor[]
  showRemote: boolean
  onShowRemote: (next: boolean) => void
  horizontal: boolean
  onHorizontal: (next: boolean) => void
  currentBranch: string | null
  hiddenBranches: string[] | null
  onHiddenBranches: (next: string[]) => void
}) {
  const { legendEntries, defaultHidden, hidden, toggleBranch } = useFlowGraph(
    repo,
    branch,
    showRemote,
    currentBranch,
    hiddenBranches,
    onHiddenBranches,
  )
  return (
    <FlowLegend
      entries={legendEntries}
      hidden={hidden}
      onToggle={toggleBranch}
      onShowAll={() => onHiddenBranches([])}
      onResetBranches={() => onHiddenBranches(defaultHidden)}
      contributors={contributors}
      authors={authors}
      onAuthors={onAuthors}
      showRemote={showRemote}
      onShowRemote={onShowRemote}
      horizontal={horizontal}
      onHorizontal={onHorizontal}
    />
  )
}

function FlowHistory({
  repo,
  branch,
  keyword,
  authors,
  showRemote,
  horizontal,
  currentBranch,
  hiddenBranches,
  onHiddenBranches,
}: {
  repo: RepoKey
  branch: string
  keyword: string
  authors: string[]
  showRemote: boolean
  horizontal: boolean
  currentBranch: string | null
  hiddenBranches: string[] | null
  onHiddenBranches: (next: string[]) => void
}) {
  const [more, setMore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const { query, layout, hidden } = useFlowGraph(
    repo,
    branch,
    showRemote,
    currentBranch,
    hiddenBranches,
    onHiddenBranches,
  )
  const visible = useMemo(() => (layout ? hideBranches(layout, hidden) : null), [layout, hidden])

  // The graph cannot drop rows without breaking its lines, so a search dims the rest instead.
  const matches = useMemo(() => {
    if (!visible || (!keyword.trim() && authors.length === 0)) return null
    const found = new Set<number>()
    visible.rows.forEach((row, i) => {
      if (authors.length > 0 && !authors.includes(row.commit.author)) return
      if (!keyword.trim()) return void found.add(i)
      const fields = [row.commit.hash, row.commit.subject, row.commit.author, row.lane ?? ""]
      if (matchesQuery(keyword, [...fields, ...row.tips.map((tip) => tip.name)])) found.add(i)
    })
    return found
  }, [visible, keyword, authors])

  // Show enough rows to reach the first match.
  const firstMatch = matches && matches.size > 0 ? Math.min(...matches) : 0
  const shown = Math.max(FLOW_STEP, firstMatch + 50) + more

  if (query.isLoading) return <LoadingIndicatorView className="min-h-[60vh]" />
  if (query.isError) return <ErrorBox message={query.error.message} onRetry={() => query.refetch()} />
  if (!visible || visible.rows.length === 0) {
    return (
      <Card className="border-0 p-20 text-center text-sm text-muted-foreground">
        No commits on {branchLabel(branch)}.
      </Card>
    )
  }

  const rows = visible.rows.slice(0, shown)
  if (horizontal) {
    return (
      <FlowHorizontal
        rows={rows}
        edges={visible.edges}
        columns={visible.columns}
        total={visible.rows.length}
        truncated={query.data?.truncated ?? false}
        matches={matches}
        selected={selected}
        onMore={() => setMore((v) => v + FLOW_STEP)}
      />
    )
  }
  const width = visible.columns * COL_W
  const height = rows.length * ROW_H
  const edges = visible.edges.filter((edge) => edge.fromRow < rows.length)
  const left = DATE_W + 8
  const dim = (color: string) => selected !== null && selected !== color
  const delay = (row: number) => Math.min(row, 40) * 14

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border bg-card p-3">
        <div className="relative" style={{ height, minWidth: left + width + 520 }}>
          <svg width={width} height={height} className="absolute top-0 overflow-visible" style={{ left }} aria-hidden>
            {edges.map((edge, i) => (
              <path
                key={i}
                d={edgePath(edge.fromRow, edge.fromCol, edge.toRow, edge.toCol, edge.kind)}
                stroke={edge.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={edge.kind === "open" ? undefined : 1}
                strokeDasharray={edge.kind === "open" ? "3 5" : 1}
                fill="none"
                className="transition-opacity duration-300"
                style={{
                  opacity: dim(edge.color) ? 0.12 : edge.kind === "open" ? 0.35 : 0.9,
                  animation:
                    edge.kind === "open" ? undefined : `flow-draw 700ms ${delay(edge.fromRow)}ms ease-out both`,
                }}
              />
            ))}
            {rows.map((row, i) => {
              const cx = row.col * COL_W + COL_W / 2
              const cy = i * ROW_H + ROW_H / 2
              const faded = (matches && !matches.has(i)) || dim(row.color)
              return (
                <g
                  key={row.commit.hash}
                  className="transition-opacity duration-300"
                  style={{
                    opacity: faded ? 0.2 : 1,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animation: `heat-in 450ms ${delay(i)}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                  }}
                >
                  {row.tips.length > 0 && <circle cx={cx} cy={cy} r={10} fill={row.color} opacity={0.18} />}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={row.tips.length > 0 ? 6 : 4.5}
                    fill={row.tips.length > 0 ? row.color : "hsl(var(--card))"}
                    stroke={row.color}
                    strokeWidth={row.tips.length > 0 ? 2 : 2.5}
                  />
                </g>
              )
            })}
          </svg>
          <ol className="absolute inset-x-0 top-0 select-none">
            {rows.map((row, i) => {
              const date = new Date(row.commit.date)
              const day = format(date, "dd MMM")
              const newDay = i === 0 || format(new Date(rows[i - 1].commit.date), "dd MMM") !== day
              return (
                <li
                  key={row.commit.hash}
                  onClick={() => setSelected((current) => (current === row.color ? null : row.color))}
                  className={cn(
                    "flex items-center whitespace-nowrap rounded-md transition-[opacity,background-color] cursor-pointer duration-300",
                    ((matches && !matches.has(i)) || dim(row.color)) && "opacity-25",
                  )}
                  style={{ height: ROW_H }}
                  title={`${row.commit.subject}\n${row.commit.author} · ${format(date, "dd MMM yyyy HH:mm")}${row.lane ? `\nBranch: ${row.lane}` : ""}`}
                >
                  <div
                    className="flex shrink-0 flex-col justify-center text-right leading-tight"
                    style={{ width: DATE_W }}
                  >
                    {newDay && <span className="text-xs font-semibold text-black/60 dark:text-white/60">{day}</span>}
                    <span className="text-[10px] text-muted-foreground">{format(date, "HH:mm")}</span>
                  </div>
                  <div className="flex min-w-0 items-center gap-2" style={{ paddingLeft: width + 16 }}>
                    <CopyHash
                      hash={row.commit.hash}
                      className="shrink-0 rounded px-1 text-xs font-semibold"
                      label={
                        <span style={{ color: row.color }}>
                          <Highlight text={row.commit.hash.slice(0, 7)} />
                        </span>
                      }
                    />
                    {row.tips.map((tip) => (
                      <span
                        key={tip.name}
                        className="shrink-0 rounded-full px-2 py-px text-[11px] font-medium"
                        style={{
                          color: colorForBranch(branchColorName(tip)),
                          background: `${colorForBranch(branchColorName(tip))}1f`,
                        }}
                      >
                        <Highlight text={tip.name} />
                      </span>
                    ))}
                    <span className="max-w-[26rem] truncate text-xs">
                      <Highlight text={row.commit.subject} />
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      <Highlight text={row.commit.author} />
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span>
          {matches && `${matches.size} matching · `}
          {rows.length} of {visible.rows.length}
          {query.data?.truncated ? "+" : ""} commits
        </span>
        {rows.length < visible.rows.length && (
          <Button size="sm" variant="outline" onClick={() => setMore((v) => v + FLOW_STEP)}>
            Show {Math.min(FLOW_STEP, visible.rows.length - rows.length)} more
          </Button>
        )}
      </div>
    </div>
  )
}

// The view options are shared by both repo tabs, so they survive switching between frontend and backend.
export interface ViewOptions {
  mode: Mode
  showRemote: boolean
  horizontal: boolean
}

export const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  mode: "verbose",
  showRemote: false,
  horizontal: false,
}

// The branch and author filters of a repo tab. They live above the tabs, so they survive switching repos.
export interface RepoFilters {
  /** Branches hidden in the flow. Null until the user changes them: then the default set is used. */
  hidden: string[] | null
  /** Undefined until the user picks a branch: then the repo's checked-out branch is used. */
  branch?: string
  /** Null until the user picks: then the repo's own git user is selected, when they have commits here. */
  authors: string[] | null
  /** The search text of the repo tab. */
  keyword: string
}

export const DEFAULT_REPO_FILTERS: RepoFilters = {
  branch: undefined,
  authors: null,
  hidden: null,
  keyword: "",
}

export function RepoTab({
  repo,
  reviews,
  options,
  onOptions,
  filters,
  onFilters,
}: {
  repo: RepoInfo
  reviews: Review[]
  options: ViewOptions
  onOptions: (next: ViewOptions) => void
  filters: RepoFilters
  onFilters: (next: RepoFilters) => void
}) {
  const branch = ALL_BRANCHES
  const { mode, showRemote, horizontal } = options
  const setMode = (next: Mode) => onOptions({ ...options, mode: next })
  const setShowRemote = (next: boolean) => onOptions({ ...options, showRemote: next })
  const setHorizontal = (next: boolean) => onOptions({ ...options, horizontal: next })
  const keyword = filters.keyword ?? ""
  const setKeyword = (next: string) => onFilters({ ...filters, keyword: next })
  // The branches switched on in Options: what Verbose, Data and Files read. Until the user changes the toggles
  // that is main, dev and the checked-out branch, the same default the Options tab starts with.
  const onlyBranches = useMemo(() => {
    const keys = [...new Set(repo.branches.map(branchKey))]
    if (filters.hidden) {
      const hidden = new Set(filters.hidden)
      return keys.filter((key) => !hidden.has(key))
    }
    const keep = new Set([...DEFAULT_SHOWN, ...(repo.currentBranch ? [repo.currentBranch] : [])])
    return keys.filter((key) => keep.has(key))
  }, [repo.branches, repo.currentBranch, filters.hidden])
  const picked = filters.authors
  const setPicked = (next: string[] | null) => onFilters({ ...filters, authors: next })
  const contributors = useQuery({
    queryKey: ["penguin", "contributors", repo.key, branch, showRemote],
    queryFn: () =>
      getJson<Contributor[]>(
        `/penguin/api/git/contributors?repo=${repo.key}&branch=${encodeURIComponent(branch)}&remote=${showRemote ? 1 : 0}`,
      ),
  })
  const me = repo.currentUser
  const authors = useMemo(
    () => picked ?? (me && contributors.data?.some((c) => c.name === me) ? [me] : []),
    [picked, me, contributors.data],
  )

  if (!repo.available) {
    return (
      <Card className="border-0 p-20 text-center text-sm text-muted-foreground">
        {repo.name} could not be read. {repo.error}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto flex min-w-0 items-baseline gap-2">
          <h2 className="text-xl uppercase font-semibold">{repo.name}</h2>
          {repo.currentBranch && (
            <span className="truncate text-xs text-muted-foreground">
              on{" "}
              <code className="rounded-sm bg-indigo-600/10 px-1 py-0.5 text-xs text-indigo-600 font-mono">
                {repo.currentBranch}
              </code>
            </span>
          )}
        </div>
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "verbose", label: "Verbose" },
            { value: "flow", label: "Flow" },
            { value: "data", label: "Data" },
            { value: "files", label: "Files" },
            { value: "options", label: "Options" },
          ]}
        />
      </div>

      {mode !== "options" && (
        <SearchBox
          value={keyword}
          onChange={setKeyword}
          placeholder={
            mode === "verbose"
              ? "Search branches and loaded commits by hash, message, author or file"
              : mode === "data"
                ? "Search contributors"
                : mode === "files"
                  ? "Search changed files by path"
                  : "Search branches and commits by hash, message, author or branch"
          }
        />
      )}

      <SearchHighlightProvider query={keyword}>
        <div className="space-y-4">
          {mode === "options" ? (
            <OptionsPanel
              repo={repo.key}
              branch={branch}
              authors={authors}
              onAuthors={setPicked}
              contributors={contributors.data ?? []}
              showRemote={showRemote}
              onShowRemote={setShowRemote}
              horizontal={horizontal}
              onHorizontal={setHorizontal}
              currentBranch={repo.currentBranch}
              hiddenBranches={filters.hidden}
              onHiddenBranches={(next) => onFilters({ ...filters, hidden: next })}
            />
          ) : mode === "verbose" ? (
            <VerboseHistory
              key={branch}
              repo={repo.key}
              branch={branch}
              reviews={reviews}
              keyword={keyword}
              authors={authors}
              showRemote={showRemote}
              onlyBranches={onlyBranches}
            />
          ) : mode === "files" ? (
            <FileActivityPanel
              key={branch}
              repo={repo.key}
              branch={branch}
              authors={authors}
              keyword={keyword}
              showRemote={showRemote}
              onlyBranches={onlyBranches}
            />
          ) : mode === "data" ? (
            <ActivityHeatmap
              key={branch}
              repo={repo.key}
              branch={branch}
              keyword={keyword}
              authors={authors}
              showRemote={showRemote}
              onlyBranches={onlyBranches}
            />
          ) : (
            <FlowHistory
              key={branch}
              repo={repo.key}
              branch={branch}
              keyword={keyword}
              authors={authors}
              showRemote={showRemote}
              horizontal={horizontal}
              currentBranch={repo.currentBranch}
              hiddenBranches={filters.hidden}
              onHiddenBranches={(next) => onFilters({ ...filters, hidden: next })}
            />
          )}
        </div>
      </SearchHighlightProvider>
    </div>
  )
}

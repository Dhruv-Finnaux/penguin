"use client"

import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useInfiniteQuery, useQuery, type UseQueryResult } from "@tanstack/react-query"
import { format } from "date-fns"
import { CheckIcon, ChevronDownIcon, GitBranchIcon, UsersIcon, XIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { matchesQuery } from "../_lib/fuzzy"
import { branchColorName, colorForBranch, layoutGraph, type GraphEdge, type GraphRow } from "../_lib/graph-layout"
import type {
  BranchInfo,
  CommitInfo,
  CommitPage,
  Contributor,
  GraphData,
  RepoInfo,
  RepoKey,
  Review,
} from "../_lib/types"
import { CommitTimeline } from "./commits-tab"
import { CopyHash } from "./copy-hash"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { ActivityHeatmap } from "./activity-heatmap"
import { FileActivityPanel } from "./file-activity"
import { SearchBox } from "./search-box"

const ALL_BRANCHES = "__all__"
const PAGE_SIZE = 50
const FLOW_STEP = 300
const ROW_H = 40
const COL_W = 24
const DATE_W = 92

type Mode = "verbose" | "flow" | "data" | "files"

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
const VIEWS: { value: Mode; label: string; hint: string }[] = [
  { value: "verbose", label: "Verbose", hint: "Commit list with diffs" },
  { value: "flow", label: "Flow", hint: "Branch lanes and merges" },
  { value: "data", label: "Data", hint: "Authors and activity" },
  { value: "files", label: "Files", hint: "Changed files over time" },
]

function OptionsMenu({
  mode,
  onMode,
  showRemote,
  onShowRemote,
  horizontal,
  onHorizontal,
}: {
  mode: Mode
  onMode: (next: Mode) => void
  showRemote: boolean
  onShowRemote: (next: boolean) => void
  horizontal: boolean
  onHorizontal: (next: boolean) => void
}) {
  const count = Number(showRemote) + Number(horizontal)
  const view = VIEWS.find((v) => v.value === mode)?.label ?? "Verbose"
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="bg-card hover:bg-card">
          Options: <span className="text-green-600">{view}</span>
          {count > 0 && <span className="rounded-full bg-green-600/10 text-green-600 px-1.5 text-[10px]">{count}</span>}
          <ChevronDownIcon className="size-3.5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-3 p-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase text-muted-foreground">View</p>
          {VIEWS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={mode === item.value}
              onClick={() => onMode(item.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors",
                mode === item.value ? "bg-green-600/10 text-green-600" : "hover:bg-foreground/5",
              )}
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className={cn("text-xs", mode === item.value ? "text-green-600" : "text-muted-foreground")}>
                {item.hint}
              </span>
            </button>
          ))}
        </div>
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Remote branches</p>
              <p className="text-xs text-muted-foreground">Include commits and labels that only exist on origin.</p>
            </div>
            <Switch checked={showRemote} onChange={onShowRemote} />
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Horizontal flow</p>
              <p className="text-xs text-muted-foreground">Commits run left to right. Used in the Flow tab.</p>
            </div>
            <Switch checked={horizontal} onChange={onHorizontal} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function BranchPicker({
  branches,
  value,
  onChange,
}: {
  branches: BranchInfo[]
  value: string
  onChange: (value: string) => void
}) {
  const local = branches.filter((b) => !b.remote)
  const remote = branches.filter((b) => b.remote)

  const item = (branch: BranchInfo) => (
    <DropdownMenuItem key={branch.name} onSelect={() => onChange(branch.name)} className="cursor-pointer gap-2">
      <GitBranchIcon className="size-3.5 shrink-0" style={{ color: colorForBranch(branchColorName(branch)) }} />
      <span className="flex-1 truncate">{branch.name}</span>
      {branch.current && (
        <span className=" bg-green-600/10 dark:bg-green-600/20 px-2 py-1 rounded-md font-medium text-xs text-green-600">
          Current
        </span>
      )}
    </DropdownMenuItem>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="max-w-72 bg-white border-0 dark:bg-card">
          <GitBranchIcon className="size-4 shrink-0" />
          <span className="truncate">{branchLabel(value)}</span>
          <ChevronDownIcon className="size-3.5 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-96 min-w-64 overflow-y-auto rounded-xl bg-white p-2 dark:bg-card"
      >
        <DropdownMenuItem onSelect={() => onChange(ALL_BRANCHES)} className="cursor-pointer gap-2">
          <span className="flex-1">All branches</span>
          {value === ALL_BRANCHES && <CheckIcon className="size-4" />}
        </DropdownMenuItem>
        {local.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-black/10" />
            <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">
              Local ({local.length})
            </DropdownMenuLabel>
            {local.map(item)}
          </>
        )}
        {remote.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-black/10" />
            <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">
              Remote ({remote.length})
            </DropdownMenuLabel>
            {remote.map(item)}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ContributorPicker({
  query,
  value,
  onChange,
}: {
  query: UseQueryResult<Contributor[]>
  value: string[]
  onChange: (value: string[]) => void
}) {
  const [search, setSearch] = useState("")
  const people = (query.data ?? []).filter((p) => matchesQuery(search, [p.name]))
  const toggle = (name: string) => onChange(value.includes(name) ? value.filter((n) => n !== name) : [...value, name])

  return (
    <DropdownMenu onOpenChange={(open) => !open && setSearch("")}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="max-w-72 bg-white border-0 dark:bg-card">
          <UsersIcon className="size-4 shrink-0" />
          <span className="truncate">
            {value.length === 0
              ? "All contributors"
              : value.length === 1
                ? value[0]
                : `${value[0]} +${value.length - 1}`}
          </span>
          <ChevronDownIcon className="size-3.5 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-96 min-w-72 overflow-y-auto rounded-xl bg-white p-2 dark:bg-card"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Find a contributor"
          aria-label="Find a contributor"
          className="mb-1 w-full rounded-md bg-black/5 px-2 py-1.5 text-sm outline-none dark:bg-white/10"
        />
        {value.length > 0 && (
          <DropdownMenuItem onSelect={() => onChange([])} className="cursor-pointer gap-2 text-muted-foreground">
            <XIcon className="size-4" /> Clear ({value.length})
          </DropdownMenuItem>
        )}
        {query.isLoading && <div className="p-2 text-xs text-muted-foreground">Reading contributors…</div>}
        {query.isError && <div className="p-2 text-xs text-destructive">{query.error.message}</div>}
        {people.map((person) => (
          <DropdownMenuCheckboxItem
            key={person.name}
            checked={value.includes(person.name)}
            onCheckedChange={() => toggle(person.name)}
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer gap-2"
          >
            <span className="flex-1 truncate">{person.name}</span>
            <span className="text-xs text-muted-foreground">
              {person.commits} · {format(new Date(person.lastDate), "dd MMM yy")}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
        {query.data && people.length === 0 && <div className="p-2 text-xs text-muted-foreground">No one found.</div>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function VerboseHistory({
  repo,
  branch,
  reviews,
  keyword,
  authors,
  showRemote,
}: {
  repo: RepoKey
  branch: string
  reviews: Review[]
  keyword: string
  authors: string[]
  showRemote: boolean
}) {
  const [openHash, setOpenHash] = useState<string | null>(null)

  const query = useInfiniteQuery({
    queryKey: ["penguin", "log", repo, branch, authors, showRemote],
    queryFn: ({ pageParam }) =>
      getJson<CommitPage>(
        `/penguin/api/git/log?repo=${repo}&branch=${encodeURIComponent(branch)}&remote=${showRemote ? 1 : 0}&skip=${pageParam}&limit=${PAGE_SIZE}${authors
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

function FlowHorizontal({
  rows,
  edges,
  columns,
  total,
  truncated,
  matches,
  selected,
  onSelect,
  onMore,
}: {
  rows: GraphRow[]
  edges: GraphEdge[]
  columns: number
  total: number
  truncated: boolean
  matches: Set<number> | null
  selected: string | null
  onSelect: (color: string | null) => void
  onMore: () => void
}) {
  const width = rows.length * HCOL_W
  const height = HTOP + columns * HLANE_H + 40
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
            return (
              <div
                key={row.commit.hash}
                onClick={() => onSelect(selected === row.color ? null : row.color)}
                className={cn(
                  "absolute cursor-pointer space-y-0.5 overflow-hidden rounded-md transition-opacity duration-300",
                  faded && "opacity-25",
                )}
                style={{
                  left: i * HCOL_W + 4,
                  top: HTOP + row.col * HLANE_H + HDOT + 12,
                  width: HCOL_W - 10,
                }}
                title={`${row.commit.subject}\n${row.commit.author} · ${format(date, "dd MMM yyyy HH:mm")}${row.lane ? `\nBranch: ${row.lane}` : ""}`}
              >
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span>{format(date, "dd MMM")}</span>
                  <span>{format(date, "HH:mm")}</span>
                </div>
                <CopyHash
                  hash={row.commit.hash}
                  className="rounded px-1 text-xs font-semibold"
                  label={
                    <span style={{ color: row.color }}>
                      <Highlight text={row.commit.hash.slice(0, 7)} />
                    </span>
                  }
                />
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
                <div className="truncate text-xs">
                  <Highlight text={row.commit.subject} />
                </div>
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

function FlowHistory({
  repo,
  branch,
  keyword,
  authors,
  showRemote,
  horizontal,
}: {
  repo: RepoKey
  branch: string
  keyword: string
  authors: string[]
  showRemote: boolean
  horizontal: boolean
}) {
  const [more, setMore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

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

  // The graph cannot drop rows without breaking its lines, so a search dims the rest instead.
  const matches = useMemo(() => {
    if (!layout || (!keyword.trim() && authors.length === 0)) return null
    const found = new Set<number>()
    layout.rows.forEach((row, i) => {
      if (authors.length > 0 && !authors.includes(row.commit.author)) return
      if (!keyword.trim()) return void found.add(i)
      const fields = [row.commit.hash, row.commit.subject, row.commit.author, row.lane ?? ""]
      if (matchesQuery(keyword, [...fields, ...row.tips.map((tip) => tip.name)])) found.add(i)
    })
    return found
  }, [layout, keyword, authors])

  // Show enough rows to reach the first match.
  const firstMatch = matches && matches.size > 0 ? Math.min(...matches) : 0
  const shown = Math.max(FLOW_STEP, firstMatch + 50) + more

  if (query.isLoading) return <LoadingIndicatorView className="min-h-[60vh]" />
  if (query.isError) return <ErrorBox message={query.error.message} onRetry={() => query.refetch()} />
  if (!layout || layout.rows.length === 0) {
    return (
      <Card className="border-0 p-20 text-center text-sm text-muted-foreground">
        No commits on {branchLabel(branch)}.
      </Card>
    )
  }

  const rows = layout.rows.slice(0, shown)
  if (horizontal) {
    return (
      <FlowHorizontal
        rows={rows}
        edges={layout.edges}
        columns={layout.columns}
        total={layout.rows.length}
        truncated={query.data?.truncated ?? false}
        matches={matches}
        selected={selected}
        onSelect={setSelected}
        onMore={() => setMore((v) => v + FLOW_STEP)}
      />
    )
  }
  const width = layout.columns * COL_W
  const height = rows.length * ROW_H
  const edges = layout.edges.filter((edge) => edge.fromRow < rows.length)
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
          {rows.length} of {layout.rows.length}
          {query.data?.truncated ? "+" : ""} commits
        </span>
        {rows.length < layout.rows.length && (
          <Button size="sm" variant="outline" onClick={() => setMore((v) => v + FLOW_STEP)}>
            Show {Math.min(FLOW_STEP, layout.rows.length - rows.length)} more
          </Button>
        )}
      </div>
    </div>
  )
}

export function RepoTab({ repo, reviews }: { repo: RepoInfo; reviews: Review[] }) {
  const [branch, setBranch] = useState(repo.currentBranch ?? ALL_BRANCHES)
  const [mode, setMode] = useState<Mode>("verbose")
  const [showRemote, setShowRemote] = useState(false)
  const [horizontal, setHorizontal] = useState(false)
  const [keyword, setKeyword] = useState("")
  // null until the user picks: then the repo's own git user is selected, when they have commits here.
  const [picked, setPicked] = useState<string[] | null>(null)
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
        <BranchPicker
          branches={repo.branches}
          value={branch}
          onChange={(next) => {
            setBranch(next)
            setPicked(null)
          }}
        />
        <ContributorPicker query={contributors} value={authors} onChange={setPicked} />
        <OptionsMenu
          mode={mode}
          onMode={setMode}
          showRemote={showRemote}
          onShowRemote={setShowRemote}
          horizontal={horizontal}
          onHorizontal={setHorizontal}
        />
      </div>

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

      <SearchHighlightProvider query={keyword}>
        <div className="space-y-4">
          {mode === "verbose" ? (
            <VerboseHistory
              key={branch}
              repo={repo.key}
              branch={branch}
              reviews={reviews}
              keyword={keyword}
              authors={authors}
              showRemote={showRemote}
            />
          ) : mode === "files" ? (
            <FileActivityPanel
              key={branch}
              repo={repo.key}
              branch={branch}
              authors={authors}
              keyword={keyword}
              showRemote={showRemote}
            />
          ) : mode === "data" ? (
            <ActivityHeatmap
              key={branch}
              repo={repo.key}
              branch={branch}
              keyword={keyword}
              authors={authors}
              showRemote={showRemote}
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
            />
          )}
        </div>
      </SearchHighlightProvider>
    </div>
  )
}

import type { BranchInfo, GraphCommit } from "./types"

const PALETTE = [
  "#2563eb",
  "#16a34a",
  "#db2777",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#ca8a04",
  "#dc2626",
  "#4f46e5",
  "#059669",
  "#c026d3",
  "#0d9488",
  "#9333ea",
  "#65a30d",
  "#e11d48",
  "#0284c7",
]

export const UNNAMED_COLOR = "#94a3b8"

const BASE_NAMES = new Set(["main", "master"])

// origin/feature-x and feature-x are the same branch, so they share a colour.
export const branchKey = (branch: Pick<BranchInfo, "name" | "remote">) =>
  branch.remote ? branch.name.replace(/^[^/]+\//, "") : branch.name

// main first, then the checked-out branch, then the rest newest first. Local before remote.
export function orderBranches(branches: BranchInfo[]) {
  const rank = (b: BranchInfo) => (BASE_NAMES.has(branchKey(b)) ? 0 : b.current ? 1 : 2)
  return branches
    .map((branch, index) => ({ branch, index }))
    .sort(
      (a, b) =>
        rank(a.branch) - rank(b.branch) ||
        Number(a.branch.remote) - Number(b.branch.remote) ||
        a.index - b.index,
    )
    .map(({ branch }) => branch)
}

export function branchColors(branches: BranchInfo[]) {
  const colors = new Map<string, string>()
  for (const branch of orderBranches(branches)) {
    const key = branchKey(branch)
    if (!colors.has(key)) colors.set(key, PALETTE[colors.size % PALETTE.length])
  }
  return colors
}

export interface GraphRow {
  commit: GraphCommit
  col: number
  color: string
  lane: string | null
  tips: BranchInfo[]
}

export interface GraphEdge {
  fromRow: number
  fromCol: number
  toRow: number
  toCol: number
  color: string
  kind: "straight" | "fork" | "merge" | "open"
}

export interface GraphLayout {
  rows: GraphRow[]
  edges: GraphEdge[]
  columns: number
}

interface Lane {
  name: string | null
  color: string
  start: number
  end: number
  col: number
}

const MERGE_PATTERNS = [
  /^Merge branch '([^']+)'/,
  /^Merge remote-tracking branch '(?:[^/']+\/)?([^']+)'/,
  /^Merge pull request #\d+ from [^/\s]+\/(\S+)/,
]

function mergedBranchName(subject: string) {
  for (const pattern of MERGE_PATTERNS) {
    const match = subject.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Gives every commit a column, one lane per branch. Each branch claims its commits by walking
 * first parents from its tip, in priority order. Commits left over (branches that were merged
 * and deleted) get a lane named after the merge commit that brought them in. Lanes share a
 * column when their rows do not overlap.
 */
export function layoutGraph(
  commits: GraphCommit[],
  branches: BranchInfo[],
  colors: Map<string, string>,
): GraphLayout {
  const n = commits.length
  const rowOf = new Map(commits.map((c, i) => [c.hash, i]))
  const owner = new Int32Array(n).fill(-1)
  const lanes: Lane[] = []

  const mergedVia = new Map<string, string>()
  for (const commit of commits) {
    for (const parent of commit.parents.slice(1)) {
      if (!mergedVia.has(parent)) mergedVia.set(parent, commit.subject)
    }
  }

  const claim = (startRow: number, name: string | null, color: string) => {
    if (owner[startRow] !== -1) return
    const laneIndex = lanes.length
    let row: number | undefined = startRow
    let last = startRow
    while (row !== undefined && owner[row] === -1) {
      owner[row] = laneIndex
      last = row
      const parent: string | undefined = commits[row].parents[0]
      row = parent ? rowOf.get(parent) : undefined
    }
    lanes.push({ name, color, start: startRow, end: last, col: -1 })
  }

  const tipsByHash = new Map<string, BranchInfo[]>()
  for (const branch of orderBranches(branches)) {
    tipsByHash.set(branch.hash, [...(tipsByHash.get(branch.hash) ?? []), branch])
    const row = rowOf.get(branch.hash)
    if (row !== undefined) claim(row, branchKey(branch), colors.get(branchKey(branch)) ?? UNNAMED_COLOR)
  }
  for (let row = 0; row < n; row++) {
    if (owner[row] !== -1) continue
    const name = mergedBranchName(mergedVia.get(commits[row].hash) ?? "")
    claim(row, name, (name && colors.get(name)) || UNNAMED_COLOR)
  }

  // Reserve the rows each lane's connecting lines pass through.
  const edges: GraphEdge[] = []
  for (let row = 0; row < n; row++) {
    const lane = owner[row]
    commits[row].parents.forEach((parent, i) => {
      const parentRow = rowOf.get(parent)
      if (parentRow === undefined) {
        lanes[lane].end = n
        edges.push({ fromRow: row, fromCol: lane, toRow: n, toCol: lane, color: lanes[lane].color, kind: "open" })
        return
      }
      const parentLane = owner[parentRow]
      if (parentLane === lane) {
        edges.push({ fromRow: row, fromCol: lane, toRow: parentRow, toCol: lane, color: lanes[lane].color, kind: "straight" })
      } else if (i === 0) {
        lanes[lane].end = Math.max(lanes[lane].end, parentRow)
        edges.push({ fromRow: row, fromCol: lane, toRow: parentRow, toCol: parentLane, color: lanes[lane].color, kind: "fork" })
      } else {
        lanes[parentLane].start = Math.min(lanes[parentLane].start, row)
        edges.push({ fromRow: row, fromCol: lane, toRow: parentRow, toCol: parentLane, color: lanes[parentLane].color, kind: "merge" })
      }
    })
  }

  const columns: [number, number][][] = []
  for (const lane of lanes) {
    let col = columns.findIndex((taken) =>
      taken.every(([start, end]) => lane.end < start || end < lane.start),
    )
    if (col === -1) {
      col = columns.length
      columns.push([])
    }
    columns[col].push([lane.start, lane.end])
    lane.col = col
  }

  for (const edge of edges) {
    edge.fromCol = lanes[edge.fromCol].col
    edge.toCol = lanes[edge.toCol].col
  }

  return {
    rows: commits.map((commit, row) => {
      const lane = lanes[owner[row]]
      return { commit, col: lane.col, color: lane.color, lane: lane.name, tips: tipsByHash.get(commit.hash) ?? [] }
    }),
    edges,
    columns: Math.max(1, columns.length),
  }
}

import type { BranchInfo, GraphCommit } from "./types"

// A branch's colour comes from its name alone, so it is the same in every repo, tab and chip.
// Branch names are hashed to a hue; saturation and lightness are fixed so every colour reads on
// both light and dark backgrounds.
function hslToHex(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const value = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

// main is green and dev is blue. Every other branch hashes to one of these, which leave out green and
// blue (and the teal and indigo next to them), so no branch looks like main or dev.
const FIXED: Record<string, [number, number]> = {
  main: [140, 0.38],
  master: [140, 0.38],
  dev: [214, 0.46],
  develop: [214, 0.46],
}

// Hues around the wheel for the other branches, skipping the greens and blues that main and dev own.
// Two lightnesses for every hue, so there are enough distinct slots for all branches of both repos.
const SLOTS: { hue: number; color: string }[] = []
for (const lightness of [0.42, 0.58]) {
  for (let hue = 0; hue < 360; hue += 8) {
    if ((hue >= 95 && hue <= 170) || (hue >= 195 && hue <= 245)) continue
    SLOTS.push({ hue, color: hslToHex(hue, 0.68, lightness) })
  }
}
const PALETTE = SLOTS.map((slot) => slot.color)
// Two branches should never look alike: a new one takes the free hue furthest from every hue already taken.
const hueGap = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b))

// Every branch gets its own slot: the name's hash picks the first choice, and a taken slot moves to the next one.
// Names are assigned in sorted order, so the same set of branches always gets the same colours.
const registry = new Map<string, string>()

const hashOf = (key: string) => {
  let hash = 2166136261
  for (const char of key) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0
  return hash
}

export function registerBranchColors(names: string[]) {
  const keys = [
    ...new Set(names.map((name) => name.trim()).filter((name) => name && !FIXED[name] && name !== "origin/main")),
  ].sort()
  const taken = new Set<string>()
  registry.clear()
  for (const key of keys) {
    const start = hashOf(key) % SLOTS.length
    const takenHues = [...taken].map((i) => SLOTS[Number(i)].hue)
    let slot: number | undefined
    let best = -1
    for (let step = 0; step < SLOTS.length; step++) {
      const candidate = (start + step) % SLOTS.length
      if (taken.has(String(candidate))) continue
      const gap = takenHues.length ? Math.min(...takenHues.map((hue) => hueGap(hue, SLOTS[candidate].hue))) : 360
      if (gap > best) {
        best = gap
        slot = candidate
      }
    }
    if (slot === undefined) continue
    taken.add(String(slot))
    registry.set(key, SLOTS[slot].color)
  }
}

export function colorForBranch(name: string) {
  const key = name.trim()
  const fixed = FIXED[key] ?? (key === "origin/main" ? FIXED.main : undefined)
  if (fixed) return hslToHex(fixed[0], 0.68, fixed[1])
  return registry.get(key) ?? PALETTE[hashOf(key) % PALETTE.length]
}

export const UNNAMED_COLOR = "#94a3b8"

const BASE_NAMES = new Set(["main", "master"])
const LONG_LIVED = ["dev", "develop", "development", "staging", "qa", "uat", "release"]

// origin/feature-x and feature-x are the same branch, so they share a colour.
export const branchKey = (branch: Pick<BranchInfo, "name" | "remote">) =>
  branch.remote ? branch.name.replace(/^[^/]+\//, "") : branch.name

// main first, then the checked-out branch, then the rest newest first. Local before remote.
export function orderBranches(branches: BranchInfo[]) {
  // main, then the long-lived integration branches (dev, staging...), then the checked-out branch, then the rest.
  // A feature branch claims only the commits nothing before it has claimed, so it starts at its own fork point.
  const rank = (b: BranchInfo) =>
    BASE_NAMES.has(branchKey(b)) ? 0 : LONG_LIVED.includes(branchKey(b).toLowerCase()) ? 1 : b.current ? 2 : 3
  return branches
    .map((branch, index) => ({ branch, index }))
    .sort(
      (a, b) =>
        rank(a.branch) - rank(b.branch) || Number(a.branch.remote) - Number(b.branch.remote) || a.index - b.index,
    )
    .map(({ branch }) => branch)
}

// A remote branch (origin/dev) has its own colour, apart from the local dev.
export const branchColorName = (branch: Pick<BranchInfo, "name" | "remote">) =>
  branch.remote ? branch.name : branchKey(branch)

export function branchColors(branches: BranchInfo[]) {
  const colors = new Map<string, string>()
  for (const branch of orderBranches(branches)) {
    const key = branchKey(branch)
    if (!colors.has(key)) colors.set(key, colorForBranch(key))
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
export function layoutGraph(commits: GraphCommit[], branches: BranchInfo[]): GraphLayout {
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
    if (row !== undefined) claim(row, branchKey(branch), colorForBranch(branchColorName(branch)))
  }
  for (let row = 0; row < n; row++) {
    if (owner[row] !== -1) continue
    const name = mergedBranchName(mergedVia.get(commits[row].hash) ?? "")
    claim(row, name, name ? colorForBranch(name) : UNNAMED_COLOR)
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
        edges.push({
          fromRow: row,
          fromCol: lane,
          toRow: parentRow,
          toCol: lane,
          color: lanes[lane].color,
          kind: "straight",
        })
      } else if (i === 0) {
        lanes[lane].end = Math.max(lanes[lane].end, parentRow)
        edges.push({
          fromRow: row,
          fromCol: lane,
          toRow: parentRow,
          toCol: parentLane,
          color: lanes[lane].color,
          kind: "fork",
        })
      } else {
        lanes[parentLane].start = Math.min(lanes[parentLane].start, row)
        edges.push({
          fromRow: row,
          fromCol: lane,
          toRow: parentRow,
          toCol: parentLane,
          color: lanes[parentLane].color,
          kind: "merge",
        })
      }
    })
  }

  const columns: [number, number][][] = []
  for (const lane of lanes) {
    let col = columns.findIndex((taken) => taken.every(([start, end]) => lane.end < start || end < lane.start))
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

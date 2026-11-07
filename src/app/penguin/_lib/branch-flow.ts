// Turns a repo's real branches into a Git Playground flow. Pure: the git output comes in,
// nodes and edges go out, so it can be checked without a server.

import type { PlaygroundEdge, PlaygroundNode } from "./types"

export interface FlowRef {
  /** Branch name without the remote prefix. */
  name: string
  remote: boolean
  hash: string
}

export interface FlowCommit {
  hash: string
  parents: string[]
  /** Unix seconds. */
  time: number
  author: string
  subject: string
}

interface Line {
  name: string
  local?: string
  remote?: string
}

interface Walk {
  line: Line
  /** Oldest first. */
  commits: string[]
  /** The commit it branched from, owned by an earlier walk; undefined at the root. */
  stop?: string
  first: boolean
}

// The playground's fixed origin/main node.
export const REMOTE_ID = "remote-origin-main"

export const COL_W = 210
export const LANE_H = 100
const TOP = 150

// Integration branches claim their history before feature branches that share it.
const LONG_LIVED = ["dev", "develop", "development", "staging", "qa", "uat", "release"]

const short = (hash: string) => hash.slice(0, 7)
const day = (time: number) => new Date(time * 1000).toISOString().slice(0, 10)
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

export function buildBranchFlow(refs: FlowRef[], commits: FlowCommit[], trunkName: string) {
  const byHash = new Map(commits.map((c) => [c.hash, c]))
  const lines = new Map<string, Line>()
  for (const ref of refs) {
    if (!byHash.has(ref.hash)) continue
    const line = lines.get(ref.name) ?? { name: ref.name }
    if (ref.remote) line.remote = ref.hash
    else line.local = ref.hash
    lines.set(ref.name, line)
  }
  const trunk = lines.get(trunkName) ?? [...lines.values()][0]
  if (!trunk) return { nodes: [], edges: [] }

  // Everything reachable from a commit, following every parent.
  const reach = new Map<string, Set<string>>()
  const ancestorsOf = (tip: string) => {
    const cached = reach.get(tip)
    if (cached) return cached
    const seen = new Set<string>()
    const stack = [tip]
    while (stack.length) {
      const hash = stack.pop()!
      if (seen.has(hash)) continue
      seen.add(hash)
      for (const parent of byHash.get(hash)?.parents ?? []) if (byHash.has(parent)) stack.push(parent)
    }
    reach.set(tip, seen)
    return seen
  }
  const firstParent = (hash: string) => {
    const parent = byHash.get(hash)?.parents[0]
    return parent && byHash.has(parent) ? parent : undefined
  }
  // The tip that contains the other goes first, so one walk covers both when it can.
  const tipsOf = (line: Line) => {
    const { local, remote } = line
    if (!local || !remote || local === remote) return [(local ?? remote)!]
    if (ancestorsOf(local).has(remote)) return [local, remote]
    return [remote, local]
  }

  // Each branch owns its first-parent chain down to a commit an earlier branch owns: that commit
  // is where it branched off. The trunk goes first, then the longest-lived branches.
  const owner = new Map<string, Line>()
  const walks: Walk[] = []
  const walkLine = (line: Line) => {
    tipsOf(line).forEach((tip, i) => {
      const chain: string[] = []
      let at: string | undefined = tip
      while (at && !owner.has(at)) {
        owner.set(at, line)
        chain.push(at)
        at = firstParent(at)
      }
      if (chain.length || i === 0) walks.push({ line, commits: chain.reverse(), stop: at, first: i === 0 })
    })
  }
  walkLine(trunk)
  const reachLength = (line: Line) => {
    let length = 0
    for (let at: string | undefined = tipsOf(line)[0]; at && !owner.has(at); at = firstParent(at)) length++
    return length
  }
  const rest = [...lines.values()]
    .filter((line) => line !== trunk)
    .map((line) => ({ line, length: reachLength(line), rank: LONG_LIVED.indexOf(line.name.toLowerCase()) }))
    .sort(
      (a, b) =>
        (b.rank >= 0 ? 1 : 0) - (a.rank >= 0 ? 1 : 0) ||
        a.rank - b.rank ||
        b.length - a.length ||
        a.line.name.localeCompare(b.line.name),
    )
  for (const { line } of rest) walkLine(line)

  // Only on origin: the local branch does not have it, or there is no local branch.
  const onOrigin = (line: Line, hash: string) => !line.local || !ancestorsOf(line.local).has(hash)

  // Commits that have to end a node: tips, branch-off points, and the far side of merges.
  const boundary = new Set<string>()
  const crossMerges = new Map<string, string[]>()
  for (const line of lines.values()) {
    if (line.local) boundary.add(line.local)
    if (line.remote) boundary.add(line.remote)
  }
  for (const walk of walks) {
    if (walk.stop) boundary.add(walk.stop)
    for (const hash of walk.commits) {
      const others = (byHash.get(hash)?.parents.slice(1) ?? []).filter((p) => {
        const from = owner.get(p)
        return from && from !== walk.line
      })
      if (others.length) {
        crossMerges.set(hash, others)
        others.forEach((p) => boundary.add(p))
      }
    }
  }

  // Commits that only came in through a merge (a deleted PR branch, say) count towards that merge.
  const sideOf = new Map<string, string[]>()
  const counted = new Set(owner.keys())
  for (const walk of walks) {
    for (const hash of walk.commits) {
      const stack = byHash.get(hash)!.parents.slice(1)
      const side: string[] = []
      while (stack.length) {
        const at = stack.pop()!
        if (counted.has(at) || !byHash.has(at)) continue
        counted.add(at)
        side.push(at)
        stack.push(...byHash.get(at)!.parents)
      }
      if (side.length) sideOf.set(hash, side)
    }
  }

  const nodes: PlaygroundNode[] = []
  const chainEdges: PlaygroundEdge[] = []
  const mergeEdges: PlaygroundEdge[] = []
  const nodeOf = new Map<string, string>()
  const laneOf = new Map<string, number>()
  const lanes = new Map<string, number>()
  let edgeCount = 0
  const link = (list: PlaygroundEdge[], from: string, to: string) => list.push({ id: `e${++edgeCount}`, from, to })

  const describe = (hashes: string[]) => {
    const newest = byHash.get(hashes[hashes.length - 1])!
    const real = hashes.flatMap((h) => [byHash.get(h)!, ...(sideOf.get(h) ?? []).map((s) => byHash.get(s)!)])
    real.sort((a, b) => a.time - b.time)
    const authors = [...new Set(real.map((c) => c.author))]
    const from = day(real[0].time)
    const to = day(newest.time)
    return {
      count: real.length,
      hash: short(newest.hash),
      date: new Date(newest.time * 1000).toISOString(),
      detail: [
        plural(real.length, "commit"),
        authors.slice(0, 3).join(", ") + (authors.length > 3 ? ` +${authors.length - 3}` : ""),
        from === to ? from : `${from} → ${to}`,
        newest.subject,
      ].join(" · "),
    }
  }

  walks.forEach((walk, index) => {
    const { line } = walk
    // A second walk of the same branch (local and origin went separate ways) gets its own lane.
    const laneKey = walk.first ? line.name : `${line.name}#${index}`
    if (!lanes.has(laneKey)) lanes.set(laneKey, lanes.size)
    const lane = lanes.get(laneKey)!
    const add = (node: Omit<PlaygroundNode, "x" | "y">) => {
      nodes.push({ ...node, x: 0, y: 0 })
      laneOf.set(node.id, lane)
      return node.id
    }

    let previous: string | undefined
    const attach = (id: string) => {
      if (previous) link(chainEdges, previous, id)
      previous = id
    }
    // origin/<name> sits on a commit the local branch also has: show it as a push of that commit.
    const pushAfter = (hash: string) => {
      if (!line.local || !line.remote || hash !== line.remote || !ancestorsOf(line.local).has(hash)) return
      attach(add({ id: `push-${line.name}`, kind: "push", label: `origin/${line.name}`, hash: short(hash) }))
    }

    if (walk.first || (walk.stop && owner.get(walk.stop) !== line)) {
      const startsOnOrigin = onOrigin(line, walk.commits[0] ?? walk.stop ?? "")
      const base = walk.stop ? byHash.get(walk.stop) : undefined
      const id = add({
        id: `branch-${line.name}${walk.first ? "" : `-${index}`}`,
        kind: "branch",
        label: line.name,
        origin: startsOnOrigin || undefined,
        hash: base ? short(base.hash) : undefined,
        detail: base
          ? `Branched from ${owner.get(base.hash)?.name} at ${short(base.hash)}, ${day(base.time)}`
          : "The first branch in the repo",
      })
      if (walk.stop) link(chainEdges, nodeOf.get(walk.stop) ?? "", id)
      previous = id
      if (walk.stop && walk.commits.length === 0) pushAfter(walk.stop)
    } else if (walk.stop) {
      previous = nodeOf.get(walk.stop)
    }

    let segment: string[] = []
    let segmentOrigin = false
    const flush = () => {
      if (!segment.length) return
      const newest = byHash.get(segment[segment.length - 1])!
      const id = add({
        id: `c-${short(newest.hash)}`,
        kind: "commit",
        label: newest.subject.slice(0, 80) || "(no subject)",
        origin: segmentOrigin || undefined,
        ...describe(segment),
      })
      for (const hash of segment) nodeOf.set(hash, id)
      attach(id)
      const last = segment[segment.length - 1]
      segment = []
      pushAfter(last)
    }

    for (const hash of walk.commits) {
      const origin = onOrigin(line, hash)
      const merged = crossMerges.get(hash)
      if (merged) {
        flush()
        const id = add({
          id: `m-${short(hash)}`,
          kind: "merge",
          label: `Merge ${[...new Set(merged.map((p) => owner.get(p)!.name))].join(", ")} → ${line.name}`,
          origin: origin || undefined,
          ...describe([hash]),
        })
        nodeOf.set(hash, id)
        attach(id)
        pushAfter(hash)
        continue
      }
      if (segment.length && origin !== segmentOrigin) flush()
      segmentOrigin = origin
      segment.push(hash)
      if (boundary.has(hash)) flush()
    }
    flush()
  })

  // A local or origin tip that sits on another branch's line still gets its own pointer there.
  const pointerOnly = new Map(walks.filter((w) => w.first && !w.commits.length).map((w) => [w.line, w.stop]))
  for (const line of lines.values()) {
    for (const [hash, origin] of [
      [line.local, false],
      [line.remote, true],
    ] as const) {
      if (!hash || owner.get(hash) === line || pointerOnly.get(line) === hash) continue
      const at = nodeOf.get(hash)
      if (!at) continue
      const key = `${line.name}#${origin ? "origin" : "local"}`
      lanes.set(key, lanes.size)
      const id = `branch-${key}`
      nodes.push({
        id,
        kind: "branch",
        label: line.name,
        origin: origin || undefined,
        hash: short(hash),
        detail: `${origin ? "origin/" : ""}${line.name} points at ${short(hash)}, a commit on ${owner.get(hash)?.name}`,
        x: 0,
        y: 0,
      })
      laneOf.set(id, lanes.get(key)!)
      link(chainEdges, at, id)
    }
  }

  for (const [merge, others] of crossMerges) {
    for (const parent of others) {
      const from = nodeOf.get(parent)
      const to = nodeOf.get(merge)
      if (from && to) link(mergeEdges, from, to)
    }
  }
  // The chain parent comes first: the playground merges into its first parent's branch.
  const edges = [...chainEdges, ...mergeEdges].filter((e) => e.from && e.to)

  // Columns follow the longest path from the root, so everything sits right of its parents.
  const parents = new Map<string, string[]>()
  for (const edge of edges) parents.set(edge.to, [...(parents.get(edge.to) ?? []), edge.from])
  const column = new Map<string, number>()
  const columnOf = (id: string, depth = 0): number => {
    const known = column.get(id)
    if (known !== undefined) return known
    if (depth > 5000) return 0
    const value = Math.max(-1, ...(parents.get(id) ?? []).map((p) => columnOf(p, depth + 1))) + 1
    column.set(id, value)
    return value
  }
  // The trunk stays on top; the other lanes step down in the order they branch off.
  const laneStart = new Map<number, number>()
  for (const node of nodes) {
    const lane = laneOf.get(node.id) ?? 0
    laneStart.set(lane, Math.min(laneStart.get(lane) ?? Infinity, columnOf(node.id)))
  }
  const laneOrder = [...laneStart.keys()].sort((a, b) =>
    a === 0 ? -1 : b === 0 ? 1 : laneStart.get(a)! - laneStart.get(b)! || a - b,
  )
  for (const node of nodes) {
    node.x = columnOf(node.id) * COL_W
    node.y = TOP + laneOrder.indexOf(laneOf.get(node.id) ?? 0) * LANE_H
  }
  // origin/main floats above the commit it points at.
  const originMain = trunk.remote ? nodes.find((n) => n.id === nodeOf.get(trunk.remote!)) : undefined
  nodes.unshift({
    id: REMOTE_ID,
    kind: "remote",
    label: `origin/${trunk.name}`,
    x: originMain?.x ?? 0,
    y: TOP - LANE_H - 20,
  })
  return { nodes, edges }
}

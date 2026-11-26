"use client"

// A sandbox for sketching git flows. Nothing here runs git: the "commands" are strings shown in a
// console, and flows are saved in this browser's localStorage only. The one server call reads a
// repo's branches (read-only) to load them as a flow.

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { REMOTE_ID } from "../_lib/branch-flow"
import { colorForBranch } from "../_lib/graph-layout"
import type { PlaygroundEdge, PlaygroundKind, PlaygroundNode, RepoKey } from "../_lib/types"
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type FinalConnectionState,
  type Edge,
  type Node,
  type NodeProps,
  ControlButton,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  CircleDotIcon,
  CloudIcon,
  DatabaseIcon,
  EyeOffIcon,
  FolderOpenIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  GitMergeIcon,
  Maximize2Icon,
  Minimize2Icon,
  PlayIcon,
  RectangleHorizontalIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  SquareIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { toast } from "sonner"

/* ---------------------------------------------------------------- model */

type Kind = PlaygroundKind
type PlayNode = PlaygroundNode
type PlayEdge = PlaygroundEdge

interface Flow {
  id: string
  name: string
  nodes: PlayNode[]
  edges: PlayEdge[]
  updatedAt: string
}

const NODE_W = 172
const NODE_H = 58
const STEP_MS = 750
// Long flows play faster, so a whole repo still runs in about twenty seconds.
const stepMs = (steps: number) => (steps > 24 ? Math.max(180, Math.round(20_000 / steps)) : STEP_MS)

const REPOS: { key: RepoKey; label: string }[] = [
  { key: "frontend", label: "Frontend (FINNAUX2.0-UI)" },
  { key: "backend", label: "Backend (FINNAUX2.0-API)" },
]

const FLOWS_KEY = "penguin.git-playground.flows"
const DRAFT_KEY = "penguin.git-playground.draft"

const KIND_META: Record<Kind, { title: string; icon: typeof GitBranchIcon; hint: string }> = {
  branch: {
    title: "Branch",
    icon: GitBranchIcon,
    hint: "Starts a branch from the node it is connected to",
  },
  commit: {
    title: "Commit",
    icon: GitCommitHorizontalIcon,
    hint: "A commit on the branch it is connected to",
  },
  merge: {
    title: "Merge",
    icon: GitMergeIcon,
    hint: "Merges the other branches into the first one connected",
  },
  push: {
    title: "Push",
    icon: UploadIcon,
    hint: "Pushes its branch to origin",
  },
  remote: {
    title: "Remote",
    icon: CloudIcon,
    hint: "origin/main, moved by pushes of main and by work that lands on origin",
  },
}

// The same colour a branch has everywhere else in Penguin, so two branches never share one.
function branchColor(name: string | null) {
  if (!name) return "#94a3b8"
  return colorForBranch(name)
}

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

// A fake but stable short hash, so the console reads like git.
function fakeHash(id: string) {
  let hash = 2166136261
  for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0
  return hash.toString(16).padStart(8, "0").slice(0, 7)
}

const cleanBranch = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w./-]/g, "")
    .replace(/^[-.]+/, "") || "branch"

function remoteNode(): PlayNode {
  return { id: REMOTE_ID, kind: "remote", label: "origin/main", x: 60, y: 40 }
}

function starterFlow(): Flow {
  const n = (id: string, kind: Kind, label: string, x: number, y: number): PlayNode => ({ id, kind, label, x, y })
  return {
    id: uid("flow"),
    name: "Feature branch",
    nodes: [
      remoteNode(),
      n("main", "branch", "main", 60, 220),
      n("c1", "commit", "Initial commit", 280, 220),
      n("p1", "push", "Publish main", 500, 120),
      n("feat", "branch", "feature/login", 500, 360),
      n("c2", "commit", "Add login form", 720, 360),
      n("c3", "commit", "Validate inputs", 940, 360),
      n("m1", "merge", "Merge login", 1160, 220),
      n("p2", "push", "Ship it", 1380, 220),
    ],
    edges: [
      { id: "e1", from: "main", to: "c1" },
      { id: "e2", from: "c1", to: "p1" },
      { id: "e3", from: "c1", to: "feat" },
      { id: "e4", from: "feat", to: "c2" },
      { id: "e5", from: "c2", to: "c3" },
      { id: "e6", from: "c1", to: "m1" },
      { id: "e7", from: "c3", to: "m1" },
      { id: "e8", from: "m1", to: "p2" },
    ],
    updatedAt: new Date().toISOString(),
  }
}

function emptyFlow(): Flow {
  return {
    id: uid("flow"),
    name: "Untitled flow",
    nodes: [remoteNode(), { id: uid("node"), kind: "branch", label: "main", x: 60, y: 220 }],
    edges: [],
    updatedAt: new Date().toISOString(),
  }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Old or hand-edited data must never break the canvas.
function sanitizeFlow(raw: unknown): Flow | null {
  if (!raw || typeof raw !== "object") return null
  const flow = raw as Partial<Flow>
  if (!Array.isArray(flow.nodes) || !Array.isArray(flow.edges)) return null
  const nodes = flow.nodes.filter(
    (n): n is PlayNode =>
      !!n && typeof n.id === "string" && typeof n.x === "number" && typeof n.y === "number" && n.kind in KIND_META,
  )
  if (!nodes.some((n) => n.id === REMOTE_ID)) nodes.unshift(remoteNode())
  const ids = new Set(nodes.map((n) => n.id))
  return {
    id: typeof flow.id === "string" ? flow.id : uid("flow"),
    name: typeof flow.name === "string" ? flow.name : "Untitled flow",
    nodes,
    edges: flow.edges.filter((e) => !!e && ids.has(e.from) && ids.has(e.to)),
    updatedAt: typeof flow.updatedAt === "string" ? flow.updatedAt : new Date().toISOString(),
  }
}

/* ----------------------------------------------------------- simulation */

interface SimState {
  head: string | null
  /** branch name -> node id of the commit it points at */
  branches: Record<string, string>
  /** origin branch name -> node id */
  remote: Record<string, string>
  /** origin branch name -> the node that last moved it (a push, or work that landed on origin) */
  movedBy: Record<string, string>
}

const EMPTY_STATE: SimState = { head: null, branches: {}, remote: {}, movedBy: {} }

interface Step {
  nodeId: string
  /** "$ git ..." lines; "~ " lines are notes about origin, "#" lines are skipped work. */
  commands: string[]
  state: SimState
  error?: string
}

const parentsOf = (id: string, edges: PlayEdge[]) => edges.filter((e) => e.to === id).map((e) => e.from)

// Topological order, ties broken left to right, so the run follows how the flow is drawn.
function runOrder(nodes: PlayNode[], edges: PlayEdge[]) {
  const playable = nodes.filter((n) => n.kind !== "remote")
  const indegree = new Map(playable.map((n) => [n.id, 0]))
  for (const edge of edges) if (indegree.has(edge.to)) indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1)
  const byId = new Map(playable.map((n) => [n.id, n]))
  const ready = playable.filter((n) => indegree.get(n.id) === 0)
  const order: PlayNode[] = []
  while (ready.length) {
    ready.sort((a, b) => a.x - b.x || a.y - b.y)
    const node = ready.shift()!
    order.push(node)
    for (const edge of edges) {
      if (edge.from !== node.id || !byId.has(edge.to)) continue
      const left = (indegree.get(edge.to) ?? 0) - 1
      indegree.set(edge.to, left)
      if (left === 0) ready.push(byId.get(edge.to)!)
    }
  }
  return order
}

const quote = (text: string) => text.replace(/"/g, "'")
const commitsText = (count = 1) => (count === 1 ? "a commit" : `${count} commits`)

function simulate(nodes: PlayNode[], edges: PlayEdge[]) {
  const steps: Step[] = []
  const branchOf = new Map<string, string>()
  const commitOf = new Map<string, string>()
  const state: SimState = { head: null, branches: {}, remote: {}, movedBy: {} }
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const snapshot = (): SimState => ({
    head: state.head,
    branches: { ...state.branches },
    remote: { ...state.remote },
    movedBy: { ...state.movedBy },
  })
  const switchTo = (branch: string, commands: string[]) => {
    if (state.head !== branch) commands.push(`git switch ${branch}`)
    state.head = branch
  }
  // Work that only origin has is reached through origin/<branch>.
  const refOf = (id: string) => `${byId.get(id)?.origin ? "origin/" : ""}${branchOf.get(id)}`
  const moveRemote = (branch: string, commit: string, by: string) => {
    state.remote[branch] = commit
    state.movedBy[branch] = by
  }

  for (const node of runOrder(nodes, edges)) {
    const parents = parentsOf(node.id, edges).filter((p) => commitOf.has(p) || branchOf.has(p))
    const commands: string[] = []
    let error: string | undefined
    const first = parents[0]
    const parentBranch = first ? branchOf.get(first) : undefined
    const origin = !!node.origin

    if (node.kind === "branch") {
      const name = cleanBranch(node.label)
      const base = first ? commitOf.get(first) : undefined
      if (!first) {
        if (Object.keys(state.branches).length === 0 && !state.head) {
          commands.push("git init", `git switch -c ${name}`)
          branchOf.set(node.id, name)
          state.head = name
        } else error = `Branch "${name}" is not connected to anything to branch from`
      } else if (origin) {
        // Someone else made it on origin; this clone only learns about it from a fetch.
        commands.push(`~ origin: ${name} is created from ${refOf(first)}`, "git fetch origin")
        branchOf.set(node.id, name)
        if (base) {
          commitOf.set(node.id, base)
          moveRemote(name, base, node.id)
        }
      } else if (state.branches[name] && name !== parentBranch) {
        error = `A branch called "${name}" already exists`
      } else {
        if (byId.get(first)?.origin) commands.push(`git switch -c ${name} ${refOf(first)}`)
        else {
          if (parentBranch) switchTo(parentBranch, commands)
          commands.push(`git switch -c ${name}`)
        }
        branchOf.set(node.id, name)
        if (base) {
          commitOf.set(node.id, base)
          state.branches[name] = base
        }
        state.head = name
      }
    } else if (node.kind === "commit") {
      if (!parentBranch) error = "A commit needs to be connected to a branch or another commit"
      else {
        if (origin) commands.push(`~ origin: ${commitsText(node.count)} pushed to ${parentBranch}`, "git fetch origin")
        else {
          switchTo(parentBranch, commands)
          if ((node.count ?? 1) > 1) commands.push(`~ ${node.count} commits, the newest:`)
          commands.push(`git commit -m "${quote(node.label)}"`)
          state.branches[parentBranch] = node.id
        }
        branchOf.set(node.id, parentBranch)
        commitOf.set(node.id, node.id)
        if (origin) moveRemote(parentBranch, node.id, node.id)
      }
    } else if (node.kind === "merge") {
      const others = [
        ...new Set(
          parents
            .slice(1)
            .filter((p) => branchOf.has(p) && branchOf.get(p) !== parentBranch)
            .map(refOf),
        ),
      ]
      if (!parentBranch || others.length === 0) {
        error = "A merge needs its target first and at least one other branch connected"
      } else {
        if (origin) {
          commands.push(`~ origin: ${others.join(", ")} merged into ${parentBranch}`, "git fetch origin")
          moveRemote(parentBranch, node.id, node.id)
        } else {
          switchTo(parentBranch, commands)
          for (const other of others) commands.push(`git merge --no-ff ${other} -m "${quote(node.label)}"`)
          state.branches[parentBranch] = node.id
        }
        branchOf.set(node.id, parentBranch)
        commitOf.set(node.id, node.id)
      }
    } else if (node.kind === "push") {
      const tip = parentBranch ? state.branches[parentBranch] : undefined
      if (!parentBranch || !tip) error = "Push needs a branch with at least one commit"
      else {
        commands.push(
          state.remote[parentBranch] ? `git push origin ${parentBranch}` : `git push -u origin ${parentBranch}`,
        )
        branchOf.set(node.id, parentBranch)
        commitOf.set(node.id, tip)
        moveRemote(parentBranch, tip, node.id)
      }
    }

    if (error) commands.push(`# skipped: ${node.label || KIND_META[node.kind].title}`)
    steps.push({ nodeId: node.id, commands, state: snapshot(), error })
  }

  const unreached = nodes.filter((n) => n.kind !== "remote" && !steps.some((s) => s.nodeId === n.id))
  for (const node of unreached) {
    steps.push({
      nodeId: node.id,
      commands: ["# skipped: part of a loop"],
      state: snapshot(),
      error: "This node sits in a loop",
    })
  }
  // Commits each node stands for, so ahead and behind count real commits.
  const weight = new Map(
    nodes.filter((n) => n.kind === "commit" || n.kind === "merge").map((n) => [n.id, n.count ?? 1]),
  )
  return { steps, branchOf, weight }
}

// Commits reachable from a node, following parents, counted by weight.
function ancestors(start: string | undefined, edges: PlayEdge[]) {
  const seen = new Set<string>()
  const stack = start ? [start] : []
  while (stack.length) {
    const id = stack.pop()!
    if (seen.has(id)) continue
    seen.add(id)
    stack.push(...parentsOf(id, edges))
  }
  return seen
}

interface Tracking {
  ahead: number
  behind: number
}

// How far each local branch is from its origin/<branch>.
function trackAll(state: SimState, edges: PlayEdge[], weight: Map<string, number>) {
  const result = new Map<string, Tracking>()
  const sum = (ids: string[]) => ids.reduce((total, id) => total + (weight.get(id) ?? 0), 0)
  for (const [name, remoteAt] of Object.entries(state.remote)) {
    const localAt = state.branches[name]
    if (!localAt) continue
    const local = ancestors(localAt, edges)
    const remote = ancestors(remoteAt, edges)
    result.set(name, {
      ahead: sum([...local].filter((id) => !remote.has(id))),
      behind: sum([...remote].filter((id) => !local.has(id))),
    })
  }
  return result
}

/* --------------------------------------------------------------- canvas */

type GitNodeData = Omit<PlayNode, "id" | "x" | "y">
type GitFlowNode = Node<GitNodeData, "git">

const toFlowNodes = (nodes: PlayNode[]): GitFlowNode[] =>
  nodes.map(({ id, x, y, ...data }) => ({
    id,
    type: "git",
    position: { x, y },
    data,
    deletable: id !== REMOTE_ID,
  }))

const toFlowEdges = (edges: PlayEdge[]): Edge[] => edges.map((e) => ({ id: e.id, source: e.from, target: e.to }))

// Links drawn by the view (up to origin/main, or across hidden commits) rather than by the user.
const isRemoteLink = (id: string) => id.startsWith("remote-link-") || id.startsWith("bridge-")

type CommitView = "verbose" | "abstract" | "hidden"
const COMMIT_VIEWS: { value: CommitView; label: string; hint: string; icon: typeof GitBranchIcon }[] = [
  { value: "verbose", label: "Verbose", hint: "Commits as cards", icon: RectangleHorizontalIcon },
  { value: "abstract", label: "Abstract", hint: "Commits as dots on their branch line", icon: CircleDotIcon },
  { value: "hidden", label: "Hidden", hint: "Hide commits, keep branches, merges and pushes", icon: EyeOffIcon },
]

// What each node needs to draw itself during a run, shared through context so the node
// components stay stable while the run moves on.
interface RunView {
  branchOf: Map<string, string>
  activeId: string | null
  done: Set<string>
  running: boolean
  errors: Map<string, string>
  state: SimState
  tracking: Map<string, Tracking>
  hashOf: (id: string) => string
  rename: (id: string, label: string) => void
  /** Commits and merges drawn as dots on their branch line. */
  dots: boolean
}

// main vs origin/main, read from origin's side.
function originStatus(tracking: Tracking | undefined) {
  if (!tracking) return "only on origin"
  if (tracking.ahead) return `${tracking.ahead} behind main`
  if (tracking.behind) return `${tracking.behind} ahead of main`
  return "in sync"
}

const MAX_BADGES = 3
const DOT_W = 56

type Pointer = { name: string; branch: string; remote: boolean }

// Branch names above a node: filled for local branches, dashed for origin/<branch>.
function Badges({ pointers, head, className }: { pointers: Pointer[]; head: string | null; className: string }) {
  if (pointers.length === 0) return null
  return (
    <div className={cn("absolute -top-3 flex gap-1", className)}>
      {pointers.slice(0, MAX_BADGES).map((pointer) => (
        <span
          key={pointer.name}
          className={cn(
            "gp-pop truncate rounded-full px-1.5 text-[10px] font-medium shadow",
            pointer.remote ? "border border-dashed bg-background" : "text-white",
          )}
          style={
            pointer.remote
              ? { borderColor: branchColor(pointer.branch), color: branchColor(pointer.branch) }
              : { background: branchColor(pointer.branch) }
          }
        >
          {!pointer.remote && head === pointer.name ? "HEAD → " : ""}
          {pointer.name}
        </span>
      ))}
      {pointers.length > MAX_BADGES && (
        <span
          className="rounded-full bg-muted px-1.5 text-[10px] font-medium shadow"
          title={pointers
            .slice(MAX_BADGES)
            .map((p) => p.name)
            .join(", ")}
        >
          +{pointers.length - MAX_BADGES}
        </span>
      )}
    </div>
  )
}

const RunContext = createContext<RunView | null>(null)

const PLAYGROUND_CSS = `
@keyframes gp-pop { from { opacity: 0; transform: scale(.85) } to { opacity: 1; transform: scale(1) } }
@keyframes gp-pulse { 0% { box-shadow: 0 0 0 0 var(--gp-glow) } 100% { box-shadow: 0 0 0 14px transparent } }
.gp-pop { animation: gp-pop 260ms cubic-bezier(.22,1,.36,1) both }
.gp-active { animation: gp-pulse 900ms ease-out infinite }
.gp-flow .react-flow__handle { width: 12px; height: 12px; border-width: 2px; background: hsl(var(--background)); transition: transform 150ms }
.gp-flow .react-flow__handle:hover { transform: translate(var(--gp-hx, 0), -50%) scale(1.3) }
.gp-flow .react-flow__handle-left { --gp-hx: -50% }
.gp-flow .react-flow__handle-right { --gp-hx: 50% }
.gp-flow .react-flow__edge-path { transition: opacity 300ms, stroke-width 150ms }
.gp-flow .react-flow__controls { box-shadow: none; border-radius: 10px; overflow: hidden; border: 1px solid hsl(var(--border)) }
`

const GitNode = memo(function GitNode({ id, data, selected }: NodeProps<GitFlowNode>) {
  const view = useContext(RunContext)!
  const [editing, setEditing] = useState(false)
  const meta = KIND_META[data.kind]
  const Icon = meta.icon
  const isRemote = data.kind === "remote"
  const branch = isRemote ? "main" : (view.branchOf.get(id) ?? null)
  const color = branchColor(branch)
  const ran = view.done.has(id)
  const error = ran ? view.errors.get(id) : undefined
  const pointers: Pointer[] = [
    ...Object.entries(view.state.branches)
      .filter(([, at]) => at === id)
      .map(([name]) => ({ name, branch: name, remote: false })),
    ...Object.entries(view.state.remote)
      .filter(([, at]) => at === id)
      .map(([name]) => ({ name: `origin/${name}`, branch: name, remote: true })),
  ]
  const remoteTip = view.state.remote.main
  const many = (data.count ?? 1) > 1

  if (view.dots && (data.kind === "commit" || data.kind === "merge")) {
    const size = data.kind === "merge" ? 18 : many ? 16 : 12
    return (
      <div
        className={cn(
          "gp-pop relative flex items-center justify-center transition-opacity duration-300",
          view.running && !ran && "opacity-50",
        )}
        style={{ width: DOT_W, height: NODE_H, "--gp-glow": `${color}88` } as React.CSSProperties}
        title={[data.hash, data.label, data.detail, error].filter(Boolean).join("\n")}
      >
        {/* The branch line runs through the dot, so dots read as one timeline. */}
        <span
          className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2",
            data.origin ? "border-t-2 border-dashed" : "h-[2.5px]",
          )}
          style={data.origin ? { borderColor: color } : { background: color }}
        />
        <span
          className={cn(
            "relative rounded-full border-2 transition-transform duration-150",
            selected && "scale-125 shadow-lg",
            view.activeId === id && "gp-active",
          )}
          style={{
            width: size,
            height: size,
            borderColor: error ? "#ef4444" : color,
            background: data.kind === "merge" || data.origin ? "hsl(var(--background))" : color,
          }}
        />
        <Handle type="target" position={Position.Left} style={{ borderColor: color }} />
        <Handle type="source" position={Position.Right} style={{ borderColor: color }} />
        <Handle type="source" position={Position.Top} id="remote" isConnectable={false} style={{ opacity: 0 }} />
        <Badges pointers={pointers} head={view.state.head} className="left-1/2 -translate-x-1/2" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "gp-pop relative rounded-xl border-2 bg-background shadow-sm transition-[box-shadow,opacity,border-color] duration-300",
        view.running && !ran && !isRemote && "opacity-50",
        (error || data.origin) && "border-dashed",
        selected && "shadow-lg",
      )}
      style={
        {
          width: NODE_W,
          height: NODE_H,
          borderColor: error ? "#ef4444" : selected ? color : `${color}66`,
          "--gp-glow": `${color}88`,
        } as React.CSSProperties
      }
      title={error ?? data.detail ?? meta.hint}
      onDoubleClick={() => !isRemote && setEditing(true)}
    >
      {/* Its own element, so the pulse never restarts the node's pop-in. */}
      {view.activeId === id && <span className="gp-active pointer-events-none absolute -inset-0.5 rounded-xl" />}
      {isRemote ? (
        <Handle
          type="target"
          position={Position.Bottom}
          id="remote"
          isConnectable={false}
          style={{ borderColor: color }}
        />
      ) : (
        <>
          <Handle type="target" position={Position.Left} style={{ borderColor: color }} />
          <Handle type="source" position={Position.Right} style={{ borderColor: color }} />
          <Handle type="source" position={Position.Top} id="remote" isConnectable={false} style={{ opacity: 0 }} />
        </>
      )}
      <div className="flex h-full items-center gap-2 px-3">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: color }}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              defaultValue={data.label}
              className="nodrag w-full rounded bg-accent px-1 text-xs font-semibold outline-none"
              onBlur={(e) => {
                view.rename(id, e.target.value)
                setEditing(false)
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === "Enter") (e.target as HTMLInputElement).blur()
                if (e.key === "Escape") setEditing(false)
              }}
            />
          ) : (
            <p className="truncate text-xs font-semibold">{data.label}</p>
          )}
          <p className="truncate text-[10px] text-muted-foreground">
            {data.origin && <CloudIcon className="mr-1 inline size-3 align-[-2px]" />}
            {isRemote
              ? remoteTip
                ? `at ${view.hashOf(remoteTip)} · ${originStatus(view.tracking.get("main"))}`
                : "nothing pushed yet"
              : [many ? `${data.count} commits` : meta.title, data.kind !== "push" && data.hash, branch]
                  .filter(Boolean)
                  .join(" · ")}
          </p>
        </div>
      </div>
      <Badges pointers={pointers} head={view.state.head} className="right-2 max-w-[calc(100%+3rem)]" />
    </div>
  )
})

const NODE_TYPES = { git: GitNode }

// The canvas depends on the theme and its own size, which only the browser knows.
const noop = () => () => {}
const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

function Playground() {
  const { resolvedTheme } = useTheme()
  const isClient = useIsClient()
  const { fitView, screenToFlowPosition } = useReactFlow()
  const [meta, setMeta] = useState(() => {
    const flow = starterFlow()
    return { id: flow.id, name: flow.name }
  })
  const [nodes, setNodes, onNodesChange] = useNodesState<GitFlowNode>(toFlowNodes(starterFlow().nodes))
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(toFlowEdges(starterFlow().edges))
  const [saved, setSaved] = useState<Flow[]>([])
  const [stepIndex, setStepIndex] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  // Off until the saved draft is on screen, so the default flow never overwrites it.
  const [ready, setReady] = useState(false)
  const added = useRef(0)

  // Plain data for the simulation and for saving.
  const plainNodes = useMemo<PlayNode[]>(
    () =>
      nodes.map((n) => ({
        ...n.data,
        id: n.id,
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
      })),
    [nodes],
  )
  const plainEdges = useMemo<PlayEdge[]>(
    () => edges.filter((e) => !isRemoteLink(e.id)).map((e) => ({ id: e.id, from: e.source, to: e.target })),
    [edges],
  )
  // Positions change on every drag frame, the run does not depend on them beyond ordering.
  const structureKey = JSON.stringify([
    plainNodes.map((n) => [n.id, n.kind, n.label, n.origin, n.count]),
    plainEdges.map((e) => [e.from, e.to]),
  ])
  const sim = useMemo(
    () => simulate(plainNodes, plainEdges),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [structureKey],
  )

  const currentFlow = useCallback(
    (): Flow => ({
      ...meta,
      nodes: plainNodes,
      edges: plainEdges,
      updatedAt: new Date().toISOString(),
    }),
    [meta, plainNodes, plainEdges],
  )

  const showFlow = useCallback(
    (flow: Flow) => {
      setMeta({ id: flow.id, name: flow.name })
      setNodes(toFlowNodes(flow.nodes))
      setEdges(toFlowEdges(flow.edges))
      setStepIndex(null)
      setRunning(false)
      // Wait for the new nodes to be measured, or the fit has nothing to fit.
      setTimeout(() => fitView({ padding: 0.2, maxZoom: 1, duration: 400 }), 80)
    },
    [setNodes, setEdges, fitView],
  )

  useEffect(() => {
    const element = wrapper.current
    if (!element) return
    let fitted = false
    const observer = new ResizeObserver(([entry]) => {
      const visible = entry.contentRect.width > 0 && entry.contentRect.height > 0
      if (visible && !fitted) fitView({ padding: 0.2, maxZoom: 1 })
      fitted = visible
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [fitView, isClient])

  // localStorage only exists in the browser, so the saved data loads after the first paint.
  useEffect(() => {
    const draft = sanitizeFlow(readJson<unknown>(DRAFT_KEY, null))
    const flows = readJson<unknown[]>(FLOWS_KEY, [])
      .map(sanitizeFlow)
      .filter((f): f is Flow => !!f)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (draft) showFlow(draft)
    setSaved(flows)
    setReady(true)
  }, [showFlow])

  // The flow on screen survives a reload even before it is saved.
  useEffect(() => {
    if (ready) writeJson(DRAFT_KEY, currentFlow())
  }, [ready, currentFlow])

  // Editing the flow ends a run that is showing.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStepIndex(null)
    setRunning(false)
  }, [structureKey])

  // One step at a time while running.
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(
      () => {
        setStepIndex((current) => {
          const next = current === null ? 0 : current + 1
          if (next >= sim.steps.length) {
            setRunning(false)
            return current
          }
          return next
        })
      },
      stepIndex === null ? 50 : stepMs(sim.steps.length),
    )
    return () => clearTimeout(timer)
  }, [running, stepIndex, sim.steps.length])

  /* ------------------------------------------------------------ editing */

  const rename = useCallback(
    (id: string, label: string) => {
      setNodes((current) =>
        current.map((n) => {
          if (n.id !== id) return n
          const next = n.data.kind === "branch" ? cleanBranch(label) : label.trim() || KIND_META[n.data.kind].title
          return { ...n, data: { ...n.data, label: next } }
        }),
      )
    },
    [setNodes],
  )

  const addNode = (kind: Exclude<Kind, "remote">) => {
    const rect = wrapper.current?.getBoundingClientRect()
    const center = rect
      ? screenToFlowPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      : { x: 200, y: 200 }
    const labels = {
      branch: "feature/new",
      commit: "New commit",
      merge: "Merge",
      push: "Push",
    }
    const offset = (added.current++ % 6) * 24 - 60
    const node: GitFlowNode = {
      id: uid("node"),
      type: "git",
      // Each new node lands a little lower and to the right, so they never stack exactly.
      position: {
        x: center.x - NODE_W / 2 + offset,
        y: center.y - NODE_H / 2 + offset,
      },
      data: { kind, label: labels[kind] },
      selected: true,
    }
    setNodes((current) => [...current.map((n) => ({ ...n, selected: false })), node])
  }

  const wouldLoop = useCallback(
    (from: string, to: string) => {
      const stack = [to]
      const seen = new Set<string>()
      while (stack.length) {
        const id = stack.pop()!
        if (id === from) return true
        if (seen.has(id)) continue
        seen.add(id)
        for (const e of edges) if (e.source === id && !isRemoteLink(e.id)) stack.push(e.target)
      }
      return false
    },
    [edges],
  )

  const isValidConnection = useCallback(
    (c: Connection | Edge) =>
      !!c.source &&
      !!c.target &&
      c.source !== c.target &&
      c.source !== REMOTE_ID &&
      c.target !== REMOTE_ID &&
      !wouldLoop(c.source, c.target),
    [wouldLoop],
  )

  const onConnect = useCallback(
    (c: Connection) => {
      const target = nodes.find((n) => n.id === c.target)
      if (!target) return
      setEdges((current) =>
        addEdge(
          { ...c, id: uid("edge") },
          // Only a merge takes more than one parent; anything else swaps its old parent out.
          target.data.kind === "merge" ? current : current.filter((e) => e.target !== c.target || isRemoteLink(e.id)),
        ),
      )
    },
    [nodes, setEdges],
  )

  // Dropping a connection anywhere on a node connects to it, not only on its left dot.
  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connection: FinalConnectionState) => {
      if (connection.isValid || !connection.fromNode) return
      const point = "changedTouches" in event ? event.changedTouches[0] : event
      const target = document
        .elementFromPoint(point.clientX, point.clientY)
        ?.closest<HTMLElement>(".react-flow__node")
        ?.getAttribute("data-id")
      if (!target) return
      // A drag that started on a node's left dot runs the other way.
      const fromInput = connection.fromHandle?.type === "target"
      const next = {
        source: fromInput ? target : connection.fromNode.id,
        target: fromInput ? connection.fromNode.id : target,
        sourceHandle: null,
        targetHandle: null,
      }
      if (isValidConnection(next)) onConnect(next)
    },
    [isValidConnection, onConnect],
  )

  const setOrigin = (id: string, origin: boolean) =>
    setNodes((current) =>
      current.map((n) => (n.id === id ? { ...n, data: { ...n.data, origin: origin || undefined } } : n)),
    )

  /* ----------------------------------------------------------- full screen */

  const [fullscreen, setFullscreen] = useState(false)

  // The canvas fills the window, and the browser's own full screen is asked for on top where it is
  // allowed (embedded browsers often refuse it). The button or Esc leaves it.
  const toggleFullscreen = () => {
    if (fullscreen) {
      setFullscreen(false)
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    } else {
      setFullscreen(true)
      wrapper.current?.requestFullscreen?.().catch(() => {})
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.2, maxZoom: 1, duration: 300 }), 250)
    if (!fullscreen) return () => clearTimeout(timer)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false)
    // Esc in the browser's full screen only leaves that; leave the window-filling view with it.
    const onChange = () => !document.fullscreenElement && setFullscreen(false)
    window.addEventListener("keydown", onKey)
    document.addEventListener("fullscreenchange", onChange)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("keydown", onKey)
      document.removeEventListener("fullscreenchange", onChange)
    }
  }, [fullscreen, fitView])

  /* ------------------------------------------------------------- datasets */

  const [loadingRepo, setLoadingRepo] = useState<RepoKey | null>(null)

  // A repo's real branches as a new flow: edit, run and save it like any other.
  const loadRepo = async (repo: RepoKey) => {
    setLoadingRepo(repo)
    try {
      const res = await fetch(`/penguin/api/git/playground?repo=${repo}`)
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.message ?? "Could not read the branches")
      const flow = sanitizeFlow({ ...body, id: uid("flow"), updatedAt: body?.generatedAt })
      if (!flow || flow.nodes.length < 2) throw new Error("This repo has no branches to show")
      showFlow(flow)
      toast.success(`Loaded ${flow.nodes.filter((n) => n.kind === "branch").length} branches`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read the branches")
    } finally {
      setLoadingRepo(null)
    }
  }

  /* -------------------------------------------------------------- saving */

  const saveFlow = () => {
    const entry = currentFlow()
    const next = [entry, ...saved.filter((f) => f.id !== entry.id)]
    if (writeJson(FLOWS_KEY, next)) {
      setSaved(next)
      toast.success(`Saved "${entry.name}"`)
    } else toast.error("This browser would not save the flow")
  }

  const deleteSaved = (id: string) => {
    const next = saved.filter((f) => f.id !== id)
    writeJson(FLOWS_KEY, next)
    setSaved(next)
  }

  /* ------------------------------------------------------------- render */

  const step = stepIndex !== null ? sim.steps[stepIndex] : null
  const done = useMemo(
    () => new Set(stepIndex === null ? [] : sim.steps.slice(0, stepIndex + 1).map((s) => s.nodeId)),
    [sim.steps, stepIndex],
  )
  // Before a run the canvas shows where the flow ends up.
  const state = step?.state ?? sim.steps.at(-1)?.state ?? EMPTY_STATE
  const tracking = useMemo(() => trackAll(state, plainEdges, sim.weight), [state, plainEdges, sim.weight])
  const hashes = useMemo(
    () => new Map(plainNodes.map((n) => [n.id, n.hash])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [structureKey],
  )
  const hashOf = useCallback((id: string) => hashes.get(id) ?? fakeHash(id), [hashes])
  const errors = useMemo(() => new Map(sim.steps.filter((s) => s.error).map((s) => [s.nodeId, s.error!])), [sim])
  const log = stepIndex === null ? [] : sim.steps.slice(0, stepIndex + 1)
  const selectedNode = nodes.find((n) => n.selected)
  const activeId = step?.nodeId ?? null
  const isRunning = stepIndex !== null
  const [commitView, setCommitView] = useState<CommitView>("verbose")
  const dots = commitView === "abstract"
  const hideCommits = commitView === "hidden"

  // Stable while dragging, so a drag only redraws the node being dragged.
  const view = useMemo<RunView>(
    () => ({
      branchOf: sim.branchOf,
      activeId,
      done,
      running: isRunning,
      errors,
      state,
      tracking,
      hashOf,
      rename,
      dots,
    }),
    [sim.branchOf, activeId, done, isRunning, errors, state, tracking, hashOf, rename, dots],
  )

  // Whatever last moved origin/main (pushes of main, or work that landed on origin) links up to it.
  const movedMain = state.movedBy.main
  const remoteLinks = new Set(
    plainNodes.filter((n) => n.kind === "push" && sim.branchOf.get(n.id) === "main").map((n) => n.id),
  )
  if (movedMain && plainNodes.some((n) => n.id === movedMain && n.kind !== "push")) remoteLinks.add(movedMain)

  // Edges take their branch colour, and are dashed into work that only origin has.
  const originIds = new Set(plainNodes.filter((n) => n.origin).map((n) => n.id))
  // With commits hidden, each edge into a visible node reaches back past them to the visible ones.
  const hiddenIds = new Set(hideCommits ? plainNodes.filter((n) => n.kind === "commit").map((n) => n.id) : [])
  const shownNodes = hideCommits ? nodes.map((n) => (hiddenIds.has(n.id) ? { ...n, hidden: true } : n)) : nodes
  const bridges: Edge[] = []
  if (hiddenIds.size) {
    const seen = new Set<string>()
    for (const e of edges) {
      if (hiddenIds.has(e.target) || !hiddenIds.has(e.source) || isRemoteLink(e.id)) continue
      const stack = [e.source]
      const visited = new Set<string>()
      while (stack.length) {
        const id = stack.pop()!
        if (visited.has(id)) continue
        visited.add(id)
        if (!hiddenIds.has(id)) {
          const key = `bridge-${id}-${e.target}`
          if (!seen.has(key)) {
            seen.add(key)
            bridges.push({ id: key, source: id, target: e.target, selectable: false, deletable: false })
          }
        } else for (const p of parentsOf(id, plainEdges)) stack.push(p)
      }
    }
  }
  const shownEdges: Edge[] = [
    ...[...edges, ...bridges].map((e) => {
      const color = branchColor(sim.branchOf.get(e.target) ?? sim.branchOf.get(e.source) ?? null)
      return {
        ...e,
        animated: step?.nodeId === e.target,
        style: {
          stroke: color,
          strokeWidth: e.selected ? 3.5 : 2.5,
          strokeDasharray: originIds.has(e.target) ? "6 4" : undefined,
          opacity: stepIndex !== null && !done.has(e.target) ? 0.3 : 0.9,
        },
      }
    }),
    ...[...remoteLinks].map((id) => ({
      id: `remote-link-${id}`,
      source: id,
      sourceHandle: "remote",
      target: REMOTE_ID,
      targetHandle: "remote",
      selectable: false,
      deletable: false,
      focusable: false,
      animated: step?.nodeId === id,
      style: {
        stroke: branchColor("main"),
        strokeWidth: 2,
        strokeDasharray: "5 5",
        opacity: stepIndex === null || done.has(id) ? 0.9 : 0.3,
      },
    })),
  ]

  return (
    <div className="space-y-3">
      <style>{PLAYGROUND_CSS}</style>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={meta.name}
          onChange={(e) => setMeta((m) => ({ ...m, name: e.target.value }))}
          className="h-9 w-56"
          aria-label="Flow name"
        />
        <Button size="sm" variant="outline" onClick={saveFlow}>
          <SaveIcon className="size-4" /> Save
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <FolderOpenIcon className="size-4" /> Saved ({saved.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            {saved.length === 0 && <div className="p-2 text-xs text-muted-foreground">No saved flows yet.</div>}
            {saved.map((entry) => (
              <DropdownMenuItem key={entry.id} onSelect={() => showFlow(entry)} className="cursor-pointer gap-2">
                <span className="flex-1 truncate">{entry.name}</span>
                <span className="text-[10px] text-muted-foreground">{entry.nodes.length - 1} nodes</span>
                <button
                  type="button"
                  aria-label={`Delete ${entry.name}`}
                  className="rounded p-1 text-muted-foreground hover:text-destructive"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    deleteSaved(entry.id)
                  }}
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" disabled={!!loadingRepo}>
              <DatabaseIcon className="size-4" /> {loadingRepo ? "Reading branches…" : "Load repo"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            {REPOS.map((repo) => (
              <DropdownMenuItem
                key={repo.key}
                onSelect={() => loadRepo(repo.key)}
                className="cursor-pointer flex-col items-start gap-0"
              >
                <span>{repo.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  Every local and origin branch, as of the last fetch
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="ghost" onClick={() => showFlow(emptyFlow())}>
          <PlusIcon className="size-4" /> New
        </Button>
        <Button size="sm" variant="ghost" onClick={() => showFlow(starterFlow())}>
          Example
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_17rem]">
        <div
          ref={wrapper}
          className={cn(
            "gp-flow overflow-hidden bg-card",
            fullscreen ? "fixed inset-0 z-50 h-screen w-screen" : "h-[36rem] rounded-xl border",
          )}
        >
          {isClient && (
            <RunContext.Provider value={view}>
              <ReactFlow
                nodes={shownNodes}
                edges={shownEdges}
                nodeTypes={NODE_TYPES}
                onNodesChange={onNodesChange}
                onEdgesChange={(changes) => onEdgesChange(changes.filter((c) => !("id" in c) || !isRemoteLink(c.id)))}
                onConnect={onConnect}
                onConnectEnd={onConnectEnd}
                connectionRadius={40}
                isValidConnection={isValidConnection}
                colorMode={resolvedTheme === "dark" ? "dark" : "light"}
                deleteKeyCode={["Backspace", "Delete"]}
                defaultEdgeOptions={{ type: "default" }}
                connectionLineStyle={{
                  strokeWidth: 2.5,
                  strokeDasharray: "6 4",
                }}
                snapToGrid
                snapGrid={[10, 10]}
                fitView
                fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
                minZoom={0.15}
                maxZoom={1.8}
                proOptions={{ hideAttribution: true }}
                style={{ background: "transparent" }}
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} />
                <Controls showInteractive={false}>
                  <ControlButton
                    onClick={toggleFullscreen}
                    title={fullscreen ? "Exit full screen (Esc)" : "Full screen"}
                    aria-label={fullscreen ? "Exit full screen" : "Full screen"}
                  >
                    {fullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
                  </ControlButton>
                </Controls>
                {/* <MiniMap
                  pannable
                  zoomable
                  className="!rounded-lg !border"
                  nodeColor={(n) => branchColor(n.id === REMOTE_ID ? "main" : (sim.branchOf.get(n.id) ?? null))}
                  nodeBorderRadius={8}
                /> */}
                <Panel position="top-left">
                  <div className="flex flex-wrap items-center gap-1 rounded-xl border bg-white dark:bg-black p-1 shadow-sm backdrop-blur">
                    {(["branch", "commit", "merge", "push"] as const).map((kind) => {
                      const Icon = KIND_META[kind].icon
                      return (
                        <Button
                          key={kind}
                          size="sm"
                          variant="ghost"
                          className="hover:bg-black/5 dark:hover:bg-white/15"
                          title={KIND_META[kind].hint}
                          onClick={() => addNode(kind)}
                        >
                          <Icon className="size-4" /> {KIND_META[kind].title}
                        </Button>
                      )
                    })}
                    <span className="mx-0.5 h-5 w-px bg-border" />
                    {COMMIT_VIEWS.map(({ value, label, hint, icon: Icon }) => (
                      <Button
                        key={value}
                        size="sm"
                        variant="ghost"
                        title={hint}
                        aria-pressed={commitView === value}
                        className={cn(
                          "hover:bg-black/5 dark:hover:bg-white/15",
                          commitView === value &&
                            "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 hover:text-blue-600 hover:bg-blue-600/10 dark:hover:bg-blue-600/20",
                        )}
                        onClick={() => setCommitView(value)}
                      >
                        <Icon className="size-4" /> {label}
                      </Button>
                    ))}
                  </div>
                </Panel>
              </ReactFlow>
            </RunContext.Provider>
          )}
        </div>

        <aside className="space-y-3">
          <div className="space-y-2 rounded-xl border bg-card p-3 text-xs">
            <p className="font-semibold uppercase text-black/60 dark:text-white/60">Selected</p>
            {selectedNode ? (
              <>
                <p className="text-muted-foreground">{KIND_META[selectedNode.data.kind].hint}</p>
                {selectedNode.data.detail && (
                  <p className="break-words rounded-md bg-muted/60 p-2">
                    {selectedNode.data.hash && <code className="mr-1 font-semibold">{selectedNode.data.hash}</code>}
                    {selectedNode.data.detail}
                  </p>
                )}
                {selectedNode.data.kind !== "remote" && (
                  <Input
                    key={selectedNode.id + selectedNode.data.label}
                    defaultValue={selectedNode.data.label}
                    className="h-8 text-xs"
                    aria-label="Node name"
                    onBlur={(e) => rename(selectedNode.id, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                  />
                )}
                {["branch", "commit", "merge"].includes(selectedNode.data.kind) && (
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={!!selectedNode.data.origin}
                      onChange={(e) => setOrigin(selectedNode.id, e.target.checked)}
                    />
                    Only on origin (someone else&apos;s work, fetched)
                  </label>
                )}
                {selectedNode.id !== REMOTE_ID && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setNodes((current) => current.filter((n) => n.id !== selectedNode.id))
                      setEdges((current) =>
                        current.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id),
                      )
                    }}
                  >
                    <Trash2Icon className="size-4" /> Delete
                  </Button>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                Add nodes from the toolbar. Drag a node&apos;s right dot onto another node to connect, double-click to
                rename, Delete removes the selection. Scroll to zoom, drag the background to pan.
              </p>
            )}
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {running ? (
          <Button size="sm" onClick={() => setRunning(false)}>
            <SquareIcon className="size-4" /> Stop
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => {
              if (stepIndex !== null && stepIndex >= sim.steps.length - 1) setStepIndex(null)
              setRunning(true)
            }}
            disabled={sim.steps.length === 0}
          >
            <PlayIcon className="size-4" />
            {stepIndex !== null && stepIndex < sim.steps.length - 1 ? "Resume flow" : "Run flow"}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          disabled={stepIndex === null}
          onClick={() => {
            setRunning(false)
            setStepIndex(null)
          }}
        >
          <RotateCcwIcon className="size-4" /> Reset
        </Button>
        <span className="text-xs text-muted-foreground">
          Simulation only: these commands are never run, and flows are saved in this browser.
        </span>
      </div>

      <div className="max-h-56 overflow-y-auto rounded-xl border border-dashed bg-white p-3 font-mono text-xs">
        {log.length === 0 ? (
          <p className="text-black">$ press Run flow to play the flow step by step</p>
        ) : (
          log.map((entry, i) => (
            <div key={`${entry.nodeId}-${i}`} className="gp-pop font-mono">
              {entry.commands.map((command, j) => (
                <p
                  key={j}
                  className={
                    command.startsWith("#") ? "text-amber-300" : command.startsWith("~ ") ? "text-sky-600" : undefined
                  }
                >
                  {command.startsWith("#") ? command : command.startsWith("~ ") ? command.slice(2) : `$ ${command}`}
                </p>
              ))}
              {entry.error && <p className="text-red-400"># {entry.error}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function GitPlaygroundTab() {
  return (
    <ReactFlowProvider>
      <Playground />
    </ReactFlowProvider>
  )
}

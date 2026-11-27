import { execFile } from "node:child_process"
import { existsSync, readFileSync, promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { createStore } from "../../../../scripts/store.mjs"
import { buildBranchFlow, type FlowCommit, type FlowRef } from "./branch-flow"
import type {
  BranchInfo,
  CommitTime,
  CommitPage,
  CommittableRun,
  DbBackupData,
  DbBackupFile,
  DbBackupFileStatus,
  DbBackupRun,
  QuestionItem,
  QuestionKind,
  QuestionPriority,
  DocFile,
  DocGroup,
  ExplainRun,
  GitGuideRun,
  CommitFile,
  CommitInfo,
  DiffFile,
  FileChange,
  ActivityAuthor,
  ActivityData,
  Contributor,
  FileActivity,
  FileDay,
  GraphData,
  PlaygroundDataset,
  Quality,
  RepoInfo,
  RepoKey,
  RepoMeta,
  Review,
  Severity,
  TodoItem,
  TodoStatus,
  Verdict,
} from "./types"

const run = promisify(execFile)

const ROOT = process.cwd()
// .penguin/data/<repo>/<kind>.json arrays, with their Markdown copies kept in sync.
const store = createStore(ROOT)
const MAX_PATCH_CHARS = 200_000
const HASH_PATTERN = /^[0-9a-f]{7,40}$/
const MAX_PAGE = 200
const MAX_GRAPH = 6_000

export const REPO_KEYS: readonly RepoKey[] = ["frontend", "backend"]

export function isLocalOnly() {
  return process.env.NODE_ENV !== "production"
}

export function isValidHash(hash: string) {
  return HASH_PATTERN.test(hash)
}

export function isRepoKey(value: unknown): value is RepoKey {
  return REPO_KEYS.includes(value as RepoKey)
}

// penguin.config.json says where each repo lives, relative to this repo.
// PENGUIN_FRONTEND_PATH / PENGUIN_BACKEND_PATH override it.
function loadRepoConfig(): Record<RepoKey, RepoMeta & { dir: string }> {
  const config = JSON.parse(readFileSync(path.join(ROOT, "penguin.config.json"), "utf8"))
  const entries = REPO_KEYS.map((key) => {
    const repo = config?.repos?.[key] ?? {}
    const override = process.env[`PENGUIN_${key.toUpperCase()}_PATH`]
    return [
      key,
      {
        key,
        label: String(repo.label ?? key),
        name: String(repo.name ?? key),
        // The repos live outside this project, so keep the bundler from tracing them.
        dir: path.resolve(/*turbopackIgnore: true*/ ROOT, override || String(repo.path ?? `../${key}`)),
      },
    ] as const
  })
  return Object.fromEntries(entries) as Record<RepoKey, RepoMeta & { dir: string }>
}

const REPOS = loadRepoConfig()

export const repoMeta = (key: RepoKey): RepoMeta => {
  const { label, name } = REPOS[key]
  return { key, label, name }
}

async function git(repo: RepoKey, args: string[]) {
  const { stdout } = await run("git", args, {
    cwd: REPOS[repo].dir,
    maxBuffer: 100 * 1024 * 1024,
  })
  return stdout
}

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback)
const asNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : 0)
const asArray = (value: unknown): any[] => (Array.isArray(value) ? value : [])
const asStrings = (value: unknown) => asArray(value).filter((v) => typeof v === "string") as string[]

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

// Each repo keeps one array per kind. Entries from both repos come back newest first.
async function readRepoRuns<T>(
  kind: string,
  normalize: (raw: any, fileName: string, repo: RepoKey) => T,
): Promise<T[]> {
  const runs: { time: number; run: T }[] = []
  for (const repo of REPO_KEYS) {
    let items: any[] = []
    try {
      items = await store.readItems(repo, kind)
    } catch {
      continue
    }
    for (const raw of items) {
      if (!raw || typeof raw !== "object") continue
      runs.push({
        time: new Date(raw.generatedAt).getTime() || 0,
        run: normalize(raw, `${repo}/${asString(raw.id)}`, repo),
      })
    }
  }
  return runs.sort((a, b) => b.time - a.time).map(({ run }) => run)
}

function normalizeReview(raw: any, fileName: string, repo: RepoKey): Review {
  const files = raw?.files ?? {}
  const summary = raw?.summary ?? {}
  return {
    fileName,
    id: asString(raw?.id),
    repo,
    generatedAt: asString(raw?.generatedAt),
    branch: asString(raw?.branch),
    target: {
      kind: asString(raw?.target?.kind, "uncommitted"),
      commit: typeof raw?.target?.commit === "string" ? raw.target.commit : null,
      title:
        typeof raw?.target?.title === "string" && raw.target.title.trim()
          ? raw.target.title.trim().replace(/^Test run\s+/i, "")
          : null,
    },
    screenshots: asArray(raw?.screenshots).filter((n): n is string => typeof n === "string"),
    responses: asArray(raw?.responses).filter((n): n is string => typeof n === "string"),
    data: asArray(raw?.data).filter((n): n is string => typeof n === "string"),
    files: {
      changed: asNumber(files.changed),
      added: asNumber(files.added),
      modified: asNumber(files.modified),
      deleted: asNumber(files.deleted),
      insertions: asNumber(files.insertions),
      deletions: asNumber(files.deletions),
    },
    changeType: asStrings(raw?.changeType),
    verdict: pick<Verdict>(
      raw?.verdict,
      ["request-changes", "review-with-caution", "looks-good"],
      "review-with-caution",
    ),
    score: Math.min(100, Math.max(0, asNumber(raw?.score))),
    commitScore: typeof raw?.commitScore === "number" ? Math.min(100, Math.max(0, raw.commitScore)) : null,
    quality: pick<Quality>(raw?.quality, ["excellent", "good", "fair", "poor"], "fair"),
    summary: {
      red: asNumber(summary.red),
      amber: asNumber(summary.amber),
      green: asNumber(summary.green),
      info: asNumber(summary.info),
    },
    before: asString(raw?.before),
    after: asString(raw?.after),
    effects: asStrings(raw?.effects),
    filesReviewed: asArray(raw?.filesReviewed).map((f) => ({
      path: asString(f?.path),
      change: pick<FileChange>(f?.change, ["added", "modified", "deleted"], "modified"),
      status: pick(f?.status, ["red", "amber", "green"] as const, "green"),
      note: asString(f?.note),
    })),
    findings: asArray(raw?.findings).map((f, i) => ({
      id: asString(f?.id, `F${i + 1}`),
      severity: pick<Severity>(f?.severity, ["P0", "P1", "P2", "P3"], "P3"),
      title: asString(f?.title),
      location: asString(f?.location),
      problem: asString(f?.problem),
      impact: asString(f?.impact),
      fix: asString(f?.fix),
      evidence: asString(f?.evidence),
      status: pick(f?.status, ["open", "resolved"] as const, "open"),
      resolvedIn: typeof f?.resolvedIn === "string" ? f.resolvedIn : null,
      resolvedAt: typeof f?.resolvedAt === "string" ? f.resolvedAt : null,
      resolvedNote: typeof f?.resolvedNote === "string" ? f.resolvedNote : null,
      needsAttention: f?.needsAttention === true,
      attentionNote: typeof f?.attentionNote === "string" ? f.attentionNote : null,
      confirmed: f?.confirmed === true,
      confirmedNote: typeof f?.confirmedNote === "string" ? f.confirmedNote : null,
      future: f?.future === true || f?.optional === true,
    })),
    checks: asArray(raw?.checks).map((c) => ({
      status: pick(c?.status, ["green", "red", "grey"] as const, "grey"),
      command: asString(c?.command),
      result: asString(c?.result),
    })),
    gaps: asStrings(raw?.gaps),
    info: asStrings(raw?.info),
  }
}

export const getReviews = () => readRepoRuns<Review>("howismycommit", normalizeReview)

/* ------------------------------------------------------------------ git */

async function repoAvailable(repo: RepoKey) {
  if (!existsSync(REPOS[repo].dir)) return false
  try {
    await git(repo, ["rev-parse", "--git-dir"])
    return true
  } catch {
    return false
  }
}

export async function getBranches(repo: RepoKey): Promise<BranchInfo[]> {
  const out = await git(repo, [
    "for-each-ref",
    "--sort=-committerdate",
    "--format=%(refname)%1f%(refname:short)%1f%(objectname)%1f%(committerdate:iso-strict)%1f%(HEAD)%1f%(subject)",
    "refs/heads",
    "refs/remotes",
  ])
  const branches: BranchInfo[] = []
  for (const line of out.split("\n")) {
    if (!line.trim()) continue
    const [ref, name, hash, date, head, subject] = line.split("\x1f")
    if (ref.endsWith("/HEAD")) continue
    branches.push({
      name,
      remote: ref.startsWith("refs/remotes/"),
      hash,
      date,
      subject: subject ?? "",
      current: head === "*",
    })
  }
  return branches
}

export async function getRepoInfo(repo: RepoKey): Promise<RepoInfo> {
  const meta = repoMeta(repo)
  if (!(await repoAvailable(repo))) {
    return {
      ...meta,
      available: false,
      error: `No git repo at ${REPOS[repo].dir}. Set its path in penguin.config.json.`,
      currentBranch: null,
      currentUser: null,
      branches: [],
    }
  }
  try {
    const [branches, current, user] = await Promise.all([
      getBranches(repo),
      git(repo, ["rev-parse", "--abbrev-ref", "HEAD"]).then((s) => s.trim()),
      git(repo, ["config", "user.name"]).then((s) => s.trim() || null).catch(() => null),
    ])
    return { ...meta, available: true, error: null, currentBranch: current, currentUser: user, branches }
  } catch (error) {
    return {
      ...meta,
      available: false,
      error: error instanceof Error ? error.message : "Could not read git",
      currentBranch: null,
      currentUser: null,
      branches: [],
    }
  }
}

export const ALL_BRANCHES = "__all__"

// Only refs that exist in the repo reach git, so a crafted value can never become a flag.
// With remote off, "all branches" means the local ones only.
// `only` narrows "all branches" to the branches the user has switched on (by branch key, so origin/x is x).
async function resolveRefs(repo: RepoKey, branch: string, remote = true, only?: string[]): Promise<string[]> {
  if (branch === ALL_BRANCHES && only) {
    const keys = new Set(only)
    const refs = (await getBranches(repo))
      .filter((b) => (remote || !b.remote) && keys.has(b.remote ? b.name.replace(/^[^/]+\//, "") : b.name))
      .map((b) => (b.remote ? `refs/remotes/${b.name}` : `refs/heads/${b.name}`))
    // A glob that matches nothing keeps git log from falling back to HEAD when no branch is on.
    return refs.length > 0 ? refs : ["--branches=__no_branch_selected__"]
  }
  if (branch === ALL_BRANCHES) return remote ? ["--branches", "--remotes"] : ["--branches"]
  const branches = await getBranches(repo)
  const match = branches.find((b) => b.name === branch)
  if (!match) throw new Error(`Unknown branch "${branch}"`)
  return [match.remote ? `refs/remotes/${match.name}` : `refs/heads/${match.name}`]
}

const CHANGE_BY_LETTER: Record<string, FileChange> = { A: "added", D: "deleted" }
const LOG_FORMAT = "%x1e%H%x1f%an%x1f%aI%x1f%s%x1f%b%x1f"

function parseCommitChunk(chunk: string, repo: RepoKey): Omit<CommitInfo, "review" | "history"> | null {
  const parts = chunk.split("\x1f")
  if (parts.length < 6) return null
  const [hash, author, date, subject, body, rest] = parts
  const changeByPath = new Map<string, FileChange>()
  const stats = new Map<string, { insertions: number; deletions: number }>()

  for (const line of rest.split("\n")) {
    if (line.startsWith(":")) {
      const [meta, filePath] = line.split("\t")
      const letter = meta.trim().split(" ").pop()?.[0] ?? "M"
      if (filePath) changeByPath.set(filePath, CHANGE_BY_LETTER[letter] ?? "modified")
    } else if (line.includes("\t")) {
      const [ins, del, filePath] = line.split("\t")
      if (filePath) {
        stats.set(filePath, {
          insertions: ins === "-" ? 0 : Number(ins) || 0,
          deletions: del === "-" ? 0 : Number(del) || 0,
        })
      }
    }
  }

  const files: CommitFile[] = [...changeByPath.entries()].map(([filePath, change]) => ({
    path: filePath,
    change,
    insertions: stats.get(filePath)?.insertions ?? 0,
    deletions: stats.get(filePath)?.deletions ?? 0,
  }))

  return {
    repo,
    hash: hash.trim(),
    shortHash: hash.trim().slice(0, 7),
    subject,
    body: body.trim(),
    author,
    date,
    insertions: files.reduce((sum, f) => sum + f.insertions, 0),
    deletions: files.reduce((sum, f) => sum + f.deletions, 0),
    files,
  }
}

function parseLog(out: string, repo: RepoKey, reviews: Map<string, Review[]>): CommitInfo[] {
  const commits: CommitInfo[] = []
  for (const chunk of out.split("\x1e")) {
    if (!chunk.trim()) continue
    const parsed = parseCommitChunk(chunk, repo)
    if (!parsed) continue
    const runs = reviews.get(parsed.hash) ?? []
    commits.push({
      ...parsed,
      review: runs[0] ?? null,
      history: runs.map((r) => ({
        id: r.id,
        generatedAt: r.generatedAt,
        verdict: r.verdict,
        score: r.score,
        open: r.findings.filter((f) => f.status === "open").length,
        resolved: r.findings.filter((f) => f.status === "resolved").length,
        attention: r.findings.filter((f) => f.needsAttention).length,
      })),
    })
  }
  return commits
}

// Reviews come newest first, so the first one of a commit is the one the page shows in full.
function reviewsByCommit(reviews: Review[], repo: RepoKey) {
  const byCommit = new Map<string, Review[]>()
  for (const review of reviews) {
    const commit = review.target.commit
    if (review.repo === repo && commit) byCommit.set(commit, [...(byCommit.get(commit) ?? []), review])
  }
  return byCommit
}

// Everyone with a commit on the branch, most commits first.
export async function getContributors(repo: RepoKey, branch: string, remote = true): Promise<Contributor[]> {
  const refs = await resolveRefs(repo, branch, remote)
  const out = await git(repo, ["log", "--format=%an%x1f%aI", ...refs, "--"])
  const people = new Map<string, Contributor>()
  for (const line of out.split("\n")) {
    const [name, date] = line.split("\x1f")
    if (!name || !date) continue
    const person = people.get(name) ?? { name, commits: 0, lastDate: date }
    person.commits += 1
    if (date > person.lastDate) person.lastDate = date
    people.set(name, person)
  }
  return [...people.values()].sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name))
}

// git matches --author as a regex against "Name <email>", so each name is matched whole.
const authorPattern = (name: string) => `^${name.replace(/[\\.[*^$]/g, "\\$&")} <`

const TRUNK_FIRST = ["main", "master", "dev", "develop"]
const membershipCache = new Map<string, { key: string; byCommit: Map<string, string[]> }>()

const firstParentCache = new Map<string, { key: string; lines: Map<string, Set<string>> }>()

// For each branch, the commits on its first-parent line: the ones merged or committed straight onto it.
async function getFirstParentLines(repo: RepoKey): Promise<Map<string, Set<string>>> {
  const branches = await getBranches(repo)
  const key = branches.map((b) => `${b.name}@${b.hash}`).join("|")
  const cached = firstParentCache.get(repo)
  if (cached?.key === key) return cached.lines
  const lines = new Map<string, Set<string>>()
  await Promise.all(
    branches.map(async (branch) => {
      const name = branch.remote ? branch.name.replace(/^origin\//, "") : branch.name
      const ref = branch.remote ? `refs/remotes/${branch.name}` : `refs/heads/${branch.name}`
      const out = await git(repo, ["rev-list", "--first-parent", ref, "--"])
      const set = lines.get(name) ?? new Set<string>()
      for (const hash of out.split("\n")) if (hash) set.add(hash)
      lines.set(name, set)
    }),
  )
  firstParentCache.set(repo, { key, lines })
  return lines
}

// Which branches contain each commit. One rev-list per branch, cached until a branch tip moves.
async function getMembership(repo: RepoKey): Promise<Map<string, string[]>> {
  const branches = await getBranches(repo)
  const key = branches.map((b) => `${b.name}@${b.hash}`).join("|")
  const cached = membershipCache.get(repo)
  if (cached?.key === key) return cached.byCommit

  const tips = new Map<string, string[]>()
  for (const branch of branches) {
    const name = branch.remote ? branch.name.replace(/^origin\//, "") : branch.name
    tips.set(name, [...(tips.get(name) ?? []), branch.remote ? `refs/remotes/${branch.name}` : `refs/heads/${branch.name}`])
  }
  const names = [...tips.keys()].sort((a, b) => {
    const rank = (n: string) => (TRUNK_FIRST.includes(n) ? TRUNK_FIRST.indexOf(n) : TRUNK_FIRST.length)
    return rank(a) - rank(b) || a.localeCompare(b)
  })

  const byCommit = new Map<string, string[]>()
  await Promise.all(
    names.map(async (name) => {
      const out = await git(repo, ["rev-list", ...tips.get(name)!, "--"])
      for (const hash of out.split("\n")) {
        if (!hash) continue
        const list = byCommit.get(hash)
        if (list) list.push(name)
        else byCommit.set(hash, [name])
      }
    }),
  )
  for (const list of byCommit.values()) list.sort((a, b) => names.indexOf(a) - names.indexOf(b))
  membershipCache.set(repo, { key, byCommit })
  return byCommit
}

export async function getCommitPage(
  repo: RepoKey,
  branch: string,
  skip: number,
  limit: number,
  authors: string[] = [],
  remote = true,
  only?: string[],
): Promise<CommitPage> {
  const take = Math.min(Math.max(1, limit), MAX_PAGE)
  const [refs, reviews] = await Promise.all([resolveRefs(repo, branch, remote, only), getReviews()])
  const out = await git(repo, [
    "log",
    "--date-order",
    "--no-renames",
    "--raw",
    "--numstat",
    `--format=${LOG_FORMAT}`,
    `--skip=${Math.max(0, skip)}`,
    `--max-count=${take + 1}`,
    ...authors.map((name) => `--author=${authorPattern(name)}`),
    ...refs,
    "--",
  ])
  const commits = parseLog(out, repo, reviewsByCommit(reviews, repo))
  const membership = await getMembership(repo)
  for (const commit of commits) commit.branches = membership.get(commit.hash) ?? []
  // A GitHub pull request merge names only the branch it came from. The branch it went into is the one
  // that has the merge on its own first-parent line.
  const pullRequests = commits.filter((c) => /^Merge pull request #\d+ from /.test(c.subject))
  if (pullRequests.length > 0) {
    const onLine = await getFirstParentLines(repo)
    for (const commit of pullRequests) {
      commit.mergedInto = [...onLine.entries()].filter(([, hashes]) => hashes.has(commit.hash)).map(([name]) => name)
    }
  }
  return { commits: commits.slice(0, take), hasMore: commits.length > take }
}

// The Findings tab needs the subject, author and files of every reviewed commit.
export async function getReviewedCommits(reviews: Review[]): Promise<CommitInfo[]> {
  const all: CommitInfo[] = []
  for (const repo of REPO_KEYS) {
    const byCommit = reviewsByCommit(reviews, repo)
    const hashes = [...byCommit.keys()].filter(isValidHash)
    if (hashes.length === 0 || !(await repoAvailable(repo))) continue
    try {
      const out = await git(repo, [
        "log",
        "--no-walk=unsorted",
        "--ignore-missing",
        "--no-renames",
        "--raw",
        "--numstat",
        `--format=${LOG_FORMAT}`,
        ...hashes,
        "--",
      ])
      all.push(...parseLog(out, repo, byCommit))
    } catch {
      continue
    }
  }
  return all
}

// Commit times (ms, oldest first) of each branch a /committable run was made on, keyed
// "<repo>:<branch>". Committables uses them to tell which runs happened between the same two commits.
export async function getCommitTimes(runs: CommittableRun[]): Promise<Record<string, CommitTime[]>> {
  const times: Record<string, CommitTime[]> = {}
  const wanted = new Set(runs.filter((r) => r.branch).map((r) => `${r.repo}:${r.branch}`))
  for (const key of wanted) {
    const [repo, ...rest] = key.split(":")
    if (!isRepoKey(repo) || !(await repoAvailable(repo))) continue
    try {
      const refs = await resolveRefs(repo, rest.join(":"))
      const out = await git(repo, ["log", "--format=%ct %H", "--max-count=2000", ...refs, "--"])
      times[key] = out
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [t, hash] = line.split(" ")
          return { time: Number(t) * 1000, hash }
        })
        .sort((a, b) => a.time - b.time)
    } catch {
      continue
    }
  }
  return times
}

export async function getGraph(repo: RepoKey, branch: string, remote = true): Promise<GraphData> {
  const [refs, branches] = await Promise.all([resolveRefs(repo, branch, remote), getBranches(repo)])
  const out = await git(repo, [
    "log",
    "--topo-order",
    `--max-count=${MAX_GRAPH + 1}`,
    "--format=%H%x1f%P%x1f%an%x1f%aI%x1f%s",
    ...refs,
    "--",
  ])
  const commits = out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, parents, author, date, subject] = line.split("\x1f")
      return { hash, parents: parents ? parents.split(" ") : [], author, date, subject: subject ?? "" }
    })
  // Every branch is returned so tips that sit inside this history get their own colour too.
  return {
    commits: commits.slice(0, MAX_GRAPH),
    branches,
    truncated: commits.length > MAX_GRAPH,
  }
}

const MAX_PLAYGROUND = 50_000

// Every local branch and every origin branch, read as of the last fetch, as a Git Playground
// flow. Read-only: for-each-ref, symbolic-ref and log, nothing that changes the repo.
export async function getPlaygroundDataset(repo: RepoKey): Promise<PlaygroundDataset> {
  const out = await git(repo, ["for-each-ref", "--format=%(refname)%1f%(objectname)", "refs/heads", "refs/remotes/origin"])
  const refs: FlowRef[] = []
  for (const line of out.split("\n")) {
    const [ref, hash] = line.split("\x1f")
    if (!ref || !hash || ref.endsWith("/HEAD")) continue
    const remote = ref.startsWith("refs/remotes/origin/")
    refs.push({ name: ref.replace(remote ? "refs/remotes/origin/" : "refs/heads/", ""), remote, hash })
  }
  const originHead = await git(repo, ["symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD"])
    .then((s) => s.trim().replace(/^origin\//, ""))
    .catch(() => "")
  const names = new Set(refs.map((r) => r.name))
  const trunk = [originHead, "main", "master"].find((name) => name && names.has(name)) ?? refs[0]?.name ?? "main"

  const log = refs.length
    ? await git(repo, [
        "log",
        "--topo-order",
        `--max-count=${MAX_PLAYGROUND}`,
        "--format=%H%x1f%P%x1f%ct%x1f%an%x1f%s",
        ...refs.map((r) => (r.remote ? `refs/remotes/origin/${r.name}` : `refs/heads/${r.name}`)),
        "--",
      ])
    : ""
  const commits: FlowCommit[] = log
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, parents, time, author, subject] = line.split("\x1f")
      return { hash, parents: parents ? parents.split(" ") : [], time: Number(time), author, subject: subject ?? "" }
    })
  const { label, name } = repoMeta(repo)
  return {
    repo,
    name: `${label} · ${name} branches`,
    ...buildBranchFlow(refs, commits, trunk),
    generatedAt: new Date().toISOString(),
  }
}

const MAX_ACTIVITY = 5000

// Files and lines changed per contributor and day, for the heat map.
export async function getActivity(
  repo: RepoKey,
  branch: string,
  remote = true,
  only?: string[],
): Promise<ActivityData> {
  const refs = await resolveRefs(repo, branch, remote, only)
  const out = await git(repo, [
    "log",
    "--no-renames",
    "--numstat",
    `--max-count=${MAX_ACTIVITY + 1}`,
    "--format=%x1e%an%x1f%aI",
    ...refs,
    "--",
  ])
  const chunks = out.split("\x1e").filter((chunk) => chunk.trim())
  const authors = new Map<string, ActivityAuthor>()

  for (const chunk of chunks.slice(0, MAX_ACTIVITY)) {
    const [head, ...lines] = chunk.split("\n")
    const [name, date] = head.split("\x1f")
    if (!name || !date) continue
    let files = 0
    let insertions = 0
    let deletions = 0
    for (const line of lines) {
      const [added, removed] = line.split("\t")
      if (added === undefined || removed === undefined || !line.includes("\t")) continue
      files += 1
      insertions += Number(added) || 0
      deletions += Number(removed) || 0
    }
    const author = authors.get(name) ?? { name, commits: 0, files: 0, insertions: 0, deletions: 0, days: {} }
    const day = (author.days[date.slice(0, 10)] ??= { commits: 0, files: 0, insertions: 0, deletions: 0 })
    day.commits += 1
    day.files += files
    day.insertions += insertions
    day.deletions += deletions
    author.commits += 1
    author.files += files
    author.insertions += insertions
    author.deletions += deletions
    authors.set(name, author)
  }

  return {
    authors: [...authors.values()].sort((a, b) => b.insertions + b.deletions - (a.insertions + a.deletions)),
    truncated: chunks.length > MAX_ACTIVITY,
  }
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// Files changed per day for one branch, optionally narrowed to contributors and a date range.
export async function getFileActivity(
  repo: RepoKey,
  branch: string,
  authors: string[],
  from: string,
  to: string,
  remote = true,
  only?: string[],
): Promise<FileActivity> {
  const refs = await resolveRefs(repo, branch, remote, only)
  const out = await git(repo, [
    "log",
    "--no-renames",
    "--name-status",
    `--max-count=${MAX_ACTIVITY + 1}`,
    "--format=%x1e%aI",
    ...authors.map((name) => `--author=${authorPattern(name)}`),
    ...refs,
    "--",
  ])
  const chunks = out.split("\x1e").filter((chunk) => chunk.trim())
  const days = new Map<string, FileDay>()

  for (const chunk of chunks.slice(0, MAX_ACTIVITY)) {
    const [head, ...lines] = chunk.split("\n")
    const date = head.trim().slice(0, 10)
    if (!DATE_PATTERN.test(date) || (from && date < from) || (to && date > to)) continue
    const day = days.get(date) ?? { date, commits: 0, files: [] }
    day.commits += 1
    for (const line of lines) {
      const [letter, ...rest] = line.split("\t")
      const file = rest.join("\t")
      if (!file) continue
      const change: FileChange = CHANGE_BY_LETTER[letter] ?? "modified"
      const known = day.files.find((f) => f.path === file)
      if (known) known.commits += 1
      else day.files.push({ path: file, commits: 1, change })
    }
    days.set(date, day)
  }

  const sorted = [...days.values()].sort((a, b) => (a.date < b.date ? 1 : -1))
  for (const day of sorted) day.files.sort((a, b) => b.commits - a.commits || a.path.localeCompare(b.path))
  return { days: sorted, truncated: chunks.length > MAX_ACTIVITY }
}

function splitPatch(patch: string): DiffFile[] {
  const files: DiffFile[] = []
  for (const block of patch.split(/^diff --git /m)) {
    if (!block.trim()) continue
    const header = block.split("\n", 1)[0]
    const match = header.match(/^a\/(.+) b\/(.+)$/)
    if (!match) continue
    const change: FileChange = /^new file mode/m.test(block)
      ? "added"
      : /^deleted file mode/m.test(block)
        ? "deleted"
        : "modified"
    const start = block.search(/^@@ /m)
    const body = start === -1 ? "" : block.slice(start)
    files.push({
      path: match[2],
      change,
      patch: body.slice(0, MAX_PATCH_CHARS),
      truncated: body.length > MAX_PATCH_CHARS,
    })
  }
  return files
}

export async function getCommitDiff(repo: RepoKey, hash: string): Promise<DiffFile[]> {
  // -m --first-parent shows merge commits against their first parent instead of nothing.
  const out = await git(repo, [
    "show",
    "--no-renames",
    "-m",
    "--first-parent",
    "--format=",
    "-U3",
    hash,
    "--",
  ])
  return splitPatch(out)
}

/* ------------------------------------------------------------- findings */

const REVIEW_ID_PATTERN = /^(frontend|backend)\/(howismycommit-\d+)$/

// fileName is `<repo>/<review id>`, as getReviews() hands it out.
export async function setFindingResolved(fileName: string, findingId: string, resolved: boolean) {
  const match = fileName.match(REVIEW_ID_PATTERN)
  if (!match) throw new Error("Invalid review")
  const [, repo, reviewId] = match

  await store.updateItems(repo, "howismycommit", (items: any[]) => {
    const review = items.find((item) => item?.id === reviewId)
    if (!review) throw new Error("Review not found")
    const finding = asArray(review.findings).find((f) => f?.id === findingId)
    if (!finding) throw new Error("Finding not found")
    applyResolved(finding, resolved)
    return items
  })
}

export async function setFindingFuture(fileName: string, findingId: string, future: boolean) {
  const match = fileName.match(REVIEW_ID_PATTERN)
  if (!match) throw new Error("Invalid review")
  const [, repo, reviewId] = match

  await store.updateItems(repo, "howismycommit", (items: any[]) => {
    const review = items.find((item) => item?.id === reviewId)
    if (!review) throw new Error("Review not found")
    const finding = asArray(review.findings).find((f) => f?.id === findingId)
    if (!finding) throw new Error("Finding not found")
    finding.future = future
    delete finding.optional
    return items
  })
}

export async function confirmFinding(fileName: string, findingId: string, note: string) {
  const match = fileName.match(REVIEW_ID_PATTERN)
  if (!match) throw new Error("Invalid review")
  const [, repo, reviewId] = match

  await store.updateItems(repo, "howismycommit", (items: any[]) => {
    const review = items.find((item) => item?.id === reviewId)
    if (!review) throw new Error("Review not found")
    const finding = asArray(review.findings).find((f) => f?.id === findingId)
    if (!finding) throw new Error("Finding not found")
    if (finding.status !== "resolved") applyResolved(finding, true)
    finding.needsAttention = false
    finding.attentionNote = null
    finding.confirmed = true
    finding.confirmedNote = note.trim().slice(0, 300) || "Confirmed manually"
    return items
  })
}

function applyResolved(finding: any, resolved: boolean) {
  if (resolved) {
    finding.status = "resolved"
    finding.resolvedAt = new Date().toISOString()
    finding.resolvedNote = "Marked resolved manually"
  } else {
    finding.status = "open"
    finding.resolvedIn = null
    finding.resolvedAt = null
    finding.resolvedNote = null
  }
}

/* --------------------------------------------------------- explanations */

// Answers from both repos are shown as one list.
export const getExplainRuns = () =>
  readRepoRuns<ExplainRun>("explainme", (raw, fileName, repo) => ({
    fileName,
    repo,
    author: asString(raw?.author),
    generatedAt: asString(raw?.generatedAt),
    question: asString(raw?.question),
    problem: asString(raw?.problem),
    sourceFiles: asStrings(raw?.sourceFiles),
    reason: asString(raw?.reason),
    solution: asString(raw?.solution),
    approach: asStrings(raw?.approach),
    advice: asString(raw?.advice),
  }))

/* ----------------------------------------------------------- git guides */

// Guides from both repos are shown as one list.
export const getGitGuideRuns = () =>
  readRepoRuns<GitGuideRun>("talktomegit", (raw, fileName, repo) => ({
    fileName,
    repo,
    author: asString(raw?.author),
    generatedAt: asString(raw?.generatedAt),
    question: asString(raw?.question),
    goal: asString(raw?.goal),
    approach: asString(raw?.approach),
    steps: asArray(raw?.steps).map((s) => ({
      title: asString(s?.title),
      explain: asString(s?.explain),
      commands: asStrings(s?.commands),
      expect: asString(s?.expect),
      ifWrong: asString(s?.ifWrong),
    })),
    questions: asArray(raw?.questions).map((q) => ({
      question: asString(q?.question),
      options: asStrings(q?.options),
    })),
  }))

/* ----------------------------------------------------------- db backups */

// The backend's `db` script records every backup and restore here. The backup folder itself is
// read live, so a file that was overwritten or deleted shows as such.
function dbBackupDir() {
  const config = JSON.parse(readFileSync(path.join(ROOT, "penguin.config.json"), "utf8"))
  const dir = String(config?.repos?.backend?.dbBackupDir ?? "~/Desktop/Work/db-backups")
  return path.resolve(/*turbopackIgnore: true*/ dir.replace(/^~(?=$|\/)/, os.homedir()))
}

async function readDbBackupFiles(dir: string): Promise<DbBackupFile[]> {
  let names: string[] = []
  try {
    names = await fs.readdir(dir)
  } catch {
    return []
  }
  const files: DbBackupFile[] = []
  for (const name of names.filter((n) => n.endsWith(".dump"))) {
    const filePath = path.join(dir, name)
    try {
      const stat = await fs.stat(filePath)
      files.push({
        name: name.slice(0, -5),
        path: filePath,
        sizeBytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
      })
    } catch {
      continue
    }
  }
  return files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
}

function fileStatus(file: string, writtenAt: string, files: DbBackupFile[]): DbBackupFileStatus {
  const onDisk = files.find((f) => f.path === file)
  if (!onDisk) return "deleted"
  const drift = Math.abs(new Date(onDisk.modifiedAt).getTime() - new Date(writtenAt).getTime())
  return drift < 2000 ? "current" : "replaced"
}

export async function getDbBackups(): Promise<DbBackupData> {
  const dir = dbBackupDir()
  const files = await readDbBackupFiles(dir)
  const runs = await readRepoRuns<DbBackupRun>("dbbackups", (raw, fileName, repo) => {
    const file = asString(raw?.file)
    const fileModifiedAt = asString(raw?.fileModifiedAt)
    return {
      fileName,
      repo,
      author: asString(raw?.author),
      generatedAt: asString(raw?.generatedAt),
      action: pick(raw?.action, ["backup", "restore"] as const, "backup"),
      database: asString(raw?.database),
      file,
      backupName: asString(raw?.backupName),
      sizeBytes: asNumber(raw?.sizeBytes),
      tables: typeof raw?.tables === "number" ? raw.tables : null,
      migrations: typeof raw?.migrations === "number" ? raw.migrations : null,
      fileModifiedAt,
      fileStatus: fileStatus(file, fileModifiedAt, files),
    }
  })
  return { dir, runs, files }
}

/* ---------------------------------------------------------- committable */

export const getCommittableRuns = () =>
  readRepoRuns<CommittableRun>("committable", (raw, fileName, repo) => {
    const files = raw?.files ?? {}
    return {
      fileName,
      repo,
      author: asString(raw?.author),
      generatedAt: asString(raw?.generatedAt),
      branch: asString(raw?.branch),
      verdict: pick(raw?.verdict, ["committable", "needs-attention"] as const, "needs-attention"),
      files: {
        total: asNumber(files.total),
        staged: asNumber(files.staged),
        unstaged: asNumber(files.unstaged),
        untracked: asNumber(files.untracked),
      },
      attention: asArray(raw?.attention).map((a) => ({
        path: asString(a?.path),
        line: typeof a?.line === "number" ? a.line : null,
        priority: pick(a?.priority, ["high", "medium", "low"] as const, "low"),
        issue: asString(a?.issue),
        fix: asString(a?.fix),
      })),
      safeFiles: asStrings(raw?.safeFiles),
      checks: asArray(raw?.checks).map((c) => ({
        status: pick(c?.status, ["green", "red", "grey"] as const, "grey"),
        command: asString(c?.command),
        result: asString(c?.result),
      })),
    }
  })

/* ---------------------------------------------------------------- docs */

const MAX_DOC_BYTES = 2_000_000
const ROOT_GROUP = "general"

const GROUP_LABELS: Record<string, string> = { "reports-u": "Reports-U", [ROOT_GROUP]: "General" }

const ACRONYMS = new Set(["ucrf", "crm", "api", "apis", "mclr", "kyc"])

const titleCase = (value: string) =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) =>
      ACRONYMS.has(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ")

const docsDir = (repo: RepoKey) => path.join(REPOS[repo].dir, "docs")

async function walkDocs(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walkDocs(full)))
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full)
  }
  return files
}

async function getRepoDocGroups(repo: RepoKey): Promise<DocGroup[]> {
  const root = docsDir(repo)
  let files: string[] = []
  try {
    files = await walkDocs(root)
  } catch {
    return []
  }

  const byGroup = new Map<string, DocFile[]>()
  for (const full of files.sort()) {
    const relative = path.relative(root, full).split(path.sep)
    const group = relative.length > 1 ? relative[0] : ROOT_GROUP
    const folder = relative.length > 2 ? relative.slice(1, -1).join("/") : ""
    const fileName = relative[relative.length - 1]
    byGroup.set(group, [
      ...(byGroup.get(group) ?? []),
      { path: `${repo}/${relative.join("/")}`, repo, title: fileName, folder },
    ])
  }

  return [...byGroup.entries()]
    .map(([key, groupFiles]) => ({
      key: `${repo}/${key}`,
      repo,
      label: GROUP_LABELS[key] ?? titleCase(key),
      files: groupFiles,
    }))
    .sort((a, b) =>
      a.key.endsWith(`/${ROOT_GROUP}`) ? -1 : b.key.endsWith(`/${ROOT_GROUP}`) ? 1 : a.key.localeCompare(b.key),
    )
}

export async function getDocGroups(): Promise<DocGroup[]> {
  const groups = await Promise.all(REPO_KEYS.map(getRepoDocGroups))
  return groups.flat()
}

export async function getDocContent(docPath: string): Promise<string> {
  const [repo, ...rest] = docPath.split("/")
  if (!isRepoKey(repo) || rest.length === 0) throw new Error("Invalid document path")

  const root = docsDir(repo)
  const normalized = path.normalize(rest.join("/"))
  const full = path.join(root, normalized)
  const insideDocs = full.startsWith(root + path.sep)
  if (!insideDocs || !normalized.endsWith(".md") || normalized.split(path.sep).includes("..")) {
    throw new Error("Invalid document path")
  }

  const stat = await fs.stat(full)
  if (!stat.isFile() || stat.size > MAX_DOC_BYTES) throw new Error("Document cannot be read")
  return fs.readFile(full, "utf8")
}

/* ----------------------------------------------------------- questions */

const QUESTION_KINDS: readonly QuestionKind[] = ["frontend", "backend"]
const MAX_QUESTION = 2_000
const MAX_ANSWER = 20_000

export function isQuestionKind(value: unknown): value is QuestionKind {
  return QUESTION_KINDS.includes(value as QuestionKind)
}

const QUESTION_PRIORITIES: readonly QuestionPriority[] = ["P0", "P1", "P2", "P3"]

const asQuestionPriority = (value: unknown): QuestionPriority | null =>
  QUESTION_PRIORITIES.includes(value as QuestionPriority) ? (value as QuestionPriority) : null

// Questions for each repo live in .penguin/data/<repo>/questions.json.
async function writeQuestions(kind: QuestionKind, items: QuestionItem[]) {
  await store.writeItems(kind, "questions", items)
}

export async function getQuestions(kind: QuestionKind): Promise<QuestionItem[]> {
  try {
    const raw = await store.readItems(kind, "questions")
    return asArray(raw).map((q) => ({
      id: asString(q?.id),
      code: typeof q?.code === "string" ? q.code : null,
      priority:
        asQuestionPriority(q?.priority) ??
        asQuestionPriority(typeof q?.code === "string" ? q.code.slice(0, 2) : null),
      category: asString(q?.category),
      question: asString(q?.question),
      answer: asString(q?.answer),
      answered: q?.answered === true,
      createdAt: asString(q?.createdAt),
      updatedAt: asString(q?.updatedAt),
    }))
  } catch {
    return []
  }
}

export async function addQuestion(
  kind: QuestionKind,
  question: string,
  category = "",
  priority: unknown = null,
) {
  const text = question.trim()
  if (!text) throw new Error("Question cannot be empty")
  if (text.length > MAX_QUESTION) throw new Error("Question is too long")

  const items = await getQuestions(kind)
  const now = new Date().toISOString()
  items.unshift({
    id: `q-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    code: null,
    priority: asQuestionPriority(priority),
    category: category.trim().slice(0, 100),
    question: text,
    answer: "",
    answered: false,
    createdAt: now,
    updatedAt: now,
  })
  await writeQuestions(kind, items)
}

export async function updateQuestion(
  kind: QuestionKind,
  id: string,
  patch: { question?: unknown; answer?: unknown; answered?: unknown; priority?: unknown },
) {
  const items = await getQuestions(kind)
  const item = items.find((q) => q.id === id)
  if (!item) throw new Error("Question not found")

  if (typeof patch.question === "string") {
    const text = patch.question.trim()
    if (!text) throw new Error("Question cannot be empty")
    if (text.length > MAX_QUESTION) throw new Error("Question is too long")
    item.question = text
  }
  if (typeof patch.answer === "string") {
    if (patch.answer.length > MAX_ANSWER) throw new Error("Answer is too long")
    item.answer = patch.answer
  }
  if (typeof patch.answered === "boolean") item.answered = patch.answered
  if (patch.priority !== undefined) {
    const priority = asQuestionPriority(patch.priority)
    if (!priority) throw new Error("Invalid priority")
    item.priority = priority
  }
  item.updatedAt = new Date().toISOString()
  await writeQuestions(kind, items)
}

export async function deleteQuestion(kind: QuestionKind, id: string) {
  const items = await getQuestions(kind)
  const next = items.filter((q) => q.id !== id)
  if (next.length === items.length) throw new Error("Question not found")
  await writeQuestions(kind, next)
}

/* ----------------------------------------------------------- todos */

// Todos live in .penguin/data/todos.json, newest first.
const TODOS_FILE = path.join(ROOT, ".penguin", "data", "todos.json")
const TODO_STATUSES: TodoStatus[] = ["todo", "done", "future"]

export function isTodoStatus(value: unknown): value is TodoStatus {
  return TODO_STATUSES.includes(value as TodoStatus)
}

export async function getTodos(): Promise<TodoItem[]> {
  try {
    return asArray(JSON.parse(await fs.readFile(TODOS_FILE, "utf8")))
  } catch {
    return []
  }
}

async function writeTodos(items: TodoItem[]) {
  await fs.mkdir(path.dirname(TODOS_FILE), { recursive: true })
  await fs.writeFile(TODOS_FILE, JSON.stringify(items, null, 2) + "\n")
}

export async function addTodo(text: string, status: TodoStatus) {
  const clean = text.trim().slice(0, 500)
  if (!clean) throw new Error("Write the todo first")
  const items = await getTodos()
  const next = items.reduce((max, item) => Math.max(max, Number(item.id.replace("todo-", "")) || 0), 0) + 1
  const doneAt = status === "done" ? new Date().toISOString() : null
  await writeTodos([{ id: `todo-${next}`, text: clean, status, createdAt: new Date().toISOString(), doneAt }, ...items])
}

export async function updateTodo(id: string, patch: { status?: unknown; text?: unknown }) {
  const items = await getTodos()
  const item = items.find((t) => t.id === id)
  if (!item) throw new Error("Todo not found")
  if (isTodoStatus(patch.status) && patch.status !== item.status) {
    item.status = patch.status
    item.doneAt = patch.status === "done" ? new Date().toISOString() : null
  }
  if (typeof patch.text === "string" && patch.text.trim()) item.text = patch.text.trim().slice(0, 500)
  await writeTodos(items)
}

export async function deleteTodo(id: string) {
  await writeTodos((await getTodos()).filter((t) => t.id !== id))
}


// Test evidence lives in testing/test-evidence/{screenshots,responses,data}.
const TESTING_DIR = path.join(ROOT, "testing", "test-evidence")
export const TESTING_FOLDERS = ["screenshots", "responses", "data"] as const
export type TestingFolder = (typeof TESTING_FOLDERS)[number]

export async function getTestingFiles() {
  const out: Record<TestingFolder, { name: string; size: number }[]> = { screenshots: [], responses: [], data: [] }
  for (const folder of TESTING_FOLDERS) {
    const names = await fs.readdir(path.join(TESTING_DIR, folder)).catch(() => [] as string[])
    for (const name of names.sort()) {
      const stat = await fs.stat(path.join(TESTING_DIR, folder, name)).catch(() => null)
      if (stat?.isFile()) out[folder].push({ name, size: stat.size })
    }
  }
  return out
}

export function testingFilePath(folder: string, name: string) {
  if (!(TESTING_FOLDERS as readonly string[]).includes(folder)) return null
  if (!name || name !== path.basename(name)) return null
  return path.join(TESTING_DIR, folder, name)
}

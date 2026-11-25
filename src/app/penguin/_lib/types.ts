export type Status = "red" | "amber" | "green"
export type Severity = "P0" | "P1" | "P2" | "P3"
export type Quality = "excellent" | "good" | "fair" | "poor"
export type Verdict = "request-changes" | "review-with-caution" | "looks-good"
export type FileChange = "added" | "modified" | "deleted"
export type RepoKey = "frontend" | "backend"

export interface RepoMeta {
  key: RepoKey
  label: string
  name: string
}

export interface BranchInfo {
  name: string
  remote: boolean
  hash: string
  date: string
  subject: string
  current: boolean
}

export interface RepoInfo extends RepoMeta {
  available: boolean
  error: string | null
  currentBranch: string | null
  /** git's user.name for the repo: the author picked by default. */
  currentUser: string | null
  branches: BranchInfo[]
}

export interface GraphCommit {
  hash: string
  parents: string[]
  author: string
  date: string
  subject: string
}

export interface GraphData {
  commits: GraphCommit[]
  branches: BranchInfo[]
  truncated: boolean
}

export interface CommitPage {
  commits: CommitInfo[]
  hasMore: boolean
}

export interface ReviewFinding {
  id: string
  severity: Severity
  title: string
  location: string
  problem: string
  impact: string
  fix: string
  evidence: string
  status: "open" | "resolved"
  resolvedIn: string | null
  resolvedAt: string | null
  resolvedNote: string | null
  needsAttention: boolean
  attentionNote: string | null
  /** The user confirmed the finding by hand, so later reviews stop flagging it. */
  confirmed: boolean
  confirmedNote: string | null
  /** Marked by hand as not needing a fix: later reviews and summaries leave it out. */
  future: boolean
}

export interface CommitTime {
  time: number
  hash: string
}

export interface NextTabsProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  tabs: {
    delay?: number
    disabled?: boolean
    label: string | React.ReactNode
    labelBadge?: React.ReactNode
    value: string
    component: React.ReactNode | React.LazyExoticComponent<(props: any) => React.JSX.Element>
  }[]
  persistKey?: string
  shouldPersist?: boolean
  tabsClassNames?: {
    base?: string
    tabList?: string
    cursor?: string
    tab?: string
    tabContent?: string
    panel?: string
    extra?: string
  }
  delayTabs?: boolean
  extra?: React.ReactNode
}

export interface ReviewFileRow {
  path: string
  change: FileChange
  status: Status
  note: string
}

export interface ReviewCheck {
  status: "green" | "red" | "grey"
  command: string
  result: string
}

export interface Review {
  /** `<repo>/<entry id>`, unique across both repos. */
  fileName: string
  /** Entry id, e.g. `howismycommit-2`. */
  id: string
  repo: RepoKey
  generatedAt: string
  branch: string
  /** `title` names a card that has no commit (shown instead of "Uncommitted changes"). */
  target: { kind: string; commit: string | null; title: string | null }
  /** Names (no extension) of the test screenshots that belong to this run. */
  screenshots: string[]
  /** Names (no extension) of the response and run-data files of this run. */
  responses: string[]
  data: string[]
  files: {
    changed: number
    added: number
    modified: number
    deleted: number
    insertions: number
    deletions: number
  }
  changeType: string[]
  verdict: Verdict
  score: number
  /** Score of the commit as committed; null when the review is not of a commit. */
  commitScore: number | null
  quality: Quality
  summary: { red: number; amber: number; green: number; info: number }
  before: string
  after: string
  effects: string[]
  filesReviewed: ReviewFileRow[]
  findings: ReviewFinding[]
  checks: ReviewCheck[]
  gaps: string[]
  info: string[]
}

export interface CommitFile {
  path: string
  change: FileChange
  insertions: number
  deletions: number
}

export interface CommitInfo {
  repo: RepoKey
  hash: string
  shortHash: string
  subject: string
  body: string
  author: string
  date: string
  insertions: number
  deletions: number
  files: CommitFile[]
  review: Review | null
  /** Every review of this commit, newest first. */
  history: ReviewRunSummary[]
  /** Branches that contain this commit, local and remote merged. Set on the commit history pages. */
  branches?: string[]
  /** Pull request merges only: the branches that have this merge on their first-parent line. */
  mergedInto?: string[]
}

export interface ReviewRunSummary {
  id: string
  generatedAt: string
  verdict: Verdict
  score: number
  open: number
  resolved: number
  attention: number
}

export interface CommitsData {
  branch: string
  base: string | null
  commits: CommitInfo[]
}

export interface DiffFile {
  path: string
  change: FileChange
  patch: string
  truncated: boolean
}

export interface CommittableItem {
  path: string
  line: number | null
  priority: "high" | "medium" | "low"
  issue: string
  fix: string
}

export interface CommittableCheck {
  status: "green" | "red" | "grey"
  command: string
  result: string
}

export interface CommittableRun {
  fileName: string
  repo: RepoKey
  /** git user.name of whoever ran the skill. */
  author: string
  generatedAt: string
  branch: string
  verdict: "committable" | "needs-attention"
  files: { total: number; staged: number; unstaged: number; untracked: number }
  attention: CommittableItem[]
  safeFiles: string[]
  checks: CommittableCheck[]
}

export interface DocFile {
  /** `<repo>/<path inside docs>`, unique across both repos. */
  path: string
  repo: RepoKey
  title: string
  folder: string
}

export interface DocGroup {
  key: string
  repo: RepoKey
  label: string
  files: DocFile[]
}

export type QuestionKind = "frontend" | "backend"

export type QuestionPriority = "P0" | "P1" | "P2" | "P3"

export interface QuestionItem {
  id: string
  code: string | null
  priority: QuestionPriority | null
  category: string
  question: string
  answer: string
  answered: boolean
  createdAt: string
  updatedAt: string
}

export interface ExplainRun {
  /** `<repo>/<entry id>`. Named fileName so RunTimeline can key on it. */
  fileName: string
  repo: RepoKey
  /** git user.name of whoever ran the skill. */
  author: string
  generatedAt: string
  question: string
  problem: string
  sourceFiles: string[]
  reason: string
  solution: string
  approach: string[]
  advice: string
}

export interface GitGuideStep {
  title: string
  explain: string
  commands: string[]
  expect: string
  ifWrong: string
}

export interface GitGuideQuestion {
  question: string
  options: string[]
}

export interface GitGuideRun {
  /** `<repo>/<entry id>`. Named fileName so RunTimeline can key on it. */
  fileName: string
  repo: RepoKey
  /** git user.name of whoever ran the skill. */
  author: string
  generatedAt: string
  question: string
  goal: string
  approach: string
  steps: GitGuideStep[]
  questions: GitGuideQuestion[]
}

export interface ActivityDay {
  commits: number
  files: number
  insertions: number
  deletions: number
}

export interface ActivityAuthor {
  name: string
  commits: number
  files: number
  insertions: number
  deletions: number
  /** Keyed by `YYYY-MM-DD`, the author's own date. */
  days: Record<string, ActivityDay>
}

export interface ActivityData {
  /** Most active first. */
  authors: ActivityAuthor[]
  truncated: boolean
}

export type PlaygroundKind = "branch" | "commit" | "merge" | "push" | "remote"

export interface PlaygroundNode {
  id: string
  kind: PlaygroundKind
  label: string
  x: number
  y: number
  /** Happened on origin only: this clone has it as a remote-tracking ref, not as a local branch. */
  origin?: boolean
  /** How many real commits the node stands for. */
  count?: number
  /** Short hash of the newest real commit in the node. */
  hash?: string
  /** Newest commit date, ISO. */
  date?: string
  /** One line about the real commits: authors, dates, subject. */
  detail?: string
}

export interface PlaygroundEdge {
  id: string
  from: string
  to: string
}

export interface PlaygroundDataset {
  repo: RepoKey
  name: string
  nodes: PlaygroundNode[]
  edges: PlaygroundEdge[]
  generatedAt: string
}

export interface Contributor {
  name: string
  commits: number
  /** Newest commit, ISO. */
  lastDate: string
}

export type TodoStatus = "todo" | "done" | "future"

export interface TodoItem {
  id: string
  text: string
  status: TodoStatus
  createdAt: string
  doneAt: string | null
}

export interface FileDay {
  /** `YYYY-MM-DD`, the author's own date. */
  date: string
  commits: number
  /** Distinct files touched that day, most changed first. */
  files: { path: string; commits: number; change: FileChange }[]
}

export interface FileActivity {
  /** Newest day first. */
  days: FileDay[]
  truncated: boolean
}

export type DbBackupAction = "backup" | "restore"

/** "current": the backup file on disk is this exact backup. "replaced": a newer backup
 * overwrote it. "deleted": the file is gone. Restores keep the status of the backup they used. */
export type DbBackupFileStatus = "current" | "replaced" | "deleted"

export interface DbBackupRun {
  /** `<repo>/<entry id>`. Named fileName so RunTimeline can key on it. */
  fileName: string
  repo: RepoKey
  author: string
  generatedAt: string
  action: DbBackupAction
  /** The local database that was backed up or replaced. */
  database: string
  /** The backup file that was written (backup) or loaded (restore). */
  file: string
  /** Name of the backup that was loaded, restores only. */
  backupName: string
  sizeBytes: number
  tables: number | null
  migrations: number | null
  /** When the backup file was written. */
  fileModifiedAt: string
  fileStatus: DbBackupFileStatus
}

export interface DbBackupFile {
  name: string
  path: string
  sizeBytes: number
  modifiedAt: string
}

export interface DbBackupData {
  dir: string
  runs: DbBackupRun[]
  files: DbBackupFile[]
}

"use client"

import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { dayLabel } from "../_lib/day-label"
import { TimeLabel } from "./time-label"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import type { CommitFile, CommitInfo, DiffFile, RepoKey, Review, ReviewRunSummary } from "../_lib/types"
import { DiffView } from "./diff-view"
import { ChangeBadge, ScoreBadge, VERDICT_LABEL, scoreStatus, STATUS_SURFACE } from "./status"
import {
  countByPriority,
  countAttention,
  countFuture,
  countResolved,
  PriorityCounts,
  sortFindings,
  timelineDot,
  FindingsTable,
} from "./findings"
import { Collapse } from "./collapse"
import { CopyPath } from "./copy-path"
import { Highlight } from "./highlight"
import { AuthorTag } from "./author-tag"
import { HashButton } from "./hash-button"
import { colorForBranch } from "../_lib/graph-layout"
import { ArrowRightIcon, BadgeAlertIcon, ChevronRightIcon, GitBranchIcon, GitMergeIcon } from "lucide-react"

async function fetchDiff(repo: RepoKey, hash: string): Promise<DiffFile[]> {
  const res = await fetch(`/penguin/api/diff?repo=${repo}&hash=${hash}`)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.message ?? "Could not load the diff")
  return body.files as DiffFile[]
}

function CommitDiff({ repo, hash, stats }: { repo: RepoKey; hash: string; stats: CommitFile[] }) {
  const query = useQuery({
    queryKey: ["penguin", "diff", repo, hash],
    queryFn: () => fetchDiff(repo, hash),
  })
  const [openFile, setOpenFile] = useState<string | null>(null)

  if (query.isLoading) return <LoadingIndicatorView className="min-h-24" />
  if (query.isError) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
        <span>{query.error.message}</span>
        <Button size="sm" variant="outline" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  const files = query.data ?? []
  if (files.length === 0) return <p className="text-sm text-muted-foreground">No file changes.</p>

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const open = openFile === file.path
        const stat = stats.find((s) => s.path === file.path)
        return (
          <div key={file.path} className="overflow-hidden rounded-xl border">
            <button
              type="button"
              aria-expanded={open}
              className={cn(
                open && "border-b",
                "flex w-full items-center gap-2 bg-card px-3 py-2 text-left hover:bg-accent/30",
              )}
              onClick={() => setOpenFile(open ? null : file.path)}>
              <ChevronRightIcon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-300",
                  open && "rotate-90",
                )}
              />
              <span className="min-w-0 flex-1">
                <CopyPath path={file.path}>
                  <Highlight text={file.path} />
                </CopyPath>
              </span>
              <ChangeBadge change={file.change} />
              <span className="flex shrink-0 gap-2 text-xs">
                <span className="text-success">+{stat?.insertions ?? 0}</span>
                <span className="text-destructive">-{stat?.deletions ?? 0}</span>
              </span>
            </button>
            <Collapse open={open}>
              <div className="py-2 pr-2">
                <DiffView patch={file.patch} truncated={file.truncated} />
              </div>
            </Collapse>
          </div>
        )
      })}
    </div>
  )
}

function ReviewHistory({ history }: { history: ReviewRunSummary[] }) {
  if (history.length < 2) return null

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Review history ({history.length})</p>
      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-xs">
          <thead className="bg-accent/30 text-left text-muted-foreground">
            <tr>
              <th className="p-2">Run</th>
              <th className="p-2">When</th>
              <th className="p-2">Verdict</th>
              <th className="p-2">Score</th>
              <th className="p-2">Open</th>
              <th className="p-2">Resolved</th>
              <th className="p-2">Attention</th>
            </tr>
          </thead>
          <tbody>
            {history.map((run, i) => {
              const older = history[i + 1]
              const delta = older ? run.score - older.score : null
              return (
                <tr key={run.id} className="border-t">
                  <td className="p-2 font-medium">{run.id}</td>
                  <td className="p-2"><TimeLabel iso={run.generatedAt} /></td>
                  <td className="p-2">{VERDICT_LABEL[run.verdict]}</td>
                  <td className="p-2">
                    {run.score}
                    {delta !== null && delta !== 0 && (
                      <span className={delta > 0 ? "ml-1 text-green-600" : "ml-1 text-red-600"}>
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}
                  </td>
                  <td className="p-2">{run.open}</td>
                  <td className="p-2">{run.resolved}</td>
                  <td className="p-2">{run.attention}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CommitReview({ review, history }: { review: Review; history: ReviewRunSummary[] }) {
  const findings = sortFindings(review.findings)

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-wrap items-center gap-4 rounded-xl p-3",
          STATUS_SURFACE[scoreStatus(review.score)],
        )}>
        <ScoreBadge score={review.score} quality={review.quality} verdict={review.verdict} size="lg" />
        <div className="text-sm">
          <p className="font-semibold">{VERDICT_LABEL[review.verdict]}</p>
          {review.commitScore !== null && review.commitScore !== review.score && (
            <p className="text-xs text-black">As committed: {review.commitScore}</p>
          )}
          <p className="text-xs text-black">
            Latest review {review.id}, scored on the code as it is now.
          </p>
        </div>
      </div>
      <ReviewHistory history={history} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-dashed border-amber-600/50 p-2.5">
          <p className="pb-2 text-xs font-semibold uppercase text-amber-500">Existing</p>
          <p className="text-sm">{review.before || "-"}</p>
        </div>
        <div className="border border-dashed border-blue-600/50 p-2.5">
          <p className="pb-2 text-xs font-semibold uppercase text-blue-500">New</p>
          <p className="text-sm">{review.after || "-"}</p>
        </div>
      </div>
      {review.effects.length > 0 && (
        <div className="border border-dashed border-purple-600/50 p-2.5">
          <p className="pb-2 text-xs font-semibold uppercase text-purple-600">Effects</p>
          <ul className="list-disc space-y-0.5 pl-5 text-sm">
            {review.effects.map((effect, i) => (
              <li key={i}>{effect}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">
            Findings ({findings.length - countResolved(findings)})
          </p>
          <PriorityCounts
            counts={countByPriority(findings)}
            resolved={countResolved(findings)}
            future={countFuture(findings)}
            attention={countAttention(findings)}
          />
        </div>
        {findings.length === 0 ? (
          <p className="rounded-lg border p-3 text-sm text-muted-foreground">Nothing to apply.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <FindingsTable findings={findings} reviewFile={review.fileName} />
          </div>
        )}
      </div>
    </div>
  )
}

const BRANCHES_SHOWN = 3


// Every branch chip is tinted, local or remote. No solid fills.
const branchChipStyle = (name: string) => {
  const color = colorForBranch(name)
  return { color, background: `${color}1f` }
}

function BranchTags({ branches }: { branches?: string[] }) {
  if (!branches || branches.length === 0) return null
  const shown = branches.slice(0, BRANCHES_SHOWN)
  const rest = branches.length - shown.length
  return (
    <span className="flex min-w-0 max-w-[28rem] items-center gap-1" title={branches.join(", ")}>
      {shown.map((name) => (
        <code
          key={name}
          style={branchChipStyle(name)}
          className="flex min-w-0 max-w-40 shrink items-center gap-1 rounded-sm px-1 py-0.5 font-mono text-xs">
          <GitBranchIcon className="size-3 shrink-0" />
          <span className="truncate">{name}</span>
        </code>
      ))}
      {rest > 0 && <span className="shrink-0 text-xs text-muted-foreground">+{rest}</span>}
    </span>
  )
}

function parseMerge(subject: string): { from: string; into: string | null; pr: string | null; remote: boolean } {
  const pr = subject.match(/^Merge pull request (#\d+) from \S+?\/(\S+)/)
  if (pr) return { from: pr[2], into: null, pr: pr[1], remote: true }
  const m = subject.match(/^Merge (?:remote-tracking )?(?:branch|branches|tag) (.+?)(?: into (\S+))?$/)
  const from = (m?.[1] ?? subject.replace(/^Merge\s+/, "")).replace(/['"]/g, "").replace(/^origin\//, "")
  return { from, into: m?.[2] ?? null, pr: null, remote: /^Merge remote-tracking/.test(subject) }
}

function MergeChip({ name }: { name: string }) {
  return (
    <code
      title={name}
      style={branchChipStyle(name)}
      className="flex min-w-0 max-w-48 items-center gap-1 rounded-sm px-1 py-0.5 font-mono text-xs">
      <GitBranchIcon className="size-3 shrink-0" />
      <span className="truncate">{name}</span>
    </code>
  )
}

// Several branches can carry the same merge (dev, and the feature branches that later took dev in).
// Prefer the trunk-like one: main, then dev, then the first.
const pickTarget = (names?: string[]) =>
  names && names.length > 0 ? (["main", "master", "dev", "develop"].find((n) => names.includes(n)) ?? names[0]) : null

function MergeFlow({ subject, author, mergedInto }: { subject: string; author: string; mergedInto?: string[] }) {
  const { from, pr } = parseMerge(subject)
  const into = parseMerge(subject).into ?? pickTarget(mergedInto)
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <AuthorTag name={author} />
      <span className="!h-4 !w-px bg-black/25" />
      {pr && <span className="shrink-0 font-mono">{pr}</span>}
      <MergeChip name={from} />
      <ArrowRightIcon className="size-3.5 shrink-0" />
      {into ? <MergeChip name={into} /> : <span className="shrink-0">default branch</span>}
    </span>
  )
}

function CommitCard({
  commit,
  open,
  onToggle,
}: {
  commit: CommitInfo
  open: boolean
  onToggle: () => void
}) {
  if (/^Merge\b/.test(commit.subject)) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1 pl-3 text-xs text-muted-foreground">
        <GitMergeIcon className="size-4 shrink-0" />
        <TimeLabel iso={commit.date} />
        <MergeFlow subject={commit.subject} author={commit.author} mergedInto={commit.mergedInto} />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 pl-3 text-left hover:bg-accent/30"
        onClick={onToggle}>
        <ChevronRightIcon
          className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")}
        />
        <code className="shrink-0 text-xs font-medium">
          <TimeLabel iso={commit.date} />
        </code>
        <HashButton hash={commit.hash} />
        <BranchTags branches={commit.branches} />
        <AuthorTag name={commit.author} />
        <code className="min-w-72 flex-1 truncate text-xs">
          <Highlight text={commit.subject} />
        </code>
        <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <span>{commit.files.length} files</span>
          <span className="bg-green-600/10 text-green-600 px-1 py-0.5 rounded-sm text-success">+{commit.insertions}</span>
          <span className="bg-red-600/10 text-red-600 px-1 py-0.5 rounded-sm text-destructive">-{commit.deletions}</span>
        </span>
        {commit.review ? (
          <span className="flex shrink-0 items-center gap-2">
            <ScoreBadge score={commit.review.score} quality={commit.review.quality} verdict={commit.review.verdict} />
          </span>
        ) : (
          <BadgeAlertIcon className="size-6 text-white fill-amber-500" />
        )}
      </button>

      <Collapse open={open}>
        <div className="space-y-4 border-t p-4">
          {commit.body && (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{commit.body}</p>
          )}

          {commit.review ? (
            <CommitReview review={commit.review} history={commit.history} />
          ) : (
            <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              No review for this commit. Run{" "}
              <code className="rounded bg-accent px-1.5 py-0.5">
                /howismycommit {commit.shortHash}
              </code>{" "}
              to get severity, effects, quality and a score.
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-semibold">Files ({commit.files.length})</p>
            <CommitDiff repo={commit.repo} hash={commit.hash} stats={commit.files} />
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export function CommitTimeline({
  commits,
  openHash,
  onToggle,
}: {
  commits: CommitInfo[]
  openHash: string | null
  onToggle: (hash: string) => void
}) {
  const groups = useMemo(() => {
    const byDay = new Map<string, CommitInfo[]>()
    for (const commit of commits) {
      const day = dayLabel(commit.date)
      byDay.set(day, [...(byDay.get(day) ?? []), commit])
    }
    return [...byDay.entries()].map(([day, items]) => ({ day, commits: items }))
  }, [commits])

  if (commits.length === 0) {
    return <Card className="p-8 text-center text-sm text-muted-foreground">No commits match.</Card>
  }

  return (
    <ol>
      {groups.map((group, idx) => (
        <li key={group.day} className={cn(
          "relative grid gap-x-4 md:grid-cols-[9rem_1fr]",
          idx > 0 &&
          "before:absolute before:inset-x-0 before:-top-3 before:border-t before:border-dashed before:border-border dark:before:border-white/50",
        )}>
          <div className="pb-2 md:sticky md:top-2 md:self-start md:pb-0 md:pt-2.5 md:text-right">
            <h2 className="text-xs font-semibold text-black/50 dark:text-white/50">{group.day}</h2>
            <p className="text-xs text-muted-foreground">
              {group.commits.length} {group.commits.length === 1 ? "commit" : "commits"}
            </p>
          </div>
          <div className="relative pb-6">
            <ol className="space-y-3">
              {group.commits.map((commit, commitIndex) => {
                const isFirst = idx === 0 && commitIndex === 0
                const isLast = idx === groups.length - 1 && commitIndex === group.commits.length - 1
                const endsGroup = commitIndex === group.commits.length - 1

                return (
                  <li key={commit.hash} className="relative pl-8">
                    {!(isFirst && isLast) && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-3 border-l border-dashed border-border dark:border-white/50",
                          isLast
                            ? "top-0 h-5"
                            : cn(
                              isFirst ? "top-5" : "top-0",
                              endsGroup ? "-bottom-6" : "-bottom-3",
                            ),
                        )}
                      />
                    )}
                    {commit.subject.includes("Merge") || (
                      <span
                        className={cn(
                          "absolute left-[6.75px] top-4 size-2.5 rounded-full border border-white p-1 dark:border-background",
                          timelineDot(commit.review?.findings ?? null),
                        )}
                      />
                    )}
                    <CommitCard
                      commit={commit}
                      open={openHash === commit.hash}
                      onToggle={() => onToggle(commit.hash)}
                    />
                  </li>
                )
              })}
            </ol>
          </div>
        </li>
      ))}
    </ol>
  )
}

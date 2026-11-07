"use client"

import { cn } from "@/lib/utils"
import { dayLabel } from "../_lib/day-label"
import { TimeLabel } from "./time-label"
import { BadgeAlertIcon, BadgeCheckIcon, BadgePlusIcon, ChevronRightIcon } from "lucide-react"
import { useMemo, useState } from "react"
import type { CommitTime, CommittableItem, CommittableRun } from "../_lib/types"
import { AuthorTag } from "./author-tag"
import { Collapse } from "./collapse"
import { matchesQuery } from "../_lib/fuzzy"
import { CopyData, tableMarkdown } from "./copy-data"
import { CopyPath } from "./copy-path"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { SearchBox } from "./search-box"
import { PRIORITY_ORDER, PriorityLabel, statusDot } from "./findings"
import { countByRepo, filterByRepo, RepoBadge, RepoFilter, type RepoFilterValue } from "./repo"

const dotClass = (run: CommittableRun) => statusDot(run.attention.map((item) => item.priority))

// Full class names, so Tailwind generates them. Keyed by the dot colour statusDot() returns.
const BADGE_FILL: Record<string, string> = {
  "bg-red-500": "fill-red-500",
  "bg-amber-500": "fill-amber-500",
  "bg-green-600": "fill-green-600",
  "bg-blue-600": "fill-blue-600",
}

function VerdictBadge({ run }: { run: CommittableRun }) {
  const fill = BADGE_FILL[dotClass(run)] ?? "fill-blue-600"
  const Icon = run.verdict === "committable" ? BadgeCheckIcon : BadgeAlertIcon
  return <Icon className={cn("size-6 text-white dark:text-black", fill)} />
}

function AttentionTable({ items }: { items: CommittableItem[] }) {
  const sorted = [...items].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr className="divide-x border-b text-xs text-muted-foreground">
            <th className="w-12 px-4 py-2 font-medium">#</th>
            <th className="w-28 px-4 py-2 font-medium">Priority</th>
            <th className="px-4 py-2 font-medium">File</th>
            <th className="px-4 py-2 font-medium">Issue</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, i) => (
            <tr key={`${item.path}-${item.line}-${i}`} className="divide-x border-t align-top first:border-t-0">
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3">
                <PriorityLabel priority={item.priority} />
              </td>
              <td className="px-4 py-3">
                <CopyPath path={`${item.path}${item.line !== null ? `:${item.line}` : ""}`}>
                  <Highlight text={`${item.path}${item.line !== null ? `:${item.line}` : ""}`} />
                </CopyPath>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">
                  <Highlight text={item.issue} />
                </p>
                {item.fix && (
                  <p className="text-xs text-muted-foreground">
                    <Highlight text={item.fix} />
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const itemFile = (item: CommittableItem) => `${item.path}${item.line !== null ? `:${item.line}` : ""}`

function attentionCopy(items: CommittableItem[]) {
  const sorted = [...items].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
  )
  return {
    markdown: tableMarkdown(
      ["#", "Priority", "File", "Issue", "Fix"],
      sorted.map((item, i) => [String(i + 1), item.priority, itemFile(item), item.issue, item.fix ?? ""]),
    ),
    text: sorted
      .map((item, i) =>
        [`${i + 1}. [${item.priority}] ${itemFile(item)}`, `   ${item.issue}`, item.fix ? `   Fix: ${item.fix}` : ""]
          .filter(Boolean)
          .join("\n"),
      )
      .join("\n"),
  }
}

function RunCard({ run, baseHash }: { run: CommittableRun; baseHash: string | null }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 pl-3 text-left hover:bg-accent/30"
        onClick={() => setOpen((value) => !value)}>
        <ChevronRightIcon
          className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")}
        />
        <code className="shrink-0 text-xs font-medium"><TimeLabel iso={run.generatedAt} /></code>
        <RepoBadge repo={run.repo} />
        {baseHash && (
          <code title={`Made on top of commit ${baseHash}`} className="shrink-0 text-[10px] text-muted-foreground">
            {baseHash.slice(0, 7)}
          </code>
        )}
        <AuthorTag name={run.author} />
        <code className="min-w-40 flex-1 truncate text-xs text-muted-foreground">
          <Highlight text={run.branch} />
        </code>
        <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <span>{run.files.total} files</span>
          <span>
            {run.files.staged} staged · {run.files.unstaged} unstaged · {run.files.untracked} new
          </span>
        </span>
        <VerdictBadge run={run} />
      </button>

      <Collapse open={open}>
        <div className="space-y-4 border-t p-4">
          {run.attention.length > 0 &&
            <div className="overflow-hidden rounded-xl border">
              <div className="flex items-center justify-between border-b bg-black/5 px-2 py-1 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase">Needs attention ({run.attention.length})</p>
                <CopyData {...attentionCopy(run.attention)} />
              </div>
              <AttentionTable items={run.attention} />
            </div>
          }

          {run.safeFiles.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between border-b bg-black/5 px-2 py-1 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase text-black dark:text-white">
                  Safe files ({run.safeFiles.length})
                </p>
                <CopyData
                  markdown={run.safeFiles.map((f) => `- \`${f}\``).join("\n")}
                  text={run.safeFiles.join("\n")}
                />
              </div>
              <ul className="px-2 py-1 space-y-0.5">
                {run.safeFiles.map((file) => (
                  <li key={file}>
                    <CopyPath path={file} className="text-muted-foreground">
                      <Highlight text={file} />
                    </CopyPath>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {run.checks.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between border-b bg-black/5 px-2 py-1 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase text-black dark:text-white">Checks</p>
                <CopyData
                  markdown={tableMarkdown(
                    ["Status", "Command", "Result"],
                    run.checks.map((c) => [c.status, `\`${c.command}\``, c.result]),
                  )}
                  text={run.checks.map((c) => `[${c.status}] ${c.command}: ${c.result}`).join("\n")}
                />
              </div>
              {run.checks.map((check, i) => (
                <div key={i} className="px-2 py-1 flex flex-wrap items-center gap-2 text-xs">
                  <span>{check.status === "green" ? <BadgeCheckIcon className="size-6 text-white fill-green-600" /> : check.status === "red" ? <BadgePlusIcon className="size-6 text-white fill-red-600 rotate-45" /> : <BadgeAlertIcon className="size-6 text-white fill-amber-500" />}</span>
                  <code>{check.command}</code>
                  <span className="text-black uppercase font-bold dark:text-white">{check.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Collapse>
    </div>
  )
}

// Runs made between the same two commits of a branch belong together.
function intervalKey(run: CommittableRun, commitTimes: Record<string, CommitTime[]>) {
  const key = `${run.repo}:${run.branch}`
  const at = new Date(run.generatedAt).getTime()
  const times = commitTimes[key]
  if (!times || Number.isNaN(at)) return key
  return `${key}:${times.filter((c) => c.time <= at).length}`
}

// The newest commit made before the run: the one the run was made on top of.
function baseCommitHash(run: CommittableRun, commitTimes: Record<string, CommitTime[]>) {
  const at = new Date(run.generatedAt).getTime()
  const times = commitTimes[`${run.repo}:${run.branch}`]
  if (!times || Number.isNaN(at)) return null
  return times.filter((c) => c.time <= at).at(-1)?.hash ?? null
}

export function CommittableTab({
  runs: allRuns,
  commitTimes,
}: {
  runs: CommittableRun[]
  commitTimes: Record<string, CommitTime[]>
}) {
  const [repo, setRepo] = useState<RepoFilterValue>("all")
  const [keyword, setKeyword] = useState("")
  const runs = useMemo(
    () =>
      filterByRepo(allRuns, repo).filter((run) =>
        matchesQuery(keyword, [
          run.author,
          run.branch,
          run.verdict,
          ...run.attention.flatMap((a) => [a.path, a.issue, a.fix, a.priority]),
          ...run.safeFiles,
          ...run.checks.map((c) => c.command),
        ]),
      ),
    [allRuns, repo, keyword],
  )
  const days = useMemo(() => {
    const byDay = new Map<string, Map<string, CommittableRun[]>>()
    for (const run of runs) {
      const day = dayLabel(run.generatedAt)
      const sets = byDay.get(day) ?? new Map<string, CommittableRun[]>()
      const key = intervalKey(run, commitTimes)
      sets.set(key, [...(sets.get(key) ?? []), run])
      byDay.set(day, sets)
    }
    // Runs of one interval stay together; the first run of each set after the first gets a divider.
    return [...byDay.entries()].map(([day, sets]) => ({
      day,
      runs: [...sets.values()].flatMap((set) =>
        set.map((run, i) => ({ run, startsSet: i === 0 })),
      ),
    }))
  }, [runs, commitTimes])

  if (allRuns.length === 0) {
    return (
      <div className="p-20 text-center text-sm text-muted-foreground">
        No runs yet. Run <code className="rounded bg-accent px-1.5 py-0.5">/committable</code> in
        Claude Code to see them here.
      </div>
    )
  }

  return (
    <SearchHighlightProvider query={keyword}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <RepoFilter value={repo} onChange={setRepo} counts={countByRepo(allRuns)} />
          <div className="min-w-64 flex-1">
            <SearchBox
              value={keyword}
              onChange={setKeyword}
              placeholder="Search by branch, file, issue or check"
            />
          </div>
        </div>
        {runs.length === 0 && (
          <div className="p-20 text-center text-sm text-muted-foreground">
            {keyword.trim() ? "No runs match." : "No runs in this repo yet."}
          </div>
        )}
        <ol>
          {days.map((day, dayIndex) => (
            <li key={day.day} className={cn(
              "relative grid gap-x-4 md:grid-cols-[9rem_1fr]",
              dayIndex > 0 &&
              "before:absolute before:inset-x-0 before:-top-3 before:border-t before:border-dashed before:border-border dark:before:border-white/50",
            )}>
              <div className="pb-2 md:sticky md:top-2 md:self-start md:pb-0 md:pt-2.5 md:text-right">
                <h2 className="text-xs font-semibold text-black/50 dark:text-white/50">{day.day}</h2>
                <p className="text-xs text-muted-foreground">
                  {day.runs.length} {day.runs.length === 1 ? "run" : "runs"}
                </p>
              </div>
              <div className="relative pb-6">
                <ol className="space-y-3">
                  {day.runs.map(({ run, startsSet }, runIndex) => {
                    const isFirst = dayIndex === 0 && runIndex === 0
                    const isLast = dayIndex === days.length - 1 && runIndex === day.runs.length - 1
                    const endsDay = runIndex === day.runs.length - 1

                    return (
                      <li
                        key={run.fileName}
                        className={cn(
                          "relative pl-8",
                          startsSet &&
                            runIndex > 0 &&
                            "before:absolute before:inset-x-0 before:-top-[calc(0.375rem+0.5px)] before:border-t before:border-dashed before:border-border dark:before:border-white/50",
                        )}>
                        {!(isFirst && isLast) && (
                          <span
                            aria-hidden
                            className={cn(
                              "absolute left-3 border-l border-dashed border-border dark:border-white/50",
                              isLast
                                ? "top-0 h-5"
                                : cn(isFirst ? "top-5" : "top-0", endsDay ? "-bottom-6" : "-bottom-3"),
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "absolute left-[6.75px] top-4 size-2.5 rounded-full border border-white p-1 dark:border-background",
                            dotClass(run),
                          )}
                        />
                        <RunCard run={run} baseHash={baseCommitHash(run, commitTimes)} />
                      </li>
                    )
                  })}
                </ol>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SearchHighlightProvider>
  )
}

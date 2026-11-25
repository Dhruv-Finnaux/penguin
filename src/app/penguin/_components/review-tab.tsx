"use client"

import { cn } from "@/lib/utils"
import { dayLabel } from "../_lib/day-label"
import { ChevronRightIcon } from "lucide-react"
import { useMemo, useState } from "react"
import type { CommitInfo, Review, ReviewFinding } from "../_lib/types"
import { Collapse } from "./collapse"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { matchesQuery } from "../_lib/fuzzy"
import { HashButton } from "./hash-button"
import { SearchBox } from "./search-box"
import { ScoreBadge } from "./status"
import { NextTabs } from "./penguin-tabs"
import {
  countByPriority,
  countAttention,
  countFuture,
  isFuture,
  isResolved,
  countResolved,
  PriorityCounts,
  sortFindings,
  timelineDot,
  FindingsTable,
} from "./findings"
import { TimeLabel } from "./time-label"
import { filterByRepo, RepoBadge, RepoFilter, type RepoFilterValue } from "./repo"
import type { RepoKey } from "../_lib/types"

interface FindingGroup {
  key: string
  repo: RepoKey
  title: string
  hash: string | null
  shortHash: string | null
  subject: string
  date: string
  reviewFile: string
  runId: string
  score: number
  quality: Review["quality"]
  verdict: Review["verdict"]
  findings: ReviewFinding[]
  startIndex: number
}

type View = "all" | "opened" | "future"

function groupFindings(reviews: Review[], commits: CommitInfo[], keyword: string, view: View = "all"): FindingGroup[] {
  const futureOnly = view === "future"
  const commitKey = (repo: RepoKey, hash: string) => `${repo}:${hash}`
  const subjectByHash = new Map(commits.map((c) => [commitKey(c.repo, c.hash), c.subject]))
  const commitByHash = new Map(commits.map((c) => [commitKey(c.repo, c.hash), c]))
  const text = keyword.trim().toLowerCase()
  const groups: FindingGroup[] = []
  for (const review of reviews) {
    const hash = review.target.commit
    const commitId = hash ? commitKey(review.repo, hash) : review.fileName
    const key = review.fileName
    const visible =
      view === "future"
        ? review.findings.filter((f) => isFuture(f) && !isResolved(f))
        : view === "opened"
          ? review.findings.filter((f) => !isFuture(f) && !isResolved(f))
          : review.findings
    if (visible.length === 0) continue

    const shortHash = hash ? hash.slice(0, 7) : null
    const subject = hash
      ? (subjectByHash.get(commitId) ?? "")
      : review.target.title
        ? review.target.title
        : review.target.kind === "staged"
          ? "Staged changes"
          : "Uncommitted changes"
    if (text) {
      const commit = hash ? commitByHash.get(commitId) : undefined
      const fields = [
        hash ?? "",
        subject,
        commit?.author ?? "",
        ...(commit?.files.map((f) => f.path) ?? []),
        ...review.filesReviewed.map((f) => f.path),
        ...review.findings.map((f) => f.location),
      ]
      if (!matchesQuery(text, fields)) continue
    }

    groups.push({
      key,
      repo: review.repo,
      title: `${shortHash ?? ""} ${subject}`.trim(),
      hash: hash ?? null,
      shortHash,
      subject,
      date: review.generatedAt,
      reviewFile: review.fileName,
      runId: review.id,
      score: review.score,
      quality: review.quality,
      verdict: review.verdict,
      findings: sortFindings(visible),
      startIndex: 1,
    })
  }

  groups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  // The same issue is repeated by every re-review of a commit, so the Future list keeps each one once:
  // the newest report wins. The key is the repo, the file (without the line number) and the title.
  if (futureOnly) {
    const seen = new Set<string>()
    for (const group of groups) {
      group.findings = group.findings.filter((f) => {
        const key = `${group.repo}|${f.location.replace(/:\d+(?::\d+)?$/, "")}|${f.title.trim().toLowerCase()}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }
    groups.splice(0, groups.length, ...groups.filter((group) => group.findings.length > 0))
  }
  let nextIndex = 1
  for (const group of groups) {
    group.startIndex = nextIndex
    nextIndex += group.findings.length
  }
  return groups
}

function groupByDay(groups: FindingGroup[]) {
  const byDay = new Map<string, FindingGroup[]>()
  for (const group of groups) {
    const day = dayLabel(group.date)
    byDay.set(day, [...(byDay.get(day) ?? []), group])
  }
  return [...byDay.entries()].map(([day, items]) => ({ day, groups: items }))
}

function Chevron({ open }: { open: boolean }) {
  return <ChevronRightIcon className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")} />
}

function FindingGroupCard({ group }: { group: FindingGroup }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", !group.hash && "border-dashed")}>
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 pl-3 text-left hover:bg-accent/30"
        onClick={() => setOpen((value) => !value)}
      >
        <Chevron open={open} />
        <code className="shrink-0 text-xs font-medium">
          <TimeLabel iso={group.date} />
        </code>
        <RepoBadge repo={group.repo} />
        {group.hash && <HashButton hash={group.hash} />}
        <code className="min-w-72 flex-1 truncate text-xs">
          <Highlight text={group.subject} />
        </code>
        <ScoreBadge score={group.score} quality={group.quality} verdict={group.verdict} />
        <PriorityCounts
          counts={countByPriority(group.findings)}
          resolved={countResolved(group.findings)}
          future={countFuture(group.findings)}
          attention={countAttention(group.findings)}
        />
      </button>
      <Collapse open={open}>
        <div className="border-t">
          <FindingsTable findings={group.findings} reviewFile={group.reviewFile} startIndex={group.startIndex} />
        </div>
      </Collapse>
    </div>
  )
}

export function ReviewTab({ reviews: allReviews, commits }: { reviews: Review[]; commits: CommitInfo[] }) {
  const [keyword, setKeyword] = useState("")
  const [repo, setRepo] = useState<RepoFilterValue>("all")
  const [view, setView] = useState<View>("all")
  const reviews = useMemo(() => filterByRepo(allReviews, repo), [allReviews, repo])
  const groups = groupFindings(reviews, commits, keyword, view)
  const days = useMemo(() => groupByDay(groups), [groups])

  const allGroups = groupFindings(allReviews, commits, "")
  const hasAny = allGroups.length > 0
  const futureGroups = groupFindings(allReviews, commits, "", "future")
  const futureCount = futureGroups.reduce((sum, group) => sum + group.findings.length, 0)
  const openedGroups = groupFindings(allReviews, commits, "", "opened")
  const openedCount = openedGroups.reduce((sum, group) => sum + group.findings.length, 0)

  const findingCounts = { all: 0, frontend: 0, backend: 0 }
  for (const group of view === "future" ? futureGroups : view === "opened" ? openedGroups : allGroups) {
    findingCounts.all += group.findings.length
    findingCounts[group.repo] += group.findings.length
  }

  if (!hasAny) {
    return (
      <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
        {allReviews.length === 0 ? (
          <>
            No reviews yet. Run <code className="rounded bg-accent px-1.5 py-0.5">/howismycommit</code> in Claude Code
            to get findings here.
          </>
        ) : (
          "Nothing to apply. No review has any finding."
        )}
      </div>
    )
  }

  return (
    <SearchHighlightProvider query={keyword}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <NextTabs
            value={view}
            onValueChange={(next) => setView(next as View)}
            shouldPersist={false}
            delayTabs={false}
            tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
            tabs={[
              { value: "all", label: "All findings", component: null },
              { value: "opened", label: `Opened (${openedCount})`, component: null },
              { value: "future", label: `Future (${futureCount})`, component: null },
            ]}
          />
          <RepoFilter value={repo} onChange={setRepo} counts={findingCounts} />
          <div className="min-w-64 flex-1">
            <SearchBox value={keyword} onChange={setKeyword} />
          </div>
        </div>
        {groups.length === 0 ? (
          <div className="p-20 text-center text-sm text-muted-foreground">
            {!keyword.trim() && view === "future"
              ? "Nothing is delayed for the future."
              : !keyword.trim() && view === "opened"
                ? "No opened findings."
                : "No findings match."}
          </div>
        ) : (
          <ol>
            {days.map((day, dayIndex) => {
              return (
                <li
                  key={day.day}
                  className={cn(
                    "relative grid gap-x-4 md:grid-cols-[9rem_1fr]",
                    dayIndex > 0 &&
                      "before:absolute before:inset-x-0 before:-top-3 before:border-t before:border-dashed before:border-border dark:before:border-white/50",
                  )}
                >
                  <div className="pb-2 md:sticky md:top-2 md:self-start md:pb-0 md:pt-2.5 md:text-right">
                    <h3 className="text-xs font-semibold text-black/50 dark:text-white/50">{day.day}</h3>
                    <p className="text-xs text-muted-foreground">
                      {day.groups.length} {day.groups.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                  <div className="relative pb-6">
                    <ol className="space-y-3">
                      {day.groups.map((group, groupIndex) => {
                        const isFirst = dayIndex === 0 && groupIndex === 0
                        const isLast = dayIndex === days.length - 1 && groupIndex === day.groups.length - 1
                        const endsDay = groupIndex === day.groups.length - 1

                        return (
                          <li key={group.key} className="relative pl-8">
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
                                timelineDot(group.findings),
                              )}
                            />
                            <FindingGroupCard group={group} />
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </SearchHighlightProvider>
  )
}

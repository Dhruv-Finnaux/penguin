"use client"

import type { ExplainRun } from "../_lib/types"
import { useMemo, useState } from "react"
import { countByRepo, filterByRepo, RepoBadge, RepoFilter, type RepoFilterValue } from "./repo"
import { matchesQuery } from "../_lib/fuzzy"
import { AuthorTag } from "./author-tag"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { TimeLabel } from "./time-label"
import { CopyTextButton, RunCard, RunTimeline } from "./run-timeline"
import { SearchBox } from "./search-box"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase text-black px-2 border-b bg-black/5 py-1 dark:bg-white/5 dark:text-white">{title}</p>
      <div className="px-2 py-1 text-sm">{children}</div>
    </div>
  )
}

function toText(run: ExplainRun) {
  return [
    `problem: ${run.problem}`,
    `sourceFile: ${run.sourceFiles.join(", ")}`,
    `reason: ${run.reason}`,
    `solution: ${run.solution}`,
    "approach:",
    ...run.approach.map((step, i) => `${i + 1}. ${step}`),
    `advise/gotchas: ${run.advice}`,
  ].join("\n")
}

export function ExplainTab({ runs: allRuns }: { runs: ExplainRun[] }) {
  const [repo, setRepo] = useState<RepoFilterValue>("all")
  const [keyword, setKeyword] = useState("")
  const runs = useMemo(
    () =>
      filterByRepo(allRuns, repo).filter((run) =>
        matchesQuery(keyword, [
          run.author,
          run.question,
          run.problem,
          run.reason,
          run.solution,
          run.advice,
          ...run.sourceFiles,
          ...run.approach,
        ]),
      ),
    [allRuns, repo, keyword],
  )

  return (
    <SearchHighlightProvider query={keyword}>
    <div className="space-y-4">
    {allRuns.length > 0 && (
      <div className="flex flex-wrap items-center gap-3">
        <RepoFilter value={repo} onChange={setRepo} counts={countByRepo(allRuns)} />
        <div className="min-w-64 flex-1">
          <SearchBox
            value={keyword}
            onChange={setKeyword}
            placeholder="Search by question, answer or source file"
          />
        </div>
      </div>
    )}
    <RunTimeline
      runs={runs}
      noun="answer"
      empty={
        allRuns.length > 0 ? (
          "No answers match."
        ) : (
        <>
          No answers yet. Run <code className="rounded bg-accent px-1.5 py-0.5">/explainme</code> in
          Claude Code to see them here.
        </>
        )
      }
      renderRun={(run) => (
        <RunCard
          summary={
            <>
              <code className="shrink-0 text-xs font-medium"><TimeLabel iso={run.generatedAt} /></code>
              <RepoBadge repo={run.repo} />
              <AuthorTag name={run.author} />
              <span className="w-10 flex-1 truncate text-sm">
                <Highlight text={run.question} />
              </span>
            </>
          }
          actions={
            <div className="flex gap-2 items-center">
              <CopyTextButton label="Copy Answer" text={toText(run)} />
              <CopyTextButton
                label="Copy Explanation"
                text={[
                  `Problem:\n${run.problem}`,
                  `Reason:\n${run.reason}`,
                  `Solution:\n${run.solution}`,
                  run.approach.length > 0
                    ? `Approach:\n${run.approach.map((step, i) => `${i + 1}. ${step}`).join("\n")}`
                    : "",
                  run.advice ? `Advice / gotchas:\n${run.advice}` : "",
                ]
                  .filter(Boolean)
                  .join("\n\n")}
              />
            </div>
          }>
          <Section title="Problem"><Highlight text={run.problem} /></Section>
          {run.sourceFiles.length > 0 && (
            <Section title="Source">
              <ul className="space-y-0.5">
                {run.sourceFiles.map((file) => (
                  <li key={file}>
                    <code className="break-all text-xs"><Highlight text={file} /></code>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          <Section title="Reason"><Highlight text={run.reason} /></Section>
          <Section title="Solution"><Highlight text={run.solution} /></Section>
          {run.approach.length > 0 && (
            <Section title="Approach">
              <ol className="list-decimal space-y-0.5 pl-5">
                {run.approach.map((step, i) => (
                  <li key={i}><Highlight text={step} /></li>
                ))}
              </ol>
            </Section>
          )}
          {run.advice && <Section title="Advice / gotchas"><Highlight text={run.advice} /></Section>}
        </RunCard>
      )}
    />
    </div>
    </SearchHighlightProvider>
  )
}

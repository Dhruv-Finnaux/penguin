"use client"

import type { GitGuideRun } from "../_lib/types"
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

function toText(run: GitGuideRun) {
  return [
    `goal: ${run.goal}`,
    `approach: ${run.approach}`,
    "steps:",
    ...run.steps.flatMap((step, i) => [
      `${i + 1}. ${step.title}`,
      step.explain,
      ...step.commands,
      step.expect ? `expect: ${step.expect}` : "",
      step.ifWrong ? `ifWrong: ${step.ifWrong}` : "",
    ]),
    run.questions.length > 0 ? "questions:" : "questions: none",
    ...run.questions.flatMap((q, i) => [`Q${i + 1}. ${q.question}`, ...q.options]),
  ]
    .filter(Boolean)
    .join("\n")
}

function toCommands(run: GitGuideRun) {
  return run.steps.flatMap((step) => step.commands).join("\n")
}

export function GitGuideTab({ runs: allRuns }: { runs: GitGuideRun[] }) {
  const [repo, setRepo] = useState<RepoFilterValue>("all")
  const [keyword, setKeyword] = useState("")
  const runs = useMemo(
    () =>
      filterByRepo(allRuns, repo).filter((run) =>
        matchesQuery(keyword, [
          run.author,
          run.question,
          run.goal,
          run.approach,
          ...run.steps.flatMap((s) => [s.title, s.explain, s.expect, s.ifWrong, ...s.commands]),
          ...run.questions.flatMap((q) => [q.question, ...q.options]),
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
                placeholder="Search by goal, step or command"
              />
            </div>
          </div>
        )}
        <RunTimeline
          runs={runs}
          noun="guide"
          empty={
            allRuns.length > 0 ? (
              "No guides match."
            ) : (
              <>
                No guides yet. Run{" "}
                <code className="rounded bg-accent px-1.5 py-0.5">/talktomegit</code> in Claude Code
                to see them here.
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
                <div className="flex items-center gap-2">
                  <CopyTextButton label="Copy Guide" text={toText(run)} />
                  <CopyTextButton label="Copy Commands" text={toCommands(run)} />
                </div>
              }>
              <Section title="Goal"><Highlight text={run.goal} /></Section>
              <Section title="Approach"><Highlight text={run.approach} /></Section>
              {run.steps.length > 0 && (
                <Section title="Steps">
                  <ol className="list-decimal space-y-3 pl-5">
                    {run.steps.map((step, i) => (
                      <li key={i} className="space-y-1">
                        <p className="font-medium"><Highlight text={step.title} /></p>
                        {step.explain && <p><Highlight text={step.explain} /></p>}
                        {step.commands.length > 0 && (
                          <pre className="overflow-x-auto rounded bg-black/5 p-2 text-xs dark:bg-white/10">
                            {step.commands.map((c, ci) => (
                              <code key={ci} className="block"><Highlight text={c} /></code>
                            ))}
                          </pre>
                        )}
                        {step.expect && (
                          <p className="text-xs text-muted-foreground">
                            You should see: <Highlight text={step.expect} />
                          </p>
                        )}
                        {step.ifWrong && (
                          <p className="text-xs text-muted-foreground">
                            If not: <Highlight text={step.ifWrong} />
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </Section>
              )}
              {run.questions.length > 0 && (
                <Section title="Questions">
                  <ol className="space-y-2">
                    {run.questions.map((q, i) => (
                      <li key={i}>
                        <p className="font-medium">
                          Q{i + 1}. <Highlight text={q.question} />
                        </p>
                        <ul className="list-disc space-y-0.5 pl-5">
                          {q.options.map((o, oi) => (
                            <li key={oi}><Highlight text={o} /></li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}
            </RunCard>
          )}
        />
      </div>
    </SearchHighlightProvider>
  )
}

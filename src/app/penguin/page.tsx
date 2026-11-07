import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { connection } from "next/server"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { PenguinTabs } from "./_components/penguin-tabs"
import {
  getCommitTimes,
  getCommittableRuns,
  getDocGroups,
  getExplainRuns,
  getGitGuideRuns,
  getQuestions,
  getRepoInfo,
  getReviewedCommits,
  getReviews,
  isLocalOnly,
} from "./_lib/penguin.server"

export default function PenguinPage() {
  if (!isLocalOnly()) notFound()

  return (
    <div className="mx-5 h-dvh overflow-y-auto scroll-smooth border-x border-black/15 bg-white shadow-2xl dark:border-white/15 dark:bg-background">
      <div className="mx-auto w-full space-y-4 p-4 md:p-10">
        <Suspense fallback={<LoadingIndicatorView message="Please Wait" />}>
          <PenguinData />
        </Suspense>
      </div>
    </div>
  )
}

async function loadPenguinData() {
  const [
    reviews,
    committableRuns,
    explainRuns,
    gitGuideRuns,
    docGroups,
    frontendQuestions,
    backendQuestions,
    frontend,
    backend,
  ] = await Promise.all([
    getReviews(),
    getCommittableRuns(),
    getExplainRuns(),
    getGitGuideRuns(),
    getDocGroups(),
    getQuestions("frontend"),
    getQuestions("backend"),
    getRepoInfo("frontend"),
    getRepoInfo("backend"),
  ])
  const reviewedCommits = await getReviewedCommits(reviews)
  const commitTimes = await getCommitTimes(committableRuns)
  return {
    reviews,
    reviewedCommits,
    committableRuns,
    commitTimes,
    explainRuns,
    gitGuideRuns,
    docGroups,
    frontendQuestions,
    backendQuestions,
    repos: { frontend, backend },
  }
}

async function PenguinData() {
  await connection()

  let data: Awaited<ReturnType<typeof loadPenguinData>>
  try {
    data = await loadPenguinData()
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load Penguin data</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Unknown error"}
        </AlertDescription>
      </Alert>
    )
  }

  return <PenguinTabs {...data} loadedAt={new Date().toISOString()} />
}

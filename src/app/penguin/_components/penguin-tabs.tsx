"use client"

import * as React from "react"

import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { Tabs } from "@base-ui/react/tabs"
import { parseAsString, useQueryState } from "nuqs"
import { AnimatedRefreshIcon } from "@/components/ui/animated-refresh-icon"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { InfoIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition as startBackgroundTransition, useEffect, useTransition } from "react"
import type {
  CommitTime,
  CommitInfo,
  CommittableRun,
  DbBackupData,
  DocGroup,
  ExplainRun,
  GitGuideRun,
  NextTabsProps,
  QuestionItem,
  RepoInfo,
  RepoKey,
  Review,
} from "../_lib/types"
import { DEFAULT_REPO_FILTERS, DEFAULT_VIEW_OPTIONS, RepoTab, type RepoFilters, type ViewOptions } from "./repo-tab"
import { branchColorName, branchKey, registerBranchColors } from "../_lib/graph-layout"
import { CommittableTab } from "./committable-tab"
import { DbBackupsTab } from "./db-backups-tab"
import { DocsTab } from "./docs-tab"
import { ExplainTab } from "./explain-tab"
import { GitGuideTab } from "./git-guide-tab"
import { GitPlaygroundTab } from "./git-playground-tab"
import { TestingTab } from "./testing-tab"
import { TodosTab } from "./todos-tab"
import { QuestionsTab } from "./questions-tab"
import { ReviewTab } from "./review-tab"
import { cn } from "@/lib/utils"
import { Scroller } from "@/components/ui/scroller"
import { ThemeToggle } from "./theme-toggle"

const TAB_SOURCES: { tab: string; source: React.ReactNode }[] = [
  {
    tab: "Testing",
    source: (
      <>
        Test runs are the Findings reviews whose target kind is <code>test-run</code>. Screenshots and data are read
        live from <code>testing/test-evidence/</code>.
      </>
    ),
  },
  {
    tab: "Frontend / Backend",
    source: (
      <>
        Read from git in Finnaux2.0-UI and Finnaux2.0-API: every local and remote branch and its commits. Run{" "}
        <code>/howismycommit [hash]</code> in that repo to add a review to one.
      </>
    ),
  },
  {
    tab: "Findings",
    source: (
      <>
        Run <code>/howismycommit [hash]</code> in either repo. It reviews a commit and lists its findings in{" "}
        <code>.penguin/data/&lt;repo&gt;/howismycommit.json</code>.
      </>
    ),
  },
  {
    tab: "Committables",
    source: (
      <>
        Run <code>/committable</code> in either repo to check the files changed right now before you commit. Runs go to{" "}
        <code>.penguin/data/&lt;repo&gt;/committable.json</code>.
      </>
    ),
  },
  {
    tab: "Explanations",
    source: (
      <>
        Run <code>/explainme &lt;doubt | problem&gt;</code> in either repo. Answers go to{" "}
        <code>.penguin/data/&lt;repo&gt;/explainme.json</code> and show here as one list.
      </>
    ),
  },
  {
    tab: "Git Guides",
    source: (
      <>
        Run <code>/talktomegit &lt;what you want to do&gt;</code> in either repo. Guides go to{" "}
        <code>.penguin/data/&lt;repo&gt;/talktomegit.json</code> and show here as one list.
      </>
    ),
  },
  {
    tab: "Documents",
    source: (
      <>
        Markdown files in the <code>docs/</code> folder of both repos, one group per sub folder.
      </>
    ),
  },
  {
    tab: "DB Backups",
    source: (
      <>
        Run <code>db backup</code> or <code>db restore</code> in the backend. Each one is recorded in{" "}
        <code>.penguin/data/backend/dbbackups.json</code>; the backup files are read live from the backup folder.
      </>
    ),
  },
  {
    tab: "Questions",
    source: (
      <>
        Add and answer them here. They are stored in <code>.penguin/data/&lt;repo&gt;/questions.json</code>.
      </>
    ),
  },
]

function InfoButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Where does this data come from?"
          title="Where does this data come from?"
          className="bg-card px-2 hover:bg-card"
        >
          <InfoIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 space-y-3 text-sm">
        <dl className="space-y-2">
          {TAB_SOURCES.map((item) => (
            <div key={item.tab} className="space-y-0.5">
              <dt className="text-xs font-semibold uppercase text-black dark:text-white">{item.tab}</dt>
              <dd className="text-sm [&_code]:rounded [&_code]:bg-accent [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs">
                {item.source}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-muted-foreground">
          Run the commands in Claude Code. <br /> This page refreshes on its own.
        </p>
      </PopoverContent>
    </Popover>
  )
}

export function PenguinTabs({
  reviews,
  reviewedCommits,
  committableRuns,
  commitTimes,
  explainRuns,
  gitGuideRuns,
  docGroups,
  frontendQuestions,
  backendQuestions,
  repos,
  dbBackups,
}: {
  reviews: Review[]
  reviewedCommits: CommitInfo[]
  committableRuns: CommittableRun[]
  commitTimes: Record<string, CommitTime[]>
  explainRuns: ExplainRun[]
  gitGuideRuns: GitGuideRun[]
  docGroups: DocGroup[]
  frontendQuestions: QuestionItem[]
  backendQuestions: QuestionItem[]
  repos: Record<RepoKey, RepoInfo>
  dbBackups: DbBackupData
}) {
  // Every branch in both repos gets its own colour before any tab draws; the same set always gives the same colours.
  registerBranchColors(
    Object.values(repos).flatMap((repo) =>
      repo.branches.flatMap((branch) => [branchColorName(branch), branchKey(branch)]),
    ),
  )
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()
  // Kept here, above the tabs, so the view survives switching between frontend and backend.
  const [viewOptions, setViewOptions] = React.useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)
  const [repoFilters, setRepoFilters] = React.useState<Record<RepoKey, RepoFilters>>({
    frontend: DEFAULT_REPO_FILTERS,
    backend: DEFAULT_REPO_FILTERS,
  })

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        startBackgroundTransition(() => router.refresh())
      }
    }
    const timer = setInterval(refresh, 6 * 10_000)
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      clearInterval(timer)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [router])

  return (
    <div>
      <NextTabs
        defaultValue="frontend"
        persistKey="penguin_tab"
        delayTabs={false}
        tabsClassNames={{ base: "p-0", panel: "mt-4" }}
        extra={
          <div className="flex items-center gap-3">
            <InfoButton />
            <ThemeToggle />
            <Button
              size="sm"
              variant="ghost"
              className="bg-card hover:bg-card"
              disabled={isRefreshing}
              onClick={() => startTransition(() => router.refresh())}
            >
              <AnimatedRefreshIcon loading={isRefreshing} size={16} />
              {isRefreshing ? "Refreshing" : "Refresh"}
            </Button>
          </div>
        }
        tabs={[
          {
            value: "testing",
            label: "Testing",
            component: <TestingTab reviews={reviews} />,
          },
          {
            value: "findings",
            label: "Findings",
            component: <ReviewTab reviews={reviews} commits={reviewedCommits} />,
          },
          {
            value: "frontend",
            label: "Frontend",
            component: (
              <RepoTab
                repo={repos.frontend}
                reviews={reviews}
                options={viewOptions}
                onOptions={setViewOptions}
                filters={repoFilters.frontend}
                onFilters={(next) => setRepoFilters((all) => ({ ...all, frontend: next }))}
              />
            ),
          },
          {
            value: "backend",
            label: "Backend",
            component: (
              <RepoTab
                repo={repos.backend}
                reviews={reviews}
                options={viewOptions}
                onOptions={setViewOptions}
                filters={repoFilters.backend}
                onFilters={(next) => setRepoFilters((all) => ({ ...all, backend: next }))}
              />
            ),
          },
          {
            value: "committables",
            label: "Committables",
            component: <CommittableTab runs={committableRuns} commitTimes={commitTimes} />,
          },
          {
            value: "explanations",
            label: "Explanations",
            component: <ExplainTab runs={explainRuns} />,
          },
          {
            value: "git-guides",
            label: "Git Guides",
            component: <GitGuideTab runs={gitGuideRuns} />,
          },
          {
            value: "git-playground",
            label: "Git Playground",
            component: <GitPlaygroundTab />,
          },
          {
            value: "documents",
            label: "Documents",
            component: <DocsTab groups={docGroups} />,
          },
          {
            value: "db-backups",
            label: "DB Backups",
            component: <DbBackupsTab {...dbBackups} />,
          },
          {
            value: "todos",
            label: "Todos",
            component: <TodosTab />,
          },
          {
            value: "questions",
            label: "Questions",
            component: <QuestionsTab frontend={frontendQuestions} backend={backendQuestions} />,
          },
        ]}
      />
    </div>
  )
}

export const NextTabs = ({
  value,
  onValueChange,
  tabs,
  defaultValue = tabs[0]?.value,
  persistKey,
  shouldPersist = true,
  tabsClassNames,
  delayTabs = true,
  extra,
}: NextTabsProps) => {
  const defaultPersistKey = persistKey || "__next_active_tab"
  const [localActiveTab, setLocalActiveTab] = React.useState(value || defaultValue)
  const [activeTabValue, setActiveTabValue] = useQueryState(
    defaultPersistKey,
    parseAsString
      .withOptions({
        ...(shouldPersist === false ? { throttleMs: +Infinity } : {}),
      })
      .withDefault(defaultValue),
  )

  const [initialTabChanged, setInitialTabChanged] = React.useState(false)
  const listRef = React.useRef<HTMLDivElement | null>(null)

  const handleTabChange = React.useCallback(
    (nextValue: string) => {
      const changeFunction = shouldPersist ? setActiveTabValue : setLocalActiveTab
      setInitialTabChanged(true)
      void (onValueChange ? onValueChange(nextValue) : changeFunction(nextValue))
    },
    [onValueChange, setActiveTabValue, shouldPersist],
  )

  const selectedKey = onValueChange ? value : shouldPersist ? activeTabValue : localActiveTab

  const scroller = React.useCallback(
    (node: HTMLElement | null, tabValue: string) => {
      if (selectedKey !== tabValue || !node) return

      const scrollerElement = listRef.current
      if (!scrollerElement) return

      const elLeft = node.offsetLeft
      const elRight = elLeft + node.offsetWidth
      const elParentLeft = scrollerElement.scrollLeft
      const elParentRight = elParentLeft + scrollerElement.offsetWidth

      if (elRight > elParentRight) {
        scrollerElement.scrollLeft = elRight - scrollerElement.offsetWidth + 100
      } else if (elLeft < elParentLeft) {
        scrollerElement.scrollLeft = Math.max(0, elLeft - 100)
      }
    },
    [selectedKey],
  )

  return (
    <Tabs.Root
      value={selectedKey}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => {
        if (nextValue == null) return
        handleTabChange(nextValue.toString())
      }}
      className={cn("flex flex-1 flex-col p-4", tabsClassNames?.base)}
    >
      <div className="flex items-center justify-between gap-4">
        <Scroller orientation={"horizontal"} hideScrollbar withNavigation>
          <Tabs.List
            activateOnFocus
            ref={listRef}
            className={cn(
              "relative flex max-h-max w-max max-w-max flex-shrink-0 items-center gap-1 rounded-xl bg-foreground/5 shadow-inner p-1 text-sm text-foreground/80 scrollbar-hide",
              tabsClassNames?.tabList,
            )}
          >
            <Tabs.Indicator
              className={cn(
                "pointer-events-none absolute left-0 top-0 z-0 h-[var(--active-tab-height)] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] translate-y-[var(--active-tab-top)] rounded-lg bg-white dark:bg-card border-border/50 border shadow-md transition-[transform,width,height] duration-300 ease-out",
                tabsClassNames?.cursor,
              )}
            />
            {tabs.map((tab) => {
              const isSelected = selectedKey === tab.value
              return (
                <Tabs.Tab
                  data-selected={isSelected ? "true" : undefined}
                  disabled={tab.disabled}
                  key={tab.value}
                  ref={(node) => scroller(node, tab.value)}
                  value={tab.value}
                  className={cn(
                    "group relative z-10 inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-medium outline-none duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focus-visible=true]:outline-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    tabsClassNames?.tab,
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-1 group-data-[selected=true]:text-black dark:group-data-[selected=true]:text-white",
                        tabsClassNames?.tabContent,
                      )}
                    >
                      {tab.label}
                    </span>
                    {!!tab.labelBadge && (
                      <div className="flex size-5 items-center justify-center rounded-xs bg-foreground text-xs text-background">
                        {tab.labelBadge}
                      </div>
                    )}
                  </div>
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </Scroller>
        {extra && <div className={cn("flex-shrink-0", tabsClassNames?.extra)}>{extra}</div>}
      </div>
      {tabs.map((tab) => (
        <Tabs.Panel
          key={tab.value}
          value={tab.value}
          className={cn("mt-3 flex flex-1 flex-col outline-none", tabsClassNames?.panel)}
        >
          <React.Suspense fallback={<LoadingIndicatorView />}>
            {initialTabChanged && delayTabs ? (
              <DelayTab delay={tab.delay ?? 250}>
                {typeof tab.component === "function" ? <tab.component /> : tab.component}
              </DelayTab>
            ) : typeof tab.component === "function" ? (
              <tab.component />
            ) : (
              tab.component
            )}
          </React.Suspense>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}

function DelayTab({ children, delay }: { children: React.ReactNode; delay: number }) {
  const [mounted, setMounted] = React.useState(false)
  const timerId = React.useRef(null as unknown as NodeJS.Timeout)
  React.useEffect(() => {
    timerId.current = setTimeout(() => setMounted(true), delay) as any

    return () => clearTimeout(timerId.current)
  }, [delay])

  return mounted ? (
    <div className={"flex flex-1 flex-col duration-100 animate-in fade-in-0"}>{children}</div>
  ) : delay >= 300 ? (
    <LoadingIndicatorView />
  ) : null
}

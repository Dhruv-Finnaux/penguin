"use client"

import { LoadingIndicatorView } from "@/components/loading-indicator-view"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  XIcon,
} from "lucide-react"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import type { DocFile, DocGroup, RepoKey } from "../_lib/types"
import { Collapse } from "./collapse"
import { matchesQuery } from "../_lib/fuzzy"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { SearchBox } from "./search-box"
import { MarkdownView } from "./markdown-view"
import { REPO_LABEL, RepoBadge } from "./repo"

async function fetchDoc(path: string): Promise<string> {
  const res = await fetch(`/penguin/api/doc?path=${encodeURIComponent(path)}`)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.message ?? "Could not load the document")
  return body.content as string
}

const MATCH_SELECTOR = "mark[data-search-match]"

const dirOf = (path: string) => path.split("/").slice(0, -1).join("/")

// Doc paths are `<repo>/<path inside docs>`. Folder logic works on the part inside docs.
const inner = (path: string) => path.split("/").slice(1).join("/")

function DocViewer({
  file,
  allFiles,
  onSelect,
  listVisible,
  onToggleList,
}: {
  file: DocFile
  allFiles: DocFile[]
  onSelect: (path: string) => void
  listVisible: boolean
  onToggleList: () => void
}) {
  const repoFiles = allFiles.filter((f) => f.repo === file.repo)
  const dir = dirOf(inner(file.path))
  const parentDir = dirOf(dir)
  const siblings = repoFiles.filter((f) => dirOf(inner(f.path)) === dir)
  const parentFiles = parentDir
    ? repoFiles.filter((f) => inner(f.path).startsWith(`${parentDir}/`) && dirOf(inner(f.path)) !== dir)
    : []

  const query = useQuery({
    queryKey: ["penguin", "doc", file.path],
    queryFn: () => fetchDoc(file.path),
  })

  const [keyword, setKeyword] = useState("")
  const deferred = useDeferredValue(keyword)
  const contentRef = useRef<HTMLDivElement>(null)
  const [matchCount, setMatchCount] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const marks = contentRef.current?.querySelectorAll(MATCH_SELECTOR)
    setMatchCount(marks?.length ?? 0)
    setCurrent(0)
  }, [deferred, query.data])

  useEffect(() => {
    const marks = contentRef.current?.querySelectorAll<HTMLElement>(MATCH_SELECTOR)
    marks?.forEach((mark, index) => {
      mark.dataset.active = index === current ? "true" : "false"
    })
    if (deferred.trim() && marks?.[current]) {
      marks[current].scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [current, matchCount, deferred])

  const step = (direction: 1 | -1) => {
    if (matchCount === 0) return
    setCurrent((value) => (value + direction + matchCount) % matchCount)
  }

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        <Button
          size="sm"
          variant="ghost"
          isIcon
          aria-label={listVisible ? "Hide document list" : "Show document list"}
          title={listVisible ? "Hide document list" : "Show document list"}
          onClick={onToggleList}>
          {listVisible ? <ChevronRightIcon className="size-4 rotate-180" /> : <ChevronRightIcon className="size-4" />}
        </Button>
        <div className="flex min-w-0 flex-1 items-center gap-1 text-sm text-muted-foreground">
          <RepoBadge repo={file.repo} />
          <span className="min-w-0 truncate">docs/{dir ? `${dir}/` : ""}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex shrink-0 items-center gap-1 py-1 text-foreground">
                {file.title}
                <ChevronDownIcon className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="mt-[6px] max-h-80 min-w-56 overflow-y-auto bg-white dark:bg-popover p-3 border-t-0 rounded-xl rounded-t-none">
              <DropdownMenuLabel className="text-xl text-black dark:text-white">
                /{dir.split("/").pop() || "docs"}
              </DropdownMenuLabel>
              {siblings.map((item) => (
                <DropdownMenuItem key={item.path} onSelect={() => onSelect(item.path)} className="cursor-pointer">
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.path === file.path && <CheckIcon className="size-4" />}
                </DropdownMenuItem>
              ))}
              {parentFiles.length > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-black/20" />
                  <DropdownMenuLabel className="text-xl text-black dark:text-white">
                    /{parentDir.split("/").pop()}
                  </DropdownMenuLabel>
                  {parentFiles.map((item) => (
                    <DropdownMenuItem key={item.path} onSelect={() => onSelect(item.path)} className="cursor-pointer">
                      <span className="flex-1 truncate">
                        {inner(item.path).slice(parentDir.length + 1)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white dark:bg-background p-4 border-b backdrop-blur">
        <div className="relative flex-1">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                step(e.shiftKey ? -1 : 1)
              }
            }}
            className="border-dashed focus-visible:border-black/30 bg-white focus-visible:bg-white hover:bg-white dark:border-white/20 dark:bg-card dark:hover:bg-card dark:focus-visible:bg-card"
            placeholder="Search in this document"
          />
          {keyword && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setKeyword("")}>
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        {keyword.trim() && (
          <>
            <span className="w-16 shrink-0 text-center text-xs text-muted-foreground">
              {matchCount === 0 ? "No match" : `${current + 1} / ${matchCount}`}
            </span>
            <Button
              size="sm"
              variant="outline"
              isIcon
              aria-label="Previous match"
              disabled={matchCount === 0}
              onClick={() => step(-1)}>
              <ChevronUpIcon className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              isIcon
              aria-label="Next match"
              disabled={matchCount === 0}
              onClick={() => step(1)}>
              <ChevronDownIcon className="size-4" />
            </Button>
          </>
        )}
      </div>

      {query.isLoading ? (
        <LoadingIndicatorView className="min-h-[60vh]" />
      ) : query.isError ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <span>{query.error.message}</span>
          <Button size="sm" variant="outline" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div ref={contentRef}>
          <SearchHighlightProvider query={deferred} exact>
            <MarkdownView source={query.data ?? ""} />
          </SearchHighlightProvider>
        </div>
      )}
    </div>
  )
}

function GroupSection({
  group,
  selectedPath,
  searching,
  onSelect,
}: {
  group: DocGroup
  selectedPath: string
  searching: boolean
  onSelect: (path: string) => void
}) {
  const containsSelected = group.files.some((f) => f.path === selectedPath)
  const [toggled, setOpen] = useState(containsSelected)
  // Every group with a match opens while searching.
  const open = searching || toggled

  const folders = useMemo(() => {
    const byFolder = new Map<string, DocFile[]>()
    for (const file of group.files) {
      byFolder.set(file.folder, [...(byFolder.get(file.folder) ?? []), file])
    }
    return [...byFolder.entries()].map(([folder, items]) => ({ folder, items }))
  }, [group.files])

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-accent/50">
        <ChevronRightIcon
          className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")}
        />
        <span className="min-w-0 flex-1 truncate">{group.label}</span>
        <span className="text-xs font-normal text-muted-foreground">{group.files.length}</span>
      </button>

      <Collapse open={open}>
        <div className="ml-3.5 space-y-1 border-l border-dashed pb-1 pl-2">
          {folders.map((section) => (
            <div
              key={section.folder}
              className="space-y-0.5 border-b border-dashed pb-1 last:border-b-0">
              {section.items.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onSelect(item.path)}
                  className={cn(
                    "w-full truncate rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/50",
                    item.path === selectedPath && "bg-green-600/10 text-green-600 hover:bg-green-600/10 hover:text-green-600 font-medium",
                  )}
                  title={item.path}>
                  <Highlight text={`${section.folder ? `${section.folder} / ` : ""}${item.title}`} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  )
}

const REPOS: RepoKey[] = ["frontend", "backend"]

export function DocsTab({ groups }: { groups: DocGroup[] }) {
  const allFiles = useMemo(() => groups.flatMap((g) => g.files), [groups])
  const [selected, setSelected] = useState<string | null>(allFiles[0]?.path ?? null)
  const [listVisible, setListVisible] = useState(false)
  const [keyword, setKeyword] = useState("")

  const shownGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          files: group.files.filter((f) =>
            matchesQuery(keyword, [f.title, f.folder, group.label, REPO_LABEL[f.repo]]),
          ),
        }))
        .filter((group) => group.files.length > 0),
    [groups, keyword],
  )

  const file = allFiles.find((f) => f.path === selected) ?? allFiles[0]

  if (!file) {
    return (
      <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
        No documents yet. Add Markdown files to <code>docs/</code> in Finnaux2.0-UI or Finnaux2.0-API.
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4", listVisible && "md:grid-cols-[20rem_1fr]")}>
      {listVisible && (
        <aside className="space-y-1 md:sticky border-r pr-4 md:top-2 md:max-h-[calc(100dvh-1rem)] md:self-start md:overflow-y-auto">
          <SearchBox value={keyword} onChange={setKeyword} placeholder="Search documents" />
          <SearchHighlightProvider query={keyword}>
            {shownGroups.length === 0 && (
              <p className="p-4 text-center text-xs text-muted-foreground">No documents match.</p>
            )}
            {REPOS.filter((repo) => shownGroups.some((g) => g.repo === repo)).map((repo) => (
              <div key={repo} className="space-y-1 pb-2">
                <p className="flex items-center justify-between px-2 pb-1 pt-2 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                  {REPO_LABEL[repo]}
                  <span className="font-normal normal-case">
                    {shownGroups.filter((g) => g.repo === repo).reduce((sum, g) => sum + g.files.length, 0)}
                  </span>
                </p>
                {shownGroups
                  .filter((group) => group.repo === repo)
                  .map((group) => (
                    <GroupSection
                      key={group.key}
                      group={group}
                      selectedPath={file.path}
                      searching={!!keyword.trim()}
                      onSelect={setSelected}
                    />
                  ))}
              </div>
            ))}
          </SearchHighlightProvider>
        </aside>
      )}

      <DocViewer
        key={file.path}
        file={file}
        allFiles={allFiles}
        onSelect={setSelected}
        listVisible={listVisible}
        onToggleList={() => setListVisible((value) => !value)}
      />
    </div>
  )
}

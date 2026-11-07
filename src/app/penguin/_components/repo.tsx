"use client"

import { cn } from "@/lib/utils"
import { NextTabs } from "./penguin-tabs"
import type { RepoKey } from "../_lib/types"

export const REPO_LABEL: Record<RepoKey, string> = { frontend: "Frontend", backend: "Backend" }

const REPO_STYLE: Record<RepoKey, string> = {
  frontend: "bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  backend: "bg-pink-600/10 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300",
}

export function RepoBadge({ repo, className }: { repo: RepoKey; className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-sm px-2 py-1.5 text-[11px] font-medium leading-none",
        REPO_STYLE[repo],
        className,
      )}>
      {REPO_LABEL[repo]}
    </span>
  )
}

export type RepoFilterValue = RepoKey | "all"

export function RepoFilter({
  value,
  onChange,
  counts,
}: {
  value: RepoFilterValue
  onChange: (value: RepoFilterValue) => void
  counts?: Partial<Record<RepoFilterValue, number>>
}) {
  const options: RepoFilterValue[] = ["all", "frontend", "backend"]
  return (
    <NextTabs
      value={value}
      onValueChange={(next) => onChange(next as RepoFilterValue)}
      shouldPersist={false}
      delayTabs={false}
      tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
      tabs={options.map((option) => ({
        value: option,
        label: `${option === "all" ? "All" : REPO_LABEL[option]}${
          counts?.[option] !== undefined ? ` (${counts[option]})` : ""
        }`,
        component: null,
      }))}
    />
  )
}

export function countByRepo<T extends { repo: RepoKey }>(items: T[]) {
  return {
    all: items.length,
    frontend: items.filter((item) => item.repo === "frontend").length,
    backend: items.filter((item) => item.repo === "backend").length,
  }
}

export const filterByRepo = <T extends { repo: RepoKey }>(items: T[], value: RepoFilterValue) =>
  value === "all" ? items : items.filter((item) => item.repo === value)

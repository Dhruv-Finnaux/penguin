"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  BadgeAlertIcon,
  BadgeCheckIcon,
  BadgeInfoIcon,
  CheckIcon,
  ClockIcon,
  RotateCcwIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { dayLabel } from "../_lib/day-label"
import { matchesQuery } from "../_lib/fuzzy"
import type { TodoItem, TodoStatus } from "../_lib/types"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { NextTabs } from "./penguin-tabs"
import { SearchBox } from "./search-box"
import { TimeLabel } from "./time-label"

type StatusFilterValue = TodoStatus | "all"

const STATE: Record<
  TodoStatus,
  { label: string; icon: LucideIcon; dot: string; bg: string; fill: string; text: string }
> = {
  todo: { label: "Todo", icon: BadgeAlertIcon, dot: "bg-amber-400", bg: "bg-amber-600/10", fill: "fill-amber-400", text: "text-amber-600" },
  done: { label: "Done", icon: BadgeCheckIcon, dot: "bg-green-600", bg: "bg-green-600/10", fill: "fill-green-600", text: "text-green-600" },
  future: { label: "Future", icon: BadgeInfoIcon, dot: "bg-blue-600", bg: "bg-blue-600/10", fill: "fill-blue-600", text: "text-blue-600" },
}

const STATUSES: TodoStatus[] = ["todo", "done", "future"]

const TEXTAREA =
  "border-black/20 focus-visible:border-black/20 focus-visible:ring-0 dark:border-white/20 dark:focus-visible:border-white/20 bg-white hover:bg-white"

async function send(method: string, body: object) {
  const res = await fetch("/penguin/api/todos", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? "Could not update the todo")
}

function StatusBadge({ status }: { status: TodoStatus }) {
  const state = STATE[status]
  return (
    <span title={state.label} className="shrink-0">
      <state.icon className={cn("size-6 text-white dark:text-black", state.fill)} />
    </span>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md disabled:opacity-50",
        className,
      )}>
      {children}
    </button>
  )
}

function TodoCard({
  item,
  busy,
  onChange,
  onDelete,
}: {
  item: TodoItem
  busy: boolean
  onChange: (status: TodoStatus) => void
  onDelete: () => void
}) {
  const done = item.status === "done"
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 pl-3">
        <StatusBadge status={item.status} />
        <code className="shrink-0 text-xs font-medium">
          <TimeLabel iso={item.createdAt} />
        </code>
        <span className={cn("shrink-0 text-xs font-medium", STATE[item.status].text)}>
          {STATE[item.status].label}
        </span>
        {done && item.doneAt && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <CheckIcon className="size-3" />
            <TimeLabel iso={item.doneAt} />
          </span>
        )}
        <span className="ml-auto flex shrink-0 items-center gap-1">
          {done ? (
            <IconButton label="Move back to Todo" disabled={busy} onClick={() => onChange("todo")}>
              <RotateCcwIcon className="size-3.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white" />
            </IconButton>
          ) : (
            <IconButton label="Mark as done" disabled={busy} onClick={() => onChange("done")}>
              <CheckIcon className="size-3.5 text-green-600" />
            </IconButton>
          )}
          {item.status !== "future" && (
            <IconButton label="Move to Future" disabled={busy} onClick={() => onChange("future")}>
              <ClockIcon className="size-3.5 text-blue-600" />
            </IconButton>
          )}
          {item.status === "future" && (
            <IconButton label="Move to Todo" disabled={busy} onClick={() => onChange("todo")}>
              <RotateCcwIcon className="size-3.5 text-amber-600" />
            </IconButton>
          )}
          <IconButton label="Delete" disabled={busy} onClick={onDelete} className="hover:bg-red-600/10">
            <Trash2Icon className="size-3.5 text-red-600" />
          </IconButton>
        </span>
      </div>
      <p
        className={cn(
          "whitespace-pre-wrap break-words border-t px-4 py-3 text-sm",
          done && "text-muted-foreground line-through",
        )}>
        <Highlight text={item.text} />
      </p>
    </div>
  )
}

function StatusFilter({
  value,
  onChange,
  counts,
}: {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
  counts: Record<StatusFilterValue, number>
}) {
  const options: StatusFilterValue[] = ["all", ...STATUSES]
  return (
    <NextTabs
      value={value}
      onValueChange={(next) => onChange(next as StatusFilterValue)}
      shouldPersist={false}
      delayTabs={false}
      tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
      tabs={options.map((option) => ({
        value: option,
        label: `${option === "all" ? "All" : STATE[option].label} (${counts[option]})`,
        component: null,
      }))}
    />
  )
}

export function TodosTab() {
  const client = useQueryClient()
  const [filter, setFilter] = useState<StatusFilterValue>("all")
  const [keyword, setKeyword] = useState("")
  const [text, setText] = useState("")
  const [status, setStatus] = useState<TodoStatus>("todo")
  const query = useQuery({
    queryKey: ["todos"],
    queryFn: async (): Promise<TodoItem[]> => (await (await fetch("/penguin/api/todos")).json()).todos,
  })
  const mutation = useMutation({
    mutationFn: ({ method, body }: { method: string; body: object }) => send(method, body),
    onSuccess: () => client.invalidateQueries({ queryKey: ["todos"] }),
    onError: (error) => toast.error(error.message),
  })

  const all = useMemo(() => query.data ?? [], [query.data])
  const counts = useMemo(
    () => ({
      all: all.length,
      todo: all.filter((i) => i.status === "todo").length,
      done: all.filter((i) => i.status === "done").length,
      future: all.filter((i) => i.status === "future").length,
    }),
    [all],
  )

  const days = useMemo(() => {
    const byDay = new Map<string, TodoItem[]>()
    for (const item of all) {
      if (filter !== "all" && item.status !== filter) continue
      if (keyword.trim() && !matchesQuery(keyword, [item.text, item.status])) continue
      const day = dayLabel(item.createdAt)
      byDay.set(day, [...(byDay.get(day) ?? []), item])
    }
    return [...byDay.entries()].map(([day, items]) => ({ day, items }))
  }, [all, filter, keyword])

  const add = () => {
    if (!text.trim()) return
    mutation.mutate({ method: "POST", body: { text, status } }, { onSuccess: () => setText("") })
  }

  return (
    <SearchHighlightProvider query={keyword}>
      <div className="space-y-4">
        <div className="space-y-2 rounded-xl border bg-card p-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add()
            }}
            placeholder="Add a todo"
            className={TEXTAREA}
          />
          <div className="flex flex-wrap items-center gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
                  STATE[s].text,
                  status === s && "font-medium" && STATE[s].bg
                )}>
                <span className={cn("size-2 rounded-full", STATE[s].dot)} />
                {STATE[s].label}
              </button>
            ))}
            <Button size="sm" className="ml-auto" disabled={!text.trim() || mutation.isPending} onClick={add}>
              Add todo
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusFilter value={filter} onChange={setFilter} counts={counts} />
          <div className="min-w-64 flex-1">
            <SearchBox value={keyword} onChange={setKeyword} placeholder="Search todos" />
          </div>
        </div>

        {days.length === 0 ? (
          <div className="p-20 text-center text-sm text-muted-foreground">
            {query.isLoading
              ? "Loading"
              : keyword.trim() || filter !== "all"
                ? "No todos match."
                : "No todos yet. Add one above."}
          </div>
        ) : (
          <ol>
            {days.map((day, dayIndex) => (
              <li
                key={day.day}
                className={cn(
                  "relative grid gap-x-4 md:grid-cols-[9rem_1fr]",
                  dayIndex > 0 &&
                  "before:absolute before:inset-x-0 before:-top-3 before:border-t before:border-dashed before:border-border dark:before:border-white/50",
                )}>
                <div className="pb-2 md:sticky md:top-2 md:self-start md:pb-0 md:pt-2.5 md:text-right">
                  <h2 className="text-xs font-semibold text-black/50 dark:text-white/50">{day.day}</h2>
                  <p className="text-xs text-muted-foreground">
                    {day.items.length} {day.items.length === 1 ? "todo" : "todos"}
                  </p>
                </div>
                <div className="relative pb-6">
                  <ol className="space-y-3">
                    {day.items.map((item, itemIndex) => {
                      const isFirst = dayIndex === 0 && itemIndex === 0
                      const isLast = dayIndex === days.length - 1 && itemIndex === day.items.length - 1
                      const endsDay = itemIndex === day.items.length - 1

                      return (
                        <li key={item.id} className="relative pl-8">
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
                              STATE[item.status].dot,
                            )}
                          />
                          <TodoCard
                            item={item}
                            busy={mutation.isPending}
                            onChange={(next) =>
                              mutation.mutate({ method: "PATCH", body: { id: item.id, status: next } })
                            }
                            onDelete={() => mutation.mutate({ method: "DELETE", body: { id: item.id } })}
                          />
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </SearchHighlightProvider>
  )
}

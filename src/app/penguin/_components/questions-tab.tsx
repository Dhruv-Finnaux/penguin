"use client"

import { NextTabs } from "./penguin-tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { CheckIcon, StarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { matchesQuery } from "../_lib/fuzzy"
import type { QuestionItem, QuestionKind, QuestionPriority } from "../_lib/types"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { MarkdownView } from "./markdown-view"
import { SearchBox } from "./search-box"

type Filter = "all" | "open" | "answered"
type PriorityFilter = "all" | QuestionPriority

const SAVE_BUTTON =
  "bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white"
const EDIT_BUTTON =
  "bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white"
const DELETE_BUTTON =
  "bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white"
const CANCEL_BUTTON =
  "bg-gray-600/10 text-gray-600 hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-white"

const PRIORITIES: {
  value: QuestionPriority
  label: string
  stars: number
  text: string
  active: string
}[] = [
  { value: "P0", label: "Blocker", stars: 4, text: "text-red-600 dark:text-red-400", active: "bg-red-600/15" },
  { value: "P1", label: "High", stars: 3, text: "text-orange-500", active: "bg-orange-500/15" },
  { value: "P2", label: "Medium", stars: 2, text: "text-amber-500", active: "bg-amber-400/20" },
  { value: "P3", label: "Low", stars: 1, text: "text-green-600 dark:text-green-400", active: "bg-green-600/15" },
]

const TEXTAREA =
  "border-black/20 focus-visible:border-black/20 focus-visible:ring-0 dark:border-white/20 dark:focus-visible:border-white/20 bg-white hover:bg-white"

const DEFAULT_PRIORITY: QuestionPriority = "P2"

function Stars({ priority }: { priority: (typeof PRIORITIES)[number] }) {
  return (
    <span className={cn("inline-flex items-center", priority.text)}>
      {Array.from({ length: priority.stars }, (_, i) => (
        <StarIcon key={i} className="size-3.5 fill-current" />
      ))}
    </span>
  )
}

function PriorityTag({ item }: { item: QuestionItem }) {
  const priority = PRIORITIES.find((p) => p.value === item.priority)
  if (!priority) return null

  return (
    <span
      role="img"
      aria-label={`${priority.label} priority`}
      title={item.code ? `${priority.label} (${item.code})` : priority.label}>
      <Stars priority={priority} />
    </span>
  )
}

function PriorityPicker({
  value,
  onChange,
}: {
  value: QuestionPriority
  onChange: (value: QuestionPriority) => void
}) {
  return (
    <div role="radiogroup" aria-label="Priority" className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-muted-foreground">Priority</span>
      {PRIORITIES.map((p) => (
        <button
          key={p.value}
          type="button"
          role="radio"
          aria-checked={value === p.value}
          aria-label={p.label}
          title={p.label}
          onClick={() => onChange(p.value)}
          className={cn(
            "rounded-md px-2 py-1 transition-colors duration-150",
            value === p.value ? cn(p.active, p.text) : "border-transparent opacity-50 hover:opacity-100",
          )}>
          <Stars priority={p} />
        </button>
      ))}
    </div>
  )
}

interface Change {
  method: "POST" | "PATCH" | "DELETE"
  body: Record<string, unknown>
}

function useQuestionChange(kind: QuestionKind) {
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()

  const mutation = useMutation({
    mutationFn: async (change: Change) => {
      const res = await fetch("/penguin/api/questions", {
        method: change.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...change.body }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.message ?? "Could not save the change")
    },
    onSuccess: () => startTransition(() => router.refresh()),
    onError: (error) => toast.error(error.message),
  })

  return { change: mutation.mutateAsync, busy: mutation.isPending || isRefreshing }
}

function AddQuestion({ kind }: { kind: QuestionKind }) {
  const { change, busy } = useQuestionChange(kind)
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<QuestionPriority>(DEFAULT_PRIORITY)

  const submit = async () => {
    if (!text.trim() || busy) return
    try {
      await change({ method: "POST", body: { question: text, priority } })
      setText("")
    } catch {
      return
    }
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-3">
      <Textarea
        value={text}
        rows={2}
        className={TEXTAREA}
        placeholder={`Add a ${kind} question`}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            void submit()
          }
        }}
      />
      <PriorityPicker value={priority} onChange={setPriority} />
      <div className="flex items-center justify-between gap-2">
        <Button
          size="sm"
          className={SAVE_BUTTON}
          disabled={!text.trim() || busy}
          onClick={() => void submit()}
        >
          Add Question
        </Button>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-black/10 bg-neutral-100 px-1.5 font-mono text-[10px] font-medium text-neutral-600 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
            <span className="text-xs">⌘</span>
          </kbd>
          <span className="text-neutral-400 dark:text-neutral-600">+</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-black/10 bg-neutral-100 px-1.5 font-mono text-[10px] font-medium text-neutral-600 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
            Enter
          </kbd>
          <span className="ml-1">to add</span>
        </span>
      </div>
    </div>
  )
}

function QuestionCard({ kind, item }: { kind: QuestionKind; item: QuestionItem }) {
  const { change, busy } = useQuestionChange(kind)
  const [editingAnswer, setEditingAnswer] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(false)
  const [answer, setAnswer] = useState(item.answer)
  const [question, setQuestion] = useState(item.question)
  const [priority, setPriority] = useState<QuestionPriority>(item.priority ?? DEFAULT_PRIORITY)

  const save = async (body: Record<string, unknown>, done: () => void) => {
    try {
      await change({ method: "PATCH", body: { id: item.id, ...body } })
      done()
    } catch {
      return
    }
  }

  const remove = async () => {
    if (!window.confirm("Delete this question?")) return
    try {
      await change({ method: "DELETE", body: { id: item.id } })
    } catch {
      return
    }
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={item.answered}
          aria-label={item.answered ? "Mark as not answered" : "Mark as answered"}
          disabled={busy}
          onClick={() => void save({ answered: !item.answered }, () => undefined)}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 disabled:opacity-50",
            item.answered
              ? "border-green-600 bg-green-600 text-white"
              : "border-muted-foreground/40 hover:border-green-600",
          )}>
          {item.answered && <CheckIcon className="size-3" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityTag item={item} />
            {item.category && (
              <span className="text-xs text-muted-foreground">
                <Highlight text={item.category} />
              </span>
            )}
          </div>

          {editingQuestion ? (
            <div className="space-y-2">
              <Textarea
                value={question}
                rows={3}
                className={TEXTAREA}
                placeholder="Write the question"
                onChange={(e) => setQuestion(e.target.value)} />
              <PriorityPicker value={priority} onChange={setPriority} />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={SAVE_BUTTON}
                  disabled={!question.trim() || busy}
                  onClick={() => void save({ question, priority }, () => setEditingQuestion(false))}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={CANCEL_BUTTON}
                  onClick={() => {
                    setQuestion(item.question)
                    setPriority(item.priority ?? DEFAULT_PRIORITY)
                    setEditingQuestion(false)
                  }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn(item.answered && "text-muted-foreground")}>
              <QuestionText text={item.question} />
            </div>
          )}
        </div>

        {!editingQuestion && (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              aria-label="Edit question"
              title="Edit question"
              className={cn("px-2 py-1", EDIT_BUTTON)}
              onClick={() => setEditingQuestion(true)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              aria-label="Delete question"
              title="Delete question"
              className={cn("px-2 py-1", DELETE_BUTTON)}
              disabled={busy}
              onClick={() => void remove()}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="ml-8 space-y-2">
        {editingAnswer ? (
          <>
            <Textarea
              value={answer}
              rows={4}
              autoFocus
              placeholder="Write the answer"
              className={TEXTAREA}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className={SAVE_BUTTON}
                disabled={busy}
                onClick={() => void save({ answer }, () => setEditingAnswer(false))}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={CANCEL_BUTTON}
                onClick={() => {
                  setAnswer(item.answer)
                  setEditingAnswer(false)
                }}>
                Cancel
              </Button>
            </div>
          </>
        ) : item.answer ? (
          <div className="space-y-1">
            <p className="whitespace-pre-wrap text-sm">{item.answer}</p>
            <Button
              size="sm"
              variant="ghost"
              className={EDIT_BUTTON}
              onClick={() => setEditingAnswer(true)}>
              Edit Answer
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className={SAVE_BUTTON}
            onClick={() => setEditingAnswer(true)}>
            Write Answer
          </Button>
        )}
      </div>
    </div>
  )
}

function QuestionText({ text }: { text: string }) {
  return <MarkdownView source={text} />
}

function QuestionList({ kind, items }: { kind: QuestionKind; items: QuestionItem[] }) {
  const [keyword, setKeyword] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")

  const answered = items.filter((i) => i.answered).length

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (filter === "open" && item.answered) return false
        if (filter === "answered" && !item.answered) return false
        if (priorityFilter !== "all" && item.priority !== priorityFilter) return false
        if (!keyword.trim()) return true
        return matchesQuery(keyword, [item.code ?? "", item.category, item.question, item.answer])
      }),
    [items, filter, priorityFilter, keyword],
  )

  return (
    <SearchHighlightProvider query={keyword}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm">
            <span className="text-lg font-semibold text-green-600">{answered}</span>
            <span className="text-muted-foreground"> of {items.length} answered</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <NextTabs
              value={filter}
              onValueChange={(next) => setFilter(next as Filter)}
              shouldPersist={false}
              delayTabs={false}
              tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
              tabs={[
                { value: "all", label: "All", component: null },
                { value: "open", label: "Open", component: null },
                { value: "answered", label: "Answered", component: null },
              ]}
            />
            <NextTabs
              value={priorityFilter}
              onValueChange={(next) => setPriorityFilter(next as PriorityFilter)}
              shouldPersist={false}
              delayTabs={false}
              tabsClassNames={{ base: "flex-none p-0", panel: "hidden" }}
              tabs={[
                { value: "all", label: "All", component: null },
                { value: "P0", label: "Blocker", component: null },
                { value: "P1", label: "High", component: null },
                { value: "P2", label: "Medium", component: null },
                { value: "P3", label: "Low", component: null },
              ]}
            />
          </div>
        </div>

        <AddQuestion kind={kind} />
        <SearchBox value={keyword} onChange={setKeyword} />

        {items.length === 0 ? (
          <div className="p-20 text-center text-sm text-muted-foreground">
            No {kind} questions yet. Add the first one above.
          </div>
        ) : visible.length === 0 ? (
          <div className="p-20 text-center text-sm text-muted-foreground">
            No questions match.
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map((item) => (
              <QuestionCard key={`${item.id}-${item.updatedAt}`} kind={kind} item={item} />
            ))}
          </div>
        )}
      </div>
    </SearchHighlightProvider>
  )
}

export function QuestionsTab({
  frontend,
  backend,
}: {
  frontend: QuestionItem[]
  backend: QuestionItem[]
}) {
  return (
    <NextTabs
      defaultValue="frontend"
      persistKey="questions_tab"
      delayTabs={false}
      tabsClassNames={{ base: "p-0", panel: "mt-4" }}
      tabs={[
        {
          value: "frontend",
          label: `Frontend (${frontend.filter((q) => q.answered).length}/${frontend.length})`,
          component: <QuestionList kind="frontend" items={frontend} />,
        },
        {
          value: "backend",
          label: `Backend (${backend.filter((q) => q.answered).length}/${backend.length})`,
          component: <QuestionList kind="backend" items={backend} />,
        },
      ]}
    />
  )
}

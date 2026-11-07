"use client"

import { cn } from "@/lib/utils"
import { CopyHash } from "./copy-hash"
import { CopyPath } from "./copy-path"
import { Highlight } from "./highlight"
import { useMutation } from "@tanstack/react-query"
import {
  AlertTriangleIcon,
  BadgeAlertIcon,
  BadgeCheckIcon,
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  MinusCircleIcon,
  MinusIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import type { ReviewFinding, Severity } from "../_lib/types"

export type Priority = "high" | "medium" | "low"

export const PRIORITY_ORDER: Priority[] = ["high", "medium", "low"]

export const PRIORITY_STYLE: Record<Priority, { label: string; text: string; dot: string }> = {
  high: { label: "High", text: "text-red-500", dot: "bg-red-500" },
  medium: { label: "Medium", text: "text-orange-400", dot: "bg-amber-500" },
  low: { label: "Low", text: "text-green-600", dot: "bg-green-600" },
}

export function priorityOf(severity: Severity): Priority {
  if (severity === "P0" || severity === "P1") return "high"
  if (severity === "P2") return "medium"
  return "low"
}

export const isResolved = (finding: ReviewFinding) => finding.status === "resolved"
export const isOptional = (finding: ReviewFinding) => finding.optional

export function topPriority(findings: ReviewFinding[]): Priority | null {
  const open = findings.filter((f) => !isResolved(f))
  return PRIORITY_ORDER.find((p) => open.some((f) => priorityOf(f.severity) === p)) ?? null
}

export const DOT_CLEAR = "bg-blue-600"
export const DOT_UNTOUCHED = "border-0 bg-muted-foreground/40"

export function statusDot(priorities: Priority[] | null) {
  if (priorities === null) return DOT_UNTOUCHED
  const top = PRIORITY_ORDER.find((p) => priorities.includes(p))
  return top ? PRIORITY_STYLE[top].dot : DOT_CLEAR
}

// A finding marked resolved that a later review found still in the code is not fixed.
const stillOpen = (finding: ReviewFinding) => !isResolved(finding) || (finding.needsAttention && !finding.confirmed)

export function timelineDot(findings: ReviewFinding[] | null) {
  return statusDot(findings ? findings.filter(stillOpen).map((f) => priorityOf(f.severity)) : null)
}

export function sortFindings(findings: ReviewFinding[]) {
  return [...findings].sort((a, b) => {
    if (isResolved(a) !== isResolved(b)) return isResolved(a) ? 1 : -1
    return PRIORITY_ORDER.indexOf(priorityOf(a.severity)) - PRIORITY_ORDER.indexOf(priorityOf(b.severity))
  })
}

export function countByPriority(findings: ReviewFinding[]) {
  const counts: Record<Priority, number> = { high: 0, medium: 0, low: 0 }
  for (const finding of findings) {
    if (!isResolved(finding) && !isOptional(finding)) counts[priorityOf(finding.severity)]++
  }
  return counts
}

export const needsAttention = (finding: ReviewFinding) =>
  isResolved(finding) && finding.needsAttention && !finding.confirmed

// Full class names, so Tailwind generates them. Blue: nothing left. Green, amber, red: the worst
// finding still open is low, medium or high.
const TICK_FILL: Record<Priority | "clear", string> = {
  high: "fill-red-500",
  medium: "fill-amber-500",
  low: "fill-green-600",
  clear: "fill-blue-600",
}

export function StatusTick({ findings }: { findings: ReviewFinding[] }) {
  const top = PRIORITY_ORDER.find((p) => open.includes(p)) ?? "clear"
  if (top === "clear") return
  const open = findings.filter(stillOpen).map((f) => priorityOf(f.severity))
  const label = `Worst open finding: ${PRIORITY_STYLE[top].label}`
  return (
    <span title={label}>
      <BadgeCheckIcon className={cn("size-6 text-white dark:text-black", TICK_FILL[top])} />
    </span>
  )
}

export function countAttention(findings: ReviewFinding[]) {
  return findings.filter(needsAttention).length
}

// Optional findings still waiting; a resolved one is already counted as resolved.
export function countOptional(findings: ReviewFinding[]) {
  return findings.filter((finding) => isOptional(finding) && !isResolved(finding)).length
}

export function countResolved(findings: ReviewFinding[]) {
  return findings.filter(isResolved).length
}

export function PriorityLabel({ priority, className }: { priority: Priority; className?: string }) {
  const style = PRIORITY_STYLE[priority]

  const getLabel = (p: Priority) => {
    const lower = String(p).toLowerCase()
    if (lower === "low") return "Low"
    else if (lower === "medium") return "Medium"
    else if (lower === "high") return "High"
    return String(p)
  }

  return (
    <span className={cn("flex items-center gap-1.5 font-medium", style.text, className)}>
      <span className={cn("size-2 rounded-full", style.dot)} />
      <div className="text-black/60 dark:text-white/60">{getLabel(priority)}</div>
    </span>
  )
}

export function PriorityCounts({
  counts,
  resolved = 0,
  attention = 0,
  optional = 0,
}: {
  counts: Record<Priority, number>
  resolved?: number
  attention?: number
  optional?: number
}) {
  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
      {PRIORITY_ORDER.map((priority) =>
        counts[priority] > 0 ? (
          <span key={priority} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", PRIORITY_STYLE[priority].dot)} />
            <span className="font-medium">{counts[priority]}</span>
          </span>
        ) : null,
      )}
      {resolved > 0 && (
        <span className="flex items-center gap-1.5">
          <BadgeCheckIcon className="size-6 text-white dark:text-black fill-green-600" />
          <span className="font-medium">{resolved}</span>
          <span className="text-muted-foreground">Resolved</span>
        </span>
      )}
      {optional > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-white">
            <MinusIcon className="size-3" strokeWidth={3} />
          </span>
          <span className="font-medium">{optional}</span>
          <span className="text-muted-foreground">Optional</span>
        </span>
      )}
      {attention > 0 && (
        <span className="flex items-center gap-1.5">
          <BadgeAlertIcon className="size-6 fill-amber-500 text-white" />
          <span className="font-medium">{attention}</span>
          <span className="text-muted-foreground">Warning</span>
        </span>
      )}
    </span>
  )
}

function ConfirmButton({ reviewFile, finding }: { reviewFile: string; finding: ReviewFinding }) {
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()

  const mutation = useMutation({
    mutationFn: async () => {
      const note = window.prompt("Why is this fine? (saved with the finding)", "Confirmed by me")
      if (note === null) return false
      const res = await fetch("/penguin/api/finding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reviewFile, id: finding.id, confirm: true, note }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.message ?? "Could not confirm the finding")
      return true
    },
    onSuccess: (done) => {
      if (done) startTransition(() => router.refresh())
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <button
      type="button"
      disabled={mutation.isPending || isRefreshing}
      onClick={() => mutation.mutate()}
      className="ml-1 shrink-0 rounded border border-amber-400/60 px-1.5 py-0.5 text-[11px] font-medium text-amber-500 hover:bg-amber-400/10 disabled:opacity-50">
      Confirm and proceed
    </button>
  )
}

// Keeps a finding in the list but out of what still has to be fixed.
function OptionalToggle({ reviewFile, finding }: { reviewFile: string; finding: ReviewFinding }) {
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()
  const optional = isOptional(finding)

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/penguin/api/finding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reviewFile, id: finding.id, optional: !optional }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.message ?? "Could not update the finding")
    },
    onSuccess: () => startTransition(() => router.refresh()),
    onError: (error) => toast.error(error.message),
  })

  return (
    <button
      type="button"
      aria-pressed={optional}
      title={
        optional
          ? "Optional: not needed for future resolution. Click to require it again"
          : "Make optional for future resolution"
      }
      aria-label={optional ? "Make this finding required again" : "Make this finding optional"}
      disabled={mutation.isPending || isRefreshing}
      onClick={() => mutation.mutate()}
      className={cn(
        "flex size-6 cursor-pointer items-center justify-center rounded-md hover:bg-accent disabled:opacity-50",
        optional
          ? "bg-accent text-foreground"
          : "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white",
      )}>
      <MinusCircleIcon className="size-3.5" />
    </button>
  )
}

function ResolveToggle({ reviewFile, finding }: { reviewFile: string; finding: ReviewFinding }) {
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()
  const resolved = isResolved(finding)
  const optional = isOptional(finding)

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/penguin/api/finding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reviewFile, id: finding.id, resolved: !resolved }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.message ?? "Could not update the finding")
    },
    onSuccess: () => startTransition(() => router.refresh()),
    onError: (error) => toast.error(error.message),
  })

  const busy = mutation.isPending || isRefreshing

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={resolved}
      aria-label={resolved ? "Mark as open" : "Mark as resolved"}
      title={optional ? "Optional: not needed for future resolution" : undefined}
      disabled={busy}
      onClick={() => mutation.mutate()}
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 disabled:opacity-50",
        resolved
          ? "border-green-600 bg-green-600 text-white"
          : optional
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-muted-foreground/40 hover:border-green-600",
      )}>
      {resolved ? (
        <CheckIcon className="size-3" strokeWidth={3} />
      ) : (
        optional && <MinusIcon className="size-3" strokeWidth={3} />
      )}
    </button>
  )
}

const statusLabel = (f: ReviewFinding) => (isResolved(f) ? "Resolved" : PRIORITY_STYLE[priorityOf(f.severity)].label)

const resolvedText = (f: ReviewFinding) =>
  `Resolved${f.resolvedIn ? ` in ${f.resolvedIn.slice(0, 7)}` : " in uncommitted changes"}${f.resolvedNote ? `: ${f.resolvedNote}` : ""}`

function findingMarkdown(f: ReviewFinding) {
  return [
    `### [${statusLabel(f)}] ${f.title}`,
    "",
    `- **Location:** \`${f.location}\``,
    f.problem ? `- **Problem:** ${f.problem}` : null,
    f.impact ? `- **Impact:** ${f.impact}` : null,
    `- **${isResolved(f) ? "Status" : "Fix"}:** ${isResolved(f) ? resolvedText(f) : f.fix}`,
  ]
    .filter((line) => line !== null)
    .join("\n")
}

function findingText(f: ReviewFinding) {
  return [
    `[${statusLabel(f)}] ${f.title}`,
    `Location: ${f.location}`,
    f.problem && `Problem: ${f.problem}`,
    f.impact && `Impact: ${f.impact}`,
    isResolved(f) ? resolvedText(f) : `Fix: ${f.fix}`,
  ]
    .filter(Boolean)
    .join("\n")
}

function FindingCopy({ finding, reviewFile }: { finding: ReviewFinding; reviewFile: string }) {
  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`Copied as ${what}`)
    } catch {
      toast.error("Could not copy the finding")
    }
  }
  const button =
    "flex size-6 cursor-pointer items-center justify-center rounded-md text-black/40 hover:bg-accent hover:text-black dark:text-white/40 dark:hover:text-white"
  return (
    <div className="flex shrink-0 gap-0.5">
      <button
        type="button"
        title="Copy as Markdown"
        aria-label="Copy finding as Markdown"
        className={button}
        onClick={() => void copy(findingMarkdown(finding), "Markdown")}>
        <CopyIcon className="size-3.5" />
      </button>
      <button
        type="button"
        title="Copy as text"
        aria-label="Copy finding as text"
        className={button}
        onClick={() => void copy(findingText(finding), "text")}>
        <FileTextIcon className="size-3.5" />
      </button>
      <OptionalToggle reviewFile={reviewFile} finding={finding} />
    </div>
  )
}

export function FindingsTable({
  findings,
  reviewFile,
  startIndex = 1,
  fileFor,
}: {
  findings: ReviewFinding[]
  reviewFile: string
  startIndex?: number
  fileFor?: (finding: ReviewFinding) => string
  sourceOf?: (finding: ReviewFinding) => React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead>
          <tr className="divide-x border-b text-xs text-muted-foreground">
            <th className="w-12 px-4 py-2 font-medium">#</th>
            <th className="w-28 px-4 py-2 font-medium">Priority</th>
            <th className="px-4 py-2 font-medium">Finding</th>
            <th className="px-4 py-2 font-medium">Location</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((finding, i) => (
            <tr
              key={`${fileFor?.(finding) ?? ""}${finding.id}`}
              className="divide-x border-t align-top first:border-t-0">
              <td className="px-4 py-3 text-muted-foreground">{startIndex + i}</td>
              <td className="px-4 py-3">
                <PriorityLabel priority={priorityOf(finding.severity)} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <ResolveToggle reviewFile={fileFor?.(finding) ?? reviewFile} finding={finding} />
                  <div className="min-w-0">
                    <p className={cn("font-medium", isResolved(finding) && "text-muted-foreground line-through")}>
                      {finding.title}
                    </p>
                    {isResolved(finding) ? (
                      <p className="text-xs text-green-600">
                        Resolved in{" "}
                        {finding.resolvedIn ? (
                          <CopyHash hash={finding.resolvedIn} className="rounded bg-green-600/10 px-1 py-0.5" />
                        ) : (
                          "uncommitted changes"
                        )}
                        {finding.resolvedNote ? `: ${finding.resolvedNote}` : ""}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">{finding.fix}</p>
                    )}
                    {needsAttention(finding) && (
                      <p className="mt-1 flex items-start gap-1.5 text-xs text-amber-400">
                        <AlertTriangleIcon className="mt-0.5 size-3 shrink-0" />
                        <span>
                          Marked resolved, but still needs attention
                          {finding.attentionNote ? `: ${finding.attentionNote}` : ""}
                        </span>
                        <ConfirmButton reviewFile={fileFor?.(finding) ?? reviewFile} finding={finding} />
                      </p>
                    )}
                    {finding.confirmed && (
                      <p className="mt-1 text-xs text-blue-500">
                        Confirmed manually{finding.confirmedNote ? `: ${finding.confirmedNote}` : ""}
                      </p>
                    )}
                  </div>
                  <FindingCopy finding={finding} reviewFile={fileFor?.(finding) ?? reviewFile} />
                </div>
              </td>
              <td className="px-4 py-3">
                <CopyPath path={finding.location} className="text-muted-foreground">
                  <Highlight text={finding.location} />
                </CopyPath>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

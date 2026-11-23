import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FileChange, Quality, Severity, Status, Verdict } from "../_lib/types"

export const STATUS_LABEL: Record<Status, string> = {
  red: "Red",
  amber: "Amber",
  green: "Green",
}

const STATUS_COLOR = {
  red: "destructive",
  amber: "warning",
  green: "success",
} as const

export const STATUS_TEXT: Record<Status, string> = {
  red: "text-red-600",
  amber: "text-amber-400",
  green: "text-green-500",
}

export const STATUS_DOT: Record<Status, string> = {
  red: "bg-red-600",
  amber: "bg-amber-400",
  green: "bg-green-500",
}

export const STATUS_PANEL: Record<Status, string> = {
  red: "bg-destructive/5",
  amber: "bg-warning/5",
  green: "bg-success/5",
}

export function severityStatus(severity: Severity): Status {
  return severity === "P0" || severity === "P1" ? "red" : "amber"
}

// Green is reserved for scores above 89.
export function scoreStatus(score: number): Status {
  if (score > 89) return "green"
  if (score >= 50) return "amber"
  return "red"
}

export function verdictStatus(verdict: Verdict): Status {
  if (verdict === "request-changes") return "red"
  if (verdict === "review-with-caution") return "amber"
  return "green"
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  "request-changes": "Request changes",
  "review-with-caution": "Review with caution",
  "looks-good": "Looks good",
}

export const QUALITY_LABEL: Record<Quality, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
}

export const STATUS_SURFACE: Record<Status, string> = {
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  green: "bg-green-600/10 text-green-600 dark:text-green-400",
}

export function ScoreBadge({
  score,
  quality,
  size = "sm",
}: {
  score: number
  quality: Quality
  verdict?: Verdict
  size?: "sm" | "lg"
}) {
  const large = size === "lg"
  return (
    <span
      title={`Review score ${score} out of 100: ${QUALITY_LABEL[quality]}`}
      className={cn(
        "inline-flex shrink-0 items-baseline gap-1 rounded-lg font-semibold tabular-nums",
        large ? "px-3 py-1.5" : "px-2 py-0.5",
        large || STATUS_SURFACE[scoreStatus(score)],
      )}>
      <span className={large ? "text-3xl leading-none" : "text-sm"}>{score}</span>
      <span className={cn("font-medium", large ? "text-xl" : "text-[10px]")}>
        {QUALITY_LABEL[quality]}
      </span>
    </span>
  )
}

export function StatusBadge({ status, children }: { status: Status; children?: React.ReactNode }) {
  return (
    <Badge variant="flat" colorVariant={STATUS_COLOR[status]}>
      {children ?? STATUS_LABEL[status]}
    </Badge>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <StatusBadge status={severityStatus(severity)}>{severity}</StatusBadge>
}

export function ChangeBadge({ change }: { change: FileChange }) {
  const color = change === "added" ? "success" : change === "deleted" ? "destructive" : "orange"
  return (
    <Badge variant="flat" className="bg-transparent border-0 font-normal rounded-sm uppercase" colorVariant={color}>
      {change[0]}
    </Badge>
  )
}

export function Dot({ status, className }: { status: Status; className?: string }) {
  return <span className={cn("inline-block size-2.5 rounded-full", STATUS_DOT[status], className)} />
}

export function ScoreRing({ score, size = 92 }: { score: number; size?: number }) {
  const status = scoreStatus(score)
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="10" className="stroke-accent" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            status === "red" && "stroke-red-600",
            status === "amber" && "stroke-amber-400",
            status === "green" && "stroke-green-500",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold leading-none", STATUS_TEXT[status])}>{score}</span>
      </div>
    </div>
  )
}

"use client"

import { format } from "date-fns"
import { useSyncExternalStore } from "react"
import { clockLabel, timeLabel } from "../_lib/day-label"

// One shared clock ticks every 30 seconds, so "1 min ago" keeps moving without a refresh.
const listeners = new Set<() => void>()
let now = 0
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!timer) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      listeners.forEach((l) => l())
    }, 30_000)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

const getNow = () => now || (now = Date.now())

// The server has no matching clock, so the first paint is the exact time; the client then swaps
// today's entries to the relative wording. The exact time stays in the tooltip.
export function TimeLabel({ iso }: { iso: string }) {
  const current = useSyncExternalStore(subscribe, getNow, () => 0)
  const date = new Date(iso)
  const exact = Number.isNaN(date.getTime()) ? "" : format(date, "EEE, dd MMM yyyy HH:mm:ss")
  return <span title={exact}>{current === 0 ? clockLabel(iso) : timeLabel(iso, current)}</span>
}

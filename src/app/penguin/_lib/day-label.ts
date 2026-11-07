import { format, isToday } from "date-fns"

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

export function clockLabel(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "-" : format(date, "HH:mm:ss")
}

// Today's entries read "just now", "1 min ago", "4 hours ago". Older ones keep the clock time.
export function timeLabel(iso: string, now = Date.now()) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "-"
  if (!isToday(date)) return clockLabel(iso)

  const age = Math.max(0, now - date.getTime())
  if (age < MINUTE) return "just now"
  if (age < HOUR) return `${Math.floor(age / MINUTE)} min ago`
  const hours = Math.floor(age / HOUR)
  return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
}


export function dayLabel(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "Unknown date"
  return isToday(date) ? "Today" : format(date, "EEE, dd MMM yyyy")
}

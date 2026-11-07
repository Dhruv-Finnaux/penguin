"use client"

import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

// The theme is only known in the browser, so the server renders a placeholder icon.
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const dark = mounted && resolvedTheme === "dark"
  const label = dark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <Button
      size="sm"
      variant="ghost"
      aria-label={label}
      title={label}
      className="bg-card px-2 hover:bg-card"
      onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  )
}

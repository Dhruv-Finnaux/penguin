"use client"

// The Finnaux UI tracks open dialogs here. Penguin has no dialogs, so the hook is a no-op.
export function useVisual() {
  return { changeCanCloseAnyOpenDialog: (value: boolean) => void value }
}

"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"
import React from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider disableTransitionOnChange enableSystem={true} attribute="class">
      {children}
    </NextThemeProvider>
  )
}

"use client"

import { useTheme } from "next-themes"
import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return

  return createPortal(
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-black dark:group-[.toaster]:border-white/10 group-[.toaster]:border group-[.toaster]:border-black/10 group-[.toaster]:text-foreground group-[.toaster]:border-0 group-[.toaster]:rounded-[20px] group-[.toaster]:shadow-lg",
          description: "text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />,
    document.body,
  )
}

export { Toaster }

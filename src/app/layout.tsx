import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"
import ReactQueryProvider from "@/providers/react-query.provider"
import { ThemeProvider } from "@/providers/theme.provider"
import { clsx } from "clsx"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"

export const metadata: Metadata = {
  title: "Penguin",
  description: "Reviews, explanations, docs and git history for Finnaux2.0-UI and Finnaux2.0-API",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // color-purple is the Finnaux UI's default colour theme (see globals.css).
    <html lang="en" className="color-purple" suppressHydrationWarning>
      <body
        className={clsx(
          GeistSans.className,
          "root h-full overflow-hidden bg-background text-foreground selection:bg-foreground/70 selection:text-background",
        )}>
        <NuqsAdapter>
          <ThemeProvider>
            <ReactQueryProvider>
              {children}
              <Toaster position="bottom-right" />
            </ReactQueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}

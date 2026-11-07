"use client"

import { createContext, useContext, type ReactNode } from "react"
import { exactIndices, highlightIndices } from "../_lib/fuzzy"

interface SearchHighlight {
  query: string
  exact: boolean
}

const SearchHighlightContext = createContext<SearchHighlight>({ query: "", exact: false })

export function SearchHighlightProvider({
  query,
  exact = false,
  children,
}: {
  query: string
  exact?: boolean
  children: ReactNode
}) {
  return (
    <SearchHighlightContext.Provider value={{ query, exact }}>
      {children}
    </SearchHighlightContext.Provider>
  )
}

export function Highlight({ text }: { text: string }) {
  const { query, exact } = useContext(SearchHighlightContext)
  if (!query.trim() || !text) return <>{text}</>

  const marked = exact ? exactIndices(query, text) : highlightIndices(query, text)
  if (marked.size === 0) return <>{text}</>

  const parts: ReactNode[] = []
  let index = 0
  while (index < text.length) {
    const isMarked = marked.has(index)
    let end = index
    while (end < text.length && marked.has(end) === isMarked) end++
    const chunk = text.slice(index, end)
    parts.push(
      isMarked ? (
        <mark
          key={index}
          data-search-match
          className="rounded-sm bg-yellow-300/70 text-inherit data-[active=true]:bg-orange-400 data-[active=true]:text-black dark:bg-yellow-400/35 dark:data-[active=true]:bg-orange-400">
          {chunk}
        </mark>
      ) : (
        chunk
      ),
    )
    index = end
  }
  return <>{parts}</>
}

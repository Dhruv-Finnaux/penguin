interface Match {
  indices: number[]
  span: number
}

function matchToken(token: string, text: string): Match | null {
  const query = token.toLowerCase()
  const haystack = text.toLowerCase()
  if (!query) return null

  const exact = haystack.indexOf(query)
  if (exact >= 0) {
    return { indices: Array.from({ length: query.length }, (_, i) => exact + i), span: query.length }
  }

  const limit = query.length * 2 + 2
  let best: Match | null = null

  for (let start = haystack.indexOf(query[0]); start >= 0; start = haystack.indexOf(query[0], start + 1)) {
    const indices = [start]
    let position = start + 1
    let matched = true

    for (let k = 1; k < query.length; k++) {
      const found = haystack.indexOf(query[k], position)
      if (found < 0) {
        matched = false
        break
      }
      indices.push(found)
      position = found + 1
    }
    if (!matched) break

    const span = indices[indices.length - 1] - start + 1
    if (span <= limit && (!best || span < best.span)) best = { indices, span }
  }
  return best
}

export function queryTokens(query: string) {
  return query.trim().split(/\s+/).filter(Boolean)
}

export function matchesQuery(query: string, fields: string[]) {
  const tokens = queryTokens(query)
  if (tokens.length === 0) return true
  return tokens.every((token) => fields.some((field) => matchToken(token, field) !== null))
}

export function highlightIndices(query: string, text: string): Set<number> {
  const marked = new Set<number>()
  for (const token of queryTokens(query)) {
    const match = matchToken(token, text)
    match?.indices.forEach((index) => marked.add(index))
  }
  return marked
}

export function exactIndices(query: string, text: string): Set<number> {
  const marked = new Set<number>()
  const needle = query.trim().toLowerCase()
  if (!needle) return marked

  const haystack = text.toLowerCase()
  for (let at = haystack.indexOf(needle); at >= 0; at = haystack.indexOf(needle, at + needle.length)) {
    for (let i = 0; i < needle.length; i++) marked.add(at + i)
  }
  return marked
}

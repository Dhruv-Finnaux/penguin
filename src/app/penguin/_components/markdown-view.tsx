import { cn } from "@/lib/utils"
import { useMemo, type ReactNode } from "react"
import { Highlight } from "./highlight"

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "hr" }
  | { type: "quote"; text: string }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "list"; items: ListItem[]; ordered: boolean }

interface ListItem {
  text: string
  code: { lang: string; text: string }[]
  children: Block | null
}

const FENCE = /^(\s*)(`{3,})\s*([\w-]*)\s*$/
const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/
const HEADING = /^(#{1,6})\s+(.*)$/
const TABLE_DIVIDER = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/

function splitRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"))
}

function parseList(lines: string[], start: number, baseIndent: number) {
  const items: ListItem[] = []
  const ordered = /\d/.test(LIST_ITEM.exec(lines[start])?.[2] ?? "")
  let i = start

  while (i < lines.length) {
    const match = LIST_ITEM.exec(lines[i])
    if (!match || match[1].length < baseIndent) break
    if (match[1].length > baseIndent) break

    const item: ListItem = { text: match[3], code: [], children: null }
    i++

    while (i < lines.length) {
      const line = lines[i]
      const fence = FENCE.exec(line)
      if (fence && fence[1].length > baseIndent) {
        const length = fence[2].length
        const body: string[] = []
        i++
        while (i < lines.length) {
          const closing = FENCE.exec(lines[i])
          if (closing && closing[2].length >= length && !closing[3]) break
          body.push(lines[i].replace(new RegExp(`^\\s{0,${fence[1].length}}`), ""))
          i++
        }
        i++
        item.code.push({ lang: fence[3], text: body.join("\n") })
        continue
      }
      const nested = LIST_ITEM.exec(line)
      if (nested && nested[1].length > baseIndent) {
        const parsed = parseList(lines, i, nested[1].length)
        item.children = { type: "list", items: parsed.items, ordered: parsed.ordered }
        i = parsed.next
        continue
      }
      if (line.trim() !== "" && /^\s+/.test(line) && !nested) {
        item.text += " " + line.trim()
        i++
        continue
      }
      break
    }
    items.push(item)

    while (i < lines.length && lines[i].trim() === "") {
      const after = lines[i + 1]
      const next = after ? LIST_ITEM.exec(after) : null
      if (next && next[1].length === baseIndent) i++
      else break
    }
  }
  return { items, ordered, next: i }
}

function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === "") {
      i++
      continue
    }

    const fence = FENCE.exec(line)
    if (fence) {
      const length = fence[2].length
      const body: string[] = []
      i++
      while (i < lines.length) {
        const closing = FENCE.exec(lines[i])
        if (closing && closing[2].length >= length && !closing[3]) break
        body.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: "code", lang: fence[3], text: body.join("\n") })
      continue
    }

    const heading = HEADING.exec(line)
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() })
      i++
      continue
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length && TABLE_DIVIDER.test(lines[i + 1])) {
      const header = splitRow(line)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push({ type: "table", header, rows })
      continue
    }

    if (line.trim().startsWith(">")) {
      const quote: string[] = []
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""))
        i++
      }
      blocks.push({ type: "quote", text: quote.join(" ") })
      continue
    }

    const item = LIST_ITEM.exec(line)
    if (item) {
      const parsed = parseList(lines, i, item[1].length)
      blocks.push({ type: "list", items: parsed.items, ordered: parsed.ordered })
      i = parsed.next
      continue
    }

    const paragraph: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !FENCE.test(lines[i]) &&
      !HEADING.test(lines[i]) &&
      !LIST_ITEM.test(lines[i]) &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith(">")
    ) {
      paragraph.push(lines[i].trim())
      i++
    }
    if (paragraph.length === 0) i++
    else blocks.push({ type: "paragraph", text: paragraph.join(" ") })
  }
  return blocks
}

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    if (!part) return null
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code key={index} className="rounded bg-accent px-1 py-0.5 font-mono text-[0.85em]">
          <Highlight text={part.slice(1, -1)} />
        </code>
      )
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold">
          {inline(part.slice(2, -2))}
        </strong>
      )
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) {
      const href = link[2].trim()
      return /^https?:\/\//.test(href) ? (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-600 underline underline-offset-2 dark:text-blue-400">
          <Highlight text={link[1]} />
        </a>
      ) : (
        <span key={index}>
          <Highlight text={link[1]} />
        </span>
      )
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{inline(part.slice(1, -1))}</em>
    }
    return <Highlight key={index} text={part} />
  })
}

function CodeBlock({ text }: { text: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
      <code>
        <Highlight text={text} />
      </code>
    </pre>
  )
}

const HEADING_CLASS = [
  "",
  "mt-2 text-2xl font-bold",
  "mt-8 border-b pb-1 text-xl font-semibold",
  "mt-6 text-lg font-semibold",
  "mt-4 text-base font-semibold",
  "mt-3 text-sm font-semibold",
  "mt-3 text-sm font-medium",
]

function ListView({ block }: { block: Extract<Block, { type: "list" }> }) {
  const Tag = block.ordered ? "ol" : "ul"
  return (
    <Tag className={cn("space-y-1.5 pl-6 text-sm", block.ordered ? "list-decimal" : "list-disc")}>
      {block.items.map((item, index) => (
        <li key={index} className="pl-1">
          <span>{inline(item.text)}</span>
          {item.code.map((code, codeIndex) => (
            <div key={codeIndex} className="my-2">
              <CodeBlock text={code.text} />
            </div>
          ))}
          {item.children && (
            <div className="mt-1.5">
              <ListView block={item.children as Extract<Block, { type: "list" }>} />
            </div>
          )}
        </li>
      ))}
    </Tag>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as "h1"
      return <Tag className={HEADING_CLASS[block.level]}>{inline(block.text)}</Tag>
    }
    case "paragraph":
      return <p className="text-sm leading-relaxed">{inline(block.text)}</p>
    case "code":
      return <CodeBlock text={block.text} />
    case "hr":
      return <hr className="my-2 border-border" />
    case "quote":
      return (
        <blockquote className="border-l-2 pl-3 text-sm text-muted-foreground">
          {inline(block.text)}
        </blockquote>
      )
    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-accent/40">
              <tr className="divide-x border-b">
                {block.header.map((cell, index) => (
                  <th key={index} className="px-3 py-2 font-medium">
                    {inline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="divide-x border-t align-top first:border-t-0">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2">
                      {inline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "list":
      return <ListView block={block} />
  }
}

export function MarkdownView({ source }: { source: string }) {
  const blocks = useMemo(() => parse(source), [source])
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  )
}

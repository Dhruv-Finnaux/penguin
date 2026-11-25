import { promises as fs } from "node:fs"
import { NextResponse } from "next/server"
import { isLocalOnly, testingFilePath } from "../../../_lib/penguin.server"

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
}

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })
  const params = new URL(request.url).searchParams
  const file = testingFilePath(params.get("folder") ?? "", params.get("name") ?? "")
  if (!file) return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  const type = TYPES[file.slice(file.lastIndexOf(".")).toLowerCase()]
  if (!type) return NextResponse.json({ message: "Unsupported file" }, { status: 400 })
  try {
    return new NextResponse(await fs.readFile(file), { headers: { "Content-Type": type } })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}

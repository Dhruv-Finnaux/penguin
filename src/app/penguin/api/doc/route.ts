import { NextResponse } from "next/server"
import { getDocContent, isLocalOnly } from "../../_lib/penguin.server"

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const docPath = new URL(request.url).searchParams.get("path") ?? ""
  if (!docPath) return NextResponse.json({ message: "Missing path" }, { status: 400 })

  try {
    return NextResponse.json({ content: await getDocContent(docPath) })
  } catch {
    return NextResponse.json({ message: "Could not read this document" }, { status: 404 })
  }
}

import { NextResponse } from "next/server"
import { fetchRemotes, getBranchFlow, isLocalOnly, isRepoKey } from "../../../_lib/penguin.server"

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const repo = new URL(request.url).searchParams.get("repo")
  if (!isRepoKey(repo)) return NextResponse.json({ message: "Invalid request" }, { status: 400 })

  try {
    return NextResponse.json(await getBranchFlow(repo))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read the branches"
    return NextResponse.json({ message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const body = await request.json().catch(() => null)
  if (!isRepoKey(body?.repo)) return NextResponse.json({ message: "Invalid request" }, { status: 400 })

  try {
    await fetchRemotes(body.repo)
    return NextResponse.json(await getBranchFlow(body.repo))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not fetch"
    return NextResponse.json({ message: `git fetch failed: ${message.split("\n")[0]}` }, { status: 500 })
  }
}

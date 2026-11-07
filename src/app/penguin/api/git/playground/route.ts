import { NextResponse } from "next/server"
import { getPlaygroundDataset, isLocalOnly, isRepoKey } from "../../../_lib/penguin.server"

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const repo = new URL(request.url).searchParams.get("repo")
  if (!isRepoKey(repo)) return NextResponse.json({ message: "Invalid request" }, { status: 400 })

  try {
    return NextResponse.json(await getPlaygroundDataset(repo))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read the branches"
    return NextResponse.json({ message }, { status: 500 })
  }
}

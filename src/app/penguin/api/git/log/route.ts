import { NextResponse } from "next/server"
import { getCommitPage, isLocalOnly, isRepoKey } from "../../../_lib/penguin.server"

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const params = new URL(request.url).searchParams
  const repo = params.get("repo")
  const branch = params.get("branch") ?? ""
  const skip = Number(params.get("skip") ?? 0)
  const limit = Number(params.get("limit") ?? 50)
  const authors = params.getAll("author").filter((name) => name && name.length < 200)
  if (!isRepoKey(repo) || !branch || !Number.isInteger(skip) || !Number.isInteger(limit)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }

  try {
    return NextResponse.json(await getCommitPage(repo, branch, skip, limit, authors))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read the commits"
    return NextResponse.json({ message }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getCommitDiff, isLocalOnly, isRepoKey, isValidHash } from "../../_lib/penguin.server"

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const params = new URL(request.url).searchParams
  const repo = params.get("repo")
  const hash = params.get("hash") ?? ""
  if (!isRepoKey(repo)) return NextResponse.json({ message: "Invalid repo" }, { status: 400 })
  if (!isValidHash(hash)) {
    return NextResponse.json({ message: "Invalid commit hash" }, { status: 400 })
  }

  try {
    return NextResponse.json({ files: await getCommitDiff(repo, hash) })
  } catch {
    return NextResponse.json({ message: "Could not read this commit" }, { status: 500 })
  }
}

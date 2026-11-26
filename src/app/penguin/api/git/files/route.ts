import { NextResponse } from "next/server"
import { getFileActivity, isLocalOnly, isRepoKey } from "../../../_lib/penguin.server"

const DATE = /^(\d{4}-\d{2}-\d{2})?$/

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const params = new URL(request.url).searchParams
  const repo = params.get("repo")
  const branch = params.get("branch") ?? ""
  const from = params.get("from") ?? ""
  const to = params.get("to") ?? ""
  const authors = params.getAll("author").filter((name) => name && name.length < 200)
  if (!isRepoKey(repo) || !branch || !DATE.test(from) || !DATE.test(to)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }

  try {
    return NextResponse.json(await getFileActivity(repo, branch, authors, from, to, params.get("remote") !== "0"))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read the files"
    return NextResponse.json({ message }, { status: 500 })
  }
}

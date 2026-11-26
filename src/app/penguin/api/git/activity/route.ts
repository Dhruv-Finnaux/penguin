import { NextResponse } from "next/server"
import { getActivity, isLocalOnly, isRepoKey } from "../../../_lib/penguin.server"

export async function GET(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const params = new URL(request.url).searchParams
  const repo = params.get("repo")
  const branch = params.get("branch") ?? ""
  if (!isRepoKey(repo) || !branch) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }

  try {
    return NextResponse.json(await getActivity(repo, branch, params.get("remote") !== "0"))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read the activity"
    return NextResponse.json({ message }, { status: 500 })
  }
}

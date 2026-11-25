import { NextResponse } from "next/server"
import { getTestingFiles, isLocalOnly } from "../../_lib/penguin.server"

export async function GET() {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })
  return NextResponse.json(await getTestingFiles())
}

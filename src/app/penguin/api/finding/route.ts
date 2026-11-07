import { NextResponse } from "next/server"
import { confirmFinding, isLocalOnly, setFindingOptional, setFindingResolved } from "../../_lib/penguin.server"

export async function PATCH(request: Request) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const body = await request.json().catch(() => null)
  if (typeof body?.file === "string" && typeof body?.id === "string" && body?.confirm === true) {
    try {
      await confirmFinding(body.file, body.id, typeof body.note === "string" ? body.note : "")
      return NextResponse.json({ ok: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not confirm the finding"
      return NextResponse.json({ message }, { status: 400 })
    }
  }
  if (typeof body?.file === "string" && typeof body?.id === "string" && typeof body?.optional === "boolean") {
    try {
      await setFindingOptional(body.file, body.id, body.optional)
      return NextResponse.json({ ok: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update the finding"
      return NextResponse.json({ message }, { status: 400 })
    }
  }
  if (typeof body?.file !== "string" || typeof body?.id !== "string" || typeof body?.resolved !== "boolean") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }

  try {
    await setFindingResolved(body.file, body.id, body.resolved)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update the finding"
    return NextResponse.json({ message }, { status: 400 })
  }
}

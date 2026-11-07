import { NextResponse } from "next/server"
import {
  addQuestion,
  deleteQuestion,
  isQuestionKind,
  isLocalOnly,
  updateQuestion,
} from "../../_lib/penguin.server"

async function handle(request: Request, run: (body: any) => Promise<void>) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const body = await request.json().catch(() => null)
  if (!body || !isQuestionKind(body.kind)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }

  try {
    await run(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update the question"
    return NextResponse.json({ message }, { status: 400 })
  }
}

export function POST(request: Request) {
  return handle(request, (body) => addQuestion(body.kind, String(body.question ?? ""), body.category, body.priority))
}

export function PATCH(request: Request) {
  return handle(request, (body) => updateQuestion(body.kind, String(body.id ?? ""), body))
}

export function DELETE(request: Request) {
  return handle(request, (body) => deleteQuestion(body.kind, String(body.id ?? "")))
}

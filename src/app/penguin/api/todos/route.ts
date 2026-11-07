import { NextResponse } from "next/server"
import { addTodo, deleteTodo, getTodos, isLocalOnly, isTodoStatus, updateTodo } from "../../_lib/penguin.server"

async function handle(request: Request, run: (body: any) => Promise<void>) {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ message: "Invalid request" }, { status: 400 })

  try {
    await run(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update the todo"
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function GET() {
  if (!isLocalOnly()) return new NextResponse(null, { status: 404 })
  return NextResponse.json({ todos: await getTodos() })
}

export function POST(request: Request) {
  return handle(request, (body) => addTodo(String(body.text ?? ""), isTodoStatus(body.status) ? body.status : "todo"))
}

export function PATCH(request: Request) {
  return handle(request, (body) => updateTodo(String(body.id ?? ""), body))
}

export function DELETE(request: Request) {
  return handle(request, (body) => deleteTodo(String(body.id ?? "")))
}

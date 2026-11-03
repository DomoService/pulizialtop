import { NextResponse } from "next/server"

// Database migrations must run outside HTTP requests, with operator approval.
export async function GET() {
  return NextResponse.json({ error: "Migrazioni via web disabilitate" }, { status: 410 })
}

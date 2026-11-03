import { runMigration } from "@/lib/supabase/migrate"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await runMigration()

    if (result.success) {
      return NextResponse.json({ message: "Migration completed successfully" })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Migration failed" }, { status: 500 })
  }
}

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  console.log("[v0] Starting database migration...")

  // Read and execute the SQL files
  const createTableSQL = await fetch("/scripts/001_create_agencies_table.sql").then((r) => r.text())
  const seedDataSQL = await fetch("/scripts/002_seed_agencies.sql").then((r) => r.text())

  console.log("[v0] Creating tables...")
  const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableSQL })
  if (createError) {
    console.error("[v0] Error creating tables:", createError)
    throw createError
  }

  console.log("[v0] Seeding data...")
  const { error: seedError } = await supabase.rpc("exec_sql", { sql: seedDataSQL })
  if (seedError) {
    console.error("[v0] Error seeding data:", seedError)
    throw seedError
  }

  console.log("[v0] Migration completed successfully!")
}

runMigrations()

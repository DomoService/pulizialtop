export function publicImageUrl(value: string | null | undefined, supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL): string | null {
  if (!value) return null
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value
  try {
    const url = new URL(value)
    const storage = new URL(supabaseUrl || "")
    return url.protocol === "https:" && url.origin === storage.origin &&
      url.pathname.startsWith("/storage/v1/object/public/") && !url.username && !url.password ? url.toString() : null
  } catch { return null }
}

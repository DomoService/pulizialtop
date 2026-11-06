// Not a malware scanner: reject active SVG/HTML, oversized uploads and MIME mismatches.
export async function validatedLogoExtension(file: File): Promise<string | null> {
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) return null
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const signature = (values: number[], offset = 0) => values.every((b, i) => bytes[offset + i] === b)
  if (file.type === "image/jpeg" && signature([255,216,255])) return "jpg"
  if (file.type === "image/png" && signature([137,80,78,71,13,10,26,10])) return "png"
  if (file.type === "image/webp" && signature([82,73,70,70]) && signature([87,69,66,80],8)) return "webp"
  return null
}

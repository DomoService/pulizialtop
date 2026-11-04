export const CONSENT_KEY = "pulizialtop-consent-v1"
export function consentRecord(analytics: boolean, now = new Date()) {
  const expires = new Date(now)
  expires.setMonth(expires.getMonth() + 6)
  return JSON.stringify({ version: 1, analytics, expires: expires.getTime() })
}
export function readConsent(
  raw: string | null,
  now = Date.now()
): boolean | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    return v.version === 1 &&
      typeof v.analytics === "boolean" &&
      typeof v.expires === "number" &&
      v.expires > now
      ? v.analytics
      : null
  } catch {
    return null
  }
}
export function isPrivatePath(path: string) {
  return (
    /^\/(admin|auth|invito|recensione|segnala-un-problema|contattaci|registrazione-agenzia)(\/|$)/.test(
      path
    ) || /\/dashboard(\/|$)/.test(path)
  )
}

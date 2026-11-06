export const CONSENT_KEY = "pulizialtop-consent-v1"
// Keep the key/version stable: adding a timestamp is not a change of purposes.
export function consentRecord(analytics: boolean, now = new Date()) {
  const expires = new Date(now)
  expires.setMonth(expires.getMonth() + 6)
  return JSON.stringify({ version: 1, analytics, savedAt: now.getTime(), expires: expires.getTime() })
}
export function readConsent(raw: string | null, now = Date.now()): boolean | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    return v.version === 1 && typeof v.analytics === "boolean" &&
      Number.isFinite(v.expires) && v.expires > now ? v.analytics : null
  } catch { return null }
}
export function isPrivatePath(path: string) {
  return /^\/(admin|auth|invito|recensione|segnala-un-problema|contattaci|registrazione-agenzia)(\/|$)/.test(path) ||
    /^\/agenzia\/(login|password-dimenticata|nuova-password)(\/|$)/.test(path) || /\/dashboard(\/|$)/.test(path)
}
// Read live consent and the live location, not a stale React closure after navigation.
export function redactAnalyticsEvent<T extends { url: string; type: string }>(event: T, raw: string | null, currentPath: string): T | null {
  if (readConsent(raw) !== true || isPrivatePath(currentPath) || event.type !== "pageview") return null
  try {
    const url = new URL(event.url)
    if (isPrivatePath(url.pathname)) return null
    url.search = ""
    url.hash = ""
    return { ...event, url: url.toString() }
  } catch { return null }
}

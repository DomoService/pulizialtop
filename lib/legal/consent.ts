export const COOKIE_NOTICE_VERSION = "cookie-1"
export const CONSENT_KEY = "pulizialtop-consent-v1"
// Keep the key/version stable: adding a timestamp is not a change of purposes.
export function consentRecord(analytics: boolean, now = new Date()) {
  const expires = new Date(now)
  expires.setMonth(expires.getMonth() + 6)
  return JSON.stringify({ version: 1, noticeVersion: COOKIE_NOTICE_VERSION, analytics, savedAt: now.getTime(), expires: expires.getTime() })
}
export function readConsent(raw: string | null, now = Date.now()): boolean | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    return v.version === 1 && (v.noticeVersion === undefined || v.noticeVersion === COOKIE_NOTICE_VERSION) && typeof v.analytics === "boolean" &&
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

// Informational acknowledgement is deliberately NOT a consent record.
export const COOKIE_INFO_KEY = "pulizialtop-cookie-info-v1"
export function cookieInfoRecord(now = new Date()) {
  const expires=new Date(now);expires.setMonth(expires.getMonth()+6)
  return JSON.stringify({version:1,seenAt:now.getTime(),expires:expires.getTime()})
}
export function hasSeenCookieInfo(raw: string | null, now=Date.now()) {
  try {
    const value=JSON.parse(raw || "null")
    return value?.version===1 && Number.isFinite(value.seenAt) && value.seenAt<=now && Number.isFinite(value.expires) && value.expires>now
  } catch {return false}
}

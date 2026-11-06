"use client"
import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  CONSENT_KEY,
  COOKIE_INFO_KEY,
  cookieInfoRecord,
  hasSeenCookieInfo,
  consentRecord,
  readConsent,
  isPrivatePath,
  redactAnalyticsEvent,
} from "@/lib/legal/consent"
import Link from "next/link"
export function CookiePreferences({ enabled }: { enabled: boolean }) {
  const [choice, setChoice] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const allowed = useRef(false)
  const temporaryChoice = useRef<string | null>(null)
  const [storageError, setStorageError] = useState(false)
  const opener = useRef<HTMLElement | null>(null)
  const infoSeenThisVisit = useRef(false)
  const path = usePathname()
  useEffect(() => {
    let saved: boolean | null = null
    try {
      saved = readConsent(localStorage.getItem(CONSENT_KEY))
    } catch { setStorageError(true) }
    allowed.current = saved === true
    setChoice(saved)
    setAnalytics(saved === true)
    let seen = false
    try { seen = hasSeenCookieInfo(localStorage.getItem(COOKIE_INFO_KEY)) } catch { setStorageError(true) }
    // Existing valid consent suppresses unsolicited information, but is never overwritten.
    setOpen(enabled ? saved === null : saved === null && !seen && !infoSeenThisVisit.current)
    const handler = () => {
      opener.current = document.activeElement as HTMLElement
      setAnalytics(allowed.current)
      setCustom(true)
      setOpen(true)
    }
    window.addEventListener("open-cookie-preferences", handler)
    const sync = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY || e.key === null) {
        allowed.current = false
        location.reload()
      }
    }
    const expire = () => {
      let valid = null
      try { valid = readConsent(localStorage.getItem(CONSENT_KEY)) } catch {}
      if (valid === null && readConsent(temporaryChoice.current) === false) return
      if (valid === null) {
        allowed.current = false
        setChoice(null)
        setAnalytics(false)
        if (enabled) setOpen(true)
      }
    }
    const timer = window.setInterval(expire, 60_000)
    window.addEventListener("focus", expire)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("open-cookie-preferences", handler)
      window.removeEventListener("storage", sync)
      window.removeEventListener("focus", expire)
      window.clearInterval(timer)
    }
  }, [enabled])
  function acknowledgeInfo() {
    infoSeenThisVisit.current = true
    try { localStorage.setItem(COOKIE_INFO_KEY, cookieInfoRecord()) }
    catch { setStorageError(true) }
    setOpen(false)
  }
  function save(value: boolean) {
    // Consent must be readable after writing. Storage errors never enable analytics.
    let persisted = false
    try {
      localStorage.setItem(CONSENT_KEY, consentRecord(value))
      persisted = readConsent(localStorage.getItem(CONSENT_KEY)) === value
    } catch {}
    const effective = persisted && value
    allowed.current = effective
    temporaryChoice.current = persisted ? null : consentRecord(false)
    setStorageError(!persisted)
    setChoice(effective)
    setAnalytics(effective)
    setOpen(false)
    if (!effective) {
      // Stop already-loaded SDKs before reload; delete legacy GA cookies on all applicable domains.
      ;(window as any)["ga-disable-G-FXSFE7DZCP"] = true
      for (const part of document.cookie.split(";")) {
        const name = part.trim().split("=")[0]
        if (!/^(_ga($|_)|_gid$|_gat)/.test(name)) continue
        const domains = location.hostname.split(".")
        document.cookie = `${name}=; Max-Age=0; path=/`
        for (let i = 0; i < domains.length - 1; i++)
          document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domains.slice(i).join(".")}`
      }
      // If persistence fails, reloading could restore an old acceptance.
      // Keep the live SDK filter denied for the remainder of this document.
      if (choice === true && persisted) location.reload()
    }
  }
  const load = enabled && choice === true && !isPrivatePath(path)
  return (
    <>
      {load && (
        <>
          <Analytics
            mode="production"
            beforeSend={(event) => {
              if (!allowed.current) return null
              try {
                return redactAnalyticsEvent(event, localStorage.getItem(CONSENT_KEY), location.pathname)
              } catch { return null }
            }}
          />
        </>
      )}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) { if(enabled) save(false); else acknowledgeInfo() }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="z-[100] max-h-[90dvh] overflow-y-auto"
          onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus() }}
        >
          <DialogClose className="absolute right-4 top-3 rounded p-2 focus-visible:outline" aria-label={enabled ? "Chiudi: solo strumenti necessari" : "Chiudi informazioni sui cookie"}>×</DialogClose>
          <DialogTitle>{enabled ? "Preferenze cookie" : "Informazioni sui cookie"}</DialogTitle>
          <DialogDescription>
            {enabled
              ? "I servizi statistici facoltativi sono bloccati finché non scegli. Rifiutare non limita le funzioni del sito."
              : "Utilizziamo soltanto cookie e strumenti tecnici necessari al funzionamento del sito. Non utilizziamo strumenti di profilazione o pubblicitari. Per questi strumenti non è richiesto il tuo consenso."}
          </DialogDescription>
          <p className="text-sm">
            {enabled
              ? "Preferenze conservate sul dispositivo per sei mesi, con versione, data e scadenza, senza identificativi o invio al server. Chiudere con X o Esc mantiene solo gli strumenti necessari."
              : "Con Ho capito, X o Esc memorizziamo soltanto l’avvenuta visualizzazione per sei mesi. Non esprimi un consenso. Puoi riaprire queste informazioni dal footer."}{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>{" · "}
            <Link href="/cookie-policy" className="underline">
              Cookie Policy
            </Link>
          </p>
          {storageError && <p role="status" className="text-sm">Le preferenze non possono essere memorizzate in questo browser. Restano attivi solo gli strumenti necessari; la scelta potrebbe essere richiesta alla prossima visita.</p>}
          {custom && enabled && (
            <fieldset className="space-y-3 text-sm">
              <legend>Categorie</legend>
              <p>Tecnici: sempre necessari per sessione e sicurezza.</p>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={analytics && enabled}
                  disabled={!enabled}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                Statistiche facoltative: Vercel Web Analytics
              </label>
            </fieldset>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {enabled && (
              <>
                <Button variant="outline" onClick={() => save(true)}>
                  Accetta tutti
                </Button>
                <Button variant="outline" onClick={() => save(false)}>
                  Rifiuta non necessari
                </Button>
                <Button variant="outline" onClick={() => setCustom(true)}>
                  Personalizza
                </Button>
                {custom && (
                  <Button variant="outline" onClick={() => save(analytics)}>
                    Salva preferenze
                  </Button>
                )}
              </>
            )}
            {!enabled && (
              <Button variant="outline" onClick={acknowledgeInfo}>
                Ho capito
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export function CookiePreferencesLink({ enabled = false }: { enabled?: boolean }) {
  return (
    <button
      type="button"
      className="underline-offset-4 hover:underline"
      onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
    >
      {enabled ? "Preferenze cookie" : "Informazioni sui cookie"}
    </button>
  )
}

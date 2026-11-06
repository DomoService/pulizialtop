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
  const opener = useRef<HTMLElement | null>(null)
  const path = usePathname()
  useEffect(() => {
    let saved: boolean | null = null
    try {
      saved = readConsent(localStorage.getItem(CONSENT_KEY))
    } catch {}
    allowed.current = saved === true
    setChoice(saved)
    setAnalytics(saved === true)
    setOpen(enabled && saved === null)
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
      if (valid === null) {
        allowed.current = false
        setChoice(null)
        setAnalytics(false)
        setOpen(enabled)
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
  function save(value: boolean) {
    allowed.current = value
    try {
      localStorage.setItem(CONSENT_KEY, consentRecord(value))
    } catch {}
    setChoice(value)
    setAnalytics(value)
    setOpen(false)
    if (!value) {
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
      if (choice === true) location.reload()
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
          if (!v && enabled) save(false)
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[90dvh] overflow-y-auto"
          onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus() }}
        >
          <DialogClose className="absolute right-4 top-3 rounded p-2 focus-visible:outline" aria-label="Chiudi: solo strumenti necessari">×</DialogClose>
          <DialogTitle>Preferenze cookie</DialogTitle>
          <DialogDescription>
            {enabled
              ? "I servizi statistici facoltativi sono bloccati finché non scegli. Rifiutare non limita le funzioni del sito."
              : "Sono attivi solo strumenti tecnici necessari. Le statistiche facoltative sono disabilitate: non è richiesto un consenso per attivarli."}
          </DialogDescription>
          <p className="text-sm">
            Preferenze conservate sul dispositivo per sei mesi, con versione e
            data della scelta e scadenza, senza identificativi o invio al server. Puoi cambiarle dal
            footer. Chiudere con X o Esc mantiene solo gli strumenti necessari.{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>{" · "}
            <Link href="/cookie-policy" className="underline">
              Cookie Policy
            </Link>
          </p>
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
          <div className="flex flex-wrap gap-2">
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
              <Button variant="outline" onClick={() => setOpen(false)}>
                Chiudi
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export function CookiePreferencesLink() {
  return (
    <button
      type="button"
      className="underline-offset-4 hover:underline"
      onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
    >
      Preferenze cookie
    </button>
  )
}

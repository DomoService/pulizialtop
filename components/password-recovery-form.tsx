"use client"

import { updateRecoveredPassword } from "@/lib/password-update"
import { useState, type FormEvent } from "react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordRecoveryForm({ update = false, audience = "admin" }: { update?: boolean; audience?: "admin" | "agenzia" }) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [warning, setWarning] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    const data = new FormData(form)
    setError("")
    const password = String(data.get("password") || "")
    if (update && (password.length < 12 || password !== data.get("confirmation"))) {
      setError("Usa almeno 12 caratteri e conferma la stessa password.")
      return
    }
    setBusy(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (update) {
        const result = await updateRecoveredPassword(supabase,password,String(data.get("confirmation") || ""))
        if(!result.success){setError(result.error || "Aggiornamento non riuscito");return}
        setWarning(result.warning || "")
      } else {
        await supabase.auth.resetPasswordForEmail(String(data.get("email") || "").trim(), {
          redirectTo: `${window.location.origin}${audience === "admin" ? "/auth/recovery" : "/auth/agenzia/recovery"}`,
        })
      }
      form.reset()
      setDone(true)
    } catch {
      if (update) setError("Impossibile aggiornare la password. Riprova o richiedi un nuovo link.")
      else setError("Connessione al servizio non disponibile. Riprova più tardi.")
    } finally {
      setBusy(false)
    }
  }

  return <div className="space-y-4">
    {done ? <p role="status">{update ? "Password aggiornata. Accedi con la nuova password." : "Se l’indirizzo è associato a un account, riceverai un’email con le istruzioni per reimpostare la password."}</p> :
      <form onSubmit={submit} className="space-y-4">
        {update ? <>
          <div className="space-y-2"><Label htmlFor="password">Nuova password (almeno 12 caratteri)</Label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required disabled={busy} /></div>
          <div className="space-y-2"><Label htmlFor="confirmation">Conferma nuova password</Label><Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={12} required disabled={busy} /></div>
        </> : <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required disabled={busy} /></div>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Attendi…" : update ? "Salva nuova password" : "Invia link di recupero"}</Button>
      </form>}
    <p className="text-sm">La richiesta non conferma l’esistenza di un account né il recapito dell’email. Apri solo l’ultimo link nello stesso browser della richiesta.</p>
    {warning && <p role="status">{warning}</p>}
    <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
    <Link href={`/${audience}/login`} className="block underline">Torna al login</Link>
    {update && <Link href={`/${audience}/password-dimenticata`} className="block underline">Richiedi un nuovo link</Link>}
  </div>
}

"use client"
import { useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { submitLegalRequest } from "@/app/legal-actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
export function ContactForm() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [id, setId] = useState("")
  async function submit(f: FormData) {
    setBusy(true)
    setError("")
    try {
      const r = await submitLegalRequest({
        kind: "contatto",
        name: String(f.get("name") || ""),
        email: String(f.get("email") || ""),
        url: "",
        message: `${f.get("subject") || ""}\n${f.get("message") || ""}`,
        acknowledged: f.get("privacy") === "on",
        goodFaith: false,
        website: String(f.get("website") || ""),
      })
      if (r.success && "id" in r && r.id) setId(r.id)
      else setError(("error" in r && r.error) || "Invio non riuscito")
    } catch {
      setError("Servizio non disponibile: scrivi a info@pulizialtop.it")
    } finally {
      setBusy(false)
    }
  }
  if (id)
    return (
      <p role="status" className="break-words">
        Messaggio registrato con riferimento {id}. Non è stata inviata un’email
        automatica.
      </p>
    )
  return (
    <form action={submit} className="space-y-6">
      <label className="block space-y-2">
        <span>Nome o riferimento per il riscontro</span>
        <Input name="name" required maxLength={255} />
      </label>
      <label className="block space-y-2">
        <span>Email</span>
        <Input name="email" type="email" required maxLength={255} />
      </label>
      <label className="block space-y-2">
        <span>Oggetto</span>
        <Input name="subject" required maxLength={255} />
      </label>
      <label className="block space-y-2">
        <span>Messaggio</span>
        <Textarea
          name="message"
          required
          minLength={10}
          maxLength={4500}
          rows={5}
        />
      </label>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <Input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        Usiamo nome, email e messaggio per rispondere alla tua richiesta
        (art. 6.1.b GDPR, misure precontrattuali o servizio richiesto), non per marketing.
        Il messaggio è destinato al gestore del sito e non viene inoltrato automaticamente
        alle agenzie. Non inserire dati sensibili o informazioni di terzi non necessarie.
      </p>
      <label className="flex gap-2 text-xs">
        <input type="checkbox" name="privacy" required />
        Ho letto la{" "}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        . Non è un consenso marketing.
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        <Mail className="mr-2 h-4 w-4" />
        {busy ? "Invio in corso…" : "Invia Messaggio"}
      </Button>
    </form>
  )
}

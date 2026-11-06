"use client"
import { useState } from "react"
import Link from "next/link"
import { submitRegistration } from "@/app/legal-actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
export function RegistrationForm() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [id, setId] = useState("")
  async function submit(f: FormData) {
    setBusy(true)
    setError("")
    const input: Record<string, unknown> = Object.fromEntries(f)
    input.terms = f.get("terms") === "on"
    input.privacy = f.get("privacy") === "on"
    try {
      const r = await submitRegistration(input)
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
        Richiesta registrata: {id}. La scheda non è ancora pubblicata. Non
        vengono inviate password in chiaro. Il referente sarà contattato dopo la
        valutazione.
      </p>
    )
  return (
    <form action={submit} className="space-y-4">
      {[
        { name: "agency_name", label: "Ragione sociale", required: true },
        {
          name: "vat",
          label: "Partita IVA italiana (11 cifre)",
          required: true,
        },
        { name: "legal_address", label: "Sede legale", required: true },
        {
          name: "email",
          label: "Email aziendale",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Telefono aziendale",
          type: "tel",
          required: true,
        },
        {
          name: "business_website",
          label: "Sito internet (facoltativo)",
          type: "url",
        },
        {
          name: "contact_name",
          label: "Referente aziendale (non pubblico)",
          required: true,
        },
        { name: "province", label: "Provincia", required: true },
      ].map((field) => (
        <label className="block space-y-1" key={field.name}>
          <span>
            {field.label}
            {field.required ? " *" : ""}
          </span>
          <Input
            name={field.name}
            type={field.type || "text"}
            required={field.required}
            maxLength={field.name === "legal_address" ? 500 : 255}
          />
        </label>
      ))}
      <label className="block space-y-1">
        <span>Servizi (facoltativi)</span>
        <Textarea name="services" maxLength={3000} />
      </label>
      <label className="block space-y-1">
        <span>Messaggio (facoltativo, non pubblico)</span>
        <Textarea name="message" maxLength={3000} />
      </label>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <Input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="terms" required />
        Accetto i{" "}
        <Link className="underline" href="/termini-e-condizioni">
          Termini e Condizioni
        </Link>
        .
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="privacy" required />
        Ho letto la{" "}
        <Link className="underline" href="/privacy-policy">
          Privacy Policy
        </Link>
        .
      </label>
      <p className="text-xs text-muted-foreground">
        La presa visione non è un consenso marketing. I dati del referente
        restano riservati. L’inserimento richiede verifica; usa solo materiali
        di cui hai i diritti.
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? "Invio…" : "Invia Richiesta di Registrazione"}
      </Button>
    </form>
  )
}

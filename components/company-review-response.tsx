"use client"
import { useState } from "react"
import { addCompanyResponse } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
export function CompanyReviewResponse({ id }: { id: number }) {
  const [text, setText] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true)
    try {
      const r = await addCompanyResponse(id, text)
      setMessage(
        r.success
          ? "Risposta salvata. Sarà visibile nella recensione approvata."
          : r.error || "Operazione non riuscita"
      )
    } catch {
      setMessage("Accesso non autorizzato o servizio non disponibile")
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="space-y-2">
      <label className="block">
        Risposta pubblica dell’impresa
        <Textarea
          value={text}
          maxLength={2000}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <p className="text-xs">
        Non inserire dati privati del cliente. Rispondi ai fatti con rispetto;
        per contestazioni usa Segnala un problema.
      </p>
      <Button onClick={save} disabled={busy || !text.trim()}>
        Salva risposta
      </Button>
      <p role="status">{message}</p>
    </div>
  )
}

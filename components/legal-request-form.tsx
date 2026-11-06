"use client"
import { useState } from "react"
import Link from "next/link"
import { submitLegalRequest } from "@/app/legal-actions"
import { requestKinds } from "@/lib/legal/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
const labels: Record<string, string> = {
  privacy: "Diritti privacy",
  "contenuto-illecito": "Contenuto potenzialmente illecito",
  recensione: "Segnala recensione",
  contestazione: "Contesta recensione",
  "correzione-scheda": "Correggi scheda",
  "rimozione-scheda": "Richiedi rimozione scheda",
  rivendicazione: "Rivendica profilo",
  reclamo: "Reclamo su decisione",
  accessibilita: "Problema di accessibilità",
  contatto: "Contatto",
  registrazione: "Registrazione impresa",
}
export function LegalRequestForm({
  initialKind = "privacy",
  initialUrl = "",
}: {
  initialKind?: string
  initialUrl?: string
}) {
  const [kind, setKind] = useState(
    requestKinds.includes(initialKind as any) ? initialKind : "privacy"
  )
  const [exception, setException] = useState(false)
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [id, setId] = useState("")
  const anonymous = kind === "contenuto-illecito" && exception
  async function submit(f: FormData) {
    setBusy(true)
    setError("")
    try {
      const result = await submitLegalRequest({
        kind,
        name: String(f.get("name") || ""),
        email: String(f.get("email") || ""),
        url: String(f.get("url") || ""),
        message: String(f.get("message") || ""),
        anonymousException: anonymous,
        acknowledged: f.get("privacy") === "on",
        goodFaith: f.get("goodFaith") === "on",
        website: String(f.get("website") || ""),
      })
      if (result.success && "id" in result && result.id) setId(result.id)
      else setError(("error" in result && result.error) || "Invio non riuscito")
    } catch {
      setError("Invio non riuscito: contatta info@pulizialtop.it")
    } finally {
      setBusy(false)
    }
  }
  if (id)
    return (
      <div role="status" className="rounded border p-4 space-y-2">
        <p>
          Richiesta registrata. Identificativo:{" "}
          <strong className="break-all">{id}</strong>.
        </p>
        <p>
          Conserva questo numero per un eventuale seguito. Non equivale
          all’accoglimento della richiesta e nessun contenuto è stato cancellato
          automaticamente. Non è stata inviata un’email automatica.
        </p>
      </div>
    )
  return (
    <form action={submit} className="space-y-4 rounded-lg border bg-card p-6">
      <label className="block space-y-2">
        <span>Tipo di richiesta</span>
        <select
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="w-full rounded border bg-background p-2"
        >
          {requestKinds
            .filter((k) => k !== "registrazione")
            .map((k) => (
              <option key={k} value={k}>
                {labels[k]}
              </option>
            ))}
        </select>
      </label>
      {kind === "contenuto-illecito" && (
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={exception}
            onChange={(e) => setException(e.target.checked)}
          />
          Segnalazione relativa ai reati degli artt. 3–7 direttiva 2011/93/UE
          (abusi sessuali su minori): posso omettere nome e email. Non allegare
          materiale illecito.
        </label>
      )}
      <label className="block space-y-2">
        <span>Nome o denominazione {anonymous ? "(facoltativo)" : "*"}</span>
        <Input name="name" required={!anonymous} maxLength={255} />
      </label>
      <label className="block space-y-2">
        <span>Email per il riscontro {anonymous ? "(facoltativa)" : "*"}</span>
        <Input
          name="email"
          type="email"
          required={!anonymous}
          maxLength={255}
        />
      </label>
      <label className="block space-y-2">
        <span>URL esatto della pagina o recensione</span>
        <Input
          name="url"
          type="url"
          maxLength={2000}
          defaultValue={initialUrl}
          placeholder="https://www.pulizialtop.it/agenzia/42#recensione-123"
        />
      </label>
      <label className="block space-y-2">
        <span>Motivazione e richiesta * (10–5000 caratteri)</span>
        <Textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          aria-describedby="request-help"
        />
      </label>
      <p id="request-help" className="text-sm text-muted-foreground">
        Spiega i fatti e, per contenuti illeciti, perché li ritieni tali. Per un
        reclamo indica la decisione contestata. Non inserire password, dati
        sanitari o documenti di identità; usa un contatto minimo per consentire
        la verifica. Una richiesta di cancellazione non comporta rimozione
        automatica.
      </p>
      <div className="hidden" aria-hidden="true">
        <label>
          Sito web antispam
          <Input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex gap-2 text-sm">
        <input name="privacy" type="checkbox" required />
        Ho letto la{" "}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </label>
      <label className="flex gap-2 text-sm">
        <input
          name="goodFaith"
          type="checkbox"
          required={[
            "contenuto-illecito",
            "recensione",
            "contestazione",
            "reclamo",
          ].includes(kind)}
        />
        Dichiaro in buona fede che le informazioni fornite sono accurate e
        complete per quanto a mia conoscenza.
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? "Invio in corso…" : "Invia richiesta"}
      </Button>
      <p className="text-sm">
        Alternativa:{" "}
        <a href="mailto:info@pulizialtop.it" className="underline">
          info@pulizialtop.it
        </a>
        . La ricezione via email richiede la gestione del titolare.
      </p>
    </form>
  )
}

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  saveLegalSettings,
  resolveLegalRequest,
  saveAgencyProvenance,
} from "@/app/legal-actions"
import {
  legalFields,
  missingLegalFields,
  type LegalSettings,
} from "@/lib/legal/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
export function ComplianceSettings({
  initial,
  configured,
}: {
  initial: LegalSettings
  configured: boolean
}) {
  const [settings, setSettings] = useState(initial),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true)
    try {
      const r = await saveLegalSettings(settings)
      setMessage(
        r.success
          ? "Impostazioni salvate. Nessuna cancellazione automatica configurata."
          : r.error || "Errore"
      )
    } catch {
      setMessage("Salvataggio non riuscito")
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="space-y-4 rounded border bg-card p-6">
      <h2 className="text-2xl font-semibold">Dati legali e conservazione</h2>
      {!configured && (
        <p role="alert">
          Setup database non disponibile: le pagine usano segnaposto. Non
          pubblicare definitivamente prima di migrazione, completamento e
          verifica.
        </p>
      )}
      <div role="status">
        <h3 className="font-semibold">Informazioni mancanti / da confermare</h3>
        <ul className="list-disc pl-6">
          {missingLegalFields(settings).map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm">
        Questi campi sono pubblicati nelle informative. Non inserire segreti,
        note interne o dati non necessari. Non indicare durate prive di una
        valutazione documentata.
      </p>
      {Object.entries(legalFields).map(([key, label]) => (
        <label key={key} className="block space-y-1">
          <span>{label}</span>
          <Textarea
            maxLength={3000}
            value={String(settings[key as keyof LegalSettings])}
            onChange={(e) =>
              setSettings({ ...settings, [key]: e.target.value })
            }
          />
        </label>
      ))}
      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={settings.analyticsEnabled}
          onChange={(e) =>
            setSettings({ ...settings, analyticsEnabled: e.target.checked })
          }
        />
        Abilita statistiche Vercel facoltative (sempre subordinate a consenso).
        Google Analytics e Cookiebot non vengono caricati.
      </label>
      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={settings.reviewed}
          onChange={(e) =>
            setSettings({ ...settings, reviewed: e.target.checked })
          }
        />
        Confermo una revisione professionale delle informative e
        dell’applicabilità dei dati fiscali. Non è una certificazione
        automatica.
      </label>
      <Button onClick={save} disabled={busy}>
        {busy ? "Salvataggio…" : "Salva dati legali"}
      </Button>
      <p role="status">{message}</p>
    </section>
  )
}
export function ComplianceRequest({ request: r }: { request: any }) {
  const router = useRouter(),
    [decision, setDecision] = useState(r.decision || ""),
    [status, setStatus] = useState(r.status),
    [communicated, setCommunicated] = useState(Boolean(r.communicated_at)),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true)
    try {
      const result = await resolveLegalRequest({
        id: r.id,
        status,
        decision,
        communicated,
      })
      setMessage(
        result.success
          ? "Decisione registrata. Nessun contenuto o dato personale cancellato automaticamente."
          : result.error || "Errore"
      )
      if (result.success) router.refresh()
    } catch {
      setMessage("Operazione non riuscita")
    } finally {
      setBusy(false)
    }
  }
  const mail = r.email
    ? `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent(`PuliziAlTop — riscontro richiesta ${r.id}`)}&body=${encodeURIComponent(`${decision}\n\nPer contestare questa decisione: https://www.pulizialtop.it/segnala-un-problema?tipo=reclamo indicando ${r.id}. Restano disponibili i rimedi previsti dalla legge.`)}`
    : ""
  return (
    <article className="space-y-3 rounded border bg-card p-5">
      <h3 className="font-semibold break-all">
        {r.kind} — {r.id}
      </h3>
      <p>
        {new Date(r.created_at).toLocaleString("it-IT")} —{" "}
        {r.name || "Segnalante anonimo"} {r.email}
      </p>
      <p className="break-all">URL: {r.url || "non indicato"}</p>
      <p className="whitespace-pre-wrap break-words">{r.message}</p>
      <label className="block">
        Stato
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="ml-2 rounded border bg-background p-2"
        >
          <option value="open">Aperta</option>
          <option value="in_review">In esame</option>
          <option value="resolved">Conclusa</option>
        </select>
      </label>
      <label className="block space-y-1">
        <span>Motivazione e rimedi (comunicabile agli interessati)</span>
        <Textarea
          value={decision}
          minLength={10}
          maxLength={5000}
          onChange={(e) => setDecision(e.target.value)}
        />
      </label>
      <p className="text-sm">
        Valuta fatti, base legale o regola applicata, eventuale misura e rimedi.
        Se coinvolge una recensione, usa anche la moderazione dedicata: questa
        decisione non ne cambia lo stato. Comunica separatamente all’autore
        quando dovuto senza divulgare i dati del segnalante.
      </p>
      {mail && (
        <a href={mail} className="underline">
          Prepara email di riscontro (invio manuale, non automatico)
        </a>
      )}
      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={communicated}
          onChange={(e) => setCommunicated(e.target.checked)}
        />
        Confermo di avere effettivamente comunicato la decisione agli
        interessati dovuti, o documentato l’eccezione nella motivazione.
      </label>
      <Button disabled={busy || decision.trim().length < 10} onClick={save}>
        Registra decisione
      </Button>
      <p role="status">{message}</p>
    </article>
  )
}
export function ProvenanceAdmin() {
  const [message, setMessage] = useState("")
  async function save(f: FormData) {
    try {
      const r = await saveAgencyProvenance({
        agency_id: Number(f.get("agency_id")),
        source: f.get("source"),
      })
      setMessage(
        r.success
          ? "Provenienza salvata sulla base della verifica dell’operatore."
          : r.error || "Errore"
      )
    } catch {
      setMessage("Operazione non riuscita")
    }
  }
  return (
    <form action={save} className="space-y-3 rounded border p-6">
      <h2 className="text-2xl font-semibold">Provenienza schede</h2>
      <p>
        Imposta lo stato solo dopo aver verificato fonti, poteri di
        rappresentanza e diritti sui materiali. Non certifica la qualità
        dell’impresa. I profili esistenti non vengono riclassificati
        automaticamente.
      </p>
      <label className="block">
        ID agenzia
        <Input type="number" name="agency_id" min={1} required />
      </label>
      <label className="block">
        Origine
        <select
          name="source"
          className="w-full rounded border bg-background p-2"
        >
          <option value="unknown">Da documentare</option>
          <option value="platform">Inserita dalla piattaforma</option>
          <option value="registered">Registrata dall’impresa</option>
          <option value="claimed">
            Profilo rivendicato e autorizzazione controllata
          </option>
        </select>
      </label>
      <Button type="submit">Salva provenienza</Button>
      <p role="status">{message}</p>
    </form>
  )
}

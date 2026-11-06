import { retentionProposals } from "@/lib/legal/retention"
export function RetentionProposals() {
 return <section className="space-y-4"><h2 className="text-2xl font-semibold">Proposte di conservazione — non attive</h2>
 <p>Valori proposti per revisione del titolare, non obblighi di legge né criteri già adottati. Nessuna cancellazione automatica. Il pianificatore offline produce solo candidati da riesaminare e blocca policy non approvate, richieste aperte, vincoli legali o date mancanti. Log e backup richiedono configurazione presso i fornitori.</p>
 <ul className="space-y-3">{retentionProposals.map(p=><li key={p.kind}><strong>{p.kind}: {p.days} giorni, da {p.anchor}.</strong> {p.reason}</li>)}</ul>
 </section>
}

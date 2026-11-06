import { retentionProposals } from "@/lib/legal/retention"
export function RetentionProposals() {
 return <section className="space-y-4"><h2 className="text-2xl font-semibold">Conservazione — criteri titolare e proposte non attivate</h2>
 <p>Le preferenze del titolare sono distinte dalle proposte tecniche residue; nessun periodo è presentato come imposto dalla legge. Nessuna cancellazione automatica. Il pianificatore offline produce solo candidati da riesaminare e blocca policy non approvate, richieste aperte, vincoli legali o date mancanti. Log e backup richiedono configurazione presso i fornitori.</p>
 <ul className="space-y-3">{retentionProposals.map(p=><li key={p.kind}><strong>{p.kind}: {"months" in p ? `${p.months} mesi` : `${p.days} giorni`}, da {p.anchor} ({p.source === "owner-preference" ? "preferenza titolare" : "proposta tecnica"}).</strong> {p.reason}</li>)}</ul>
 </section>
}

// Proposals for review, NOT adopted policy. No scheduler or destructive function.
export const retentionProposals = [
  { kind: "accounts", days: 730, anchor: "last_activity_at", reason: "Riesame dopo 24 mesi di inattività, contatto preventivo; cancellare solo dopo chiusura e verifica obblighi." },
  { kind: "reviews", days: 1095, anchor: "last_reviewed_at", reason: "Riesame triennale della pertinenza: non rimozione automatica di contributi ancora pertinenti; separare email e contenuto pubblico." },
  { kind: "invitations", days: 180, anchor: "sent_at", reason: "Inviti non usati: proposta sei mesi; concordare scadenza dei link prima di invalidare quelli esistenti." },
  { kind: "contacts", days: 180, anchor: "closed_at", reason: "Sei mesi dalla chiusura per richieste ordinarie, salvo obblighi/contestazioni documentate." },
  { kind: "registrations", days: 180, anchor: "closed_at", reason: "Richieste non accolte: sei mesi dalla chiusura; accolte seguono il ciclo account." },
  { kind: "rights", days: 730, anchor: "closed_at", reason: "Due anni dalla chiusura come proposta per rendicontare il riscontro; contenziosi e obblighi da valutare." },
  { kind: "moderation", days: 730, anchor: "closed_at", reason: "Due anni dalla chiusura come proposta per reclami e motivazioni, bilanciando i diritti delle parti." },
  { kind: "logs", days: 30, anchor: "created_at", reason: "Proposta 30 giorni per log tecnici minimizzati; incidenti documentati in registro separato." },
  { kind: "backups", days: 30, anchor: "created_at", reason: "Proposta ciclo 30 giorni se supportato dal piano fornitore; ripristino e reintegro cancellazioni da verificare." },
] as const
export type RetentionKind = typeof retentionProposals[number]["kind"]
export type RetentionPolicy = { approved: boolean; version: string; reviewedAt: string | null; rules: Partial<Record<RetentionKind, { days: number; approved: boolean }>> }
export type RetentionMetadata = { reference: string; kind: RetentionKind; anchor: string | null; closed: boolean; legalHold: boolean | null; reviewed: boolean }
export function planRetention(rows: RetentionMetadata[], policy: RetentionPolicy, now = Date.now()) {
  if (!policy.approved || !policy.version || !policy.reviewedAt || !Number.isFinite(Date.parse(policy.reviewedAt)) || Date.parse(policy.reviewedAt)>now) return { enabled: false, candidates: [], blocked: rows.length }
  const candidates: {reference:string;kind:RetentionKind; action:"manual-review"}[]=[]
  for (const row of rows) {
    const rule=policy.rules[row.kind], date=row.anchor ? Date.parse(row.anchor) : NaN
    if (!rule?.approved || !Number.isInteger(rule.days) || rule.days<1 || !row.closed || row.legalHold!==false || !row.reviewed || !Number.isFinite(date) || date>now) continue
    if (now-date>=rule.days*86400000) candidates.push({reference:row.reference,kind:row.kind,action:"manual-review"})
  }
  return {enabled:true,candidates,blocked:rows.length-candidates.length}
}

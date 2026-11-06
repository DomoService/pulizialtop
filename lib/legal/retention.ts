// Owner preferences dated 2026-11-06, not statutory periods or an activated purge.
// Unspecified treatments remain proposals. Calendar months are not 30-day blocks.
export const retentionProposals = [
  { kind: "accounts", days: 90, anchor: "closed_at", source: "owner-preference", reason: "Durante l’attività dell’account; cancellazione o anonimizzazione entro 90 giorni dalla chiusura, dopo verifica dei dati collegati e degli eventuali vincoli." },
  { kind: "reviews", days: 365, anchor: "last_reviewed_at", source: "technical-proposal", reason: "Conservare finché pubblicate e pertinenti (preferenza titolare). Proposta tecnica: riesame annuale, non cancellazione dopo un anno." },
  { kind: "invitations", days: 180, anchor: "sent_at", source: "technical-proposal", reason: "Proposta sei mesi per inviti non usati; non scadenza applicata ai link esistenti." },
  { kind: "contacts", months: 12, anchor: "closed_at", source: "owner-preference", reason: "Cancellazione entro 12 mesi di calendario dalla chiusura della richiesta; eventuale pratica contrattuale o contenzioso va separata e motivata." },
  { kind: "registrations", days: 180, anchor: "closed_at", source: "technical-proposal", reason: "Richieste non accolte: proposta sei mesi dalla chiusura; accolte seguono il ciclo account." },
  { kind: "rights", days: 730, anchor: "closed_at", source: "technical-proposal", reason: "Proposta due anni dalla chiusura per documentare il riscontro, non obbligo normativo automatico." },
  { kind: "moderation", days: 730, anchor: "closed_at", source: "technical-proposal", reason: "Proposta due anni dalla chiusura per reclami e motivazioni; separare dal contenuto della recensione." },
  { kind: "logs", days: 90, anchor: "created_at", source: "owner-preference", reason: "Obiettivo 90 giorni per log tecnici di sicurezza; incidenti documentati possono richiedere conservazione ulteriore. Non configura la retention dei fornitori." },
  { kind: "backups", days: 30, anchor: "created_at", source: "technical-proposal", reason: "Proposta ciclo 30 giorni solo se supportato dal fornitore, non criterio già approvato né promessa di eliminazione immediata da backup." },
] as const
export type RetentionKind = typeof retentionProposals[number]["kind"]
export type RetentionRule = { approved: boolean; days?: number; months?: number }
export type RetentionPolicy = { approved: boolean; version: string; reviewedAt: string | null; rules: Partial<Record<RetentionKind, RetentionRule>> }
export type RetentionMetadata = { reference: string; kind: RetentionKind; anchor: string | null; closed: boolean; legalHold: boolean | null; reviewed: boolean }
export function retentionDeadline(anchor: number, rule: RetentionRule) {
  if (rule.days !== undefined && rule.months === undefined && Number.isInteger(rule.days) && rule.days>0) return anchor+rule.days*86400000
  if (rule.months !== undefined && rule.days === undefined && Number.isInteger(rule.months) && rule.months>0 && rule.months<=1200) {
    const date=new Date(anchor),day=date.getUTCDate()
    date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth()+rule.months)
    const last=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate()
    date.setUTCDate(Math.min(day,last));return date.getTime()
  }
  return NaN
}
export function planRetention(rows: RetentionMetadata[], policy: RetentionPolicy, now = Date.now()) {
  if (!policy.approved || !policy.version || !policy.reviewedAt || !Number.isFinite(Date.parse(policy.reviewedAt)) || Date.parse(policy.reviewedAt)>now) return { enabled: false, candidates: [], blocked: rows.length }
  const candidates: {reference:string;kind:RetentionKind; action:"manual-review"}[]=[]
  for (const row of rows) {
    const rule=policy.rules[row.kind], date=row.anchor ? Date.parse(row.anchor) : NaN
    if (!rule?.approved || !row.closed || row.legalHold!==false || !row.reviewed || !Number.isFinite(date) || date>now) continue
    if (now>=retentionDeadline(date,rule)) candidates.push({reference:row.reference,kind:row.kind,action:"manual-review"})
  }
  return {enabled:true,candidates,blocked:rows.length-candidates.length}
}

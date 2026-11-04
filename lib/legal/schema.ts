import { z } from "zod"
export const LEGAL_VERSION = "2026-11-04-draft-1"
const text = z.string().trim().max(3000)
export const legalFields = {
  controller: "Nome o denominazione del titolare",
  address: "Sede / indirizzo legale",
  vat: "Partita IVA (se applicabile)",
  fiscalCode: "Codice fiscale (se richiesto)",
  register: "Registro Imprese / REA (se applicabili)",
  contact: "Email contatto piattaforma",
  privacyContact: "Email richieste privacy",
  dpo: "DPO (campo facoltativo per eventuale futura nomina; attualmente non nominato)",
  retentionAccounts: "Criteri / tempi conservazione account",
  retentionReviews: "Criteri / tempi conservazione recensioni",
  retentionRequests: "Criteri / tempi conservazione richieste e segnalazioni",
  retentionLogs: "Criteri / tempi conservazione log e backup",
  suppliers: "Ruoli, contratti e localizzazioni fornitori",
  transfers: "Trasferimenti extra SEE e garanzie",
  publicSources: "Fonti schede e valutazione interesse legittimo",
  applicability: "Valutazione DSA, accessibilità e dati impresa",
} as const
const contact = z.union([z.literal(""), z.string().trim().email().max(255)])
export const legalSettingsSchema = z.object({
  controller: text.default("Barbara Massa — ditta individuale"),
  address: text.default("Via Agostin di Castelvi 8, 09129 Cagliari"),
  vat: text.default("03949710929"),
  fiscalCode: text.default(""),
  register: text.default(""),
  contact: contact.default("info@pulizialtop.it"),
  privacyContact: contact.default("info@pulizialtop.it"),
  dpo: text.default(""),
  retentionAccounts: text.default(""),
  retentionReviews: text.default(""),
  retentionRequests: text.default(""),
  retentionLogs: text.default(""),
  suppliers: text.default(""),
  transfers: text.default(""),
  publicSources: text.default(""),
  applicability: text.default(""),
  analyticsEnabled: z.boolean().default(false),
  reviewed: z.boolean().default(false),
})
export type LegalSettings = z.infer<typeof legalSettingsSchema>
export const defaultLegalSettings = legalSettingsSchema.parse({})
export function missingLegalFields(s: LegalSettings) {
  return (
    [
      "controller",
      "address",
      "vat",
      "fiscalCode",
      "register",
      "contact",
      "privacyContact",
      "retentionAccounts",
      "retentionReviews",
      "retentionRequests",
      "retentionLogs",
      "suppliers",
      "transfers",
      "publicSources",
      "applicability",
    ] as const
  )
    .filter((k) => !s[k])
    .map((k): string => legalFields[k])
    .concat(
      s.reviewed
        ? []
        : ["Revisione professionale e applicabilità dati fiscali da confermare"]
    )
}
export const requestKinds = [
  "privacy",
  "contenuto-illecito",
  "recensione",
  "contestazione",
  "correzione-scheda",
  "rimozione-scheda",
  "rivendicazione",
  "reclamo",
  "accessibilita",
  "contatto",
  "registrazione",
] as const
export const requestSchema = z
  .object({
    kind: z.enum(requestKinds),
    name: z.string().trim().max(255),
    email: z.union([z.literal(""), z.string().trim().email().max(255)]),
    url: z.union([
      z.literal(""),
      z
        .string()
        .url()
        .max(2000)
        .refine((v) => {
          const u = new URL(v)
          return (
            ["https:", "http:"].includes(u.protocol) &&
            !u.username &&
            !u.password
          )
        }),
    ]),
    message: z.string().trim().min(10).max(5000),
    anonymousException: z.boolean().default(false),
    acknowledged: z.literal(true),
    goodFaith: z.boolean(),
    website: z.literal("").default(""),
  })
  .superRefine((v, ctx) => {
    if (
      !(v.kind === "contenuto-illecito" && v.anonymousException) &&
      (!v.name || !v.email)
    )
      ctx.addIssue({ code: "custom", message: "Nome e email richiesti" })
    if (
      [
        "contenuto-illecito",
        "recensione",
        "contestazione",
        "correzione-scheda",
        "rimozione-scheda",
        "rivendicazione",
      ].includes(v.kind) &&
      !v.url
    )
      ctx.addIssue({ code: "custom", message: "Indica l’URL esatto" })
    if (
      ["contenuto-illecito", "recensione", "contestazione", "reclamo"].includes(
        v.kind
      ) &&
      !v.goodFaith
    )
      ctx.addIssue({
        code: "custom",
        message: "Dichiarazione di buona fede richiesta",
      })
  })
export const registrationSchema = z
  .object({
    agency_name: z.string().trim().min(2).max(255),
    contact_name: z.string().trim().min(1).max(255),
    email: z.string().trim().email().max(255),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s().-]{6,25}$/),
    vat: z.string().regex(/^\d{11}$/),
    legal_address: z.string().trim().min(5).max(500),
    business_website: z.union([
      z.literal(""),
      z
        .string()
        .url()
        .max(500)
        .refine((v) => /^https?:\/\//.test(v)),
    ]),
    province: z.string().trim().min(1).max(100),
    services: text,
    message: text,
    terms: z.literal(true),
    privacy: z.literal(true),
    website: z.literal("").default(""),
  })
  .refine(
    (v) => {
      const digits = [...v.vat].map(Number)
      let sum = 0
      for (let i = 0; i < 10; i++) {
        let n = digits[i] * (i % 2 ? 2 : 1)
        if (n > 9) n -= 9
        sum += n
      }
      return digits[10] === (10 - (sum % 10)) % 10 && !/^0+$/.test(v.vat)
    },
    { message: "Partita IVA formalmente non valida" }
  )

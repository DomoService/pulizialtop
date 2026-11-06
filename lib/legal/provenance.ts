// A status flag or created_at is not documentary evidence of an acquisition source.
export function assessProvenance(status: string | null | undefined) {
  if (status === "registered") return {origin:"direct-claimed",evidence:"Stato registrata nel database; richiesta/documenti di inserimento da correlare",needsReview:true}
  if (status === "claimed") return {origin:"claimed",evidence:"Scheda rivendicata: non prova l’origine della prima acquisizione",needsReview:true}
  if (status === "platform") return {origin:"platform",evidence:"Inserita dalla piattaforma; fonte e data di acquisizione non documentate da questo campo",needsReview:true}
  return {origin:"unknown",evidence:"Provenienza non documentata; non dedotta dal sito web o dalla data creazione",needsReview:true}
}

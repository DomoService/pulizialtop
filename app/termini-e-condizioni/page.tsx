import Link from "next/link"
import { LegalPage, LegalSection } from "@/components/legal-page"
export const metadata = {
  title: "Termini e Condizioni",
  alternates: { canonical: "https://pulizialtop.it/termini-e-condizioni" },
}
export default function Page() {
  return (
    <LegalPage title="Termini e Condizioni">
      <p>
        Versione 2026-11-04-draft-1, da verificare professionalmente prima del
        rilascio definitivo. Identità del gestore nelle{" "}
        <Link href="/informazioni-legali" className="underline">
          Informazioni Legali
        </Link>
        .
      </p>
      <LegalSection title="Servizio della piattaforma">
        <p>
          PuliziAlTop è una piattaforma digitale per individuare imprese di
          pulizia e manutenzione e consultare informazioni e recensioni. Non
          esegue direttamente i servizi di pulizia, salvo diversa indicazione
          esplicita. Preventivi, prezzi, contratti, disponibilità e prestazioni
          sono concordati con le singole imprese. La presenza in elenco non
          garantisce qualità, certificazioni o partnership.
        </p>
      </LegalSection>
      <LegalSection title="Registrazione e schede">
        <p>
          Le imprese devono fornire dati veritieri, aggiornati e utilizzabili
          lecitamente. La richiesta non comporta approvazione o pubblicazione
          automatica. Referente e documenti di gestione non sono pubblicati
          automaticamente. L’eventuale rivendicazione richiede una verifica dei
          poteri del richiedente e non certifica la qualità del servizio.
        </p>
        <p>
          Una scheda può essere registrata, inserita dalla piattaforma,
          rivendicata o avere provenienza non ancora documentata. Lo stato è
          indicato solo quando documentato. Per correzioni, rivendicazioni o
          rimozioni quando dovute usa{" "}
          <Link href="/segnala-un-problema" className="underline">
            Segnala un problema
          </Link>
          .
        </p>
      </LegalSection>
      <LegalSection title="Recensioni e condotte vietate">
        <p>
          Le recensioni devono descrivere esperienze autentiche. Sono vietati
          contributi falsi, acquistati, offensivi, discriminatori, diffamatori,
          spam e divulgazione di dati personali non necessari. Non inviare
          contenuti illeciti, credenziali o materiali di cui non possiedi i
          diritti. La moderazione non costituisce prova dell’acquisto o
          dell’utilizzo del servizio.
        </p>
        <p>
          Le recensioni positive e negative sono soggette alle stesse regole.
          Consulta le{" "}
          <Link href="/regole-recensioni" className="underline">
            regole di moderazione e contestazione
          </Link>
          .
        </p>
      </LegalSection>
      <LegalSection title="Segnalazioni, decisioni e reclami">
        <p>
          Segnala il contenuto preciso con URL, motivazioni e contatto per il
          riscontro, dichiarando buona fede. Il gestore valuta diligentemente e
          con intervento umano, può chiedere chiarimenti e adotta misure
          proporzionate. Le decisioni sono motivate e comunicate agli
          interessati nei casi previsti; è possibile contestarle mediante il
          modulo. Nessuna pubblicazione è rimossa automaticamente per il solo
          fatto di una contestazione.
        </p>
      </LegalSection>
      <LegalSection title="Proprietà intellettuale">
        <p>
          Testi, loghi e immagini appartengono ai rispettivi aventi diritto.
          Essere disponibili sul web non implica libertà di riutilizzo. Chi
          carica materiali deve essere autorizzato al loro uso e alla
          pubblicazione necessaria al servizio; non viene richiesto un
          trasferimento generale dei diritti. L’uso di marchi serve a
          identificare l’impresa e non implica affiliazione. Le contestazioni
          sui diritti possono essere inviate tramite il modulo.
        </p>
      </LegalSection>
      <LegalSection title="Responsabilità e norme inderogabili">
        <p>
          Il gestore non garantisce automaticamente completezza delle schede o
          qualità delle prestazioni delle imprese. Interviene sulle inesattezze
          segnalate secondo le procedure pubblicate. Nessuna disposizione
          esclude responsabilità inderogabili, dolo o colpa grave, né limita i
          diritti dei consumatori o i rimedi previsti dalla legge. Le condizioni
          dei singoli servizi restano tra utente e impresa.
        </p>
        <p>
          Le modifiche ai termini saranno pubblicate con versione aggiornata;
          quelle rilevanti per rapporti in corso richiedono le comunicazioni
          dovute. Si applicano le norme italiane ed europee pertinenti, senza
          derogare al foro o alle tutele inderogabili del consumatore.
        </p>
      </LegalSection>
    </LegalPage>
  )
}

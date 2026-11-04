import Link from "next/link"
import { LegalPage, LegalSection, Missing } from "@/components/legal-page"
import { getLegalSettings } from "@/lib/legal/data"
import { LEGAL_VERSION, missingLegalFields } from "@/lib/legal/schema"
export const metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "https://pulizialtop.it/privacy-policy" },
}
export default async function Page() {
  const { settings: s } = await getLegalSettings()
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Informativa ai sensi degli artt. 12, 13 e 14 GDPR. Versione{" "}
        {LEGAL_VERSION}.{" "}
        {missingLegalFields(s).length > 0 &&
          "Bozza: informazioni del titolare e valutazioni da completare prima del rilascio definitivo. Non è una certificazione di conformità."}
      </p>
      <LegalSection title="Titolare, contatti e richieste">
        <p>
          Titolare:{" "}
          <Missing value={s.controller} label="identità del titolare" />. Sede:{" "}
          <Missing value={s.address} label="indirizzo" />. Contatto privacy:{" "}
          <a
            className="underline"
            href={`mailto:${s.privacyContact || "info@pulizialtop.it"}`}
          >
            {s.privacyContact || "info@pulizialtop.it"}
          </a>{" "}
          (oggetto: Privacy).
        </p>
        <p>
          Puoi usare anche il{" "}
          <Link className="underline" href="/segnala-un-problema?tipo=privacy">
            modulo richieste privacy
          </Link>
          . Non inviare password, dati sanitari o copie integrali di documenti.
          Eventuali verifiche d’identità saranno proporzionate alla richiesta.
        </p>
      </LegalSection>
      <LegalSection title="Dati, finalità e basi giuridiche">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Navigazione, log tecnici e sessioni Supabase: erogazione,
            autenticazione e sicurezza. Esecuzione del servizio richiesto (art.
            6.1.b); prevenzione abusi e sicurezza come interesse legittimo
            (6.1.f), da documentare nel bilanciamento.
          </li>
          <li>
            Richieste di contatto e registrazione: dati aziendali, referente,
            email, telefono e messaggio per rispondere o valutare l’inserimento;
            misure precontrattuali/servizio richiesto (6.1.b). Il referente non
            è pubblicato automaticamente.
          </li>
          <li>
            Recensioni: nome scelto, email privata, valutazione e testo.
            Pubblicazione del contributo richiesto (6.1.b); moderazione, tutela
            dei diritti e contrasto agli abusi (6.1.f); obblighi legali quando
            applicabili (6.1.c). Il nome scelto e il testo possono essere
            pubblici: non inserire dati di terzi non necessari.
          </li>
          <li>
            Segnalazioni, reclami, correzioni e diritti: dati di contatto, URL,
            motivazioni e decisioni; gestione della richiesta (6.1.b),
            adempimenti applicabili GDPR/DSA (6.1.c), difesa dei diritti
            (6.1.f).
          </li>
          <li>
            Statistiche Vercel facoltative, se abilitate dal titolare: solo dopo
            scelta dell’utente, su consenso (6.1.a). Nessuna iscrizione
            marketing è attivata da questi moduli.
          </li>
        </ul>
        <p>
          Le basi giuridiche e il bilanciamento degli interessi devono essere
          confermati dal titolare in base all’attività effettiva. I campi
          contrassegnati come richiesti sono necessari per gestire la specifica
          richiesta; gli altri sono facoltativi. La mancata comunicazione dei
          dati necessari può impedire di rispondere, senza limitare la normale
          consultazione.
        </p>
      </LegalSection>
      <LegalSection title="Schede da fonti pubbliche: art. 14 GDPR">
        <p>
          Alcune schede possono essere inserite dalla piattaforma e non
          costituiscono adesione o partnership. Fonti, categorie di dati e
          bilanciamento:{" "}
          <Missing
            value={s.publicSources}
            label="fonti effettive, dati aziendali e valutazione interesse legittimo"
          />
          . I dati pubblici non sono automaticamente riutilizzabili senza
          limiti.
        </p>
        <p>
          Quando applicabile, il titolare deve fornire l’informativa individuale
          nei termini dell’art. 14 (entro un mese, oppure prima
          comunicazione/divulgazione se precedente); eventuali esenzioni
          richiedono una valutazione documentata. Questa pagina da sola non
          sostituisce tale adempimento.
        </p>
      </LegalSection>
      <LegalSection title="Destinatari, fornitori e trasferimenti">
        <p>
          Vercel ospita l’applicazione e tratta dati tecnici; Supabase fornisce
          database, autenticazione e archiviazione immagini. Aruba gestisce DNS
          e posta esistente. Vercel Web Analytics è opzionale. Cookiebot e
          Google Analytics sono stati rimossi dal caricamento dell’app in questa
          versione. Resend è in configurazione per future notifiche, non è
          ancora integrato nell’invio applicativo.
        </p>
        <p>
          Persone autorizzate possono gestire richieste e contenuti. Ruoli,
          contratti art. 28, subfornitori e regioni effettive:{" "}
          <Missing
            value={s.suppliers}
            label="elenco fornitori, ruoli e localizzazioni"
          />
          .
        </p>
        <p>
          Trasferimenti extra SEE, eventuali decisioni di adeguatezza o garanzie
          art. 46 e modalità per ottenerne copia:{" "}
          <Missing
            value={s.transfers}
            label="verifica trasferimenti, SCC e misure supplementari"
          />
          . Non si presume che tutti i dati restino nell’UE.
        </p>
      </LegalSection>
      <LegalSection title="Conservazione e sicurezza">
        <p>
          Account:{" "}
          <Missing
            value={s.retentionAccounts}
            label="tempi o criteri account"
          />
          .
        </p>
        <p>
          Recensioni:{" "}
          <Missing
            value={s.retentionReviews}
            label="tempi o criteri recensioni"
          />
          .
        </p>
        <p>
          Contatti, registrazioni, segnalazioni e richieste:{" "}
          <Missing
            value={s.retentionRequests}
            label="tempi o criteri richieste"
          />
          .
        </p>
        <p>
          Log e backup:{" "}
          <Missing
            value={s.retentionLogs}
            label="tempi o criteri log e backup"
          />
          .
        </p>
        <p>
          I criteri devono distinguere necessità operative, obblighi legali,
          contenziosi e copie di backup. Non è attiva una cancellazione
          automatica basata su questi testi. Accessi autorizzati, validazione e
          policy riducono i rischi ma non garantiscono sicurezza assoluta;
          l’audit di produzione resta necessario.
        </p>
      </LegalSection>
      <LegalSection title="Diritti, riscontri e reclamo">
        <p>
          Nei casi e limiti previsti dagli artt. 15–22 GDPR puoi chiedere
          accesso, rettifica, cancellazione, limitazione, portabilità e
          opposizione. Puoi revocare il consenso senza pregiudicare i
          trattamenti precedenti. Non tutte le richieste comportano
          cancellazione immediata: vanno valutati obblighi di legge e diritti di
          terzi.
        </p>
        <p>
          Riscontro senza ingiustificato ritardo e di norma entro un mese, con
          eventuale proroga motivata nei casi previsti dall’art. 12. Puoi
          proporre reclamo al{" "}
          <a className="underline" href="https://www.garanteprivacy.it">
            Garante per la protezione dei dati personali
          </a>{" "}
          o rivolgerti all’autorità giudiziaria.
        </p>
        <p>
          Non sono previsti dal codice processi decisionali esclusivamente
          automatizzati con effetti giuridici: le decisioni di moderazione
          richiedono intervento umano. Per i cookie e le preferenze consulta la{" "}
          <Link className="underline" href="/cookie-policy">
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}

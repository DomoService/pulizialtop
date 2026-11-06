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
          "Questa versione descrive i flussi tecnici rilevati. La verifica dei criteri organizzativi e delle condizioni dei fornitori non è conclusa: non attesta conformità legale né una conservazione già configurata."}
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
      <LegalSection title="Account agenzie, inviti e preventivi">
        <p>Account agenzie: email di accesso, credenziali gestite da Supabase Auth,
          sessione e associazione alla scheda per l’area riservata e il recupero password
          (art. 6.1.b GDPR); controlli di accesso e prevenzione abusi (6.1.f).
          I recapiti pubblici dell’impresa sono distinti dai dati privati dei clienti.</p>
        <p>Inviti alle recensioni: l’agenzia inserisce nome ed email del cliente per
          generare un link riservato; il cliente sceglie il nome pubblico e il testo.
          L’email del cliente e il token non sono pubblicati. Il codice genera il link,
          non invia automaticamente l’invito. Il titolare deve confermare e documentare
          con l’agenzia ruoli, liceità della comunicazione dei dati del cliente e base
          giuridica dell’invito (eventuale interesse legittimo, art. 6.1.f, previa
          verifica di aspettative e bilanciamento; nessun riuso promozionale implicito).</p>
        <p>Preventivi: i pulsanti telefono/email aprono un contatto diretto con
          l’impresa scelta. Non è presente un inoltro automatico multi-agenzia.
          Inviando l’email comunichi al destinatario l’indirizzo mittente e quanto
          scrivi; la piattaforma non riceve automaticamente quel messaggio.
          Le richieste dal modulo Contattaci vanno invece al gestore del sito.
          L’impresa destinataria deve fornire la propria informativa.</p>
        <p>Destinatari: il gestore e i suoi autorizzati gestiscono i contatti; ogni
          agenzia autorizzata gestisce i propri inviti. I fornitori tecnici indicati
          sotto trattano i dati necessari al servizio. Criteri di conservazione:
          account e relativi collegamenti seguono la sezione account; inviti,
          contatti e preventivi ricevuti dal gestore la sezione richieste; contributi
          pubblicati la sezione recensioni. Contratti, trasferimenti e durate devono
          essere confermati dal titolare prima dell’informativa definitiva.</p>
      </LegalSection>
      <LegalSection title="Schede da fonti pubbliche: art. 14 GDPR">
        <p>
          Alcune schede possono essere inserite dalla piattaforma e non
          costituiscono adesione o partnership. Fonti, categorie di dati e
          bilanciamento:{" "}
          <Missing
            value={s.publicSources || "Le schede possono provenire da siti aziendali o segnalazioni; la fonte per ciascuna scheda va richiesta al gestore. Non si presume una verifica indipendente o adesione dell’impresa."}
            label="fonti effettive, dati aziendali e valutazione interesse legittimo"
          />
          . I dati pubblici non sono automaticamente riutilizzabili senza
          limiti. Per ditte individuali e professionisti vanno valutati anche
          i dati che identificano la persona fisica. Puoi chiedere correzione,
          rivendicazione o rimozione attraverso il <Link href="/segnala-un-problema" className="underline">modulo dedicato</Link>;
          la richiesta è valutata dal gestore e non comporta cancellazione automatica.
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
          database, autenticazione e archiviazione immagini. Aruba è il gestore della posta indicato dal titolare; la configurazione SMTP attuale non è stata letta da questa sessione. Vercel Web Analytics è opzionale. Cookiebot e
          Google Analytics sono stati rimossi dal caricamento dell’app in questa
          versione. Resend è in configurazione per future notifiche, non è
          ancora integrato nell’invio applicativo.
        </p>
        <p>
          Persone autorizzate possono gestire richieste e contenuti. Ruoli,
          contratti art. 28, subfornitori e regioni effettive:{" "}
          <Missing
            value={s.suppliers || "I fornitori tecnici rilevati sono elencati sopra. Non sono stati verificati contratti, subfornitori o localizzazioni effettive; non viene dichiarata la firma di accordi specifici."}
            label="elenco fornitori, ruoli e localizzazioni"
          />
          .
        </p>
        <p>
          Trasferimenti extra SEE, eventuali decisioni di adeguatezza o garanzie
          art. 46 e modalità per ottenerne copia:{" "}
          <Missing
            value={s.transfers || "La presenza di Vercel o Supabase non dimostra che i dati restino nel SEE. Non sono state verificate regioni, trasferimenti o garanzie contrattuali applicate a questo progetto. Per queste informazioni contatta il titolare."}
            label="verifica trasferimenti, SCC e misure supplementari"
          />
          . Non si presume che tutti i dati restino nell’UE.
        </p>
      </LegalSection>
      <LegalSection title="Conservazione e sicurezza">
        <p>Preferenze comunicate dal titolare il 6 novembre 2026: contatti entro
          12 mesi dalla chiusura; account durante l’attività e cancellazione o
          anonimizzazione entro 90 giorni dalla chiusura; log di sicurezza 90 giorni,
          salvo incidenti documentati; recensioni finché pubblicate e pertinenti con
          riesame periodico. Non sono periodi imposti dalla legge, né attestazione
          di una cancellazione automatica già attivata sui dati esistenti. I criteri
          operativi e le impostazioni dei fornitori devono essere allineati prima
          del rilascio definitivo. Le informazioni specifiche sotto distinguono
          i trattamenti e gli eventuali valori già registrati dal gestore.</p>
        <p>
          Account:{" "}
          <Missing
            value={s.retentionAccounts || "Il titolare propone la conservazione durante l’attività dell’account e la cancellazione o anonimizzazione entro 90 giorni dalla chiusura. Il criterio non è una durata imposta dalla legge; non è attivata una cancellazione automatica e vanno verificati obblighi e dati collegati."}
            label="tempi o criteri account"
          />
          .
        </p>
        <p>
          Recensioni:{" "}
          <Missing
            value={s.retentionReviews || "Il criterio indicato dal titolare è conservare le recensioni finché pubblicate e pertinenti, con riesame periodico della necessità. Non è prevista una scadenza automatica del contenuto; email privata e registri di moderazione richiedono una valutazione separata."}
            label="tempi o criteri recensioni"
          />
          .
        </p>
        <p>
          Contatti, registrazioni, segnalazioni e richieste:{" "}
          <Missing
            value={s.retentionRequests || "Per i contatti il titolare propone la cancellazione entro 12 mesi dalla chiusura. Eventuali pratiche contrattuali o controversie sono separate con motivazione. I termini per registrazioni, inviti, segnalazioni e richieste di diritti sono distinti e non si presumono identici; non è attiva una cancellazione automatica."}
            label="tempi o criteri richieste"
          />
          .
        </p>
        <p>
          Log e backup:{" "}
          <Missing
            value={s.retentionLogs || "Il titolare indica un obiettivo di 90 giorni per i log tecnici di sicurezza, salvo incidenti documentati. I log applicativi sono minimizzati; la disponibilità e durata effettive dipendono dai fornitori e non sono qui attestate. I backup seguono un ciclo distinto, da verificare anche in caso di ripristino."}
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

# Privacy, cookie e accessi — 6 novembre 2026

Intervento sul ramo `feat/legal-transparency`, base c00d48a, integrando la PR #5
(esistente) e NON il vecchio main statico. Nessuna attestazione di conformità legale.
Nessuna migrazione Supabase, invio email, cancellazione o promozione in produzione
in questo intervento. I precedenti documenti del 4/5 novembre sono storici.

## Implementazione incrementale

- Preferenze centralizzate: Accetta tutti / Rifiuta non necessari / Personalizza
  con stesso componente e variante; tecnici sempre attivi, solo categoria statistiche
  se il titolare l'ha abilitata. Default analyticsEnabled=false. Nessuna categoria
  marketing, nessun banner automatico se non serve consenso. Link permanente footer.
- X ed Esc equivalgono a soli necessari, anche alla riapertura. Focus ritorna al
  comando di apertura; dialog Radix con tastiera e scroll su mobile. Privacy e Cookie
  Policy disponibili nel dialogo. Nessuno scroll/navigation consent.
- Scelta locale con versione, data e scadenza a sei mesi di calendario; conserva
  rifiuti legacy validi senza forzarne il rinnovo per il solo nuovo campo data.
  Check scadenza al focus/ogni minuto e al singolo evento. Nessun ID/IP/registro server.
- SDK Vercel non montato prima della scelta; il filtro legge lo stato vivo, non una
  closure della vecchia pagina. Diniego anche su login e recupero agenzie, admin,
  inviti, recensioni via token, moduli e dashboard. Query/hash rimossi; eventi custom
  esclusi (non usati nel sito). Revoca blocca callback subito, cancella GA legacy
  raggiungibili e ricarica; altre schede ricevono evento storage. Nessuna promessa
  di eliminare richieste già inviate o cookie HttpOnly/terze parti irraggiungibili.
- Contatti: presa visione distinta da consenso; informativa breve art.6.1.b per
  rispondere alla richiesta/precontratto, nessun marketing, nessun inoltro automatico
  alle imprese. Basi da validare dal titolare per i casi diversi/preposti aziendali.
- Informativa estesa integrata con account, inviti e ruoli da confermare, preventivi
  via contatti diretti, destinatari e rinvii ai criteri di conservazione. Diritti,
  correzione/rivendicazione/rimozione e art.14 già presenti, ora esplicitati per
  professionisti/ditte individuali. Nessuna falsa verifica acquisto/certificazione.
- Cookie Supabase Secure in produzione e SameSite=Lax espliciti su client/server/
  middleware. Non HttpOnly: il client SSR/browser deve gestire Auth/PKCE, cambiare
  tale opzione unilateralmente romperebbe il flusso. Resta da confermare durata
  sessione effettiva nel fornitore; default libreria NON è durata token.
- Autorizzazione agenzia usa RPC esistente `can_manage_agency_invites`: verifica
  fresca dell'identità confermata e associazione UNIVOCA. Fallisce chiusa se RPC
  assente/nega. Non deduce proprietà da localStorage o user_metadata. Admin distinto.
- Vecchio percorso recensioni token ora riusa validazione/dichiarazioni/modulo
  accessibile e RPC stretta; niente SELECT del token o INSERT pubblico in tabella.
  Script 009 SOLO TEST da revisionare/applicare separatamente dopo 004. Se assente
  il flusso restituisce errore, NON dichiarare risolto sul DB live. Link UUID vecchi
  preservati, nessuna scadenza inventata. Inviti monouso rimangono nel precedente 008.
- Log applicativi legacy rimossi/minimizzati a codice errore, mai payload, email,
  token, nome upload o URL Storage. Header no-referrer e no-store sui flussi token.
- Immagini: URL locali e Storage pubblico dello stesso progetto ammessi; host
  arbitrari nei dati non caricati dal browser, fallback grafico locale. Eventuali
  loghi esterni richiedono importazione autorizzata in Storage, non fetch proxy aperti.

## Inventario codice e dipendenze installate

| Strumento | Categoria, dati e durata / verifica |
|---|---|
| Vercel hosting | Tecnico, richieste e log server; impostazioni log/regioni/DPA non lette |
| @vercel/analytics 1.5.0 | Statistiche facoltative opt-in; SDK /_vercel/insights/script.js. Non esente solo perché cookieless. Fornitore descrive hash da richiesta, sessione 24h, non cookie `_vercel_analytics`. Conservazione aggregati/configurazione da confermare |
| GA4 G-FXSFE7DZCP | Rimosso dal layout prima di questo intervento; _ga*, _gid, _gat legacy eliminati al rifiuto dove gestibili. Non categoria attiva |
| Cookiebot | Rimosso dal layout prima di questo intervento; nessun nuovo SDK |
| Supabase Auth, @supabase/ssr 0.7.0 / supabase-js 2.81.1 | Tecnici login/PKCE: sb-<progetto>-auth-token e frammenti .0/.1; -code-verifier durante recupero. Default libreria maxAge 400 giorni; token/sessioni dipendono dalle impostazioni Auth, da rilevare su account di prova |
| localStorage pulizialtop-consent-v1 | Tecnico: version, analytics, savedAt, expires. Sei mesi, nessun identificatore e nessun invio al server. Legacy senza savedAt accettato fino alla scadenza |
| sidebar_state | Cookie tecnico di componente UI, 7 giorni; componente non usato dai percorsi analizzati. Non dichiarato installato su tutti i visitatori |
| sessionStorage | Nessun uso rilevato nel codice applicativo |
| next/font Inter | File serviti dall'app; il download font al build non è una richiesta Google del visitatore |
| Storage immagini/locali | Contenuti necessari della directory, no-referrer; host dati esterni ora esclusi. Bucket/grant live non verificati |
| Clipboard | navigator.clipboard soltanto dopo pulsante Copia. Nessuna geolocalizzazione/camera/notifica rilevata |
| Mappe/video/pixel/CAPTCHA | Nessun incorporamento attivo rilevato; non aggiunte categorie fittizie |
| Email Aruba / Resend | Aruba riferito dal gestore e documenti preesistenti; Resend non integrato nell'invio automatico del codice. SMTP Auth/fornitori reali richiedono controllo esterno |
| Link tel/mailto/website impresa | Navigazione esplicita; non inoltro automatico multiazienda. Destinatario riceve ciò che l'utente decide di inviare |

Cercati dipendenze, script, fetch, storage browser, immagini e permessi in app,
components, lib, assets e public. I vecchi HTML root non sono l'app Next.js attiva:
non ridistribuirli tramite preset statico. Non è una scansione dei dati nel DB,
servizi iniettati dalla dashboard, estensioni del visitatore o link esterni visitati.

## Test

- 38 test Bun in processi separati passati (suite con mock isolati): controlli
  admin/agenzia, cambi sessione, RPC mancante/ambigua, recensioni, inviti, validazione
  richieste, date/rifiuto persistente, esclusione percorsi, revoca, URL redaction,
  immagini e assenza di chiavi privilegiate aggiunte al browser nel diff.
- TypeScript `tsc --noEmit` passato; diff --check passato. Lint non eseguibile:
  eslint non è una dipendenza del progetto. Non aggiunto né indebolito un controllo.
- PGlite: 22 asserzioni della migrazione 005 passate. Nuova fixture 009: riesecuzione,
  lookup minimo, scrittura pending e diniego dati privati/token invalido passati.
  Fixture non sostituisce schema, trigger e cooldown reali del fornitore.
- Browser isolato: test in tests/privacy-browser.mjs (Playwright installato fuori
  dal progetto), vero componente e injector SDK, Next routing simulato, endpoint
  analytics intercettato per NON inviare dati di test. Non è analisi del backend Vercel.
  Passati su 1280×800 e 390×844: primo accesso, rifiuto e reload,
  consenso selettivo, accettazione, navigazione riservata, revoca, rimozione GA,
  X, Esc e modalità soli tecnici. Per preview reale vedere consegna PR.
- Login e azioni con scrittura reale non eseguiti: nessun account test documentato
  disponibile alla sessione; non chiedere password in chat e non usare utenti reali.

## Impostazioni esterne / blocchi al rilascio

1. Supabase: audit ATTUALE di grant, RLS, viste, RPC/SECURITY DEFINER, sequenze,
   Storage e bucket, non fidarsi degli export di ottobre o del contenimento riferito.
   I server guard non proteggono da chiamate REST dirette con chiave pubblica.
   Verificare migrazioni 003/004/005/007/008/009 sul DB separato, privilegi anon e
   utente A/B, assenza lettura email clienti/token/password e scritture non proprie.
   Non eseguita alcuna migrazione in questa sessione. Non aprire SELECT generale.
2. Test SMTP, callback/redirect Auth e sessioni su account di prova autorizzati.
   Nessuna service_role nel browser o esportazione di segreti. Upload logo richiede
   ulteriore verifica dei contenuti e policy Storage; non è protetto da solo dal form.
3. Vercel: disabilitare strumenti eventualmente iniettati fuori dall'app, verificare
   Analytics/Speed Insights, log drain, retention, accessi, regioni e contratti.
   Non sono state cambiate configurazioni team o servizi esterni.
4. Antiabuso: honeypot, schema e cooldown DB esistenti sono difese parziali. Rate
   limit distribuito/WAF, soglie e un eventuale CAPTCHA richiedono servizio scelto,
   valutazione privacy/accessibilità e test. Non dichiarato antispam completo.
5. Controllare domini immagini reali: eventuali loghi esterni ora hanno fallback
   locale. Trasferire contenuti legittimi al proprio Storage prima di ripristinarli.
6. Informative restano bozze con campi mancanti visibili. Non pubblicare come
   definitive; nessuna garanzia GDPR/art.122 o verifica professionale sostituita.

## Decisioni del titolare e procedura operativa

- Barbara Massa e info@pulizialtop.it sono coerenti col codice/contesto; i default
  indirizzo/P.IVA già presenti nel ramo sono attribuiti da documenti precedenti al
  gestore ma NON riconfermati in questo intervento. Non inventati nuovi recapiti,
  DPO, fornitori, SCC o numeri fiscali. Verificare anche override delle impostazioni DB.
- Confermare basi per contatti professionali, inviti clienti e bilanciamenti 6.1.f;
  per schede da fonti pubbliche documentare fonte per record, categorie, provenienza,
  legittimità riuso e informativa individuale art.14 nei termini, o eccezione motivata.
- Approvare criteri/durate distinti account, inviti, recensioni, richieste, log,
  audit e backup; blocchi per contenzioso e modalità di uscita dai backup. Nessuna
  cancellazione automatica o tempo arbitrario introdotto per colmare i campi vuoti.
- Diritti: registrare il riferimento richiesta nel pannello riservato; verificare
  identità con email/account o evidenze proporzionate, non documenti indiscriminati;
  cercare dati solo come autorizzato; oscurare dati di terzi negli export; valutare
  rettifica/cancellazione/limitazione e obblighi di conservazione; eseguire manualmente
  le operazioni autorizzate sul fornitore; registrare esito e comunicazione; riscontro
  entro art.12. Segnalare recupero da backup e reintegrare eventuali cancellazioni.
  Nessun nuovo endpoint di export/cancellazione pubblica né cron distruttivo.
- Definire responsabile operativo dei riscontri e incidenti, registro trattamenti,
  DPA e subresponsabili Vercel/Supabase/email, trasferimenti extra SEE e reali
  garanzie applicabili: non presumere esenzione per dominio UE o assenza cookie.

## Fonti ufficiali consultate

- https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- https://www.garanteprivacy.it/faq/cookie
- https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it
  (letto anche testo EUR-Lex CELEX 32016R0679 in italiano)
- https://vercel.com/docs/analytics/privacy-policy
- https://vercel.com/docs/analytics/redacting-sensitive-data

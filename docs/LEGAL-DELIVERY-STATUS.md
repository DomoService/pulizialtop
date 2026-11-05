# Stato consegna — 4 novembre 2026

Bozza tecnica, non attestazione di conformità. Nessuna migrazione o nuova pubblicazione
in produzione effettuata. Questo aggiornamento integra la PR #5 già esistente.

## A. Interventi completati

| Elemento | Classificazione | Evidenza / limite |
| --- | --- | --- |
| Informative, termini, regole recensioni, footer, moduli e area admin | IMPLEMENTATO MA DA VERIFICARE | Preview precedente 713a2e5; moduli reali e area autenticata richiedono setup DB |
| Dati titolare forniti e autorizzati | IMPLEMENTATO MA DA VERIFICARE | Barbara Massa, ditta individuale, indirizzo e P.IVA nei default pubblici; eventuali impostazioni DB preesistenti prevalgono e vanno controllate |
| Pagina Diritti Privacy e collegamenti | IMPLEMENTATO MA DA VERIFICARE | Codice e build da verificare nella nuova preview |
| Preservazione dati produzione durante questo lavoro | COMPLETATO E VERIFICATO | Nessun comando di migrazione o scrittura applicativa su produzione eseguito |
| Schema aggiuntivo richieste / eventi / configurazione | IMPLEMENTATO MA DA VERIFICARE | Script 005 non applicato; fixture isolata testata, non prova funzionamento live |

## B. Sicurezza

| Elemento | Classificazione | Evidenza / limite |
| --- | --- | --- |
| Guardie server ruoli e schema di RLS delle nuove tabelle | COMPLETATO E VERIFICATO | Test locali di rifiuto anonimo e fixture SQL; non audit delle policy attualmente online |
| Stato RLS/grant live, Storage, tutte le RPC e sequenze | IMPLEMENTATO MA DA VERIFICARE | Vecchi export e contenimento sono storici; servono letture metadati attuali autorizzate dall’operatore Supabase |
| Backup esportato e copia DMG cifrata su Drive | IMPLEMENTATO MA DA VERIFICARE | Evidenza operatore: dump completati, encrypted YES e upload completato; password/apertura e ripristino isolato non verificati; file Storage esclusi |
| Rate limit distribuito / CAPTCHA | DA IMPLEMENTARE | Cooldown email e honeypot sono parziali, non protezione completa |
| CSP compatibile con app e servizi | DA IMPLEMENTARE | nosniff/referrer presenti; CSP rigorosa richiede test runtime con nonce/script e origini effettive, non introdotta alla cieca |
| Minimizzazione log legacy e flussi token/invito | DA IMPLEMENTARE | Percorsi precedenti necessitano revisione dedicata, non certificati dal nuovo form pubblico |
| Nessuna chiave privilegiata aggiunta al frontend | COMPLETATO E VERIFICATO | Modifiche ispezionate usano client sessione e RPC; non è scansione storica di ogni deployment |

## C. Privacy e GDPR

| Elemento | Classificazione | Evidenza / limite |
| --- | --- | --- |
| Separazione consenso, contratto, obblighi e interesse legittimo | IMPLEMENTATO MA DA VERIFICARE | Testi della bozza; valutazione titolare/consulente necessaria |
| Disattivazione di default statistiche e rimozione GA4/Cookiebot | COMPLETATO E VERIFICATO | Sorgente e preview precedente senza banner automatico; scansione rete/browser completa non eseguita |
| Accetta/rifiuta/personalizza/revoca con statistiche abilitate | IMPLEMENTATO MA DA VERIFICARE | Controlli nel codice, preferenze locali versionate; scenario opt-in e SDK attivo non verificato end-to-end |
| Richieste privacy / segnalazioni | IMPLEMENTATO MA DA VERIFICARE | Validazione, RPC, motivazione e audit in fixture; migrazione live necessaria |
| Contatti preventivo alle imprese | NON APPLICABILE | Nel flusso esaminato sono link tel/mailto diretti, non un nuovo inoltro automatico multi-impresa; rivalutare se si introduce tale funzione |
| Marketing automatico | NON APPLICABILE | Nessuna campagna/opt-in marketing aggiunto; non dedotto consenso da richieste operative |
| DSA/EAA e obblighi ulteriori | IN ATTESA DI INFORMAZIONI | Dati economici, classificazione attività e modello di servizio da valutare; non presunte esenzioni |

## D. Informazioni mancanti

IN ATTESA DI INFORMAZIONI:
- CF se richiesto, Registro Imprese/REA se applicabili ed eventuale rappresentante:
  indicare dati oppure non applicabilità motivata, non inventarli.
- DPO: il titolare ha confermato che non è nominato. Le informative pubbliche non
  indicano un DPO; il contatto per i diritti resta il titolare. Non si attesta
  l’esenzione dall’art.37 GDPR: rivalutare al mutare dei trattamenti.
- Criteri/tempi per account, recensioni, contatti/richieste, log e backup;
  approvazione titolare, eventuali obblighi legali e contenziosi.
- Contratti/DPA, localizzazioni effettive Vercel/Supabase, subfornitori,
  trasferimenti e garanzie. Non basta una regione DB UE a escludere trasferimenti.
- Fonti/diritti per ciascuna scheda e materiale, bilanciamento e adempimenti art.14.
- Persona/processo responsabile di richieste privacy e segnalazioni, disponibilità
  al riscontro, criteri motivazioni, procedura reclami e gestione incidenti.

## E. Interventi da completare

DA IMPLEMENTARE / VERIFICARE prima di pubblicazione definitiva:
1. Revisione professionale, completamento di tutti i segnaposto e approvazione testi.
2. Prova di ripristino su ambiente separato e copia degli oggetti Storage.
3. Revisione migrazione 005 e test DB isolato con ruoli reali, poi esecuzione operatore.
4. Test autenticati con account autorizzati: richieste, decisioni, impresa, moderazione,
   registrazione e minimizzazione dei dati pubblici. Non creare prove fittizie online.
5. Rate limit robusto, CSP e revisione log/legacy; audit rete cookie on/off/revoca.
6. Invio email operativo e motivazioni agli interessati: Resend ancora non integrato;
   mailto prepara messaggi ma non li invia né ne verifica il recapito.
7. Audit accessibilità tastiera/screen reader/contrasto esteso. Preview mobile non
   è certificazione WCAG. Non cambiare palette senza evidenza e accordo.
8. Solo dopo i passaggi necessari, rilascio Vercel approvato e verifica dominio pubblico.

Nessuna affermazione «conforme al 100%»; non pubblicare questa bozza con segnaposto.
Per inventario, fonti primarie e dettagli: LEGAL-COMPLIANCE-REPORT.md.

## Aggiornamento verifiche — 5 novembre 2026

Esiti riferiti dall'operatore sull'ambiente separato pulizialtop-test e preview:
- RPC richiesta privacy, RLS admin/ordinario, gestione decisioni e rollback test SQL.
- Form richiesta privacy e registrazione, consultazione e decisioni nel pannello.
- Recensione fittizia pending non pubblica, approvazione con 4 stelle/conteggio 1,
  segnalazione senza rimozione automatica e risposta dell'impresa visibile.
- Accesso admin rifiutato all'utente ordinario. Accesso dashboard anonimo corretto
  da errore server a redirect login, verificato autonomamente in browser.
- Utente ordinario: login agenzia rifiutato; screenshot dashboard successivo ritirato
  come prova dall'operatore (errore di finestra/sessione). Accesso diretto con sessione
  ordinaria non verificato end-to-end: nessuna conclusione di fuga dati da quello screenshot.

Verifiche automatiche: guardie testate con cambio sessione proprietario -> utente
non proprietario -> anonimo; nessuna autorizzazione riutilizzata tra le chiamate.
Dashboard force-dynamic e header no-store predisposti per pagine riservate; non
sono un sostituto dell'autorizzazione o una cancellazione di pagine già in memoria.
Log del 5 novembre confermano errore Accesso non autorizzato digest 3037010450
sulla vecchia preview, non un'autorizzazione concessa dal server.

Problema separato rilevato nei log: lettura review_invitations negata da RLS/grant,
mascherata dal vecchio codice come lista vuota. Non concedere SELECT indiscriminato.
La gestione inviti completa richiede RPC/policy dedicate e test proprietario/terzi;
non è stata completata in questo aggiornamento. Produzione non modificata.

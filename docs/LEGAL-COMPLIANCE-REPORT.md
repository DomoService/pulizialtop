# PuliziAlTop — adeguamenti tecnici e informativi (bozza)

Data di analisi: 4 novembre 2026. Non è una consulenza legale o una dichiarazione
integrale di conformità. Nessuna modifica al database di produzione o ai suoi
contenuti è stata eseguita in questo intervento. Pubblicazione e migrazione
richiedono passaggi separati. Le notifiche Resend della richiesta precedente
restano un'attività distinta: dominio in verifica, invio non implementato.

## 1. Implementato nel codice

- Informative riscritte, finalità/basi distinte, fonti indirette art. 14, diritti,
  fornitori/trasferimenti da verificare, conservazione configurabile senza scadenze
  inventate. Nessun cron di cancellazione. Indirizzo privacy già noto usato come
  canale con oggetto Privacy; non inventata una nuova casella.
- Termini con ruolo della directory, rapporti con imprese, contenuti, proprietà
  intellettuale, moderazione e limiti nel rispetto delle norme inderogabili.
- Rimossi caricamenti automatici GA4 e Cookiebot dal layout Next.js. Vercel Web
  Analytics facoltativo, disabilitato come default; caricato solo dopo consenso.
  Niente banner automatico se resta tutto tecnico. Dialogo accessibile con
  accetta/rifiuta/personalizza e link permanente, revoca con reload e sincronizzazione
  tra schede. Preferenza locale (versione, sì/no e scadenza di sei mesi), niente ID,
  IP o registro server del consenso. Scelta di sei mesi coerente col criterio del
  Garante per la riproposizione: rivalutare se cambiano scopi/strumenti/versione.
  Rimosse query/hash dagli eventi e bloccate statistiche su percorsi riservati,
  contatto, registrazione e segnalazioni. Non esiste categoria marketing attiva.
- Footer legale flessibile senza cambiamenti a palette, tipografia o layout generale;
  redirect da vecchi percorsi privacy/termini, sitemap aggiornata.
- Moduli privacy/segnalazioni/contestazioni/reclami/correzioni/rimozioni/rivendicazioni;
  URL preciso, motivazione, contatto, buona fede, eccezione anonimato art. 16(2)(c)
  DSA per reati specifici contro minori. Nessun upload di documenti sensibili.
  Riferimento univoco restituito dopo scrittura effettiva; errori mai mascherati
  come ricezione riuscita. Email alternativa se setup indisponibile.
- Richiesta registrazione: ragione sociale, P.IVA con checksum formale italiano,
  sede, email/telefono, referente privato, sito opzionale, termini e presa visione
  privacy distinti (non consenso marketing). Registrazione come richiesta privata,
  non pubblicazione o creazione account automatica. Validazione lato server.
- Revisione testi ingannevoli «recensioni verificate», certificazioni/qualità garantita
  non documentate. Esplicitata moderazione senza prova dell'acquisto. Dichiarazioni
  esperienza autentica/termini prima dell'invio pubblico; non sono prova d'acquisto.
- Link segnalazione per recensione con ancora stabile; email recensore non renderizzata
  nella lista pubblica; risposta impresa mostrata e modulo aggiunto nella dashboard.
- Moderazione admin con motivazione obbligatoria e RPC protetta/audit, senza riscrivere
  testi delle recensioni. In elenco pendenti mostrate fino a 100 più vecchie, da
  smaltire progressivamente. Nessuna decisione basata sul solo voto negativo.
- Provenienza schede separata: sconosciuta/piattaforma/registrata/rivendicata;
  nessuna deduzione automatica per le schede esistenti. Identificazione/rivendicazione
  non equivale a certificazione del servizio né a partnership.
- Area /admin/conformita con guardia server e RLS predisposta: impostazioni pubbliche,
  avvisi campi mancanti, richieste paginate, decisioni e riscontri manuali registrati,
  gestione provenienza. Mailto prepara un messaggio, NON prova l'invio. L'operatore
  deve comunicare all'autore quando dovuto, oltre al segnalante, e marcarlo solo dopo.
- Skip-link, etichette e messaggi di errore, controlli stelle già accessibili, menu
  admin flessibile; header nosniff/referrer policy; no-referrer sulle immagini scheda.

## 2. Pagine

/privacy-policy, /cookie-policy (sostituite); /termini-e-condizioni,
/informazioni-legali, /segnala-un-problema, /regole-recensioni (nuove).
/admin/conformita (riservata). Pagine di richiesta noindex; admin protetto anche
nel codice server, non soltanto tramite link nascosti o middleware.

## 3. Inventario tecnico individuato (codice, non scansione esaustiva)

| Servizio/strumento | Evidenza e trattamento in questa modifica |
| --- | --- |
| Vercel hosting | Deployment, routing e log; regioni, DPA e conservazione da verificare sul contratto/configurazione |
| Supabase | Auth con cookie sb-*, database, Storage immagini; RLS/grant effettivi da controllare dopo migrazione |
| Google Analytics G-FXSFE7DZCP | Script incondizionato precedente, ora rimosso; cookie legacy _ga/_gid/_gat raggiungibili eliminabili al rifiuto |
| Cookiebot | Script e stili precedenti rimossi; gestione preferenze sostituita, nessuna affermazione su attività passate |
| Vercel Web Analytics | Precedente mount incondizionato, ora opt-in. Fornitore dichiara assenza di cookie; non inventato cookie _vercel_analytics |
| Local storage preferenze | Solo categoria, versione e scadenza; nessuna fingerprint |
| sidebar_state | Componente UI prevede cookie tecnico 7 giorni; nessuna evidenza di uso nelle pagine pubbliche analizzate |
| Font Inter | next/font nel build, non inserito nuovo script/font remoto lato visitatore |
| Immagini/loghi | Percorsi locali o URL presenti nei dati; con images.unoptimized possono contattare host esterni. Necessari audit dei domini effettivi e diritti, no-referrer non basta a impedirne il contatto |
| Aruba | DNS e posta emersi dalla configurazione operatore, nessun SDK di tracciamento aggiunto |
| Resend | DNS in configurazione; nessuna notifica applicativa automatica presente |

La ricerca riguarda l'app Next.js, non certifica vecchi deployment/HTML statici,
strumenti eventualmente iniettati da dashboard, browser con login, Firewall,
Storage o cookie dei servizi visitati dopo un link esterno.

## 4. Migrazione predisposta, NON applicata

scripts/005_legal_compliance.sql crea strutture nuove con RLS e funzioni minime:
configurazione, richieste, eventi decisioni, provenienza e audit moderazione.
Nessuna cancellazione/riscrittura dei record esistenti. Nessun grant generale sulle
vecchie tabelle. Le funzioni SECURITY DEFINER hanno search_path vuoto, riferimenti
qualificati e EXECUTE limitato; verifica admin su identità confermata fresca in auth.users,
non email fornita o user_metadata. Risposte impresa controllano email confermata,
associazione univoca alla scheda o ruolo admin e recensione approvata.

Prerequisiti: schema reale compatibile con gli export ricevuti, script 004 (trigger
qualificato) e vista approved-only 003. La nuova moderazione usa il trigger esistente
per average_rating/count e mantiene l’aggiornamento google_rating/count del percorso
precedente dentro la stessa transazione protetta, soltanto su decisione amministrativa.
Nessuna valutazione memorizzata è ricalcolata da questo script da sola.

## 5. Problemi/rischi e interventi ancora necessari

- Non c'è accesso operativo Supabase da questa sessione: i vecchi export con RLS
  disattivata/permessi larghi e il successivo esito di contenimento sono storici,
  non una verifica attuale. Riesaminare tutti i grant (anche colonne/TRUNCATE),
  policy, RPC, Storage, log e frontend prima del rilascio. Nessun segreto è stato
  cercato tramite esportazione di valori env; nessuna chiave riservata aggiunta.
- I nuovi RPC non riaprono le tabelle. Se esistono altri grant ampi o policy
  permissive sulle vecchie tabelle, devono essere corretti separatamente.
- Cooldown email/URL e honeypot sono difese minime, aggirabili cambiando identità.
  Serve rate limit robusto/CAPTCHA valutato per privacy e accessibilità prima di
  esposizione ad abusi elevati. Nessuna falsa garanzia antispam.
- I vecchi percorsi recensione via token/invito mantengono limitazioni precedenti
  di grant/RLS e necessitano revisione dedicata. Non dichiarati verificati end-to-end.
- Riscontri/motivazioni DSA: registrabili e preparabili via mailto, invio e verifica
  identità restano umani. Non sono implementate email, scadenziario automatico,
  escalation, submission DSA Transparency Database, né report annuali automatici.
- Nessuna cancellazione automatica/portabilità/export è implementata. Richieste
  registrate e trattabili dall'operatore con verifica identità, terzi, backup,
  contenziosi, log e basi legali. Non cancellare a cascata recensioni/inviti.
- Provenienza e licenze richiedono raccolta di evidenze, non soltanto scelta dello stato.
- Impostazione reviewed è attestazione dell'operatore, non certificato. Non impedisce
  tecnicamente a un titolare di distribuire codice incompleto: avvisi evidenti e gate
  procedurale di rilascio, niente promessa di compliance automatica.
- Dichiarazioni del titolare sono testi pubblici: non inserirvi note interne o segreti.
- Contrasto complessivo, screen reader e tutti i flussi autenticati non sono certificati;
  nessun overlay di accessibilità introdotto e nessuna palette cambiata.

## 6. Informazioni mancanti

Denominazione/forma giuridica effettiva del titolare; sede; applicabilità P.IVA,
CF, REA e Registro; eventuale DPO/rappresentante; processi e criteri di conservazione;
DPA/ruoli/regioni/subfornitori e trasferimenti; fonti delle schede e bilanciamento;
ricavi, dipendenti e natura economica del servizio; regole operative ed evidenze dei
riscontri. Nessun valore inventato. Completare prima del rilascio definitivo.

## 7. Valutazione giuridica da affidare a professionista

- GDPR artt. 12–14: pagine pubbliche non sostituiscono gli adempimenti individuali
  art.14 per schede da fonti indirette. Valutare interessi legittimi, dati di ditte
  individuali, ruoli, trasferimenti, registro trattamenti, violazioni e necessità DPIA/DPO.
- DSA: ospitare recensioni di terzi rende plausibile l'inquadramento hosting e,
  secondo natura del servizio, piattaforma online. Valutazione non definitiva:
  artt.11/12 contatti, 14 condizioni, 16 segnalazioni e 17 motivazioni da valutare.
  Le esenzioni micro/piccola impresa dell'art.19 riguardano obblighi aggiuntivi,
  non cancellano automaticamente gli obblighi hosting. Reclami sono disponibili
  come buona pratica senza affermare automaticamente obbligo art.20. Dimensione
  aziendale ignota. Nessun dato consente di attribuire lo status VLOP: obblighi
  specifici delle piattaforme molto grandi NON implementati come se applicabili.
  Nel codice esaminato non c'è checkout/contratto servizi tra consumatore e impresa:
  obblighi marketplace vanno valutati separatamente se il modello cambia.
- Codice del Consumo: trasparenza sul se/come si controlla l'autenticità (art.22(5-bis)),
  divieti recensioni false/garanzie non supportate art.23. Consultare anche le linee
  guida AGCM ottobre 2026 e verificare la legge 34/2026/ambito settoriale ove pertinente.
- Accessibilità: EAA/d.lgs.82/2022 dal 28 giugno 2025 per servizi coperti, fra cui
  commercio elettronico; esenzione microimprese di servizi da verificare, non presunta.
  Valutare anche l.4/2004 e categoria soggetto privato/fatturato medio >500 milioni
  negli ultimi tre anni. Dati economici ignoti: nessuna esenzione dichiarata certa.
- D.lgs.70/2003 e obblighi informativi/fiscali applicabili da valutare con forma e attività
  effettive. Diritti su loghi, foto, testi e marchi vanno verificati separatamente.

## 8. Fonti primarie consultate

- GDPR: https://eur-lex.europa.eu/legal-content/IT/ALL/?uri=CELEX%3A02016R0679-20160504
- DSA: https://eur-lex.europa.eu/legal-content/IT/TXT/PDF/?uri=CELEX%3A32022R2065
- Cookie Garante: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876/
- AGCM recensioni: https://www.agcm.it/dotcmsdoc/normativa/consumatore/LLGG_Recensioni_online_Ott2026.pdf
- AGID: https://accessibilita.agid.gov.it/domande-frequenti/
- AGID EAA: https://www.agid.gov.it/sites/agid/files/2026-03/Linee_Guida_accessibilit%C3%A0_dei_servizi_%28EAA%29.pdf
- Vercel Analytics: https://vercel.com/docs/analytics/privacy-policy

## 9. Verifica tecnica e attivazione

Eseguire i test Bun in processi separati (mock condivisi). Test SQL opzionale con
PGlite in un ambiente isolato, non produzione:

```sh
npm install --prefix /tmp/legal-sql-tools @electric-sql/pglite
PGLITE_MODULE=/tmp/legal-sql-tools/node_modules/@electric-sql/pglite/dist/index.js node tests/legal-sql.mjs
```

Prima del rilascio: backup e prova ripristino, esame migrazione e schema/grant,
DB isolato, ruoli/account di test, moduli e decisioni/reclami, risposta impresa,
consenso on/off e revoca, mobile/tastiera/screen reader, informative completate e
revisione professionale. Non usare recensioni fittizie in produzione. I test locali
non provano l'attivazione nel database reale. Esiti di preview nel corpo PR.

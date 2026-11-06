# Provenienza e richieste sulle schede

Il repository contiene una directory statica storica (data/agencies.json), seed
SQL e script setup-database/run-migrations con inserimenti di imprese e recensioni
esempio. Lo schema dei seed è diverso da quello attuale. Questi file provano che
esistono processi di inserimento, NON che i loro dati siano nel database pubblico,
che siano autentici, che una ditta abbia aderito o che il sito web sia la fonte.
Non rieseguire i seed per riparare provenienze o reintrodurre rating esempio.

Non sono presenti URL fonte e date di acquisizione documentate in quei processi.
created_at non sostituisce la data di acquisizione. La tabella agency_provenance
contiene solo stato; registered/claimed non sostituiscono la richiesta originale.

/admin/provenienze è una vista riservata paginata, con guardia admin prima delle
query e solo id/nome/sito + stato. Distingue platform, registered (dichiarata
inserita direttamente), claimed (rivendicata, origine iniziale non provata), unknown.
Nessun token/password/email cliente nel registro. Le righe restano da correlare
alle evidenze reali. Errore DB è mostrato come errore, non come lista vuota riuscita.
Nessuna assegnazione automatica, modifica o pubblicazione di provenienze.

Procedura operativa:
1. Aprire il registro come admin, raccogliere privatamente per ogni scheda URL fonte,
   data acquisizione, soggetto inserente e domanda di registrazione/rivendicazione.
2. Separare ditte individuali/professionisti (dati personali) da sole persone giuridiche;
   non dedurre la categoria dalla forma del nome. Documentare necessità, proporzionalità,
   accuratezza, bilanciamento art.6.1.f o altra base applicabile.
3. Raccolta indiretta: informativa individuale art.14 entro un mese o prima
   comunicazione/divulgazione se precedente; documentare categorie/fonti e opposizione.
   Se invocata eccezione, registrare motivazione e garanzie, non automatizzarla perché
   il dato era pubblico. Informativa pubblica non sostituisce sempre la comunicazione.
4. Modulo segnalazione già gestisce correzione/rivendicazione/rimozione con URL e
   contatto; verificare identità proporzionata, non documenti indiscriminati. La
   presa visione non è marketing e la domanda non concede accesso amministrativo.
5. Registrare motivazione ed esito, comunicare al richiedente, correggere/oscurare
   solo dopo decisione autorizzata, distinguendo scheda e recensioni di terzi.
   Nessuna cancellazione automatica di dati o contributi collegati.

Il registro può essere implementato e revisionato senza migrazioni, ma non si può
inventare un elenco del database pubblico in assenza di accesso al suo contenuto.
L'export riservato degli elementi statici è consegnato separatamente, non nel repo.

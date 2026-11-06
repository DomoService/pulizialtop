# Conservazione: proposte, configurazione, dry-run e cancellazione manuale

Nessuna proposta è adottata automaticamente. Nessun cron o DELETE è eseguito.
Il pannello admin mostra lib/legal/retention.ts solo a utenti autorizzati.
Le informative non mostrano i periodi proposti come già applicati.

1. Approvare criteri per accounts, reviews, invitations, contacts, registrations,
   rights, moderation, logs, backups. Modificare i giorni proposti prima dell'adozione.
   Definire eventi di partenza, titolari di decisione, vincoli e tempi backup reali.
2. Preparare una policy JSON locale protetta:
   {"approved":false,"version":"review-1","reviewedAt":null,"rules":{"contacts":{"days":180,"approved":false}}}
   Approvazione e data devono essere inserite dall'operatore solo dopo la decisione.
3. Esportare solo metadata necessari con accesso autorizzato: reference opaca, kind,
   anchor timestamp dell'evento corretto, closed boolean, legalHold boolean esplicito,
   reviewed boolean dopo controllo umano. Non includere email, messaggi o credenziali.
   Non usare created_at al posto di closed_at per anticipare la cancellazione.
4. `bun scripts/retention-plan.ts policy.json metadata.json` genera SOLO un piano.
   Policy non approvata/data invalida, record aperto, date mancanti/future, hold non
   esplicitamente falso o revisione assente => nessun candidato. Non ci sono flag
   --apply/--force. Il piano non è un'autorizzazione a cancellare né una scansione DB.
5. Prima di qualsiasi intervento reale: verificare identità/diritti di terzi,
   approvazione, backup e test restore, dipendenze FK/audit, storage, SMTP, Auth,
   esenzione per contenzioso; registrare motivazione senza replicare dati superflui.
6. Eseguire manualmente solo gli interventi approvati, prima su DB isolato, in
   transazione con conteggio righe atteso e rollback se diverso. Per richieste
   privacy preferire rettifica/oscuramento/anonimizzazione quando necessario per
   diritti di terzi, non cancellare a cascata l'intero profilo senza verifica.
   La RPC admin di rimozione scheda esistente è solo una funzione per azione esplicita,
   non un motore di retention. I vincoli di audit possono impedirla correttamente.
7. Auth: revocare sessioni e gestire account tramite strumenti amministrativi del
   fornitore, non manipolare password direttamente in SQL. Storage: cancellare solo
   oggetti identificati, non bucket. Log/backup: configurare scadenze supportate dal
   fornitore e applicare nuovamente le cancellazioni dopo ogni ripristino.
8. Verificare esito senza leggere dati privati come anonimo; rispondere alla richiesta,
   registrare esito/limiti e cancellare copie temporanee protette del piano/export.

Un esecutore distruttivo automatizzato richiede policy approvate e schema live
collaudato; volutamente NON è attivo. Il sito può essere revisionato senza eseguire
alcuna cancellazione preesistente o inventare durate vincolanti.

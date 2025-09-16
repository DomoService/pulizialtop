# PulizialTop – Sito statico iniziale (demo)
Questo è uno **starter** statico per iniziare subito online senza backend. Include:
- Home con ricerca
- Directory con filtri base (Regione, Provincia, Comune, prezzo, rating)
- Cards di agenzie da `data/agencies.json`
- Pagine Privacy / Termini (bozze)

## Come pubblicare
1. Scarica lo ZIP.
2. Carica la cartella su un hosting statico (Netlify, Vercel, GitHub Pages, Aruba static hosting).
3. Oppure apri con VS Code e usa una estensione Live Server per vederlo in locale.

## Come aggiungere agenzie
- Modifica `data/agencies.json` e aggiungi oggetti con i campi esistenti.
- I filtri si aggiornano automaticamente.

## Prossimi step (quando vuoi passare a web app)
- Next.js + Supabase per:
  - Modulo recensioni con moderazione
  - Ruoli (admin/moderatore/agenzia/utente)
  - Schema.org AggregateRating
  - Autenticazione email OTP

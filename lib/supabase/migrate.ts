import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function runMigration() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Create agencies table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS agencies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('pulizie', 'manutenzione')),
      province TEXT NOT NULL,
      city TEXT,
      rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
      review_count INTEGER DEFAULT 0,
      description TEXT,
      services TEXT[],
      phone TEXT,
      email TEXT,
      website TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
      reviewer_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_agencies_province ON agencies(province);
    CREATE INDEX IF NOT EXISTS idx_agencies_type ON agencies(type);
    CREATE INDEX IF NOT EXISTS idx_agencies_rating ON agencies(rating DESC);
    CREATE INDEX IF NOT EXISTS idx_reviews_agency_id ON reviews(agency_id);
  `

  const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableQuery })

  if (createError) {
    console.error("Error creating tables:", createError)
    return { success: false, error: createError }
  }

  // Seed data
  const agencies = [
    {
      name: "CleanPro Sardegna",
      type: "pulizie",
      province: "Cagliari",
      city: "Cagliari",
      rating: 4.8,
      review_count: 127,
      description:
        "Agenzia leader nelle pulizie professionali per case vacanza e strutture ricettive. Esperienza ventennale nel settore hospitality.",
      services: ["Pulizie appartamenti", "Sanificazione", "Cambio biancheria", "Check-out cleaning"],
      phone: "+39 070 123 4567",
      email: "info@cleanprosardegna.it",
    },
    {
      name: "Pulizie Perfette Costa Smeralda",
      type: "pulizie",
      province: "Sassari",
      city: "Porto Cervo",
      rating: 4.7,
      review_count: 98,
      description:
        "Specializzati in ville di lusso e resort. Staff multilingue e disponibilità h24 durante la stagione estiva.",
      services: ["Pulizie ville", "Pulizie piscine", "Servizio lavanderia", "Gestione chiavi"],
      phone: "+39 0789 234 567",
      email: "contatto@puliziecostasmeralda.it",
    },
    {
      name: "EcoClean Nuoro",
      type: "pulizie",
      province: "Nuoro",
      city: "Nuoro",
      rating: 4.9,
      review_count: 156,
      description:
        "Pulizie ecologiche con prodotti certificati. Perfetti per property manager attenti alla sostenibilità.",
      services: ["Pulizie ecologiche", "Sanificazione ozono", "Pulizie finali", "Manutenzione ordinaria"],
      phone: "+39 0784 345 678",
      email: "eco@eclean-nuoro.it",
    },
    {
      name: "Pulizie Express Olbia",
      type: "pulizie",
      province: "Sassari",
      city: "Olbia",
      rating: 4.6,
      review_count: 89,
      description: "Servizio rapido per turnover veloce. Ideali per B&B e case vacanza con check-in ravvicinati.",
      services: ["Pulizie rapide", "Cambio biancheria", "Rifornimento cortesia"],
      phone: "+39 0789 456 789",
      email: "info@pulizieexpress-olbia.it",
    },
    {
      name: "PuliziaTop Oristano",
      type: "pulizie",
      province: "Oristano",
      city: "Oristano",
      rating: 4.5,
      review_count: 72,
      description: "Servizio completo di pulizie per appartamenti turistici nella zona di Oristano e Mari Ermi.",
      services: ["Pulizie settimanali", "Pulizie straordinarie", "Lavaggio vetri"],
      phone: "+39 0783 567 890",
      email: "contatti@puliziatop-or.it",
    },
    {
      name: "Manutenzione Express",
      type: "manutenzione",
      province: "Sassari",
      city: "Alghero",
      rating: 4.9,
      review_count: 134,
      description:
        "Interventi rapidi su impianti elettrici, idraulici e climatizzazione. Disponibili per emergenze 24/7.",
      services: ["Idraulica", "Elettricità", "Climatizzazione", "Pronto intervento"],
      phone: "+39 079 678 901",
      email: "express@manutenzione-alghero.it",
    },
    {
      name: "SardegnaManutenzioni",
      type: "manutenzione",
      province: "Cagliari",
      city: "Villasimius",
      rating: 4.6,
      review_count: 91,
      description:
        "Team di professionisti certificati per manutenzione ordinaria e straordinaria di strutture turistiche.",
      services: ["Manutenzione ordinaria", "Riparazioni", "Giardinaggio", "Manutenzione piscine"],
      phone: "+39 070 789 012",
      email: "info@sardegnamanutenzioni.it",
    },
    {
      name: "Fix&Go Oristano",
      type: "manutenzione",
      province: "Oristano",
      city: "Cabras",
      rating: 4.5,
      review_count: 67,
      description: "Piccole e grandi riparazioni per immobili turistici. Elettricisti e idraulici qualificati.",
      services: ["Riparazioni elettriche", "Riparazioni idrauliche", "Falegnameria", "Serrature"],
      phone: "+39 0783 890 123",
      email: "fixandgo@manutenzionior.it",
    },
    {
      name: "TechHouse Nuoro",
      type: "manutenzione",
      province: "Nuoro",
      city: "Dorgali",
      rating: 4.7,
      review_count: 78,
      description:
        "Specializzati in impianti tecnologici: wi-fi, domotica, videosorveglianza per property manager moderni.",
      services: ["Impianti wi-fi", "Domotica", "Videosorveglianza", "Smart lock"],
      phone: "+39 0784 901 234",
      email: "tech@techouse-nuoro.it",
    },
  ]

  const { error: insertError } = await supabase.from("agencies").insert(agencies)

  if (insertError) {
    console.error("Error inserting agencies:", insertError)
    return { success: false, error: insertError }
  }

  return { success: true }
}

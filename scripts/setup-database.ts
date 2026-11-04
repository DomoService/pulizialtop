import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log("[v0] Starting database setup...")

  // Create agencies table
  const { error: createError } = await supabase.rpc("exec_sql", {
    query: `
      CREATE TABLE IF NOT EXISTS agencies (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('cleaning', 'maintenance')),
        province TEXT NOT NULL,
        rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
        review_count INTEGER NOT NULL DEFAULT 0,
        description TEXT NOT NULL,
        services TEXT[] NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  })

  if (createError) {
    console.error("[v0] Error creating table:", createError)
    // Try alternative method
    console.log("[v0] Trying direct SQL execution...")

    const { error: altError } = await supabase.from("_migrations").insert({ name: "create_agencies" })

    console.log("[v0] Alternative method result:", altError)
  }

  console.log("[v0] Table creation attempted")

  // Insert agencies
  const agencies = [
    {
      name: "CleanPro Sardegna",
      type: "cleaning",
      province: "Cagliari",
      rating: 4.8,
      review_count: 124,
      description: "Servizio professionale di pulizie per appartamenti turistici e B&B. Esperienza ventennale.",
      services: ["Pulizie post check-out", "Cambio biancheria", "Pulizie straordinarie", "Sanificazione"],
      contact_email: "info@cleanprosardegna.it",
      contact_phone: "+39 070 123 4567",
    },
    {
      name: "Pulizie Perfette Costa Smeralda",
      type: "cleaning",
      province: "Sassari",
      rating: 4.7,
      review_count: 98,
      description: "Specializzati in ville di lusso e resort. Servizio h24 durante la stagione estiva.",
      services: ["Pulizie giornaliere", "Gestione piscine", "Lavanderia", "Stiratura"],
      contact_email: "contatti@puliziecostasmeralda.it",
      contact_phone: "+39 0789 987 654",
    },
    {
      name: "EcoClean Nuoro",
      type: "cleaning",
      province: "Nuoro",
      rating: 4.9,
      review_count: 76,
      description: "Pulizie ecologiche con prodotti certificati. Ideale per proprietà green.",
      services: ["Pulizie eco-friendly", "Cambio biancheria biologica", "Sanificazione naturale"],
      contact_email: "hello@ecoclean-nuoro.it",
      contact_phone: "+39 0784 567 890",
    },
    {
      name: "Sardegna Cleaning Service",
      type: "cleaning",
      province: "Oristano",
      rating: 4.6,
      review_count: 112,
      description: "Copertura in tutta la provincia di Oristano. Team affidabile e puntuale.",
      services: ["Pulizie base", "Pulizie approfondite", "Gestione check-in/out", "Controllo qualità"],
      contact_email: "info@sardegnacleaning.com",
      contact_phone: "+39 0783 234 567",
    },
    {
      name: "Manutenzione Express",
      type: "maintenance",
      province: "Sassari",
      rating: 4.9,
      review_count: 89,
      description: "Interventi rapidi di manutenzione ordinaria e straordinaria. Disponibili 7/7.",
      services: ["Idraulica", "Elettricità", "Climatizzazione", "Piccole riparazioni"],
      contact_email: "assistenza@manutenzioneexpress.it",
      contact_phone: "+39 079 876 543",
    },
    {
      name: "SardegnaManutenzioni",
      type: "maintenance",
      province: "Cagliari",
      rating: 4.6,
      review_count: 134,
      description: "Manutenzione completa per property manager. Contratti annuali e interventi singoli.",
      services: ["Manutenzione ordinaria", "Giardinaggio", "Piscine", "Impianti"],
      contact_email: "info@sardegnamanutenzioni.it",
      contact_phone: "+39 070 345 678",
    },
    {
      name: "Fix&Go Oristano",
      type: "maintenance",
      province: "Oristano",
      rating: 4.5,
      review_count: 67,
      description: "Riparazioni veloci per emergenze. Servizio clienti attivo H24.",
      services: ["Pronto intervento", "Serrature", "Caldaie", "Elettrodomestici"],
      contact_email: "emergenze@fixandgo.it",
      contact_phone: "+39 0783 456 789",
    },
    {
      name: "TechMaintenance Sassari",
      type: "maintenance",
      province: "Sassari",
      rating: 4.8,
      review_count: 103,
      description: "Specializzati in tecnologia e domotica per case vacanza moderne.",
      services: ["Smart home", "WiFi e networking", "TV e audio", "Automazioni"],
      contact_email: "tech@techmaintenance.it",
      contact_phone: "+39 079 654 321",
    },
    {
      name: "GreenGarden Cagliari",
      type: "maintenance",
      province: "Cagliari",
      rating: 4.7,
      review_count: 91,
      description: "Manutenzione giardini e spazi esterni per ville e resort.",
      services: ["Giardinaggio", "Irrigazione", "Potature", "Piscine"],
      contact_email: "info@greengarden-ca.it",
      contact_phone: "+39 070 789 012",
    },
  ]

  const { data, error: insertError } = await supabase.from("agencies").insert(agencies).select()

  if (insertError) {
    console.error("[v0] Error inserting agencies:", insertError)
    return
  }

  console.log("[v0] Database setup completed successfully!")
  console.log("[v0] Inserted", data?.length, "agencies")
}

setupDatabase()

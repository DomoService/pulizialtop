"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface Agency {
  agency_id: number
  nome: string
  email: string | null
}

export function CredentialsEmailTemplate({ agency }: { agency: Agency }) {
  const copyEmail = () => {
    const text = `Oggetto: La tua agenzia è su PuliziAlTop.it

Ciao,

Ho creato PuliziAlTop, la prima piattaforma che mette in contatto property manager con agenzie di pulizie affidabili in Sardegna.

Ho già inserito ${agency.nome} nel nostro database.

Accedi qui per gestire il tuo profilo GRATIS:

URL: ${window.location.origin}/agenzia/login
Email: ${agency.email}
Password: [Da generare]

Saluti,
PuliziAlTop.it`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="mb-2 text-sm font-medium">Template Email:</p>
      <div className="rounded bg-muted p-3 text-sm">
        <p className="mb-2 font-semibold">Oggetto: La tua agenzia è su PuliziAlTop.it</p>
        <p className="mb-2">Ciao,</p>
        <p className="mb-2">
          Ho creato PuliziAlTop, la prima piattaforma che mette in contatto property manager con agenzie di pulizie
          affidabili in Sardegna.
        </p>
        <p className="mb-2">
          Ho già inserito <strong>{agency.nome}</strong> nel nostro database.
        </p>
        <p className="mb-2">Accedi qui per gestire il tuo profilo GRATIS:</p>
        <p className="mb-1">
          <strong>URL:</strong> [domain]/agenzia/login
        </p>
        <p className="mb-1">
          <strong>Email:</strong> {agency.email}
        </p>
        <p className="mb-2">
          <strong>Password:</strong> [Generata automaticamente]
        </p>
        <p>Saluti,</p>
        <p>PuliziAlTop.it</p>
      </div>
      <Button size="sm" variant="outline" className="mt-3 bg-transparent" onClick={copyEmail}>
        <Copy className="mr-2 h-4 w-4" />
        Copia Email
      </Button>
    </div>
  )
}

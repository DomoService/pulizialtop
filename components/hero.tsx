"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Hero() {
  const router = useRouter()
  const [serviceType, setServiceType] = useState("tutti")
  const [province, setProvince] = useState("tutte")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (serviceType !== "tutti") params.set("type", serviceType)
    if (province !== "tutte") params.set("province", province)

    const query = params.toString()
    router.push(query ? `/?${query}` : "/")
  }

  return (
    <section className="relative bg-gradient-to-b from-secondary to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Trova l'Agenzia di Pulizie Perfetta per Te
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground leading-relaxed">
            Confronta le migliori agenzie di pulizie e manutentori in Sardegna. Valutazioni reali, recensioni
            certificate da clienti verificati. Per aziende, privati e professionisti del settore immobiliare.
          </p>

          <div className="mt-10 mx-auto max-w-2xl">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-lg md:flex-row md:items-end">
              <div className="flex-1">
                <label htmlFor="service" className="mb-2 block text-sm font-medium text-card-foreground">
                  Tipo di Servizio
                </label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger id="service" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutti">Tutti i Servizi</SelectItem>
                    <SelectItem value="pulizie">Agenzie di Pulizie</SelectItem>
                    <SelectItem value="manutenzione">Manutentori</SelectItem>
                    <SelectItem value="multiservice">Multiservice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label htmlFor="provincia" className="mb-2 block text-sm font-medium text-card-foreground">
                  Provincia
                </label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger id="provincia" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutte">Tutta la Sardegna</SelectItem>
                    <SelectItem value="Cagliari">Cagliari</SelectItem>
                    <SelectItem value="Sassari">Sassari</SelectItem>
                    <SelectItem value="Nuoro">Nuoro</SelectItem>
                    <SelectItem value="Oristano">Oristano</SelectItem>
                    <SelectItem value="Sud Sardegna">Sud Sardegna</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button size="lg" className="md:mb-0" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Cerca
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

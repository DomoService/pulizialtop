import { AgencyCard } from "@/components/agency-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Agency } from "@/app/actions"

interface AgencyListProps {
  agencies: Agency[]
}

export function AgencyList({ agencies }: AgencyListProps) {
  return (
    <section id="agenzie" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Agenzie Verificate</h2>
            <p className="mt-2 text-muted-foreground">{agencies.length} professionisti disponibili in Sardegna</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Ordina per:</span>
            <Select defaultValue="rating">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Valutazione</SelectItem>
                <SelectItem value="reviews">Numero Recensioni</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agencies.map((agency) => (
            <AgencyCard key={agency.agency_id} agency={agency} />
          ))}
        </div>
      </div>
    </section>
  )
}

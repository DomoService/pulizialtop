import Image from "next/image"
import { Star, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Agency } from "@/app/actions"

interface AgencyCardProps {
  agency: Agency
}

export function AgencyCard({ agency }: AgencyCardProps) {
  const getImageUrl = () => {
    // Prima opzione: logo caricato
    if (agency.logo_url) return agency.logo_url

    // Seconda opzione: image_url
    if (agency.image_url) return agency.image_url

    // Terza opzione: immagini generiche per tipo
    if (agency.tipo === "pulizie") {
      const cleaningImages = [
        "/cleaning-modern-office.jpg",
        "/cleaning-equipment.jpg",
        "/cleaning-uniform.jpg",
        "/cleaning-quality.jpg",
        "/cleaning-hotel-room.jpg",
        "/cleaning-team-work.jpg",
        "/eco-cleaning-products.jpg",
        "/cleaning-vacation-rental.jpg",
        "/cleaning-commercial.jpg",
        "/cleaning-sanitization.jpg",
      ]
      return cleaningImages[agency.agency_id % cleaningImages.length]
    } else if (agency.tipo === "manutenzione") {
      const maintenanceImages = [
        "/maintenance-technician.jpg",
        "/maintenance-repair-tools.jpg",
        "/maintenance-plumbing.jpg",
        "/maintenance-electrical.jpg",
        "/maintenance-hvac.jpg",
      ]
      return maintenanceImages[agency.agency_id % maintenanceImages.length]
    } else {
      const multiserviceImages = [
        "/cleaning-modern-office.jpg",
        "/maintenance-technician.jpg",
        "/cleaning-team-work.jpg",
        "/maintenance-repair-tools.jpg",
        "/eco-cleaning-products.jpg",
      ]
      return multiserviceImages[agency.agency_id % multiserviceImages.length]
    }
  }

  const imageUrl = getImageUrl()
  const rating = agency.average_rating || agency.google_rating || 0

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={agency.nome}
          fill
          className={agency.logo_url ? "object-contain p-6" : "object-cover"}
        />
        <Badge className="absolute right-3 top-3 bg-background/90 text-foreground capitalize">{agency.tipo}</Badge>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">{agency.nome}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {agency.indirizzo ? `${agency.indirizzo}, ` : ""}
                {agency.province}
                {agency.cap ? ` (${agency.cap})` : ""}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold text-card-foreground">{rating > 0 ? rating.toFixed(1) : "N/A"}</span>
            </div>
            <span className="text-xs text-muted-foreground">{agency.google_reviews} recensioni</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {agency.descrizione || "Nessuna descrizione disponibile"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(agency.servizi || []).slice(0, 3).map((service, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
          {(agency.servizi || []).length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{(agency.servizi || []).length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
          <a href={`/agenzia/${agency.agency_id}`}>Vedi Dettagli</a>
        </Button>
        {agency.telefono && (
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <a href={`tel:${agency.telefono}`}>
              <Phone className="mr-2 h-4 w-4" />
              Chiama
            </a>
          </Button>
        )}
        {agency.website && (
          <Button size="sm" className="flex-1" asChild>
            <a href={agency.website} target="_blank" rel="noopener noreferrer">
              Sito Web
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState } from "react"
import type { Agency } from "@/app/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { EditAgencyDialog } from "@/components/edit-agency-dialog"
import { DeleteAgencyDialog } from "@/components/delete-agency-dialog"

export function AgencyManagementList({ agencies }: { agencies: Agency[] }) {
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null)
  const [deletingAgency, setDeletingAgency] = useState<Agency | null>(null)

  return (
    <>
      <div className="grid gap-4">
        {agencies.map((agency) => (
          <Card key={agency.agency_id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{agency.nome}</CardTitle>
                  <CardDescription>
                    {agency.province} • {agency.tipo}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingAgency(agency)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeletingAgency(agency)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div>
                  <strong>Email:</strong> {agency.email || "N/A"}
                </div>
                <div>
                  <strong>Telefono:</strong> {agency.telefono || "N/A"}
                </div>
                <div>
                  <strong>Sito web:</strong> {agency.website || "N/A"}
                </div>
                {agency.descrizione && (
                  <div>
                    <strong>Descrizione:</strong> {agency.descrizione}
                  </div>
                )}
                {agency.servizi && agency.servizi.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {agency.servizi.map((servizio) => (
                      <Badge key={servizio} variant="secondary">
                        {servizio}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingAgency && (
        <EditAgencyDialog
          agency={editingAgency}
          open={!!editingAgency}
          onOpenChange={(open) => !open && setEditingAgency(null)}
        />
      )}

      {deletingAgency && (
        <DeleteAgencyDialog
          agency={deletingAgency}
          open={!!deletingAgency}
          onOpenChange={(open) => !open && setDeletingAgency(null)}
        />
      )}
    </>
  )
}

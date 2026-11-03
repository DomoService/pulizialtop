"use client"

import { useState } from "react"
import { type Agency, deleteAgency } from "@/app/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface DeleteAgencyDialogProps {
  agency: Agency
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAgencyDialog({ agency, open, onOpenChange }: DeleteAgencyDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    setError(null)

    const result = await deleteAgency(agency.agency_id)

    if (result.success) {
      onOpenChange(false)
      router.refresh()
    } else {
      setError(result.error || "Errore durante l'eliminazione")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elimina Agenzia</DialogTitle>
          <DialogDescription>
            Sei sicuro di voler eliminare <strong>{agency.nome}</strong>?
            <br />
            Questa azione non può essere annullata e eliminerà anche tutte le recensioni associate.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annulla
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Elimina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

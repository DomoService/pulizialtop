"use client"

import type React from "react"

import { useState } from "react"
import { type Agency, updateAgency } from "@/app/actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface EditAgencyDialogProps {
  agency: Agency
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAgencyDialog({ agency, open, onOpenChange }: EditAgencyDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("agency_id", agency.agency_id.toString())

    const result = await updateAgency(formData)

    if (result.success) {
      onOpenChange(false)
      router.refresh()
    } else {
      setError(result.error || "Errore durante l'aggiornamento")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifica Agenzia</DialogTitle>
          <DialogDescription>Aggiorna i dati dell'agenzia</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome Agenzia *</Label>
            <Input id="nome" name="nome" defaultValue={agency.nome} required />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo *</Label>
            <Select name="tipo" defaultValue={agency.tipo} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pulizie">Pulizie</SelectItem>
                <SelectItem value="manutenzione">Manutenzione</SelectItem>
                <SelectItem value="multiservice">Multiservice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provincia">Provincia *</Label>
            <Input id="provincia" name="provincia" defaultValue={agency.province} required />
          </div>

          <div>
            <Label htmlFor="telefono">Telefono</Label>
            <Input id="telefono" name="telefono" type="tel" defaultValue={agency.telefono || ""} />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" defaultValue={agency.email || ""} required />
          </div>

          <div>
            <Label htmlFor="website">Sito Web</Label>
            <Input id="website" name="website" type="url" defaultValue={agency.website || ""} />
          </div>

          <div>
            <Label htmlFor="descrizione">Descrizione</Label>
            <Textarea id="descrizione" name="descrizione" defaultValue={agency.descrizione || ""} rows={4} />
          </div>

          <div>
            <Label htmlFor="logo">Logo (lascia vuoto per mantenere quello attuale)</Label>
            <Input id="logo" name="logo" type="file" accept="image/*" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salva Modifiche"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

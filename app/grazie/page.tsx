import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Card className="mx-auto max-w-md text-center">
            <CardContent className="pt-12 pb-12 space-y-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Grazie per la tua recensione!</h1>
                <p className="text-muted-foreground">
                  La tua recensione è stata inviata e sarà pubblicata dopo la verifica.
                </p>
              </div>
              <Button asChild>
                <Link href="/">Torna alla Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

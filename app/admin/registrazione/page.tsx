import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminRegisterForm } from "@/components/admin-register-form"

export default function AdminRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Registrazione Admin</h1>
              <p className="text-muted-foreground mt-2">Crea un account amministratore</p>
            </div>
            <AdminRegisterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

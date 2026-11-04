import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminLoginForm } from "@/components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Accesso Admin</h1>
              <p className="text-muted-foreground mt-2">Accedi per gestire le recensioni e le agenzie</p>
            </div>
            <AdminLoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

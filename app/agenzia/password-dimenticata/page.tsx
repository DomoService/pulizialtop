import { PasswordRecoveryForm } from "@/components/password-recovery-form"

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ invalid?: string }> }) {
  const { invalid } = await searchParams
  return <main className="mx-auto w-full max-w-md space-y-6 px-4 py-12">
    <h1 className="text-3xl font-bold">Password dimenticata</h1>
    <p>Inserisci la tua email per ricevere il link di recupero. Aprilo nello stesso browser in cui hai effettuato la richiesta.</p>
    {invalid && <p role="alert">Link non valido, scaduto o già utilizzato. Richiedine uno nuovo da questo browser.</p>}
    <PasswordRecoveryForm audience="agenzia" />
  </main>
}

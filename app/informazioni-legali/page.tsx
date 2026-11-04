import { LegalPage, Missing } from "@/components/legal-page"
import { getLegalSettings } from "@/lib/legal/data"
import { legalFields, missingLegalFields } from "@/lib/legal/schema"
export const metadata = {
  title: "Informazioni Legali",
  alternates: { canonical: "https://pulizialtop.it/informazioni-legali" },
}
export default async function Page() {
  const { settings: s, configured } = await getLegalSettings()
  return (
    <LegalPage title="Informazioni Legali">
      <p>
        {!configured || missingLegalFields(s).length > 0
          ? "Informazioni incomplete: il titolare deve completare i dati e verificare gli obblighi applicabili prima della pubblicazione definitiva."
          : "Dati forniti dal titolare; non costituiscono certificazione di conformità."}
      </p>
      <dl className="space-y-4">
        {(
          [
            "controller",
            "address",
            "vat",
            "fiscalCode",
            "register",
            "contact",
            "dpo",
          ] as const
        ).map((k) => (
          <div key={k}>
            <dt className="font-semibold">{legalFields[k]}</dt>
            <dd className="break-words">
              <Missing value={s[k]} label={legalFields[k]} />
            </dd>
          </div>
        ))}
      </dl>
      <p>
        Contatto per utenti e comunicazioni relative alla piattaforma:{" "}
        {s.contact || "info@pulizialtop.it"}. Le comunicazioni possono essere
        inviate in italiano; la richiesta viene valutata da una persona.
        Eventuale contatto distinto per autorità/rappresentante ai sensi del
        DSA: da confermare dal titolare.
      </p>
      <p>
        Applicabilità DSA, accessibilità e obblighi informativi dell’attività:{" "}
        <Missing
          value={s.applicability}
          label="valutazione professionale sulla natura e dimensioni dell’attività"
        />
        .
      </p>
    </LegalPage>
  )
}

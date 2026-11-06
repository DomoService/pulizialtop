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
          ] as const
        ).filter(k => !!s[k]).map((k) => (
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
        Non è indicato un contatto distinto per autorità: le comunicazioni sono gestite al recapito sopra.
      </p>
      <p>
        Applicabilità DSA, accessibilità e obblighi informativi dell’attività:{" "}
        <Missing
          value={s.applicability || "La classificazione dell’attività e gli ulteriori obblighi applicabili non sono oggetto di certificazione da parte di questo sito."}
          label="valutazione professionale sulla natura e dimensioni dell’attività"
        />
        .
      </p>
    </LegalPage>
  )
}

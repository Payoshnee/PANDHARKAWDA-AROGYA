import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bookmark, Stethoscope, Hospital } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { usePublicData } from "@/lib/api"
import { PageHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/states"

const SAVED_KEY = "arogya_saved"

export function SavedItemsPage() {
  const { lang } = useLang()
  const { data } = usePublicData()
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    const update = () => {
      setSavedIds(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"))
    }
    update()
    window.addEventListener("arogya-saved-change", update)
    return () => window.removeEventListener("arogya-saved-change", update)
  }, [])

  const savedDoctors = data.doctors.filter(d => savedIds.includes(d.id))
  const savedFacilities = data.facilities.filter(f => savedIds.includes(f.id))
  const isEmpty = savedDoctors.length === 0 && savedFacilities.length === 0

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title={t("saved.title", lang)} />

      {isEmpty ? (
        <EmptyState
          title={t("saved.empty", lang)}
          message={lang === "mr" ? "डॉक्टर किंवा ठिकाणे जतन करण्यासाठी त्यांच्या पृष्ठावरील जतन बटण दाबा." : "Use the Save button on a doctor or facility page to add them here."}
          actionLabel={t("saved.findDoctors", lang)}
          actionTo="/doctors"
        />
      ) : (
        <div className="space-y-6">
          {savedDoctors.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Stethoscope className="size-4 text-primary" />
                {t("saved.doctors", lang)}
              </h2>
              <div className="space-y-2">
                {savedDoctors.map(d => (
                  <Link key={d.id} to={`/doctors/${d.slug}`} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{getLangValue(d.name_en, d.name_mr, lang)}</p>
                      <p className="text-xs text-muted-foreground">{d.specialty && getLangValue(d.specialty.name_en, d.specialty.name_mr, lang)}</p>
                    </div>
                    <Bookmark className="size-4 text-primary fill-primary shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}
          {savedFacilities.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Hospital className="size-4 text-primary" />
                {t("saved.facilities", lang)}
              </h2>
              <div className="space-y-2">
                {savedFacilities.map(f => (
                  <Link key={f.id} to={`/facilities/${f.slug}`} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{getLangValue(f.name_en, f.name_mr, lang)}</p>
                      <p className="text-xs text-muted-foreground">{getLangValue(f.address_en, f.address_mr, lang)}</p>
                    </div>
                    <Bookmark className="size-4 text-primary fill-primary shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

import { useParams, useNavigate } from "react-router-dom"
import { Phone, Navigation, MapPin, ArrowLeft, Building2, CheckCircle2 } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue, getArrayLangValue } from "@/lib/i18n"
import { usePublicData } from "@/lib/api"
import { getTelUrl, getMapsUrl, isStale } from "@/lib/utils-health"
import { VerificationBadge, FreshnessIndicator } from "@/components/shared/verification"
import { StatusBadge, getFacilityStatus, getClosingTime, OpenUntilBadge } from "@/components/shared/status-badges"
import { DoctorCompactRow } from "@/components/shared/doctor-card"
import { ReportLink } from "@/components/shared/report-dialog"
import { NotFoundState } from "@/components/shared/states"
import { MapView } from "@/components/shared/map-view"
import { PageHeader } from "@/components/shared/section-header"
import { cn } from "@/lib/utils"

export function FacilityDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang } = useLang()
  const navigate = useNavigate()
  const { data } = usePublicData()

  const facility = data.facilities.find(f => f.slug === slug)
  if (!facility) return <NotFoundState />

  const status = getFacilityStatus(facility.id)
  const closingTime = getClosingTime(facility.id)
  const doctors = data.doctors.filter(d => d.facility_id === facility.id)
  const stale = isStale(facility.last_verified)
  const services = getArrayLangValue(facility.services_en, facility.services_mr, lang)

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" />
        {t("common.back", lang)}
      </button>

      <div className="space-y-6">
        <PageHeader
          title={getLangValue(facility.name_en, facility.name_mr, lang)}
          subtitle={getLangValue(facility.address_en, facility.address_mr, lang)}
        >
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
              facility.type === "government" ? "bg-success/10 text-success" :
              facility.type === "hospital" ? "bg-primary/10 text-primary" :
              facility.type === "diagnostic" ? "bg-chart-3/10 text-chart-3" :
              "bg-info/10 text-info"
            )}>
              <Building2 className="size-3" />
              {lang === "mr"
                ? { hospital: "रुग्णालय", clinic: "दवाखाना", diagnostic: "निदान केंद्र", government: "सरकारी" }[facility.type]
                : { hospital: "Hospital", clinic: "Clinic", diagnostic: "Diagnostic", government: "Government" }[facility.type]}
            </span>
            {closingTime && closingTime !== "24 hrs"
              ? <OpenUntilBadge time={closingTime} />
              : <StatusBadge status={status} />}
            {facility.has_emergency && (
              <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                {t("nav.emergency", lang)}
              </span>
            )}
          </div>
        </PageHeader>

        {stale && <FreshnessIndicator lastVerified={facility.last_verified} />}

        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">{t("section.contact", lang)}</span>
            <VerificationBadge verified={facility.verified} lastVerified={facility.last_verified} />
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <MapPin className="size-3.5 mt-0.5 shrink-0" />
            {getLangValue(facility.address_en, facility.address_mr, lang)}
          </p>
          <div className="flex gap-2">
            <a href={getTelUrl(facility.phone)} className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90">
              <Phone className="size-3.5" />
              {t("action.call", lang)}
            </a>
            <a href={getMapsUrl(facility.lat, facility.lng, getLangValue(facility.address_en, facility.address_mr, lang))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent">
              <Navigation className="size-3.5" />
              {t("action.directions", lang)}
            </a>
          </div>
        </div>

        {services.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">{t("section.services", lang)}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="size-4 text-success shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {facility.is_public_hospital && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">{lang === "mr" ? "सरकारी कार्यक्रम" : "Government Programs"}</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{lang === "mr" ? "लसीकरण कार्यक्रम (बुधवार व शुक्रवार)" : "Immunization program (Wednesday & Friday)"}</p>
              <p>{lang === "mr" ? "कुपोषण उपचार केंद्र" : "Malnutrition treatment centre"}</p>
              <p>{lang === "mr" ? "व्यसनमुक्ती केंद्र" : "De-addiction centre"}</p>
              <p>{lang === "mr" ? "प्रसूती सेवा (24 तास)" : "Maternity services (24 hours)"}</p>
            </div>
          </div>
        )}

        {doctors.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">{t("section.doctors", lang)}</h2>
            <div className="space-y-2">
              {doctors.map(d => <DoctorCompactRow key={d.id} doctor={d} />)}
            </div>
          </div>
        )}

        {facility.lat && facility.lng && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">{t("section.location", lang)}</h2>
            <MapView facilities={[facility]} centerLat={facility.lat} centerLng={facility.lng} zoom={15} />
          </div>
        )}

        <div className="pt-2">
          <ReportLink entityType="facility" entityName={getLangValue(facility.name_en, facility.name_mr, lang)} />
        </div>
      </div>
    </div>
  )
}

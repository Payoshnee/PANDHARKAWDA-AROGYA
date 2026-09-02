import { Link } from "react-router-dom"
import { Phone, Navigation, MapPin, Building2 } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { getTelUrl, getMapsUrl, isStale } from "@/lib/utils-health"
import type { Facility } from "@/types"
import { VerificationBadge } from "@/components/shared/verification"
import { StatusBadge, getFacilityStatus, getClosingTime, OpenUntilBadge } from "@/components/shared/status-badges"
import { cn } from "@/lib/utils"

const TYPE_STYLES: Record<string, string> = {
  hospital: "bg-primary/10 text-primary",
  clinic: "bg-info/10 text-info",
  diagnostic: "bg-chart-3/10 text-chart-3",
  government: "bg-success/10 text-success",
}

export function FacilityCard({ facility }: { facility: Facility }) {
  const { lang } = useLang()
  const status = getFacilityStatus(facility.id)
  const closingTime = getClosingTime(facility.id)

  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link to={`/facilities/${facility.slug}`}>
            <h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              {getLangValue(facility.name_en, facility.name_mr, lang)}
            </h3>
          </Link>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <MapPin className="size-3 shrink-0" />
            {getLangValue(facility.address_en, facility.address_mr, lang)}
          </p>
        </div>
        <span className={cn(
          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium shrink-0",
          TYPE_STYLES[facility.type] || "bg-muted text-muted-foreground"
        )}>
          <Building2 className="size-3" />
          {lang === "mr"
            ? { hospital: "रुग्णालय", clinic: "दवाखाना", diagnostic: "निदान केंद्र", government: "सरकारी" }[facility.type]
            : { hospital: "Hospital", clinic: "Clinic", diagnostic: "Diagnostic", government: "Government" }[facility.type]}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {status === "open" && closingTime && closingTime !== "24 hrs"
          ? <OpenUntilBadge time={closingTime} />
          : <StatusBadge status={status} />}
        {facility.has_emergency && (
          <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
            {t("nav.emergency", lang)}
          </span>
        )}
      </div>

      {!isStale(facility.last_verified) && (
        <div className="mt-2">
          <VerificationBadge verified={facility.verified} lastVerified={facility.last_verified} />
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Link
          to={`/facilities/${facility.slug}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent transition-colors"
        >
          {t("action.viewDetails", lang)}
        </Link>
        <a
          href={getTelUrl(facility.phone)}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent transition-colors"
        >
          <Phone className="size-3.5" />
          {t("action.call", lang)}
        </a>
        <a
          href={getMapsUrl(facility.lat, facility.lng, getLangValue(facility.address_en, facility.address_mr, lang))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent transition-colors"
        >
          <Navigation className="size-3.5" />
          {t("action.directions", lang)}
        </a>
      </div>
    </div>
  )
}

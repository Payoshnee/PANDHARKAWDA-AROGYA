import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, Info } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { DEMO_FACILITIES, DEMO_DOCTORS } from "@/lib/mock-data"
import { getFacilityStatus, getClosingTime, getDoctorAvailability, StatusBadge, OpenUntilBadge, DoctorAvailabilityBadge } from "@/components/shared/status-badges"
import { PageHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/states"
import { isStale } from "@/lib/utils-health"
import { cn } from "@/lib/utils"

export function OpenNowPage() {
  const { lang } = useLang()
  const [filter, setFilter] = useState<"all" | "doctorAvailable" | "callToConfirm">("all")

  const listings = useMemo(() => {
    return DEMO_FACILITIES
      .filter(f => !f.is_public_hospital)
      .map(f => {
        const status = getFacilityStatus(f.id)
        const doctors = DEMO_DOCTORS.filter(d => d.facility_id === f.id && !d.is_visiting)
        const doctorAvailabilities = doctors.map(d => ({
          doctor: d,
          availability: getDoctorAvailability(d.id),
        }))
        const anyDoctorAvailable = doctorAvailabilities.some(d => d.availability === "available")
        const anyDoctorUnknown = doctorAvailabilities.some(d => d.availability === "unknown")
        const allUnavailable = doctorAvailabilities.length > 0 && doctorAvailabilities.every(d => d.availability === "not_available")
        return { facility: f, status, doctors: doctorAvailabilities, anyDoctorAvailable, anyDoctorUnknown, allUnavailable }
      })
      .filter(l => l.status === "open")
  }, [])

  const filtered = listings.filter(l => {
    if (filter === "doctorAvailable") return l.anyDoctorAvailable
    if (filter === "callToConfirm") return l.anyDoctorUnknown || isStale(l.facility.last_verified)
    return true
  })

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t("nav.openNow", lang)}
        subtitle={lang === "mr" ? "दवाखाना उघडे आहे आणि डॉक्टर उपलब्ध आहे का हे स्वतंत्र दर्शविले जाते." : "Clinic opening and doctor availability are shown separately."}
      />

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
            filter === "all" ? "bg-primary text-primary-foreground" : "border border-input bg-background hover:bg-accent"
          )}
        >
          {lang === "mr" ? "सर्व" : "All"}
        </button>
        <button
          onClick={() => setFilter("doctorAvailable")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
            filter === "doctorAvailable" ? "bg-success text-success-foreground" : "border border-input bg-background hover:bg-accent"
          )}
        >
          {t("status.available", lang)}
        </button>
        <button
          onClick={() => setFilter("callToConfirm")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
            filter === "callToConfirm" ? "bg-warning text-warning-foreground" : "border border-input bg-background hover:bg-accent"
          )}
        >
          {t("status.callToConfirm", lang)}
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={lang === "mr" ? "आता कोणतेही केंद्र उघडे नाही" : "No facilities open right now"}
          message={lang === "mr" ? "कृपया नंतर तपासा किंवा सरकारी रुग्णालयाला भेट द्या." : "Please check later or visit the civil hospital."}
          actionLabel={t("nav.facilities", lang)}
          actionTo="/facilities"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(({ facility, doctors }) => {
            const closingTime = getClosingTime(facility.id)
            const stale = isStale(facility.last_verified)
            return (
              <Link
                key={facility.id}
                to={`/facilities/${facility.slug}`}
                className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {getLangValue(facility.name_en, facility.name_mr, lang)}
                  </p>
                  {closingTime && closingTime !== "24 hrs"
                    ? <OpenUntilBadge time={closingTime} />
                    : <StatusBadge status="open" />}
                </div>

                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <MapPin className="size-3" />
                  {getLangValue(facility.address_en, facility.address_mr, lang)}
                </p>

                <div className="mt-3 border-t border-border pt-2 space-y-1.5">
                  {doctors.length > 0 ? doctors.map(({ doctor, availability }) => (
                    <div key={doctor.id} className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">
                        {getLangValue(doctor.name_en, doctor.name_mr, lang)}
                      </p>
                      <DoctorAvailabilityBadge status={availability} />
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Info className="size-3" />
                      {lang === "mr" ? "डॉक्टर माहिती उपलब्ध नाही" : "Doctor info unavailable"}
                    </p>
                  )}
                </div>

                {stale && (
                  <div className="mt-2">
                    <p className="text-xs text-warning-foreground flex items-center gap-1.5">
                      {t("status.needsConfirmation", lang)}
                    </p>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

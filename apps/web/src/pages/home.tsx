import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Stethoscope, Clock, Users, Hospital, Phone, ChevronRight, FileText, MapPin } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { usePublicData } from "@/lib/api"
import { formatDateShort, relativeDays } from "@/lib/utils-health"
import { VerificationBadge } from "@/components/shared/verification"
import { StatusBadge, OpenUntilBadge, DoctorAvailabilityBadge, getFacilityStatus, getClosingTime, getDoctorAvailability } from "@/components/shared/status-badges"
import { SectionHeader } from "@/components/shared/section-header"

export function HomePage() {
  const { lang } = useLang()
  const { data } = usePublicData()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const confirmedVisits = useMemo(() =>
    data.visitingSessions
      .filter(v => v.status === "confirmed")
      .sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime())
      .slice(0, 3)
  , [data.visitingSessions])

  const openNowFacilities = useMemo(() =>
    data.facilities
      .filter(f => getFacilityStatus(f.id) === "open" && !f.is_public_hospital)
      .slice(0, 4)
  , [data.facilities])

  const publicHospital = data.facilities.find(f => f.is_public_hospital)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/doctors?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin className="size-4" />
            {t("app.location", lang)}
          </p>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("app.tagline", lang)}
          </h1>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search.placeholder", lang)}
            className="h-12 w-full rounded-lg border border-input bg-surface-raised pl-11 pr-4 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </form>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Link
            to="/doctors"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent/50"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Stethoscope className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{t("action.findDoctor", lang)}</p>
              <p className="text-xs text-muted-foreground truncate">{lang === "mr" ? "स्थानिक आणि भेट देणारे डॉक्टर" : "Local and visiting doctors"}</p>
            </div>
            <ChevronRight className="ml-auto size-4 text-muted-foreground shrink-0" />
          </Link>

          <Link
            to="/open-now"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent/50"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success shrink-0">
              <Clock className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{t("action.openNow", lang)}</p>
              <p className="text-xs text-muted-foreground truncate">{lang === "mr" ? "आता उघडे आरोग्य केंद्र" : "Healthcare facilities open now"}</p>
            </div>
            <ChevronRight className="ml-auto size-4 text-muted-foreground shrink-0" />
          </Link>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Link to="/doctors/visiting" className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-accent/50">
            <Users className="size-4 text-info shrink-0" />
            {t("action.visitingSpecialists", lang)}
          </Link>
          <Link to="/facilities" className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-accent/50">
            <Hospital className="size-4 text-primary shrink-0" />
            {t("action.hospitals", lang)}
          </Link>
          <Link to="/schemes" className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-accent/50">
            <FileText className="size-4 text-chart-3 shrink-0" />
            {t("nav.schemes", lang)}
          </Link>
        </div>

        <a
          href="/emergency"
          onClick={(e) => { e.preventDefault(); navigate("/emergency") }}
          className="flex items-center justify-between gap-3 rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3.5 transition-colors hover:bg-destructive/10"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-destructive text-destructive-foreground shrink-0">
              <Phone className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-destructive">{t("action.emergency", lang)}</p>
              <p className="text-xs text-muted-foreground">{lang === "mr" ? "108, 102, 104 क्रमांक" : "Call 108, 102, 104"}</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-destructive shrink-0" />
        </a>
      </section>

      {confirmedVisits.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            title={t("section.visitingSoon", lang)}
            actionLabel={lang === "mr" ? "सर्व पहा" : "View all"}
            actionTo="/doctors/visiting"
          />
          <div className="space-y-2">
            {confirmedVisits.map(visit => {
              return (
                <Link
                  key={visit.id}
                  to={`/doctors/${visit.doctor?.slug}`}
                  className="flex items-stretch gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30"
                >
                  <div className="flex w-14 flex-col items-center justify-center rounded-md bg-primary/5 py-2 shrink-0">
                    <span className="text-lg font-bold text-primary leading-none">
                      {new Date(visit.visit_date).getDate()}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDateShort(visit.visit_date, lang).split(" ")[1]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {visit.doctor && getLangValue(visit.doctor.name_en, visit.doctor.name_mr, lang)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {visit.doctor?.specialty && getLangValue(visit.doctor.specialty.name_en, visit.doctor.specialty.name_mr, lang)}
                      {visit.doctor?.home_city_en && ` · ${lang === "mr" ? "मूळ" : "From"} ${getLangValue(visit.doctor.home_city_en, visit.doctor.home_city_mr, lang)}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {visit.facility && getLangValue(visit.facility.name_en, visit.facility.name_mr, lang)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {visit.start_time}–{visit.end_time}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                      {t("status.confirmed", lang)}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {openNowFacilities.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            title={t("section.openNow", lang)}
            actionLabel={lang === "mr" ? "सर्व पहा" : "View all"}
            actionTo="/open-now"
          />
          <div className="space-y-2">
            {openNowFacilities.map(facility => {
              const facilityDoctors = data.doctors.filter(d => d.facility_id === facility.id && !d.is_visiting)
              const closingTime = getClosingTime(facility.id)
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
                  {facilityDoctors.length > 0 ? (
                    facilityDoctors.map(doc => (
                      <div key={doc.id} className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
                        <p className="text-xs text-muted-foreground">
                          {getLangValue(doc.name_en, doc.name_mr, lang)}
                        </p>
                        <DoctorAvailabilityBadge status={getDoctorAvailability(doc.id)} />
                      </div>
                    ))
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground border-t border-border pt-2">
                      {lang === "mr" ? "या दवाखान्यातील डॉक्टर माहिती उपलब्ध नाही" : "No doctor information available for this clinic"}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {publicHospital && (
        <section className="space-y-3">
          <SectionHeader title={t("section.publicHospital", lang)} actionTo={`/facilities/${publicHospital.slug}`} actionLabel={lang === "mr" ? "अधिक" : "More"} />
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {getLangValue(publicHospital.name_en, publicHospital.name_mr, lang)}
                </h3>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <MapPin className="size-3" />
                  {getLangValue(publicHospital.address_en, publicHospital.address_mr, lang)}
                </p>
              </div>
              {publicHospital.has_emergency && (
                <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive shrink-0">
                  <Phone className="size-3" />
                  {t("nav.emergency", lang)}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {getLangValue(
                publicHospital.services_en.join(", "),
                publicHospital.services_mr.join(", "),
                lang
              ).split(", ").slice(0, 4).map((s, i) => (
                <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Link to={`/facilities/${publicHospital.slug}`} className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent transition-colors">
                {lang === "mr" ? "सेवा पहा" : "View services"}
              </Link>
              <a href={`tel:${publicHospital.phone}`} className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent transition-colors">
                <Phone className="size-3.5" />
                {t("action.call", lang)}
              </a>
            </div>
          </div>
        </section>
      )}

      {data.updates.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            title={t("section.verifiedUpdates", lang)}
            actionTo="/health-alerts" actionLabel={lang === "mr" ? "सर्व" : "All"}
          />
          <div className="space-y-3">
            {data.updates.slice(0, 4).map(update => (
              <div key={update.id} className="border-l-2 border-primary/30 pl-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">{getLangValue(update.category_en, update.category_mr, lang)}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{relativeDays(update.date, lang)}</span>
                </div>
                <p className="text-sm font-medium text-foreground mt-1">
                  {getLangValue(update.title_en, update.title_mr, lang)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getLangValue(update.summary_en, update.summary_mr, lang)}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{getLangValue(update.source_en, update.source_mr, lang)}</span>
                  {update.verified && <VerificationBadge verified={true} lastVerified={update.date} />}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-muted-foreground pt-4">
        {t("common.demoData", lang)}
      </p>
    </div>
  )
}

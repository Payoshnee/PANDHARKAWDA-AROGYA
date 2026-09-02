import { useParams, Link, useNavigate } from "react-router-dom"
import { Phone, Navigation, MapPin, ArrowLeft, Calendar, Clock, Stethoscope } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { usePublicData } from "@/lib/api"
import { formatDate, formatTime, getDayName, todayDayNum, relativeDays, getMapsUrl, getTelUrl, isStale } from "@/lib/utils-health"
import { VerificationBadge, FreshnessIndicator } from "@/components/shared/verification"
import { DoctorAvailabilityBadge, getDoctorAvailability, getFacilityStatus, StatusBadge } from "@/components/shared/status-badges"
import { SaveButton } from "@/components/shared/doctor-card"
import { ReportLink } from "@/components/shared/report-dialog"
import { NotFoundState } from "@/components/shared/states"
import { cn } from "@/lib/utils"

export function DoctorDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang } = useLang()
  const navigate = useNavigate()
  const { data } = usePublicData()

  const doctor = data.doctors.find(d => d.slug === slug)
  if (!doctor) return <NotFoundState />

  const availability = getDoctorAvailability(doctor.id)
  const facilityStatus = doctor.facility ? getFacilityStatus(doctor.facility.id) : "unknown"
  const upcomingVisits = data.visitingSessions
    .filter(v => v.doctor_id === doctor.id && v.status === "confirmed" && new Date(v.visit_date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime())

  const weeklySchedule = [
    { day: 0, slots: doctor.id === "d1" ? [{ start: "09:00", end: "13:00" }, { start: "17:00", end: "20:00" }] : doctor.id === "d2" ? [{ start: "10:00", end: "14:00" }] : [] },
    { day: 1, slots: doctor.id === "d1" ? [{ start: "09:00", end: "13:00" }, { start: "17:00", end: "20:00" }] : [] },
    { day: 2, slots: doctor.id === "d1" ? [{ start: "09:00", end: "13:00" }] : doctor.id === "d6" ? [{ start: "09:00", end: "17:00" }] : [] },
    { day: 3, slots: doctor.id === "d1" ? [{ start: "09:00", end: "13:00" }, { start: "17:00", end: "20:00" }] : [] },
    { day: 4, slots: doctor.id === "d1" ? [{ start: "09:00", end: "13:00" }, { start: "17:00", end: "20:00" }] : doctor.id === "d2" ? [{ start: "10:00", end: "14:00" }] : [] },
    { day: 5, slots: doctor.id === "d1" ? [{ start: "10:00", end: "14:00" }] : [] },
    { day: 6, slots: [] },
  ]
  const todayNum = todayDayNum()
  const stale = isStale(doctor.last_verified)

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        {t("common.back", lang)}
      </button>

      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {getLangValue(doctor.name_en, doctor.name_mr, lang)}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {getLangValue(doctor.qualification_en, doctor.qualification_mr, lang)}
              </p>
              <p className="text-sm text-foreground mt-2 flex items-center gap-1.5">
                <Stethoscope className="size-4 text-primary" />
                {doctor.specialty && getLangValue(doctor.specialty.name_en, doctor.specialty.name_mr, lang)}
              </p>
              <span className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                doctor.is_visiting ? "bg-info/10 text-info" : "bg-primary/10 text-primary"
              )}>
                {doctor.is_visiting ? t("doctor.visiting", lang) : t("doctor.local", lang)}
              </span>
            </div>
            <SaveButton doctorId={doctor.id} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <VerificationBadge verified={doctor.verified} lastVerified={doctor.last_verified} />
            <span className="text-xs text-muted-foreground">
              {relativeDays(doctor.last_verified, lang)}
            </span>
          </div>
        </div>

        {stale && (
          <FreshnessIndicator lastVerified={doctor.last_verified} />
        )}

        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">{t("section.availability", lang)}</h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{t("doctor.clinicStatus", lang)}</span>
              {doctor.facility && <StatusBadge status={facilityStatus} />}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{t("doctor.doctorAvailability", lang)}</span>
              <DoctorAvailabilityBadge status={availability} />
            </div>
          </div>

          {availability === "available" && (
            <p className="text-xs font-medium text-success border-t border-border pt-2">
              {t("doctor.availableToday", lang)}
            </p>
          )}
          {availability === "not_available" && (
            <p className="text-xs font-medium text-muted-foreground border-t border-border pt-2">
              {t("doctor.notAvailableNow", lang)}
            </p>
          )}
        </div>

        {!doctor.is_visiting && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">{t("section.weeklySchedule", lang)}</h2>
            <div className="space-y-1.5">
              {weeklySchedule.map((day) => {
                const isToday = day.day === todayNum
                return (
                  <div
                    key={day.day}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-md px-3 py-2",
                      isToday && "bg-primary/5 border border-primary/20"
                    )}
                  >
                    <span className={cn(
                      "text-sm w-12 shrink-0",
                      isToday ? "font-semibold text-primary" : "text-muted-foreground"
                    )}>
                      {getDayName(day.day, lang)}
                    </span>
                    <span className="text-sm text-foreground text-right">
                      {day.slots.length > 0
                        ? day.slots.map(s => `${formatTime(s.start)}–${formatTime(s.end)}`).join(" · ")
                        : t("day.notAvailable", lang)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {doctor.is_visiting && upcomingVisits.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">{t("doctor.nextVisit", lang)}</h2>
            {upcomingVisits.map(visit => (
              <div key={visit.id} className="rounded-md bg-primary/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {formatDate(visit.visit_date, lang)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {formatTime(visit.start_time)}–{formatTime(visit.end_time)}
                </p>
                {visit.facility && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {getLangValue(visit.facility.name_en, visit.facility.name_mr, lang)}
                  </p>
                )}
                {visit.confirmed_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("status.confirmed", lang)}: {relativeDays(visit.confirmed_at, lang)}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  {doctor.phone && (
                    <a href={getTelUrl(doctor.phone)} className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent">
                      <Phone className="size-3.5" />
                      {t("doctor.callForAppointment", lang)}
                    </a>
                  )}
                  {visit.facility && (
                    <a
                      href={getMapsUrl(visit.facility.lat, visit.facility.lng, getLangValue(visit.facility.address_en, visit.facility.address_mr, lang))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent"
                    >
                      <Navigation className="size-3.5" />
                      {t("action.directions", lang)}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {doctor.facility && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("section.contact", lang)}</h2>
            <Link to={`/facilities/${doctor.facility.slug}`} className="text-sm text-primary hover:underline">
              {getLangValue(doctor.facility.name_en, doctor.facility.name_mr, lang)}
            </Link>
            <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
              <MapPin className="size-3.5 mt-0.5 shrink-0" />
              {getLangValue(doctor.facility.address_en, doctor.facility.address_mr, lang)}
            </p>
            <div className="flex gap-2 mt-3">
              {doctor.phone && (
                <a href={getTelUrl(doctor.phone)} className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90">
                  <Phone className="size-3.5" />
                  {t("action.call", lang)}
                </a>
              )}
              <a
                href={getMapsUrl(doctor.facility.lat, doctor.facility.lng, getLangValue(doctor.facility.address_en, doctor.facility.address_mr, lang))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent"
              >
                <Navigation className="size-3.5" />
                {t("action.directions", lang)}
              </a>
            </div>
          </div>
        )}

        <div className="pt-2">
          <ReportLink
            entityType="doctor"
            entityName={getLangValue(doctor.name_en, doctor.name_mr, lang)}
          />
        </div>
      </div>
    </div>
  )
}

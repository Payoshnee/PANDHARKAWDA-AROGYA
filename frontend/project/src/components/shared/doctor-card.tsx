import { Link } from "react-router-dom"
import { Phone, Star, Stethoscope, MapPin } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { getTelUrl, isStale } from "@/lib/utils-health"
import type { Doctor } from "@/types"
import { VerificationBadge } from "@/components/shared/verification"
import { getDoctorAvailability, DoctorAvailabilityBadge } from "@/components/shared/status-badges"
import { cn } from "@/lib/utils"

export function DoctorCard({ doctor, compact }: { doctor: Doctor; compact?: boolean }) {
  const { lang } = useLang()
  const availability = getDoctorAvailability(doctor.id)
  const stale = isStale(doctor.last_verified)

  return (
    <div className={cn(
      "rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30",
      compact && "p-3"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link to={`/doctors/${doctor.slug}`} className="block">
            <h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              {getLangValue(doctor.name_en, doctor.name_mr, lang)}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {getLangValue(doctor.qualification_en, doctor.qualification_mr, lang)}
          </p>
          <p className="text-xs text-foreground/80 mt-1">
            {doctor.specialty && getLangValue(doctor.specialty.name_en, doctor.specialty.name_mr, lang)}
          </p>
        </div>
        <span className={cn(
          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium shrink-0",
          doctor.is_visiting
            ? "bg-info/10 text-info"
            : "bg-primary/10 text-primary"
        )}>
          <Stethoscope className="size-3" />
          {doctor.is_visiting ? t("doctor.visiting", lang) : t("doctor.local", lang)}
        </span>
      </div>

      {!compact && (
        <div className="mt-3 space-y-2">
          {doctor.facility && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              {getLangValue(doctor.facility.name_en, doctor.facility.name_mr, lang)}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            <DoctorAvailabilityBadge status={availability} />
            <VerificationBadge verified={doctor.verified} lastVerified={doctor.last_verified} />
          </div>

          {doctor.is_visiting && doctor.home_city_en && (
            <p className="text-xs text-muted-foreground">
              {lang === "mr" ? "मूळ शहर" : "From"}: {getLangValue(doctor.home_city_en, doctor.home_city_mr, lang)}
            </p>
          )}

          {stale && (
            <p className="text-xs text-warning-foreground">
              {t("status.stale", lang)}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/doctors/${doctor.slug}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent transition-colors"
            >
              {t("action.viewDetails", lang)}
            </Link>
            {doctor.phone && (
              <a
                href={getTelUrl(doctor.phone)}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-accent transition-colors"
              >
                <Phone className="size-3.5" />
                {t("action.call", lang)}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function DoctorCompactRow({ doctor }: { doctor: Doctor }) {
  const { lang } = useLang()
  const availability = getDoctorAvailability(doctor.id)

  return (
    <Link
      to={`/doctors/${doctor.slug}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {getLangValue(doctor.name_en, doctor.name_mr, lang)}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {doctor.specialty && getLangValue(doctor.specialty.name_en, doctor.specialty.name_mr, lang)}
          {doctor.facility && ` · ${getLangValue(doctor.facility.name_en, doctor.facility.name_mr, lang)}`}
        </p>
      </div>
      <DoctorAvailabilityBadge status={availability} />
    </Link>
  )
}

export function SaveButton({ doctorId }: { doctorId: string }) {
  const { lang } = useLang()
  const saved = useIsSaved(doctorId)
  return (
    <button
      onClick={() => toggleSave(doctorId)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium shadow-xs transition-colors",
        saved
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-input bg-background hover:bg-accent"
      )}
    >
      <Star className={cn("size-3.5", saved && "fill-primary text-primary")} />
      {saved ? t("action.saved", lang) : t("action.save", lang)}
    </button>
  )
}

const SAVED_KEY = "arogya_saved"

function useIsSaved(id: string): boolean {
  const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")
  return saved.includes(id)
}

function toggleSave(id: string) {
  const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")
  if (saved.includes(id)) {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved.filter((s: string) => s !== id)))
  } else {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved, id]))
  }
  window.dispatchEvent(new Event("arogya-saved-change"))
}

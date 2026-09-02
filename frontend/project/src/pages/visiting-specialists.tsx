import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Phone, Navigation, MapPin } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { DEMO_VISITING_SESSIONS } from "@/lib/mock-data"
import { formatDate, formatTime, getVisitingDateGroup, getMapsUrl, getTelUrl } from "@/lib/utils-health"
import { VerificationBadge } from "@/components/shared/verification"
import { PageHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/states"

const GROUP_ORDER: ("today" | "thisWeek" | "nextWeek" | "later")[] = ["today", "thisWeek", "nextWeek", "later"]

export function VisitingSpecialistsPage() {
  const { lang } = useLang()

  const grouped = useMemo(() => {
    const groups: Record<string, typeof DEMO_VISITING_SESSIONS> = {
      today: [], thisWeek: [], nextWeek: [], later: []
    }
    DEMO_VISITING_SESSIONS
      .filter(v => v.status === "confirmed" || v.status === "pending")
      .forEach(v => {
        const group = getVisitingDateGroup(v.visit_date)
        groups[group].push(v)
      })
    Object.keys(groups).forEach(k => {
      groups[k].sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime())
    })
    return groups
  }, [])

  const hasAny = GROUP_ORDER.some(g => grouped[g].length > 0)

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t("nav.visiting", lang)}
        subtitle={lang === "mr" ? "पांढरकवडा येथे भेट देणाऱ्या तज्ज्ञांचे वेळापत्रक" : "Schedule of specialists visiting Pandharkawda"}
      />

      {!hasAny ? (
        <EmptyState
          title={lang === "mr" ? "कोणतेही भेट सत्र नाही" : "No visiting sessions"}
          message={lang === "mr" ? "सध्या नियोजित कोणतेही भेट सत्र नाहीत." : "There are no scheduled visiting sessions at this time."}
          actionLabel={t("nav.doctors", lang)}
          actionTo="/doctors"
        />
      ) : (
        <div className="space-y-6">
          {GROUP_ORDER.map(group => {
            if (grouped[group].length === 0) return null
            const groupKey = { today: "group.today", thisWeek: "group.thisWeek", nextWeek: "group.nextWeek", later: "group.later" }[group]
            return (
              <div key={group}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {t(groupKey, lang)}
                </h2>
                <div className="space-y-2">
                  {grouped[group].map(visit => (
                    <div key={visit.id} className="flex items-stretch gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30">
                      <div className="flex w-16 flex-col items-center justify-center rounded-md bg-primary/5 py-3 shrink-0">
                        <span className="text-xl font-bold text-primary leading-none">
                          {new Date(visit.visit_date).getDate()}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {formatDate(visit.visit_date, lang).split(" ")[1]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link to={`/doctors/${visit.doctor?.slug}`}>
                          <p className="text-sm font-medium text-foreground hover:text-primary">
                            {visit.doctor && getLangValue(visit.doctor.name_en, visit.doctor.name_mr, lang)}
                          </p>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {visit.doctor?.specialty && getLangValue(visit.doctor.specialty.name_en, visit.doctor.specialty.name_mr, lang)}
                          {visit.doctor?.home_city_en && ` · ${getLangValue(visit.doctor.home_city_en, visit.doctor.home_city_mr, lang)}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatTime(visit.start_time)}–{formatTime(visit.end_time)}
                        </p>
                        {visit.facility && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="size-3" />
                            {getLangValue(visit.facility.name_en, visit.facility.name_mr, lang)}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          {visit.status === "confirmed" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                              {t("status.confirmed", lang)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-warning-foreground">
                              {t("status.pending", lang)}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">·</span>
                          <VerificationBadge verified={visit.doctor?.verified ?? false} lastVerified={visit.doctor?.last_verified ?? null} />
                        </div>
                        <div className="flex gap-2 mt-2">
                          {visit.doctor?.phone && (
                            <a href={getTelUrl(visit.doctor.phone)} className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-xs hover:bg-accent">
                              <Phone className="size-3.5" />
                              {t("action.call", lang)}
                            </a>
                          )}
                          {visit.facility && (
                            <a
                              href={getMapsUrl(visit.facility.lat, visit.facility.lng, getLangValue(visit.facility.address_en, visit.facility.address_mr, lang))}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-xs hover:bg-accent"
                            >
                              <Navigation className="size-3.5" />
                              {t("action.directions", lang)}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

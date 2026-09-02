import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Info, AlertTriangle, AlertCircle, MapPin, Calendar } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { DEMO_HEALTH_ALERTS } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils-health"
import { PageHeader } from "@/components/shared/section-header"
import { NotFoundState } from "@/components/shared/states"
import { cn } from "@/lib/utils"
import type { AlertSeverity } from "@/types"

const SEVERITY_STYLES: Record<AlertSeverity, { bg: string; text: string; icon: typeof Info }> = {
  informational: { bg: "bg-info/10", text: "text-info", icon: Info },
  advisory: { bg: "bg-warning/10", text: "text-warning-foreground", icon: AlertTriangle },
  important: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertCircle },
}

export function HealthAlertsPage() {
  const { lang } = useLang()
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t("nav.alerts", lang)}
        subtitle={lang === "mr" ? "प्रमाणित आरोग्य सूचना आणि जाहीरनामे" : "Verified health notices and bulletins"}
      />
      <div className="space-y-3">
        {DEMO_HEALTH_ALERTS.map(alert => {
          const style = SEVERITY_STYLES[alert.severity]
          const Icon = style.icon
          return (
            <Link
              key={alert.id}
              to={`/health-alerts/${alert.slug}`}
              className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start gap-3">
                <span className={cn("flex size-9 items-center justify-center rounded-lg shrink-0", style.bg)}>
                  <Icon className={cn("size-4", style.text)} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium", style.bg, style.text)}>
                      {t(`alert.${alert.severity}`, lang)}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(alert.published_at, lang)}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mt-1.5">{getLangValue(alert.title_en, alert.title_mr, lang)}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{getLangValue(alert.summary_en, alert.summary_mr, lang)}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <MapPin className="size-3" />
                    {getLangValue(alert.area_en, alert.area_mr, lang)}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

export function HealthAlertDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang } = useLang()
  const navigate = useNavigate()
  const alert = DEMO_HEALTH_ALERTS.find(a => a.slug === slug)
  if (!alert) return <NotFoundState />
  const style = SEVERITY_STYLES[alert.severity]
  const Icon = style.icon

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" />
        {t("common.back", lang)}
      </button>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium", style.bg, style.text)}>
            <Icon className="size-4" />
            {t(`alert.${alert.severity}`, lang)}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{getLangValue(alert.title_en, alert.title_mr, lang)}</h1>

        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {t("alert.area", lang)}: {getLangValue(alert.area_en, alert.area_mr, lang)}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {t("alert.activePeriod", lang)}: {formatDate(alert.active_from, lang)}
            {alert.active_until && ` – ${formatDate(alert.active_until, lang)}`}
          </p>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">{lang === "mr" ? "संक्षिप्त" : "Summary"}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(alert.summary_en, alert.summary_mr, lang)}</p>
        </section>

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h2 className="text-sm font-semibold text-foreground mb-2">{t("alert.recommendedAction", lang)}</h2>
          <p className="text-sm text-foreground leading-relaxed">{getLangValue(alert.action_en, alert.action_mr, lang)}</p>
        </section>

        <div className="border-t border-border pt-3 space-y-1">
          <p className="text-xs text-muted-foreground">{t("section.source", lang)}: {getLangValue(alert.source_en, alert.source_mr, lang)}</p>
          <p className="text-xs text-muted-foreground">{lang === "mr" ? "प्रकाशित" : "Published"}: {formatDate(alert.published_at, lang)}</p>
          <p className="text-xs text-muted-foreground">{t("section.reviewed", lang)}: {formatDate(alert.reviewed_at, lang)}</p>
        </div>
      </div>
    </div>
  )
}

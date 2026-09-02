import { CheckCircle2, AlertTriangle, Clock, Phone } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { daysSince, isStale } from "@/lib/utils-health"
import { cn } from "@/lib/utils"

export function VerificationBadge({ verified, lastVerified, className }: {
  verified: boolean
  lastVerified: string | null
  className?: string
}) {
  const { lang } = useLang()
  const stale = isStale(lastVerified)

  if (!verified) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-medium text-muted-foreground", className)}>
        <AlertTriangle className="size-3.5 text-warning" />
        {lang === "mr" ? "खात्री करणे आवश्यक" : "Unverified"}
      </span>
    )
  }

  if (stale) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-medium text-warning-foreground", className)}>
        <Clock className="size-3.5" />
        {lang === "mr" ? "माहिती तपासणी आवश्यक" : "Needs reconfirmation"}
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium text-success", className)}>
      <CheckCircle2 className="size-3.5" />
      {t("status.verified", lang)}
    </span>
  )
}

export function FreshnessIndicator({ lastVerified, className }: {
  lastVerified: string | null
  className?: string
}) {
  const { lang } = useLang()
  const days = daysSince(lastVerified)
  const stale = isStale(lastVerified)

  if (stale) {
    return (
      <div className={cn("rounded-md bg-warning/10 border border-warning/30 px-3 py-2", className)}>
        <p className="text-xs font-medium text-warning-foreground flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {t("status.needsConfirmation", lang)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("status.lastVerified", lang)}: {days === Infinity ? (lang === "mr" ? "अज्ञात" : "Unknown") : `${days} ${t("status.daysAgo", lang)}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("status.stale", lang)}
        </p>
      </div>
    )
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Clock className="size-3" />
      {t("status.lastVerified", lang)}: {days === Infinity ? (lang === "mr" ? "अज्ञात" : "Unknown") : `${days} ${t("status.daysAgo", lang)}`}
    </span>
  )
}

export function SourceLabel({ source, className }: { source: string; className?: string }) {
  const { lang } = useLang()
  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {t("section.source", lang)}: {source}
    </span>
  )
}

export function CallToConfirmBanner({ phone }: { phone: string | null }) {
  const { lang } = useLang()
  if (!phone) return null
  return (
    <div className="rounded-md bg-warning/10 border border-warning/30 px-3 py-2.5 flex items-center justify-between gap-3">
      <p className="text-xs text-warning-foreground">
        {t("status.stale", lang)}
      </p>
      <a
        href={`tel:${phone}`}
        className="inline-flex items-center gap-1.5 rounded-md bg-warning/20 px-3 py-1.5 text-xs font-medium text-warning-foreground hover:bg-warning/30 transition-colors"
      >
        <Phone className="size-3.5" />
        {t("action.call", lang)}
      </a>
    </div>
  )
}

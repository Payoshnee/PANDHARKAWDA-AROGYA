import { Link } from "react-router-dom"
import { HeartPulse, Phone } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"

export function Logo({ size = "default" }: { size?: "default" | "sm" }) {
  const { lang } = useLang()
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
        <HeartPulse className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-semibold text-foreground tracking-tight ${size === "sm" ? "text-sm" : "text-base"}`}>
          {t("app.name", lang)}
        </span>
        <span className="text-xs text-muted-foreground" lang="mr">
          {t("app.name", lang === "en" ? "mr" : "en")}
        </span>
      </span>
    </Link>
  )
}

export function LanguageToggle() {
  const { lang, toggleLang } = useLang()
  return (
    <button
      onClick={toggleLang}
      className="inline-flex h-9 items-center gap-1 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent"
      aria-label="Switch language"
    >
      <span className={lang === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
      <span className="text-muted-foreground">|</span>
      <span className={lang === "mr" ? "text-foreground" : "text-muted-foreground"} lang="mr">मराठी</span>
    </button>
  )
}

export function EmergencyButton({ onClick }: { onClick: () => void }) {
  const { lang } = useLang()
  return (
    <button
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-md bg-destructive px-4 text-sm font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 focus-visible:ring-[3px] focus-visible:ring-destructive/30"
    >
      <Phone className="size-4" />
      {t("nav.emergency", lang)}
    </button>
  )
}

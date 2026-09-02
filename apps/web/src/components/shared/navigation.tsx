import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, Phone, Home, Stethoscope, Clock, MessageSquare, MoreHorizontal, Hospital, FileText, FlaskConical, Bell, Bookmark, Info } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Logo, LanguageToggle, EmergencyButton } from "@/components/shared/logo"
import { EmergencySheet } from "@/components/shared/emergency-sheet"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/doctors", labelKey: "nav.doctors", icon: Stethoscope },
  { to: "/facilities", labelKey: "nav.facilities", icon: Hospital },
  { to: "/schemes", labelKey: "nav.schemes", icon: FileText },
  { to: "/tests", labelKey: "nav.tests", icon: FlaskConical },
  { to: "/health-alerts", labelKey: "nav.alerts", icon: Bell },
  { to: "/ask-arogya", labelKey: "nav.ask", icon: MessageSquare },
]

const MORE_LINKS = [
  { to: "/doctors/visiting", labelKey: "nav.visiting", icon: Stethoscope },
  { to: "/open-now", labelKey: "nav.openNow", icon: Clock },
  { to: "/medical-explainer", labelKey: "nav.tests", icon: Info },
  { to: "/saved", labelKey: "nav.saved", icon: Bookmark },
]

const BOTTOM_NAV = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/doctors", labelKey: "nav.doctors", icon: Stethoscope },
  { to: "/open-now", labelKey: "nav.openNow", icon: Clock },
  { to: "/ask-arogya", labelKey: "nav.ask", icon: MessageSquare },
]

export function AppHeader() {
  const { lang } = useLang()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm safe-top">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = location.pathname === link.to ||
                (link.to !== "/" && location.pathname.startsWith(link.to))
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {t(link.labelKey, lang)}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <EmergencyButton onClick={() => setEmergencyOpen(true)} />
            <button
              onClick={() => setMoreOpen(true)}
              className="lg:hidden inline-flex size-9 items-center justify-center rounded-md border border-input bg-background shadow-xs"
              aria-label="More menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="px-5 pt-5">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center justify-between">
              <Logo size="sm" />
            </div>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-3 py-4">
            {NAV_LINKS.map(link => {
              const Icon = link.icon
              const isActive = location.pathname === link.to ||
                (link.to !== "/" && location.pathname.startsWith(link.to))
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {t(link.labelKey, lang)}
                </Link>
              )
            })}
            <div className="my-2 h-px bg-border" />
            {MORE_LINKS.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4 shrink-0" />
                  {t(link.labelKey, lang)}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <EmergencySheet open={emergencyOpen} onOpenChange={setEmergencyOpen} />
    </>
  )
}

export function MobileNavigation() {
  const { lang } = useLang()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  const isActive = (to: string) =>
    location.pathname === to || (to !== "/" && location.pathname.startsWith(to) && !location.pathname.startsWith("/admin"))

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background lg:hidden safe-bottom">
        <div className="grid grid-cols-5">
          {BOTTOM_NAV.map(link => {
            const Icon = link.icon
            const active = isActive(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("size-5", active && "text-primary")} />
                {t(link.labelKey, lang)}
              </Link>
            )
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-muted-foreground"
          >
            <MoreHorizontal className="size-5" />
            {t("nav.more", lang)}
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[70vh] overflow-y-auto p-0" showCloseButton={false}>
          <SheetHeader className="px-5 pt-5 pb-2">
            <SheetTitle className="text-base font-semibold">{t("nav.more", lang)}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6 space-y-1">
            <Link
              to="/emergency"
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
            >
              <Phone className="size-5" />
              {t("nav.emergency", lang)}
            </Link>
            {NAV_LINKS.filter(l => !BOTTOM_NAV.some(b => b.to === l.to)).concat(MORE_LINKS).map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <Icon className="size-5 shrink-0" />
                  {t(link.labelKey, lang)}
                </Link>
              )
            })}
            <div className="my-2 h-px bg-border" />
            <div className="flex items-center justify-between px-4 py-2">
              <LanguageToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <EmergencySheet open={emergencyOpen} onOpenChange={setEmergencyOpen} />
    </>
  )
}

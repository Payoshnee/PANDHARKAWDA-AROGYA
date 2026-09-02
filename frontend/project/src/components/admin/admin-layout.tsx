import { type ReactNode, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, Stethoscope, Building2, Clock, CalendarDays,
  FileText, FlaskConical, ShieldCheck, Flag, RefreshCw, ScrollText,
  Users, Settings, LogOut, Menu, X,
} from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type NavGroup = {
  labelKey: string
  items: { to: string; labelKey: string; icon: typeof LayoutDashboard }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: "admin.overview",
    items: [{ to: "/admin", labelKey: "admin.overview", icon: LayoutDashboard }],
  },
  {
    labelKey: "admin.healthcareData",
    items: [
      { to: "/admin/doctors", labelKey: "admin.doctors", icon: Stethoscope },
      { to: "/admin/specialties", labelKey: "admin.specialties", icon: Stethoscope },
      { to: "/admin/facilities", labelKey: "admin.facilities", icon: Building2 },
    ],
  },
  {
    labelKey: "admin.availability",
    items: [
      { to: "/admin/schedules", labelKey: "admin.schedules", icon: Clock },
      { to: "/admin/visiting-sessions", labelKey: "admin.visitingSessions", icon: CalendarDays },
    ],
  },
  {
    labelKey: "admin.information",
    items: [
      { to: "/admin/services", labelKey: "admin.services", icon: FileText },
      { to: "/admin/schemes", labelKey: "admin.schemes", icon: FileText },
      { to: "/admin/tests", labelKey: "admin.tests", icon: FlaskConical },
      { to: "/admin/procedures", labelKey: "admin.procedures", icon: FlaskConical },
      { to: "/admin/knowledge", labelKey: "admin.knowledge", icon: FileText },
      { to: "/admin/health-alerts", labelKey: "admin.healthAlerts", icon: ShieldCheck },
    ],
  },
  {
    labelKey: "admin.operations",
    items: [
      { to: "/admin/verification", labelKey: "admin.verification", icon: ShieldCheck },
      { to: "/admin/reports", labelKey: "admin.reports", icon: Flag },
      { to: "/admin/freshness", labelKey: "admin.freshness", icon: RefreshCw },
    ],
  },
  {
    labelKey: "admin.system",
    items: [
      { to: "/admin/audit", labelKey: "admin.audit", icon: ScrollText },
      { to: "/admin/users", labelKey: "admin.users", icon: Users },
      { to: "/admin/settings", labelKey: "admin.settings", icon: Settings },
    ],
  },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { lang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (to: string) => location.pathname === to

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link to="/admin" className="text-base font-semibold text-sidebar-foreground">
          {t("app.name", lang)} <span className="text-xs text-sidebar-foreground/60">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.labelKey}>
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {t(group.labelKey, lang)}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon
                const active = isActive(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {t(item.labelKey, lang)}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4" />
          {lang === "mr" ? "वेबसाइटवर जा" : "Back to website"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="hidden md:block w-64 bg-sidebar border-r border-sidebar-border shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
            <button onClick={() => setSidebarOpen(false)} className="absolute right-3 top-4 text-sidebar-foreground/60">
              <X className="size-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden inline-flex size-9 items-center justify-center rounded-md border border-input">
              <Menu className="size-4" />
            </button>
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">
              {t("app.name", lang)} Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">admin@arogya.in</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AdminPageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
      {action}
    </div>
  )
}

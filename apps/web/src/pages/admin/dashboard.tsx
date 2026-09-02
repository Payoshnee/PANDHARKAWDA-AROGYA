import { Link } from "react-router-dom"
import { ShieldCheck, Clock, CalendarDays, Flag, AlertCircle, ChevronRight } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { AdminPageHeader } from "@/components/admin/admin-layout"
import { usePublicData } from "@/lib/api"
import { isStale, formatDate } from "@/lib/utils-health"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminDashboardPage() {
  const { lang } = useLang()
  const { data } = usePublicData()

  const pendingVerification = data.verificationRecords.filter(r => r.status === "pending").length
  const dueForReview = data.doctors.filter(d => isStale(d.last_verified)).length
  const upcomingVisits = data.visitingSessions.filter(v => v.status === "confirmed" && new Date(v.visit_date) >= new Date()).length
  const openReports = data.userReports.filter(r => r.status === "open").length
  const activeAlerts = data.healthAlerts.filter(a => !a.active_until || new Date(a.active_until) >= new Date()).length

  const metrics = [
    { label: t("admin.pendingVerification", lang), value: pendingVerification, icon: ShieldCheck, to: "/admin/verification", color: "text-warning-foreground", bg: "bg-warning/10" },
    { label: t("admin.dueReview", lang), value: dueForReview, icon: Clock, to: "/admin/freshness", color: "text-info", bg: "bg-info/10" },
    { label: t("admin.upcomingVisits", lang), value: upcomingVisits, icon: CalendarDays, to: "/admin/visiting-sessions", color: "text-primary", bg: "bg-primary/10" },
    { label: t("admin.openReports", lang), value: openReports, icon: Flag, to: "/admin/reports", color: "text-destructive", bg: "bg-destructive/10" },
    { label: t("admin.activeAlerts", lang), value: activeAlerts, icon: AlertCircle, to: "/admin/health-alerts", color: "text-chart-3", bg: "bg-chart-3/10" },
  ]

  return (
    <div>
      <AdminPageHeader title={t("admin.overview", lang)} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(m => {
          const Icon = m.icon
          return (
            <Link key={m.label} to={m.to}>
              <Card className="transition-colors hover:border-primary/30 cursor-pointer">
                <CardContent className="flex items-center gap-4 pt-6">
                  <span className={`flex size-11 items-center justify-center rounded-lg ${m.bg}`}>
                    <Icon className={`size-5 ${m.color}`} />
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("admin.pendingVerification", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.verificationRecords.filter(r => r.status === "pending").map(r => (
              <Link key={r.id} to="/admin/verification" className="flex items-center justify-between gap-2 rounded-md border border-border p-3 hover:bg-accent">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.entity_name}</p>
                  <p className="text-xs text-muted-foreground">{r.entity_type} · {r.source}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
            {data.verificationRecords.filter(r => r.status === "pending").length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">{lang === "mr" ? "कोणतीही प्रलंबित पडताळणी नाही" : "No pending verification"}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("admin.upcomingVisits", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.visitingSessions.filter(v => v.status === "confirmed").slice(0, 4).map(v => (
              <Link key={v.id} to="/admin/visiting-sessions" className="flex items-center justify-between gap-2 rounded-md border border-border p-3 hover:bg-accent">
                <div>
                  <p className="text-sm font-medium text-foreground">{v.doctor?.name_en}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(v.visit_date, lang)} · {v.start_time}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

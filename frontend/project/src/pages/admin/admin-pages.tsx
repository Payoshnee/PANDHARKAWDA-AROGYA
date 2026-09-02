import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import {
  DEMO_DOCTORS, DEMO_FACILITIES, DEMO_SPECIALTIES, DEMO_VISITING_SESSIONS,
  DEMO_SCHEMES, DEMO_TESTS, DEMO_PROCEDURES, DEMO_HEALTH_ALERTS,
  DEMO_VERIFICATION_RECORDS, DEMO_USER_REPORTS, DEMO_AUDIT_LOGS,
  DEMO_ADMIN_USERS,
} from "@/lib/mock-data"
import { formatDate, relativeDays, isStale } from "@/lib/utils-health"
import { AdminPageHeader } from "@/components/admin/admin-layout"
import { VerificationBadge } from "@/components/shared/verification"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Search, Check, X, AlertTriangle, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export function AdminDoctorsPage() {
  const { lang } = useLang()
  const [query, setQuery] = useState("")
  const filtered = DEMO_DOCTORS.filter(d => !query || d.name_en.toLowerCase().includes(query.toLowerCase()) || d.name_mr.includes(query))

  return (
    <div>
      <AdminPageHeader title={t("admin.doctors", lang)} action={<Button size="sm">{lang === "mr" ? "नवीन डॉक्टर" : "New Doctor"}</Button>} />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search.placeholder", lang)} className="pl-10" />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("admin.doctors", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("filter.specialty", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("filter.type", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("status.verified", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("status.lastVerified", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{getLangValue(d.name_en, d.name_mr, lang)}</p>
                  <p className="text-xs text-muted-foreground">{getLangValue(d.qualification_en, d.qualification_mr, lang)}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{d.specialty && getLangValue(d.specialty.name_en, d.specialty.name_mr, lang)}</td>
                <td className="px-4 py-3">
                  <Badge variant={d.is_visiting ? "secondary" : "outline"}>
                    {d.is_visiting ? t("filter.visiting", lang) : t("filter.local", lang)}
                  </Badge>
                </td>
                <td className="px-4 py-3"><VerificationBadge verified={d.verified} lastVerified={d.last_verified} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{relativeDays(d.last_verified, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminSpecialtiesPage() {
  const { lang } = useLang()
  return (
    <div>
      <AdminPageHeader title={t("admin.specialties", lang)} />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_SPECIALTIES.map(s => (
          <Card key={s.id}>
            <CardContent className="py-4">
              <p className="text-sm font-medium text-foreground">{getLangValue(s.name_en, s.name_mr, lang)}</p>
              <p className="text-xs text-muted-foreground mt-0.5" lang="mr">{s.name_mr}</p>
              <p className="text-xs text-muted-foreground mt-1">{DEMO_DOCTORS.filter(d => d.specialty_id === s.id).length} {t("admin.doctors", lang)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AdminFacilitiesPage() {
  const { lang } = useLang()
  const [query, setQuery] = useState("")
  const filtered = DEMO_FACILITIES.filter(f => !query || f.name_en.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <AdminPageHeader title={t("admin.facilities", lang)} action={<Button size="sm">{lang === "mr" ? "नवीन केंद्र" : "New Facility"}</Button>} />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search.placeholder", lang)} className="pl-10" />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("admin.facilities", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("filter.type", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("status.verified", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("status.lastVerified", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{getLangValue(f.name_en, f.name_mr, lang)}</td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{f.type}</td>
                <td className="px-4 py-3"><VerificationBadge verified={f.verified} lastVerified={f.last_verified} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{relativeDays(f.last_verified, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminSchedulesPage() {
  const { lang } = useLang()
  const localDoctors = DEMO_DOCTORS.filter(d => !d.is_visiting)
  return (
    <div>
      <AdminPageHeader title={t("admin.schedules", lang)} />
      <div className="space-y-4">
        {localDoctors.map(d => (
          <Card key={d.id}>
            <CardHeader><CardTitle className="text-sm">{getLangValue(d.name_en, d.name_mr, lang)}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-7">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, i) => (
                  <div key={day} className={cn("rounded-md border border-border p-2 text-center", i === new Date().getDay() - 1 && "border-primary/30 bg-primary/5")}>
                    <p className="text-xs font-medium text-muted-foreground">{day}</p>
                    <p className="text-xs text-foreground mt-1">
                      {d.id === "d1" ? "9-1, 5-8" : d.id === "d2" ? "10-2" : d.id === "d6" ? "9-5" : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AdminVisitingSessionsPage() {
  const { lang } = useLang()
  return (
    <div>
      <AdminPageHeader title={t("admin.visitingSessions", lang)} />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("admin.doctors", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "तारीख" : "Date"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "वेळ" : "Time"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("status.verified", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "कृती" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_VISITING_SESSIONS.map(v => (
              <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{v.doctor && getLangValue(v.doctor.name_en, v.doctor.name_mr, lang)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(v.visit_date, lang)}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.start_time}–{v.end_time}</td>
                <td className="px-4 py-3">
                  <Badge variant={v.status === "confirmed" ? "default" : v.status === "pending" ? "secondary" : "destructive"}>
                    {v.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {v.status === "pending" && (
                      <Button size="xs" variant="outline" onClick={() => toast.success(t("status.confirmed", lang))}>
                        <Check className="size-3" /> {t("status.confirmed", lang)}
                      </Button>
                    )}
                    {v.status === "confirmed" && (
                      <Button size="xs" variant="destructive" onClick={() => toast.success(lang === "mr" ? "भेट रद्द केली" : "Visit cancelled")}>
                        <X className="size-3" /> {t("status.cancelled", lang)}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminVerificationPage() {
  const { lang } = useLang()
  return (
    <div>
      <AdminPageHeader title={t("admin.verification", lang)} />
      <div className="space-y-4">
        {DEMO_VERIFICATION_RECORDS.filter(r => r.status === "pending").map(r => (
          <Card key={r.id}>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{lang === "mr" ? "घटक" : "Entity"}</p>
                  <p className="text-sm font-semibold text-foreground">{r.entity_name}</p>
                  <p className="text-xs text-muted-foreground">{r.entity_type}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t("section.source", lang)}: {r.source}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{lang === "mr" ? "सध्याची माहिती" : "Current Data"}</p>
                  <div className="rounded-md border border-border p-3 bg-muted/30 space-y-1">
                    {Object.entries(r.current_data).map(([k, v]) => (
                      <p key={k} className="text-xs"><span className="text-muted-foreground">{k}:</span> <span className="text-foreground">{String(v)}</span></p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-warning-foreground mb-2">{lang === "mr" ? "प्रस्तावित माहिती" : "Proposed Data"}</p>
                  <div className="rounded-md border border-warning/30 p-3 bg-warning/5 space-y-1">
                    {Object.entries(r.proposed_data).map(([k, v]) => {
                      const current = r.current_data[k]
                      const changed = String(current) !== String(v)
                      return (
                        <p key={k} className="text-xs">
                          <span className="text-muted-foreground">{k}:</span>{" "}
                          <span className={changed ? "font-semibold text-warning-foreground" : "text-foreground"}>{String(v)}</span>
                          {changed && <AlertTriangle className="inline size-3 ml-1 text-warning-foreground" />}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">{r.notes}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success(lang === "mr" ? "पडताळणी मंजूर" : "Verification approved")}>
                    <Check className="size-4" /> {lang === "mr" ? "मंजूर" : "Approve"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.success(lang === "mr" ? "पडताळणी नकार" : "Verification rejected")}>
                    <X className="size-4" /> {lang === "mr" ? "नकार" : "Reject"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {DEMO_VERIFICATION_RECORDS.filter(r => r.status === "pending").length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">{lang === "mr" ? "कोणतीही प्रलंबित पडताळणी नाही" : "No pending verification items"}</p>
        )}
      </div>
    </div>
  )
}

export function AdminReportsPage() {
  const { lang } = useLang()
  return (
    <div>
      <AdminPageHeader title={t("admin.reports", lang)} />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "घटक" : "Entity"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("report.reason", lang)}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "तारीख" : "Date"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "स्थिती" : "Status"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "कृती" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_USER_REPORTS.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{r.entity_type} · {r.entity_id}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.reason}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(r.created_at, lang)}</td>
                <td className="px-4 py-3"><Badge variant={r.status === "open" ? "destructive" : r.status === "resolved" ? "default" : "secondary"}>{r.status}</Badge></td>
                <td className="px-4 py-3">
                  {r.status === "open" && (
                    <Button size="xs" variant="outline" onClick={() => toast.success(lang === "mr" ? "तपास सुरू" : "Investigation started")}>
                      {lang === "mr" ? "तपासा" : "Investigate"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminFreshnessPage() {
  const { lang } = useLang()
  const allEntities = [
    ...DEMO_DOCTORS.map(d => ({ id: d.id, name: getLangValue(d.name_en, d.name_mr, lang), type: "doctor", last_verified: d.last_verified })),
    ...DEMO_FACILITIES.map(f => ({ id: f.id, name: getLangValue(f.name_en, f.name_mr, lang), type: "facility", last_verified: f.last_verified })),
  ]

  const dueForReview = allEntities.filter(e => isStale(e.last_verified, 14))
  const expired = allEntities.filter(e => isStale(e.last_verified, 30))
  const recent = allEntities.filter(e => !isStale(e.last_verified, 14))

  return (
    <div>
      <AdminPageHeader title={t("admin.freshness", lang)} />
      <Tabs defaultValue="due">
        <TabsList>
          <TabsTrigger value="due">{lang === "mr" ? "समीक्षेसाठी देय" : "Due for Review"} ({dueForReview.length})</TabsTrigger>
          <TabsTrigger value="expired">{lang === "mr" ? "कालबाह्य" : "Expired"} ({expired.length})</TabsTrigger>
          <TabsTrigger value="recent">{lang === "mr" ? "अलीकडे पडताळणी" : "Recently Verified"} ({recent.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="due" className="space-y-2 mt-4">
          {dueForReview.map(e => (
            <div key={`${e.type}-${e.id}`} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.type} · {relativeDays(e.last_verified, lang)}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success(lang === "mr" ? "पुन्हा पडताळणी" : "Reverified")}>
                <RefreshCw className="size-4" /> {lang === "mr" ? "पुन्हा तपासा" : "Reverify"}
              </Button>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="expired" className="space-y-2 mt-4">
          {expired.map(e => (
            <div key={`${e.type}-${e.id}`} className="flex items-center justify-between rounded-lg border border-destructive/30 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{e.name}</p>
                <p className="text-xs text-destructive">{e.type} · {relativeDays(e.last_verified, lang)}</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => toast.success(lang === "mr" ? "पुन्हा पडताळणी" : "Reverified")}>
                <RefreshCw className="size-4" /> {lang === "mr" ? "पुन्हा तपासा" : "Reverify"}
              </Button>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="recent" className="space-y-2 mt-4">
          {recent.map(e => (
            <div key={`${e.type}-${e.id}`} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{e.name}</p>
                <p className="text-xs text-success">{e.type} · {relativeDays(e.last_verified, lang)}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function AdminAuditPage() {
  const { lang } = useLang()
  return (
    <div>
      <AdminPageHeader title={t("admin.audit", lang)} />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "वेळ" : "Timestamp"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "व्यवस्थापक" : "Admin"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "क्रिया" : "Action"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "बदल" : "Change"}</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_AUDIT_LOGS.map(log => (
              <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(log.created_at, lang)}</td>
                <td className="px-4 py-3 text-foreground">{log.admin_user}</td>
                <td className="px-4 py-3"><Badge variant="outline">{log.action}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{log.change_summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminUsersPage() {
  const { lang } = useLang()
  return (
    <div>
      <AdminPageHeader title={t("admin.users", lang)} />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "नाव" : "Name"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "भूमिका" : "Role"}</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ADMIN_USERS.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><Badge variant={u.role === "admin" ? "default" : u.role === "editor" ? "secondary" : "outline"}>{u.role}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminSettingsPage() {
  const { lang } = useLang()
  return (
    <div>
      <AdminPageHeader title={t("admin.settings", lang)} />
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">{lang === "mr" ? "भाषा" : "Language"}</p>
            <p className="text-xs text-muted-foreground mt-1">{lang === "mr" ? "डीफॉल्ट भाषा इंग्रजी आहे" : "Default language is English"}</p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">{lang === "mr" ? "ताजेपणा सीमा" : "Freshness Threshold"}</p>
            <p className="text-xs text-muted-foreground mt-1">14 {lang === "mr" ? "दिवस" : "days"}</p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">{lang === "mr" ? "डेमो मोड" : "Demo Mode"}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("common.demoData", lang)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminInfoPage({ title, type }: { title: string; type: "schemes" | "tests" | "procedures" | "services" | "knowledge" | "health-alerts" }) {
  const { lang } = useLang()
  const data = type === "schemes" ? DEMO_SCHEMES : type === "tests" ? DEMO_TESTS : type === "procedures" ? DEMO_PROCEDURES : type === "health-alerts" ? DEMO_HEALTH_ALERTS : []
  return (
    <div>
      <AdminPageHeader title={title} action={<Button size="sm">{lang === "mr" ? "नवीन" : "Add New"}</Button>} />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{lang === "mr" ? "नाव" : "Name"}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("section.reviewed", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: { id: string; slug?: string; title_en?: string; title_mr?: string; name_en?: string; name_mr?: string; reviewed_at: string }) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  {getLangValue(item.title_en || item.name_en, item.title_mr || item.name_mr, lang)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(item.reviewed_at, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminLoginPage() {
  const { lang } = useLang()
  const navigate = useNavigate()
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">{t("app.name", lang)}</h1>
            <p className="text-sm text-muted-foreground mt-1">Admin Login</p>
          </div>
          <div className="space-y-3">
            <Input placeholder="Email" defaultValue="admin@arogya.in" />
            <Input type="password" placeholder="Password" defaultValue="demo" />
            <Button className="w-full" onClick={() => navigate("/admin")}>
              {lang === "mr" ? "लॉगिन" : "Login"}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">{t("common.demoData", lang)}</p>
        </CardContent>
      </Card>
    </div>
  )
}

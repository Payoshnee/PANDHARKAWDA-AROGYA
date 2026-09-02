import { useState, useMemo } from "react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { DEMO_FACILITIES } from "@/lib/mock-data"
import { FacilityCard } from "@/components/shared/facility-card"
import { PageHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/states"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export function FacilitiesDirectoryPage() {
  const { lang } = useLang()
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return DEMO_FACILITIES.filter(f => {
      if (query) {
        const q = query.toLowerCase()
        if (!f.name_en.toLowerCase().includes(q) && !f.name_mr.toLowerCase().includes(q) && !f.address_en.toLowerCase().includes(q)) return false
      }
      if (type !== "all" && f.type !== type) return false
      return true
    })
  }, [query, type])

  const clearFilters = () => { setQuery(""); setType("all") }

  return (
    <div>
      <PageHeader
        title={t("nav.facilities", lang)}
        subtitle={lang === "mr" ? "पांढरकवडा मधील रुग्णालये, दवाखाने आणि निदान केंद्रे" : "Hospitals, clinics and diagnostic centres in Pandharkawda"}
      />

      <div className="mb-4 space-y-3">
        <Input
          placeholder={t("search.placeholder", lang)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <SlidersHorizontal className="size-4" />
            {t("filter.type", lang)}
          </Button>
          <div className={cn("flex-1 gap-2", showFilters ? "flex" : "hidden lg:flex")}>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "mr" ? "सर्व प्रकार" : "All types"}</SelectItem>
                <SelectItem value="hospital">{lang === "mr" ? "रुग्णालय" : "Hospital"}</SelectItem>
                <SelectItem value="clinic">{lang === "mr" ? "दवाखाना" : "Clinic"}</SelectItem>
                <SelectItem value="diagnostic">{lang === "mr" ? "निदान केंद्र" : "Diagnostic"}</SelectItem>
                <SelectItem value="government">{lang === "mr" ? "सरकारी" : "Government"}</SelectItem>
              </SelectContent>
            </Select>
            {(query || type !== "all") && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t("action.clearFilters", lang)}
              </Button>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{filtered.length} {t("common.results", lang)}</p>

      {filtered.length === 0 ? (
        <EmptyState
          title={t("common.noResults", lang)}
          message={lang === "mr" ? "या फिल्टरसह कोणतेही केंद्र सापडले नाही." : "No facilities match these filters."}
          actionLabel={t("action.clearFilters", lang)}
          actionOnClick={clearFilters}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(f => <FacilityCard key={f.id} facility={f} />)}
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

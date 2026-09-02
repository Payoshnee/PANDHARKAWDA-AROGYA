import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { SlidersHorizontal } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { DEMO_DOCTORS, DEMO_SPECIALTIES } from "@/lib/mock-data"
import { DoctorCard } from "@/components/shared/doctor-card"
import { PageHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/states"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Doctor } from "@/types"

export function DoctorsDirectoryPage() {
  const { lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [specialty, setSpecialty] = useState("all")
  const [doctorType, setDoctorType] = useState("all")
  const [openNow, setOpenNow] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return DEMO_DOCTORS.filter((d: Doctor) => {
      if (query) {
        const q = query.toLowerCase()
        const nameEn = d.name_en.toLowerCase()
        const nameMr = d.name_mr.toLowerCase()
        const specEn = d.specialty?.name_en.toLowerCase() || ""
        const specMr = d.specialty?.name_mr.toLowerCase() || ""
        if (!nameEn.includes(q) && !nameMr.includes(q) && !specEn.includes(q) && !specMr.includes(q)) return false
      }
      if (specialty !== "all" && d.specialty_id !== specialty) return false
      if (doctorType === "local" && d.is_visiting) return false
      if (doctorType === "visiting" && !d.is_visiting) return false
      return true
    })
  }, [query, specialty, doctorType])

  const clearFilters = () => {
    setQuery("")
    setSpecialty("all")
    setDoctorType("all")
    setOpenNow(false)
    setSearchParams({})
  }

  return (
    <div>
      <PageHeader
        title={t("nav.doctors", lang)}
        subtitle={lang === "mr" ? "पांढरकवडा मधील डॉक्टर शोधा" : "Find doctors in Pandharkawda"}
      />

      <div className="mb-4 space-y-3">
        <Input
          placeholder={t("search.placeholder", lang)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            {t("filter.specialty", lang)}
          </Button>

          <div className={cn("flex-1 gap-2", showFilters ? "flex flex-col" : "hidden lg:flex")}>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder={t("filter.allSpecialties", lang)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filter.allSpecialties", lang)}</SelectItem>
                {DEMO_SPECIALTIES.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {getLangValue(s.name_en, s.name_mr, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={doctorType} onValueChange={setDoctorType}>
              <SelectTrigger className="w-full lg:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "mr" ? "सर्व" : "All"}</SelectItem>
                <SelectItem value="local">{t("filter.local", lang)}</SelectItem>
                <SelectItem value="visiting">{t("filter.visiting", lang)}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 h-9">
              <Switch id="openNow" checked={openNow} onCheckedChange={setOpenNow} size="sm" />
              <Label htmlFor="openNow" className="text-xs cursor-pointer">{t("filter.openNow", lang)}</Label>
            </div>

            {(query || specialty !== "all" || doctorType !== "all" || openNow) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t("action.clearFilters", lang)}
              </Button>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        {filtered.length} {t("common.results", lang)}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title={t("common.noResults", lang)}
          message={lang === "mr" ? "या फिल्टरसह कोणतेही डॉक्टर सापडले नाहीत." : "No doctors match these filters."}
          actionLabel={t("action.clearFilters", lang)}
          actionOnClick={clearFilters}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

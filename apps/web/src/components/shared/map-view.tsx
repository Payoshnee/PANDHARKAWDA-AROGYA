import { ExternalLink, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLang } from "@/lib/language-context"
import { getLangValue, t } from "@/lib/i18n"
import { getMapsUrl } from "@/lib/utils-health"
import type { Facility } from "@/types"

const PANDHARKAWDA_CIVIL_HOSPITAL = {
  label: "Pandharkawda Civil Hospital, Pandharkawda",
  lat: 20.2861,
  lng: 78.9312,
}

export function MapView({ facilities, centerLat = 20.2861, centerLng = 78.9312, zoom = 14 }: {
  facilities: Facility[]
  centerLat?: number | null
  centerLng?: number | null
  zoom?: number
}) {
  const { lang } = useLang()
  const facility = facilities[0]
  const label = facility ? getLangValue(facility.name_en, facility.name_mr, lang) : PANDHARKAWDA_CIVIL_HOSPITAL.label
  const address = facility ? getLangValue(facility.address_en, facility.address_mr, lang) : PANDHARKAWDA_CIVIL_HOSPITAL.label
  const targetLat = centerLat ?? PANDHARKAWDA_CIVIL_HOSPITAL.lat
  const targetLng = centerLng ?? PANDHARKAWDA_CIVIL_HOSPITAL.lng
  const mapsUrl = getMapsUrl(targetLat, targetLng, PANDHARKAWDA_CIVIL_HOSPITAL.label)
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(PANDHARKAWDA_CIVIL_HOSPITAL.label)}&output=embed&z=${zoom}`

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <iframe
        title={`${label} map`}
        src={embedUrl}
        className="h-[320px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="size-4 text-primary" />
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{address}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="size-4" />
            {t("action.directions", lang)}
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  )
}

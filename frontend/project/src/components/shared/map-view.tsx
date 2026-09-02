import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useLang } from "@/lib/language-context"
import { getLangValue } from "@/lib/i18n"
import { getFacilityStatus } from "@/components/shared/status-badges"
import type { Facility } from "@/types"

export function MapView({ facilities, centerLat = 20.2861, centerLng = 78.9312, zoom = 14 }: {
  facilities: Facility[]
  centerLat?: number
  centerLng?: number
  zoom?: number
}) {
  const { lang } = useLang()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current).setView([centerLat, centerLng], zoom)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    facilities.forEach(f => {
      if (!f.lat || !f.lng) return
      const marker = L.marker([f.lat, f.lng]).addTo(map)
      const status = getFacilityStatus(f.id)
      const statusText = status === "open" ? "● Open" : status === "closed" ? "○ Closed" : "? Confirm"
      marker.bindPopup(`
        <div style="min-width:180px">
          <strong>${getLangValue(f.name_en, f.name_mr, lang)}</strong><br/>
          <span style="font-size:11px;color:#666">${getLangValue(f.address_en, f.address_mr, lang)}</span><br/>
          <span style="font-size:12px">${statusText}</span><br/>
          <a href="https://www.openstreetmap.org/?mlat=${f.lat}&mlon=${f.lng}#map=18/${f.lat}/${f.lng}" target="_blank" style="font-size:12px">Directions →</a>
        </div>
      `)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [facilities, centerLat, centerLng, zoom, lang])

  return <div ref={containerRef} className="h-[320px] w-full rounded-lg border border-border" />
}

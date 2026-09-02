import { Phone, Ambulance, MapPin, Navigation, ShieldAlert } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { usePublicData } from "@/lib/api"
import { getTelUrl } from "@/lib/utils-health"

export function EmergencyPage() {
  const { lang } = useLang()
  const { data } = usePublicData()
  const emergencyFacility = data.facilities.find(f => f.has_emergency)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
          <ShieldAlert className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-destructive">{t("emergency.title", lang)}</h1>
          <p className="text-sm text-muted-foreground">{lang === "mr" ? "शांत राहा. मदत उपलब्ध आहे." : "Stay calm. Help is available."}</p>
        </div>
      </div>

      <a
        href={getTelUrl("108")}
        className="flex items-center justify-between gap-3 rounded-lg bg-destructive px-5 py-5 text-destructive-foreground transition-colors hover:bg-destructive/90"
      >
        <span className="flex items-center gap-3">
          <Ambulance className="size-7" />
          <span className="flex flex-col">
            <span className="text-lg font-bold">{t("emergency.call108", lang)}</span>
            <span className="text-xs opacity-90">{t("emergency.ambulance", lang)}</span>
          </span>
        </span>
        <Phone className="size-6" />
      </a>

      <div className="grid grid-cols-2 gap-3">
        <a href={getTelUrl("102")} className="flex flex-col items-center gap-1 rounded-lg border border-input bg-background px-3 py-4 transition-colors hover:bg-accent">
          <span className="text-base font-semibold text-foreground">{t("emergency.call102", lang)}</span>
          <span className="text-xs text-muted-foreground">{t("emergency.ambulance", lang)}</span>
        </a>
        <a href={getTelUrl("104")} className="flex flex-col items-center gap-1 rounded-lg border border-input bg-background px-3 py-4 transition-colors hover:bg-accent">
          <span className="text-base font-semibold text-foreground">{t("emergency.call104", lang)}</span>
          <span className="text-xs text-muted-foreground">{t("emergency.helpline", lang)}</span>
        </a>
      </div>

      {emergencyFacility && (
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground mb-2">{t("emergency.nearest", lang)}</p>
          <p className="text-base font-semibold text-foreground">
            {lang === "mr" ? emergencyFacility.name_mr : emergencyFacility.name_en}
          </p>
          <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1.5">
            <MapPin className="size-4 mt-0.5 shrink-0" />
            {lang === "mr" ? emergencyFacility.address_mr : emergencyFacility.address_en}
          </p>
          <div className="flex gap-2 mt-3">
            <a href={getTelUrl(emergencyFacility.phone)} className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90">
              <Phone className="size-4" />
              {t("action.call", lang)}
            </a>
            <a
              href={`https://www.openstreetmap.org/?mlat=${emergencyFacility.lat}&mlon=${emergencyFacility.lng}#map=18/${emergencyFacility.lat}/${emergencyFacility.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-xs hover:bg-accent"
            >
              <Navigation className="size-4" />
              {t("action.directions", lang)}
            </a>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-warning/30 bg-warning/5 p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("emergency.instructions", lang)}</h2>
        <ul className="space-y-2">
          <li className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-warning-foreground font-bold shrink-0">1.</span>
            {lang === "mr" ? "शांत राहा आणि आपत्कालीन क्रमांकावर कॉल करा." : "Stay calm and call the emergency number."}
          </li>
          <li className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-warning-foreground font-bold shrink-0">2.</span>
            {lang === "mr" ? "स्पष्ट पत्ता द्या आणि स्थिती सांगा." : "Give clear address and describe the situation."}
          </li>
          <li className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-warning-foreground font-bold shrink-0">3.</span>
            {lang === "mr" ? "रुग्णाला हालचाल करू नका जो स्थिर आहे." : "Do not move the patient if they are unstable."}
          </li>
          <li className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-warning-foreground font-bold shrink-0">4.</span>
            {lang === "mr" ? "जवळच्या आपत्कालीन रुग्णालयात नेण्यासाठी तयार रहा." : "Be ready to transport to the nearest emergency facility."}
          </li>
        </ul>
      </div>
    </div>
  )
}

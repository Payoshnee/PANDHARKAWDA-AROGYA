import { useState } from "react"
import { Phone, MapPin, Navigation, Ambulance, ShieldAlert, X } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { DEMO_FACILITIES } from "@/lib/mock-data"
import { getTelUrl } from "@/lib/utils-health"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function EmergencySheet({ open, onOpenChange }: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { lang } = useLang()
  const emergencyFacility = DEMO_FACILITIES.find(f => f.has_emergency)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-y-auto p-0" showCloseButton={false}>
        <SheetHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                <ShieldAlert className="size-5 text-destructive" />
              </span>
              <SheetTitle className="text-lg font-semibold text-destructive">
                {t("emergency.title", lang)}
              </SheetTitle>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="px-5 pb-6 space-y-4">
          <div className="grid gap-2.5">
            <a
              href={getTelUrl("108")}
              className="flex items-center justify-between gap-3 rounded-lg bg-destructive px-4 py-4 text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              <span className="flex items-center gap-3">
                <Ambulance className="size-6" />
                <span className="flex flex-col">
                  <span className="text-base font-bold">{t("emergency.call108", lang)}</span>
                  <span className="text-xs opacity-90">{t("emergency.ambulance", lang)}</span>
                </span>
              </span>
              <Phone className="size-5" />
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={getTelUrl("102")}
                className="flex flex-col items-center gap-1 rounded-lg border border-input bg-background px-3 py-3 transition-colors hover:bg-accent"
              >
                <span className="text-sm font-semibold text-foreground">{t("emergency.call102", lang)}</span>
                <span className="text-xs text-muted-foreground">{t("emergency.ambulance", lang)}</span>
              </a>
              <a
                href={getTelUrl("104")}
                className="flex flex-col items-center gap-1 rounded-lg border border-input bg-background px-3 py-3 transition-colors hover:bg-accent"
              >
                <span className="text-sm font-semibold text-foreground">{t("emergency.call104", lang)}</span>
                <span className="text-xs text-muted-foreground">{t("emergency.helpline", lang)}</span>
              </a>
            </div>
          </div>

          {emergencyFacility && (
            <div className="rounded-lg border border-border bg-surface-subtle p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t("emergency.nearest", lang)}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {lang === "mr" ? emergencyFacility.name_mr : emergencyFacility.name_en}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
                <MapPin className="size-3.5 mt-0.5 shrink-0" />
                {lang === "mr" ? emergencyFacility.address_mr : emergencyFacility.address_en}
              </p>
              <div className="flex gap-2 mt-3">
                <a
                  href={getTelUrl(emergencyFacility.phone)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium shadow-xs hover:bg-accent"
                >
                  <Phone className="size-3.5" />
                  {t("action.call", lang)}
                </a>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${emergencyFacility.lat}&mlon=${emergencyFacility.lng}#map=18/${emergencyFacility.lat}/${emergencyFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium shadow-xs hover:bg-accent"
                >
                  <Navigation className="size-3.5" />
                  {t("action.directions", lang)}
                </a>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <p className="text-xs font-medium text-foreground mb-1.5">
              {t("emergency.instructions", lang)}
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>{lang === "mr" ? "शांत राहा आणि आपत्कालीन क्रमांकावर कॉल करा." : "Stay calm and call the emergency number."}</li>
              <li>{lang === "mr" ? "स्पष्ट पत्ता द्या आणि स्थिती सांगा." : "Give clear address and describe the situation."}</li>
              <li>{lang === "mr" ? "रुग्णाला हालचाल करू नका जो स्थिर आहे." : "Do not move the patient if they are unstable."}</li>
              <li>{lang === "mr" ? "जवळच्या आपत्कालीन रुग्णालयात नेण्यासाठी तयार रहा." : "Be ready to transport to the nearest emergency facility."}</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function useEmergencySheet() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}

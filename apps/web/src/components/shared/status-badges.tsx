import { CircleCheck, CircleX, Clock, AlertCircle } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { AvailabilityStatus, DoctorAvailability } from "@/types"

export function StatusBadge({ status, className }: {
  status: AvailabilityStatus
  className?: string
}) {
  const { lang } = useLang()
  if (status === "open") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success", className)}>
        <CircleCheck className="size-3.5" />
        {t("status.open", lang)}
      </span>
    )
  }
  if (status === "closed") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground", className)}>
        <CircleX className="size-3.5" />
        {t("status.closed", lang)}
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning-foreground", className)}>
      <AlertCircle className="size-3.5" />
      {t("status.callToConfirm", lang)}
    </span>
  )
}

export function DoctorAvailabilityBadge({ status, className }: {
  status: DoctorAvailability
  className?: string
}) {
  const { lang } = useLang()
  if (status === "available") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-success", className)}>
        <CircleCheck className="size-3.5" />
        {t("status.available", lang)}
      </span>
    )
  }
  if (status === "not_available") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground", className)}>
        <CircleX className="size-3.5" />
        {t("status.notAvailable", lang)}
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-warning-foreground", className)}>
      <AlertCircle className="size-3.5" />
      {t("status.callToConfirm", lang)}
    </span>
  )
}

export function OpenUntilBadge({ time, className }: { time: string; className?: string }) {
  const { lang } = useLang()
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success", className)}>
      <Clock className="size-3" />
      {t("status.openUntil", lang)} {time}
    </span>
  )
}

export function getFacilityStatus(facilityId: string): AvailabilityStatus {
  const hour = new Date().getHours()
  if (facilityId === "f1") return "open"
  if (facilityId === "f2") return hour < 20 ? "open" : "closed"
  if (facilityId === "f3") return hour < 19 ? "open" : "closed"
  if (facilityId === "f4") return hour < 18 ? "open" : "closed"
  if (facilityId === "f5") return hour < 21 ? "open" : "closed"
  return "unknown"
}

export function getDoctorAvailability(doctorId: string): DoctorAvailability {
  const hour = new Date().getHours()
  if (doctorId === "d1") return hour >= 17 && hour < 20 ? "available" : hour < 13 ? "available" : "not_available"
  if (doctorId === "d2") return hour >= 10 && hour < 14 ? "available" : "not_available"
  if (doctorId === "d3") return "unknown"
  if (doctorId === "d6") return hour >= 9 && hour < 17 ? "available" : "not_available"
  if (doctorId === "d7") return "not_available"
  return "unknown"
}

export function getClosingTime(facilityId: string): string | null {
  if (facilityId === "f1") return "24 hrs"
  if (facilityId === "f2") return "8 PM"
  if (facilityId === "f3") return "7 PM"
  if (facilityId === "f4") return "6 PM"
  if (facilityId === "f5") return "9 PM"
  return null
}

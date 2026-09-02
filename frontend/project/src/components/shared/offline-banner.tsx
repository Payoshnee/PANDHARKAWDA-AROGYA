import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"

export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener("online", on)
    window.addEventListener("offline", off)
    return () => {
      window.removeEventListener("online", on)
      window.removeEventListener("offline", off)
    }
  }, [])
  return online
}

export function OfflineBanner() {
  const { lang } = useLang()
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-warning/90 px-4 py-2 text-xs font-medium text-warning-foreground">
      <WifiOff className="size-3.5" />
      {t("common.offline", lang)}
    </div>
  )
}

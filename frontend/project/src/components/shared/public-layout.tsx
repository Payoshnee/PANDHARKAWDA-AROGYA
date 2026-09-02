import { type ReactNode } from "react"
import { AppHeader, MobileNavigation } from "@/components/shared/navigation"
import { OfflineBanner } from "@/components/shared/offline-banner"

export function PublicLayout({ children, fullWidth }: { children: ReactNode; fullWidth?: boolean }) {
  return (
    <div className="flex min-h-svh flex-col">
      <OfflineBanner />
      <AppHeader />
      <main className={`flex-1 ${fullWidth ? "" : "mx-auto w-full max-w-6xl px-4 py-6"} pb-20 lg:pb-6`}>
        {children}
      </main>
      <MobileNavigation />
    </div>
  )
}

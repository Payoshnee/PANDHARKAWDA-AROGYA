import { Link } from "react-router-dom"
import { type ReactNode } from "react"
import { SearchX, AlertCircle, WifiOff, FileQuestion, RefreshCw } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"

export function EmptyState({ title, message, actionLabel, actionTo, actionOnClick }: {
  title: string
  message: string
  actionLabel?: string
  actionTo?: string
  actionOnClick?: () => void
}) {
  return (
    <Empty className="min-h-[300px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      {actionLabel && (
        <EmptyContent>
          {actionTo ? (
            <Button asChild>
              <Link to={actionTo}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={actionOnClick}>{actionLabel}</Button>
          )}
        </EmptyContent>
      )}
    </Empty>
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { lang } = useLang()
  return (
    <Empty className="min-h-[300px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{message || t("common.error", lang)}</EmptyTitle>
        <EmptyDescription>
          {lang === "mr"
            ? "कृपया पुन्हा प्रयत्न करा किंवा थोड्या वेळाने परत या."
            : "Please try again or come back in a moment."}
        </EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent>
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="size-4" />
            {t("common.retry", lang)}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}

export function OfflineState({ message }: { message?: string }) {
  const { lang } = useLang()
  return (
    <Empty className="min-h-[200px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WifiOff />
        </EmptyMedia>
        <EmptyTitle>{t("common.offline", lang)}</EmptyTitle>
        <EmptyDescription>{message || t("common.offline", lang)}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function NotFoundState() {
  const { lang } = useLang()
  return (
    <Empty className="min-h-[400px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestion />
        </EmptyMedia>
        <EmptyTitle>{t("common.notFound", lang)}</EmptyTitle>
        <EmptyDescription>
          {lang === "mr" ? "तुम्ही शोधत असलेले पृष्ठ अस्तित्वात नाही." : "The page you're looking for doesn't exist."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to="/">{t("nav.home", lang)}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function LoadingSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className || ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <Skeleton className="mt-3 h-4 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export function LoadingScreen({ label }: { label?: string }) {
  const { lang } = useLang()
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-muted-foreground">{label || t("common.loading", lang)}</p>
    </div>
  )
}

export function StateWrapper({ loading, error, empty, emptyTitle, emptyMessage, emptyAction, emptyActionTo, onRetry, children }: {
  loading: boolean
  error: string | null
  empty: boolean
  emptyTitle: string
  emptyMessage: string
  emptyAction?: string
  emptyActionTo?: string
  onRetry?: () => void
  children: ReactNode
}) {
  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (empty) return <EmptyState title={emptyTitle} message={emptyMessage} actionLabel={emptyAction} actionTo={emptyActionTo} />
  return <>{children}</>
}

import { type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function SectionHeader({ title, actionLabel, actionTo, className }: {
  title: string
  actionLabel?: string
  actionTo?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          {actionLabel}
          <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      {children}
    </div>
  )
}

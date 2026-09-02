import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, AlertTriangle, CheckCircle2, FileText, ExternalLink, Phone } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue, getArrayLangValue } from "@/lib/i18n"
import { DEMO_SCHEMES } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils-health"
import { PageHeader } from "@/components/shared/section-header"
import { NotFoundState } from "@/components/shared/states"

export function SchemesDirectoryPage() {
  const { lang } = useLang()
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t("nav.schemes", lang)}
        subtitle={lang === "mr" ? "सरकारी आरोग्य योजनांची माहिती" : "Government healthcare scheme information"}
      />
      <div className="space-y-3">
        {DEMO_SCHEMES.map(scheme => (
          <Link
            key={scheme.id}
            to={`/schemes/${scheme.slug}`}
            className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground">{getLangValue(scheme.title_en, scheme.title_mr, lang)}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{getLangValue(scheme.summary_en, scheme.summary_mr, lang)}</p>
                <p className="text-xs text-muted-foreground mt-2">{t("section.reviewed", lang)}: {formatDate(scheme.reviewed_at, lang)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

export function SchemeDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang } = useLang()
  const navigate = useNavigate()
  const scheme = DEMO_SCHEMES.find(s => s.slug === slug)
  if (!scheme) return <NotFoundState />

  const documents = getArrayLangValue(scheme.documents_en, scheme.documents_mr, lang)

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" />
        {t("common.back", lang)}
      </button>

      <div className="space-y-6">
        <PageHeader title={getLangValue(scheme.title_en, scheme.title_mr, lang)} />

        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm text-foreground flex items-start gap-2">
            <AlertTriangle className="size-4 text-warning-foreground shrink-0 mt-0.5" />
            {t("scheme.note", lang)}
          </p>
        </div>

        <div className="space-y-4">
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{lang === "mr" ? "संक्षिप्त माहिती" : "Summary"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(scheme.summary_en, scheme.summary_mr, lang)}</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("scheme.whoItHelps", lang)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(scheme.eligibility_en, scheme.eligibility_mr, lang)}</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("section.benefits", lang)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(scheme.benefits_en, scheme.benefits_mr, lang)}</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("section.documents", lang)}</h2>
            <ul className="space-y-1.5">
              {documents.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="size-4 text-success shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <a href={scheme.official_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 text-sm font-medium text-primary hover:underline">
              <span>{t("scheme.officialWebsite", lang)}</span>
              <ExternalLink className="size-4" />
            </a>
            {scheme.helpline && (
              <a href={`tel:${scheme.helpline}`} className="flex items-center justify-between gap-2 text-sm font-medium text-primary hover:underline">
                <span>{t("scheme.helpline", lang)}: {scheme.helpline}</span>
                <Phone className="size-4" />
              </a>
            )}
            <div className="border-t border-border pt-2 space-y-1">
              <p className="text-xs text-muted-foreground">{t("section.source", lang)}: {getLangValue(scheme.source_en, scheme.source_mr, lang)}</p>
              <p className="text-xs text-muted-foreground">{t("section.reviewed", lang)}: {formatDate(scheme.reviewed_at, lang)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

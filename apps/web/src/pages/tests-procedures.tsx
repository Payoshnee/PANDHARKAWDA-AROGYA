import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, FlaskConical, Search, Clock, MapPin, CheckCircle2 } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { DEMO_MEDICAL_TERMS } from "@/lib/mock-data"
import { usePublicData } from "@/lib/api"
import { formatDate } from "@/lib/utils-health"
import { PageHeader } from "@/components/shared/section-header"
import { NotFoundState, EmptyState } from "@/components/shared/states"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function TestsDirectoryPage() {
  const { lang } = useLang()
  const { data } = usePublicData()
  const [query, setQuery] = useState("")
  const filtered = data.tests.filter(test => {
    if (!query) return true
    const q = query.toLowerCase()
    return test.name_en.toLowerCase().includes(q) || test.name_mr.toLowerCase().includes(q)
  })

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t("nav.tests", lang)}
        subtitle={lang === "mr" ? "तपासण्यांची माहिती आणि तयारी" : "Test information and preparation guidance"}
      />
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search.placeholder", lang)} className="h-11 pl-11" />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title={t("common.noResults", lang)} message={lang === "mr" ? "कोणतीही तपासणी सापडली नाही." : "No tests found."} />
      ) : (
        <div className="space-y-2">
          {filtered.map(test => (
            <Link key={test.id} to={`/tests/${test.slug}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
              <span className="flex size-9 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3 shrink-0">
                <FlaskConical className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground">{getLangValue(test.name_en, test.name_mr, lang)}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{getLangValue(test.what_is_en, test.what_is_mr, lang)}</p>
              </div>
              {test.fasting_required && (
                <span className="rounded-md bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning-foreground shrink-0">
                  {t("test.fasting", lang)}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {data.procedures.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-foreground mb-3">{lang === "mr" ? "प्रक्रिया" : "Procedures"}</h2>
          <div className="space-y-2">
            {data.procedures.map(proc => (
              <Link key={proc.id} to={`/procedures/${proc.slug}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
                <span className="flex size-9 items-center justify-center rounded-lg bg-info/10 text-info shrink-0">
                  <FlaskConical className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{getLangValue(proc.name_en, proc.name_mr, lang)}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{getLangValue(proc.what_is_en, proc.what_is_mr, lang)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

export function TestDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang } = useLang()
  const { data } = usePublicData()
  const navigate = useNavigate()
  const test = data.tests.find(t => t.slug === slug)
  if (!test) return <NotFoundState />

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" />
        {t("common.back", lang)}
      </button>
      <div className="space-y-6">
        <PageHeader title={getLangValue(test.name_en, test.name_mr, lang)} />
        <div className="space-y-4">
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("test.whatIs", lang)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(test.what_is_en, test.what_is_mr, lang)}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("test.whyOrdered", lang)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(test.why_ordered_en, test.why_ordered_mr, lang)}</p>
          </section>
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("section.preparation", lang)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(test.preparation_en, test.preparation_mr, lang)}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t("test.fasting", lang)}:</span>
              {test.fasting_required ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-warning-foreground">
                  <Clock className="size-3.5" /> {t("test.yes", lang)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <CheckCircle2 className="size-3.5" /> {t("test.no", lang)}
                </span>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("test.duration", lang)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(test.duration_en, test.duration_mr, lang)}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("test.whereAvailable", lang)}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-4" />
              {getLangValue(test.where_available_en, test.where_available_mr, lang)}
            </p>
          </section>
          <div className="border-t border-border pt-3 space-y-1">
            <p className="text-xs text-muted-foreground">{t("section.reviewed", lang)}: {formatDate(test.reviewed_at, lang)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProcedureDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang } = useLang()
  const { data } = usePublicData()
  const navigate = useNavigate()
  const proc = data.procedures.find(p => p.slug === slug)
  if (!proc) return <NotFoundState />
  const questions = lang === "mr" ? proc.questions_to_ask_mr : proc.questions_to_ask_en

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" />
        {t("common.back", lang)}
      </button>
      <div className="space-y-6">
        <PageHeader title={getLangValue(proc.name_en, proc.name_mr, lang)} />
        <div className="space-y-4">
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{lang === "mr" ? "हे काय आहे?" : "What it is"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(proc.what_is_en, proc.what_is_mr, lang)}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{lang === "mr" ? "हे का वापरले जाते?" : "Why it is used"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(proc.why_used_en, proc.why_used_mr, lang)}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{lang === "mr" ? "काय होते?" : "What happens"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(proc.what_happens_en, proc.what_happens_mr, lang)}</p>
          </section>
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("section.preparation", lang)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(proc.preparation_en, proc.preparation_mr, lang)}</p>
          </section>
          {questions && questions.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2">{lang === "mr" ? "विचारायचे प्रश्न" : "Questions to ask"}</h2>
              <ul className="space-y-1.5">
                {questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-2">{t("test.whereAvailable", lang)}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-4" />
              {getLangValue(proc.where_available_en, proc.where_available_mr, lang)}
            </p>
          </section>
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">{t("section.reviewed", lang)}: {formatDate(proc.reviewed_at, lang)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MedicalExplainerPage() {
  const { lang } = useLang()
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const filtered = DEMO_MEDICAL_TERMS.filter(term => {
    if (!query) return true
    const q = query.toLowerCase()
    return term.term_en.toLowerCase().includes(q) || term.term_mr.toLowerCase().includes(q)
  })

  const selectedTerm = selected ? DEMO_MEDICAL_TERMS.find(t => t.id === selected) : null

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={lang === "mr" ? "वैद्यकीय संज्ञा" : "Medical Terms"}
        subtitle={lang === "mr" ? "वैद्यकीय संज्ञांचे सोप्या भाषेत स्पष्टीकरण" : "Simple explanations of medical terms"}
      />
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === "mr" ? "संज्ञा शोधा..." : "Search term..."} className="h-11 pl-11" />
      </div>

      {selectedTerm ? (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            {t("common.back", lang)}
          </button>
          <h2 className="text-xl font-bold text-foreground">{getLangValue(selectedTerm.term_en, selectedTerm.term_mr, lang)}</h2>
          <p className="text-sm text-foreground leading-relaxed">{getLangValue(selectedTerm.meaning_en, selectedTerm.meaning_mr, lang)}</p>
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-1">{lang === "mr" ? "तुम्ही हे का ऐकता?" : "Why you hear this term"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(selectedTerm.why_you_hear_en, selectedTerm.why_you_hear_mr, lang)}</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-1">{lang === "mr" ? "सामान्य माहिती" : "General information"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{getLangValue(selectedTerm.general_info_en, selectedTerm.general_info_mr, lang)}</p>
          </section>
          <div className="border-t border-border pt-2 space-y-1">
            <p className="text-xs text-muted-foreground">{t("section.source", lang)}: {getLangValue(selectedTerm.source_en, selectedTerm.source_mr, lang)}</p>
            <p className="text-xs text-muted-foreground">{t("section.reviewed", lang)}: {formatDate(selectedTerm.reviewed_at, lang)}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <EmptyState title={t("common.noResults", lang)} message={lang === "mr" ? "कोणतीही संज्ञा सापडली नाही." : "No terms found."} />
          ) : filtered.map(term => (
            <button key={term.id} onClick={() => setSelected(term.id)} className="w-full text-left flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground">{getLangValue(term.term_en, term.term_mr, lang)}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{getLangValue(term.meaning_en, term.meaning_mr, lang)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground pt-6">{t("common.demoData", lang)}</p>
    </div>
  )
}

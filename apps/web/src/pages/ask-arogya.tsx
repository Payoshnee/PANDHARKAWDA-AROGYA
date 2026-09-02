import { useState, useRef, useEffect } from "react"
import { Send, Stethoscope, Clock, FlaskConical, FileText, Phone, MessageSquare } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t, getLangValue } from "@/lib/i18n"
import { askArogya, usePublicData } from "@/lib/api"
import type { Doctor, Facility } from "@/types"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  structured?: {
    type: "doctor" | "facility" | "emergency"
    data?: unknown
  }
}

const SUGGESTIONS = [
  { key: "ask.findDoctor", icon: Stethoscope },
  { key: "ask.clinicOpen", icon: Clock },
  { key: "ask.testPrep", icon: FlaskConical },
  { key: "ask.schemes", icon: FileText },
  { key: "ask.emergency", icon: Phone },
]

export function AskArogyaPage() {
  const { lang } = useLang()
  const { data } = usePublicData()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateResponse = (query: string): Message => {
    const q = query.toLowerCase()
    if (q.includes("emergency") || q.includes("urgent") || q.includes("chest pain") || q.includes("आपत्कालीन")) {
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: lang === "mr"
          ? "तातडीची परिस्थिती असल्यास, त्वरित 108 वर कॉल करा. खालील आपत्कालीन क्रमांक उपलब्ध आहेत:"
          : "For an urgent situation, call 108 immediately. Emergency numbers are available below:",
        structured: { type: "emergency" }
      }
    }
    if (q.includes("doctor") || q.includes("cardiolog") || q.includes("physician") || q.includes("डॉक्टर")) {
      const doctors = data.doctors.slice(0, 3)
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: lang === "mr"
          ? "पांढरकवडा मधील काही डॉक्टर खालीलप्रमाणे आहेत:"
          : "Here are some doctors available in Pandharkawda:",
        structured: { type: "doctor", data: doctors }
      }
    }
    if (q.includes("clinic") || q.includes("open") || q.includes("दवाखाना") || q.includes("उघड")) {
      const facilities = data.facilities.slice(0, 3)
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: lang === "mr"
          ? "पांढरकवडा मधील काही दवाखाने आणि रुग्णालये:"
          : "Here are some clinics and hospitals in Pandharkawda:",
        structured: { type: "facility", data: facilities }
      }
    }
    if (q.includes("scheme") || q.includes("yojana") || q.includes("योजना")) {
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: lang === "mr"
          ? "सरकारी आरोग्य योजनांची माहिती योजना विभागात उपलब्ध आहे. कृपया योजना पृष्ठाला भेट द्या."
          : "Information about government healthcare schemes is available in the Schemes section. Please visit the Schemes page.",
      }
    }
    if (q.includes("test") || q.includes("preparation") || q.includes("तपासणी")) {
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: lang === "mr"
          ? "तपासण्यांची माहिती आणि तयारीचे मार्गदर्शन तपासण्या विभागात उपलब्ध आहे."
          : "Test information and preparation guidance is available in the Tests & Procedures section.",
      }
    }
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content: lang === "mr"
        ? "मी तुम्हाला डॉक्टर शोधण्यात, दवाखाने शोधण्यात, तपासणीच्या तयारीत, सरकारी योजनांची माहिती मिळवण्यात आणि आपत्कालीन मदतीत मदत करू शकतो. तुम्हाला काय हवे आहे?"
        : "I can help you find a doctor, locate clinics, prepare for tests, learn about government schemes, and get emergency help. What do you need?"
    }
  }

  const handleSend = async (text?: string) => {
    const content = (text || input).trim()
    if (!content) return
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    try {
      const answer = await askArogya(content, lang)
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer.message,
      }])
    } catch {
      setMessages(prev => [...prev, generateResponse(content)])
    }
  }

  const handleSuggestion = (key: string) => {
    handleSend(t(key, lang))
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 12rem)" }}>
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <MessageSquare className="size-7" />
            </span>
            <h1 className="text-xl font-semibold text-foreground">{t("ask.greeting", lang)}</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              {lang === "mr" ? "तुम्ही खालीलपैकी काहीही विचारू शकता." : "You can ask about any of these topics."}
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2 w-full max-w-md">
              {SUGGESTIONS.map(s => {
                const Icon = s.icon
                return (
                  <button
                    key={s.key}
                    onClick={() => handleSuggestion(s.key)}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-accent/50"
                  >
                    <Icon className="size-4 text-primary shrink-0" />
                    {t(s.key, lang)}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-lg px-4 py-3",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                )}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.structured?.type === "emergency" && (
                    <div className="mt-3 space-y-2">
                      <a href="tel:108" className="flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-3 text-sm font-bold text-destructive-foreground">
                        <Phone className="size-4" />
                        {t("emergency.call108", lang)}
                      </a>
                      <div className="grid grid-cols-2 gap-2">
                        <a href="tel:102" className="rounded-md border border-input bg-background px-2 py-2 text-xs font-medium text-center text-foreground hover:bg-accent">{t("emergency.call102", lang)}</a>
                        <a href="tel:104" className="rounded-md border border-input bg-background px-2 py-2 text-xs font-medium text-center text-foreground hover:bg-accent">{t("emergency.call104", lang)}</a>
                      </div>
                    </div>
                  )}
                  {msg.structured?.type === "doctor" && Array.isArray(msg.structured.data) && (
                    <div className="mt-3 space-y-2">
                      {(msg.structured.data as Doctor[]).map(d => (
                        <div key={d.id} className="rounded-md bg-background border border-border p-3">
                          <p className="text-sm font-medium text-foreground">{getLangValue(d.name_en, d.name_mr, lang)}</p>
                          <p className="text-xs text-muted-foreground">{d.specialty && getLangValue(d.specialty.name_en, d.specialty.name_mr, lang)}</p>
                          {d.facility && <p className="text-xs text-muted-foreground mt-0.5">{getLangValue(d.facility.name_en, d.facility.name_mr, lang)}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.structured?.type === "facility" && Array.isArray(msg.structured.data) && (
                    <div className="mt-3 space-y-2">
                      {(msg.structured.data as Facility[]).map(f => (
                        <div key={f.id} className="rounded-md bg-background border border-border p-3">
                          <p className="text-sm font-medium text-foreground">{getLangValue(f.name_en, f.name_mr, lang)}</p>
                          <p className="text-xs text-muted-foreground">{getLangValue(f.address_en, f.address_mr, lang)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.role === "assistant" && (
                    <p className="text-[10px] text-muted-foreground mt-2 border-t border-border pt-1.5">
                      {t("ask.verifiedSchedule", lang)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="sticky bottom-16 lg:bottom-0 border-t border-border bg-background pt-3 pb-3">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder={t("ask.placeholder", lang)}
            rows={1}
            className="flex-1 rounded-lg border border-input bg-surface-raised px-3 py-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

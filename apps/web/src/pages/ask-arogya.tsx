import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Loader2, Send, Stethoscope, Clock, FlaskConical, FileText, Phone, MessageSquare, Settings } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { useAskArogya } from "@/lib/ask-arogya-context"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  { key: "ask.findDoctor", icon: Stethoscope },
  { key: "ask.clinicOpen", icon: Clock },
  { key: "ask.testPrep", icon: FlaskConical },
  { key: "ask.schemes", icon: FileText },
  { key: "ask.emergency", icon: Phone },
]

export function AskArogyaPage() {
  const { lang } = useLang()
  const { messages, isSending, sendMessage } = useAskArogya()
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (text?: string) => {
    const content = (text || input).trim()
    if (!content || isSending) return
    setInput("")
    await sendMessage(content, lang)
  }

  const handleSuggestion = (key: string) => {
    handleSend(t(key, lang))
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 12rem)" }}>
      <div className="mx-auto flex w-full max-w-2xl items-center justify-end px-4 pt-4 sm:px-0">
        <Link
          to="/ai-settings"
          className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-xs transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="AI settings"
          title="AI settings"
        >
          <Settings className="size-4" />
        </Link>
      </div>
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
                  {msg.loading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span>{msg.content}</span>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
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
                  {msg.role === "assistant" && !msg.loading && (
                    <p className="text-[10px] text-muted-foreground mt-2 border-t border-border pt-1.5">
                      {msg.meta ?? t("ask.verifiedSchedule", lang)}
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
            disabled={isSending}
            className="flex-1 rounded-lg border border-input bg-surface-raised px-3 py-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
            className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
            aria-label={isSending ? "Sending" : t("ask.send", lang)}
          >
            {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

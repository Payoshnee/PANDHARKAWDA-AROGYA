import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { askArogya } from "@/lib/api"

const STORAGE_KEY = "ask_arogya_tab_messages"

export type AskArogyaMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  loading?: boolean
  meta?: string
  structured?: {
    type: "doctor" | "facility" | "emergency"
    data?: unknown
  }
}

type AskArogyaContextValue = {
  messages: AskArogyaMessage[]
  isSending: boolean
  sendMessage: (content: string, language: string) => Promise<void>
  clearMessages: () => void
}

const AskArogyaContext = createContext<AskArogyaContextValue | undefined>(undefined)

export function AskArogyaProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AskArogyaMessage[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]") as AskArogyaMessage[]
    } catch {
      return []
    }
  })
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const stableMessages = messages.filter((message) => !message.loading)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stableMessages))
  }, [messages])

  const sendMessage = useCallback(async (rawContent: string, language: string) => {
    const content = rawContent.trim()
    if (!content) return

    const userMsg: AskArogyaMessage = { id: crypto.randomUUID(), role: "user", content }
    const loadingId = crypto.randomUUID()
    const loadingMsg: AskArogyaMessage = {
      id: loadingId,
      role: "assistant",
      content: language === "mr" ? "आरोग्य विचार करत आहे..." : "ArogyaAI is thinking...",
      loading: true,
    }

    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setIsSending(true)

    try {
      const answer = await askArogya(content, language)
      const verification = answer.verification
      const meta = verification?.grounded
        ? "Verified local directory"
        : verification?.llm_used
          ? `LLM: ${verification.llm_provider}${verification.llm_model ? ` / ${verification.llm_model}` : ""}`
          : verification?.llm_error
            ? `LLM unavailable: ${verification.llm_provider ?? "provider"}`
            : verification?.llm_provider
              ? `LLM not used: ${verification.llm_provider}`
              : undefined

      setMessages((prev) => prev.map((message) => message.id === loadingId ? {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer.message,
        meta,
      } : message))
    } catch {
      setMessages((prev) => prev.map((message) => message.id === loadingId ? {
        id: crypto.randomUUID(),
        role: "assistant",
        content: language === "mr"
          ? "Ask Arogya API उपलब्ध नाही. कृपया API चालू आहे का आणि AI settings योग्य आहेत का तपासा."
          : "Ask Arogya API is unavailable. Please check that the API is running and your AI settings are correct.",
        meta: "No fallback answer was used.",
      } : message))
    } finally {
      setIsSending(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AskArogyaContext.Provider value={{ messages, isSending, sendMessage, clearMessages }}>
      {children}
    </AskArogyaContext.Provider>
  )
}

export function useAskArogya() {
  const context = useContext(AskArogyaContext)
  if (!context) throw new Error("useAskArogya must be used within AskArogyaProvider")
  return context
}

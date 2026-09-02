import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Language } from "@/types"

type LanguageContextValue = {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = "arogya_lang"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === "mr" ? "mr" : "en"
  })

  const setLang = useCallback((next: Language) => {
    localStorage.setItem(STORAGE_KEY, next)
    setLangState(next)
    document.documentElement.lang = next
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "mr" : "en")
  }, [lang, setLang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLang must be used within LanguageProvider")
  return ctx
}

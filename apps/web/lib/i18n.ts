import en from "../locales/en.json";
import mr from "../locales/mr.json";

export type Lang = "en" | "mr";
const dictionaries = { en, mr };

export function t(lang: Lang, key: keyof typeof en): string {
  return dictionaries[lang][key] ?? dictionaries.en[key];
}

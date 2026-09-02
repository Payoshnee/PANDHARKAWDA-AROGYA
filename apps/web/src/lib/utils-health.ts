export function daysSince(date: string | null | undefined): number {
  if (!date) return Infinity
  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function isStale(date: string | null | undefined, thresholdDays = 14): boolean {
  return daysSince(date) >= thresholdDays
}

export function formatDate(date: string | Date, lang: "en" | "mr" = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (lang === "mr") {
    const months = ["जाने", "फेब्रु", "मार्च", "एप्रि", "मे", "जून", "जुलै", "ऑग", "सप्टें", "ऑक्टो", "नोव्हें", "डिसें"]
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function formatDateShort(date: string | Date, lang: "en" | "mr" = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (lang === "mr") {
    const months = ["जाने", "फेब्रु", "मार्च", "एप्रि", "मे", "जून", "जुलै", "ऑग", "सप्टें", "ऑक्टो", "नोव्हें", "डिसें"]
    return `${d.getDate()} ${months[d.getMonth()]}`
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

export function getDayName(dayNum: number, lang: "en" | "mr" = "en"): string {
  const daysEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const daysMr = ["सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि", "रवि"]
  return lang === "mr" ? daysMr[dayNum] : daysEn[dayNum]
}

export function todayDayNum(): number {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

export function relativeDays(date: string | null | undefined, lang: "en" | "mr" = "en"): string {
  if (!date) return lang === "mr" ? "अज्ञात" : "Unknown"
  const d = daysSince(date)
  if (d === 0) return lang === "mr" ? "आज" : "Today"
  if (d === 1) return lang === "mr" ? "1 दिवसापूर्वी" : "1 day ago"
  if (lang === "mr") return `${d} दिवसांपूर्वी`
  return `${d} days ago`
}

export function getVisitingDateGroup(visitDate: string): "today" | "thisWeek" | "nextWeek" | "later" {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const visit = new Date(visitDate)
  visit.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((visit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return "today"
  if (diffDays <= 7) return "thisWeek"
  if (diffDays <= 14) return "nextWeek"
  return "later"
}

export function getMapsUrl(lat: number | null, lng: number | null, address: string): string {
  if (lat && lng) return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`
}

export function getTelUrl(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`
}

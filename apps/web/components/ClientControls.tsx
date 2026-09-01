"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Languages, Search, Star } from "lucide-react";
import { apiGet, apiPost } from "../lib/api";
import { Lang } from "../lib/i18n";

type SearchResult = { title: string; subtitle: string; url: string; entity_type: string };
type ChatAction = { type: "call" | "link"; label: string; value: string };
type ChatSource = { name: string };
type ChatAnswer = {
  message: string;
  triage_level: "E0" | "E1" | "E2" | "E3" | null;
  actions?: ChatAction[];
  sources?: ChatSource[];
};

export function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (window.localStorage.getItem("lang") as Lang | null) ?? "en";
  });
  function update(next: Lang) {
    window.localStorage.setItem("lang", next);
    setLang(next);
    window.dispatchEvent(new CustomEvent("arogya-lang", { detail: next }));
  }
  return <button aria-label="Switch language" onClick={() => update(lang === "en" ? "mr" : "en")}><Languages size={17} /> {lang === "en" ? "मराठी" : "English"}</button>;
}

export function EmergencyButton() {
  const [open, setOpen] = useState(false);
  return <>
    <button className="danger" onClick={() => setOpen(true)} aria-haspopup="dialog"><AlertTriangle size={17} /> Emergency</button>
    {open ? <div role="dialog" aria-modal="true" className="panel" style={{ position: "fixed", inset: "auto 1rem 1rem 1rem", zIndex: 30, maxWidth: 520, margin: "auto" }}>
      <h2>Emergency help | आपत्कालीन मदत</h2>
      <p>If this may be an emergency, call now. This works without Ask Arogya.</p>
      <div className="grid">
        <a className="button danger" href="tel:108">Call 108 Ambulance</a>
        <a className="button" href="tel:102">Call 102 referral transport</a>
        <a className="button" href="tel:104">Call 104 health advice</a>
        <a className="button" href="/emergency">Open emergency page</a>
        <button onClick={() => setOpen(false)}>Close</button>
      </div>
    </div> : null}
  </>;
}

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  useEffect(() => {
    const id = window.setTimeout(async () => {
      if (q.trim().length < 2) { setResults([]); return; }
      const data = await apiGet<{ results: SearchResult[] }>(`/api/v1/search?q=${encodeURIComponent(q)}`);
      setResults(data.results);
    }, 250);
    return () => window.clearTimeout(id);
  }, [q]);
  return <div className="panel">
    <label className="field">
      <span className="muted">Search verified healthcare information</span>
      <span style={{ display: "flex", gap: ".5rem" }}><Search aria-hidden size={22} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cardiology, clinic, lipid profile" /></span>
    </label>
    {q.length >= 2 && results.length === 0 ? <p className="muted">No verified results found.</p> : null}
    <div className="grid">
      {results.map((r) => <a className="card" key={r.url} href={r.url}><strong>{r.title}</strong><br /><span className="muted">{r.entity_type} · {r.subtitle}</span></a>)}
    </div>
  </div>;
}

export function SaveButton({ id, label }: { id: string; label: string }) {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    return (JSON.parse(localStorage.getItem("saved") ?? "[]") as string[]).includes(id);
  });
  return <button onClick={() => {
    const current = new Set<string>(JSON.parse(localStorage.getItem("saved") ?? "[]"));
    if (saved) {
      current.delete(id);
    } else {
      current.add(id);
    }
    localStorage.setItem("saved", JSON.stringify([...current]));
    setSaved(!saved);
  }}><Star size={17} /> {saved ? "Saved" : label}</button>;
}

export function AskArogya() {
  const [message, setMessage] = useState("Can I eat before a lipid profile?");
  const [answer, setAnswer] = useState<ChatAnswer | null>(null);
  const chips = useMemo(() => ["Find a doctor", "Clinic open now", "Visiting specialist", "Can I eat before a lipid profile?", "I am having severe chest pain"], []);
  async function submit(text = message) {
    setMessage(text);
    const data = await apiPost<ChatAnswer>("/api/v1/chat", { message: text, language: "en" });
    setAnswer(data);
  }
  return <div className="grid">
    <div className="panel">
      <h1>How can Arogya help?</h1>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>{chips.map((chip) => <button key={chip} onClick={() => submit(chip)}>{chip}</button>)}</div>
      <form className="form" onSubmit={(e) => { e.preventDefault(); void submit(); }}>
        <label className="field"><span>Message</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} /></label>
        <button className="primary" type="submit">Ask Arogya</button>
      </form>
    </div>
    {answer ? <div className="panel" aria-live="polite"><h2>{answer.triage_level === "E0" ? "Emergency guidance" : "Grounded answer"}</h2><p>{answer.message}</p>{answer.actions?.map((a) => a.type === "call" ? <a className="button danger" key={a.value} href={`tel:${a.value}`}>{a.label}</a> : <a className="button" key={a.value} href={a.value}>{a.label}</a>)}<p className="muted">Sources: {answer.sources?.length ? answer.sources.map((s) => s.name).join(", ") : "No local source available"}</p></div> : null}
  </div>;
}

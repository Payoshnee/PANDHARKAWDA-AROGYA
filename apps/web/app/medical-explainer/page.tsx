"use client";

import { useState } from "react";

const terms: Record<string, string> = {
  mri: "MRI is an imaging test. It helps doctors see internal body structures. It does not diagnose by itself.",
  "x-ray": "X-ray is an imaging test often used for bones or chest structures. Ask a doctor what your result means.",
  ultrasound: "Ultrasound uses sound waves to create images. It is commonly used for pregnancy and abdominal checks."
};

export default function MedicalExplainer() {
  const [term, setTerm] = useState("MRI");
  const key = term.toLowerCase();
  return <div><h1>Medical Term Explainer</h1><label className="field"><span>Medical term</span><input value={term} onChange={(e) => setTerm(e.target.value)} /></label><div className="panel"><h2>{term}</h2><p>{terms[key] ?? "I do not have reviewed information for that term yet. Please ask a doctor or use verified sources."}</p><p className="muted">This explains general meaning only, not your diagnosis.</p></div></div>;
}

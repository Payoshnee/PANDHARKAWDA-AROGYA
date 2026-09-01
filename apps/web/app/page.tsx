import { GlobalSearch } from "../components/ClientControls";
import { apiGet, ContentRecord, Doctor, Facility } from "../lib/api";
import { VerificationBadge, CallNavigate } from "../components/Layout";

export default async function Home() {
  const doctors = await apiGet<{ data: Doctor[] }>("/api/v1/doctors");
  const facilities = await apiGet<{ data: Facility[] }>("/api/v1/facilities");
  const alerts = await apiGet<{ data: ContentRecord[] }>("/api/v1/health-alerts");
  return <div>
    <p className="muted">Healthcare information for Pandharkawda</p>
    <h1>Find the right local healthcare quickly</h1>
    <GlobalSearch />
    <section className="section grid three">
      {["Open Now", "Local Doctors", "Visiting Doctors", "Public Hospital", "Government Schemes", "Test Preparation", "Ask Arogya"].map((label) => <a className="card" key={label} href={label === "Open Now" ? "/open-now" : label === "Visiting Doctors" ? "/doctors/visiting" : label === "Public Hospital" ? "/public-hospital" : label === "Government Schemes" ? "/schemes" : label === "Test Preparation" ? "/tests" : label === "Ask Arogya" ? "/ask-arogya" : "/doctors"}><strong>{label}</strong><p className="muted">Verified information, freshness shown.</p></a>)}
    </section>
    <section className="section"><h2>Visiting Soon</h2><div className="grid two">{doctors.data.filter((d) => d.doctor_type === "visiting").map((d) => <article className="card" key={d.id}><h3>{d.name_en}</h3><p>{d.specialty} · {d.qualification}</p><VerificationBadge date={d.last_verified_at} /><CallNavigate phone={d.phone_public} /></article>)}</div></section>
    <section className="section"><h2>Open Now Near You</h2><p className="muted">Location is requested only if you use the browser permission yourself. General Pandharkawda results are shown by default.</p><a className="button" href="/open-now">View open now</a></section>
    <section className="section"><h2>Public Hospital</h2>{facilities.data.filter((f) => f.type === "public_hospital").map((f) => <article className="panel" key={f.id}><h3>{f.name_en}</h3><p>{f.services.join(", ")}</p><CallNavigate phone={f.phone_public} lat={f.latitude} lng={f.longitude} /></article>)}</section>
    <section className="section"><h2>Verified Local Updates</h2>{alerts.data.map((a) => <article className="card" key={a.id}><h3>{a.title_en}</h3><p>{a.summary_en}</p><p className="muted">{a.source} · reviewed {a.review_date}</p></article>)}</section>
  </div>;
}

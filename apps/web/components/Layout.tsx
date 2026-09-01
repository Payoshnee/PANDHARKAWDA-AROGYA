import Link from "next/link";
import { EmergencyButton, LanguageSwitcher } from "./ClientControls";

const nav = [
  ["/", "Home"],
  ["/doctors", "Doctors"],
  ["/facilities", "Hospitals & Clinics"],
  ["/schemes", "Schemes"],
  ["/tests", "Tests & Procedures"],
  ["/health-alerts", "Health Alerts"],
  ["/ask-arogya", "Ask Arogya"]
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  return <div className="shell">
    <a className="skip" href="#main">Skip to content</a>
    <div className="emergency-bar"><div className="inner"><span>Emergency? आपत्कालीन मदत</span><a className="button danger" href="tel:108">Call 108</a></div></div>
    <header className="topbar"><div className="topbar-inner">
      <Link href="/" className="brand">Pandharkawda Arogya<br /><span className="muted">पांढरकवडा आरोग्य</span></Link>
      <nav className="nav" aria-label="Primary">{nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div style={{ display: "flex", gap: ".5rem" }}><LanguageSwitcher /><EmergencyButton /></div>
    </div></header>
    <main id="main" className="main">{children}</main>
    <nav className="mobile-nav" aria-label="Mobile primary"><Link href="/">Home</Link><Link href="/doctors">Doctors</Link><Link href="/open-now">Open Now</Link><Link href="/ask-arogya">Ask</Link></nav>
  </div>;
}

export function VerificationBadge({ date }: { date?: string | null }) {
  return <span className="badge verified">Verified{date ? ` · ${new Date(date).toLocaleDateString("en-IN")}` : ""}</span>;
}

export function CallNavigate({ phone, lat, lng }: { phone?: string | null; lat?: number | null; lng?: number | null }) {
  return <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
    {phone ? <a className="button primary" href={`tel:${phone}`}>Call</a> : <span className="badge warning">Phone not public. Please call facility desk.</span>}
    {lat && lng ? <a className="button" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`} target="_blank">Navigate</a> : null}
    <a className="button" href="/report-incorrect">Report incorrect information</a>
  </div>;
}

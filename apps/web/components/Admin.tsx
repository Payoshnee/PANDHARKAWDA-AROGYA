import Link from "next/link";
import { apiGet } from "../lib/api";

const adminNav = [
  ["/admin", "Overview"],
  ["/admin/doctors", "Doctors"],
  ["/admin/specialties", "Specialties"],
  ["/admin/facilities", "Facilities"],
  ["/admin/schedules", "Schedules"],
  ["/admin/visiting-sessions", "Visiting Sessions"],
  ["/admin/services", "Services"],
  ["/admin/schemes", "Schemes"],
  ["/admin/lab-tests", "Lab Tests"],
  ["/admin/knowledge", "Knowledge"],
  ["/admin/health-alerts", "Health Alerts"],
  ["/admin/verification", "Verification Queue"],
  ["/admin/reports", "User Reports"],
  ["/admin/audit-log", "Audit Log"],
  ["/admin/users", "Admin Users"],
  ["/admin/settings", "Settings"]
];

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="admin-layout"><aside className="sidebar" aria-label="Admin">{adminNav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</aside><section><p className="muted">Admin / {title}</p>{children}</section></div>;
}

export async function AdminOverview() {
  const data = await apiGet<{ data: Record<string, number> }>("/api/v1/admin/overview");
  return <AdminShell title="Overview"><h1>Admin Overview</h1><div className="grid three">{Object.entries(data.data).map(([key, value]) => <article className="card" key={key}><strong>{key.replaceAll("_", " ")}</strong><p style={{ fontSize: "1.8rem", margin: ".25rem 0" }}>{value}</p></article>)}</div></AdminShell>;
}

export function AdminPlaceholder({ title }: { title: string }) {
  return <AdminShell title={title}><h1>{title}</h1><div className="panel"><p>This operational page is wired into the admin information architecture. Mutating actions are shown only where backend workflows are implemented.</p><a className="button" href="/admin/verification">Open verification queue</a></div></AdminShell>;
}

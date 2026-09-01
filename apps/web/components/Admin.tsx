import { cookies } from "next/headers";
import Link from "next/link";
import { decideVerificationItem } from "../app/admin/verification/actions";
import { adminApiGet, AuditLog, IncorrectInfoReport, VerificationQueueItem } from "../lib/api";

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

async function adminCookieHeader() {
  return (await cookies()).toString();
}

function AdminLoginRequired({ title }: { title: string }) {
  return <AdminShell title={title}><h1>{title}</h1><div className="panel"><p>Admin authentication is required for this operational view.</p><Link className="button primary" href="/admin/login">Log in</Link></div></AdminShell>;
}

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="admin-layout"><aside className="sidebar" aria-label="Admin">{adminNav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</aside><section><p className="muted">Admin / {title}</p>{children}</section></div>;
}

export async function AdminOverview() {
  let data: { data: Record<string, number> };
  try {
    data = await adminApiGet<{ data: Record<string, number> }>("/api/v1/admin/overview", await adminCookieHeader());
  } catch {
    return <AdminLoginRequired title="Overview" />;
  }
  return <AdminShell title="Overview"><h1>Admin Overview</h1><div className="grid three">{Object.entries(data.data).map(([key, value]) => <article className="card" key={key}><strong>{key.replaceAll("_", " ")}</strong><p style={{ fontSize: "1.8rem", margin: ".25rem 0" }}>{value}</p>{key === "unresolved_user_reports" ? <Link className="button" href="/admin/reports">Review reports</Link> : null}</article>)}</div></AdminShell>;
}

export function AdminPlaceholder({ title }: { title: string }) {
  return <AdminShell title={title}><h1>{title}</h1><div className="panel"><p>This operational page is wired into the admin information architecture. Mutating actions are shown only where backend workflows are implemented.</p><Link className="button" href="/admin/verification">Open verification queue</Link></div></AdminShell>;
}

export async function AdminReportsPage() {
  let reports: { data: IncorrectInfoReport[] };
  try {
    reports = await adminApiGet<{ data: IncorrectInfoReport[] }>("/api/v1/admin/reports", await adminCookieHeader());
  } catch {
    return <AdminLoginRequired title="User Reports" />;
  }
  return <AdminShell title="User Reports"><h1>User Reports</h1>{reports.data.length === 0 ? <p className="panel">No unresolved user reports.</p> : <table><thead><tr><th>Report</th><th>Target</th><th>Reason</th><th>Status</th><th>Submitted</th><th>Action</th></tr></thead><tbody>{reports.data.map((report) => <tr key={report.id}><td>{report.id}</td><td>{report.target_type}<br /><span className="muted">{report.target_id}</span></td><td>{report.reason}<br /><span className="muted">{report.details ?? "No extra details"}</span></td><td><span className="badge warning">{report.status}</span></td><td>{new Date(report.created_at).toLocaleString("en-IN")}</td><td><Link className="button" href="/admin/verification">Open queue</Link></td></tr>)}</tbody></table>}</AdminShell>;
}

export async function AdminAuditLogPage() {
  let audit: { data: AuditLog[] };
  try {
    audit = await adminApiGet<{ data: AuditLog[] }>("/api/v1/admin/audit-logs", await adminCookieHeader());
  } catch {
    return <AdminLoginRequired title="Audit Log" />;
  }
  return <AdminShell title="Audit Log"><h1>Audit Log</h1>{audit.data.length === 0 ? <p className="panel">No audit entries yet.</p> : <table><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Entity</th><th>Audit ID</th></tr></thead><tbody>{audit.data.map((entry) => <tr key={entry.id}><td>{new Date(entry.created_at).toLocaleString("en-IN")}</td><td>{entry.actor}</td><td>{entry.action.replaceAll("_", " ")}</td><td>{entry.entity_type}<br /><span className="muted">{entry.entity_id}</span></td><td>{entry.id}</td></tr>)}</tbody></table>}</AdminShell>;
}

export async function AdminVerificationPage() {
  let queue: { data: VerificationQueueItem[] };
  try {
    queue = await adminApiGet<{ data: VerificationQueueItem[] }>("/api/v1/admin/verification", await adminCookieHeader());
  } catch {
    return <AdminLoginRequired title="Verification Queue" />;
  }
  return <AdminShell title="Verification Queue"><h1>Verification Queue</h1>{queue.data.length === 0 ? <p className="panel">No verification items are waiting for review.</p> : <table><thead><tr><th>Entity</th><th>Change</th><th>Source</th><th>Risk</th><th>Status</th><th>Decision</th></tr></thead><tbody>{queue.data.map((item) => <tr key={item.id}><td>{item.entity_type}<br /><span className="muted">{item.entity_id}</span></td><td>{item.change_summary}<br /><span className="muted">Submitted by {item.submitted_by} on {new Date(item.created_at).toLocaleString("en-IN")}</span></td><td>{item.source}</td><td><span className="badge warning">{item.risk}</span></td><td><span className={item.status === "PENDING" ? "badge warning" : "badge verified"}>{item.status}</span>{item.decision_reason ? <p className="muted">{item.decision_reason}</p> : null}</td><td>{item.status === "PENDING" ? <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><form action={async () => { "use server"; await decideVerificationItem(item.id, "approve"); }}><button className="primary" type="submit">Approve</button></form><form action={async () => { "use server"; await decideVerificationItem(item.id, "reject"); }}><button type="submit">Reject</button></form></div> : <span className="muted">Resolved</span>}</td></tr>)}</tbody></table>}</AdminShell>;
}

import { apiGet, Facility } from "../../lib/api";
import { CallNavigate, VerificationBadge } from "../../components/Layout";

export default async function Facilities() {
  const facilities = await apiGet<{ data: Facility[] }>("/api/v1/facilities");
  return <div><h1>Hospitals & Clinics</h1><div className="grid two">{facilities.data.map((f) => <article className="card" key={f.id}><h2>{f.name_en}</h2><p>{f.type} · {f.services.join(", ")}</p><VerificationBadge date={f.last_verified_at} /><CallNavigate phone={f.phone_public} lat={f.latitude} lng={f.longitude} /><a className="button" href={`/facilities/${f.slug}`}>Details</a></article>)}</div></div>;
}

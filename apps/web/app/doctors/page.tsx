import { apiGet, Doctor } from "../../lib/api";
import { CallNavigate, VerificationBadge } from "../../components/Layout";

export default async function Doctors() {
  const doctors = await apiGet<{ data: Doctor[] }>("/api/v1/doctors");
  return <div><h1>Doctors</h1><p className="muted">Local and visiting doctors. Clinic open status is separate from doctor availability.</p><div className="grid two">{doctors.data.map((d) => <article className="card" key={d.id}><h2>{d.name_en}</h2><p>{d.qualification}</p><p><strong>{d.specialty}</strong> · {d.doctor_type}</p><VerificationBadge date={d.last_verified_at} /><CallNavigate phone={d.phone_public} /><a className="button" href={`/doctors/${d.slug}`}>View Profile</a></article>)}</div></div>;
}

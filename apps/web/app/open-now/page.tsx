import { apiGet, Facility } from "../../lib/api";
import { CallNavigate } from "../../components/Layout";

export default async function OpenNow() {
  const rows = await apiGet<{ data: Array<{ facility: Facility; facility_open: boolean; facility_reason: string; doctor_available: boolean; warning: string | null }> }>("/api/v1/facilities/open-now");
  return <div><h1>Open Now</h1><div className="grid two">{rows.data.map((row) => <article className="card" key={row.facility.id}><h2>{row.facility.name_en}</h2><p><span className={row.facility_open ? "badge verified" : "badge warning"}>{row.facility_open ? "Facility open" : "Facility closed"}</span></p><p><span className={row.doctor_available ? "badge verified" : "badge warning"}>{row.doctor_available ? "Doctor available" : "Doctor not available"}</span></p><p className="muted">{row.facility_reason}</p><CallNavigate phone={row.facility.phone_public} lat={row.facility.latitude} lng={row.facility.longitude} /></article>)}</div></div>;
}

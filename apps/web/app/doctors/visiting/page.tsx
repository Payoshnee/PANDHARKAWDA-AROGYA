import { apiGet, Doctor, Facility } from "../../../lib/api";
import { ReminderButton } from "../../../components/ReminderButton";

export default async function Visiting() {
  const visits = await apiGet<{ data: Array<{ id: string; doctor_id: string; facility_id: string; visit_date: string; start_time: string; end_time: string; booking_info_en: string }> }>("/api/v1/visiting-sessions");
  const doctors = await apiGet<{ data: Doctor[] }>("/api/v1/doctors");
  const facilities = await apiGet<{ data: Facility[] }>("/api/v1/facilities");
  return <div><h1>Visiting Doctors</h1><div className="grid two">{visits.data.length ? visits.data.map((v) => {
    const doctor = doctors.data.find((d) => d.id === v.doctor_id);
    const facility = facilities.data.find((f) => f.id === v.facility_id);
    return <article className="card" key={v.id}><h2>{doctor?.name_en}</h2><p>{doctor?.specialty} at {facility?.name_en}</p><p><strong>{v.visit_date}</strong> · {v.start_time} - {v.end_time}</p><p>{v.booking_info_en}</p><div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><a className="button primary" href={`/doctors/${doctor?.slug}`}>Details</a><ReminderButton sessionId={v.id} label={`${doctor?.name_en} at ${facility?.name_en}`} visitDate={v.visit_date} /></div></article>;
  }) : <p>No confirmed visiting specialist matches these filters.</p>}</div></div>;
}

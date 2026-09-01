import { apiGet, Doctor, Facility } from "../../../lib/api";
import { CallNavigate, VerificationBadge } from "../../../components/Layout";
import { SaveButton } from "../../../components/ClientControls";

export default async function DoctorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await apiGet<{ data: Doctor; meta: unknown }>(`/api/v1/doctors/${slug}`);
  const facilities = await apiGet<{ data: Facility[] }>("/api/v1/facilities");
  const facility = facilities.data[0];
  return <div><h1>{doctor.data.name_en}</h1><p>{doctor.data.name_mr}</p><p>{doctor.data.qualification} · {doctor.data.specialty}</p><VerificationBadge date={doctor.data.last_verified_at} /><section className="section panel"><h2>Practice information</h2><p>{facility.name_en}</p><p>{facility.address_en}</p><CallNavigate phone={doctor.data.phone_public ?? facility.phone_public} lat={facility.latitude} lng={facility.longitude} /><SaveButton id={doctor.data.id} label="Save doctor" /></section><section className="section"><h2>Trust panel</h2><p className="muted">Demo record. Please call to confirm before travel.</p></section></div>;
}

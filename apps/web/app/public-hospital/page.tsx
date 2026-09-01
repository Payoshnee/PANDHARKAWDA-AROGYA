import { apiGet, Facility } from "../../lib/api";
import { CallNavigate } from "../../components/Layout";

export default async function PublicHospital() {
  const facilities = await apiGet<{ data: Facility[] }>("/api/v1/facilities?facility_type=public_hospital");
  const hospital = facilities.data[0];
  return <div><h1>Public Hospital</h1>{hospital ? <div className="grid"><section className="panel"><h2>Overview</h2><p>{hospital.name_en}</p><p>{hospital.address_en}</p><CallNavigate phone={hospital.phone_public} lat={hospital.latitude} lng={hospital.longitude} /></section><section><h2>Departments & Services</h2><ul>{hospital.services.map((s) => <li key={s}>{s}</li>)}</ul></section><section className="panel"><h2>Emergency</h2><p>Emergency capability is marked only when verified. Call 108 for ambulance emergencies.</p><a className="button danger" href="tel:108">Call 108</a></section></div> : <p>No verified public hospital record is available.</p>}</div>;
}

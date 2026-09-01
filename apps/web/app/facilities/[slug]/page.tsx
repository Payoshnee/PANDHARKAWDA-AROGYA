import { apiGet, Facility } from "../../../lib/api";
import { CallNavigate, VerificationBadge } from "../../../components/Layout";

export default async function FacilityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facility = await apiGet<{ data: Facility }>(`/api/v1/facilities/${slug}`);
  return <div><h1>{facility.data.name_en}</h1><p>{facility.data.name_mr}</p><VerificationBadge date={facility.data.last_verified_at} /><section className="section panel"><h2>Services</h2><p>{facility.data.services.join(", ")}</p><p>{facility.data.address_en}</p><CallNavigate phone={facility.data.phone_public} lat={facility.data.latitude} lng={facility.data.longitude} /></section></div>;
}

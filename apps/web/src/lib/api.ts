import { useQuery } from "@tanstack/react-query"
import {
  DEMO_AUDIT_LOGS,
  DEMO_DOCTORS,
  DEMO_FACILITIES,
  DEMO_HEALTH_ALERTS,
  DEMO_PROCEDURES,
  DEMO_SCHEMES,
  DEMO_SPECIALTIES,
  DEMO_TESTS,
  DEMO_UPDATES,
  DEMO_USER_REPORTS,
  DEMO_VERIFICATION_RECORDS,
  DEMO_VISITING_SESSIONS,
} from "@/lib/mock-data"
import type { Doctor, Facility, HealthAlert, LabTest, Procedure, Scheme, Specialty, VisitingSession } from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

type ApiList<T> = { data: T[] }

type ApiDoctor = {
  id: string
  slug: string
  name_en: string
  name_mr: string
  qualification: string
  specialty: string
  doctor_type: string
  facility_ids: string[]
  phone_public: string | null
  phone_publication_consent: boolean
  verification_status: string
  last_verified_at: string | null
}

type ApiFacility = {
  id: string
  slug: string
  type: string
  name_en: string
  name_mr: string
  address_en: string
  address_mr: string
  latitude: number | null
  longitude: number | null
  phone_public: string | null
  emergency_flag: boolean
  services: string[]
  verification_status: string
  last_verified_at: string | null
}

type ApiVisit = {
  id: string
  doctor_id: string
  facility_id: string
  visit_date: string
  start_time: string
  end_time: string
  booking_info_en: string
  booking_info_mr: string
  confirmation_status: string
  verified_at: string | null
}

type ApiContent = {
  id: string
  slug: string
  title_en: string
  title_mr: string
  summary_en: string
  summary_mr: string
  source: string
  source_url?: string | null
  review_date: string
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: "include" })
  if (!response.ok) throw new Error(`API ${response.status}`)
  return response.json() as Promise<T>
}

const toSpecialty = (name: string): Specialty => {
  const existing = DEMO_SPECIALTIES.find((s) => s.name_en.toLowerCase() === name.toLowerCase())
  return existing ?? { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name_en: name, name_mr: name }
}

const verified = (status: string) => status === "VERIFIED"

function toFacility(item: ApiFacility): Facility {
  return {
    id: item.id,
    slug: item.slug,
    name_en: item.name_en,
    name_mr: item.name_mr,
    type: item.type === "public_hospital" ? "government" : item.type as Facility["type"],
    address_en: item.address_en,
    address_mr: item.address_mr,
    phone: item.phone_public ?? "",
    lat: item.latitude,
    lng: item.longitude,
    services_en: item.services,
    services_mr: item.services,
    is_public_hospital: item.type === "public_hospital" || item.type === "government",
    has_emergency: item.emergency_flag,
    verified: verified(item.verification_status),
    last_verified: item.last_verified_at,
    created_at: item.last_verified_at ?? new Date().toISOString(),
  }
}

function toDoctor(item: ApiDoctor, facilities: Facility[]): Doctor {
  const specialty = toSpecialty(item.specialty)
  const facility = facilities.find((f) => item.facility_ids.includes(f.id))
  return {
    id: item.id,
    slug: item.slug,
    name_en: item.name_en,
    name_mr: item.name_mr,
    qualification_en: item.qualification,
    qualification_mr: item.qualification,
    specialty_id: specialty.id,
    specialty,
    is_visiting: item.doctor_type === "visiting",
    home_city_en: item.doctor_type === "visiting" ? "Nagpur" : null,
    home_city_mr: item.doctor_type === "visiting" ? "नागपूर" : null,
    facility_id: facility?.id ?? item.facility_ids[0] ?? null,
    facility,
    phone: item.phone_public,
    verified: verified(item.verification_status),
    last_verified: item.last_verified_at,
    publication_consent: item.phone_publication_consent,
    created_at: item.last_verified_at ?? new Date().toISOString(),
  }
}

function toVisit(item: ApiVisit, doctors: Doctor[], facilities: Facility[]): VisitingSession {
  return {
    id: item.id,
    doctor_id: item.doctor_id,
    doctor: doctors.find((doctor) => doctor.id === item.doctor_id),
    facility_id: item.facility_id,
    facility: facilities.find((facility) => facility.id === item.facility_id),
    visit_date: item.visit_date,
    start_time: item.start_time.slice(0, 5),
    end_time: item.end_time.slice(0, 5),
    status: item.confirmation_status.toLowerCase() as VisitingSession["status"],
    confirmed_at: item.verified_at,
    created_at: item.verified_at ?? new Date().toISOString(),
  }
}

const toContent = (item: ApiContent) => ({
  ...item,
  source_en: item.source,
  source_mr: item.source,
  reviewed_at: item.review_date,
  published_at: item.review_date,
  active_from: item.review_date,
  active_until: null,
  severity: "advisory",
  area_en: "Pandharkawda",
  area_mr: "पांढरकवडा",
  action_en: item.summary_en,
  action_mr: item.summary_mr,
})

async function loadPublicData() {
  const [facilityRes, doctorRes, visitRes, schemeRes, testRes, procedureRes, alertRes] = await Promise.all([
    apiGet<ApiList<ApiFacility>>("/api/v1/facilities"),
    apiGet<ApiList<ApiDoctor>>("/api/v1/doctors"),
    apiGet<ApiList<ApiVisit>>("/api/v1/visiting-sessions"),
    apiGet<ApiList<ApiContent>>("/api/v1/schemes"),
    apiGet<ApiList<ApiContent>>("/api/v1/lab-tests"),
    apiGet<ApiList<ApiContent>>("/api/v1/procedures"),
    apiGet<ApiList<ApiContent>>("/api/v1/health-alerts"),
  ])
  const facilities = facilityRes.data.map(toFacility)
  const doctors = doctorRes.data.map((doctor) => toDoctor(doctor, facilities))
  const visitingSessions = visitRes.data.map((visit) => toVisit(visit, doctors, facilities))

  return {
    doctors,
    facilities,
    specialties: Array.from(new Map(doctors.map((d) => [d.specialty_id, d.specialty!])).values()),
    visitingSessions,
    schemes: schemeRes.data.map((item) => ({
      ...DEMO_SCHEMES[0],
      ...toContent(item),
      eligibility_en: item.summary_en,
      eligibility_mr: item.summary_mr,
      benefits_en: item.summary_en,
      benefits_mr: item.summary_mr,
      documents_en: [],
      documents_mr: [],
      official_url: item.source_url ?? "#",
      helpline: null,
    })) as Scheme[],
    tests: testRes.data.map((item) => ({ ...DEMO_TESTS[0], ...toContent(item), name_en: item.title_en, name_mr: item.title_mr, what_is_en: item.summary_en, what_is_mr: item.summary_mr })) as LabTest[],
    procedures: procedureRes.data.map((item) => ({ ...DEMO_PROCEDURES[0], ...toContent(item), name_en: item.title_en, name_mr: item.title_mr, what_is_en: item.summary_en, what_is_mr: item.summary_mr })) as Procedure[],
    healthAlerts: alertRes.data.map(toContent) as HealthAlert[],
    updates: DEMO_UPDATES,
    userReports: DEMO_USER_REPORTS,
    verificationRecords: DEMO_VERIFICATION_RECORDS,
    auditLogs: DEMO_AUDIT_LOGS,
  }
}

export function usePublicData() {
  const query = useQuery({
    queryKey: ["public-data"],
    queryFn: loadPublicData,
    staleTime: 60_000,
    retry: 1,
  })

  return {
    isLoading: query.isLoading,
    error: query.error,
    data: query.data ?? {
      doctors: DEMO_DOCTORS,
      facilities: DEMO_FACILITIES,
      specialties: DEMO_SPECIALTIES,
      visitingSessions: DEMO_VISITING_SESSIONS,
      schemes: DEMO_SCHEMES,
      tests: DEMO_TESTS,
      procedures: DEMO_PROCEDURES,
      healthAlerts: DEMO_HEALTH_ALERTS,
      updates: DEMO_UPDATES,
      userReports: DEMO_USER_REPORTS,
      verificationRecords: DEMO_VERIFICATION_RECORDS,
      auditLogs: DEMO_AUDIT_LOGS,
    },
  }
}

export async function askArogya(message: string, language: string) {
  return apiPost<{ message: string; cards?: Array<{ type: string; data: unknown }> }>("/api/v1/chat", { message, language })
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`API ${response.status}`)
  return response.json() as Promise<T>
}

export function adminLogin(email: string, password: string) {
  return apiPost("/api/v1/admin/auth/login", { email, password })
}

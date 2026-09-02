export type Language = "en" | "mr"

export type Specialty = {
  id: string
  name_en: string
  name_mr: string
}

export type FacilityType = "hospital" | "clinic" | "diagnostic" | "government"

export type Facility = {
  id: string
  slug: string
  name_en: string
  name_mr: string
  type: FacilityType
  address_en: string
  address_mr: string
  phone: string
  lat: number | null
  lng: number | null
  services_en: string[]
  services_mr: string[]
  is_public_hospital: boolean
  has_emergency: boolean
  verified: boolean
  last_verified: string | null
  created_at: string
}

export type Doctor = {
  id: string
  slug: string
  name_en: string
  name_mr: string
  qualification_en: string
  qualification_mr: string
  specialty_id: string
  specialty?: Specialty
  is_visiting: boolean
  home_city_en: string | null
  home_city_mr: string | null
  facility_id: string | null
  facility?: Facility
  phone: string | null
  verified: boolean
  last_verified: string | null
  publication_consent: boolean
  created_at: string
}

export type TimeSlot = {
  start: string
  end: string
}

export type DaySchedule = {
  day: number
  slots: TimeSlot[]
}

export type Schedule = {
  id: string
  doctor_id: string
  facility_id: string
  weekly: DaySchedule[]
  exceptions: {
    date: string
    type: "absent" | "special"
    slots?: TimeSlot[]
    note_en?: string
    note_mr?: string
  }[]
}

export type VisitingSession = {
  id: string
  doctor_id: string
  doctor?: Doctor
  facility_id: string
  facility?: Facility
  visit_date: string
  start_time: string
  end_time: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  confirmed_at: string | null
  created_at: string
}

export type Scheme = {
  id: string
  slug: string
  title_en: string
  title_mr: string
  summary_en: string
  summary_mr: string
  eligibility_en: string
  eligibility_mr: string
  benefits_en: string
  benefits_mr: string
  documents_en: string[]
  documents_mr: string[]
  official_url: string
  helpline: string | null
  source_en: string
  source_mr: string
  reviewed_at: string
}

export type LabTest = {
  id: string
  slug: string
  name_en: string
  name_mr: string
  what_is_en: string
  what_is_mr: string
  why_ordered_en: string
  why_ordered_mr: string
  preparation_en: string
  preparation_mr: string
  fasting_required: boolean
  duration_en: string
  duration_mr: string
  where_available_en: string
  where_available_mr: string
  reviewed_at: string
}

export type Procedure = {
  id: string
  slug: string
  name_en: string
  name_mr: string
  what_is_en: string
  what_is_mr: string
  why_used_en: string
  why_used_mr: string
  what_happens_en: string
  what_happens_mr: string
  preparation_en: string
  preparation_mr: string
  questions_to_ask_en: string[]
  questions_to_ask_mr: string[]
  where_available_en: string
  where_available_mr: string
  reviewed_at: string
}

export type MedicalTerm = {
  id: string
  slug: string
  term_en: string
  term_mr: string
  meaning_en: string
  meaning_mr: string
  why_you_hear_en: string
  why_you_hear_mr: string
  general_info_en: string
  general_info_mr: string
  source_en: string
  source_mr: string
  reviewed_at: string
}

export type AlertSeverity = "informational" | "advisory" | "important"

export type HealthAlert = {
  id: string
  slug: string
  title_en: string
  title_mr: string
  severity: AlertSeverity
  area_en: string
  area_mr: string
  active_from: string
  active_until: string | null
  summary_en: string
  summary_mr: string
  action_en: string
  action_mr: string
  source_en: string
  source_mr: string
  published_at: string
  reviewed_at: string
}

export type HealthUpdate = {
  id: string
  title_en: string
  title_mr: string
  category_en: string
  category_mr: string
  date: string
  source_en: string
  source_mr: string
  verified: boolean
  summary_en: string
  summary_mr: string
}

export type SavedItem = {
  id: string
  user_id: string | null
  entity_type: "doctor" | "facility"
  entity_id: string
  created_at: string
}

export type UserReport = {
  id: string
  entity_type: "doctor" | "facility" | "scheme" | "test" | "procedure"
  entity_id: string
  reason: string
  details: string | null
  status: "open" | "investigating" | "resolved" | "dismissed"
  created_at: string
}

export type VerificationRecord = {
  id: string
  entity_type: string
  entity_id: string
  entity_name: string
  current_data: Record<string, unknown>
  proposed_data: Record<string, unknown>
  source: string
  notes: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export type AuditLog = {
  id: string
  admin_user: string
  action: string
  entity_type: string
  entity_id: string
  change_summary: string
  before_data: Record<string, unknown> | null
  after_data: Record<string, unknown> | null
  created_at: string
}

export type AdminUser = {
  id: string
  email: string
  name: string
  role: "admin" | "editor" | "viewer"
  created_at: string
}

export type Service = {
  id: string
  name_en: string
  name_mr: string
  category_en: string
  category_mr: string
  facility_id: string | null
}

export type AvailabilityStatus = "open" | "closed" | "unknown"
export type DoctorAvailability = "available" | "not_available" | "unknown"

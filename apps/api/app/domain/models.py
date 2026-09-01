from __future__ import annotations

from datetime import date, datetime, time
from enum import Enum
from pydantic import BaseModel, Field


class StrEnum(str, Enum):
    pass


class VerificationStatus(StrEnum):
    DRAFT = "DRAFT"
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    VERIFIED = "VERIFIED"
    STALE = "STALE"
    REJECTED = "REJECTED"
    CLOSED = "CLOSED"


class VisitingStatus(StrEnum):
    DRAFT = "DRAFT"
    CONFIRMED = "CONFIRMED"
    RESCHEDULED = "RESCHEDULED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"


class ScheduleBlock(BaseModel):
    weekday: int = Field(ge=0, le=6)
    start_time: time
    end_time: time


class AvailabilityOverride(BaseModel):
    date: date
    status: str
    start_time: time | None = None
    end_time: time | None = None
    reason: str


class TrustMeta(BaseModel):
    verified: bool
    verification_status: VerificationStatus
    last_verified_at: datetime | None
    source_type: str
    freshness: str


class Facility(BaseModel):
    id: str
    slug: str
    type: str
    name_en: str
    name_mr: str
    address_en: str
    address_mr: str
    landmark: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    phone_public: str | None = None
    emergency_flag: bool = False
    services: list[str] = []
    schedules: list[ScheduleBlock] = []
    overrides: list[AvailabilityOverride] = []
    verification_status: VerificationStatus
    last_verified_at: datetime | None = None
    source_type: str = "demo"


class Doctor(BaseModel):
    id: str
    slug: str
    name_en: str
    name_mr: str
    qualification: str
    specialty: str
    doctor_type: str
    facility_ids: list[str]
    phone_public: str | None = None
    phone_publication_consent: bool = False
    verification_status: VerificationStatus
    last_verified_at: datetime | None = None
    next_review_due: date | None = None
    source_type: str = "demo"


class VisitingSession(BaseModel):
    id: str
    doctor_id: str
    facility_id: str
    visit_date: date
    start_time: time
    end_time: time
    booking_info_en: str
    booking_info_mr: str
    confirmation_status: VisitingStatus
    verified_at: datetime | None = None


class ContentRecord(BaseModel):
    id: str
    slug: str
    title_en: str
    title_mr: str
    summary_en: str
    summary_mr: str
    source: str
    source_url: str | None = None
    review_date: date
    verification_status: VerificationStatus = VerificationStatus.VERIFIED


class IncorrectInfoReport(BaseModel):
    target_type: str
    target_id: str
    reason: str
    details: str | None = None
    contact: str | None = None

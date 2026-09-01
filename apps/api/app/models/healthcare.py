from __future__ import annotations

from datetime import date, datetime, time
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, JSON, String, Text, Time, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DoctorRecord(Base):
    __tablename__ = "doctors"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String, nullable=False)
    name_mr: Mapped[str] = mapped_column(String, nullable=False)
    verification_status: Mapped[str] = mapped_column(String, nullable=False)
    phone_publication_consent: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    qualification: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    doctor_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    phone_public: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    private_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class SpecialtyRecord(Base):
    __tablename__ = "specialties"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String, nullable=False)
    name_mr: Mapped[str] = mapped_column(String, nullable=False)


class DoctorSpecialtyRecord(Base):
    __tablename__ = "doctor_specialties"
    __table_args__ = (UniqueConstraint("doctor_id", "specialty_id"),)

    doctor_id: Mapped[str] = mapped_column(ForeignKey("doctors.id"), primary_key=True)
    specialty_id: Mapped[str] = mapped_column(ForeignKey("specialties.id"), primary_key=True)


class FacilityRecord(Base):
    __tablename__ = "facilities"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String, nullable=False)
    name_mr: Mapped[str] = mapped_column(String, nullable=False)
    verification_status: Mapped[str] = mapped_column(String, nullable=False)
    phone_public: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    address_en: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    address_mr: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    landmark: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    emergency_flag: Mapped[bool] = mapped_column(Boolean, default=False)
    private_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class DoctorFacilityRecord(Base):
    __tablename__ = "doctor_facilities"
    __table_args__ = (UniqueConstraint("doctor_id", "facility_id"),)

    id: Mapped[str] = mapped_column(String, primary_key=True)
    doctor_id: Mapped[str] = mapped_column(ForeignKey("doctors.id"), nullable=False)
    facility_id: Mapped[str] = mapped_column(ForeignKey("facilities.id"), nullable=False)
    public_phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)


class ServiceRecord(Base):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String, nullable=False)
    name_mr: Mapped[str] = mapped_column(String, nullable=False)


class FacilityServiceRecord(Base):
    __tablename__ = "facility_services"
    __table_args__ = (UniqueConstraint("facility_id", "service_id"),)

    facility_id: Mapped[str] = mapped_column(ForeignKey("facilities.id"), primary_key=True)
    service_id: Mapped[str] = mapped_column(ForeignKey("services.id"), primary_key=True)


class ScheduleRecord(Base):
    __tablename__ = "schedules"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    doctor_facility_id: Mapped[str] = mapped_column(ForeignKey("doctor_facilities.id"), nullable=False)
    weekday: Mapped[int] = mapped_column(Integer, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    effective_from: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    effective_to: Mapped[Optional[date]] = mapped_column(Date, nullable=True)


class AvailabilityOverrideRecord(Base):
    __tablename__ = "availability_overrides"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    doctor_facility_id: Mapped[str] = mapped_column(ForeignKey("doctor_facilities.id"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    start_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    end_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)


class VisitingSessionRecord(Base):
    __tablename__ = "visiting_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    doctor_facility_id: Mapped[str] = mapped_column(ForeignKey("doctor_facilities.id"), nullable=False)
    visit_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    booking_info_en: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    booking_info_mr: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confirmation_status: Mapped[str] = mapped_column(String, nullable=False)


class BilingualContentRecord(Base):
    __abstract__ = True

    id: Mapped[str] = mapped_column(String, primary_key=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    title_en: Mapped[str] = mapped_column(String, nullable=False)
    title_mr: Mapped[str] = mapped_column(String, nullable=False)
    content_en: Mapped[str] = mapped_column(Text, nullable=False)
    content_mr: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String, nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    review_status: Mapped[str] = mapped_column(String, nullable=False, default="VERIFIED")
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class SchemeRecord(BilingualContentRecord):
    __tablename__ = "schemes"


class LabTestRecord(BilingualContentRecord):
    __tablename__ = "lab_tests"


class ProcedureRecord(BilingualContentRecord):
    __tablename__ = "procedures"


class KnowledgeArticleRecord(BilingualContentRecord):
    __tablename__ = "knowledge_articles"


class HealthAlertRecord(BilingualContentRecord):
    __tablename__ = "health_alerts"

    severity: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    starts_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class PublicHealthMetricRecord(Base):
    __tablename__ = "public_health_metrics"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    metric_date: Mapped[date] = mapped_column(Date, nullable=False)
    metric_name: Mapped[str] = mapped_column(String, nullable=False)
    area_id: Mapped[str] = mapped_column(String, nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    dataset_label: Mapped[str] = mapped_column(String, nullable=False)


class SubscriptionRecord(Base):
    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    topic_type: Mapped[str] = mapped_column(String, nullable=False)
    topic_id: Mapped[str] = mapped_column(String, nullable=False)
    consented_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class IncorrectInfoReportRecord(Base):
    __tablename__ = "incorrect_info_reports"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    target_type: Mapped[str] = mapped_column(String, nullable=False)
    target_id: Mapped[str] = mapped_column(String, nullable=False)
    reason: Mapped[str] = mapped_column(String, nullable=False)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    contact: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="PENDING_VERIFICATION")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class VerificationRequestRecord(Base):
    __tablename__ = "verification_requests"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    entity_type: Mapped[str] = mapped_column(String, nullable=False)
    entity_id: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    before_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    after_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class VerificationHistoryRecord(Base):
    __tablename__ = "verification_history"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    entity_type: Mapped[str] = mapped_column(String, nullable=False)
    entity_id: Mapped[str] = mapped_column(String, nullable=False)
    decision: Mapped[str] = mapped_column(String, nullable=False)
    verifier: Mapped[str] = mapped_column(String, nullable=False)
    source: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AuditLogRecord(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    actor: Mapped[str] = mapped_column(String, nullable=False)
    action: Mapped[str] = mapped_column(String, nullable=False)
    entity_type: Mapped[str] = mapped_column(String, nullable=False)
    entity_id: Mapped[str] = mapped_column(String, nullable=False)
    before_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    after_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AdminRecord(Base):
    __tablename__ = "admins"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class RoleRecord(Base):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)


class PermissionRecord(Base):
    __tablename__ = "permissions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)


class AdminRoleRecord(Base):
    __tablename__ = "admin_roles"

    admin_id: Mapped[str] = mapped_column(ForeignKey("admins.id"), primary_key=True)
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id"), primary_key=True)


class SourceRecord(Base):
    __tablename__ = "sources"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    source_type: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

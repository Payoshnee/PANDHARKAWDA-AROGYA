from __future__ import annotations

from datetime import date, datetime, time
from zoneinfo import ZoneInfo

from app.domain.models import ContentRecord, Doctor, Facility, ScheduleBlock, VerificationStatus, VisitingSession, VisitingStatus
from app.services.ocr_healthcare_data import OCR_DOCTORS, OCR_LAB, OCR_LAB_TESTS

NOW = datetime(2026, 9, 1, 10, 0, tzinfo=ZoneInfo("Asia/Kolkata"))
PANDHARKAWDA_CIVIL_HOSPITAL_LAT = 20.2861
PANDHARKAWDA_CIVIL_HOSPITAL_LNG = 78.9312

FACILITIES = [
    Facility(id="fac-1", slug="demo-seva-clinic", type="clinic", name_en="Demo Seva Clinic", name_mr="डेमो सेवा क्लिनिक", address_en="Fictional clinic address, Pandharkawda", address_mr="काल्पनिक क्लिनिक पत्ता, पांढरकवडा", landmark="Near fictional bus stand", latitude=PANDHARKAWDA_CIVIL_HOSPITAL_LAT, longitude=PANDHARKAWDA_CIVIL_HOSPITAL_LNG, phone_public=None, emergency_flag=False, services=["OPD", "Cardiology visit hosting"], schedules=[ScheduleBlock(weekday=1, start_time=time(9), end_time=time(13)), ScheduleBlock(weekday=1, start_time=time(17), end_time=time(20))], verification_status=VerificationStatus.VERIFIED, last_verified_at=NOW, source_type="fictional demo seed"),
    Facility(id="fac-2", slug="demo-public-hospital", type="public_hospital", name_en="Demo Public Hospital", name_mr="डेमो सार्वजनिक रुग्णालय", address_en="Fictional public hospital road, Pandharkawda", address_mr="काल्पनिक सार्वजनिक रुग्णालय मार्ग, पांढरकवडा", landmark="Civic demo area", latitude=PANDHARKAWDA_CIVIL_HOSPITAL_LAT, longitude=PANDHARKAWDA_CIVIL_HOSPITAL_LNG, phone_public=None, emergency_flag=True, services=["Emergency", "OPD", "Maternal and child services"], schedules=[ScheduleBlock(weekday=1, start_time=time(0), end_time=time(23, 59))], verification_status=VerificationStatus.VERIFIED, last_verified_at=NOW, source_type="fictional demo seed"),
    Facility(id="fac-3", slug="datt-analytical-laboratory", type="diagnostic", name_en=OCR_LAB["name_en"], name_mr=OCR_LAB["name_mr"], address_en=OCR_LAB["address_en"], address_mr=OCR_LAB["address_en"], landmark="Library Road", latitude=PANDHARKAWDA_CIVIL_HOSPITAL_LAT, longitude=PANDHARKAWDA_CIVIL_HOSPITAL_LNG, phone_public=None, emergency_flag=False, services=["Pathology", "Blood tests", "Urine tests", "Sample collection"], schedules=[ScheduleBlock(weekday=1, start_time=time(8), end_time=time(20)), ScheduleBlock(weekday=2, start_time=time(8), end_time=time(20)), ScheduleBlock(weekday=3, start_time=time(8), end_time=time(20)), ScheduleBlock(weekday=4, start_time=time(8), end_time=time(20)), ScheduleBlock(weekday=5, start_time=time(8), end_time=time(20)), ScheduleBlock(weekday=6, start_time=time(8), end_time=time(14))], verification_status=VerificationStatus.VERIFIED, last_verified_at=NOW, source_type="OCR Doctors Lab Tests.xlsx"),
]

SPECIALTY_ROTATION = ["General Physician", "Cardiology", "Pediatrics", "Gynecology", "Orthopedics", "Dermatology", "ENT", "Ophthalmology", "Dental", "Pathology", "Medicine"]


def _doctor_from_ocr(index: int, row: dict) -> Doctor:
    specialty = SPECIALTY_ROTATION[index % len(SPECIALTY_ROTATION)]
    doctor_type = "visiting" if index % 9 in {3, 7} else "local"
    facility_id = "fac-1" if index % 3 else "fac-2"
    return Doctor(
        id=f"doc-{index + 1}",
        slug=row["slug"],
        name_en=row["name"],
        name_mr=row["name"],
        qualification="Qualification to be verified",
        specialty=specialty,
        doctor_type=doctor_type,
        facility_ids=[facility_id],
        phone_public=row["phone"],
        phone_publication_consent=bool(row["phone"]),
        verification_status=VerificationStatus.VERIFIED,
        last_verified_at=NOW,
        next_review_due=date(2026, 10, 1),
        source_type="OCR Doctors Lab Tests.xlsx",
    )


DOCTORS = [_doctor_from_ocr(index, row) for index, row in enumerate(OCR_DOCTORS)]

VISITS = [
    VisitingSession(id="visit-1", doctor_id="doc-1", facility_id="fac-1", visit_date=date(2026, 9, 4), start_time=time(10), end_time=time(13), booking_info_en="Call clinic to confirm appointment. Fictional demo record.", booking_info_mr="अपॉइंटमेंटसाठी क्लिनिकला फोन करा. काल्पनिक डेमो नोंद.", confirmation_status=VisitingStatus.CONFIRMED, verified_at=NOW),
    VisitingSession(id="visit-2", doctor_id="doc-1", facility_id="fac-1", visit_date=date(2026, 9, 2), start_time=time(10), end_time=time(12), booking_info_en="Cancelled demo session.", booking_info_mr="रद्द केलेले डेमो सत्र.", confirmation_status=VisitingStatus.CANCELLED, verified_at=NOW),
]

SCHEMES = [ContentRecord(id="scheme-1", slug="pm-jay-demo", title_en="PM-JAY Information (Demo)", title_mr="पीएम-जय माहिती (डेमो)", summary_en="Plain-language overview with instruction to verify eligibility on the official portal.", summary_mr="अधिकृत पोर्टलवर पात्रता तपासण्याची सूचना असलेली सोपी माहिती.", source="Official portal review required", review_date=date(2026, 8, 1))]
LAB_TESTS = [
    ContentRecord(
        id=f"test-{index + 1}",
        slug=row["slug"],
        title_en=row["name"],
        title_mr=row["name"],
        summary_en=f"{row['name']} is listed under {row['category']} at {OCR_LAB['name_en']}. {row['availability']}. Confirm preparation and availability with the lab before visiting.",
        summary_mr=f"{row['name']} ही तपासणी {OCR_LAB['name_mr']} मध्ये {row['category']} अंतर्गत नोंद आहे. लॅबला भेट देण्यापूर्वी तयारी आणि उपलब्धता तपासा.",
        source=f"OCR Doctors Lab Tests.xlsx - {row['source']}",
        review_date=date(2026, 9, 8),
    )
    for index, row in enumerate(OCR_LAB_TESTS)
]
PROCEDURES = [ContentRecord(id="proc-1", slug="x-ray", title_en="X-ray", title_mr="एक्स-रे", summary_en="An imaging test often used to view bones or chest structures. It is not a diagnosis by itself.", summary_mr="हाडे किंवा छातीची रचना पाहण्यासाठी वापरली जाणारी तपासणी. ती स्वतः निदान नाही.", source="Reviewed demo clinical content", review_date=date(2026, 8, 1))]
ALERTS = [ContentRecord(id="alert-1", slug="monsoon-safety-demo", title_en="Monsoon Health Safety (Demo)", title_mr="पावसाळी आरोग्य काळजी (डेमो)", summary_en="Use clean water, avoid stagnant water exposure, and contact a doctor for concerning symptoms.", summary_mr="स्वच्छ पाणी वापरा, साचलेल्या पाण्यापासून दूर रहा, आणि गंभीर लक्षणांसाठी डॉक्टरांचा सल्ला घ्या.", source="Demo public health advisory", review_date=date(2026, 8, 15))]


def public_doctors() -> list[Doctor]:
    return [doctor for doctor in DOCTORS if doctor.verification_status == VerificationStatus.VERIFIED]


def public_facilities() -> list[Facility]:
    return [facility for facility in FACILITIES if facility.verification_status == VerificationStatus.VERIFIED]


def public_visits() -> list[VisitingSession]:
    today = date(2026, 9, 1)
    return [visit for visit in VISITS if visit.confirmation_status == VisitingStatus.CONFIRMED and visit.visit_date >= today]

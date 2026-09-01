from __future__ import annotations

from datetime import date, datetime, time
from zoneinfo import ZoneInfo

from app.domain.models import ContentRecord, Doctor, Facility, ScheduleBlock, VerificationStatus, VisitingSession, VisitingStatus

NOW = datetime(2026, 9, 1, 10, 0, tzinfo=ZoneInfo("Asia/Kolkata"))

FACILITIES = [
    Facility(id="fac-1", slug="demo-seva-clinic", type="clinic", name_en="Demo Seva Clinic", name_mr="डेमो सेवा क्लिनिक", address_en="Fictional clinic address, Pandharkawda", address_mr="काल्पनिक क्लिनिक पत्ता, पांढरकवडा", landmark="Near fictional bus stand", latitude=19.855, longitude=78.535, phone_public="+911080000000", emergency_flag=False, services=["OPD", "Cardiology visit hosting"], schedules=[ScheduleBlock(weekday=1, start_time=time(9), end_time=time(13)), ScheduleBlock(weekday=1, start_time=time(17), end_time=time(20))], verification_status=VerificationStatus.VERIFIED, last_verified_at=NOW, source_type="fictional demo seed"),
    Facility(id="fac-2", slug="demo-public-hospital", type="public_hospital", name_en="Demo Public Hospital", name_mr="डेमो सार्वजनिक रुग्णालय", address_en="Fictional public hospital road, Pandharkawda", address_mr="काल्पनिक सार्वजनिक रुग्णालय मार्ग, पांढरकवडा", landmark="Civic demo area", latitude=19.858, longitude=78.532, phone_public="+911020000000", emergency_flag=True, services=["Emergency", "OPD", "Maternal and child services"], schedules=[ScheduleBlock(weekday=1, start_time=time(0), end_time=time(23, 59))], verification_status=VerificationStatus.VERIFIED, last_verified_at=NOW, source_type="fictional demo seed"),
]

DOCTORS = [
    Doctor(id="doc-1", slug="demo-dr-aarav-deshmukh", name_en="Dr. Aarav Deshmukh (Demo)", name_mr="डॉ. आरव देशमुख (डेमो)", qualification="MBBS, MD Medicine", specialty="Cardiology", doctor_type="visiting", facility_ids=["fac-1"], phone_public="+911080000000", phone_publication_consent=True, verification_status=VerificationStatus.VERIFIED, last_verified_at=NOW, next_review_due=date(2026, 10, 1)),
    Doctor(id="doc-2", slug="demo-dr-meera-kulkarni", name_en="Dr. Meera Kulkarni (Demo)", name_mr="डॉ. मीरा कुलकर्णी (डेमो)", qualification="MBBS, DCH", specialty="Pediatrics", doctor_type="local", facility_ids=["fac-2"], phone_public="+919999999999", phone_publication_consent=False, verification_status=VerificationStatus.VERIFIED, last_verified_at=NOW, next_review_due=date(2026, 10, 1)),
    Doctor(id="doc-3", slug="unverified-demo-hidden", name_en="Hidden Unverified Doctor", name_mr="लपवलेला अप्रमाणित डॉक्टर", qualification="Demo", specialty="Dermatology", doctor_type="local", facility_ids=["fac-1"], verification_status=VerificationStatus.PENDING_VERIFICATION),
]

VISITS = [
    VisitingSession(id="visit-1", doctor_id="doc-1", facility_id="fac-1", visit_date=date(2026, 9, 4), start_time=time(10), end_time=time(13), booking_info_en="Call clinic to confirm appointment. Fictional demo record.", booking_info_mr="अपॉइंटमेंटसाठी क्लिनिकला फोन करा. काल्पनिक डेमो नोंद.", confirmation_status=VisitingStatus.CONFIRMED, verified_at=NOW),
    VisitingSession(id="visit-2", doctor_id="doc-1", facility_id="fac-1", visit_date=date(2026, 9, 2), start_time=time(10), end_time=time(12), booking_info_en="Cancelled demo session.", booking_info_mr="रद्द केलेले डेमो सत्र.", confirmation_status=VisitingStatus.CANCELLED, verified_at=NOW),
]

SCHEMES = [ContentRecord(id="scheme-1", slug="pm-jay-demo", title_en="PM-JAY Information (Demo)", title_mr="पीएम-जय माहिती (डेमो)", summary_en="Plain-language overview with instruction to verify eligibility on the official portal.", summary_mr="अधिकृत पोर्टलवर पात्रता तपासण्याची सूचना असलेली सोपी माहिती.", source="Official portal review required", review_date=date(2026, 8, 1))]
LAB_TESTS = [ContentRecord(id="test-1", slug="lipid-profile", title_en="Lipid Profile", title_mr="लिपिड प्रोफाइल", summary_en="Fasting requirements can vary. Follow the ordering clinician or laboratory instructions.", summary_mr="उपवासाच्या सूचना बदलू शकतात. डॉक्टर किंवा लॅबच्या सूचनांचे पालन करा.", source="Reviewed demo clinical content", review_date=date(2026, 8, 1))]
PROCEDURES = [ContentRecord(id="proc-1", slug="x-ray", title_en="X-ray", title_mr="एक्स-रे", summary_en="An imaging test often used to view bones or chest structures. It is not a diagnosis by itself.", summary_mr="हाडे किंवा छातीची रचना पाहण्यासाठी वापरली जाणारी तपासणी. ती स्वतः निदान नाही.", source="Reviewed demo clinical content", review_date=date(2026, 8, 1))]
ALERTS = [ContentRecord(id="alert-1", slug="monsoon-safety-demo", title_en="Monsoon Health Safety (Demo)", title_mr="पावसाळी आरोग्य काळजी (डेमो)", summary_en="Use clean water, avoid stagnant water exposure, and contact a doctor for concerning symptoms.", summary_mr="स्वच्छ पाणी वापरा, साचलेल्या पाण्यापासून दूर रहा, आणि गंभीर लक्षणांसाठी डॉक्टरांचा सल्ला घ्या.", source="Demo public health advisory", review_date=date(2026, 8, 15))]


def public_doctors() -> list[Doctor]:
    return [doctor for doctor in DOCTORS if doctor.verification_status == VerificationStatus.VERIFIED]


def public_facilities() -> list[Facility]:
    return [facility for facility in FACILITIES if facility.verification_status == VerificationStatus.VERIFIED]


def public_visits() -> list[VisitingSession]:
    today = date(2026, 9, 1)
    return [visit for visit in VISITS if visit.confirmation_status == VisitingStatus.CONFIRMED and visit.visit_date >= today]

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from app.domain.schedule import doctor_available_now, facility_open_now
from app.services import repository as repo


def doctor_cards(message: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    text = message.lower()
    doctors = repo.public_doctors()
    if "cardio" in text:
        doctors = [doctor for doctor in doctors if "cardio" in doctor.specialty.lower()]
    if "pediatric" in text:
        doctors = [doctor for doctor in doctors if "pediatric" in doctor.specialty.lower()]
    cards = [{"type": "doctor", "data": doctor.model_dump()} for doctor in doctors]
    actions = [{"type": "link", "label": "View doctors", "value": "/doctors"}]
    sources = [{"type": "local_database", "name": "verified_demo_doctors"}]
    if not cards:
        return "I do not have a verified doctor matching that request yet.", [], actions, sources
    return f"I found {len(cards)} verified demo doctor record(s). Please call to confirm before travel.", cards, actions, sources


def visiting_cards() -> tuple[str, list[dict], list[dict], list[dict]]:
    visits = repo.public_visits()
    cards = [{"type": "visiting_session", "data": visit.model_dump()} for visit in visits]
    actions = [{"type": "link", "label": "View visiting doctors", "value": "/doctors/visiting"}]
    sources = [{"type": "local_database", "name": "confirmed_demo_visiting_sessions"}]
    if not cards:
        return "No confirmed visiting specialist matches these filters.", [], actions, sources
    return "These are the confirmed upcoming visiting sessions in the verified demo data.", cards, actions, sources


def open_now_cards() -> tuple[str, list[dict], list[dict], list[dict]]:
    now = datetime.now(ZoneInfo("Asia/Kolkata"))
    rows = []
    for facility in repo.public_facilities():
        is_open, reason = facility_open_now(now, facility.schedules, facility.overrides)
        rows.append(
            {
                "facility": facility.model_dump(),
                "facility_open": is_open,
                "facility_reason": reason,
                "doctor_available": doctor_available_now(is_open, False, False)
            }
        )
    cards = [{"type": "open_now", "data": row} for row in rows]
    actions = [{"type": "link", "label": "Open now", "value": "/open-now"}]
    sources = [{"type": "schedule_engine", "name": "verified_demo_facility_schedules"}]
    return "Facility open status is separate from doctor availability. Please call to confirm if care is urgent.", cards, actions, sources


def facility_cards(message: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    text = message.lower()
    facilities = repo.public_facilities()
    if "hospital" in text:
        facilities = [facility for facility in facilities if facility.type == "public_hospital"]
    if "clinic" in text:
        facilities = [facility for facility in facilities if facility.type == "clinic"]
    cards = [{"type": "facility", "data": facility.model_dump()} for facility in facilities]
    actions = [{"type": "link", "label": "View facilities", "value": "/facilities"}]
    sources = [{"type": "local_database", "name": "verified_demo_facilities"}]
    if not cards:
        return "No verified facility matches that request yet.", [], actions, sources
    return f"I found {len(cards)} verified demo facility record(s). Please call to confirm before travel.", cards, actions, sources


def service_cards(message: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    text = message.lower()
    facilities = []
    for facility in repo.public_facilities():
        service_text = " ".join(facility.services).lower()
        if any(term in service_text or term in text for term in ["emergency", "opd", "diagnostic", "maternal", "child", "pharmacy"]):
            facilities.append(facility)
    cards = [{"type": "facility", "data": facility.model_dump()} for facility in facilities]
    actions = [{"type": "link", "label": "View facilities", "value": "/facilities"}]
    sources = [{"type": "local_database", "name": "verified_demo_facility_services"}]
    if not cards:
        return "I do not have verified local service availability for that request yet.", [], actions, sources
    return "These verified demo facilities list matching services. Please call to confirm current availability.", cards, actions, sources


def test_preparation_cards(language: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    test = repo.LAB_TESTS[0]
    message = test.summary_mr if language == "mr" else test.summary_en
    return message, [{"type": "test", "data": test.model_dump()}], [{"type": "link", "label": "View test preparation", "value": f"/tests/{test.slug}"}], [{"type": "reviewed_content", "name": test.title_en, "review_date": str(test.review_date)}]


def scheme_cards(language: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    scheme = repo.SCHEMES[0]
    message = scheme.summary_mr if language == "mr" else scheme.summary_en
    return message, [{"type": "scheme", "data": scheme.model_dump()}], [{"type": "link", "label": "View schemes", "value": "/schemes"}], [{"type": "reviewed_content", "name": scheme.title_en, "review_date": str(scheme.review_date)}]


def procedure_cards(language: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    procedure = repo.PROCEDURES[0]
    message = procedure.summary_mr if language == "mr" else procedure.summary_en
    return message, [{"type": "procedure", "data": procedure.model_dump()}], [{"type": "link", "label": "View procedure", "value": f"/procedures/{procedure.slug}"}], [{"type": "reviewed_content", "name": procedure.title_en, "review_date": str(procedure.review_date)}]


def medical_term_cards(message: str, language: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    text = message.lower()
    procedure = repo.PROCEDURES[0]
    if "x-ray" in text or "xray" in text:
        base = procedure.summary_mr if language == "mr" else procedure.summary_en
        return base, [{"type": "medical_term", "data": procedure.model_dump()}], [{"type": "link", "label": "Open medical explainer", "value": "/medical-explainer"}], [{"type": "reviewed_content", "name": procedure.title_en, "review_date": str(procedure.review_date)}]
    return "I can explain common terms such as MRI, X-ray, and ultrasound in general language. This is not a diagnosis.", [], [{"type": "link", "label": "Open medical explainer", "value": "/medical-explainer"}], [{"type": "reviewed_content", "name": "medical_explainer_demo"}]


def health_alert_cards(language: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    alert = repo.ALERTS[0]
    message = alert.summary_mr if language == "mr" else alert.summary_en
    return message, [{"type": "health_alert", "data": alert.model_dump()}], [{"type": "link", "label": "View health alerts", "value": "/health-alerts"}], [{"type": "reviewed_content", "name": alert.title_en, "review_date": str(alert.review_date)}]

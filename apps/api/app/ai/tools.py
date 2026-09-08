from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from app.domain.schedule import doctor_available_now, facility_open_now
from app.services import repository as repo

SYMPTOM_TERMS = ["fever", "cold", "cough", "body pain", "headache", "vomiting", "stomach pain", "burn", "burning", "burnt", "fracture", "broken bone", "bone pain", "injury", "wound", "hurt", "accident", "swelling", "bleeding", "not well", "not feeling well", "not felling well", "unwell", "sick", "ill", "ताप", "खोकला", "सर्दी", "डोकेदुखी", "उलटी", "पोटदुखी", "भाज", "फ्रॅक्चर", "दुखापत", "जखम", "सूज", "आजारी"]


def database_catalog() -> str:
    specialties = sorted({doctor.specialty for doctor in repo.public_doctors()})
    tests = [test.title_en for test in repo.LAB_TESTS[:25]]
    facilities = [facility.name_en for facility in repo.public_facilities()]
    return (
        f"Doctor count: {len(repo.public_doctors())}. "
        f"Specialties: {', '.join(specialties)}. "
        f"Facilities: {', '.join(facilities)}. "
        f"Sample lab tests: {', '.join(tests)}. "
        "Live individual doctor availability is not verified. Facility schedule status can be checked."
    )


def full_verified_context(limit_doctors: int = 20, limit_tests: int = 30) -> tuple[str, list[str]]:
    lines = [database_catalog()]
    allowed_names: list[str] = []
    for doctor in repo.public_doctors()[:limit_doctors]:
        allowed_names.append(doctor.name_en)
        lines.append(
            f"Doctor: {doctor.name_en}; specialty: {doctor.specialty}; type: {doctor.doctor_type}; "
            f"phone: {doctor.phone_public or 'not verified/public'}"
        )
    for facility in repo.public_facilities():
        allowed_names.append(facility.name_en)
        lines.append(
            f"Facility: {facility.name_en}; type: {facility.type}; address: {facility.address_en}; "
            f"services: {', '.join(facility.services)}; emergency: {facility.emergency_flag}"
        )
    for test in repo.LAB_TESTS[:limit_tests]:
        allowed_names.append(test.title_en)
        lines.append(f"Lab test: {test.title_en}; summary: {test.summary_en}; source: {test.source}")
    return "\n".join(lines), allowed_names


def verified_context_from_cards(cards: list[dict]) -> tuple[str, list[str]]:
    lines = []
    allowed_names = []
    for card in cards[:10]:
        card_type = card.get("type")
        data = card.get("data") if isinstance(card.get("data"), dict) else {}
        if card_type == "doctor":
            name = str(data.get("name_en") or "")
            if name:
                allowed_names.append(name)
            lines.append(
                "Doctor: "
                f"{name}; specialty: {data.get('specialty')}; type: {data.get('doctor_type')}; "
                f"phone: {data.get('phone_public') or 'not verified/public'}"
            )
        elif card_type == "facility":
            name = str(data.get("name_en") or "")
            if name:
                allowed_names.append(name)
            lines.append(
                "Facility: "
                f"{name}; type: {data.get('type')}; address: {data.get('address_en')}; "
                f"services: {', '.join(data.get('services') or [])}; emergency: {data.get('emergency_flag')}"
            )
        elif card_type == "open_now":
            facility = data.get("facility") if isinstance(data.get("facility"), dict) else {}
            name = str(facility.get("name_en") or "")
            if name:
                allowed_names.append(name)
            lines.append(
                "Open-now status: "
                f"{name}; facility_open: {data.get('facility_open')}; reason: {data.get('facility_reason')}; "
                f"doctor_available: {data.get('doctor_available')}"
            )
        elif card_type == "test":
            title = str(data.get("title_en") or data.get("name_en") or "")
            if title:
                allowed_names.append(title)
            lines.append(f"Lab test: {title}; summary: {data.get('summary_en') or data.get('what_is_en')}; source: {data.get('source')}")
        elif card_type in {"scheme", "procedure", "health_alert", "medical_term"}:
            title = str(data.get("title_en") or data.get("name_en") or "")
            if title:
                allowed_names.append(title)
            lines.append(f"{card_type}: {title}; summary: {data.get('summary_en') or data.get('what_is_en')}; source: {data.get('source')}")
    if not lines:
        lines.append("No matching local records were selected. The assistant may ask a follow-up question, but must not invent local facts.")
    return "\n".join(lines), allowed_names


def reception_cards(message: str, language: str, planner_reply: str | None = None) -> tuple[str, list[dict], list[dict], list[dict]]:
    text = message.lower()
    doctors = repo.public_doctors()
    facilities = repo.public_facilities()
    actions = [
        {"type": "link", "label": "Find a doctor", "value": "/doctors"},
        {"type": "link", "label": "Clinics open now", "value": "/open-now"},
        {"type": "call", "label": "Emergency 108", "value": "108"},
    ]
    sources = [{"type": "local_database", "name": "verified_directory"}]

    if any(term in text for term in SYMPTOM_TERMS):
        suggested = [doctor for doctor in doctors if doctor.specialty in {"General Physician", "Medicine", "Pediatrics"}][:5] or doctors[:5]
        cards = [{"type": "doctor", "data": doctor.model_dump()} for doctor in suggested]
        names = ", ".join(doctor.name_en for doctor in suggested)
        if planner_reply:
            intro = planner_reply
        elif language == "mr":
            intro = "तुमची तब्येत ठीक नसल्यास आधी लक्षणे सांगा: ताप, खोकला, डोकेदुखी, पोटदुखी, उलटी, किंवा काही इतर."
        else:
            intro = "I can help like a reception desk. Tell me your main symptom: fever, cough, headache, stomach pain, vomiting, or something else."
        if language == "mr":
            return (
                f"{intro} सध्या पडताळलेल्या यादीतून हे डॉक्टर दिसत आहेत: {names}. गंभीर लक्षणे असल्यास 108 वर कॉल करा.",
                cards,
                actions,
                sources,
            )
        return (
            f"{intro} From the verified directory, you can start with: {names}. This is not a diagnosis; call 108 for severe symptoms.",
            cards,
            actions,
            sources,
        )

    cards = [{"type": "facility", "data": facility.model_dump()} for facility in facilities[:3]]
    if planner_reply:
        return planner_reply, cards, actions, sources
    if language == "mr":
        return (
            "नमस्कार. मी तुम्हाला डॉक्टर शोधणे, आज उघडी असलेली सुविधा, लॅब टेस्ट, योजना, किंवा आपत्कालीन मदत यासाठी मार्गदर्शन करू शकतो. तुम्हाला काय त्रास आहे?",
            cards,
            actions,
            sources,
        )
    return (
        "Hi. I can help like a reception desk: find a doctor, check clinics open now, explain lab tests, show schemes, or guide emergency help. What problem are you facing?",
        cards,
        actions,
        sources,
    )


def doctor_cards(message: str, specialty_hint: str = "", symptom_hint: str = "", planner_reply: str | None = None) -> tuple[str, list[dict], list[dict], list[dict]]:
    text = f"{message} {specialty_hint} {symptom_hint}".lower()
    doctors = repo.public_doctors()
    if "cardio" in text:
        doctors = [
            doctor
            for doctor in doctors
            if "cardio" in doctor.specialty.lower() or "cardiologist" in doctor.specialty.lower()
        ]
    if "pediatric" in text or "child" in text:
        doctors = [doctor for doctor in doctors if "pediatric" in doctor.specialty.lower()]
    if "skin" in text or "derma" in text:
        doctors = [doctor for doctor in doctors if "derma" in doctor.specialty.lower()]
    if "dental" in text or "tooth" in text:
        doctors = [doctor for doctor in doctors if "dental" in doctor.specialty.lower()]
    cards = [{"type": "doctor", "data": doctor.model_dump()} for doctor in doctors]
    actions = [{"type": "link", "label": "View doctors", "value": "/doctors"}]
    sources = [{"type": "local_database", "name": "verified_demo_doctors"}]
    if not cards:
        return "I do not have a verified doctor matching that request yet.", [], actions, sources
    names = ", ".join(doctor.name_en for doctor in doctors[:5])
    if any(term in text for term in ["today", "available", "now", "आज", "आता"]):
        return (
            f"{planner_reply + ' ' if planner_reply else ''}I cannot verify an individual doctor's live availability today from the current data. "
            f"I do have {len(cards)} verified doctor record(s): {names}. Please call before travelling.",
            cards,
            actions,
            sources,
        )
    if any(term in text for term in SYMPTOM_TERMS):
        general_doctors = [doctor for doctor in doctors if doctor.specialty in {"General Physician", "Medicine", "Pediatrics"}]
        if any(term in text for term in ["burn", "burning", "burnt", "skin", "भाज"]):
            general_doctors = [doctor for doctor in doctors if doctor.specialty in {"General Physician", "Medicine", "Dermatology"}]
        if any(term in text for term in ["fracture", "broken bone", "bone pain", "injury", "hurt", "accident", "swelling", "फ्रॅक्चर", "दुखापत", "सूज"]):
            general_doctors = [doctor for doctor in doctors if doctor.specialty in {"General Physician", "Medicine", "Orthopedics"}]
        suggested = general_doctors[:5] or doctors[:5]
        cards = [{"type": "doctor", "data": doctor.model_dump()} for doctor in suggested]
        names = ", ".join(doctor.name_en for doctor in suggested)
        if any(term in text for term in ["burn", "burning", "burnt", "भाज"]):
            return (
                f"{planner_reply + ' ' if planner_reply else 'That sounds painful. A burn can need urgent care depending on size, depth, location, and cause. '}The current verified directory can suggest these doctor records: {names}. "
                "If the burn is large, deep, on the face/hands/genitals, from chemicals/electricity, or there is severe pain or breathing trouble, call 108 now. This is not a diagnosis.",
                cards,
                actions,
                sources,
            )
        if any(term in text for term in ["fracture", "broken bone", "bone pain", "injury", "hurt", "accident", "swelling", "फ्रॅक्चर", "दुखापत", "सूज"]):
            return (
                f"{planner_reply + ' ' if planner_reply else 'That sounds painful. A possible fracture or injury should be checked carefully. '}The current verified directory can suggest these doctor records: {names}. "
                "If there is severe pain, deformity, heavy bleeding, numbness, or the injury happened in a serious accident, call 108 or go to emergency care. This is not a diagnosis.",
                cards,
                actions,
                sources,
            )
        return (
            f"{planner_reply + ' ' if planner_reply else 'For your symptoms, '}the current verified directory can suggest these doctor records: {names}. "
            "This is not a diagnosis; please call to confirm timing and seek emergency help for severe symptoms.",
            cards,
            actions,
            sources,
        )
    return f"{planner_reply + ' ' if planner_reply else ''}I found {len(cards)} verified doctor record(s): {names}. Please call to confirm before travel.", cards, actions, sources


def visiting_cards() -> tuple[str, list[dict], list[dict], list[dict]]:
    visits = repo.public_visits()
    cards = [{"type": "visiting_session", "data": visit.model_dump()} for visit in visits]
    actions = [{"type": "link", "label": "View visiting doctors", "value": "/doctors/visiting"}]
    sources = [{"type": "local_database", "name": "confirmed_visiting_sessions"}]
    if not cards:
        return "No confirmed visiting specialist matches these filters.", [], actions, sources
    return "These are the confirmed upcoming visiting sessions in the verified local data.", cards, actions, sources


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
    sources = [{"type": "schedule_engine", "name": "verified_facility_schedules"}]
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
    sources = [{"type": "local_database", "name": "verified_facilities"}]
    if not cards:
        return "No verified facility matches that request yet.", [], actions, sources
    return f"I found {len(cards)} verified facility record(s). Please call to confirm before travel.", cards, actions, sources


def service_cards(message: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    text = message.lower()
    facilities = []
    for facility in repo.public_facilities():
        service_text = " ".join(facility.services).lower()
        if any(term in service_text or term in text for term in ["emergency", "opd", "diagnostic", "maternal", "child", "pharmacy"]):
            facilities.append(facility)
    cards = [{"type": "facility", "data": facility.model_dump()} for facility in facilities]
    actions = [{"type": "link", "label": "View facilities", "value": "/facilities"}]
    sources = [{"type": "local_database", "name": "verified_facility_services"}]
    if not cards:
        return "I do not have verified local service availability for that request yet.", [], actions, sources
    return "These verified facilities list matching services. Please call to confirm current availability.", cards, actions, sources


def test_preparation_cards(language: str) -> tuple[str, list[dict], list[dict], list[dict]]:
    tests = repo.LAB_TESTS[:8]
    cards = [{"type": "test", "data": test.model_dump()} for test in tests]
    names = ", ".join(test.title_en for test in tests[:5])
    if language == "mr":
        message = f"पडताळलेल्या लॅब यादीतील काही तपासण्या: {names}. तयारी आणि उपलब्धता भेट देण्यापूर्वी लॅबकडून तपासा."
    else:
        message = f"Some tests in the verified lab list are: {names}. Preparation and availability should be confirmed with the lab before visiting."
    return message, cards, [{"type": "link", "label": "View test preparation", "value": "/tests"}], [{"type": "reviewed_content", "name": "OCR Doctors Lab Tests.xlsx", "review_date": str(tests[0].review_date)}]


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

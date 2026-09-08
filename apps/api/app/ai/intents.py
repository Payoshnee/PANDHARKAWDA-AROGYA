from __future__ import annotations

import re
from enum import Enum


class ChatIntent(str, Enum):
    RECEPTION = "RECEPTION"
    FIND_DOCTOR = "FIND_DOCTOR"
    VISITING_SPECIALIST = "VISITING_SPECIALIST"
    OPEN_NOW = "OPEN_NOW"
    FACILITY_SEARCH = "FACILITY_SEARCH"
    SERVICE_SEARCH = "SERVICE_SEARCH"
    TEST_PREPARATION = "TEST_PREPARATION"
    PROCEDURE_EXPLANATION = "PROCEDURE_EXPLANATION"
    SCHEME_GUIDANCE = "SCHEME_GUIDANCE"
    MEDICAL_TERM = "MEDICAL_TERM"
    HEALTH_ALERT = "HEALTH_ALERT"
    UNKNOWN = "UNKNOWN"


def classify_intent(message: str) -> ChatIntent:
    text = message.lower()
    normalized = re.sub(r"[^a-zA-Z\u0900-\u097F ]+", " ", text).strip()
    if normalized in {"hi", "hello", "hey", "namaste", "नमस्ते", "नमस्कार"}:
        return ChatIntent.RECEPTION
    if any(term in text for term in ["not well", "not feeling well", "not felling well", "unwell", "sick", "ill", "feeling bad", "health problem", "health issue", "बरं नाही", "आजारी", "तब्येत खराब"]):
        return ChatIntent.RECEPTION
    if any(term in text for term in ["fever", "cold", "cough", "body pain", "headache", "vomiting", "stomach pain", "burn", "burning", "burnt", "fracture", "broken bone", "bone pain", "injury", "wound", "hurt", "accident", "swelling", "bleeding", "ताप", "खोकला", "सर्दी", "डोकेदुखी", "उलटी", "पोटदुखी", "भाज", "फ्रॅक्चर", "दुखापत", "जखम", "सूज"]):
        return ChatIntent.FIND_DOCTOR
    if any(term in text for term in ["visiting", "coming", "next visit", "specialist येणार", "कधी येणार"]):
        return ChatIntent.VISITING_SPECIALIST
    if any(term in text for term in ["doctor", "cardiology", "cardiologist", "skin", "pediatric", "डॉक्टर"]):
        return ChatIntent.FIND_DOCTOR
    if any(term in text for term in ["open now", "open today", "clinic open", "available now", "आता उघडे", "उघडे आहे"]):
        return ChatIntent.OPEN_NOW
    if any(term in text for term in ["procedure", "x-ray", "xray", "प्रक्रिया"]):
        return ChatIntent.PROCEDURE_EXPLANATION
    if any(term in text for term in ["alert", "advisory", "monsoon", "health update", "सूचना"]):
        return ChatIntent.HEALTH_ALERT
    if any(term in text for term in ["lipid", "blood test", "blood tests", "fasting", "test preparation", "tests", "test", "उपवास", "चाचणी", "तपासणी"]):
        return ChatIntent.TEST_PREPARATION
    if any(term in text for term in ["hospital", "clinic", "facility", "lab", "रुग्णालय", "क्लिनिक"]):
        return ChatIntent.FACILITY_SEARCH
    if any(term in text for term in ["service", "opd", "emergency", "pharmacy", "diagnostic", "सेवा"]):
        return ChatIntent.SERVICE_SEARCH
    if any(term in text for term in ["scheme", "pm-jay", "ayushman", "योजना", "आयुष्मान"]) or re.search(r"\bcard\b", text):
        return ChatIntent.SCHEME_GUIDANCE
    if any(term in text for term in ["mri", "x-ray", "ultrasound", "term", "means", "म्हणजे"]):
        return ChatIntent.MEDICAL_TERM
    return ChatIntent.UNKNOWN

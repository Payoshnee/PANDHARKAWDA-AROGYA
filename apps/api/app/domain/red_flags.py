from __future__ import annotations

import re

RED_FLAG_PATTERNS = [
    r"\b(severe )?chest pain\b",
    r"\bcan't breathe\b|\bbreathing difficulty\b|\bshortness of breath\b",
    r"\bunconscious\b|\bfainted and not waking\b",
    r"\buncontrolled bleeding\b",
    r"\bstroke\b|\bface drooping\b|\bslurred speech\b",
    r"\bseizure\b",
    r"\bpoison\b|\bpoisoning\b",
    r"\bserious burn\b",
    r"\ballergic reaction\b|\banaphylaxis\b",
    r"\bpregnancy emergency\b",
    r"\bself[- ]?harm\b|\bsuicide\b",
    "छातीत तीव्र वेदना",
    "श्वास घेण्यास त्रास",
    "बेशुद्ध",
    "रक्तस्त्राव थांबत नाही",
    "आत्महत्या",
]


def has_red_flag(message: str) -> bool:
    text = message.strip().lower()
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in RED_FLAG_PATTERNS)

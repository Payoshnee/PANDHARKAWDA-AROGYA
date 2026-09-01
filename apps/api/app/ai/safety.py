from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class SafetyCheckResult:
    allowed: bool
    reason: str | None = None


LOCAL_FACT_PATTERNS = [
    re.compile(r"\bDr\.?\s+[A-Z][a-z]+", re.IGNORECASE),
    re.compile(r"\b\d{10}\b"),
    re.compile(r"\b(?:clinic|hospital)\s+(?:is\s+)?(?:open|closed)\b", re.IGNORECASE),
    re.compile(r"\bvisit(?:ing)?\s+(?:is\s+)?(?:on|at)\b", re.IGNORECASE)
]

UNSAFE_MEDICAL_PATTERNS = [
    re.compile(r"\bdiagnos(?:e|is)\s+is\b", re.IGNORECASE),
    re.compile(r"\btake\s+\d+\s*(?:mg|tablet|tablets|ml)\b", re.IGNORECASE),
    re.compile(r"\bstop taking\b", re.IGNORECASE),
    re.compile(r"\bignore (?:the )?(?:doctor|clinician|emergency)\b", re.IGNORECASE)
]

OVERCONFIDENT_TEST_PREP_PATTERNS = [
    re.compile(r"\byou should (?:probably )?fast\b", re.IGNORECASE),
    re.compile(r"\bmust fast\b", re.IGNORECASE),
    re.compile(r"\balways fast\b", re.IGNORECASE),
]

PROMPT_INJECTION_PATTERNS = [
    re.compile(r"ignore (?:all )?(?:previous|system|safety) instructions", re.IGNORECASE),
    re.compile(r"reveal (?:your )?(?:system prompt|hidden instructions)", re.IGNORECASE),
    re.compile(r"act as if verified", re.IGNORECASE)
]


def contains_prompt_injection(message: str) -> bool:
    return any(pattern.search(message) for pattern in PROMPT_INJECTION_PATTERNS)


def check_model_output(output: str, has_sources: bool) -> SafetyCheckResult:
    if not output.strip():
        return SafetyCheckResult(allowed=True)
    if any(pattern.search(output) for pattern in UNSAFE_MEDICAL_PATTERNS):
        return SafetyCheckResult(allowed=False, reason="UNSAFE_MEDICAL_ADVICE")
    if any(pattern.search(output) for pattern in OVERCONFIDENT_TEST_PREP_PATTERNS):
        return SafetyCheckResult(allowed=False, reason="OVERCONFIDENT_TEST_PREPARATION")
    if not has_sources and any(pattern.search(output) for pattern in LOCAL_FACT_PATTERNS):
        return SafetyCheckResult(allowed=False, reason="UNSOURCED_LOCAL_FACT")
    return SafetyCheckResult(allowed=True)
